import { useEffect, useState, useCallback, useRef } from "react";
import { useMapContext } from "hooks";
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
 * @param {boolean} isFeatureSelectActive - Whether feature selection is active.
 * @param {Function} setFeatureSelectActive - Function to set the feature selection active state.
 * @param {string} selectionMode - The selection mode ('feature' or 'rectangle').
 * @param {Array} selectedFeatureValues - The current selected feature values.
 * @returns {Array} transformedFeatures - The array of transformed selected features.
 */
export const useFeatureSelect = (
  map,
  filterConfig,
  isFeatureSelectActive,
  setFeatureSelectActive,
  selectionMode,
  selectedFeatureValues
) => {
  const { state: mapState } = useMapContext();
  const [transformedFeaturesState, setTransformedFeaturesState] = useState([]);
  const draw = mapState.drawInstance;
  const { layer } = filterConfig;
  const existingClickHandlersRef = useRef([]);

  /**
   * Moves the draw layers to the top of the layer stack.
   */
  const moveDrawLayersToTop = useCallback(() => {
    if (!map.getStyle()) return;

    const drawLayerIds = map
      .getStyle()
      .layers.filter((layer) => layer.id.startsWith("gl-draw"))
      .map((layer) => layer.id);

    drawLayerIds.forEach((layerId) => {
      map.moveLayer(layerId);
    });
  }, [map]);

  /**
   * Transforms features into a format suitable for selection display.
   *
   * @param {Array} features - The features to transform.
   * @returns {Array} The transformed features.
   */
  const transformFeatures = useCallback((features) => {
    return features.map((feature) => ({
      value: feature.id,
      label: feature.properties.name,
    }));
  }, []);

  /**
   * Handles the selection of transformed features.
   *
   * @param {Array} transformedFeatures - The transformed features to handle.
   */
  const handleSelection = useCallback(
    (transformedFeatures) => {
      setTransformedFeaturesState(transformedFeatures);
    },
    [setTransformedFeaturesState]
  );

  /**
   * Updates the cursor style based on the active state of the pointer selection mode.
   *
   * @param {boolean} isActive - Indicates whether the pointer selection mode is active.
   *                             If true, the cursor is set to 'pointer'; otherwise, it is reset.
   */
  const updateCursorStyle = useCallback(
    (isActive) => {
      if (!map) return;
      map.getCanvas().style.cursor = isActive ? "pointer" : "";
    },
    [map]
  );

  /**
   * Event handler for map 'click' events in 'feature' selection mode.
   * Selects features that are clicked by the user.
   *
   * @param {Object} e - The map click event object.
   */
  const handleFeatureClick = useCallback(
    (e) => {
      if (selectionMode !== "feature" || !isFeatureSelectActive) return;

      moveDrawLayersToTop();

      const allFeatures = map.querySourceFeatures(layer, {
        sourceLayer: getSourceLayer(map, layer) || "",
        filter: ["all"],
      });

      if (allFeatures.length > 0) {
        const clickedFeature = allFeatures
          .reduce((closestFeature, feature) => {
            const featurePoint = turf.pointOnFeature(feature.geometry);
            const distance = turf.distance(
              turf.point([e.lngLat.lng, e.lngLat.lat]),
              featurePoint
            );

            if (!closestFeature || distance < closestFeature.distance) {
              return { feature: feature.toJSON(), distance };
            }

            return closestFeature;
          }, null)
          .feature;

        const isFeatureAlreadySelected = selectedFeatureValues.some(
          (feature) => feature.value === clickedFeature.id
        );

        let updatedFeatures;

        const selectedGeoJSONFeatures = selectedFeatureValues.map((feature) => ({
          type: "Feature",
          id: feature.value,
          properties: {
            name: feature.label,
            id: feature.value,
          },
        }));

        if (isFeatureAlreadySelected) {
          updatedFeatures = selectedGeoJSONFeatures.filter(
            (feature) => feature.id !== clickedFeature.id
          );
        } else {
          updatedFeatures = [...selectedGeoJSONFeatures, clickedFeature];
        }

        const transformedFeatures = transformFeatures(updatedFeatures);
        handleSelection(transformedFeatures);
      }
    },
    [
      selectionMode,
      isFeatureSelectActive,
      moveDrawLayersToTop,
      map,
      layer,
      selectedFeatureValues,
      transformFeatures,
      handleSelection,
    ]
  );

  /**
   * Event handler for 'draw.create' events in 'rectangle' selection mode.
   * Selects features within the drawn rectangle.
   *
   * @param {Object} e - The draw create event object.
   */
  const handleDrawCreate = useCallback(
    (e) => {
      if (selectionMode !== "rectangle" || !isFeatureSelectActive) return;
      moveDrawLayersToTop();

      const rectangleFeature = e.features[0];
      const bbox = turf.bbox(rectangleFeature);
      const bboxPolygon = turf.bboxPolygon(bbox);

      const allFeatures = map.querySourceFeatures(layer, {
        sourceLayer: getSourceLayer(map, layer) || "",
        filter: ["all"],
      });

      const featuresInRectangle = allFeatures
        .filter((feature) => {
          return !turf.booleanDisjoint(feature.geometry, bboxPolygon);
        })
        .map((feature) => feature.toJSON());

      const selectedGeoJSONFeatures = selectedFeatureValues.map((feature) => ({
        type: "Feature",
        id: feature.value,
        properties: {
          name: feature.label,
          id: feature.value,
        },
      }));

      const updatedFeaturesMap = new Map();

      selectedGeoJSONFeatures.forEach((feature) => {
        updatedFeaturesMap.set(feature.id, feature);
      });

      featuresInRectangle.forEach((feature) => {
        if (!updatedFeaturesMap.has(feature.id)) {
          updatedFeaturesMap.set(feature.id, feature);
        }
      });

      const updatedFeatures = Array.from(updatedFeaturesMap.values());

      const transformedFeatures = transformFeatures(updatedFeatures);
      handleSelection(transformedFeatures);

      if (draw) {
        draw.deleteAll();
      }

      setFeatureSelectActive(false);

      // Zero timeout to ensure handlers restored after draw created
      setTimeout(() => {
        if (existingClickHandlersRef.current.length > 0) {
          existingClickHandlersRef.current.forEach((handler) =>
            map.on("click", handler)
          );
          existingClickHandlersRef.current = [];
        }
      }, 0);
    },
    [
      selectionMode,
      draw,
      isFeatureSelectActive,
      moveDrawLayersToTop,
      setFeatureSelectActive,
      map,
      layer,
      selectedFeatureValues,
      transformFeatures,
      handleSelection
    ]
  );

  useEffect(() => {
    if (!map || !filterConfig) return;

    // Store existing click handlers only when activating feature select
    if (isFeatureSelectActive && existingClickHandlersRef.current.length === 0 && map._listeners && map._listeners.click) {
      existingClickHandlersRef.current = [...map._listeners.click];
    }

    /**
     * Sets up event listeners for feature selection based on the current selection mode.
     * It enables pointer or rectangle selection and updates the cursor style accordingly.
     * Also removes event listeners when required.
     */
    const setupEventListeners = () => {
      // Remove existing click handlers
      existingClickHandlersRef.current.forEach(handler => map.off("click", handler));

      // Always remove existing listeners before adding new ones
      map.off("click", handleFeatureClick);
      map.off("draw.create", handleDrawCreate);

      if (draw) {
        draw.deleteAll();
      }

      updateCursorStyle(false);

      if (isFeatureSelectActive) {
        if (selectionMode === "feature") {
          map.on("click", handleFeatureClick);
          updateCursorStyle(true);
          if (draw) {
            draw.changeMode("simple_select");
          }
        } else if (selectionMode === "rectangle" && draw) {
          draw.changeMode("draw_rectangle");
          map.on("draw.create", handleDrawCreate);
        }
      }
    };

    setupEventListeners();

    // Cleanup function
    return () => {
      map.off("click", handleFeatureClick);
      map.off("draw.create", handleDrawCreate);
      
      if (draw) {
        draw.deleteAll();
      }

      updateCursorStyle(false);
    };
  }, [
    map,
    filterConfig,
    selectionMode,
    isFeatureSelectActive,
    handleFeatureClick,
    handleDrawCreate,
    updateCursorStyle,
    mapState.drawInstance
  ]);

  return transformedFeaturesState;
};