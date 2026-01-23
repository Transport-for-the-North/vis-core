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
import { useFetchVisualisationData, useFeatureStateUpdater } from "hooks";
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
export const MapVisualisation = ({ visualisationName, map, left = null, maps }) => {
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
    return resolvedStyle?.split("-")[1] || "continuous"; // Default fallback
  }, [resolvedStyle]);

  // Determine the layer key based on the visualisation type
  const layerKey =
    visualisation.type === "joinDataToMap"
      ? visualisation.joinLayer
      : visualisationName;

  // Retrieve classificationMethod per layer
  const classificationMethod = state.layers[layerKey]?.class_method ?? "d";

  // Determine the layerColorScheme based on visualisation type
  const layerColorScheme = useMemo(() => {
    return (
      state.colorSchemesByLayer[layerKey] ?? defaultMapColourMapper[colorStyle]
    );
  }, [layerKey, state.colorSchemesByLayer, colorStyle]);

  const shouldFilterDataToViewport =
    visualisation.shouldFilterDataToViewport || false;

  // Use the custom hook to fetch data for the visualisation
  const {
    isLoading,
    data: visualisationData,
    error,
    dataWasReturnedButFiltered,
  } = useFetchVisualisationData(
    visualisation,
    map,
    layerKey,
    shouldFilterDataToViewport,
  );

  // Effect to resolve dynamic styling - wait for loading to complete
  useEffect(() => {
    // Clear any pending timeout
    if (styleResolutionTimeoutRef.current) {
      clearTimeout(styleResolutionTimeoutRef.current);
    }

    if (visualisation?.dynamicStyling && visualisation.style && !visualisation.style.includes('-')) {
      // Only resolve style when data is complete (not loading anymore)
      if (!isLoading && visualisationData && visualisationData.length > 0) {
        dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_LOADING });
        
        // Use setTimeout to batch state updates
        styleResolutionTimeoutRef.current = setTimeout(() => {
          try {
            // Use the already fetched data to determine dynamic style
            const newResolvedStyle = determineDynamicStyle(visualisationData, visualisation.style);
            
            // Update both states in same microtask
            setResolvedStyle(newResolvedStyle);
            setIsResolvingStyle(false);
            
            console.log(`Dynamic styling resolved from ${visualisationData.length} data points: ${visualisation.style} -> ${newResolvedStyle}`);
            
            dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_FINISHED });
            
            // Trigger pending update if one was requested during resolution
            if (pendingUpdateRef.current) {
              pendingUpdateRef.current = false;
            }
          } catch (error) {
            console.warn('Failed to resolve dynamic style from data:', error);
            setResolvedStyle(`${visualisation.style}-continuous`);
            setIsResolvingStyle(false);
            dispatch({ type: actionTypes.SET_DYNAMIC_STYLING_FINISHED });
          }
        }, 0);
      } else if (isLoading) {
        // While waiting for data, use a temporary style to prevent errors
        console.log(`Dynamic styling waiting for data to load for ${visualisationName}`);
        setResolvedStyle(`${visualisation.style}-continuous`);
        setIsResolvingStyle(true);
      } else if (!visualisationData || visualisationData.length === 0) {
        // No data returned, use continuous as fallback
        console.log(`Dynamic styling: no data for ${visualisationName}, defaulting to continuous`);
        setResolvedStyle(`${visualisation.style}-continuous`);
        setIsResolvingStyle(false);
      }
    } else if (!visualisation?.dynamicStyling) {
      setResolvedStyle(visualisation?.style);
      setIsResolvingStyle(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (styleResolutionTimeoutRef.current) {
        clearTimeout(styleResolutionTimeoutRef.current);
      }
    };
  }, [visualisation?.style, visualisation?.dynamicStyling, visualisationData, isLoading, dispatch, visualisationName]);

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
      if (
        visualisationData &&
        visualisationData.length === 0 &&
        !dataWasReturnedButFiltered
      ) {
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
        console.warn(
          `Layer ${layer} not found on map during reclassifyAndStyleMap`,
        );
        return;
      }

      // Reclassify data using combinedData
      const currentPage = appContext.appPages.find(
        (page) => page.url === window.location.pathname
      );

      // Get trseLabel from state.layers
      const trseLabel = state.layers[layerKey]?.trseLabel === true;

      const reclassifiedData = reclassifyData(
        combinedDataForClassification,
        style,
        classificationMethod,
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel } // Pass trseLabel in options
      );

      // Get the metric definition for the current page/metric
      const metric = getMetricDefinition(
        appContext.defaultBands,
        currentPage,
        visualisation.queryParams,
        { trseLabel }
      );

      // Determine the current color scheme
      const currentColor =
        colorSchemes[colorStyle] &&
        colorSchemes[colorStyle].some((e) => e === layerColorScheme.value)
          ? layerColorScheme.value
          : defaultMapColourMapper[colorStyle]?.value ||
            defaultMapColourMapper["continuous"].value;

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
        colourPalette = calculateColours(
          currentColor,
          reclassifiedData,
          invertColorScheme,
        );
      }
      // Update the map style
      const opacityValue = document.getElementById(
        "opacity-" + layerKey
      )?.value;
      const widthValue = document.getElementById("width-" + layerKey)?.value;

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

  /**
   * Core effect to reclassify and update the data on the map.
   */
  useEffect(() => {
    if (!map) return;

    const layerConfig = state.layers[layerKey];
    if (!layerConfig) {
      console.log(`Layer config for ${layerKey} not yet in state, deferring update`);
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
    const prevClassificationMethod =
      prevClassMethodRef.current[layerKey];
    const classificationHasChanged =
      classificationMethod !== prevClassificationMethod &&
      prevClassificationMethod !== undefined;

    const needUpdate =
      dataHasChanged ||
      visualisationDataHasChanged ||
      colorHasChanged ||
      classificationHasChanged;

    // If we styled with no data, and now we have data, we need an update
    const previouslyHadNoData = 
      prevVisualisationDataRef.current !== undefined &&
      (!prevVisualisationDataRef.current || prevVisualisationDataRef.current.length === 0);
    const nowHasData = visualisationData && visualisationData.length > 0;
    const transitionedFromNoDataToData = previouslyHadNoData && nowHasData;

    // Also consider it a first run if we transitioned from no data to having data
    const isFirstRun = (!hasStyledLayerRef.current || transitionedFromNoDataToData) && 
                      visualisationData && 
                      visualisationData.length > 0;

    // forceUpdateCounter > 0 means we had a deferred update
    const isDeferredUpdate = forceUpdateCounter > 0 && !pendingUpdateRef.current;

    if (transitionedFromNoDataToData) {
      console.log(`${visualisationName}: Transitioned from no data to ${visualisationData.length} data points, triggering update`);
      // Reset the styled flag so we treat this as a fresh styling
      hasStyledLayerRef.current = false;
    }

    if (isResolvingStyle && (needUpdate || isFirstRun)) {
      pendingUpdateRef.current = true;
      console.log(`Deferring update for ${visualisationName} - style still resolving`);
      return;
    }

    // Guard conditions
    if (!needUpdate && !isFirstRun && !isDeferredUpdate) {
      console.log(`${visualisationName}: No update needed (needUpdate=${needUpdate}, isFirstRun=${isFirstRun}, isDeferredUpdate=${isDeferredUpdate})`);
      return;
    }
    if (!resolvedStyle || !colorStyle) {
      console.log(`${visualisationName}: Missing resolvedStyle or colorStyle, skipping update`);
      return;
    }

    console.log(`${visualisationName}: Proceeding with reclassification:`, {
      needUpdate,
      isFirstRun,
      transitionedFromNoDataToData,
      dataLength: visualisationData?.length || 0,
      resolvedStyle,
    });

    // Update the refs to the current data
    prevCombinedDataRef.current = combinedData;
    prevVisualisationDataRef.current = visualisationData;
    prevColorRef.current[layerKey] = layerColorScheme;
    prevClassMethodRef.current[layerKey] = classificationMethod;

    const layerName = layerKey;
    const dataToVisualize = visualisationData || [];
    const dataToClassify = combinedData;

    // Cleanup tracking vars
    let timeoutId = null;
    let styleDataHandler = null;
    let sourceDataHandler = null;
    let isCleanedUp = false;

    const performReclassification = () => {
      switch (visualisation.type) {
        case "joinDataToMap": {
          if (
            Array.isArray(dataToVisualize) &&
            dataToVisualize.length === 0
          ) {
            console.log(`${visualisationName}: No data to visualise, resetting map style`);
            resetMapStyle(resolvedStyle);
            hasStyledLayerRef.current = true; // Mark as styled even with no data
          } else {
            console.log(`${visualisationName}: Reclassifying with ${dataToVisualize.length} features`);
            reclassifyAndStyleMap(
              map,
              dataToClassify,
              dataToVisualize,
              resolvedStyle,
              classificationMethod,
              layerName
            );
            hasStyledLayerRef.current = true;
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
          hasStyledLayerRef.current = true;
          break;
        }
        default:
          break;
      }
    };

    if (visualisation.type === "joinDataToMap") {
      const maxRetries = 10;
      const retryDelay = 200;
      let retryCount = 0;
      
      const checkLayerAndPerform = () => {
        if (isCleanedUp) {
          console.log(`Cleanup called for ${layerName}, aborting retry`);
          return;
        }

        if (map.getLayer(layerName)) {
          if (retryCount > 0) {
            console.log(`Layer ${layerName} ready after ${retryCount} retries`);
          }
          performReclassification();
        } else if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Layer ${layerName} not ready, retry ${retryCount}/${maxRetries}`);
          timeoutId = setTimeout(checkLayerAndPerform, retryDelay);
        } else {
          console.warn(`Layer ${layerName} not found after ${maxRetries} retries, listening for events`);
          
          styleDataHandler = () => {
            if (isCleanedUp) return;
            if (map.getLayer(layerName)) {
              map.off("styledata", styleDataHandler);
              if (sourceDataHandler) map.off("sourcedata", sourceDataHandler);
              console.log(`Layer ${layerName} ready via styledata event`);
              performReclassification();
            }
          };
          map.on("styledata", styleDataHandler);
          
          sourceDataHandler = (e) => {
            if (isCleanedUp) return;
            if (e.sourceId === layerName && e.isSourceLoaded && map.getLayer(layerName)) {
              map.off("sourcedata", sourceDataHandler);
              if (styleDataHandler) map.off("styledata", styleDataHandler);
              console.log(`Layer ${layerName} ready via sourcedata event`);
              performReclassification();
            }
          };
          map.on("sourcedata", sourceDataHandler);
        }
      };
      
      checkLayerAndPerform();
    } else {
      // For non-joinDataToMap types, just perform the reclassification directly
      performReclassification();
    }

    return () => {
      isCleanedUp = true;
      
      if (timeoutId) {
        clearTimeout(timeoutId);
        console.log(`Cleared timeout for ${layerName}`);
      }
      
      if (styleDataHandler) {
        map.off("styledata", styleDataHandler);
        console.log(`Removed styledata listener for ${layerName}`);
      }
      
      if (sourceDataHandler) {
        map.off("sourcedata", sourceDataHandler);
        console.log(`Removed sourcedata listener for ${layerName}`);
      }
    };
  }, [
    combinedData,
    visualisationData,
    map,
    layerColorScheme,
    classificationMethod,
    resolvedStyle,
    isResolvingStyle,
    visualisation.type,
    visualisationName,
    layerKey,
    colorStyle,
    forceUpdateCounter,
  ]);

  // Trigger update when style resolution completes if there was a pending update
  useEffect(() => {
    if (
      !isResolvingStyle &&
      pendingUpdateRef.current &&
      resolvedStyle &&
      colorStyle
    ) {
      console.log(`Executing deferred update for ${visualisationName}`);
      pendingUpdateRef.current = false;

      // Force refs to undefined to trigger update
      prevCombinedDataRef.current = undefined;
      prevVisualisationDataRef.current = undefined;

      // Also reset the styled flag so it's treated as a first run
      hasStyledLayerRef.current = false;

      // Increment counter to trigger main effect re-run
      setForceUpdateCounter((prev) => prev + 1);
    }
  }, [isResolvingStyle, resolvedStyle, colorStyle, visualisationName]);

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
        (e) => e === layerColorScheme.value,
      )
        ? layerColorScheme.value
        : defaultMapColourMapper[colorStyle].value;

      // Calculate color palette
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Create paint property
      const opacityValue = document.getElementById(
        "opacity-" + layerKey,
      )?.value;
      const widthValue = document.getElementById("width-" + layerKey)?.value;
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
              enforceNoColourSchemeSelector:
                visualisation.enforceNoColourSchemeSelector ?? false,
              enforceNoClassificationMethod:
                visualisation.enforceNoClassificationMethod ?? false,
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
        for (const [paintPropertyName, paintPropertyArray] of Object.entries(
          paintProperty,
        )) {
          map.setPaintProperty(
            visualisationName,
            paintPropertyName,
            paintPropertyArray
          );
        }
      }
    },
    [map, visualisationName, layerColorScheme, colorStyle, dispatch, layerKey, forceUpdateCounter],
  );

  return null;
};
