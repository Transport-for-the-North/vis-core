import { roundToTwoSignificantFigures } from "./math";
import chroma from "chroma-js";

/**
 * Returns the opacity property name for a given layer type.
 *
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
 * 
 * @param {Array[int || string]} bins - The differents breaks used for the legend
 * @param {string} style - The type of geometries that we want to display on the map
 * @param {Array[string]} colours - The array of colours available for the styling. Usually an array of #FFFF
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
    case "polygon-continuous" || "polygon-diverging":
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
          "case",
          ["<", ["feature-state", "value"], 0],
          "rgba(255, 0, 0, 1)", // Red for negative values
          [">", ["feature-state", "value"], 0],
          "rgba(0, 0, 255, 1)", // Blue for positive values
          "rgba(0, 0, 0, 0.0)", // Make zero invisible
        ],
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
      };
    case "line-diverging":
      return {
        "line-color": [
          "case",
          ["==", ["feature-state", "value"], null],
          colours[4],
          ["interpolate", ["linear"], ["feature-state", "value"], ...colors],
        ],
        "line-width": [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          0.1,
          0.1, // Line width starts at 1 at the value of 0
          Math.max(...bins),
          20,
        ],
        "line-opacity": 1,
      };
    case "circle-continuous" || "circle-diverging": {
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
}

/**
 * 
 * @param {Array[Object{id, value}]} data - The differents feature that we have 
 * @param {string} style - The type of geometry we have
 * @returns The differents breaks we want for the data we have
 */
export const reclassifyData = (data, style) => {
  if (style.includes("continuous")) {
    let values = data.map((value) => value.value);
    console.log("Bins recalculated for continuous data");
    const unroundedBins = chroma.limits(values, "q", 8);
    const roundedBins = unroundedBins.map((value) =>
      roundToTwoSignificantFigures(value)
    );
    return roundedBins;
  } else if (style.includes("categorical")) {
    console.log("Categorical classification not implemented for joined data");
    return;
  } else if (style.includes("diverging")) {
    const absValues = data.map((value) => Math.abs(value.value));
    const unroundedBins = chroma.limits(absValues, "q", 3);
    const roundedBins = unroundedBins.map((value) =>
      roundToTwoSignificantFigures(value)
    );
    const negativeBins = roundedBins.toReversed().reduce((acc, val) => {
      const negative = val * -1;
      return acc.concat(negative);
    }, []);
    console.log("Bins calculated for diverging data");
    return [...negativeBins, 0, ...roundedBins];
  } else {
    console.log("Style not recognized");
    return [];
  }
};

/**
 * 
 * @param {Array[Object{id, value}]} data - The differents feature that we have 
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