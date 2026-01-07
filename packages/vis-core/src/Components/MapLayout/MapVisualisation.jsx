import colorbrewer from "colorbrewer";
import { useCallback, useEffect, useRef, useContext, useMemo, useState } from "react";
import { useMapContext, useDataFetchState } from "hooks";
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
import { DataFetchState } from "enums";

// Constants
const DEFAULT_OPACITY = 0.65;
const DEFAULT_COLOR_STYLE = "continuous";
const LAYER_RETRY_CONFIG = {
  maxRetries: 10,
  retryDelay: 200,
};

/**
 * Calculates the colour palette based on the provided color scheme and number of bins.
 */
const calculateColours = (colourScheme, bins, invert = false) => {
  const minBins = 3;
  const maxBins = 9;
  
  let colors;
  if (bins.length >= maxBins) {
    colors = chroma.scale(colourScheme).colors(bins.length);
  } else {
    const binCount = Math.min(Math.max(bins.length, minBins), maxBins);
    colors = colorbrewer[colourScheme][binCount];
  }
  
  return invert ? colors.slice().reverse() : colors;
};

/**
 * MapVisualisation component responsible for rendering visualisations on a map.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.visualisationName - The name of the visualisation.
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
  const prevColorRef = useRef({});
  const prevClassMethodRef = useRef({});

  // Ref to track pending updates during style resolution and timeouts
  const pendingUpdateRef = useRef(false);
  const styleResolutionTimeoutRef = useRef(null);

  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  
  // Ref to track if the layer has been styled
  const hasStyledLayerRef = useRef(false);

  // State for tracking resolved dynamic styles
  const [resolvedStyle, setResolvedStyle] = useState(null);
  const [isResolvingStyle, setIsResolvingStyle] = useState(false);

  const { addFeaturesToMap } = useFeatureStateUpdater();

  // Determine the visualisation based on side (left, right, or single)
  const visualisation = useMemo(() => {
    if (left === null) return state.visualisations[visualisationName];
    return left
      ? state.leftVisualisations[visualisationName]
      : state.rightVisualisations[visualisationName];
  }, [left, state.visualisations, state.leftVisualisations, state.rightVisualisations, visualisationName]);

  // Initialise resolved style when visualisation changes
  useEffect(() => {
    if (visualisation?.style) {
      setResolvedStyle(visualisation.style);
    }
  }, [visualisation?.style]);

  // Use resolved style for colour determination
  const colorStyle = useMemo(() => {
    return resolvedStyle?.split("-")[1] || DEFAULT_COLOR_STYLE;
  }, [resolvedStyle]);

  // Determine the layer key based on the visualisation type
  const layerKey = useMemo(() => {
    return visualisation?.type === "joinDataToMap"
      ? visualisation.joinLayer
      : visualisationName;
  }, [visualisation?.type, visualisation?.joinLayer, visualisationName]);

  // Retrieve classificationMethod per layer
  const classificationMethod =
    state.layers[layerKey]?.class_method ?? "d";

  // Determine the layerColorScheme based on visualisation type
  const layerColorScheme = useMemo(() => {
    return state.colorSchemesByLayer[layerKey] ?? defaultMapColourMapper[colorStyle];
  }, [layerKey, state.colorSchemesByLayer, colorStyle]);

  const shouldFilterDataToViewport = visualisation?.shouldFilterDataToViewport || false;

  // Use the custom hook to fetch data for the visualisation
  const {
    isLoading,
    data: visualisationData,
    error,
    dataWasReturnedButFiltered,
    fetchState,
    resetFetchState,
  } = useFetchVisualisationData(
    visualisation,
    map,
    layerKey,
    shouldFilterDataToViewport,
  );

  // Reset fetch state when visualisation changes (page navigation)
  useEffect(() => {
    hasStyledLayerRef.current = false;
    prevCombinedDataRef.current = undefined;
    prevVisualisationDataRef.current = undefined;
  }, [visualisationName, resetFetchState]);

  // Effect to resolve dynamic styling when visualisation data is available
  useEffect(() => {
    if (styleResolutionTimeoutRef.current) {
      clearTimeout(styleResolutionTimeoutRef.current);
    }

    const shouldResolveDynamically = 
      visualisation?.dynamicStyling && 
      visualisation.style && 
      !visualisation.style.includes('-');

    if (!shouldResolveDynamically) {
      setResolvedStyle(visualisation?.style);
      setIsResolvingStyle(false);
      return;
    }

    if (isLoading) {
      setIsResolvingStyle(true);
      return;
    }

    if (!visualisationData || visualisationData.length === 0) {
      setResolvedStyle(`${visualisation.style}-${DEFAULT_COLOR_STYLE}`);
      setIsResolvingStyle(false);
      return;
    }

    styleResolutionTimeoutRef.current = setTimeout(() => {
      dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_LOADING });
      
      try {
        const newResolvedStyle = determineDynamicStyle(visualisationData, visualisation.style);
        setResolvedStyle(newResolvedStyle);
        setIsResolvingStyle(false);
        dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_FINISHED });

        if (pendingUpdateRef.current) {
          pendingUpdateRef.current = false;
        }
      } catch (err) {
        console.warn('Failed to resolve dynamic style:', err);
        setResolvedStyle(`${visualisation.style}-${DEFAULT_COLOR_STYLE}`);
        setIsResolvingStyle(false);
        dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_FINISHED });
      }
    }, 0);

    return () => {
      if (styleResolutionTimeoutRef.current) {
        clearTimeout(styleResolutionTimeoutRef.current);
      }
    };
  }, [visualisation?.style, visualisation?.dynamicStyling, visualisationData, isLoading, dispatch]);

  // Handle loading state
  useEffect(() => {
    if (isLoading) {
      dispatch({ type: actionTypes.SET_IS_LOADING });
      dispatch({ type: actionTypes.SET_DATA_REQUESTED, payload: true });
    } else {
      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
    }
  }, [isLoading, dispatch]);

  // Handle no data returned state based on fetch state machine
  useEffect(() => {
    switch (fetchState) {
      case DataFetchState.IDLE:
        // Don't change anything during idle - let previous state persist
        // until we actually start loading
        break;
      case DataFetchState.LOADING:
        // Clear the "no data" message while loading
        // This prevents stale "no data" from previous page/query
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: false });
        break;
      case DataFetchState.ERROR:
      case DataFetchState.EMPTY:
        // Genuinely no data or error occurred
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
        break;
      case DataFetchState.SUCCESS:
        // Data loaded successfully
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: false });
        break;
      default:
        break;
    }
  }, [fetchState, dispatch]);

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
    if (left === null) {
      return visualisationData || [];
    }
    
    const leftData = state.leftVisualisations[visualisationName]?.data || [];
    const rightData = state.rightVisualisations[visualisationName]?.data || [];
    return [...leftData, ...rightData];
  }, [
    left,
    state.leftVisualisations,
    state.rightVisualisations,
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
    (mapItem, combinedDataForClassification, visualisationDataForMap, style, classMethod, layer) => {
      if (!mapItem.getLayer(layer)) {
        console.warn(`Layer ${layer} not found on map during reclassifyAndStyleMap`);
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
        classMethod,
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel, customBands } // Pass trseLabel and customBands in options
      );

      // Get the metric definition for the current page/metric
      const metric = getMetricDefinition(
        appContext.defaultBands,
        currentPage,
        visualisation?.queryParams,
        { trseLabel }
      );

      // Determine the current color scheme
      const currentColor =
        colorSchemes[colorStyle] &&
        colorSchemes[colorStyle].some((e) => e === layerColorScheme?.value)
          ? layerColorScheme.value
          : defaultMapColourMapper[colorStyle]?.value ||
            defaultMapColourMapper[DEFAULT_COLOR_STYLE].value;

      // Calculate the color palette based on the classification
      const invertColorScheme = state.layers[layerKey]?.invertedColorScheme === true;

      let colourPalette;
      if (metric?.colours?.length === reclassifiedData.length) {
        colourPalette = metric.colours;
      } else {
        colourPalette = calculateColours(currentColor, reclassifiedData, invertColorScheme);
      }

      // Update the map style
      const opacityValue = document.getElementById(`opacity-${layerKey}`)?.value;

      // Get layer's default opacity from metadata, fallback to DEFAULT_OPACITY
      const layerObject = mapItem.getLayer(layer);
      const defaultOpacity = layerObject?.metadata?.defaultOpacity ?? DEFAULT_OPACITY;

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
      state.layers,
      resolvedStyle,
      appContext,
      visualisation?.queryParams,
      layerColorScheme,
      layerKey,
      // calculateColours,
      colorStyle,
      addFeaturesToMap,
    ]
  );

  /**
   * Reset the map style to the default style for a specified layer.
   *
   * @param {string} style - The type of geometries of the visualisation.
   */
  const resetMapStyle = useCallback(
    (style) => {
      if (!map) return;
      
      const paintProperty = resetPaintProperty(style);
      addFeaturesToMap(
        map,
        paintProperty,
        state.layers,
        visualisationData,
        colorStyle,
        layerKey
      );
    },
    [map, state.layers, addFeaturesToMap, visualisationData, layerKey, colorStyle]
  );

  /**
   * Reclassifies GeoJSON data and styles the map accordingly.
   */
  const reclassifyAndStyleGeoJSONMap = useCallback(
    (featureCollection, style) => {
      if (!featureCollection || !map) {
        return;
      }
      
      if (!hasAnyGeometryNotNull(featureCollection)) {
        if (map.getLayer(visualisationName)) {
          map.removeLayer(visualisationName);
        }
        dispatch({ type: actionTypes.SET_NO_DATA_RETURNED, payload: true });
        return;
      }
      
      if (!map.getSource(visualisationName)) {
        map.addSource(visualisationName, {
          type: "geojson",
          data: featureCollection,
        });
      } else {
        map.getSource(visualisationName).setData(featureCollection);
      }

      const reclassifiedData = reclassifyGeoJSONData(featureCollection, style);

      const currentColor = colorSchemes[colorStyle]?.some(
        (e) => e === layerColorScheme?.value
      )
        ? layerColorScheme.value
        : defaultMapColourMapper[colorStyle]?.value;

      const colourPalette = calculateColours(currentColor, reclassifiedData);

      const opacityValue = document.getElementById(`opacity-${layerKey}`)?.value;
      
      const paintProperty = createPaintProperty(
        reclassifiedData,
        style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : DEFAULT_OPACITY,
        state.layers[layerKey]
      );

      const layers = map.getStyle().layers;
      const layerIndex = layers.findIndex(
        (layer) => layer.id.includes("-hover") || layer.id === "selected-feature-layer"
      );
      const beforeLayerId = layerIndex !== -1 ? layers[layerIndex].id : undefined;

      if (!map.getLayer(visualisationName)) {
        map.addLayer(
          {
            id: visualisationName,
            type: "fill",
            source: visualisationName,
            paint: paintProperty,
            metadata: {
              colorStyle: colorStyle,
              isStylable: true,
              enforceNoColourSchemeSelector: visualisation?.enforceNoColourSchemeSelector ?? false,
              enforceNoClassificationMethod: visualisation?.enforceNoClassificationMethod ?? false,
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
        for (const [paintPropertyName, paintPropertyArray] of Object.entries(paintProperty)) {
          map.setPaintProperty(visualisationName, paintPropertyName, paintPropertyArray);
        }
      }
    },
    [map, visualisationName, layerColorScheme, colorStyle, dispatch, layerKey, state.layers, visualisation]
  );

  /**
   * Core effect to reclassify and update the data on the map.
   */
  useEffect(() => {
    if (!map || !visualisation) return;

    const layerConfig = state.layers[layerKey];
    if (!layerConfig) {
      return;
    }

    // Determine if reclassification is needed
    const dataHasChanged =
      combinedData !== prevCombinedDataRef.current &&
      prevCombinedDataRef.current !== undefined;
    const visualisationDataHasChanged =
      visualisationData !== prevVisualisationDataRef.current &&
      prevVisualisationDataRef.current !== undefined;
    const colorHasChanged =
      layerColorScheme !== null &&
      prevColorRef.current[layerKey] !== undefined &&
      layerColorScheme !== prevColorRef.current[layerKey];
    const prevClassificationMethod = prevClassMethodRef.current[layerKey];
    const classificationHasChanged =
      classificationMethod !== prevClassificationMethod;

    const needUpdate =
      dataHasChanged ||
      visualisationDataHasChanged ||
      colorHasChanged ||
      classificationHasChanged;

    const previouslyHadNoData = 
      prevVisualisationDataRef.current !== undefined &&
      (!prevVisualisationDataRef.current || prevVisualisationDataRef.current.length === 0);
    const nowHasData = visualisationData && visualisationData.length > 0;
    const transitionedFromNoDataToData = previouslyHadNoData && nowHasData;

    const isFirstRun = (!hasStyledLayerRef.current || transitionedFromNoDataToData) && 
                      visualisationData && 
                      visualisationData.length > 0;

    const isDeferredUpdate = forceUpdateCounter > 0 && !pendingUpdateRef.current;

    if (transitionedFromNoDataToData) {
      hasStyledLayerRef.current = false;
    }

    if (isResolvingStyle && (needUpdate || isFirstRun)) {
      pendingUpdateRef.current = true;
      return;
    }

    if (!needUpdate && !isFirstRun && !isDeferredUpdate) {
      return;
    }
    
    if (!resolvedStyle || !colorStyle) {
      return;
    }

    // Update the refs to the current data
    prevCombinedDataRef.current = combinedData;
    prevVisualisationDataRef.current = visualisationData;
    prevColorRef.current[layerKey] = layerColorScheme;
    prevClassMethodRef.current[layerKey] = classificationMethod;

    const dataToVisualise = visualisationData || [];
    const dataToClassify = combinedData;

    let cleanupFns = [];

    const performReclassification = () => {
      switch (visualisation.type) {
        case "joinDataToMap": {
          if (
            Array.isArray(dataToVisualise) &&
            dataToVisualise.length === 0
          ) {
            resetMapStyle(resolvedStyle);
          } else {
            reclassifyAndStyleMap(
              map,
              dataToClassify,
              dataToVisualise,
              resolvedStyle,
              classificationMethod,
              layerKey
            );
          }
          hasStyledLayerRef.current = true;
          break;
        }
        case "geojson": {
          const parsedData = dataToVisualise[0]?.feature_collection || dataToVisualise.feature_collection;
          if (parsedData) {
            reclassifyAndStyleGeoJSONMap(JSON.parse(parsedData), resolvedStyle);
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
      const { maxRetries, retryDelay } = LAYER_RETRY_CONFIG;
      let retryCount = 0;
      let isCleanedUp = false;

      const checkLayerAndPerform = () => {
        if (isCleanedUp) return;

        if (map.getLayer(layerKey)) {
          performReclassification();
        } else if (retryCount < maxRetries) {
          retryCount++;
          const timeoutId = setTimeout(checkLayerAndPerform, retryDelay);
          cleanupFns.push(() => clearTimeout(timeoutId));
        } else {
          const handleLayerReady = () => {
            if (isCleanedUp || !map.getLayer(layerKey)) return;
            cleanup();
            performReclassification();
          };

          const cleanup = () => {
            map.off("styledata", handleLayerReady);
            map.off("sourcedata", handleLayerReady);
          };

          map.on("styledata", handleLayerReady);
          map.on("sourcedata", handleLayerReady);
          cleanupFns.push(cleanup);
        }
      };

      cleanupFns.push(() => { isCleanedUp = true; });
      checkLayerAndPerform();
    } else {
      performReclassification();
    }

    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, [
    combinedData,
    visualisationData,
    map,
    layerColorScheme,
    classificationMethod,
    resetMapStyle,
    resolvedStyle,
    isResolvingStyle,
    visualisation,
    visualisationName,
    // reclassifyAndStyleMap,
    layerKey,
    colorStyle,
    forceUpdateCounter,
    state.layers,
    resetMapStyle,
    reclassifyAndStyleMap,
    reclassifyAndStyleGeoJSONMap,
  ]);

  // Trigger update when style resolution completes if there was a pending update
  useEffect(() => {
    if (!isResolvingStyle && pendingUpdateRef.current && resolvedStyle && colorStyle) {
      pendingUpdateRef.current = false;
      prevCombinedDataRef.current = undefined;
      prevVisualisationDataRef.current = undefined;
      hasStyledLayerRef.current = false;
      setForceUpdateCounter((prev) => prev + 1);
    }
  }, [isResolvingStyle, resolvedStyle, colorStyle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (map && visualisation?.type === "geojson") {
        if (map.getLayer(visualisationName)) {
          map.removeLayer(visualisationName);
        }
        if (map.getSource(visualisationName)) {
          map.removeSource(visualisationName);
        }
      }
    };
  }, [map, visualisation?.type, visualisationName]);

  return null;
};
