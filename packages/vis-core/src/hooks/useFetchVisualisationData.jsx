import React, { useEffect, useRef, useState, useMemo, useCallback, useContext } from 'react';
import { debounce } from 'lodash';
import { api } from 'services';

import { DataFetchState } from 'enums';

// --- NEW HELPER FUNCTIONS FOR SPATIAL MATHS ---

/**
 * Checks if the inner bounding box is completely contained within the outer bounding box.
 */
const isBboxContained = (inner, outer) => {
  if (!inner || !outer) return false;
  return (
    inner.west >= outer.west &&
    inner.east <= outer.east &&
    inner.south >= outer.south &&
    inner.north <= outer.north
  );
};

/**
 * Expands a bounding box by a given ratio to create a "buffer" zone.
 * Set to 0.2 (20%) to ensure smaller, more frequent requests that accumulate client-side.
 */
const getBufferedBbox = (bounds, ratio = 0.2) => {
  const width = bounds.getEast() - bounds.getWest();
  const height = bounds.getNorth() - bounds.getSouth();
  
  return {
    west: bounds.getWest() - (width * ratio),
    east: bounds.getEast() + (width * ratio),
    south: Math.max(-85.0511, bounds.getSouth() - (height * ratio)),
    north: Math.min(85.0511, bounds.getNorth() + (height * ratio)),
  };
};

/**
 * Snaps a bounding box to a grid by rounding coordinates.
 * This ensures small pans generate the exact same API request, hitting the cache.
 * At this precision, we get roughly 10km grid cells, which is a good balance for caching without overfetching.
 */
