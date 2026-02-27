/**
 * Checks if the given path contains route parameters.
 * Supports both "{param}" and ":param" styles, excluding tile placeholders {z}/{x}/{y}.
 * @function hasRouteParameter
 * @param {string} path - The path to check for route parameters.
 * @returns {boolean} True if the path contains route parameters, otherwise false.
 */
export const hasRouteParameter = (path) => {
  const curlyPattern = /\{(?![zyx]\})[^{}]+\}/; // exclude {z}, {x}, {y}
  const colonPattern = /\/:(?![zyx]\b)[A-Za-z0-9_]+/; // exclude :z, :x, :y
  return curlyPattern.test(path) || colonPattern.test(path);
};

/**
 * Checks if the given path contains route parameters or query parameters.
 * Supports both "{param}" and ":param" styles for route placeholders.
 * @function hasRouteParameterOrQuery
 * @param {string} path - The path to check for route or query parameters.
 * @returns {boolean} True if the path contains route or query parameters, otherwise false.
 */
export const hasRouteParameterOrQuery = (path) => {
  // Check if the path contains at least one "{parameter}" other than "{z}/{x}/{y}"
  const routeParameterPatternCurly = /\{(?![zyx]\})[^{}]+\}/;
  const routeParameterPatternColon = /\/:(?![zyx]\b)[A-Za-z0-9_]+/;
  
  // Check if the path contains query parameters, indicated by a "?" followed by "key=value" pairs
  const queryParameterPattern = /\?.+=.+/; // Matches the presence of query parameters
  // Return true if either route parameters or query parameters are found
  return (
    routeParameterPatternCurly.test(path) ||
    routeParameterPatternColon.test(path) ||
    queryParameterPattern.test(path)
  );
};

/**
 * Replaces a route parameter in the given path with a new value.
 * Encodes the value and supports both "{param}" and ":param" styles.
 * @function replaceRouteParameter
 * @param {string} path - The path containing the parameter to replace.
 * @param {string} paramName - The name of the parameter to replace.
 * @param {string|number} paramValue - The new value to replace the parameter with.
 * @returns {string} The path with the parameter replaced by the new value.
 */
export const replaceRouteParameter = (path, paramName, paramValue) => {
  const encoded = encodeURIComponent(String(paramValue));
  return path
    .replace(new RegExp(`\\{${paramName}\\}`, "g"), encoded)
    .replace(new RegExp(`/:${paramName}(?=/|$)`, "g"), `/${encoded}`);
};

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
 * Normalises a parameter value:
 * - Arrays can be joined according to a style ("comma" for query, "slash" for path).
 * - Non-arrays are returned as-is.
 * @param {any} value - The raw value to normalize.
 * @param {"comma"|"slash"} [joinStyle="comma"] - How to join array values.
 * @returns {string|number} The normalized value.
 */
export const normaliseParamValue = (value, joinStyle = "comma") => {
  if (Array.isArray(value)) {
    const delimiter = joinStyle === "slash" ? "/" : ",";
    return value.join(delimiter);
  }
  return value;
};

/**
 * Applies path parameters to a template path by replacing placeholders with provided values.
 * Supports two placeholder styles:
 * - RFC style: /resource/{id}
 * - Express style: /resource/:id
 *
 * Values are URL-encoded. Array values are joined based on arrayStyle.
 *
 * @param {string} templatePath - The path that may contain placeholders.
 * @param {Object} [pathParams={}] - A map of placeholder name to value.
 * @param {Object} [opts] - Options controlling replacement behavior.
 * @param {boolean} [opts.allowMissing=false] - If false, throws when a placeholder is missing in pathParams.
 * @param {"comma"|"slash"} [opts.arrayStyle="slash"] - How to join array values in a single placeholder.
 * @returns {string} The path with placeholders replaced.
 * @throws {Error} If a placeholder is missing and allowMissing is false.
 */
export const applyPathParams = (
  templatePath,
  pathParams = {},
  opts = { allowMissing: false, arrayStyle: "slash" }
) => {
  const { allowMissing = false, arrayStyle = "slash" } = opts;

  const placeholderRegex = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g;

  return templatePath.replace(placeholderRegex, (match, expressName, rfcName) => {
    const name = expressName || rfcName;
    const rawVal = pathParams[name];

    if (rawVal === undefined || rawVal === null) {
      if (allowMissing) return match;
      throw new Error(`Missing path param "${name}" for path "${templatePath}"`);
    }

    const normalized = normaliseParamValue(rawVal, arrayStyle);
    return encodeURIComponent(String(normalized));
  });
};

