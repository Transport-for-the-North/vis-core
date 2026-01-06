/**
 * Resolves a nested value using dot-path syntax (e.g., "level1.total").
 *
 * Notes:
 * - Returns `undefined` when any segment is missing.
 * - Does not support bracket syntax (e.g., "items[0].name").
 *
 * @param {Record<string, any> | null | undefined} obj
 * @param {string} path
 * @returns {any} The resolved value or `undefined`.
 */
export function getByPath(obj, path) {
  if (!obj || !path) return undefined;

  return path.split(".").reduce((acc, key) => {
    if (acc == null) return undefined;
    return acc[key];
  }, obj);
}