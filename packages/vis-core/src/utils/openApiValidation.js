import { extractParamsWithValuesSeparated, getGetParameters } from "./apiParams";
import { buildParamsMap } from "./config";

const DEFAULT_EXCLUDED_PARAMS = ["x", "y", "z"]; // tile placeholders

const normaliseFiltersToParamNameSet = (filters = []) => {
  const set = new Set();
  if (!Array.isArray(filters)) return set;
  for (const filter of filters) {
    const paramName = filter?.paramName;
    if (typeof paramName === "string" && paramName.trim()) set.add(paramName);
  }
  return set;
};

const normalisePages = (appConfig) => {
  const pages = appConfig?.appPages;
  if (!pages) return [];
  return Array.isArray(pages) ? pages : [];
};

const normaliseRouteForLookup = (apiRoute) => {
  if (typeof apiRoute !== "string") return "";

  const trimmed = apiRoute.trim();
  if (!trimmed) return "";

  const routePath = /^[A-Za-z][A-Za-z\d+.-]*:\/\//.test(trimmed)
    ? new URL(trimmed).pathname
    : trimmed.split("?")[0];

  return routePath.replace(/\/+$/, "") || "/";
};

const buildSchemaPathLowerCaseLookup = (apiSchema) => {
  const lookup = new Map();
  const schemaPaths = Object.keys(apiSchema?.paths || {});

  for (const schemaPath of schemaPaths) {
    const trimmed = schemaPath.trim();
    if (!trimmed) continue;

    if (!lookup.has(trimmed.toLowerCase())) {
      lookup.set(trimmed.toLowerCase(), trimmed);
    }

    // Also index the normalised form so route variants (query strings, trailing slashes)
    // still resolve to the canonical schema path.
    const normalised = normaliseRouteForLookup(trimmed);
    if (normalised && !lookup.has(normalised.toLowerCase())) {
      lookup.set(normalised.toLowerCase(), trimmed);
    }
  }

  return lookup;
};

const resolveSchemaRoute = (apiSchema, apiRoute, lowerCaseLookup) => {
  const schemaPaths = apiSchema?.paths || {};
  const trimmedRoute = typeof apiRoute === "string" ? apiRoute.trim() : "";

  // Prefer exact matches first to avoid changing behavior when route casing already matches.
  if (trimmedRoute && Object.prototype.hasOwnProperty.call(schemaPaths, trimmedRoute)) {
    return trimmedRoute;
  }

  const normalisedRoute = normaliseRouteForLookup(trimmedRoute);
  if (normalisedRoute && Object.prototype.hasOwnProperty.call(schemaPaths, normalisedRoute)) {
    return normalisedRoute;
  }

  if (trimmedRoute) {
    // Fallback to case-insensitive lookup so "/API/FOO" resolves to "/api/foo".
    const matchedTrimmed = lowerCaseLookup.get(trimmedRoute.toLowerCase());
    if (matchedTrimmed) return matchedTrimmed;
  }

  if (normalisedRoute) {
    const matchedNormalised = lowerCaseLookup.get(normalisedRoute.toLowerCase());
    if (matchedNormalised) return matchedNormalised;
  }

  return null;
};

const getEffectiveParamsMaps = (apiSchema, apiRoute, filters) => {
  const apiParameters = getGetParameters(apiSchema, apiRoute);
  const queryParams = buildParamsMap(apiParameters, "query", filters);
  const pathParams = buildParamsMap(apiParameters, "path", filters);

  // Mirror MapContext behavior: if schema has no required params, treat all as required.
  const hasRequired = apiParameters.some((p) => Boolean(p?.required));
  if (!hasRequired) {
    Object.keys(queryParams).forEach((k) => {
      queryParams[k].required = true;
    });
    Object.keys(pathParams).forEach((k) => {
      pathParams[k].required = true;
    });
  }

  return { apiParameters, queryParams, pathParams };
};

