import chroma from "chroma-js";
import colorbrewer from "colorbrewer";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMapContext } from "hooks";
import { actionTypes } from "reducers";
import { api } from "services";
import { Legend } from "Components/Legend";

// Debounced fetchDataForVisualisation function
const fetchDataForVisualisation = debounce(
  async (visualisation, dispatch, setLoading) => {
    console.log("sucess");
    if (visualisation && visualisation.queryParams) {
      setLoading(true); // Set loading to true
      const path = visualisation.dataPath;
      const queryParams = visualisation.queryParams;
      const visualisationName = visualisation.name;
      try {
        const data = await api.baseService.get(path, { queryParams });
        dispatch({
          type: actionTypes.UPDATE_VIS_DATA,
          payload: { visualisationName, data },
        });
        setLoading(false); // Set loading to false when finished
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
  const prevQueryParamsRef = useRef();
  const visualisation = state.visualisations[visualisationName];
  const layer = state.layers[visualisationName];
  const [colors, setColors] = useState([]);

  // Function to reclassify data and update the map style
  const reclassifyAndStyleMap = useCallback(
    (data, style) => {
      // Reclassify data if needed
      const reclassifiedData = reclassifyData(data, style);
      const colourPalette = calculateColours("Reds", reclassifiedData);

      // Update the map style based on the type of map, reclassified data, and color palette
      const paintProperty = createPaintProperty(
        reclassifiedData,
        visualisation.style,
        colourPalette
      );

      addFeaturesToMap(map, paintProperty, state.layers, data);
      dispatch({
        type: "UPDATE_MAP_STYLE",
        payload: { visualisationName, paintProperty },
      });
    },
    [visualisation.style, visualisationName]
  );

  // Function to add or update a GeoJSON source and layer and style it
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
      const colourPalette = calculateColours("Paired", reclassifiedData);

      // Update the map style based on the type of map, reclassified data, and color palette
      const paintProperty = createPaintProperty(
        reclassifiedData,
        style,
        colourPalette
      );

      if (!map.getLayer(visualisationName)) {
        // Add a new layer (over the top of the existing one if need be)
        map.addLayer({
          id: visualisationName,
          type: "fill",
          source: visualisationName,
          paint: paintProperty,
        });
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
    [map, visualisationName]
  );

  // Function to recalculate bins if needed
  const reclassifyData = (data, style) => {
    if (style.includes("continuous")) {
      let values = data.map((value) => value.value);
      console.log("Bins recalculated for continuous data");
      return chroma.limits(values, "q", 4);
    } else if (style.includes("categorical")) {
      console.log("Categorical classification not implemented for joined data");
      return;
    } else {
      console.log("Style not recognized");
      return [];
    }
  };

  const reclassifyGeoJSONData = (data, style) => {
    if (style.includes("continuous")) {
      console.log("Continuous classification not implemented for GeoJSON data");
      return;
    } else if (style.includes("categorical")) {
      let categories = new Set();
      data.features.forEach((feature) => {
        if (feature.properties.hasOwnProperty("category")) {
          categories.add(feature.properties.category);
        }
      });
      console.log("Unique categories identified for categorical data");
      return Array.from(categories);
    } else {
      console.log("Style not recognized");
      return [];
    }
  };

  // Function to create a paint property for Maplibre based on the visualisation type and bins
  const createPaintProperty = (bins, style, colours) => {
    let colors = [];
    let colorObject = [];
    for (var i = 0; i < bins.length; i++) {
      colors.push(bins[i]);
      colors.push(colours[i]);
      colorObject.push({ value: bins[i], color: colours[i] });
    }
    setColors(colorObject);
    switch (style) {
      case "polygon-continuous":
        return {
          "fill-color": [
            "interpolate", ["linear"],
            ["feature-state", "value"],
            ...colors,
          ],
          "fill-opacity": [
            "case",
            ["in", ["feature-state", "value"], ["literal", [0, null]]],
            0,
            0.65,
          ],
          "fill-outline-color": "rgba(255, 255, 0, 0)"
        };
      case "polygon-categorical":
        // Assuming 'bins' is an array of category values and 'colours' is an array of corresponding colors
        let categoricalColors = [];
        for (let i = 0; i < bins.length; i++) {
          categoricalColors.push(bins[i]); // Category value
          categoricalColors.push(colours[i]); // Color for the category
        }
        categoricalColors.push(colours[colours.length - 1]); // Default color if no match is found
        return {
          "fill-color": ["match", ["get", "category"], ...categoricalColors],
          "fill-opacity": 0.35,
        };
      case "line-continuous":
        return {
          "line-color": [
            "case",
            ["<", ["feature-state", "value"], 0], "rgba(255, 0, 0, 1)", // Red for negative values
            [">", ["feature-state", "value"], 0], "rgba(0, 0, 255, 1)", // Blue for positive values
            "rgba(0, 0, 0, 0.0)" // Make zero invisible
          ],
          "line-width": [
            "interpolate", ["linear"],
            ["to-number", ["feature-state", "valueAbs"]],
            0.1, 0.1, // Line width starts at 1 at the value of 0
            Math.max(...bins), 20
          ],
          "line-opacity": 1
        };
      case "circle": {
        return {
          "circle-color": [
            ["interpolate", ["linear"], ["get", "value"], ...colors],
          ],
          "circle-stroke-width": [
            "case",
            ["in", ["feature-state", "value"], ["literal", [0, null]]],
            0.0,
            1.0,
          ],
          "circle-opacity": [
            "case",
            ["in", ["feature-state", "value"], ["literal", [0, null]]],
            0.0,
            1.0,
          ],
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["to-number", ["feature-state", "valueAbs"]],
            ...colors,
          ],
          "circle-stroke-color": ["#000000"],
        };
      }
      default:
        return {};
    }
  };

  const addFeaturesToMap = (map, paintProperty, layers, data) => {
    Object.values(layers).forEach((layer) => {
      if (data && data.length > 0 && map.getLayer(layer.name)) {
        
        map.removeFeatureState({ 
          source: layer.name,
          sourceLayer: 'zones'
        })
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
  }, [visualisation.queryParams, visualisationName, dispatch]);

  // Log loading status to console
  useEffect(() => {
    if (isLoading) {
      console.log("Visualisation data is loading...");
    } else {
      console.log("Visualisation data finished loading.");
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
    if (!dataHasChanged) {
      return;
    }

    switch (visualisation.type) {
      case "geojson": {
        reclassifyAndStyleGeoJSONMap(
          JSON.parse(visualisation.data[0].feature_collection),
          visualisation.style
        );
        break;
      }

      case "joinDataToMap": {
        // Reclassify and update the map style
        reclassifyAndStyleMap(visualisation.data, visualisation.style);
        break;
      }
        default: break
    }
    // Update the ref to the current data
    prevDataRef.current = visualisation.data;

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
    map
  ]);

  // Effect to update the map style when the color scheme changes
  useEffect(() => {
    const colorPalettes = getColorPalettes(visualisation.style);
    const newColorScheme = colorScheme in colorPalettes ? colorScheme : colorPalettes[0];
    const colourPalette = calculateColours(newColorScheme, reclassifiedData);

    // Update the map style based on the new color scheme
    const paintProperty = createPaintProperty(
      reclassifiedData,
      visualisation.style,
      colourPalette
    );

    addFeaturesToMap(map, paintProperty, state.layers, visualisation.data);
    dispatch({
      type: actionTypes.UPDATE_MAP_STYLE,
      payload: { visualisationName, paintProperty },
    });
  }, [colorScheme, visualisation.style, visualisation.data, map, dispatch]);


  return (
    <>
      {visualisation.data.length > 0 && colors.length > 0 ? (
        <Legend
          colorScale={colors}
          selectedVariable={visualisation.name}
          binMin={colors[0].value}
          binMax={colors[colors.length - 1].value}
        />
      ) : (
        ""
      )}
    </>
  );
};
