import colorbrewer from "colorbrewer";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMapContext } from "hooks";
import { actionTypes } from "reducers";
import { api } from "services";
import { colorSchemes, reclassifyData, createPaintProperty, reclassifyGeoJSONData } from "utils";

// Debounced fetchDataForVisualisation function
const fetchDataForVisualisation = debounce(
  async (visualisation, dispatch, setLoading) => {
    console.log("sucess");
    if (visualisation && visualisation.queryParams) {
      setLoading(true);
      const path = visualisation.dataPath;
      const queryParams = visualisation.queryParams;
      const visualisationName = visualisation.name;
      try {
        const data = await api.baseService.get(path, { queryParams });
        dispatch({
          type: actionTypes.UPDATE_VIS_DATA,
          payload: { visualisationName, data },
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data for visualisation:", error);
        setLoading(false); // Set loading to false in case of error
      }
    }
  },
  1500
);

export const Visualisation = ({ visualisationName, map }) => {
  const { state, dispatch } = useMapContext();
  const [isLoading, setLoading] = useState(false); // State to track loading
  const prevDataRef = useRef();
  const prevColorRef = useRef();
  const prevQueryParamsRef = useRef();
  const visualisation = state.visualisations[visualisationName];

  // Function to reclassify data and update the map style
  const reclassifyAndStyleMap = useCallback(
    (data, style) => {
      // Reclassify data if needed
      const reclassifiedData = reclassifyData(data, style);
      const currentColor = colorSchemes[style.split("-")[1]].some(
        (e) => e === state.color_scheme.value
      )
        ? state.color_scheme.value
        : colorSchemes[style.split("-")[1]][0];
      const colourPalette = calculateColours(currentColor, reclassifiedData);

      // Update the map style based on the type of map, reclassified data, and color palette

      const opacityValue = document.getElementById(
        "opacity-" + visualisationName
      )?.value;
      const paintProperty = createPaintProperty(
        reclassifiedData,
        visualisation.style,
        colourPalette,
        opacityValue ? parseFloat(opacityValue) : 0.65
      );

      addFeaturesToMap(map, paintProperty, state.layers, data, style);
      dispatch({
        type: "UPDATE_MAP_STYLE",
        payload: { visualisationName, paintProperty },
      });
    },
    [
      dispatch,
      map,
      state.color_scheme,
      state.layers,
      visualisation.style,
      visualisationName,
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
        "opacity-" + visualisationName
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


  const addFeaturesToMap = (map, paintProperty, layers, data, style) => {
    Object.values(layers).forEach((layer) => {
      if (data && data.length > 0 && map.getLayer(layer.name)) {
        map.getLayer(layer.name).metadata = {
          ...map.getLayer(layer.name).metadata,
          colorStyle: style.split("-")[1],
        };
        map.removeFeatureState({
          source: layer.name,
          sourceLayer: "zones",
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

  // Function to calculate the colour palette based on the filters
  const calculateColours = (colourScheme, bins) => {
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
      // Fetch data for the visualisation
      fetchDataForVisualisation(visualisation, dispatch, setLoading);

      // Update the ref to the current queryParams
      prevQueryParamsRef.current = currentQueryParamsStr;
    }
  }, [visualisation.queryParams, visualisationName, visualisation]);

  // Log loading status to console
  useEffect(() => {
    if (isLoading) {
      console.log("Visualisation data is loading...");
      dispatch({ type: actionTypes.SET_IS_LOADING });
    } else {
      console.log("Visualisation data finished loading.");
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

  // Effect to restyle the map if data has changed
  useEffect(() => {
    const dataHasChanged =
      visualisation.data.length !== 0 &&
      visualisation.data !== prevDataRef.current;
    const colorHasChanged =
      state.color_scheme !== null &&
      state.color_scheme !== prevColorRef.current;
    const needUpdate =
      dataHasChanged || (colorHasChanged && visualisation.data.length !== 0);

    if (!needUpdate) {
      setLoading(false);
      return;
    }

    switch (visualisation.type) {
      case "geojson": {
        setLoading(true);
        reclassifyAndStyleGeoJSONMap(
          JSON.parse(visualisation.data[0].feature_collection),
          visualisation.style
        );

        break;
      }

      case "joinDataToMap": {
        // Reclassify and update the map style
        setLoading(true);
        reclassifyAndStyleMap(visualisation.data, visualisation.style);
        break;
      }
      default:
        break;
    }
    setLoading(false);
    // Update the ref to the current data
    prevDataRef.current = visualisation.data;
    prevColorRef.current = state.color_scheme;

    return () => {
      console.log("Map unmount");
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
  ]);

  return null;
};
