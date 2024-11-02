import { useEffect, useState } from 'react';
import { useMapContext, useFilterContext } from 'hooks';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { RectangleMode } from '@ookla/mapbox-gl-draw-rectangle';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import * as turf from '@turf/turf';
import { getSourceLayer } from 'utils';

/**
 * Custom hook that enables feature selection on the map based on the current selection mode.
 * It supports 'feature' mode (pointer selection) and 'rectangle' mode (rectangle selection).
 * The hook integrates with Mapbox GL JS and Mapbox Draw without adding draw controls to the map UI.
 *
 * @param {Object} map - The Mapbox GL JS map instance.
 * @param {Object} filterConfig - The filter configuration containing the layer ID and actions.
 */
export const useFeatureSelect = (map, filterConfig) => {
  const { state: mapState, dispatch: mapDispatch } = useMapContext();
  const { selectionMode, isFeatureSelectActive, selectedFeatures } = mapState;
  const { dispatch: filterDispatch } = useFilterContext();
  const [draw, setDraw] = useState(null);
  const selectedFeatureValues = selectedFeatures.value || [];

  useEffect(() => {
    if (!map || !filterConfig) return;

    const { id: filterId, layer, actions } = filterConfig;

    // Initialize Mapbox Draw without any UI controls if it's not already initialized.
    if (!draw) {
      const drawInstance = new MapboxDraw({
        displayControlsDefault: false,
        modes: {
          ...MapboxDraw.modes,
          draw_rectangle: RectangleMode,
        },
        controls: {},
      });
      map.addControl(drawInstance);

      // Store the draw instance in state
      setDraw(drawInstance);
    }

    /**
     * Handles the selection of features and dispatches actions to update the filters and map state.
     *
     * @param {Array} features - The array of selected GeoJSON features.
     */
    const handleSelection = (features) => {
      // Transform features for selectedFeatures context
      const transformedFeatures = features.map((feature) => ({
        value: feature.id, // Feature's ID
        label: feature.properties.name, // Feature's name
      }));

      // Extract feature IDs for the filter value
      const filterValues = features.map((feature) => feature.properties.id);

      // Dispatch the filter update
      filterDispatch({
        type: 'SET_FILTER_VALUE',
        payload: { filterId: filterId, features: filterValues },
      });

      // Dispatch the map update with transformed features
      actions.forEach((action) => {
        mapDispatch({
          type: action.action,
          payload: { value: transformedFeatures },
        });
      });

      // Update the selected features in context
      mapDispatch({
        type: 'SET_SELECTED_FEATURES',
        payload: { value: transformedFeatures },
      });
    };

    /**
     * Event handler for map 'click' events in 'feature' selection mode.
     * Selects features that are clicked by the user.
     *
     * @param {Object} e - The map click event object.
     */
    const handleFeatureClick = (e) => {
      if (selectionMode !== 'feature' || !isFeatureSelectActive) return;

      // Query features at the click point
      const featuresAtPoint = map.queryRenderedFeatures(e.point, {
        layers: [layer],
      });

      if (featuresAtPoint.length > 0) {
        const clickedFeature = featuresAtPoint[0].toJSON();

        // Check if the feature is already selected
        const isFeatureAlreadySelected = selectedFeatureValues.some(
          (feature) => feature.value === clickedFeature.id
        );

        let updatedFeatures;

        // Convert selectedFeatureValues back to GeoJSON features for consistency
        const selectedGeoJSONFeatures = selectedFeatureValues.map((feature) => ({
          type: 'Feature',
          id: feature.value,
          properties: {
            name: feature.label,
            id: feature.value, // Assuming the property 'id' holds feature id
          },
        }));

        if (isFeatureAlreadySelected) {
          // Remove the feature from selected features
          updatedFeatures = selectedGeoJSONFeatures.filter(
            (feature) => feature.id !== clickedFeature.id
          );
        } else {
          // Add the feature to selected features
          updatedFeatures = [...selectedGeoJSONFeatures, clickedFeature];
        }

        // Dispatch the selection handler
        handleSelection(updatedFeatures);
      }
    };

    /**
     * Event handler for 'draw.create' events in 'rectangle' selection mode.
     * Selects features within the drawn rectangle.
     *
     * @param {Object} e - The draw create event object.
     */
    const handleDrawCreate = (e) => {
      if (selectionMode !== 'rectangle' || !isFeatureSelectActive) return;

      const rectangleFeature = e.features[0];
      const bbox = turf.bbox(rectangleFeature);
      const bboxPolygon = turf.bboxPolygon(bbox);

      // Get all features from the source layer
      const allFeatures = map.querySourceFeatures(layer, {
        sourceLayer: getSourceLayer(map, layer) || '',
        filter: ['all'],
      });

      // Filter features that intersect with the rectangle
      const featuresInRectangle = allFeatures
        .filter((feature) => {
          return !turf.booleanDisjoint(feature.geometry, bboxPolygon);
        })
        .map((feature) => feature.toJSON());

      // Convert selectedFeatureValues back to GeoJSON features
      const selectedGeoJSONFeatures = selectedFeatureValues.map((feature) => ({
        type: 'Feature',
        id: feature.value,
        properties: {
          name: feature.label,
          id: feature.value, // Assuming the property 'id' holds feature id
        },
      }));

      // Combine with existing selected features, avoiding duplicates
      const updatedFeaturesMap = new Map();

      // Add existing selected features
      selectedGeoJSONFeatures.forEach((feature) => {
        updatedFeaturesMap.set(feature.id, feature);
      });

      // Add new features from rectangle selection
      featuresInRectangle.forEach((feature) => {
        if (!updatedFeaturesMap.has(feature.id)) {
          updatedFeaturesMap.set(feature.id, feature);
        }
      });

      const updatedFeatures = Array.from(updatedFeaturesMap.values());

      // Dispatch the selection handler
      handleSelection(updatedFeatures);

      draw.deleteAll();
    };

    /**
     * Sets up event listeners based on the current selection mode.
     */
    const setupEventListeners = () => {
      if (isFeatureSelectActive) {
        if (selectionMode === 'feature') {
          // Enable pointer selection
          map.on('click', handleFeatureClick);
          // Ensure draw is not active
          if (draw) {
            draw.changeMode('simple_select');
          }
        } else if (selectionMode === 'rectangle' && draw) {
          // Enable rectangle selection
          draw.changeMode('draw_rectangle');
          map.on('draw.create', handleDrawCreate);
        }
      }
    };

    /**
     * Removes event listeners based on the current selection mode.
     */
    const removeEventListeners = () => {
      if (isFeatureSelectActive) {
        if (selectionMode === 'feature') {
          map.off('click', handleFeatureClick);
        } else if (selectionMode === 'rectangle' && draw) {
          map.off('draw.create', handleDrawCreate);
          draw.deleteAll();
        }
      }
    };

    // Set up event listeners
    setupEventListeners();

    // Cleanup function to remove event listeners when dependencies change
    return () => {
      removeEventListeners();
    };
  }, [
    map,
    filterConfig,
    draw,
    selectionMode,
    isFeatureSelectActive,
    mapDispatch,
    filterDispatch,
    selectedFeatureValues,
  ]);

  // Cleanup the draw instance when the component unmounts
  useEffect(() => {
    return () => {
      if (draw && map) {
        map.removeControl(draw);
        setDraw(null);
      }
    };
  }, [map, draw]);
};