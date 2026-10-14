/**
 * Pure helpers for base-map label policy.
 *
 * Supports declarative paint and layout overrides for base symbol layers.
 * These functions are stateless and perform no map operations or dispatches.
 * All live-map work is done by the transition coordinator.
 */

/**
 * Checks whether a layer is a base label layer according to the descriptor's policy.
 *
 * A layer qualifies if it is:
 * 1. A symbol layer
 * 2. Sourced from a known base source
 * 3. Matched by the descriptor's configured layerIds, layerPrefixes, or custom matcher
 *
 * @param {Object} params
 * @param {Object} params.layer - A MapLibre layer spec.
 * @param {Object} params.descriptor - A base-map descriptor from baseMaps.js.
 * @param {Set<string>} params.baseSourceIds - Set of source IDs belonging to the base style.
 * @returns {boolean}
 */
export function isBaseLabelLayer({ layer, descriptor, baseSourceIds }) {
  if (layer?.type !== "symbol") return false;
  if (!layer.source) return false;
  if (!baseSourceIds.has(layer.source)) return false;

  const labels = descriptor.labels;
  if (!labels) return false;

  return (
    labels.layerIds?.includes(layer.id) ||
    labels.layerPrefixes?.some((prefix) => layer.id.startsWith(prefix)) ||
    labels.matches?.(layer) === true
  );
}

/**
 * Returns the paint overrides for a base label layer, or null if the descriptor
 * policy is "provider" (no overrides).
 *
 * @param {Object} descriptor - A base-map descriptor.
 * @param {string} layerId - The layer ID.
 * @returns {Object|null}
 */
export function getLabelPaintOverride(descriptor, layerId) {
  const policy = descriptor.labels?.paint;

  if (!policy || policy === "provider") {
    return null;
  }

  return {
    ...policy.default,
    ...policy.byLayerId?.[layerId],
  };
}

/**
 * Returns the layout overrides for a base label layer, or null if the descriptor
 * policy is "provider" (or undefined/missing).
 *
 * @param {Object} descriptor - A base-map descriptor.
 * @param {string} layerId - The layer ID.
 * @returns {Object|null}
 */
export function getLabelLayoutOverride(descriptor, layerId) {
  const policy = descriptor.labels?.layout;

  if (!policy || policy === "provider") {
    return null;
  }

  return {
    ...policy.default,
    ...policy.byLayerId?.[layerId],
  };
}

/**
 * Applies the descriptor's label paint and layout policies to the layers of an incoming style spec.
 * Returns a new layers array with overrides merged. When no layout policy is configured (or set to
 * "provider"), layout objects are preserved by reference identity.
 *
 * @param {Object} params
 * @param {Object} params.style - The incoming base-map style spec.
 * @param {Object} params.descriptor - A base-map descriptor.
 * @param {Set<string>} params.baseSourceIds - Source IDs in the incoming style.
 * @returns {Array} New layers array.
 */
export function applyLabelPolicyToStyle({ style, descriptor, baseSourceIds }) {
  return (style.layers ?? []).map((layer) => {
    if (!isBaseLabelLayer({ layer, descriptor, baseSourceIds })) {
      return layer;
    }

    const paintOverride = getLabelPaintOverride(descriptor, layer.id);
    const layoutOverride = getLabelLayoutOverride(descriptor, layer.id);

    if (!paintOverride && !layoutOverride) {
      return layer;
    }

    return {
      ...layer,
      ...(layoutOverride
        ? {
            layout: {
              ...layer.layout,
              ...layoutOverride,
            },
          }
        : {}),
      ...(paintOverride
        ? {
            paint: {
              ...layer.paint,
              ...paintOverride,
            },
          }
        : {}),
    };
  });
}

/**
 * Applies the descriptor's label paint and layout policies to a live map instance.
 * Used post-load after the style is already active.
 *
 * @param {Object} params
 * @param {maplibregl.Map} params.map - A MapLibre map instance.
 * @param {Object} params.descriptor - A base-map descriptor.
 * @param {Set<string>} params.baseSourceIds - Base source IDs for the current style.
 */
export function applyLabelPolicyToMap({ map, descriptor, baseSourceIds }) {
  if (!map?.getLayer) return;

  const style = map.getStyle?.();
  if (!style?.layers) return;

  style.layers.forEach((layer) => {
    if (!isBaseLabelLayer({ layer, descriptor, baseSourceIds })) return;
    if (!map.getLayer(layer.id)) return;

    const paintOverride = getLabelPaintOverride(descriptor, layer.id);
    if (paintOverride && map.setPaintProperty) {
      try {
        Object.entries(paintOverride).forEach(([property, value]) => {
          map.setPaintProperty(layer.id, property, value);
        });
      } catch {
        // Ignore layers that do not support text paint properties.
      }
    }

    const layoutOverride = getLabelLayoutOverride(descriptor, layer.id);
    if (layoutOverride && map.setLayoutProperty) {
      try {
        Object.entries(layoutOverride).forEach(([property, value]) => {
          map.setLayoutProperty(layer.id, property, value);
        });
      } catch {
        // Ignore layers that do not support text layout properties.
      }
    }
  });
}