const snapBboxToGrid = (bbox, decimals = 1) => {
  const factor = Math.pow(10, decimals);
  return {
    west: Math.floor(bbox.west * factor) / factor,
    south: Math.floor(bbox.south * factor) / factor,
    east: Math.ceil(bbox.east * factor) / factor,
    north: Math.ceil(bbox.north * factor) / factor,
  };
};

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
  const filtered = data.filter((record) => visibleIDs.has(record.id));
  return filtered;
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

  // Track if this is the first fetch so we can bypass the debounce delay on load
  const isFirstFetchRef = useRef(true);
  
  // Refs for spatial caching & accumulation
  const lastFetchedBboxRef = useRef(null);
  const lastFetchedZoomRef = useRef(null);
  const lastNonBboxSignatureRef = useRef(null);
  const accumulatedDataRef = useRef(new Map());

  // Cache for API responses based on query string
  const responseCache = useRef(new Map());
  const maxCacheSize = 20; // Limit cache to avoid excessive memory usage

  // Track abort controller for request cancellation
  const abortControllerRef = useRef(null);

  /**
   * Resets the fetch state - useful when visualisation changes (e.g., page navigation).
   */
  const resetFetchState = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Clear cache for this visualisation
    responseCache.current.clear();
    accumulatedDataRef.current.clear();
    lastFetchedBboxRef.current = null;
    lastFetchedZoomRef.current = null;
    lastNonBboxSignatureRef.current = null;
    
    setHasInitiatedFetch(false);
    setRawData(null);
    setFilteredData(null);
    setError(null);
    setLoading(false);
    prevParamsRef.current = undefined;
    pendingParamsSignatureRef.current = null; // keep in sync

    // Reset the first fetch flag when the visualisation changes
    isFirstFetchRef.current = true;
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

        let fetchBbox = null;
        let currentZoom = null;
        let isBackgroundFetch = false;

        // If configured to filter server-side by viewport, add the current bbox to the query params
        if (shouldFilterDataToViewport && map && typeof map.getBounds === 'function') {
          try {
            const bounds = map.getBounds();
            currentZoom = Math.round(map.getZoom());
            
            const currentExactBbox = {
              west: bounds.getWest(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              north: bounds.getNorth(),
            };

            // 1. Check if non-spatial filters changed (e.g. category dropdown). 
            // If they did, we MUST clear the accumulated data and fetch fresh.
            const nonBboxParams = { ...queryParamsForApi };
            ['west', 'east', 'south', 'north', 'zoom'].forEach(k => delete nonBboxParams[k]);
            const nonBboxSignature = JSON.stringify({ query: nonBboxParams, path: pathParamsForApi });

            if (lastNonBboxSignatureRef.current !== nonBboxSignature) {
              accumulatedDataRef.current.clear();
              lastFetchedBboxRef.current = null;
              lastNonBboxSignatureRef.current = nonBboxSignature;
            } 
            else if (lastFetchedBboxRef.current) {
              // 2. If filters are the same, check if the new viewport is inside our buffered cache
              const isContained = isBboxContained(currentExactBbox, lastFetchedBboxRef.current);
              
              // 3. Check if zoom changed drastically
              const zoomChangedSignificantly = lastFetchedZoomRef.current !== null && 
                                               Math.abs(currentZoom - lastFetchedZoomRef.current) >= 2.0;

              if (isContained && !zoomChangedSignificantly) {
                // ABORT FETCH: We already have this data!
                return; 
              }

              // If we made it here, we need new data, but since filters haven't changed 
              // and we already have some data, we can do this silently in the background.
              if (accumulatedDataRef.current.size > 0) {
                isBackgroundFetch = true;
              }
            }

            // 4. We need new data. Calculate a BUFFERED bbox (20% larger) so small pans don't trigger fetches
            const bufferedBbox = getBufferedBbox(bounds, 0.2);
            fetchBbox = snapBboxToGrid(bufferedBbox, 1);

            queryParamsForApi.west = fetchBbox.west;
            queryParamsForApi.south = fetchBbox.south;
            queryParamsForApi.east = fetchBbox.east;
            queryParamsForApi.north = fetchBbox.north;
            // Optional: include zoom to allow server to choose detail level
            queryParamsForApi.zoom = currentZoom;
          } catch (err) {
            // ignore bbox attach failures
          }
        }

        // Only trigger the blocking loading state if this is NOT a background fetch
        if (!isBackgroundFetch) {
          setLoading(true);
        }
        
        setHasInitiatedFetch(true);
        setError(null);

        // Create a cache key based on the request (including bbox when present)
        const cacheKey = JSON.stringify({ path, queryParamsForApi, pathParamsForApi });

        // Check cache first
        if (responseCache.current.has(cacheKey)) {
          const cachedData = responseCache.current.get(cacheKey);
          
          // If we hit the cache, we still need to merge it into our accumulated data
          if (shouldFilterDataToViewport && Array.isArray(cachedData)) {
            lastFetchedBboxRef.current = fetchBbox;
            lastFetchedZoomRef.current = currentZoom;
            
            cachedData.forEach(item => {
              if (item.id !== undefined && item.id !== null) {
                accumulatedDataRef.current.set(item.id, item);
              }
            });
            
            const mergedData = Array.from(accumulatedDataRef.current.values());
            setRawData(mergedData);
            if (!map || !mapLayerId) setFilteredData(mergedData);
          } else {
            setRawData(cachedData);
            if (!map || !mapLayerId || !shouldFilterDataToViewport) setFilteredData(cachedData);
          }
          
          setLoading(false);
          return;
        }

        // Cancel any previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
          const responseData = await api.baseService.get(path, {
            pathParams: pathParamsForApi,
            queryParams: queryParamsForApi,
            skipAuth: !requiresAuth,
            signal: abortControllerRef.current.signal,
          });

          // Only set data if request wasn't aborted
          if (abortControllerRef.current.signal.aborted) {
            console.log('[Data Fetch] Request was aborted, ignoring response');
            return;
          }

          // Store in cache
          responseCache.current.set(cacheKey, responseData);
          
          // Keep cache size manageable
          if (responseCache.current.size > maxCacheSize) {
            const firstKey = responseCache.current.keys().next().value;
            responseCache.current.delete(firstKey);
          }

          // --- DATA ACCUMULATION LOGIC ---
          let finalDataToSet = responseData;

          if (shouldFilterDataToViewport && Array.isArray(responseData)) {
            // Save our successful fetch parameters
            lastFetchedBboxRef.current = fetchBbox;
            lastFetchedZoomRef.current = currentZoom;

            // Merge new data into our accumulated map using the record ID
            responseData.forEach(item => {
              if (item.id !== undefined && item.id !== null) {
                accumulatedDataRef.current.set(item.id, item);
              }
            });

            // If items have IDs, use the accumulated data. Otherwise fallback to raw response.
            if (accumulatedDataRef.current.size > 0) {
              finalDataToSet = Array.from(accumulatedDataRef.current.values());
            }
          }

          setRawData(finalDataToSet);

          // If no viewport filtering is requested or not possible, mirror to filteredData.
          if (!map || !mapLayerId || !shouldFilterDataToViewport) {
            setFilteredData(finalDataToSet);
          }

          if (Array.isArray(responseData) && responseData.length === 0) {
            console.warn('No data returned for visualisation:', visualisationName);
          }
        } catch (e) {
          // Don't log abort errors
          if (e.name !== 'AbortError') {
            console.error('Error fetching data for visualisation:', e);
            setError(e);
          }
        } finally {
          // Always ensure loading is turned off when the request finishes
          setLoading(false);
        }
      }, 400),
    [map, mapLayerId, shouldFilterDataToViewport]
  );

  // Cancel any pending debounced call on unmount to avoid setting state after unmount.
  useEffect(() => {
    return () => {
      fetchDataForVisualisation.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchDataForVisualisation]);

  // Fetch data whenever visualisation.queryParams or visualisation.pathParams change.
  useEffect(() => {
    const { queryParams = {}, pathParams = {} } = visualisation || {};

    // Only proceed if all required parameters (query and path) are present.
    const allRequiredParamsPresent =
      areAllRequiredParamsPresent(queryParams) &&
      areAllRequiredParamsPresent(pathParams);

    // If required params are missing, skip fetching.
    if (!allRequiredParamsPresent) {
      return;
    }

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

      // CONDITIONAL FLUSH: Only bypass the debounce if it's the very first load
      if (isFirstFetchRef.current) {
        fetchDataForVisualisation.flush?.();
        isFirstFetchRef.current = false;
      }
    }
  }, [
    visualisation,
    visualisation?.queryParams,
    visualisation?.pathParams,
    fetchDataForVisualisation,
  ]);

  // When server-side viewport filtering is enabled, re-fetch data when the map viewport changes.
  useEffect(() => {
    if (!map || !shouldFilterDataToViewport) return;

    const handleMoveEnd = debounce(() => {
      const { queryParams = {}, pathParams = {} } = visualisation || {};
      // Only refetch if required params are present
      if (!areAllRequiredParamsPresent(queryParams) || !areAllRequiredParamsPresent(pathParams)) return;

      // Trigger a fetch which will include the current bbox in the query params
      fetchDataForVisualisation(visualisation);
    }, 250);

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      handleMoveEnd.cancel?.();
    };
  }, [map, shouldFilterDataToViewport, visualisation, fetchDataForVisualisation]);

  // This is disabled due to a race condition -- server-side filtering should be used.
  // // Refilter the raw data when the map viewport changes (client-side filtering).
  // // NOTE: When server-side viewport filtering is enabled (`shouldFilterDataToViewport === true`),
  // // the API will return a dataset already limited to the current bbox. In that mode we should
  // // NOT perform additional client-side filtering against vector tiles (queryRenderedFeatures),
  // // since that previously caused the visualisation to operate at the tile feature level.
  // useEffect(() => {
  //   // Only run client-side filtering when map and mapLayerId are present, rawData is available,
  //   // and server-side viewport filtering is NOT enabled.
  //   if (!map || !mapLayerId || rawData === null || shouldFilterDataToViewport) return;
  //   if (!Array.isArray(rawData)) {
  //     // Only arrays can be filtered by record.id; keep original otherwise.
  //     setFilteredData(rawData);
  //     return;
  //   }

  //   // Define a debounced filtering function so that rapid viewport changes do not swamp the updates.
  //   const applyViewportFilter = debounce(() => {
  //     const visibleData = filterDataToViewport(rawData, map, mapLayerId);
  //     setFilteredData(visibleData);
  //   }, 200);

  //   // Run filtering initially.
  //   applyViewportFilter();
  //   // Listen for the map's "moveend" event to reapply filtering when the viewport changes.
  //   map.on('moveend', applyViewportFilter);
    
  //   return () => {
  //     map.off('moveend', applyViewportFilter);
  //     applyViewportFilter.cancel?.();
  //   };
  // }, [map, mapLayerId, rawData, shouldFilterDataToViewport]);

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
