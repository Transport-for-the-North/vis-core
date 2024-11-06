import colorbrewer from "colorbrewer";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState, useContext } from "react";

import { useMapContext } from "hooks";
import { AppContext } from "contexts";
import { actionTypes } from "reducers";
import { api } from "services";
import {
  colorSchemes,
  createPaintProperty,
  reclassifyData,
  reclassifyGeoJSONData,
  resetPaintProperty,
} from "utils";
import chroma from "chroma-js";

/**
 * Debounced function to fetch data for a specific visualization.
 *
 * @property {Object} visualisation - The visualization object containing details like data path and query parameters.
 * @property {Function} dispatch - The dispatch function to update the state in the context.
 * @property {Function} setLoading - The function to update the loading state.
 * @returns {Promise<void>} This function returns a promise.
 */
const fetchDataForVisualisation = debounce(
  async (visualisation, dispatch, setLoading, left) => {
    if (visualisation && visualisation.queryParams) {
      setLoading(true);
      const path = visualisation.dataPath;
      const queryParams = visualisation.queryParams;
      const requiresAuth = visualisation.requiresAuth;
      const visualisationName = visualisation.name;
      try {
        const data = await api.baseService.get(path, { queryParams, skipAuth: !requiresAuth });
        dispatch({
          type: actionTypes.UPDATE_ALL_DATA,
          payload: { visualisationName, data, left },
        });
        if (data.length === 0) {
          console.warn("No data returned for visualisation:", visualisationName);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data for visualisation:", error);
        setLoading(false); // Set loading to false in case of error
      }
    }
  },
  400
);

/**
 * A React component responsible for rendering visualizations on a map.
 *
 * @property {string} props.visualisationName - The name of the visualization.
 * @property {Object} props.map - The Maplibre JS map instance.
 * @property {boolean} props.left - A boolean indicating whether the visualisation is for the left or the right map. Null for a single map page
 * @returns {null} This component doesn't render anything directly.
 */
export const Visualisation = ({ visualisationName, map, left = null, maps }) => {
  const { state, dispatch } = useMapContext();
  const appContext = useContext(AppContext);
  const [isLoading, setLoading] = useState(false); // State to track loading
  const prevDataRef = useRef();
  const prevColorRef = useRef();
  const prevClassMethodRef = useRef();
  const prevQueryParamsRef = useRef();
  const visualisation =
    left === null
      ? state.visualisations[visualisationName]
      : left
      ? state.leftVisualisations[visualisationName]
      : state.rightVisualisations[visualisationName];

  let visualisationData = [];
  if (left != null) {
    visualisationData = state.leftVisualisations[visualisationName].data.concat(
      state.rightVisualisations[visualisationName].data
    )
  } else {
    visualisationData = state.visualisations[visualisationName].data
  }

  /**
   * Reclassifies the provided data and updates the map style.
   *
   * This function reclassifies the data based on the given style and updates the map style
   * accordingly. It ensures that the color scheme is applied correctly and updates the paint
   * properties of the map layers.
   *
   * @param {Array} data - The data to be reclassified and styled.
   * @param {string} style - The style to be applied for reclassification.
   */
  const reclassifyAndStyleMap = useCallback(
    (mapItem, mapData, data, style, classificationMethod) => {
      // Reclassify data if needed
      const currentPage = appContext.appPages.find((page) => page.url === window.location.pathname);
      const reclassifiedData = reclassifyData(
        mapData,
        style,
        classificationMethod,
        appContext.defaultBands, 
        currentPage,
        visualisation.queryParams
      );
      const currentColor = colorSchemes[style.split("-")[1]].some(
        (e) => e === state.color_scheme.value
      )
        ? state.color_scheme.value
        : colorSchemes[style.split("-")[1]][0];
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Update the map style based on the type of map, reclassified data, and color palette

      const opacityValue = document.getElementById(
        "opacity-" + visualisation.joinLayer
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        visualisation.style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65
      );
      addFeaturesToMap(mapItem, paintProperty, state.layers, data, style);

      // addFeaturesToMap(map, paintProperty, state.layers, data, style);
      dispatch({
        type: "UPDATE_MAP_STYLE",
        payload: { visualisationName, paintProperty },
      });
    },
    [
      dispatch,
      state.color_scheme,
      state.layers,
      visualisation.style,
      visualisationName,
      appContext,
      state.visualisations
    ]
  );

  /**
   * Reclassifies GeoJSON data and styles the map accordingly. If the layer does not exist,
   * it adds a new layer below any existing 'selected-feature-layer' or layers with '-hover' in their names.
   * If the layer exists, it updates the paint properties of the layer.
   *
   * @param {Object} featureCollection - The GeoJSON feature collection to be added or updated on the map.
   * @param {string} style - The style string indicating the type of visualisation (e.g., 'polygon-continuous').
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
      // Reclassify data if needed
      const reclassifiedData = reclassifyGeoJSONData(featureCollection, style);
      const currentColor = colorSchemes[style.split("-")[1]].some(
        (e) => e === state.color_scheme.value
      )
        ? state.color_scheme.value
        : colorSchemes[style.split("-")[1]][0];
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Update the map style based on the type of map, reclassified data, and color palette

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
        ); // Add the new layer below the identified layer
      } else {
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
    [map, visualisationName, state.color_scheme]
  );

  /**
   * Adds features to the map and updates their paint properties.
   *
   * This function iterates over the provided layers and updates the map with the new features
   * and their corresponding paint properties. It removes the previous feature states, sets new
   * feature states, and updates the paint properties for each layer.
   *
   * @param {Object} map - The map object to which features will be added.
   * @param {Object} paintProperty - The paint properties to apply to the layers.
   * @param {Object} layers - The layers to which the features will be added.
   * @param {Array} data - The data containing features to be added to the map.
   * @param {string} style - The style string indicating the type of visualisation.
   */
  const addFeaturesToMap = (map, paintProperty, layers, data, style) => {
    Object.values(layers).forEach((layer) => {
      if (
        data &&
        data.length > 0 &&
        map.getLayer(layer.name) &&
        layer.isStylable
      ) {
        map.getLayer(layer.name).metadata = {
          ...map.getLayer(layer.name).metadata,
          colorStyle: style.split("-")[1],
        };
        map.removeFeatureState({
          source: layer.name,
          sourceLayer: layer.sourceLayer,
        });
        data.forEach((row) => {
          map.setFeatureState(
            {
              source: layer.name,
              sourceLayer: layer.sourceLayer,
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
            layer.name,
            paintPropertyName,
            paintPropertyArray
          );
        }
      }
    });
  };

  /**
   * Calculates the color palette based on the provided color scheme and number of bins.
   *
   * This function calculates the color palette to be used for visualizing data based on the specified
   * color scheme and the number of bins. It retrieves the color palette from the ColorBrewer library
   * and ensures that the number of bins falls within a certain range (3 to 9) to avoid out-of-bounds errors.
   *
   * @property {string} colourScheme - The name of the color scheme to use.
   * @property {number} bins - The number of bins representing the data distribution.
   * @returns {string[]} An array of color values representing the color palette.
   */
  const calculateColours = (colourScheme, bins) => {
    if(bins.length > 9) return chroma.scale(colourScheme).colors(bins.length);
    return colorbrewer[colourScheme][Math.min(Math.max(bins.length, 3), 9)];
  };

  // Effect to update the data if queryParams change
  useEffect(() => {
    // Stringify the current queryParams for comparison
    const currentQueryParamsStr = JSON.stringify(visualisation.queryParams);

    // Check if all required query parameters are present
    const allParamsPresent = Object.values(visualisation.queryParams).every(
      (param) => param !== null && param !== undefined
    );
    const queryParamsChanged =
      prevQueryParamsRef.current !== currentQueryParamsStr;

    if (allParamsPresent && queryParamsChanged) {
      if (!left) {
        // Debounce the function to update both sides of the map
        setTimeout(() => {
          fetchDataForVisualisation(visualisation, dispatch, setLoading, left);
        }, 400);
      } else
        fetchDataForVisualisation(visualisation, dispatch, setLoading, left);

      // Update the ref to the current queryParams
      prevQueryParamsRef.current = currentQueryParamsStr;
    }
  }, [
    visualisation.queryParams,
    visualisationName,
    visualisation,
    left,
    dispatch,
  ]);

  // Log loading status to console
  useEffect(() => {
    if (isLoading) {
      dispatch({ type: actionTypes.SET_IS_LOADING });
    } else {
      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
    }
  }, [isLoading]);

  function checkGeometryNotNull(featureCollection) {
    // Check if the feature collection is provided
    if (
      !featureCollection ||
      !featureCollection.features ||
      featureCollection.features.length === 0
    ) {
      return false; // Return false if the feature collection is empty or undefined
    }

    // Iterate through each feature in the feature collection
    for (let feature of featureCollection.features) {
      // Check if the geometry property exists and is not null
      if (!feature.geometry || feature.geometry === null) {
        return false; // Return false if geometry is null for any feature
      }
    }

    return true; // Return true if geometry is not null for all features
  }

  /**
   * Reset the map style to the default style.
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
          prevDataRef.current,
          style
        );
      }
    },
    [map, state.layers]
  );

  // Effect to restyle the map if data has changed
  useEffect(() => {
    const dataHasChanged =
      visualisation.data !== prevDataRef.current &&
      prevDataRef.current !== undefined;
    const colorHasChanged =
      state.color_scheme !== null &&
      state.color_scheme !== prevColorRef.current;
    const classificationHasChanged =
      state.class_method != null &&
      state.class_method !== prevClassMethodRef.current;
    const needUpdate =
      dataHasChanged || colorHasChanged || classificationHasChanged;
    
      if (!needUpdate) {
      setLoading(false);
      return;
    }

    // **Filter data based on visualisedFeatureIds**
    const visualisationData =
      left === null
        ? visualisation.data
        : left
        ? state.leftVisualisations[visualisationName].data
        : state.rightVisualisations[visualisationName].data;

    const layerName = visualisation.joinLayer; // Get the associated layer name

    const featureIdsForLayer = state.visualisedFeatureIds[layerName];

    const filteredData =
      featureIdsForLayer && featureIdsForLayer.length > 0
        ? visualisationData.filter((row) =>
            featureIdsForLayer.some(feature => feature.value === Number(row["id"]))
          )
        : visualisationData;

    switch (visualisation.type) {
      case "geojson": {
        setLoading(true);
        visualisation.data[0]
          ? reclassifyAndStyleGeoJSONMap(
              JSON.parse(visualisation.data[0].feature_collection),
              visualisation.style
            )
          : resetMapStyle(visualisation.style);
        break;
      }

      case "joinDataToMap": {
        // Use filteredData instead of visualisationData
        if (filteredData.length === 0) {
          resetMapStyle(visualisation.style);
        } else {
          setLoading(true);
          if (left !== null) {
            reclassifyAndStyleMap(
              maps[0],
              filteredData,
              state.leftVisualisations[visualisationName].data,
              visualisation.style,
              state.class_method
            );
            reclassifyAndStyleMap(
              maps[1],
              filteredData,
              state.rightVisualisations[visualisationName].data,
              visualisation.style,
              state.class_method
            );
          } else {
            reclassifyAndStyleMap(
              map,
              filteredData,
              filteredData,
              visualisation.style,
              state.class_method
            );
          }
        }
        break;
      }
      default:
        break;
    }
    setLoading(false);
    // Update the ref to the current data
    prevDataRef.current = filteredData;
    prevColorRef.current = state.color_scheme;

    return () => {
      if (map && visualisation.type === "geojson") {
        if (map.getLayer(visualisation.name)) {
          map.removeLayer(visualisation.name);
        }
        if (map.getSource(visualisation.name)) {
          map.removeSource(visualisation.name);
        }
      }
    };
  }, [
    visualisation,
    reclassifyAndStyleGeoJSONMap,
    setLoading,
    visualisation.data,
    reclassifyAndStyleMap,
    dispatch,
    map,
    state.color_scheme,
    resetMapStyle,
    state.class_method,
    state.visualisedFeatureIds
  ]);

  return null;
};
