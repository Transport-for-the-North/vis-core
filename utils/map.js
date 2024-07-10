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
 * This function is designed to create paint properties for various map features such as polygons, lines, and circles.
 *
 * @function createPaintProperty
 * @param {Array.<(number|string)>} bins - The differents breaks used for the legend
 * @param {string} style - The type of geometries that we want to display on the map
 * @param {Array.<string>} colours - The array of colours available for the styling. Usually an array of #FFFF
 * @param {float} opacityValue - the current opacity value, between 0 and 1
 * @returns The paint property for the given geometries
 */
export function createPaintProperty(bins, style, colours, opacityValue) {
  let colors = [];
  let colorObject = [];
  for (var i = 0; i < bins.length; i++) {
    colors.push(bins[i]);
    colors.push(colours[i]);
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
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
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
        "line-color": "rgba(0, 0, 255, 1)",
        "line-width": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          0.1, // Line width starts at 1 at the value of 0
          Math.max(...bins),
          15,
        ],
        "line-opacity": 1,
        "line-offset": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          0.05,
          Math.max(...bins),
          7.5,
        ],
      };
    case "line-diverging":
      return {
        "line-color": [
          "case",
          ["<", ["feature-state", "value"], 0],
          "rgba(255, 0, 0, 1)", // Red for negative values
          [">", ["feature-state", "value"], 0],
          "rgba(0, 0, 255, 1)",
          "rgba(0, 0, 0, 1)",
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          0.1, 
          Math.max(...bins),
          15,
        ],
        "line-opacity": 1,
        "line-offset": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          0.05, // Line width starts at 1 at the value of 0
          Math.max(...bins),
          7.5,
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
          0.8,
        ],
        "circle-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
          0.0,
          0.65,
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
      return {
        "circle-color": "rgba(0, 0, 0, 100)",
        "circle-stroke-width": 0.8,
        "circle-opacity": 1,
        "circle-radius": 5,
        "circle-stroke-color": "rgba(0, 0, 0, 100)",
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
 * @returns {Array.<number>} The different breaks we want for the data we have.
 */
export const reclassifyData = (data, style, classificationMethod) => {
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
    if (num == 0) {
      return 0.01
    }
    else {
      return num
    }
  }

  function replaceZeroPointValues(num) {
    if (num == 0.01) {
      return 0
    }
    else {
      return num
    }
  }

  if (style.includes("continuous")) {
    let values = data.map((value) => value.value);
    if (classificationMethod == 'l') {
      values = values.map(replaceZeroValues)
    }
    console.log("Bins recalculated for continuous data");
    const unroundedBins = [...new Set(chroma.limits(values, classificationMethod, 8))];
    let roundedBins = [...new Set(roundValues(unroundedBins, 2))];
    if (classificationMethod == 'l') {
      roundedBins = roundedBins.map(replaceZeroPointValues)
    }
    return roundedBins;
  } else if (style.includes("categorical")) {
    console.log("Categorical classification not implemented for joined data");
    return;
  } else if (style.includes("diverging")) {
    let absValues = data.map((value) => Math.abs(value.value));
    if (classificationMethod == 'l') {
      absValues = absValues.map(replaceZeroValues)
    }
    const unroundedBins = [...new Set(chroma.limits(absValues, classificationMethod, 3))];
    let roundedBins = unroundedBins.map(function(ele){
      return Math.round(ele*100)/100;
    });
    if (classificationMethod == 'l') {
      absValues = absValues.map(replaceZeroValues)
    }
    roundedBins = roundedBins.filter((value) => value !== 0)
    console.log(roundedBins);
    if (style.includes("line")) return [0, ...roundedBins];
    const negativeBins = roundedBins.slice().reverse().map(val => -val);
    console.log("Bins calculated for diverging data");
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