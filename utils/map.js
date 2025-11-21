import { roundToSignificantFigures } from "./math";
import chroma from "chroma-js";

/**
 * Helper: Extracts the metric definition from the defaultBands.
 * Returns an object that includes values, differenceValues, and colours for the metric,
 * or null if nothing is found.
 *
 * @param {Array} defaultBands - The bands array from defaults.
 * @param {Object} currentPage - The current app page (used to resolve the page category).
 * @param {Object} queryParams - The URL query parameters.
 * @param {Object} options - Additional options; for example, { trseLabel: true }.
 * @returns {Object|null} The metric definition or null.
 */
export const getMetricDefinition = (
  defaultBands,
  currentPage,
  queryParams,
  options = {}
) => {
  const pageCategory = currentPage.category || currentPage.pageName;
  const selectedPageBands = defaultBands?.find((band) => band.name === pageCategory);
  let metricName = null;
  if (options.trseLabel) {
    metricName = "trse";
  } else if (currentPage.config && currentPage.config.filters) {
    const selectedMetricFilter = currentPage.config.filters.find(
      (filter) => filter.containsLegendInfo === true
    );
    metricName = queryParams[selectedMetricFilter?.paramName]?.value;
  }
  if (selectedPageBands && metricName) {
    return selectedPageBands.metric.find((m) => m.name === metricName) || null;
  }
  return null;
};

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
    case "symbol": {
      opacityProp = "icon-opacity";
      break;
    }
    default:
      throw new Error(`Invalid layer type ${layerType}`);
  }
  return opacityProp;
}


/**
 * Retrieves thr line width for givens et of bins
 * @function getWidthProperty
 * @param {string} layerType - The type of the layer. Expected values are 'line'
 * @param {(Array<number|string>)} bins -- breaks used for legend
 * @returns {Aarray} The line width property for mapbox styling
 */

export function getWidthProperty(layerType) {
  // let widthObject = [];
  // for (let i = 0; i < bins.length; i++) {
  //   widthObject.push(bins[i]);
  //   widthObject.push((7.5/bins[bins.length - 1] * bins[i]) + 1);
  // }
  let widthProp;
  switch (layerType) {
    case "line": {
      widthProp = "line-width";
      break;
    }
    case "circle": {
      widthProp = "circle-radius";
      break;
    }
    default:
      console.warn(`Unable to get width property name for layerType ${layerType}`);
  }
  return widthProp;
}

export const MAP_CONSTANTS = {
  defaultMinWidth: 1,
  defaultMaxWidth: 8.5,
  defaultWidthFactor: 1,
  defaultOffset: 0.75,

  //circle constants
  defaultMinRadius: 2,
  defaultMaxRadius: 25
}

export const buildLegendRadius = (bins) => {
  const min = MAP_CONSTANTS.defaultMinRadius;
  const max = MAP_CONSTANTS.defaultMaxRadius;
  const minBin = Math.min(...bins);
  const maxBin = Math.max(...bins);

  return bins.map((v) => {
    if (maxBin === minBin) return (min + max) / 2; // all same value
    const t = (v - minBin) / (maxBin - minBin);    // 0..1
    return min + t * (max - min);                  // baseline radius
  });
};

const getBaselineMaxForProp = (paintProp) =>
  paintProp && paintProp.includes("line")
    ? MAP_CONSTANTS.defaultMaxWidth
    : MAP_CONSTANTS.defaultMaxRadius;

export const calculateMaxWidthFactor = (width, paintProp) => {
  if (typeof width !== 'number') {
    throw new Error("Invalid maximum width value");
  }

  const baseline = getBaselineMaxForProp(paintProp);
  return width / baseline;
};

/**
 * Adjusts an existing interpolation array by applying a width factor.
 *
 * This function takes an interpolation array, which is expected to start with the keyword "interpolate",
 * and applies a scaling factor to the width values within the array. The function ensures that the existing
 * interpolation is consistent with a default width before applying the new factor.
 *
 * @param {Array} existingInterpolationArray - The interpolation array to be adjusted. It must start with the
 *                                              keyword "interpolate" and contain width values at specific positions.
 * @param {number} factor - The factor by which to scale the width values in the interpolation array.
 * @returns {Array} A new interpolation array with the width values adjusted by the specified factor.
 * @throws {Error} If the input array is not a valid interpolation expression or if the existing factors
 *                 in the interpolation are inconsistent.
 */
