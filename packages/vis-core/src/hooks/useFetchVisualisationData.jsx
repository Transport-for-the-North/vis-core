import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import { api } from 'services';

import { DataFetchState } from 'enums';

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
 * Determines the fetch state based on current conditions.
 *
 * @param {Object} params - The parameters to evaluate
 * @param {boolean} params.isLoading - Whether data is currently being fetched
 * @param {boolean} params.hasInitiatedFetch - Whether a fetch has been initiated
 * @param {*} params.error - Any error that occurred
 * @param {Array|Object|null} params.data - The fetched data
 * @param {boolean} params.dataWasReturnedButFiltered - Whether data was filtered to empty
 * @returns {string} - The current DataFetchState
 */
const determineFetchState = ({
  isLoading,
  hasInitiatedFetch,
  error,
  data,
  dataWasReturnedButFiltered,
}) => {
  if (isLoading) {
    return DataFetchState.LOADING;
  }

  if (!hasInitiatedFetch) {
    return DataFetchState.IDLE;
  }

  if (error) {
    return DataFetchState.ERROR;
  }

  if (data === undefined || data === null) {
    // Data hasn't arrived yet - still loading
    return DataFetchState.LOADING;
  }

  if (Array.isArray(data) && data.length === 0 && !dataWasReturnedButFiltered) {
    return DataFetchState.EMPTY;
  }

  return DataFetchState.SUCCESS;
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
 * @returns {{
 *   isLoading: boolean,
 *   data: Array|Object|null,
 *   error: any,
 *   dataWasReturnedButFiltered: boolean,
 *   fetchState: string,
 *   resetFetchState: () => void
 * }}
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
  const [error, setError] = useState(null);
  const [hasInitiatedFetch, setHasInitiatedFetch] = useState(false);

  // Track previous combined params (query + path) to avoid refetching unnecessarily.
  const prevParamsRef = useRef();
  const prevVisualisationNameRef = useRef();

  /**
   * - React StrictMode (dev) mounts/unmounts quickly; a 400ms debounced call can be cancelled
   *   before it fires, so params signature would still be consumed.
   *
   * This ref stores the signature for the *scheduled* fetch and is only committed to
   * prevParamsRef when the debounced fetch actually begins executing.
   */
  const pendingParamsSignatureRef = useRef(null);

  /**
   * Resets the fetch state - useful when visualisation changes (e.g., page navigation).
   */
  const resetFetchState = useCallback(() => {
    setHasInitiatedFetch(false);
    setRawData(null);
    setFilteredData(null);
    setError(null);
    setLoading(false);
    prevParamsRef.current = undefined;
    pendingParamsSignatureRef.current = null; // keep in sync
  }, []);

  // Reset state when visualisation name changes (page navigation)
  useEffect(() => {
    const currentName = visualisation?.name;
    
    if (prevVisualisationNameRef.current !== undefined && 
        prevVisualisationNameRef.current !== currentName) {
      resetFetchState();
    }
    
    prevVisualisationNameRef.current = currentName;
  }, [visualisation?.name, resetFetchState]);

  /**
   * Debounced function to fetch data from the API.
   * Defined via useMemo so it is stable and can be safely cancelled in cleanup.
   */
  const fetchDataForVisualisation = useMemo(
    () =>
      debounce(async (vis) => {
        if (!vis) return;

        /**
         * Commit the params signature only when the fetch actually starts.
         * This prevents "scheduled then cancelled" from blocking future fetches.
         */
        if (pendingParamsSignatureRef.current) {
          prevParamsRef.current = pendingParamsSignatureRef.current;
          pendingParamsSignatureRef.current = null;
        }

        setLoading(true);
        setHasInitiatedFetch(true);
        setError(null);

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

          // If no viewport filtering is requested or not possible, mirror to filteredData.
          if (!map || !mapLayerId || !shouldFilterDataToViewport) {
            setFilteredData(responseData);
          }

          if (Array.isArray(responseData) && responseData.length === 0) {
            console.warn('No data returned for visualisation:', visualisationName);
          }
        } catch (e) {
          console.error('Error fetching data for visualisation:', e);
          setError(e);
        } finally {
          setLoading(false);
        }
      }, 400),
    [map, mapLayerId, shouldFilterDataToViewport]
  );

  // Cancel any pending debounced call on unmount to avoid setting state after unmount.
  useEffect(() => {
    return () => {
      fetchDataForVisualisation.cancel();
    };
  }, [fetchDataForVisualisation]);

  // Fetch data whenever visualisation.queryParams or visualisation.pathParams change.
  useEffect(() => {
    const { queryParams = {}, pathParams = {} } = visualisation || {};

    // Only proceed if all required parameters (query and path) are present.
    const allRequiredParamsPresent =
      areAllRequiredParamsPresent(queryParams) &&
      areAllRequiredParamsPresent(pathParams);

    // Track a combined signature of both param maps to detect changes.
    const currentParamsStr = JSON.stringify({ queryParams, pathParams });

    const paramsChanged = prevParamsRef.current !== currentParamsStr;

    if (allRequiredParamsPresent && paramsChanged) {
      /**
       * Store signature as "pending" and schedule the debounced fetch.
       * Then immediately flush to ensure the initial call isn't lost to rapid
       * mount/unmount cycles (e.g. React 18 StrictMode dev).
       */
      pendingParamsSignatureRef.current = currentParamsStr;

      fetchDataForVisualisation(visualisation);
      fetchDataForVisualisation.flush?.();
    }
  }, [
    visualisation,
    visualisation?.queryParams,
    visualisation?.pathParams,
    fetchDataForVisualisation,
  ]);

  // Refilter the raw data when the map viewport changes.
  useEffect(() => {
    // Only run if both map and mapLayerId are provided and when rawData is available.
    if (!map || !mapLayerId || rawData === null || !shouldFilterDataToViewport) return;
    if (!Array.isArray(rawData)) {
      // Only arrays can be filtered by record.id; keep original otherwise.
      setFilteredData(rawData);
      return;
    }

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
      applyViewportFilter.cancel?.();
    };
  }, [map, mapLayerId, rawData, shouldFilterDataToViewport]);

  // Compute derived values
  const data = filteredData ?? rawData;
  
  const dataWasReturnedButFiltered =
    rawData !== null &&
    Array.isArray(rawData) &&
    rawData.length > 0 &&
    Array.isArray(filteredData) &&
    filteredData.length === 0;

  // Determine the current fetch state
  const fetchState = determineFetchState({
    isLoading,
    hasInitiatedFetch,
    error,
    data,
    dataWasReturnedButFiltered,
  });

  return {
    isLoading,
    data,
    error,
    dataWasReturnedButFiltered,
    fetchState,
    resetFetchState,
  };
};
