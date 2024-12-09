import { roundToSignificantFigures } from "./math";
import chroma from "chroma-js";

/**
 * Returns the opacity property name for a given layer type.
 * @function getOpacityProperty
 * @param {string} layerType - The type of the layer. Expected values are 'line', 'fill', or 'circle'.
 * @returns {string} The corresponding opacity property name.
 * @throws Will throw an error if the layer type is invalid.
 */ 
export function getOpacityProperty(layerType) {
  let opacityProp;
  switch (layerType) {
    case "line": {
      opacityProp = "line-opacity";
      break;
    }
    case "fill": {
      opacityProp = "fill-opacity";
      break;
    }
    case "circle": {
      opacityProp = "circle-opacity";
      break;
    }
    default:
      throw new Error(`Invalid layer type ${layerType}`);
  }
  return opacityProp;
}

/**
 * Generates a Mapbox GL paint property object based on the provided parameters.
 * This function is designed to create paint properties for various map features such as polygons, lines, circles, and points.
 *
 * @function createPaintProperty
 * @param {Array.<(number|string)>} bins - The different breaks used for the legend
 * @param {string} style - The type of geometries that we want to display on the map. Supported styles include 'polygon-continuous', 'polygon-diverging', 'line-continuous', 'line-diverging', 'circle-continuous', 'circle-diverging', 'point-continuous', and 'point-diverging'.
 * @param {Array.<string>} colours - The array of colours available for the styling. Usually an array of #FFFF
 * @param {float} opacityValue - The current opacity value, between 0 and 1
 * @returns The paint property for the given geometries
 */
export function createPaintProperty(bins, style, colours, opacityValue) {
  let widthObject = []
  let colors = [];
  let colorObject = [];
  for (var i = 0; i < bins.length; i++) {
    colors.push(bins[i]);
    colors.push(colours[i]);
    widthObject.push(bins[i]);
    widthObject.push((7.5/bins[bins.length-1]*bins[i]) + 1);
    colorObject.push({ value: bins[i], color: colours[i] });
  }
  switch (style) {
    case "polygon-diverging":
    case "polygon-continuous" : {
      return {
        "fill-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "value"],
          ...colors,
        ],
        "fill-opacity": [
          "case",
          ["==", ["feature-state", "value"], null],
          0,
          opacityValue ?? 0.65,
        ],
        "fill-outline-color": "rgba(255, 255, 0, 0)",
      };
    }
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
        "fill-opacity": opacityValue ?? 0.65,
      };
    case "line-continuous":
      return {
        "line-color": [
          "interpolate",
          ["linear"],
          ["feature-state", "value"],
          ...colors,
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["feature-state", "value"],
          ...widthObject,
        ],
        "line-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],

        "line-offset": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          -1,
          Math.max(...bins),
          -5,
        ],
      };
    case "line-diverging":
      return {
        "line-color": [
          "case",
          ["<", ["feature-state", "value"], 0],
          colours[0], // Red for negative values
          [">", ["feature-state", "value"], 0],
          colours[colours.length - 1], // Blue for positive values
          "rgba(0, 0, 0, 1)",
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["feature-state", "valueAbs"],
          ...widthObject,
        ],
        "line-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],
        "line-offset": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          -1,
          Math.max(...bins),
          -5,
        ],
      };
    case "circle-continuous":
    case "circle-diverging": {
      return {
        "circle-color": 
          ["interpolate", ["linear"], ["feature-state", "value"], ...colors],
        "circle-stroke-width": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
          0.0,
          0.5,
        ],
        "circle-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 0.65,
        ],
        "circle-stroke-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 0.2,
        ],
        "circle-radius": 
          ["interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          0,
          2, // Line width starts at 1 at the value of 0
          Math.max(...bins),
          25,
        ],
        "circle-stroke-color": "#000000"
      };
    }
    case "point-continuous":
    case "point-diverging": {
      return {
        "circle-color": [
          "interpolate", ["linear"], ["feature-state", "value"], ...colors
        ],
        "circle-stroke-width": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
          0.0,
          1,
        ],
        "circle-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],
        "circle-stroke-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 0.2,
        ],
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 2,  // Minimum radius at zoom level 0
          12, 4, // Medium radius at zoom level 12
          22, 8 // Maximum radius at zoom level 22
        ],
        "circle-stroke-color": "#666"
      };
    }
    default:
      return {};
  }
}

