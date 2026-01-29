import { useCallback, useEffect, useRef } from 'react';

import { isValidPaintExpression, isValidPaintValue, applyPaintProperties } from 'utils/map';

// Constants
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 150,
};

/**
 * Creates a retry manager for handling async operations with exponential backoff.
 */
const createRetryManager = () => {
  const pendingOperations = new Map();

  const schedule = (key, operation, delay) => {
    const timeoutId = setTimeout(() => {
      pendingOperations.delete(key);
      operation();
    }, delay);

    pendingOperations.set(key, timeoutId);
    return key;
  };

  const cancel = (key) => {
    const timeoutId = pendingOperations.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pendingOperations.delete(key);
    }
  };

  const cancelAll = () => {
    pendingOperations.forEach((timeoutId) => clearTimeout(timeoutId));
    pendingOperations.clear();
  };

  const hasPending = (key) => pendingOperations.has(key);

  return { schedule, cancel, cancelAll, hasPending };
};

/**
 * Updates feature states on the map for the given data.
 */
const updateFeatureStates = (map, layer, data, prevIDs) => {
  const safeData = Array.isArray(data) ? data : [];
  const newIDs = new Set();

  // Update feature states for new data
  safeData.forEach((row) => {
    // Skip rows with invalid id or value
    if (row.id == null) {
      return;
    }
    
    const id = Number(row.id);
    
    // Skip if id is not a valid number
    if (!Number.isFinite(id)) {
      return;
    }
    
    // Ensure value is a valid number, default to 0 if null/undefined
    const value = row.value != null && Number.isFinite(Number(row.value)) 
      ? Number(row.value) 
      : 0;
    
    newIDs.add(id);
    
    map.setFeatureState(
      {
        source: layer.name,
        sourceLayer: layer.sourceLayer,
        id,
      },
      {
        value: value,
        valueAbs: Math.abs(value),
      }
    );
  });

  // Remove stale feature states
  prevIDs.forEach((id) => {
    if (!newIDs.has(id)) {
      map.removeFeatureState({
        source: layer.name,
        sourceLayer: layer.sourceLayer,
        id,
      });
    }
  });

  return newIDs;
};


/**
 * Custom hook for updating Maplibre GL JS feature state efficiently.
 *
 * This hook exposes a function that updates the feature state for a specific layer.
 * It maintains an internal mapping of layer names to Sets of feature IDs and performs
 * differential updates to minimize unnecessary operations.
 *
 * @returns {Object} An object containing the addFeaturesToMap function.
 */
export const useFeatureStateUpdater = () => {
  const layerStatesRef = useRef(new Map());
  const retryManagerRef = useRef(createRetryManager());

  // Cleanup on unmount
  useEffect(() => {
    const retryManager = retryManagerRef.current;
    
    return () => {
      retryManager.cancelAll();
      layerStatesRef.current.clear();
    };
  }, []);

  /**
   * Finds the layer configuration from the layers object.
   */
  const findLayer = useCallback((layers, layerName) => {
    return Object.values(layers).find((layer) => layer.name === layerName);
  }, []);

  /**
   * Updates the Maplibre GL JS feature state for a specific layer based on new data.
   *
   * @param {object} map - The Maplibre GL JS map instance.
   * @param {object} paintProperty - Paint properties to update the map's layer.
   * @param {object} layers - Layer definitions object.
   * @param {Array<Object>} data - Data rows with "id" and "value" properties.
   * @param {string} colorStyle - The color style for the layer.
   * @param {string} layerName - The target layer name.
   */
  const addFeaturesToMap = useCallback(
    (map, paintProperty, layers, data, colorStyle, layerName) => {
      const { maxRetries, baseDelay } = RETRY_CONFIG;
      const retryManager = retryManagerRef.current;

      const performUpdate = (retryCount = 0) => {
        // Find the layer configuration
        const specifiedLayer = findLayer(layers, layerName);
        if (!specifiedLayer) {
          console.warn(`Layer config for ${layerName} not found`);
          return;
        }

        // Check if layer exists on map
        if (!map.getLayer(specifiedLayer.name)) {
          if (retryCount < maxRetries) {
            const operationKey = `${layerName}-retry-${retryCount}`;
            const delay = baseDelay * (retryCount + 1);
            
            retryManager.schedule(operationKey, () => performUpdate(retryCount + 1), delay);
            return;
          }
          
          console.warn(`Layer ${layerName} not on map after ${maxRetries} retries`);
          return;
        }

        // Check if layer is stylable
        if (!specifiedLayer.isStylable) {
          return;
        }

        // Get the layer from map and update metadata
        const layerFromMap = map.getLayer(specifiedLayer.name);
        layerFromMap.metadata = {
          ...layerFromMap.metadata,
          colorStyle,
        };

        // Apply paint properties if not preserving base style
        if (paintProperty && !specifiedLayer.preserveBaseStyle) {
          applyPaintProperties(map, specifiedLayer.name, paintProperty);
        }

        // Get previous feature IDs for this layer
        const prevIDs = layerStatesRef.current.get(specifiedLayer.name) || new Set();

        try {
          const newIDs = updateFeatureStates(map, specifiedLayer, data, prevIDs);
          
          // Store updated feature IDs
          layerStatesRef.current.set(specifiedLayer.name, newIDs);

          // Apply filter if preserving base style
          if (specifiedLayer.preserveBaseStyle) {
            map.setFilter(specifiedLayer.name, [
              'in',
              ['get', 'id'],
              ['literal', Array.from(newIDs)],
            ]);
          }
        } catch (error) {
          console.error(`Error updating feature states for ${layerName}:`, error);
        }
      };

      performUpdate();
    },
    [findLayer]
  );

  /**
   * Clears all tracked feature states for a specific layer.
   * Useful when completely resetting a layer's visualization.
   */
  const clearLayerState = useCallback((layerName) => {
    layerStatesRef.current.delete(layerName);
  }, []);

  /**
   * Gets the current tracked feature IDs for a layer.
   * Useful for debugging or external state management.
   */
  const getLayerFeatureIds = useCallback((layerName) => {
    return layerStatesRef.current.get(layerName) || new Set();
  }, []);

  return { 
    addFeaturesToMap, 
    clearLayerState, 
    getLayerFeatureIds 
  };
};