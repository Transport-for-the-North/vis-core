/**
 * Registry of the source ids that belonged to a map's initial base style.
 *
 * Captured on the first style load, before application sources are added, so
 * label overrides can target basemap layers only.
 */

const baseSourcesByMap = new WeakMap();

/**
 * Registers the initial base source ids for a map instance.
 * Later calls are ignored so application sources are not treated as base sources.
 *
 * @param {Object} map - A MapLibre map instance.
 * @param {Set<string>} sourceIds - Source ids belonging to the base style.
 */
export function registerInitialBaseSources(map, sourceIds) {
  if (!map || !sourceIds) return;
  if (baseSourcesByMap.has(map)) return;
  baseSourcesByMap.set(map, sourceIds);
}

/**
 * Returns the registered initial base source ids for a map instance.
 *
 * @param {Object} map - A MapLibre map instance.
 * @returns {Set<string>|undefined}
 */
export function getInitialBaseSources(map) {
  if (!map) return undefined;
  return baseSourcesByMap.get(map);
}
