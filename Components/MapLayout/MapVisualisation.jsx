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
  hasAnyGeometryNotNull,
} from "utils";
import chroma from "chroma-js";
import { useFetchVisualisationData, useFeatureStateUpdater } from "hooks"; // Import the custom hook
import { defaultMapColourMapper } from "defaults";

/**
 * MapVisualisation component responsible for rendering visualizations on a map.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.visualisationName - The name of the visualization.
 * @param {Object} props.map - The Maplibre JS map instance.
 * @param {boolean|null} props.left - A boolean indicating whether the visualization is for the left or the right map. Null for a single map page.
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
  const prevColorRef = useRef({});
  const prevClassMethodRef = useRef({});

  const { addFeaturesToMap } = useFeatureStateUpdater();

  // Determine the visualisation based on side (left, right, or single)
  const visualisation =
    left === null
      ? state.visualisations[visualisationName]
      : left
      ? state.leftVisualisations[visualisationName]
      : state.rightVisualisations[visualisationName];

  const colorStyle = visualisation?.style?.split("-")[1];

  // Determine the layer key based on the visualisation type
  const layerKey =
    visualisation.type === "joinDataToMap" ? visualisation.joinLayer : visualisationName;

  // Retrieve classificationMethod per layer
  const classificationMethod =
    state.layers[layerKey]?.class_method ?? "d";

  // Determine the layerColorScheme based on visualisation type
  const layerColorScheme = useMemo(() => {
    return (
      state.colorSchemesByLayer[layerKey] ??
      defaultMapColourMapper[colorStyle]
    );
  }, [layerKey, state.colorSchemesByLayer, colorStyle]);

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
      dispatch({ type: actionTypes.SET_DATA_REQUESTED, payload: true });
    } else {
      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
    }
  }, [isLoading, dispatch]);

  // Handle no data returned state
  useEffect(() => {
    if (!isLoading) {
      if (visualisationData && visualisationData.length === 0) {
        // No data returned from the API
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
      } else if (visualisationData) {
        // Data was returned
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: false });
      } else if (error) {
        // An error occurred
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
      }
    }
  }, [isLoading, visualisationData, error, dispatch]);

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
      const trseLabel =
        state.layers[layerKey]?.trseLabel === true;

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
      const currentColor = colorSchemes[colorStyle].some(
        (e) => e === layerColorScheme.value
      )
        ? layerColorScheme.value
        : defaultMapColourMapper[colorStyle].value;

      // Calculate the color palette based on the classification
      const invertColorScheme =
        state.layers[layerKey]?.invertedColorScheme === true;
      const colourPalette = calculateColours(
        currentColor,
        reclassifiedData,
        invertColorScheme
      );

      // Update the map style
      const opacityValue = document.getElementById(
        "opacity-" + layerKey
      )?.value;
      const widthObject = document.getElementById(
        "width-" + layerKey
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        visualisation.style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65,
        widthObject ? parseFloat(widthObject) : 7.5
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
      JSON.stringify(state.layers),
      visualisation.style,
      appContext,
      visualisation.queryParams,
      layerColorScheme,
      layerKey,
      // calculateColours,
      colorStyle,
    ]
  );


  /**
   * Calculates the color palette based on the provided color scheme and number of bins.
   *
   * @param {string} colourScheme - The name of the color scheme to use.
   * @param {Array} bins - The bins representing the data distribution.
   * @param {boolean} invert - Whether to invert the color scheme.
   * @returns {string[]} An array of color values representing the color palette.
   */
  const calculateColours = useCallback((colourScheme, bins, invert = false) => {
    let colors;
    if (bins.length > 9) {
      colors = chroma.scale(colourScheme).colors(bins.length);
    } else {
      colors =
        colorbrewer[colourScheme][Math.min(Math.max(bins.length, 3), 9)];
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
          layerKey
        );
      }
    },
    [
      map,
      JSON.stringify(state.layers),
      addFeaturesToMap,
      visualisationData,
      layerKey,
    ]
  );

  useEffect(() => {
    if (!map) return;

    // Determine if reclassification is needed
    const dataHasChanged =
      combinedData !== prevCombinedDataRef.current &&
      prevCombinedDataRef.current !== undefined;
    const visualisationDataHasChanged =
      visualisationData !== prevVisualisationDataRef.current &&
      prevVisualisationDataRef.current !== undefined;
    const colorHasChanged =
      layerColorScheme !== null &&
      prevColorRef.current[layerKey];
    const prevClassificationMethod =
      prevClassMethodRef.current[layerKey];
    const classificationHasChanged =
      classificationMethod !== prevClassificationMethod;

    const needUpdate =
      dataHasChanged ||
      visualisationDataHasChanged ||
      colorHasChanged ||
      classificationHasChanged;

    if (!needUpdate) return;

    // Update the refs to the current data
    prevCombinedDataRef.current = combinedData;
    prevVisualisationDataRef.current = visualisationData;
    prevColorRef.current[layerKey] = layerColorScheme;
    prevClassMethodRef.current[layerKey] = classificationMethod;

    const layerName = layerKey;
    const dataToVisualize = visualisationData || [];
    const dataToClassify = combinedData;

    const performReclassification = () => {
      switch (visualisation.type) {
        case "joinDataToMap": {
          if (
            Array.isArray(dataToVisualize) &&
            dataToVisualize.length === 0
          ) {
            resetMapStyle(visualisation.style);
          } else {
            reclassifyAndStyleMap(
              map,
              dataToClassify,
              dataToVisualize,
              visualisation.style,
              classificationMethod,
              layerName
            );
          }
          break;
        }
        case "geojson": {
          const parsedDataToVisualize = dataToVisualize[0] ? dataToVisualize[0].feature_collection : dataToVisualize.feature_collection;
          if (parsedDataToVisualize) {
            reclassifyAndStyleGeoJSONMap(
              JSON.parse(parsedDataToVisualize),
              visualisation.style
            );
          } else {
            resetMapStyle(visualisation.style);
          }
          break;
        }
        default:
          break;
      }
    };

    if (visualisation.type === "joinDataToMap") {
      if (map.getLayer(layerName)) {
        performReclassification();
      } else {
        const onStyleData = () => {
          if (map.getLayer(layerName)) {
            map.off("styledata", onStyleData);
            performReclassification();
          }
        };
        map.on("styledata", onStyleData);
      }
    } else {
      performReclassification();
    }
  }, [
    combinedData,
    visualisationData,
    map,
    layerColorScheme,
    classificationMethod,
    resetMapStyle,
    visualisation.style,
    visualisation.type,
    visualisationName,
    // reclassifyAndStyleMap,
    layerKey,
  ]);

  // **Run-once cleanup
  useEffect(() => {
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
  }, [map, visualisation.type, visualisationName]);

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
      if (!hasAnyGeometryNotNull(featureCollection)) {
        // Remove the layer and source if no valid data is returned
        if (map.getLayer(visualisationName)) {
          map.removeLayer(visualisationName);
        }
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
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
      const currentColor = colorSchemes[colorStyle].some(
        (e) => e === layerColorScheme.value
      )
        ? layerColorScheme.value
        : defaultMapColourMapper[colorStyle].value;

      // Calculate color palette
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Create paint property
      const opacityValue = document.getElementById(
        "opacity-" + layerKey
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
              colorStyle: colorStyle,
              isStylable: true,
            },
          },
          beforeLayerId
        );

        dispatch({
          type: "UPDATE_COLOR_SCHEME",
          payload: {
            layerName: visualisationName,
            color_scheme: layerColorScheme,
          },
        });
      } else {
        // Update the paint properties
        for (const [
          paintPropertyName,
          paintPropertyArray,
        ] of Object.entries(paintProperty)) {
          map.setPaintProperty(
            visualisationName,
            paintPropertyName,
            paintPropertyArray
          );
        }
      }
    },
    [
      map,
      visualisationName,
      layerColorScheme,
      // calculateColours,
      colorStyle,
      dispatch,
      layerKey,
    ]
  );

  return null;
};