export const applyWidthFactor = (existingInterpolationArray, factor, paintProp, constantOffset = MAP_CONSTANTS.defaultOffset) => {
  if (!Array.isArray(existingInterpolationArray) || existingInterpolationArray[0] !== "interpolate") {
    throw new Error("Invalid interpolation expression");
  }

  // Extract the existing width
  const baseline = getBaselineMaxForProp(paintProp);
  const existingMax = existingInterpolationArray[existingInterpolationArray.length - 1];

  // Calculate the existing factoring - this should be relative to the default widths
  const oldFactorMax = existingMax / baseline;

  const overallFactor = factor / oldFactorMax;
  const newInterpolationArray = [...existingInterpolationArray];
  const newLineOffsetArray = paintProp.includes("line")
    ? ["interpolate", ["linear"], ["feature-state", "valueAbs"]]
    : null;

  for (let i = 4; i < newInterpolationArray.length; i += 2) {
    if (typeof newInterpolationArray[i] === "number") {
      newInterpolationArray[i] *= overallFactor;
      if (newLineOffsetArray) {
        const lineOffsetValue = -((newInterpolationArray[i] / 2) + constantOffset);
        newLineOffsetArray.push(newInterpolationArray[i - 1], lineOffsetValue);
      }
    }
  }

  return {
    widthInterpolation: newInterpolationArray,
    lineOffsetInterpolation: newLineOffsetArray
  };
}

/**
 * Safely updates an existing opacity expression by replacing only the default/fallback
 * value with the newOpacity, preserving the rest of the expression.
 *
 * Handles common expression types where the final argument is a default/fallback:
 * - case
 * - match
 * - coalesce
 *
 * For non-expression or unsupported types, returns the numeric newOpacity.
 *
 * @param {any} existingExpr - The current paint property value (could be a number or expression array).
 * @param {number} newOpacity - The new opacity value to apply.
 * @returns {any} - The updated expression/value to set on the layer.
 */
export const updateOpacityExpression = (existingExpr, newOpacity) => {
  if (Array.isArray(existingExpr)) {
    const op = existingExpr[0];
    if (op === "case" || op === "match" || op === "coalesce") {
      const updated = existingExpr.slice(0, existingExpr.length - 1);
      updated.push(newOpacity);
      return updated;
    }
  }
  // Fallback: just set numeric opacity
  return newOpacity;
};


/**
 * Generates a Mapbox GL paint property object based on the provided parameters.
 * This function is designed to create paint properties for various map features such as polygons, lines, circles, and points.
 *
 * @function createPaintProperty
 * @param {Array.<(number|string)>} bins - The different breaks used for the legend
 * @param {string} style - The type of geometries that we want to display on the map. Supported styles include 'polygon-continuous', 'polygon-diverging', 'line-continuous', 'line-diverging', 'circle-continuous', 'circle-diverging', 'point-continuous', and 'point-diverging'.
 * @param {Array.<string>} colours - The array of colours available for the styling. Usually an array of #FFFF
 * @param {float} opacityValue - The current opacity value, between 0 and 1
 * @param {float} widthValue - 
 * @param {Object} layerConfig - Optional layer configuration object that may contain defaultLineOffset
 * @returns The paint property for the given geometries
 */
