import colorbrewer from "colorbrewer";
import { useCallback, useEffect, useRef, useContext, useMemo, useState } from "react";
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
  getMetricDefinition,
  determineDynamicStyle
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

    // State for tracking resolved dynamic styles
  const [resolvedStyle, setResolvedStyle] = useState(visualisation?.style);
  const [isResolvingStyle, setIsResolvingStyle] = useState(false);

  // Use resolved style for color determination - memoized to react to resolvedStyle changes
  const colorStyle = useMemo(() => {
    return resolvedStyle?.split("-")[1] || 'continuous'; // Default fallback
  }, [resolvedStyle]);

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

  const shouldFilterDataToViewport = visualisation.shouldFilterDataToViewport || false;

  // Use the custom hook to fetch data for the visualisation
  const {
    isLoading,
    data: visualisationData,
    error,
    dataWasReturnedButFiltered
  } = useFetchVisualisationData(visualisation, map, layerKey, shouldFilterDataToViewport);

  // Effect to resolve dynamic styling when visualisation data is available
  useEffect(() => {
    if (visualisation?.dynamicStyling && visualisation.style && !visualisation.style.includes('-')) {
      if (visualisationData && visualisationData.length > 0) {
        setIsResolvingStyle(true);
        dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_LOADING }); // Show dynamic styling indicator
        try {
          // Use the already fetched data to determine dynamic style
          const newResolvedStyle = determineDynamicStyle(visualisationData, visualisation.style);
          setResolvedStyle(newResolvedStyle);
          console.log(`Dynamic styling resolved from existing data: ${visualisation.style} -> ${newResolvedStyle}`);
        } catch (error) {
          console.warn('Failed to resolve dynamic style from data:', error);
          setResolvedStyle(`${visualisation.style}-continuous`); // Fallback to continuous
        } finally {
          setIsResolvingStyle(false);
          dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_FINISHED }); // Hide dynamic styling indicator
        }
      } else {
        // While waiting for data, use a temporary style to prevent errors
        setResolvedStyle(`${visualisation.style}-continuous`);
        setIsResolvingStyle(true);
      }
    } else if (!visualisation?.dynamicStyling) {
      setResolvedStyle(visualisation?.style);
      setIsResolvingStyle(false);
    }
  }, [visualisation?.style, visualisation?.dynamicStyling, visualisationData, dispatch]);

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
      if ((visualisationData && visualisationData.length === 0) && !dataWasReturnedButFiltered) {
        // No data returned from the API
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
      } else if (visualisationData || dataWasReturnedButFiltered) {
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

      // Get trseLabel and customBands from state.layers
      const trseLabel =
        state.layers[layerKey]?.trseLabel === true;
      const customBands = state.layers[layerKey]?.customBands;

      const reclassifiedData = reclassifyData(
        combinedDataForClassification,
        style,
        classificationMethod,
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel, customBands } // Pass trseLabel and customBands in options
      );

      // Get the metric definition for the current page/metric
      const metric = getMetricDefinition(
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel }
      );

      // Determine the current color scheme
      const currentColor = (colorSchemes[colorStyle] && colorSchemes[colorStyle].some(
        (e) => e === layerColorScheme.value
      ))
        ? layerColorScheme.value
        : defaultMapColourMapper[colorStyle]?.value || defaultMapColourMapper['continuous'].value;

      // Calculate the color palette based on the classification
      const invertColorScheme =
        state.layers[layerKey]?.invertedColorScheme === true;
      
      // If the metric has a colours array and its length matches the bins, use it! Note that this will be default and NOT CHANGEABLE
      let colourPalette;
      if (
        metric &&
        metric.colours &&
        metric.colours.length === reclassifiedData.length
      ) {
        colourPalette = metric.colours;
      } else {
        colourPalette = calculateColours(currentColor, reclassifiedData, invertColorScheme);
      }
      // Update the map style
      const opacityValue = document.getElementById(
        "opacity-" + layerKey
      )?.value;
      const widthValue = document.getElementById(
        "width-" + layerKey
      )?.value;
      
      // Get layer's default opacity from metadata, fallback to 0.65
      const layerObject = mapItem.getLayer(layer);
      const defaultOpacity = layerObject?.metadata?.defaultOpacity ?? 0.65;
      
      // Get the layer configuration for custom settings like defaultLineOffset
      const layerConfig = state.layers[layerKey];
      
      const paintProperty = createPaintProperty(
        reclassifiedData,
        resolvedStyle,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : defaultOpacity,
        layerConfig
      );

      // Use visualisationDataForMap to update the map features
      addFeaturesToMap(
        mapItem,
        paintProperty,
        state.layers,
        visualisationDataForMap,
        colorStyle,
        layer
      );
    },
    [
      JSON.stringify(state.layers),
      resolvedStyle,
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
    if (bins.length >= 9) {
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
          colorStyle,
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
      colorStyle
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

    if (!needUpdate || !resolvedStyle || isResolvingStyle || !colorStyle) return;

    // Update the refs to the current data
    prevCombinedDataRef.current = combinedData;
    prevVisualisationDataRef.current = visualisationData;
    prevColorRef.current[layerKey] = layerColorScheme;
    prevClassMethodRef.current[layerKey] = classificationMethod;

    const layerName = layerKey;
    const dataToVisualize = visualisationData || [];
    const dataToClassify = combinedData;
    // const dataForClassification = filterDataToViewport(dataToClassify, map, layerName);

    const performReclassification = () => {
      switch (visualisation.type) {
        case "joinDataToMap": {
          if (
            Array.isArray(dataToVisualize) &&
            dataToVisualize.length === 0
          ) {
            resetMapStyle(resolvedStyle);
          } else {
            reclassifyAndStyleMap(
              map,
              dataToClassify,
              dataToVisualize,
              resolvedStyle,
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
              resolvedStyle
            );
          } else {
            resetMapStyle(resolvedStyle);
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
    resolvedStyle,
    isResolvingStyle,
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
      const widthValue = document.getElementById(
        "width-" + layerKey
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65,
        state.layers[layerKey] // Pass layer config instead of widthValue
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
              enforceNoColourSchemeSelector: visualisation.enforceNoColourSchemeSelector ?? false,
              enforceNoClassificationMethod: visualisation.enforceNoClassificationMethod ?? false,
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
