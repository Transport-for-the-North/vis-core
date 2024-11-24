import { useEffect, useState } from "react";
import { useMapContext, useFilterContext } from "hooks";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { RectangleMode } from "@ookla/mapbox-gl-draw-rectangle";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import { getSourceLayer } from "utils";

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
        styles: [
          {
            id: "gl-draw-polygon-fill-inactive",
            type: "fill",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"],
            ],
            paint: {
              "fill-color": "#007bff",
              "fill-outline-color": "#007bff",
              "fill-opacity": 0.3,
            },
          },
          {
            id: "gl-draw-polygon-fill-active",
            type: "fill",
            filter: [
              "all",
              ["==", "active", "true"],
              ["==", "$type", "Polygon"],
            ],
            paint: {
              "fill-color": "#007bff",
              "fill-outline-color": "#007bff",
              "fill-opacity": 0.3,
            },
          },
          {
            id: "gl-draw-polygon-stroke-inactive",
            type: "line",
            filter: [
              "all",
              ["==", "active", "false"],
              ["==", "$type", "Polygon"],
              ["!=", "mode", "static"],
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#007bff",
              "line-width": 2,
            },
          },
          {
            id: "gl-draw-polygon-stroke-active",
            type: "line",
            filter: [
              "all",
              ["==", "active", "true"],
              ["==", "$type", "Polygon"],
            ],
            layout: {
              "line-cap": "round",
              "line-join": "round",
            },
            paint: {
              "line-color": "#007bff",
              "line-width": 2,
            },
          },
        ],
      });
      map.addControl(drawInstance);

      // Store the draw instance in state
      setDraw(drawInstance);
    }

    /**
     * Moves the draw layers to the top of the layer stack.
     */
    const moveDrawLayersToTop = () => {
      if (!map.getStyle()) return;
      
      // Get all Mapbox Draw layers by filtering layers with IDs starting with 'gl-draw'
      const drawLayerIds = map
        .getStyle()
        .layers.filter((layer) => layer.id.startsWith("gl-draw"))
        .map((layer) => layer.id);

      // Move each Draw layer to the top
      drawLayerIds.forEach((layerId) => {
        map.moveLayer(layerId);
      });
    };

    // Move draw layers to the top initially
    moveDrawLayersToTop();

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

      // Dispatch the map update with transformed features
      actions.forEach((action) => {
        mapDispatch({
          type: action.action,
          payload: { filter: filterConfig, value: transformedFeatures },
        });
      });

      // Update the selected features in context
      mapDispatch({
        type: "SET_SELECTED_FEATURES",
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
      if (selectionMode !== "feature" || !isFeatureSelectActive) return;

      moveDrawLayersToTop();

      // Query all features from the source layer
      const allFeatures = map.querySourceFeatures(layer, {
        sourceLayer: getSourceLayer(map, layer) || "",
        filter: ["all"],
      });

      if (allFeatures.length > 0) {
        // Find the feature closest to the click point
        const clickedFeature = allFeatures.reduce((closestFeature, feature) => {
          const featurePoint = turf.pointOnFeature(feature.geometry);
          const distance = turf.distance(
            turf.point([e.lngLat.lng, e.lngLat.lat]),
            featurePoint
          );

          if (!closestFeature || distance < closestFeature.distance) {
            return { feature: feature.toJSON(), distance };
          }

          return closestFeature;
        }, null).feature;

        // Check if the feature is already selected
        const isFeatureAlreadySelected = selectedFeatureValues.some(
          (feature) => feature.value === clickedFeature.id
        );

        let updatedFeatures;

        // Convert selectedFeatureValues back to GeoJSON features for consistency
        const selectedGeoJSONFeatures = selectedFeatureValues.map(
          (feature) => ({
            type: "Feature",
            id: feature.value,
            properties: {
              name: feature.label,
              id: feature.value, // Assuming the property 'id' holds feature id
            },
          })
        );

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
      if (selectionMode !== "rectangle" || !isFeatureSelectActive) return;
      moveDrawLayersToTop();

      const rectangleFeature = e.features[0];
      const bbox = turf.bbox(rectangleFeature);
      const bboxPolygon = turf.bboxPolygon(bbox);

      // Get all features from the source layer
      const allFeatures = map.querySourceFeatures(layer, {
        sourceLayer: getSourceLayer(map, layer) || "",
        filter: ["all"],
      });

      // Filter features that intersect with the rectangle
      const featuresInRectangle = allFeatures
        .filter((feature) => {
          return !turf.booleanDisjoint(feature.geometry, bboxPolygon);
        })
        .map((feature) => feature.toJSON());

      // Convert selectedFeatureValues back to GeoJSON features
      const selectedGeoJSONFeatures = selectedFeatureValues.map((feature) => ({
        type: "Feature",
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
     * Updates the cursor style based on the active state of the pointer selection mode.
     *
     * @param {boolean} isActive - Indicates whether the pointer selection mode is active.
     *                             If true, the cursor is set to 'pointer'; otherwise, it is reset.
     */
    const updateCursorStyle = (isActive) => {
      if (isActive) {
        map.getCanvas().style.cursor = "pointer";
      } else {
        map.getCanvas().style.cursor = "";
      }
    };

    /**
     * Sets up event listeners for feature selection based on the current selection mode.
     * It enables pointer or rectangle selection and updates the cursor style accordingly.
     */
    const setupEventListeners = () => {
      if (isFeatureSelectActive) {
        if (selectionMode === "feature") {
          // Enable pointer selection
          map.on("click", handleFeatureClick);
          updateCursorStyle(true); // Set cursor to pointer
          // Ensure draw is not active
          if (draw) {
            draw.changeMode("simple_select");
          }
        } else if (selectionMode === "rectangle" && draw) {
          // Enable rectangle selection
          draw.changeMode("draw_rectangle");
          map.on("draw.create", handleDrawCreate);
        }
      }
    };

    /**
     * Removes event listeners for feature selection based on the current selection mode.
     * It also resets the cursor style to its default state.
     */
    const removeEventListeners = () => {
      if (isFeatureSelectActive) {
        if (selectionMode === "feature") {
          map.off("click", handleFeatureClick);
          updateCursorStyle(false); // Reset cursor style
        } else if (selectionMode === "rectangle" && draw) {
          map.off("draw.create", handleDrawCreate);
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