/**
 * Validate that each page config has filters that cover required OpenAPI params.
 *
 * This is intended as a lightweight, always-on developer aid. It performs no
 * network calls and only runs against an already-fetched OpenAPI/Swagger schema.
 *
 * What it checks (for each page):
 * - Every visualisation `dataPath` exists in the schema (warning if missing).
 * - Every required query/path param (as interpreted by MapContext) is either:
 *   - provided by a filter `paramName`, OR
 *   - has a schema default, OR
 *   - is hard-coded in the URL (e.g. `?dataset_id=...`), OR
 *   - is one of the excluded params (default: x/y/z).
 *
 * @param {Object} appConfig - The app config object (typically AppContext value).
 * @param {Object} apiSchema - OpenAPI schema.
 * @param {Object} [options]
 * @param {string[]} [options.excludedParams] - Params to ignore.
 * @returns {{errors: Array, warnings: Array}} Validation results.
 */
export function validateAppConfigAgainstOpenApi(appConfig, apiSchema, options = {}) {
  const excludedParams = Array.isArray(options.excludedParams)
    ? options.excludedParams
    : DEFAULT_EXCLUDED_PARAMS;

  const errors = [];
  const warnings = [];
  const schemaPathLowerCaseLookup = buildSchemaPathLowerCaseLookup(apiSchema);

  const pages = normalisePages(appConfig);
  if (!pages.length) return { errors, warnings };

  for (const page of pages) {
    const pageName = page?.pageName || page?.name || page?.id || "(unknown page)";
    const pageConfig = page?.config;

    const pageFilters = pageConfig?.filters || [];
    const downloadFilters = pageConfig?.additionalFeatures?.download?.filters || [];
    const paramNameSet = new Set([
      ...normaliseFiltersToParamNameSet(pageFilters),
      ...normaliseFiltersToParamNameSet(downloadFilters),
    ]);

    const endpoints = [];
    const visualisations = pageConfig?.visualisations;
    if (Array.isArray(visualisations)) {
      for (const vis of visualisations) {
        if (typeof vis?.dataPath === "string" && vis.dataPath.trim()) {
          endpoints.push({ kind: "visualisation", name: vis?.name, route: vis.dataPath });
        }
      }
    }

    const downloadPath = pageConfig?.additionalFeatures?.download?.downloadPath;
    if (typeof downloadPath === "string" && downloadPath.trim()) {
      endpoints.push({ kind: "download", name: "download", route: downloadPath });
    }

    for (const endpoint of endpoints) {
      const apiRoute = endpoint.route;
      const resolvedSchemaRoute = resolveSchemaRoute(apiSchema, apiRoute, schemaPathLowerCaseLookup);

      if (!resolvedSchemaRoute) {
        warnings.push({
          type: "missing_schema_path",
          pageName,
          kind: endpoint.kind,
          endpointName: endpoint.name,
          route: apiRoute,
          message: `Route not found in OpenAPI schema: ${apiRoute}`,
        });
        // If the route isn't in the schema, we cannot validate required params.
        continue;
      }

      const { queryParams, pathParams } = getEffectiveParamsMaps(apiSchema, resolvedSchemaRoute, pageFilters);

      const { pathParams: specifiedPathParams, queryParams: specifiedQueryParams } =
        extractParamsWithValuesSeparated(apiRoute);

      const validateMap = (paramsMap, location, specifiedMap) => {
        for (const [paramName, def] of Object.entries(paramsMap || {})) {
          if (!def?.required) continue;
          if (excludedParams.includes(paramName)) continue;

          const hasSchemaDefault = def.value !== null && def.value !== undefined;
          const isHardCodedInUrl = Object.prototype.hasOwnProperty.call(specifiedMap, paramName) &&
            specifiedMap[paramName] !== undefined &&
            specifiedMap[paramName] !== "";
          const isProvidedByFilter = paramNameSet.has(paramName);

          if (hasSchemaDefault || isHardCodedInUrl || isProvidedByFilter) continue;

          errors.push({
            type: "missing_paramName",
            pageName,
            kind: endpoint.kind,
            endpointName: endpoint.name,
            route: apiRoute,
            location,
            paramName,
            message: `Missing filter paramName '${paramName}' for required ${location} param on ${apiRoute}`,
          });
        }
      };

      validateMap(pathParams, "path", specifiedPathParams);
      validateMap(queryParams, "query", specifiedQueryParams);
    }
  }

  return { errors, warnings };
}
