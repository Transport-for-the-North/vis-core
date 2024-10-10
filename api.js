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
export const replaceRouteParameter = (path, paramName, paramValue) =>
  path.replace(`{${paramName}}`, paramValue);

/**
 * Checks if the specified API route in the given API schema has security requirements.
 *
 * This function examines the provided API schema to determine if the specified route
 * has any security requirements defined. It specifically looks for the 'get' method
 * under the given route and checks if the 'security' field is present and contains
 * at least one security requirement.
 *
 * @param {Object} apiSchema - The API schema object that defines the structure and
 *                             details of the API, including paths and security requirements.
 * @param {string} apiRoute - The specific API route to check for security requirements.
 *                            This should be a string representing the path, e.g., '/users'.
 * @returns {boolean} - Returns true if the specified route has security requirements,
 *                      otherwise returns false.
 *
 * @example
 * const apiSchema = {
 *   paths: {
 *     '/users': {
 *       get: {
 *         security: [{ apiKeyAuth: [] }]
 *       }
 *     }
 *   }
 * };
 * const apiRoute = '/users';
 * const hasSecurity = checkSecurityRequirements(apiSchema, apiRoute);
 * console.log(hasSecurity); // Output: true
 */
export const checkSecurityRequirements = (apiSchema, apiRoute) => {
  const pathDetails = apiSchema.paths[apiRoute]?.get;
  return pathDetails && pathDetails.security && pathDetails.security.length > 0;
};
