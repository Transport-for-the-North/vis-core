
import colorbrewer from "colorbrewer";
import { useCallback, useEffect, useRef, useContext, useMemo } from "react";
import { useMapContext } from "hooks";
import { AppContext } from "contexts";
import { actionTypes } from "reducers";
import {
  colorSchemes,
  createPaintProperty,
  reclassifyData,
  reclassifyGeoJSONData,
  resetPaintProperty,
  checkGeometryNotNull
} from "utils";
import chroma from "chroma-js";
import { useFetchVisualisationData } from "hooks"; // Import the custom hook

/**
 * A React component responsible for rendering visualizations on a map.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.visualisationName - The name of the visualization.
 * @param {Object} props.map - The Maplibre JS map instance.
 * @param {boolean|null} props.left - A boolean indicating whether the visualisation is for the left or the right map. Null for a single map page.
 * @param {Object[]} [props.maps] - An array containing the left and right map instances for side-by-side maps.
 * @returns {null} This component doesn't render anything directly.
 */
export const MapVisualisation = ({
  visualisationName,
  map,
  left = null,
  maps,
}) => {
  const { state, dispatch } = useMapContext();
  const appContext = useContext(AppContext);

  // Refs to keep track of previous values
  const prevCombinedDataRef = useRef();
  const prevVisualisationDataRef = useRef();
  const prevColorRef = useRef();
  const prevClassMethodRef = useRef();

  // Determine the visualisation based on side (left, right, or single)
  const visualisation =
    left === null
      ? state.visualisations[visualisationName]
      : left
      ? state.leftVisualisations[visualisationName]
      : state.rightVisualisations[visualisationName];

  // Use the custom hook to fetch data for the visualisation
  const {
    isLoading,
    data: visualisationData,
    error,
  } = useFetchVisualisationData(visualisation);

  // Handle loading state
  useEffect(() => {
    if (isLoading) {
      dispatch({ type: actionTypes.SET_IS_LOADING });
    } else if (error) {
      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
      // Optionally, handle the error (e.g., dispatch an error action)
    } else {
      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
    }
  }, [isLoading, error, dispatch]);

  // Update the visualisation data in the global state when fetched
  useEffect(() => {
    if (!isLoading && visualisationData) {
      dispatch({
        type: actionTypes.UPDATE_ALL_DATA,
        payload: { visualisationName, data: visualisationData, left },
      });
    }
  }, [visualisationData, dispatch, visualisationName, isLoading, left]);

  // Compute combined data from both left and right visualisations using useMemo (if DualMaps)
  const combinedData = useMemo(() => {
    if (left !== null) {
      const leftData = state.leftVisualisations[visualisationName]?.data || [];
      const rightData =
        state.rightVisualisations[visualisationName]?.data || [];
      return [...leftData, ...rightData];
    } else {
      return visualisationData || [];
    }
  }, [
    left,
    state.leftVisualisations[visualisationName]?.data,
    state.rightVisualisations[visualisationName]?.data,
    visualisationData,
    visualisationName,
  ]);

  /**
   * Reclassifies the provided data and updates the map style for a specified layer.
   *
   * @param {Object} mapItem - The map instance to which styles will be applied.
   * @param {Array} combinedDataForClassification - Data from both visualisations used for classification.
   * @param {Array} visualisationDataForMap - Data specific to this visualisation for updating the map.
   * @param {string} style - The style to be applied for reclassification.
   * @param {string} classificationMethod - The method used for data classification.
   * @param {string} layer - The layer name to be styled.
   */
  const reclassifyAndStyleMap = useCallback(
    (
      mapItem,
      combinedDataForClassification,
      visualisationDataForMap,
      style,
      classificationMethod,
      layer
    ) => {
      // Check if the specified layer exists on the map
      if (!mapItem.getLayer(layer)) {
        return;
      }

      // Reclassify data using combinedData
      const currentPage = appContext.appPages.find(
        (page) => page.url === window.location.pathname
      );

      // Get trseLabel from state.layers
      const trseLabel = state.layers[visualisation.joinLayer]?.trseLabel === true;

      const reclassifiedData = reclassifyData(
        combinedDataForClassification,
        style,
        classificationMethod,
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel } // Pass trseLabel in options
      );

      // Determine the current color scheme
      const currentColor = colorSchemes[style.split("-")[1]].some(
        (e) => e === state.color_scheme.value
      )
        ? state.color_scheme.value
        : colorSchemes[style.split("-")[1]][0];

      // Calculate the color palette based on the classification
      const invertColorScheme = state.layers[visualisation.joinLayer]?.invertedColorScheme === true;
      const colourPalette = calculateColours(currentColor, reclassifiedData, invertColorScheme);

      // Update the map style
      const opacityValue = document.getElementById(
        "opacity-" + visualisation.joinLayer
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        visualisation.style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65
      );

      // Use visualisationDataForMap to update the map features
      addFeaturesToMap(
        mapItem,
        paintProperty,
        state.layers,
        visualisationDataForMap,
        style,
        layer
      );
    },
    [
      state.color_scheme,
      state.layers,
      visualisation.style,
      appContext,
      visualisation.queryParams,
    ]
  );

  /**
   * Adds features to the map and updates their paint properties for a specified layer.
   *
   * @param {Object} map - The map object to which features will be added.
   * @param {Object} paintProperty - The paint properties to apply to the layer.
   * @param {Object} layers - The layers to which the features will be added.
   * @param {Array} data - The data containing features to be added to the map.
   * @param {string} style - The style string indicating the type of visualisation.
   * @param {string} layerName - The name of the layer to which features will be added.
   */
  const addFeaturesToMap = useCallback(
    (map, paintProperty, layers, data, style, layerName) => {
      // Find the specified layer
      const specifiedLayer = Object.values(layers).find(
        (layer) => layer.name === layerName
      );

      if (specifiedLayer && map.getLayer(specifiedLayer.name)) {
        if (data && data.length > 0 && specifiedLayer.isStylable) {
          map.getLayer(specifiedLayer.name).metadata = {
            ...map.getLayer(specifiedLayer.name).metadata,
            colorStyle: style.split("-")[1],
          };
          map.removeFeatureState({
            source: specifiedLayer.name,
            sourceLayer: specifiedLayer.sourceLayer,
          });
          data.forEach((row) => {
            map.setFeatureState(
              {
                source: specifiedLayer.name,
                sourceLayer: specifiedLayer.sourceLayer,
                id: Number(row["id"]),
              },
              {
                value: row["value"],
                valueAbs: Math.abs(row["value"]),
              }
            );
          });
          for (const [paintPropertyName, paintPropertyArray] of Object.entries(
            paintProperty
          )) {
            map.setPaintProperty(
              specifiedLayer.name,
              paintPropertyName,
              paintPropertyArray
            );
          }
        } else if (data && data.length === 0 && specifiedLayer.isStylable) {
          map.removeFeatureState({
            source: specifiedLayer.name,
            sourceLayer: specifiedLayer.sourceLayer,
          });
        }
      }
    },
    []
  );

  /**
   * Calculates the color palette based on the provided color scheme and number of bins.
   *
   * @param {string} colourScheme - The name of the color scheme to use.
   * @param {Array} bins - The bins representing the data distribution.
   * @param {boolean} invert - Whether to invert the color scheme.
   * @returns {string[]} An array of color values representing the color palette.
   */
  const calculateColours = useCallback((colourScheme, bins, invert=false) => {
    let colors;
    if (bins.length > 9) {
      colors = chroma.scale(colourScheme).colors(bins.length);
    } else {
      colors = colorbrewer[colourScheme][Math.min(Math.max(bins.length, 3), 9)];
    }
    if (invert) {
      colors = colors.slice().reverse();
    }
    return colors;
  }, []);

  /**
   * Reset the map style to the default style for a specified layer.
   *
   * @param {string} style - The type of geometries of the visualisation.
   */
  const resetMapStyle = useCallback(
    (style) => {
      if (map) {
        const paintProperty = resetPaintProperty(style);
        addFeaturesToMap(
          map,
          paintProperty,
          state.layers,
          visualisationData,
          style,
          visualisation.joinLayer
        );
      }
    },
    [
      map,
      state.layers,
      visualisation.joinLayer,
      addFeaturesToMap,
      visualisationData,
    ]
  );

  // Effect to reclassify and restyle the map when data or settings change
  useEffect(() => {
    // Determine if reclassification is needed
    const dataHasChanged =
      combinedData !== prevCombinedDataRef.current &&
      prevCombinedDataRef.current !== undefined;
    const visualisationDataHasChanged =
      visualisationData !== prevVisualisationDataRef.current &&
      prevVisualisationDataRef.current !== undefined;
    const colorHasChanged =
      state.color_scheme !== null &&
      state.color_scheme !== prevColorRef.current;
    const classificationHasChanged =
      state.class_method != null &&
      state.class_method !== prevClassMethodRef.current;
    const needUpdate =
      dataHasChanged ||
      visualisationDataHasChanged ||
      colorHasChanged ||
      classificationHasChanged;

    if (!needUpdate) {
      return;
    }

    // Use visualisationData for setting feature states
    const dataToVisualize = visualisationData || [];

    // Use combinedData for reclassification
    const dataToClassify = combinedData;

    switch (visualisation.type) {
      case "geojson": {
        if (dataToVisualize && dataToVisualize[0]) {
          reclassifyAndStyleGeoJSONMap(
            JSON.parse(dataToVisualize[0].feature_collection),
            visualisation.style
          );
        } else {
          resetMapStyle(visualisation.style);
        }
        break;
      }
      case "joinDataToMap": {
        if (Array.isArray(dataToVisualize) && dataToVisualize.length === 0) {
          resetMapStyle(visualisation.style);
        } else {
          reclassifyAndStyleMap(
            map,
            dataToClassify,
            dataToVisualize,
            visualisation.style,
            state.class_method,
            visualisation.joinLayer
          );
        }
        break;
      }
      default:
        break;
    }

    // Update the refs to the current data
    prevCombinedDataRef.current = combinedData;
    prevVisualisationDataRef.current = visualisationData;
    prevColorRef.current = state.color_scheme;
    prevClassMethodRef.current = state.class_method;

    // Cleanup if necessary
    return () => {
      if (map && visualisation.type === "geojson") {
        if (map.getLayer(visualisationName)) {
          map.removeLayer(visualisationName);
        }
        if (map.getSource(visualisationName)) {
          map.removeSource(visualisationName);
        }
      }
    };
  }, [
    combinedData,
    visualisationData,
    map,
    state.color_scheme,
    state.class_method,
    reclassifyAndStyleMap,
    resetMapStyle,
    visualisation.joinLayer,
    visualisation.style,
    visualisation.type,
    visualisationName,
  ]);

  /**
   * Reclassifies GeoJSON data and styles the map accordingly.
   * If the layer does not exist, it adds a new layer below any existing 'selected-feature-layer' or layers with '-hover' in their names.
   * If the layer exists, it updates the paint properties of the layer.
   *
   * @param {Object} featureCollection - The GeoJSON feature collection to be added or updated on the map.
   * @param {string} style - The style string indicating the type of visualisation (e.g., 'polygon-categorical').
   */
  const reclassifyAndStyleGeoJSONMap = useCallback(
    (featureCollection, style) => {
      if (!featureCollection) {
        return;
      }
      if (!checkGeometryNotNull(featureCollection)) {
        return;
      }
      if (!map.getSource(visualisationName)) {
        // Add a new source
        map.addSource(visualisationName, {
          type: "geojson",
          data: featureCollection,
        });
      } else {
        // Update the existing source
        map.getSource(visualisationName).setData(featureCollection);
      }

      // Reclassify data
      const reclassifiedData = reclassifyGeoJSONData(featureCollection, style);

      // Determine current color scheme
      const currentColor = colorSchemes[style.split("-")[1]].some(
        (e) => e === state.color_scheme.value
      )
        ? state.color_scheme.value
        : colorSchemes[style.split("-")[1]][0];

      // Calculate color palette
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Create paint property
      const opacityValue = document.getElementById(
        "opacity-" + visualisation.joinLayer
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65
      );

      // Find the index of the layer that should be above the new layer
      const layers = map.getStyle().layers;
      const layerIndex = layers.findIndex(
        (layer) =>
          layer.id.includes("-hover") || layer.id === "selected-feature-layer"
      );
      const beforeLayerId =
        layerIndex !== -1 ? layers[layerIndex].id : undefined;

      if (!map.getLayer(visualisationName)) {
        // Add a new layer below the reference layer
        map.addLayer(
          {
            id: visualisationName,
            type: "fill",
            source: visualisationName,
            paint: paintProperty,
            metadata: {
              colorStyle: style.split("-")[1],
              isStylable: true,
            },
          },
          beforeLayerId
        );
      } else {
        // Update the paint properties
        for (const [paintPropertyName, paintPropertyArray] of Object.entries(
          paintProperty
        )) {
          map.setPaintProperty(
            visualisationName,
            paintPropertyName,
            paintPropertyArray
          );
        }
      }
    },
    [map, visualisationName, state.color_scheme, visualisation.joinLayer]
  );

  return null;
};