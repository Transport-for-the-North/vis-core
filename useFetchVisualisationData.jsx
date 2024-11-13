import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { api } from 'services';

/**
 * Custom hook to fetch data for a visualisation based on its query parameters.
 *
 * @param {Object} visualisation - The visualisation object containing details like dataPath and queryParams.
 * @param {string} visualisation.dataPath - The API endpoint to fetch data from.
 * @param {Object} visualisation.queryParams - The query parameters to include in the API request.
 * @param {boolean} visualisation.requiresAuth - Indicates if the request requires authentication.
 * @param {string} visualisation.name - The name of the visualisation.
 *
 * @returns {Object} - An object containing the loading state and fetched data.
 * @property {boolean} isLoading - Indicates if the data is currently being fetched.
 * @property {Array|Object|null} data - The data fetched for the visualisation.
 */
export const useFetchVisualisationData = (visualisation) => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const prevQueryParamsRef = useRef();

  // Debounced function to fetch data
  const fetchDataForVisualisation = debounce(
    async (visualisation) => {
      if (visualisation && visualisation.queryParams) {
        setLoading(true);
        const { dataPath: path, queryParams, requiresAuth, name: visualisationName } =
          visualisation;
        try {
          const responseData = await api.baseService.get(path, {
            queryParams,
            skipAuth: !requiresAuth,
          });
          setData(responseData);
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

  // Effect to update the data if queryParams change
  useEffect(() => {
    const currentQueryParamsStr = JSON.stringify(visualisation.queryParams);

    const allParamsPresent = Object.values(visualisation.queryParams).every(
      (param) => param !== null && param !== undefined
    );
    const queryParamsChanged = prevQueryParamsRef.current !== currentQueryParamsStr;

    if (allParamsPresent && queryParamsChanged) {
      fetchDataForVisualisation(visualisation);
      prevQueryParamsRef.current = currentQueryParamsStr;
    }
  }, [visualisation.queryParams, visualisation]);

  // Return loading state and data
  return { isLoading, data };
};
