import { useState, useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { api } from 'services';

const PAGE_SIZE = 50;

/**
 * Custom hook to fetch and cache layer feature metadata.
 * 
 * @param {string} layerPath - The path to the layer for which metadata is fetched.
 * @returns {object} - An object containing options, loading state, and input change handler, menu open handler, and scroll handler.
 */
export const useLayerFeatureMetadata = (layerPath) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const allFilteredRef = useRef([]);
  const pageRef = useRef(1);
  const cache = useRef({});
  const layerPathRef = useRef(layerPath); 

  // Keep layerPathRef in sync with latest layerPath
  useEffect(() => {
    layerPathRef.current = layerPath;
  }, [layerPath]);

  /**
   * Fetch options based on the input value, using a debounced function to limit API calls.
   * 
   * @param {string} inputValue - The current input value to filter options.
   */
  const fetchOptions = useCallback(
    debounce(async (inputValue) => {
      const cacheKey = inputValue || '';

      // Reset page on every new search/open
      pageRef.current = 1;

      // Check if the result is already in the cache
      if (cache.current[cacheKey]) {
        allFilteredRef.current = cache.current[cacheKey];
        setOptions(allFilteredRef.current.slice(0, PAGE_SIZE));
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch feature metadata from the provided layer path
        const features = await api.geodataService.fetchMetadataFromPath(layerPathRef.current);
        // Filter features based on the input value
        const filteredOptions = features
          .filter((feature) =>
            !cacheKey ||
            String(feature.name || feature.id)
              .toLowerCase()
              .includes(cacheKey.toLowerCase())
          )
          .map((feature) => ({
            value: feature.id,
            label: feature.name || feature.id,
          }));

        // Update the cache with the new result
        cache.current[cacheKey] = filteredOptions;
        allFilteredRef.current = filteredOptions;

        setOptions(filteredOptions.slice(0, PAGE_SIZE));
      } catch (error) {
        console.error('Failed to fetch features:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Reset state and fetch fresh options when layerPath changes.
  // Cleanup cancels any pending debounced calls from the previous layerPath.
  useEffect(() => {
    cache.current = {};
    allFilteredRef.current = [];
    pageRef.current = 1;
    setOptions([]);
    fetchOptions('');

    return () => fetchOptions.cancel();
  }, [layerPath, fetchOptions]);

  /**
   * Handle input change by fetching options based on the new input value.
   * 
   * @param {string} inputValue - The new input value.
   */
  const handleInputChange = (inputValue) => {
    fetchOptions(inputValue);
  };

  /**
   * Handle menu open by fetching the initial list of features.
   */
  const handleMenuOpen = () => {
    fetchOptions('');
  };

  /**
   * Handle scroll to bottom by appending the next page of results.
   */
  const handleMenuScrollToBottom = () => {
    const nextPage = pageRef.current + 1;
    const nextOptions = allFilteredRef.current.slice(0, nextPage * PAGE_SIZE);

    // Only update if there are more items to show
    if (nextOptions.length > options.length) {
      pageRef.current = nextPage;
      setOptions(nextOptions);
    }
  };

  return {
    options,
    isLoading,
    handleInputChange,
    handleMenuOpen,
    handleMenuScrollToBottom,
  };
};