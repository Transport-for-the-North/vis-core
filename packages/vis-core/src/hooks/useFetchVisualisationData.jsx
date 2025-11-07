import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { api } from 'services';

/**
 * Helper: Filters the full dataset based on IDs visible in the map.
 *
 * @param {Array} data - The full dataset (each record must have an id).
 * @param {Object} map - The map instance (e.g. a Mapbox GL JS map).
 * @param {string} mapLayerId - The ID of the map layer that holds the rendered features.
 * @returns {Array} - The subset of data visible in the current viewport.
 */
const filterDataToViewport = (data, map, mapLayerId) => {
  // Query rendered features on the given layer.
  const visibleFeatures = map.queryRenderedFeatures({ layers: [mapLayerId] });
  // Create a set of visible IDs (assuming each feature has an id or feature.properties.id)
  const visibleIDs = new Set(
    visibleFeatures.map((feature) => feature.id || feature.properties?.id)
  );
  // Return only records whose id is in the visibleIDs set.
  return data.filter((record) => visibleIDs.has(record.id));
};

/**
 * Helper: Converts a visualisation params map (queryParams/pathParams) to a plain
 * { key: value } object suitable for API calls. Excludes null/undefined values.
 *
 * @param {Object<string, {value:any, required?:boolean}>} paramsMap - Map of param definitions.
 * @returns {Object} - A plain object of key/value pairs for the API.
 */
const toSimpleParamsMap = (paramsMap = {}) => {
  return Object.fromEntries(
    Object.entries(paramsMap)
      .filter(([, { value }]) => value !== null && value !== undefined)
      .map(([key, { value }]) => [key, value])
  );
};

/**
 * Helper: Checks whether all required params in a map have a non-null/undefined value.
 *
 * @param {Object<string, {value:any, required?:boolean}>} paramsMap - Map of param definitions.
 * @returns {boolean} - True if every required param is satisfied; false otherwise.
 */
const areAllRequiredParamsPresent = (paramsMap = {}) => {
  return Object.values(paramsMap).every(
    (param) => !param.required || (param.required && param.value !== null && param.value !== undefined)
  );
};

/**
 * Custom hook to fetch data for a visualisation and (optionally) filter that data
 * to only include records visible in the map viewport.
 *
 * Supports both queryParams and pathParams. For pathParams, any placeholders
 * in visualisation.dataPath (e.g., /resource/:id or /resource/{id}) will be
 * substituted by BaseService using the provided pathParams values.
 *
 * @param {Object} visualisation - The visualisation object containing details like dataPath, queryParams, and pathParams.
 * @param {string} visualisation.dataPath - The API endpoint to fetch data from (may contain path placeholders).
 * @param {Object} visualisation.queryParams - The query parameters to include in the API request (shape: {key: {value, required}}).
 * @param {Object} [visualisation.pathParams] - The path parameters to include in the API request (shape: {key: {value, required}}).
 * @param {boolean} visualisation.requiresAuth - Indicates if the request requires authentication.
 * @param {string} visualisation.name - The name of the visualisation.
 * @param {Object} [map] - (Optional) The map instance used for filtering by viewport.
 * @param {string} [mapLayerId] - (Optional) The map layer ID that contains the rendered features.
 * @param {boolean} [shouldFilterDataToViewport=false] - Whether to filter the returned data against the visible map viewport.
 *
 * @returns {Object} - An object containing the loading state and fetched data.
 * @property {boolean} isLoading - Indicates if the data is currently being fetched.
 * @property {Array|Object|null} data - The (possibly filtered) data fetched for the visualisation.
 * @property {boolean} dataWasReturnedButFiltered - True when raw data exists but filtering produced an empty set.
 */
export const useFetchVisualisationData = (
  visualisation,
  map,
  mapLayerId,
  shouldFilterDataToViewport = false
) => {
  const [isLoading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  // filteredData is the viewport‑filtered version of the data.
  const [filteredData, setFilteredData] = useState(null);

  // Track previous combined params (query + path) to avoid refetching unnecessarily.
  const prevParamsRef = useRef();

  // Debounced function to fetch data from the API.
  const fetchDataForVisualisation = debounce(async (vis) => {
    if (!vis) return;

    setLoading(true);

    const {
      dataPath: path,
      queryParams = {},
      pathParams = {},
      requiresAuth,
      name: visualisationName,
    } = vis;

    // Flatten params maps into simple key/value objects
    const queryParamsForApi = toSimpleParamsMap(queryParams);
    const pathParamsForApi = toSimpleParamsMap(pathParams);

    try {
      const responseData = await api.baseService.get(path, {
        pathParams: pathParamsForApi,
        queryParams: queryParamsForApi,
        skipAuth: !requiresAuth,
      });
      setRawData(responseData);
      // If no viewport filtering is requested, set filteredData immediately.
      if (!map || !mapLayerId) {
        setFilteredData(responseData);
      }
      if (Array.isArray(responseData) && responseData.length === 0) {
        console.warn('No data returned for visualisation:', visualisationName);
      }
    } catch (error) {
      console.error('Error fetching data for visualisation:', error);
    } finally {
      setLoading(false);
    }
  }, 400); // Delay of 400 milliseconds

  // Fetch data whenever visualisation.queryParams or visualisation.pathParams change.
  useEffect(() => {
    const { queryParams = {}, pathParams = {} } = visualisation || {};

    // Only proceed if all required parameters (query and path) are present.
    const allRequiredQueryPresent = areAllRequiredParamsPresent(queryParams);
    const allRequiredPathPresent = areAllRequiredParamsPresent(pathParams);
    const allRequiredParamsPresent = allRequiredQueryPresent && allRequiredPathPresent;

    // Track a combined signature of both param maps to detect changes.
    const currentParamsStr = JSON.stringify({ queryParams, pathParams });

    const paramsChanged = prevParamsRef.current !== currentParamsStr;

    if (allRequiredParamsPresent && paramsChanged) {
      fetchDataForVisualisation(visualisation);
      prevParamsRef.current = currentParamsStr;
    }
  }, [visualisation.queryParams, visualisation.pathParams, visualisation, fetchDataForVisualisation]); // include both param maps

  // Set up an effect to refilter the raw data when the map viewport changes.
  useEffect(() => {
    // Only run if both map and mapLayerId are provided and when rawData is available.
    if (!map || !mapLayerId || rawData === null || !shouldFilterDataToViewport) return;

    // Define a debounced filtering function so that rapid viewport changes do not swamp the updates.
    const applyViewportFilter = debounce(() => {
      const visibleData = filterDataToViewport(rawData, map, mapLayerId);
      setFilteredData(visibleData);
    }, 200);

    // Run filtering initially.
    applyViewportFilter();
    // Listen for the map's "moveend" event to reapply filtering when the viewport changes.
    map.on('moveend', applyViewportFilter);
    return () => {
      map.off('moveend', applyViewportFilter);
    };
  }, [map, mapLayerId, rawData, shouldFilterDataToViewport]);

  // Return the filtered data if available; otherwise return the raw data.
  return {
    isLoading,
    data: filteredData || rawData,
    dataWasReturnedButFiltered: rawData !== null && Array.isArray(filteredData) && filteredData.length === 0,
  };
};
