import { useCallback, useRef } from 'react';

/**
 * Custom hook for updating Maplibre GL JS feature state efficiently.
 *
 * This hook exposes a function that updates the feature state for a specific layer.
 * Instead of removing all feature states and then updating them, it:
 *   1. Updates the feature state on a per-feature basis using map.setFeatureState.
 *   2. Removes the feature state for any feature that existed previously but is not
 *      present in the latest data.
 *
 * To achieve this, the hook maintains an internal mapping (using a React ref) of layer names
 * to Sets of feature IDs that have been updated. When new data is provided, the hook:
 *   - Builds a Set of new feature IDs.
 *   - Updates (or creates) feature state for all features in the new data.
 *   - Compares the previously stored Set of feature IDs for the layer against the new Set to remove
 *     any stale feature state.
 *
 * This approach avoids waiting for render events.
 *
 * @example
 * // In your component:
 * const { addFeaturesToMap } = useFeatureStateUpdater();
 * 
 * useEffect(() => {
 *   addFeaturesToMap(map, paintProperty, layers, data, 'myLayer');
 * }, [map, paintProperty, layers, data]);
 *
 * @returns {Object} An object containing the addFeaturesToMap function.
 */
export const useFeatureStateUpdater = () => {
  /**
   * A React ref to keep track of previously updated feature IDs for each layer.
   * The key is the layer name and the value is a Set of numbers representing feature IDs.
   *
   * @type {Object.<string, Set<number>>}
   */
  const layerStatesRef = useRef({});
  const pendingOperationsRef = useRef({});

  /**
   * Updates the Maplibre GL JS feature state for a specific layer based on new data.
   *
   * This function performs the following steps:
   * 1. Finds the specified layer within the provided layers object.
   * 2. Sets additional metadata on the layer if necessary (for example, a colorStyle from the paint property).
   * 3. Updates paint properties on the layer. If the layer paint properties are configured with transitions
   *    (such as `'-transition'` options), these transitions will create smooth visual updates for state changes.
   * 4. Constructs a Set of new feature IDs from the incoming data.
   * 5. Iterates over the data to update or create feature state using map.setFeatureState.
   * 6. Iterates over the previously stored feature IDs and removes the feature state for any features that are
   *    no longer present in the incoming data.
   * 7. Updates the internal tracking ref with the new feature IDs for subsequent updates.
   *
   * @param {object} map - The Maplibre GL JS map instance.
   * @param {object} paintProperty - An object of paint properties to update the map's layer.
   *                                 It may include custom properties such as colorStyle.
   * @param {object} layers - An object containing layer definitions.
   * @param {Array<Object>} data - An array of data rows. Each row should have an "id" property
   *                               and a "value" property used for feature state.
   * @param {string} layerName - The name of the target layer to update.
   *
   * @example
   * addFeaturesToMap(map, { 'fill-color': ['interpolate', ['linear'], ['feature-state', 'value'], 0, 'blue', 100, 'red'], colorStyle: 'myColorStyle' }, layers, data, 'myLayer');
   */
  const addFeaturesToMap = useCallback(
    (map, paintProperty, layers, data, colorStyle, layerName, retryCount = 0) => {
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 150;

      // Find the specified layer in the layers object.
      const specifiedLayer = Object.values(layers).find(
        (layer) => layer.name === layerName
      );

      // If layer not found but retries remain, schedule retry
      if (!specifiedLayer) {
        console.warn(`Layer config for ${layerName} not found`);
        return;
      }

      // Check if layer exists on map, if not and retries remain, retry
      if (!map.getLayer(specifiedLayer.name)) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Layer ${layerName} not on map yet, scheduling retry ${retryCount + 1}/${MAX_RETRIES}`);
          
          // Store pending operation
          const operationKey = `${layerName}-${Date.now()}`;
          pendingOperationsRef.current[operationKey] = true;
          
          setTimeout(() => {
            if (pendingOperationsRef.current[operationKey]) {
              delete pendingOperationsRef.current[operationKey];
              addFeaturesToMap(map, paintProperty, layers, data, colorStyle, layerName, retryCount + 1);
            }
          }, RETRY_DELAY * (retryCount + 1)); // Exponential backoff
          
          return;
        } else {
          console.warn(`Layer ${layerName} not on map after ${MAX_RETRIES} retries, giving up`);
          return;
        }
      }

      // Check isStylable
      if (!specifiedLayer.isStylable) {
        console.log(`Layer ${layerName} is not stylable, skipping`);
        return;
      }

      // If we got here after retries, log success
      if (retryCount > 0) {
        console.log(`Successfully found layer ${layerName} after ${retryCount} retries`);
      }

      // Retrieve the layer from the map.
      const layerFromMap = map.getLayer(specifiedLayer.name);

      // Update the layer's metadata with additional paint properties (e.g., colorStyle).
      layerFromMap.metadata = {
        ...layerFromMap.metadata,
        colorStyle: colorStyle,
      };

      const preserveBaseStyle = specifiedLayer.preserveBaseStyle === true; 

      // Update the layer's paint properties.Even if there is no data so that it resets.
      // If transitions are defined (e.g., 'fill-color-transition'), they will animate state changes smoothly.
      if (paintProperty && !preserveBaseStyle){
        Object.entries(paintProperty).forEach(([key, value]) => {
        map.setPaintProperty(specifiedLayer.name, key, value);
      });
      }


      // Create a Set of new feature IDs from the provided data.
      const safeData = Array.isArray(data) ? data : []; // Ensure data is an array.
      const newIDs = new Set(safeData.map((row) => Number(row.id)));

      // Retrieve the previous set of feature IDs for this layer from the ref, or initialize as an empty Set.
      const prevIDs = layerStatesRef.current[specifiedLayer.name] || new Set();

      // For each row in the new data, update the feature state with the new values.
      safeData.forEach((row) => {
        const id = Number(row.id);
        map.setFeatureState(
          {
            source: specifiedLayer.name,
            sourceLayer: specifiedLayer.sourceLayer,
            id,
          },
          {
            value: row.value,
            valueAbs: Math.abs(row.value),
          }
        );
      });

      // Remove feature state for features that were updated previously but are not present in the new data.
      prevIDs.forEach((id) => {
        if (!newIDs.has(id)) {
          map.removeFeatureState({
            source: specifiedLayer.name,
            sourceLayer: specifiedLayer.sourceLayer,
            id,
          });
        }
      });

      // Save the updated set of feature IDs for this layer for use in subsequent updates.
      layerStatesRef.current[specifiedLayer.name] = newIDs;

      if (preserveBaseStyle){ 
        map.setFilter(specifiedLayer.name, [
          'in',
          ['get', 'id'],
          ['literal', Array.from(newIDs)],
        ]);
      }
    },
    []
  );

  return { addFeaturesToMap };
};
