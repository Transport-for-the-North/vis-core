import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { api } from 'services';

/**
 * Custom hook to fetch and manage feature metadata options from a given layer path.
 * This hook provides options suitable for components like `react-select`.
 *
 * @param {string} layerPath - The path to the layer's metadata used for fetching features.
 * @returns {Object} An object containing options, loading state, and an input handler.
 * @property {Array} options - The array of feature options.
 * @property {boolean} isLoading - Indicates if the data is currently being fetched.
 * @property {Function} handleInputChange - Function to handle input changes for searching features.
 */
export const useLayerFeatureMetadata = (layerPath) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches and filters feature options based on the input value.
   * This function is debounced to prevent excessive API calls.
   */
  const fetchOptions = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch feature metadata from the provided layer path
        const features = await api.geodataService.fetchMetadataFromPath(layerPath);
        // Filter features based on the input value
        const filteredOptions = features
          .filter((feature) =>
            String(feature.name || feature.id)
              .toLowerCase()
              .includes(inputValue.toLowerCase())
          )
          .map((feature) => ({
            value: feature.id,
            label: feature.name || feature.id,
          }));
        setOptions(filteredOptions);
      } catch (error) {
        console.error('Failed to fetch features:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300), // Debounce delay in milliseconds
    [layerPath]
  );

  /**
   * Handles input changes by invoking the debounced fetchOptions function.
   * @param {string} inputValue - The current input value from the search box.
   */
  const handleInputChange = (inputValue) => {
    fetchOptions(inputValue);
  };

  return {
    options,
    isLoading,
    handleInputChange,
  };
};
