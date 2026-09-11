/**
 * Registry of initial base-style source IDs for map instances.
 *
 * When a map instance first loads its initial base style, its source IDs
 * are captured and registered here before any application layers are mounted.
 * This allows the transition coordinator (useBaseMapTransition) to know which
 * sources belonged to the original base map on the first style switch.
 */

const baseSourcesByMap = new WeakMap();

/**
 * Registers the initial base source IDs for a map instance.
 *
 * @param {Object} map - A MapLibre map instance.
 * @param {Set<string>} sourceIds - Set of source IDs belonging to the base style.
 */
export function registerInitialBaseSources(map, sourceIds) {
  if (!map || !sourceIds) return;
  if (baseSourcesByMap.has(map)) return;
  baseSourcesByMap.set(map, sourceIds);
}

/**
 * Returns the registered initial base source IDs for a map instance.
 *
 * @param {Object} map - A MapLibre map instance.
 * @returns {Set<string>|undefined}
 */
export function getInitialBaseSources(map) {
  if (!map) return undefined;
  return baseSourcesByMap.get(map);
}
