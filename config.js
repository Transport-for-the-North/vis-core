import { formatNumber, formatOrdinal } from "./text";

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
 *     const result = replacePlaceholdersInObject(target, source);
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
export function replacePlaceholdersInObject(target, source) {
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

  return recursiveReplace(target);
}

/**
   * Replaces placeholders in the HTML fragment with actual data.
   * Placeholders are denoted by {key}, where 'key' corresponds to a key in the data object.
   *
   * @param {string} htmlFragment - The HTML fragment containing placeholders.
   * @param {Object} data - The data object containing key-value pairs.
   * @returns {string} The HTML fragment with placeholders replaced.
   */
export const replacePlaceholders = (htmlFragment, data) => {
  // Regular expression to match placeholders with optional function calls
  return htmlFragment.replace(/{(\w+)(\(([\w\.]+)\))?}/g, (match, funcOrKey, funcArgs, argKey) => {
    // If there is no function call, replace with data[key]
    if (!funcArgs) {
      const value = data[funcOrKey];
      return value !== undefined ? value : match;
    }

    // If there is a function call, process it
    const functionName = funcOrKey;
    const arg = data[argKey];

    // If arg is undefined, return the original placeholder
    if (arg === undefined) {
      return match
    }

    // Define allowed functions
    const allowedFunctions = {
      formatNumber,
      formatOrdinal,
    };

    // Check if the function is allowed
    const func = allowedFunctions[functionName];
    if (func) {
      return func(arg);
    }


    // If function is not allowed, return the original placeholder
    return match;
  });
};

/**
 * Filters a glossary data object by excluding entries that contain any items from a specified exclude list.
 *
 * @param {Object} glossaryData - The glossary data to be filtered. This should be an object where each key is a unique identifier
 *                                and each value is an object representing a glossary entry. Each glossary entry object should have
 *                                an `exclude` property, which is an array of items to be checked against the exclude list.
 * @param {string|Array<string>} excludeList - A string or an array of strings representing items to be excluded. If any item in the
 *                                             `exclude` array of a glossary entry matches an item in this list, that glossary entry
 *                                             will be excluded from the result.
 * @returns {Object} - A new object containing only the glossary entries that do not have any items in their `exclude` array
 *                     matching any item in the exclude list.
 *
 * @example
 * const glossaryData = {
 *   term1: { definition: "Definition 1", exclude: ["item1", "item2"] },
 *   term2: { definition: "Definition 2", exclude: ["item3"] },
 *   term3: { definition: "Definition 3", exclude: [] }
 * };
 * const excludeList = ["item1", "item3"];
 * const result = filterGlossaryData(glossaryData, excludeList);
 * // result will be:
 * // {
 * //   term3: { definition: "Definition 3", exclude: [] }
 * // }
 *
 * @example
 * const glossaryData = {
 *   term1: { definition: "Definition 1", exclude: ["item1", "item2"] },
 *   term2: { definition: "Definition 2", exclude: ["item3"] },
 *   term3: { definition: "Definition 3", exclude: [] }
 * };
 * const excludeList = "item1";
 * const result = filterGlossaryData(glossaryData, excludeList);
 * // result will be:
 * // {
 * //   term2: { definition: "Definition 2", exclude: ["item3"] },
 * //   term3: { definition: "Definition 3", exclude: [] }
 * // }
 */
export function filterGlossaryData(glossaryData, excludeList) {
  const filteredGlossaryData = {};
  const excludeArray = Array.isArray(excludeList) ? excludeList : [excludeList];

  for (const key in glossaryData) {
    if (glossaryData.hasOwnProperty(key)) {
      const entry = glossaryData[key];
      const entryExcludeArray = Array.isArray(entry.exclude) ? entry.exclude : [];

      if (!entryExcludeArray.some(excludeItem => excludeArray.includes(excludeItem))) {
        filteredGlossaryData[key] = entry;
      }
    }
  }
  
  return filteredGlossaryData;
}

/**
 * Checks if a specified paramName in the filters array has forceRequired set to true.
 *
 * @param {Array} filters - The array of filter objects to search through.
 * @param {string} targetParamName - The paramName to search for in the filters array.
 * @returns {boolean} - Returns true if the specified paramName is found and forceRequired is true, otherwise returns false.
 */
export function isParamNameForceRequired(filters, targetParamName) {
  const filter = filters.find(f => f.paramName === targetParamName);
  return filter ? filter.forceRequired === true : false;
}

// Function to detect if the OS is Windows 10 or lower
export function isWindows10OrLower() {
  const { userAgent } = navigator;
  const windowsVersionMatch = userAgent.match(/Windows NT (\d+\.\d+)/);
  if (windowsVersionMatch) {
    const version = parseFloat(windowsVersionMatch[1]);
    // Windows NT versions: 10.0 (Windows 10), 6.3 (Windows 8.1), 6.2 (Windows 8), etc.
    // Windows 10 is version 10.0, so include it and any lower versions
    return version <= 10.0;
  }
  return false;
}