export const resetPaintProperty = (style) => { 
  switch (style) { 
    case "polygon-diverging":
    case "polygon-continuous":
    case "polygon-categorical":
      return {
        "fill-color": "rgba(0, 0, 0, 0)",
        "fill-opacity": 0,
        "fill-outline-color": "rgba(0, 0, 0, 0)",
      };
    case "line-continuous":
    case "line-diverging":
    case "line-categorical":
      return {
        "line-color": "rgba(0, 0, 0, 0)",
        "line-width": 0,
        "line-opacity": 0,
        "line-offset": 0,
      };
    case "circle-continuous":
    case "circle-diverging":
    case "circle-categorical":
    case "point-continuous":
    case "point-diverging":
      return {
        "circle-color": "rgb(0, 0, 0)",
        "circle-stroke-width": 0.5,
        "circle-opacity": 0.65,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 2,  // Minimum radius at zoom level 0
          12, 4, // Medium radius at zoom level 12
          22, 8 // Maximum radius at zoom level 22
        ],
        "circle-stroke-color": "#666"
      };
    default:
      return {};
  }
}

/**
 * Reclassifies data based on the specified style and rounds the values to ensure
 * that successive rounded values are not identical.
 * @function reclassifyData
 * @param {Array.<{id: number, value: string}>} data - The different features that we have.
 * @param {string} style - The type of geometry we have.
 * @param {string} classificationMethod - The method used for data classification.
 * @param {Array} defaultBands - Default bands for classification.
 * @param {Object} currentPage - The current page configuration.
 * @param {Object} queryParams - Query parameters from the visualisation.
 * @param {Object} options - Additional options, e.g., { trseLabel: true }
 * @returns {Array.<number>} The different breaks we want for the data we have.
 */
export const reclassifyData = (data, style, classificationMethod, defaultBands, currentPage, queryParams, options = {}) => {
  // Helper function to round values and ensure successive values are not identical
  const roundValues = (values, sigFigs) => {
    let roundedValues = values.map((value) => roundToSignificantFigures(value, sigFigs));
    for (let i = 1; i < roundedValues.length; i++) {
      while (roundedValues[i] === roundedValues[i - 1] && sigFigs < 10) {
        sigFigs++;
        roundedValues = values.map((value) => roundToSignificantFigures(value, sigFigs));
      }
    }
    return roundedValues;
  };

  function replaceZeroValues(num) {
    if (num === 0) {
      return 0.01
    }
    else {
      return num
    }
  }

  function replaceZeroPointValues(num) {
    if (num === 0.01) {
      return 0
    }
    else {
      return num
    }
  }

  // Check if trseLabel is true in options
  if (options.trseLabel) {
    // Return fixed bins from 0 to 100 in steps of 10
    return [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  }

  if (style.includes("continuous")) {
    let values = data.map((value) => value.value);
    if (classificationMethod === 'd') {
      const selectedMetricParamName = currentPage.config.filters.find((filter) => filter.containsLegendInfo === true);
      const selectedPageBands = defaultBands.find((band) => band.name === currentPage.category);
      if (selectedPageBands && selectedMetricParamName) {
        const metrics = selectedPageBands.metric.filter((metric) => metric.name === queryParams[selectedMetricParamName.paramName]?.value);
        if(metrics.length > 1) return metrics.find((metric) => currentPage.pageName.includes(metric.pageName)).values;
        if(metrics.length === 1) return metrics[0].values;
      }
      classificationMethod = 'q';
    }
    if (classificationMethod === 'l') {
      values = values.map(replaceZeroValues)
    }
    const unroundedBins = [...new Set(chroma.limits(values, classificationMethod, 8))];
    let roundedBins = [...new Set(roundValues(unroundedBins, 2))];
    if (classificationMethod === 'l') {
      roundedBins = roundedBins.map(replaceZeroPointValues)
    }
    return roundedBins;
  } else if (style.includes("categorical")) {
    return;
  } else if (style.includes("diverging")) {
    let absValues = data.map((value) => Math.abs(value.value));
    if (classificationMethod === 'd') {
      const selectedMetricParamName = currentPage.config.filters.find((filter) => filter.containsLegendInfo === true);
      const selectedPageBands = defaultBands.find((band) => band.name === currentPage.category);
      if (selectedPageBands) {
        const listMetrics = selectedPageBands.metric.filter((metric) => metric.name === queryParams[selectedMetricParamName.paramName]);
        if (listMetrics.length > 1) {
          const metric = listMetrics.find((metric) => currentPage.pageName.includes(metric.pageName));
           return !style.includes("line") ? metric.differenceValues : metric.differenceValues.slice(metric.differenceValues.length / 2)
        }
        if(listMetrics.length === 1) return !style.includes("line") ? listMetrics[0].differenceValues : listMetrics[0].differenceValues.slice(listMetrics[0].differenceValues.length / 2);
      }
      classificationMethod = 'q';
    }
    if (classificationMethod === 'l') {
      absValues = absValues.map(replaceZeroValues)
    }
    const unroundedBins = [...new Set(chroma.limits(absValues, classificationMethod, 3))];
    let roundedBins = unroundedBins.map(function(ele){
      return Math.round(ele*100)/100;
    });
    if (classificationMethod === 'l') {
      absValues = absValues.map(replaceZeroValues)
    }
    roundedBins = roundedBins.filter((value) => value !== 0)
    if (style.includes("line")) return [0, ...roundedBins];
    const negativeBins = roundedBins.slice().reverse().map(val => -val);
    return [...negativeBins, 0, ...roundedBins];
  } else {
    console.log("Style not recognized");
    return [];
  }
};

/**
 * Reclassifies GeoJSON data based on the provided style.
 * This function categorizes GeoJSON data into different groups or classes depending on the style specified.
 *
 * @function reclassifyGeoJSONData
 * @param {Array.<{id: number, value: string}>} data - The differents feature that we have 
 * @param {string} style - The type of geometry we have
 * @returns The differents breaks we want for the data we have
 */
export const reclassifyGeoJSONData = (data, style) => {
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

/**
   * Generates the style configuration for a regular layer based on the geometry
   * type of the layer.
   *
   * @property {string} geometryType - The type of geometry for the layer. Possible values are "polygon", "line", or "point".
   * @returns {Object} The style configuration object for the layer.
   */
export const getLayerStyle = (geometryType) => {
  switch (geometryType) {
    case "polygon":
      return {
        id: "",
        type: "fill",
        source: "",
        paint: {
          "fill-color": "rgb(255, 255, 0, 0)",
          "fill-outline-color": "rgba(195, 195, 195, 1)",
          "fill-opacity": 1
        },
      };
    case "line":
      return {
        id: "",
        type: "line",
        source: "",
        paint: {
          "line-color": "black",
          "line-opacity": 0.8,
        },
      };
      case "point":
        return {
          id: "",
          type: "circle",
          source: "",
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0, 2,
              12, 8,
              22, 15
            ],
            "circle-color": "#1E90FF",
            "circle-stroke-color": "#FFFFFF",
            "circle-stroke-width": 2,
            "circle-opacity": 0.85
          },
        };
    default:
      return {};
  }
};

