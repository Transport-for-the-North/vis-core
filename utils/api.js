/**
 * Checks if the given path contains route parameters.
 * @function hasRouteParameter
 * @param {string} path - The path to check for route parameters.
 * @returns {boolean} True if the path contains route parameters, otherwise false.
 */
export const hasRouteParameter = (path) => {
    // Check if the path contains at least one "{parameter}" other than "{z}/{x}/{y}"
    const parameterPattern = /\{(?![zyx]\})[^{}]+\}/; // Matches any parameter that is not {z}, {x}, or {y}
    return parameterPattern.test(path);
};

/**
 * Replaces a route parameter in the given path with a new value.
 * @function replaceRouteParameter
 * @param {string} path - The path containing the parameter to replace.
 * @param {string} paramName - The name of the parameter to replace.
 * @param {string} paramValue - The new value to replace the parameter with.
 * @returns {string} The path with the parameter replaced by the new value.
 */
export const replaceRouteParameter = (path, paramName, paramValue) => path.replace(`{${paramName}}`, paramValue);