export function createPaintProperty(bins, style, colours, opacityValue, layerConfig = {}) {
  let widthObject = [];
  let colors = [];
  let colorObject = [];
  let functionType = "";
  let width = "";
  // gets end of current path 
  const path = window.location.pathname;
  
  const lastSegment = path.substring(path.lastIndexOf('/') + 1);
  // gets app name
  const appName = process.env.REACT_APP_NAME;

  // determines whether to use linear or root function for width 
  functionType = chooseLinearOrRootFunction(bins, appName, lastSegment);

  // If categorical, we want to order for consistency.
  if (style.includes("categorical")) {
    // If the only values are 0 and 1, we want to ensure 1 is first and 0 is last for consistency.
    if (bins.length === 2 && bins.includes(0) && bins.includes(1)) {
      bins = [1, 0];
    } else if (bins.every(value => typeof value === 'number')) { // If all values are numbers, sort numerically.
      bins.sort((a, b) => a - b);
    } else {
      bins.sort(); // Otherwise, sort alphabetically.
    }
  }

  // For continuous styles with only negative values to zero, reverse color mapping
  // so that the most negative (largest magnitude) gets the "hottest" color
  if (style.includes("continuous") && bins.length > 1) {
    const maxBin = Math.max(...bins);
    const minBin = Math.min(...bins);
    
    // Check if we have only negative to zero values (max is 0 or close to 0, min is negative)
    if (maxBin <= 0.001 && minBin < -0.001) {
      colours = [...colours].reverse();
    }
  }

  for (var i = 0; i < bins.length; i++) {
    colors.push(bins[i]);
    colors.push(colours[i]);
    widthObject.push(bins[i]);

    // either linear or root function used for line-width as appropriate 
    width = calculateLineWidth(bins, functionType, bins[i]);

    widthObject.push(width);
    colorObject.push({ value: bins[i], color: colours[i] });
  }

  // line offset expression determined and allocated to line-diverging expression 
  // this ensures line offset is correct if root function used for line-width
  let offsetExpression;
  offsetExpression = determineLineOffsetExpression(bins, widthObject, functionType, layerConfig);

  switch (style) {
    case "polygon-diverging":
    case "polygon-continuous": {
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
          ...widthObject
        ],
        "line-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],
        "line-offset": layerConfig.defaultLineOffset ?? [
          "interpolate",
          ["linear"],
          ["feature-state", "valueAbs"],
          Math.min(...bins), -1,
          Math.max(...bins), -5
        ]
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
          ...widthObject
        ],
        "line-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],

        "line-offset":
          offsetExpression,

      };
    case "line-categorical":
      return {
        "line-color": [
          "match",
          ["feature-state", "value"],
          ...colors,
          "#bdbdbd" // default = grey
        ],
        "line-opacity": [
          "case",
          ["in", ["feature-state", "value"], ["literal", [null]]],
          0,
          opacityValue ?? 1,
        ],
        "line-width": 3,
        "line-offset": layerConfig.defaultLineOffset !== undefined ? [
          "interpolate",
          ["linear"],
          ["to-number", ["feature-state", "valueAbs"]],
          Math.min(...bins),
          layerConfig.defaultLineOffset,
          Math.max(...bins),
          layerConfig.defaultLineOffset,
        ] : [
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
    case "circle-categorical": {
      return {
        "circle-color": [
          "match",
          ["feature-state", "value"],
          ...colors,
          "#bdbdbd" // default = grey
        ],
        "circle-stroke-width": 1,
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
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, 2,
          6, 4,
          12, 8
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

const chooseLinearOrRootFunction = (bins, appName, lastSegment) => {
  let functionType;

  // Currently on applying root function for noham link diffs
  if (appName === "noham" && lastSegment === "link-result-difference") {
    if (bins.length > 1) {
      const diffs = [];

      // get differences
      for (let i = 1; i < bins.length; i++) {
        diffs.push(Math.abs(bins[i] - bins[i - 1]));
      }

      // calculate standard deviation 
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const stdDev = Math.sqrt(
        diffs.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / diffs.length
      );

      // compare normalised standard deviation to threshold to determine whether to use linear or root function  
      const threshold = 0.9;
      functionType = stdDev / avg < threshold ? "linear" : "root";
    } else {
      functionType = "";
    }
  } else {
    functionType = "linear";
  }

  return functionType;
};

const calculateLineWidth = (bins, functionType, binValue) => {

  let width;

  console.log(functionType);

  if (functionType === "root") {
    // get maximum value and normalise each value  
    const maxAbs = Math.max(...bins.map(b => Math.abs(b)));
    const normalized = Math.abs(binValue) / maxAbs;
    // exponent (higher value deepens curve)
    const exponent = 3;
    const scaled = Math.pow(normalized, 1 / exponent);
    // Ensures width is between 1 and 7.5
    width = 1 + scaled * 7.5;
  } else if (functionType === "linear") {
    // Linear formula - use absolute values for both binValue and max bin
    const maxBinAbs = Math.max(...bins.map(b => Math.abs(b)));
    width = (7.5 / maxBinAbs) * Math.abs(binValue) + 1;
  }
  return width;
};

const determineLineOffsetExpression = (bins, widthObject, functionType, layerConfig = {}) => {

  // Use custom defaultLineOffset if provided, otherwise use default values
  const customLineOffset = layerConfig.defaultLineOffset !== undefined ? layerConfig.defaultLineOffset : null;
  
  // Below either uses root based scaling for offset or linear, depending on width calculation
  // If root function has been used for width, it mirrors this for offset and divides it by 1.3 to avoid the offset being excessive
  // If linear has been used offsets are allocated based off linear scale 
  let offsetExpression;

  if (functionType === "root" && customLineOffset === null) {

    offsetExpression = [
      "/",
      [
        "interpolate",
        ["linear"],
        ["feature-state", "valueAbs"],
        ...widthObject
      ],
      1.3
    ];

  } else if (customLineOffset !== null) {
    
    // If custom line offset is provided, use it regardless of function type
    const minOffset = customLineOffset;
    const maxOffset = customLineOffset;

    offsetExpression = [
      "interpolate",
      ["linear"],
      ["feature-state", "valueAbs"],
      Math.min(...bins), minOffset,
      Math.max(...bins), maxOffset
    ];

  } else {
    
    // Default linear behavior
    const minOffset = -1;
    const maxOffset = -5;

    offsetExpression = [
      "interpolate",
      ["linear"],
      ["feature-state", "valueAbs"],
      Math.min(...bins), minOffset,
      Math.max(...bins), maxOffset
    ];
  }

  return offsetExpression;
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
export const reclassifyData = (
  data,
  style,
  classificationMethod,
  defaultBands,
  currentPage,
  queryParams,
  options = {}
) => {
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
    return num === 0 ? 0.01 : num;
  }

  function replaceZeroPointValues(num) {
    return num === 0.01 ? 0 : num;
  }

  if (style.includes("continuous")) {
    let values = data.map((value) => value.value);
    if (classificationMethod === "d") {
      // Use getMetricDefinition to get the appropriate metric definition
      const metric = getMetricDefinition(defaultBands, currentPage, queryParams, options);
      if (metric) {
        return metric.values;
      }
      // Fallback to quantile method if no metric definition is found
      classificationMethod = "q";
    }
    if (classificationMethod === "l") {
      values = values.map(replaceZeroValues);
    }
    const unroundedBins = [...new Set(chroma.limits(values, classificationMethod, 8))];
    let roundedBins = [...new Set(roundValues(unroundedBins, 2))];
    if (classificationMethod === "l") {
      roundedBins = roundedBins.map(replaceZeroPointValues);
    }
    return roundedBins;
  } else if (style.includes("categorical")) {
    let values = [...new Set(data.map((value) => value.value))];
    return values;
  } else if (style.includes("diverging")) {
    let absValues = data.map((value) => Math.abs(value.value));
    if (classificationMethod === "d") {
      // Use getMetricDefinition to get the appropriate metric definition
      const metric = getMetricDefinition(defaultBands, currentPage, queryParams, options);
      if (metric) {
        return !style.includes("line")
          ? metric.differenceValues
          : metric.differenceValues.slice(metric.differenceValues.length / 2);
      }
      // Fallback to quantile method if no metric definition is found
      classificationMethod = "q";
    }
    if (classificationMethod === "l") {
      absValues = absValues.map(replaceZeroValues);
    }
    const unroundedBins = [...new Set(chroma.limits(absValues, classificationMethod, 3))];
    let roundedBins = unroundedBins.map((ele) => Math.round(ele * 100) / 100);
    if (classificationMethod === "l") {
      absValues = absValues.map(replaceZeroValues);
    }
    roundedBins = roundedBins.filter((value) => value !== 0);
    if (style.includes("line")) return [0, ...roundedBins];
    const negativeBins = roundedBins.slice().reverse().map((val) => -val);
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

    case "symbol":
      return {
        id: "",
        type: "symbol",
        source: "",
        layout: {
          "icon-image": ["get", "icon_name"],
          "icon-size": 1,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true
        },
        paint: {
          "icon-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0,
            1
          ]
        }
      }
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
    case "symbol":
      return {
        id: "",
        type: "symbol",
        source: "",
        "source-layer": "",
        layout: {
          "icon-image": ["concat", ["get", "icon_name"], "-hover"],
          "icon-size": 1.2,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true
        },
        paint: {
          "icon-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            1,
            0
          ]
        }
      }
    default:
      return {};
  }
};

/**
 * Generates the style configuration for a selected layer based on the layer
 * type (e.g., "fill", "line", "circle", "symbol", "polygon", or "point"). 
 * For polygon layers ("fill" type), this function will always return an outline style.
 * @component
 * @property {string} layerType - The type of layer. Possible values are "fill", "line", "circle", "symbol", "polygon", "point", etc.
 * @returns {Object} The style configuration object for the selected layer.
 */
export const getSelectedLayerStyle = (layerType) => {
  switch (layerType) {
    case "fill":
    case "polygon":
      // Handle fill layers (polygons) by drawing an outline
      return {
        id: "",
        type: "line",
        paint: {
          "line-color": [
            "case",
            ["==", ["feature-state", "selected"], true],
            "#f00",
            "transparent",
          ],
          "line-width": 2,
        },
      };
    case "line":
      // Handle line layers
      return {
        id: "",
        type: "line",
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#f00",
            "transparent",
          ],
          "line-width": 4,
        },
      };
    case "symbol":
      // Handle symbol layers (e.g., icons or labels)
      return {
        id: "",
        type: "symbol",
        source: "",
        "source-layer": "",
        layout: {
          "icon-image": ["concat", ["get", "icon_name"], "-select"],
          "icon-size": 1.2,
          "icon-allow-overlap": true,
          "icon-ignore-placement": true
        },
        paint: {
          "icon-opacity": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            1,
            0
          ],
          "text-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#f00",
            "#000",
          ],
          "icon-color": [
            "case",
            ["boolean", ["feature-state", "selected"], false],
            "#f00",
            "#000",
          ],
        },
      };
    case "circle":
    case "point":
      // Handle point layers
      return {
        id: "",
        type: "circle",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0, 2,
            12, 8,
            22, 15
          ],
          "circle-color": [
            "case",
            ["==", ["feature-state", "selected"], true],
            "blue",
            "transparent",
          ],
          "circle-opacity": 0.75,
          "circle-stroke-width": 2,
          "circle-stroke-color": [
            "case",
            ["==", ["feature-state", "selected"], true],
            "black",
            "transparent"
          ],
        },
      };
    default:
      // Handle other layer types if necessary
      console.warn(`Unhandled layer type: ${layerType}`);
      return {}; // Return empty object if the layer type is not supported
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

/**
 * Checks if any feature in the feature collection has a non-null geometry using Array.some().
 *
 * @param {Object} featureCollection - A GeoJSON FeatureCollection object.
 * @returns {boolean} - Returns true if at least one geometry is not null, otherwise false.
 */
export function hasAnyGeometryNotNull(featureCollection) {
  // Validate that the feature collection and its features array exist and are not empty
  if (
    !featureCollection ||
    !Array.isArray(featureCollection.features) ||
    featureCollection.features.length === 0
  ) {
    return false; // No features to check
  }

  // Use the 'some' method to check for at least one non-null geometry
  return featureCollection.features.some(feature => !!feature.geometry);
}

/**
 * Returns the provided bufferSize if set; otherwise 7 for 'line' geometry, else 0.
 * @param {string} geometryType - Layer geometry type (e.g., 'line', 'point', 'polygon').
 * @param {*} bufferSize - Existing buffer size; used if not null/undefined.
 * @returns {*} Resolved buffer size.
 */
export function getDefaultLayerBufferSize(geometryType, bufferSize) {
  return bufferSize != null ? bufferSize : (geometryType === 'line' ? 7 : 0);
}