/**
 * Generates the style configuration for a hover layer based on the geometry
 * type of the layer.
 * @component
 * @property {string} geometryType - The type of geometry for the hover layer. Possible values are "polygon", "line", or "point".
 * @returns {Object} The style configuration object for the hover layer.
 */
export const getHoverLayerStyle = (geometryType) => {
  switch (geometryType) {
    case "polygon":
      return {
        id: "",
        type: "line",
        paint: {
          "line-color": ["case", ["boolean", ["feature-state", "hover"], false], "red", "transparent"],
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            // Specify zoom levels and corresponding line widths
            5,
            1, // At zoom level 5, line width will be 1
            10,
            2, // At zoom level 10, line width will be 2
            15,
            4, // At zoom level 15, line width will be 4
            20,
            8, // At zoom level 20, line width will be 8
          ],
        }
      };
    case "line":
      return {
        id: "",
        type: "line",
        paint: {
          "line-color": ["case", ["boolean", ["feature-state", "hover"], false], "red", "transparent"],
          "line-opacity": 0.8,
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            // Specify zoom levels and corresponding line widths
            5,
            2, // At zoom level 5, line width will be 1
            10,
            4, // At zoom level 10, line width will be 2
            15,
            8, // At zoom level 15, line width will be 4
            20,
            16, // At zoom level 20, line width will be 8
          ],
          "line-offset": [
            "interpolate",
            ["linear"],
            ["zoom"],
            // Specify zoom levels and corresponding line widths
            5,
            -1, // At zoom level 5, line width will be 1
            10,
            -2, // At zoom level 10, line width will be 2
            15,
            -6, // At zoom level 15, line width will be 4
            20,
            -8, // At zoom level 20, line width will be 8
          ],
        }
      };
    case "point":
      return {
        id: "",
        type: "circle",
        paint: {
          "circle-radius": 5,
          "circle-color": ["case", ["boolean", ["feature-state", "hover"], false], "red", "transparent"],
        }
      };
    default:
      return {};
  }
};

/**
 * Retrieves the source layer of a specified layer from a map.
 *
 * @param {Object} map - The map object from which to retrieve the layer.
 * @param {string} layerId - The ID of the layer to retrieve the source layer from.
 * @returns {string|null} The source layer of the specified layer, or null if the layer does not exist.
 */
export const getSourceLayer = (map, layerId) => {
  const layer = map.getLayer(layerId);
  return layer ? layer['sourceLayer'] : null;
};


 /**
   * Checks whether all the features in a GeoJSON feature collection have non-null geometries.
   *
   * @param {Object} featureCollection - The GeoJSON feature collection to check.
   * @returns {boolean} True if all features have non-null geometries; otherwise, false.
   */
 export function checkGeometryNotNull(featureCollection) {
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