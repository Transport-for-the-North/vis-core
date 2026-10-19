import {
  getInitialBaseSources,
  registerInitialBaseSources,
} from "./baseSources";

/**
 * Dark place-label paint used on the light (Positron) basemap.
 * Larger place names get a slightly wider halo so they stay readable.
 */
const LIGHT_LABEL_PAINT = {
  default: {
    "text-color": "#1f1f1f",
    "text-halo-color": "rgba(255, 255, 255, 0.9)",
    "text-halo-width": 1.25,
    "text-halo-blur": 0.5,
  },
  byLayerId: {
    place_city: {
      "text-halo-width": 1.25,
    },
    place_city_large: {
      "text-halo-width": 1.25,
    },
    place_capital: {
      "text-halo-width": 1.25,
    },
  },
};

/**
 * Label policy for the Geoapify Positron light basemap.
 */
export const POSITRON_BASE_MAP = {
  id: "positron",
  labels: {
    layerPrefixes: ["place_", "place-"],
    paint: LIGHT_LABEL_PAINT,
  },
};

/**
 * True when a resolved style value is the Geoapify Positron light basemap.
 * Style objects (for example the OS raster style) are left untouched.
 *
 * @param {unknown} styleValue - A style URL or a MapLibre style object.
 * @returns {boolean}
 */
export function isPositronStyleUrl(styleValue) {
  return typeof styleValue === "string" && styleValue.includes("/styles/positron/");
}

/**
 * Checks whether a layer is a basemap place label covered by the descriptor.
 *
 * @param {Object} params
 * @param {Object} params.layer - A MapLibre layer spec.
 * @param {Object} params.descriptor - A base-map descriptor.
 * @param {Set<string>} params.baseSourceIds - Source ids belonging to the base style.
 * @returns {boolean}
 */
export function isBaseLabelLayer({ layer, descriptor, baseSourceIds }) {
  if (layer?.type !== "symbol") return false;
  if (!layer.source) return false;
  if (!baseSourceIds?.has(layer.source)) return false;

  const labels = descriptor?.labels;
  if (!labels) return false;

  return (
    labels.layerIds?.includes(layer.id) ||
    labels.layerPrefixes?.some((prefix) => layer.id.startsWith(prefix)) ||
    labels.matches?.(layer) === true
  );
}

/**
 * Returns the paint overrides for a base label layer.
 * A missing policy or `"provider"` means the style's own paint is kept.
 *
 * @param {Object} descriptor - A base-map descriptor.
 * @param {string} layerId - The layer id.
 * @returns {Object|null}
 */
export function getLabelPaintOverride(descriptor, layerId) {
  const policy = descriptor?.labels?.paint;

  if (!policy || policy === "provider") {
    return null;
  }

  return {
    ...policy.default,
    ...policy.byLayerId?.[layerId],
  };
}

/**
 * Writes the descriptor's label paint onto matching layers of a live map.
 *
 * @param {Object} params
 * @param {Object} params.map - A MapLibre map instance.
 * @param {Object} params.descriptor - A base-map descriptor.
 * @param {Set<string>} params.baseSourceIds - Base source ids for the current style.
 */
export function applyLabelPolicyToMap({ map, descriptor, baseSourceIds }) {
  if (!map?.getLayer || !map?.setPaintProperty) return;

  const style = map.getStyle?.();
  if (!style?.layers) return;

  style.layers.forEach((layer) => {
    if (!isBaseLabelLayer({ layer, descriptor, baseSourceIds })) return;
    if (!map.getLayer(layer.id)) return;

    const paintOverride = getLabelPaintOverride(descriptor, layer.id);
    if (!paintOverride) return;

    try {
      Object.entries(paintOverride).forEach(([property, value]) => {
        map.setPaintProperty(layer.id, property, value);
      });
    } catch {
      // Ignore layers that do not support text paint properties.
    }
  });
}

/**
 * Records the map's base sources on first style load and applies the light-mode
 * place-label paint. Safe to call again after application sources exist: the
 * source snapshot is not expanded.
 *
 * @param {Object} map - A MapLibre map instance.
 */
export function applyLightBaseLabels(map) {
  if (!map?.getStyle) return;

  const style = map.getStyle();
  if (style?.sources && !getInitialBaseSources(map)) {
    registerInitialBaseSources(map, new Set(Object.keys(style.sources)));
  }

  applyLabelPolicyToMap({
    map,
    descriptor: POSITRON_BASE_MAP,
    baseSourceIds: getInitialBaseSources(map) ?? new Set(),
  });
}
