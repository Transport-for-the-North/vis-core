import { isBaseLabelLayer, applyLabelPolicyToStyle } from "./baseMapLabels";

/**
 * Pure transformation that merges a new base-map style with application sources and layers
 * from a previous style.
 *
 * Responsibilities:
 * 1. Identify previous application sources (those not in previousBaseSourceIds).
 * 2. Preserve application sources.
 * 3. Preserve application layers (those belonging to application sources).
 * 4. Drop old base sources and layers.
 * 5. Use incoming base sources and layers.
 * 6. Apply descriptor label paint to incoming base labels.
 * 7. Reorder labels above application layers when placement is "above-application".
 * 8. Preserve every incoming label's layout object by identity.
 * 9. Mutate neither input.
 *
 * @param {Object} params
 * @param {Object} [params.previousStyle={}] - The style currently loaded on the map.
 * @param {Object} [params.incomingStyle={}] - The new base-map style spec.
 * @param {Set<string>} [params.previousBaseSourceIds=new Set()] - Source IDs of the previous base.
 * @param {Object} params.descriptor - The target base-map descriptor.
 * @returns {Object} The merged style spec.
 */
export function mergeBaseMapStyle({
  previousStyle = {},
  incomingStyle = {},
  previousBaseSourceIds = new Set(),
  descriptor,
}) {
  const incomingBaseSourceIds = new Set(
    Object.keys(incomingStyle.sources ?? {})
  );

  // Collect application (non-base) sources from the previous style.
  const applicationSources = Object.fromEntries(
    Object.entries(previousStyle.sources ?? {}).filter(
      ([sourceId]) => !previousBaseSourceIds.has(sourceId)
    )
  );

  // Collect application layers (layers whose source is not a base source).
  const applicationLayers = (previousStyle.layers ?? []).filter(
    (layer) => layer.source && !previousBaseSourceIds.has(layer.source)
  );

  // Apply label paint policy to the incoming base layers.
  const incomingLayers = applyLabelPolicyToStyle({
    style: incomingStyle,
    descriptor,
    baseSourceIds: incomingBaseSourceIds,
  });

  // When placement is not "above-application", stack application layers on top.
  if (descriptor.labels?.placement !== "above-application") {
    return {
      ...incomingStyle,
      sources: {
        ...incomingStyle.sources,
        ...applicationSources,
      },
      layers: [
        ...incomingLayers,
        ...applicationLayers,
      ],
    };
  }

  // Separate base tile layers from base label layers so labels can be
  // interleaved above application layers.
  const baseLayers = [];
  const labelLayers = [];

  incomingLayers.forEach((layer) => {
    if (
      isBaseLabelLayer({
        layer,
        descriptor,
        baseSourceIds: incomingBaseSourceIds,
      })
    ) {
      labelLayers.push(layer);
    } else {
      baseLayers.push(layer);
    }
  });

  return {
    ...incomingStyle,
    sources: {
      ...incomingStyle.sources,
      ...applicationSources,
    },
    layers: [
      ...baseLayers,
      ...applicationLayers,
      ...labelLayers,
    ],
  };
}
