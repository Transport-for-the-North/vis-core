import { useState, useCallback, useRef } from 'react';
import debounce from 'lodash.debounce';
import { api } from '../services';

/**
 * Custom hook to fetch and cache layer feature metadata.
 * 
 * @param {string} layerPath - The path to the layer for which metadata is fetched.
 * @returns {object} - An object containing options, loading state, and input change handler.
 */
export const useLayerFeatureMetadata = (layerPath) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef({});

  /**
   * Fetch options based on the input value, using a debounced function to limit API calls.
   * 
   * @param {string} inputValue - The current input value to filter options.
   */
  const fetchOptions = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      // Check if the result is already in the cache
      if (cache.current[inputValue]) {
        setOptions(cache.current[inputValue]);
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

        // Update the cache with the new result
        cache.current[inputValue] = filteredOptions;
        setOptions(filteredOptions);
      } catch (error) {
        console.error('Failed to fetch features:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [layerPath]
  );

  /**
   * Handle input change by fetching options based on the new input value.
   * 
   * @param {string} inputValue - The new input value.
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