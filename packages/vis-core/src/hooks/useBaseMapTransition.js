import { useEffect, useRef } from "react";
import { mergeBaseMapStyle } from "../map/mergeBaseMapStyle";
import { applyLabelPolicyToMap } from "../map/baseMapLabels";
import { restoreMapRuntimeState } from "../map/runtimeRestorationRegistry";
import { getInitialBaseSources } from "../map/baseSources";
import { applyApplicationTheme } from "../map/applicationLayerTheme";

/**
 * Shared transition coordinator for base-map style switches.
 *
 * Owns the entire transition lifecycle for one or more map instances:
 * - First-render suppression (the initial style is set by the map constructor)
 * - Style resolution from the descriptor
 * - Generation tracking (stale-callback protection on rapid toggles)
 * - Per-map base-source tracking via a WeakMap
 * - `setStyle` with `transformStyle` for application-layer preservation
 * - Post-load label policy application
 * - Post-load application-layer theme application
 * - Post-load runtime-state restoration
 * - Repaint after load
 *
 * @param {Object} params
 * @param {Array<maplibregl.Map|null>} params.maps - One or more MapLibre map instances.
 *   Single map: [map]. Dual maps: [leftMap, rightMap].
 * @param {Object} params.descriptor - The target base-map descriptor from baseMaps.js.
 * @param {Object} [params.applicationLayers] - Dictionary of application layers from state.layers.
 * @param {Function} [params.onBaseSourcesChanged] - Optional callback invoked when the
 *   incoming base source IDs have been captured for a map.
 */
export function useBaseMapTransition({
  maps,
  descriptor,
  applicationLayers,
  onBaseSourcesChanged,
}) {
  // Track the descriptor ID that is currently applied on the map instances.
  // Initialised to the incoming descriptor so that the initial render (where the map
  // constructor already applied the initial style) does not trigger setStyle.
  const lastDescriptorIdRef = useRef(descriptor?.id);

  // Monotonically increasing generation counter. Any async callback that reads
  // a stale generation is ignored, preventing rapid-toggle races.
  const generationRef = useRef(0);

  // Per-map base-source ownership, keyed by map instance.
  // WeakMap entries are garbage-collected when a map is removed, and left/right
  // maps in a dual-map setup always have independent source sets.
  const baseSourcesByMap = useRef(new WeakMap());

  // Keep latest application layers in a ref so layer-state updates do not trigger transition re-runs.
  const applicationLayersRef = useRef(applicationLayers);
  useEffect(() => {
    applicationLayersRef.current = applicationLayers;
  }, [applicationLayers]);

  useEffect(() => {
    const activeMaps = (maps ?? []).filter(Boolean);

    if (activeMaps.length === 0 || !descriptor) return undefined;

    // Suppress setStyle if the descriptor has not changed since the last apply.
    // When map instances first become available or on page change, the MapLibre
    // constructor already applied this initial style. However, we must ensure
    // the descriptor's post-load label policy is applied to the initial style once loaded.
    if (lastDescriptorIdRef.current === descriptor.id) {
      const cleanups = [];
      activeMaps.forEach((map) => {
        const applyPolicy = () => {
          const baseSourceIds =
            baseSourcesByMap.current.get(map) ??
            getInitialBaseSources(map) ??
            new Set();

          applyLabelPolicyToMap({
            map,
            descriptor,
            baseSourceIds,
          });

          applyApplicationTheme({
            map,
            layers: applicationLayersRef.current,
            theme: descriptor.theme,
          });

          map.triggerRepaint?.();
        };

        if (map.isStyleLoaded?.()) {
          applyPolicy();
        } else {
          map.once?.("style.load", applyPolicy);
          cleanups.push(() => {
            map.off?.("style.load", applyPolicy);
          });
        }
      });

      return () => {
        cleanups.forEach((fn) => fn());
      };
    }

    lastDescriptorIdRef.current = descriptor.id;

    const generation = ++generationRef.current;
    const isStale = () => generation !== generationRef.current;

    const styleUrl = descriptor.resolveStyle();

    const cleanups = activeMaps.map((map) => {
      const handleStyleLoad = async () => {
        if (isStale()) return;

        const currentBaseSourceIds =
          baseSourcesByMap.current.get(map) ??
          getInitialBaseSources(map) ??
          new Set();

        applyLabelPolicyToMap({
          map,
          descriptor,
          baseSourceIds: currentBaseSourceIds,
        });

        applyApplicationTheme({
          map,
          layers: applicationLayersRef.current,
          theme: descriptor.theme,
        });

        await restoreMapRuntimeState({ map, isCancelled: isStale });

        if (isStale()) return;

        map.triggerRepaint?.();
      };

      // Register before setStyle so a fast cache-hit cannot fire before the listener.
      map.once?.("style.load", handleStyleLoad);

      map.setStyle(styleUrl, {
        transformStyle: (previousStyle, incomingStyle) => {
          const previousBaseSourceIds =
            baseSourcesByMap.current.get(map) ??
            getInitialBaseSources(map) ??
            new Set();

          const incomingBaseSourceIds = new Set(
            Object.keys(incomingStyle.sources ?? {})
          );

          baseSourcesByMap.current.set(map, incomingBaseSourceIds);
          onBaseSourcesChanged?.(map, incomingBaseSourceIds);

          return mergeBaseMapStyle({
            previousStyle,
            incomingStyle,
            previousBaseSourceIds,
            descriptor,
          });
        },
      });

      return () => {
        map.off?.("style.load", handleStyleLoad);
      };
    });

    return () => {
      generationRef.current += 1;
      cleanups.forEach((fn) => fn());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptor?.id, maps]);
}
