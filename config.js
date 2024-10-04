/**
 * Replace placeholders in the `target` object with values from the `source` object.
 *
 * Placeholders in the `target` object should follow the format `{key}` where `key` corresponds
 * to a property in the `source` object. The function will recursively process nested objects and arrays.
 *
 * @param {Object} target - The object with placeholders to be replaced.
 * @param {Object} source - The object providing values to replace placeholders.
 * @returns {Object} - A new object with placeholders replaced by values from the `source`.
 *
 * @throws {TypeError} - Throws if `target` or `source` is not an object.
 * @throws {Error} - Throws if a placeholder key in `target` does not exist in `source`.
 *
 * @example
 * ```js
 * const target = {
 *     name: "@firstName@ @lastName@",
 *     address: {
 *         city: "@city@",
 *         postcode: "@postcode@"
 *     },
 *     items: ["@item1@", "@item2@"]
 * };
 *
 * const source = {
 *     firstName: "John",
 *     lastName: "Doe",
 *     city: "London",
 *     postcode: "NW1 6XE",
 *     item1: "Apple",
 *     item2: "Banana"
 * };
 *
 * try {
 *     const result = replacePlaceholders(target, source);
 *     console.log(result);
 * } catch (error) {
 *     console.error(error.message);
 * }
 *
 * Yields
 * {
 *    "name": "John Doe",
 *    "address": {
 *        "city": "London",
 *        "postcode": "NW1 6XE"
 *    },
 *    "items": ["Apple", "Banana"]
 *}
 */
export function replacePlaceholders(target, source) {
  // Validate input
  if (typeof target !== "object" || target === null || Array.isArray(target)) {
    throw new TypeError("The `target` must be a non-null object.");
  }
  if (typeof source !== "object" || source === null || Array.isArray(source)) {
    throw new TypeError("The `source` must be a non-null object.");
  }

  /**
   * Recursively replace placeholders in the target object or array.
   *
   * @param {any} item - The current item being processed (could be a string, object, array, etc.).
   * @returns {any} - The processed item with placeholders replaced.
   */
  function recursiveReplace(item) {
    // Process strings with placeholder pattern {key}
    if (typeof item === "string") {
      return item.replace(/\@(\w+)\@/g, (match, key) => {
        if (!(key in source)) {
          throw new Error(
            `Placeholder key "${key}" not found in source object.`
          );
        }
        return source[key];
      });
    }

    // Recursively process objects
    if (typeof item === "object" && item !== null) {
      const result = Array.isArray(item) ? [] : {};
      for (let key in item) {
        if (item.hasOwnProperty(key)) {
          result[key] = recursiveReplace(item[key]);
        }
      }
      return result;
    }

    // For other types (number, boolean, etc.), return as is
    return item;
  }

  // Start recursive replacement on the target object
  const adaptedTarget = recursiveReplace(target);
  return adaptedTarget;
}