/**
 * Updates a URL based on a template by merging route values from the current URL with
 * new values provided via params. Query parameters are updated only if every route
 * placeholder is fulfilled—except for the excluded ones ("x", "y", and "z"), which
 * can remain unresolved.
 *
 * Note: Unresolved placeholder detection is based on the original (unencoded) template,
 * not on the encoded value.
 *
 * @param {string} template - A URL template.
 *   E.g. "/api/vectortiles/noham_nodes/{z}/{x}/{y}?network_scenario_name={networkScenarioName}&network_year={year}&demand_scenario_name={demandScenarioName}&demand_year={year}&time_period_code={timePeriodCode}"
 * @param {string} current - The current URL (path + query).
 * @param {Object} params - New parameter values that override existing ones (applies to both path and query placeholders).
 * @param {Object} [opts] - Options controlling replacement behavior.
 * @param {"comma"|"slash"} [opts.pathArrayStyle="slash"] - Join style for array-valued path params.
 * @returns {string} - The updated URL.
 */
export const updateUrlParameters = (template, current, params, opts = { pathArrayStyle: "slash" }) => {
  const excluded = new Set(["x", "y", "z"]);
  const { pathArrayStyle = "comma" } = opts;

  // Split the current URL into path and query components.
  const [currentPath, currentQuery = ""] = current.split("?");
  // Split the template URL into path and query components.
  const [templatePath, templateQuery = ""] = template.split("?");

  // --- Process the path portion ---

  // Extract all placeholder names from the unencoded template path (curly-brace style only).
  const paramNames = [];
  templatePath.replace(/\{([^}]+)\}/g, (_, name) => {
    paramNames.push(name);
    return _;
  });

  // Build a regex pattern from the unencoded template path to capture existing route values.
  const regexPattern = templatePath.replace(/\{([^}]+)\}/g, "([^/]+)");
  const routeRegex = new RegExp(`^${regexPattern}$`);
  const routeMatch = routeRegex.exec(currentPath);
  const currentRoute = {};
  if (routeMatch) {
    paramNames.forEach((name, i) => {
      currentRoute[name] = decodeURIComponent(routeMatch[i + 1]);
    });
  }

  // Create a "resolved" mapping using new params or fallback to values extracted from currentRoute.
  const resolved = {};
  paramNames.forEach((name) => {
    if (Object.prototype.hasOwnProperty.call(params, name)) {
      resolved[name] = params[name];
    } else if (Object.prototype.hasOwnProperty.call(currentRoute, name)) {
      resolved[name] = currentRoute[name];
    }
  });

  // Determine if any non-excluded placeholders remain unresolved by using the original list.
  const hasUnresolvedNonExcluded = paramNames.some(
    (name) => !(name in resolved) && !excluded.has(name)
  );

  // Replace placeholders in the template path using applyPathParams.
  // Resolved values are encoded, while unresolved ones remain as "{name}"
  const updatedPath = applyPathParams(templatePath, resolved, {
    allowMissing: true,
    arrayStyle: pathArrayStyle,
  });

  // --- Process the query portion ---

  let updatedQuery = "";
  if (templateQuery) {
    if (!hasUnresolvedNonExcluded) {
      // Use URLSearchParams to parse the query template and current query.
      const templateQueryParams = new URLSearchParams(templateQuery);
      const currentQueryParams = new URLSearchParams(currentQuery);
      const mergedQueryParams = new URLSearchParams();

      // Replace any placeholders in each query parameter value.
      for (const [key, value] of templateQueryParams.entries()) {
        const newVal = value.replace(/\{([^}]+)\}/g, (_, pName) => {
          if (Object.prototype.hasOwnProperty.call(params, pName)) {
            const normalised = normaliseParamValue(params[pName], "comma");
            return String(normalised);
          } else if (currentQueryParams.has(key)) {
            return currentQueryParams.get(key);
          }
          return `{${pName}}`;
        });
        mergedQueryParams.set(key, newVal);
      }
      updatedQuery = mergedQueryParams.toString();
      // Undo any encoding on curly braces (which URLSearchParams does automatically).
      updatedQuery = updatedQuery.replace(/%7B/gi, "{").replace(/%7D/gi, "}");
    } else {
      // If required route values are not fully resolved, use the current query string.
      updatedQuery = currentQuery;
    }
  } else {
    updatedQuery = currentQuery;
  }

  // --- Final assembly ---
  const combinedUrl = updatedQuery ? `${updatedPath}?${updatedQuery}` : updatedPath;
  // Ensure that any accidentally encoded curly braces in the full URL are reverted.
  const finalUrl = combinedUrl.replace(/%7B/gi, "{").replace(/%7D/gi, "}");
  return finalUrl;
};

/**
 * Appends query parameters to a URL.
 *
 * - Skips params with null/undefined values.
 * - URL-encodes both keys and values.
 * - Preserves any existing query string.
 *
 * @param {string} url
 * @param {Record<string, any>} params
 * @returns {string}
 */
