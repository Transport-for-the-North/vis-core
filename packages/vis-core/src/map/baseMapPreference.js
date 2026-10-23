/**
 * Persistence key for the user's base-map preference.
 * Uses a new key distinct from the old experimental "vis-core-map-style" key.
 * There is no migration of old values – dark mode is unreleased.
 */
const STORAGE_KEY = "vis-core-base-map";

/**
 * Reads the user's saved base-map preference from localStorage.
 * Returns the stored ID if it refers to a known map, otherwise removes
 * the stale entry and returns null.
 *
 * @param {Object} availableBaseMaps - The catalogue of known base maps, keyed by ID.
 * @returns {string|null}
 */
export function readBaseMapPreference(availableBaseMaps) {
  try {
    const id = localStorage.getItem(STORAGE_KEY);

    if (!id) return null;

    if (!availableBaseMaps[id]) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return id;
  } catch {
    return null;
  }
}

/**
 * Persists the user's base-map selection to localStorage.
 * Failures are silently swallowed because persistence is optional.
 *
 * @param {string} id - The base-map ID to persist.
 */
export function writeBaseMapPreference(id) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Storage is optional.
  }
}
