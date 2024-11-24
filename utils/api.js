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
 * Checks if the given path contains route parameters or query parameters.
 * @function hasRouteParameterOrQuery
 * @param {string} path - The path to check for route or query parameters.
 * @returns {boolean} True if the path contains route or query parameters, otherwise false.
 */
export const hasRouteParameterOrQuery = (path) => {
  // Check if the path contains at least one "{parameter}" other than "{z}/{x}/{y}"
  const routeParameterPattern = /\{(?![zyx]\})[^{}]+\}/; // Matches any route parameter that is not {z}, {x}, or {y}

  // Check if the path contains query parameters, indicated by a "?" followed by "key=value" pairs
  const queryParameterPattern = /\?.+=.+/; // Matches the presence of query parameters

  // Return true if either route parameters or query parameters are found
  return routeParameterPattern.test(path) || queryParameterPattern.test(path);
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
  return pathDetails && pathDetails.security ? pathDetails.security.length > 0 : false;
};

/**
 * Updates the URL by replacing route parameters and query parameters with provided values.
 * @function updateUrlParameters
 * @param {string} url - The URL or path to update.
 * @param {Object} params - An object containing parameter names and their replacement values.
 * @returns {string} The updated URL with parameters replaced.
 */
export const updateUrlParameters = (url, params) => {
  let updatedUrl = url;

  // Replace route parameters
  updatedUrl = updatedUrl.replace(/\{([^}]+)\}/g, (match, paramName) => {
    return params.hasOwnProperty(paramName) ? encodeURIComponent(params[paramName]) : match;
  });

  // Split the URL into path and query string
  const [path, queryString] = updatedUrl.split('?');

  if (queryString) {
    const queryParams = new URLSearchParams(queryString);

    // Iterate over each query parameter
    for (let key of queryParams.keys()) {
      if (params.hasOwnProperty(key)) {
        queryParams.set(key, params[key]);
      }
    }

    // Reconstruct the updated URL with modified query parameters
    updatedUrl = `${path}?${queryParams.toString()}`;
  }

  return updatedUrl;
};

/**
 * Extracts route parameters enclosed in curly braces from the given URL path.
 *
 * @param {string} url - The URL or path from which to extract route parameters.
 * @returns {string[]} An array of route parameter names without curly braces.
 */
export function extractRouteParams(url) {
  const matches = [...url.matchAll(/\{([^}]+)\}/g)];
  return matches.map((match) => match[1]);
}

/**
 * Extracts query parameter names from the query string of the given URL.
 *
 * @param {string} url - The URL or path from which to extract query parameters.
 * @returns {string[]} An array of query parameter names.
 */
export function extractQueryParams(url) {
  const queryParams = [];
  const queryStringStart = url.indexOf('?');

  if (queryStringStart !== -1) {
    const queryString = url.substring(queryStringStart + 1);
    const urlSearchParams = new URLSearchParams(queryString);

    for (const key of urlSearchParams.keys()) {
      queryParams.push(key);
    }
  }

  return queryParams;
}

/**
 * Extracts all parameter names (both route and query parameters) from the given URL.
 *
 * @param {string} url - The URL or path from which to extract all parameters.
 * @returns {string[]} An array of all parameter names (route and query).
 */
export function extractAllParams(url) {
  const routeParams = extractRouteParams(url);
  const queryParams = extractQueryParams(url);
  return [...routeParams, ...queryParams];
}

/**
 * Extracts parameters and their values from a layer path.
 *
 * This function parses a URL path to extract route parameters (e.g., {param}) and query parameters.
 * It handles default values specified within route parameters (e.g., {param=defaultValue}).
 *
 * @param {string} layerPath - The path of the layer which may contain route and query parameters.
 * @returns {Object} An object containing all parameters from the layer path with their specified values (if any).
 *                   The keys are parameter names, and the values are the parameter values or undefined if not specified.
 */
export function extractParamsWithValues(layerPath) {
  const [pathPart, queryPart] = layerPath.split('?');

  // Extract route parameters from the path
  const routeParamRegex = /{([^}]+)}/g;
  let match;
  const routeParams = {};

  while ((match = routeParamRegex.exec(pathPart)) !== null) {
    const param = match[1];
    let paramName = param;
    let paramValue;

    // Check if parameter includes a default value, e.g., {param=defaultValue}
    if (param.includes('=')) {
      [paramName, paramValue] = param.split('=');
    }

    routeParams[paramName] = paramValue; // Value may be undefined
  }

  // Extract query parameters
  const queryParams = {};
  if (queryPart) {
    const params = queryPart.split('&');
    params.forEach((param) => {
      const [key, value] = param.split('=');
      if (
        value === undefined &&
        key.includes('{') &&
        key.includes('}')
      ) {
        // It's a parameter placeholder in the query, e.g., ?{param}
        const paramName = key.replace(/{|}/g, '');
        queryParams[paramName] = undefined;
      } else {
        queryParams[key] = value;
      }
    });
  }

  return { ...routeParams, ...queryParams };
}

/**
 * Processes parameters by determining their values and identifying any missing parameters.
 *
 * This function looks for parameter values specified in the layer path or in the provided filters.
 * Parameters without specified values and without matching filters are collected in the missingParams array,
 * excluding any parameters listed in excludedParams.
 *
 * @param {Object} allParamsWithValues - An object containing all parameters extracted from the layer path.
 * @param {Array} filters - An array of filter objects to source parameter values if not specified in the path.
 * @param {Array} excludedParams - An array of parameter names to exclude from the missing parameters list.
 * @returns {Object} An object containing:
 *                   - params: An object with parameter names and their determined values.
 *                   - missingParams: An array of parameter names that are missing values.
 */
export function processParameters(allParamsWithValues, filters, excludedParams) {
  const params = {};
  const missingParams = [];

  Object.entries(allParamsWithValues).forEach(([paramName, paramValue]) => {
    if (paramValue !== '' && paramValue !== undefined) {
      // Use the value specified in the layer.path
      params[paramName] = paramValue;
    } else {
      // Try to find the value from the filters
      const filter = filters.find((f) => f.paramName === paramName);

      if (filter && filter.values?.values?.length > 0) {
        params[paramName] = filter.values.values[0].paramValue;
      } else {
        // Exclude certain parameters from the missing parameters list
        if (!excludedParams.includes(paramName)) {
          missingParams.push(paramName);
        }
      }
    }
  });

  return { params, missingParams };
}