export const appendQueryParams = (url, params) => {
  const entries = Object.entries(params || {}).filter(([, v]) => v !== null && v !== undefined);
  if (entries.length === 0) return url;

  const joiner = url.includes("?") ? "&" : "?";
  const qs = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return `${url}${joiner}${qs}`;
};

/**
 * Extracts route parameters enclosed in curly braces, and also supports ":param" style.
 *
 * @param {string} url - The URL or path from which to extract route parameters.
 * @returns {string[]} An array of route parameter names without curly braces or colons.
 */
export function extractRouteParams(url) {
  const curlyMatches = [...url.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  const colonMatches = [...url.matchAll(/\/:([A-Za-z0-9_]+)/g)].map((m) => m[1]);
  return [...curlyMatches, ...colonMatches];
}

/**
 * Extracts query parameter names from the query string of the given URL.
 *
 * @param {string} url - The URL or path from which to extract query parameters.
 * @returns {string[]} An array of query parameter names.
 */
export function extractQueryParams(url) {
  const queryParams = [];
  const queryStringStart = url.indexOf("?");
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
  const [pathPart, queryPart] = layerPath.split("?");

  // Extract route parameters from the path (curly-style with optional default values)
  const routeParamRegex = /{([^}]+)}/g;
  let match;
  const routeParams = {};

  while ((match = routeParamRegex.exec(pathPart)) !== null) {
    const param = match[1];
    let paramName = param;
    let paramValue;

    // Check if parameter includes a default value, e.g., {param=defaultValue}
    if (param.includes("=")) {
      [paramName, paramValue] = param.split("=");
    }

    routeParams[paramName] = paramValue; // Value may be undefined
  }

  // Also support :param (no default support)
  for (const m of pathPart.matchAll(/\/:([A-Za-z0-9_]+)/g)) {
    const name = m[1];
    // If it already exists from curly parsing, keep that value; otherwise set undefined
    if (!(name in routeParams)) {
      routeParams[name] = undefined;
    }
  }

  // Extract query parameters
  const queryParams = {};
  if (queryPart) {
    const params = queryPart.split("&");
    params.forEach((param) => {
      const [key, value = ""] = param.split("=");
      if (value.includes("{") && value.includes("}")) {
        // It's a parameter placeholder in the query, e.g., ?param={paramName}
        const paramName = value.replace(/{|}/g, "");
        queryParams[paramName] = undefined;
      } else {
        queryParams[key] = value;
      }
    });
  }

  return { ...routeParams, ...queryParams };
}

/**
 * Extracts parameters and their values from a layer path, separated into path and query maps.
 *
 * @param {string} layerPath - The path of the layer which may contain route and query parameters.
 * @returns {{pathParams: Object, queryParams: Object}} Separate maps for path and query parameters.
 */
export function extractParamsWithValuesSeparated(layerPath) {
  const [pathPart, queryPart] = layerPath.split("?");

  // Route params from curly with defaults
  const pathParams = {};
  for (const m of pathPart.matchAll(/\{([^}]+)\}/g)) {
    const raw = m[1];
    if (raw.includes("=")) {
      const [name, value] = raw.split("=");
      pathParams[name] = value;
    } else {
      pathParams[raw] = undefined;
    }
  }
  // Add :param without defaults
  for (const m of pathPart.matchAll(/\/:([A-Za-z0-9_]+)/g)) {
    const name = m[1];
    if (!(name in pathParams)) pathParams[name] = undefined;
  }

  const queryParams = {};
  if (queryPart) {
    const urlSearchParams = new URLSearchParams(queryPart);
    for (const [key, value] of urlSearchParams.entries()) {
      if (/\{[^}]+\}/.test(value)) {
        queryParams[value.replace(/{|}/g, "")] = undefined;
      } else {
        queryParams[key] = value;
      }
    }
  }

  return { pathParams, queryParams };
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
    if (paramValue !== "" && paramValue !== undefined) {
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

/**
 * Merge GET parameters from both path-level and operation-level definitions in the OpenAPI schema.
 *
 * OpenAPI allows parameters to be defined at the path-item level (e.g., /users/{id})
 * and/or at the operation level (e.g., GET /users/{id}). This helper collects and
 * deduplicates them by (in, name).
 *
 * @param {Object} apiSchema - The OpenAPI schema object.
 * @param {string} apiRoute - The path key in the schema (e.g., "/users/{id}").
 * @returns {Array<Object>} - Array of parameter objects for the GET operation.
 */
export function getGetParameters(apiSchema, apiRoute) {
  const pathItem = apiSchema.paths?.[apiRoute] || {};
  const pathLevelParams = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];
  const op = pathItem.get || {};
  const opLevelParams = Array.isArray(op.parameters) ? op.parameters : [];

  const all = [...pathLevelParams, ...opLevelParams];
  const seen = new Set();

  return all.filter((p) => {
    const key = `${p.in}:${p.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
