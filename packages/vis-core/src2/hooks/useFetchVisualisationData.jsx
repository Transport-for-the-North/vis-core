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
 * Custom hook to fetch data for a visualisation and (optionally) filter that data 
 * to only include records visible in the map viewport.
 *
 * @param {Object} visualisation - The visualisation object containing details like dataPath and queryParams.
 * @param {string} visualisation.dataPath - The API endpoint to fetch data from.
 * @param {Object} visualisation.queryParams - The query parameters to include in the API request.
 * @param {boolean} visualisation.requiresAuth - Indicates if the request requires authentication.
 * @param {string} visualisation.name - The name of the visualisation.
 * @param {Object} [map] - (Optional) The map instance used for filtering by viewport.
 * @param {string} [mapLayerId] - (Optional) The map layer ID that contains the rendered features.
 *
 * @returns {Object} - An object containing the loading state and fetched data.
 * @property {boolean} isLoading - Indicates if the data is currently being fetched.
 * @property {Array|Object|null} data - The (possibly filtered) data fetched for the visualisation.
 */
export const useFetchVisualisationData = (visualisation, map, mapLayerId, shouldFilterDataToViewport = false) => {
  const [isLoading, setLoading] = useState(false);
  const [rawData, setRawData] = useState(null);
  // filteredData is the viewport‑filtered version of the data.
  const [filteredData, setFilteredData] = useState(null);
  const prevQueryParamsRef = useRef();

  // Debounced function to fetch data from the API.
  const fetchDataForVisualisation = debounce(async (visualisation) => {
    if (visualisation && visualisation.queryParams) {
      setLoading(true);
      const { dataPath: path, queryParams, requiresAuth, name: visualisationName } = visualisation;

        // Transform queryParams to a simple object of param: value, only including those with a set value
      const queryParamsForApi = Object.fromEntries(
        Object.entries(queryParams)
          .filter(([, { value }]) => value !== null && value !== undefined)
          .map(([key, { value }]) => [key, value])
      );

      try {
        const responseData = await api.baseService.get(path, {
          queryParams: queryParamsForApi,
          skipAuth: !requiresAuth,
        });
        setRawData(responseData);
        // If no viewport filtering is requested, set filteredData immediately.
        if (!map || !mapLayerId) {
          setFilteredData(responseData);
        }
        if (responseData.length === 0) {
          console.warn('No data returned for visualisation:', visualisationName);
        }
      } catch (error) {
        console.error('Error fetching data for visualisation:', error);
      } finally {
        setLoading(false);
      }
    }
    },
    400 // Delay of 400 milliseconds
  );

  // Fetch data whenever visualisation.queryParams change.
  useEffect(() => {
    const currentQueryParamsStr = JSON.stringify(visualisation.queryParams);
    // Only proceed if all required parameters are present.
    const allRequiredParamsPresent = Object.values(visualisation.queryParams).every(
      (param) => !param.required || (param.required && param.value !== null && param.value !== undefined)
    );
    const queryParamsChanged = prevQueryParamsRef.current !== currentQueryParamsStr;

    if (allRequiredParamsPresent && queryParamsChanged) {
      fetchDataForVisualisation(visualisation);
      prevQueryParamsRef.current = currentQueryParamsStr;
    }
  }, [visualisation.queryParams, visualisation]);

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
  return { isLoading, data: filteredData || rawData, dataWasReturnedButFiltered: rawData !== null && filteredData?.length === 0 };
};
