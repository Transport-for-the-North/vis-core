const COMPANION_SUFFIXES = [
  "-hover",
  "-select",
  "-label",
  "-boundaries",
  "-spider",
  "-spider-links",
  "-symbols",
  "-symbols-hover",
];

/**
 * Strips known companion suffixes from a layer ID to get the root layer ID.
 *
 * @param {string} layerId
 * @returns {string} The root layer ID without companion suffixes.
 */
export function getApplicationLayerRootId(layerId) {
  if (!layerId || typeof layerId !== "string") return "";
  const suffix = COMPANION_SUFFIXES.find((s) => layerId.endsWith(s));
  return suffix ? layerId.slice(0, -suffix.length) : layerId;
}

/**
 * Checks whether a layer corresponds to a configured application layer.
 *
 * @param {Object} layer - A MapLibre layer spec.
 * @param {Object} configuredLayers - The dictionary of configured application layers from state.layers.
 * @returns {boolean}
 */
export function isConfiguredApplicationLayer(layer, configuredLayers = {}) {
  if (!layer?.id) return false;
  const rootId = getApplicationLayerRootId(layer.id);
  return Boolean(configuredLayers[rootId]);
}
