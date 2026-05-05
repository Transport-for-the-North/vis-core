import { forEach } from "lodash";
import { convertStringToNumber, numberWithCommas, formatNumber } from "utils";

/**
 * Interpolates widths for color stops based on width stops.
 *
 * @param {Array} colorStops - An array of color stop objects, each with a `value` property.
 * @param {Array} widthStops - An array of width stop objects, each with a `value` and `width` property.
 * @param {string} type - The type of the layer (e.g., 'circle', 'line').
 * @returns {Array} An array of objects with `value` and `width` properties, where `width` is the interpolated diameter.
 * @throws Will throw an error if less than two color stops or width stops are provided.
 */
export function interpolateWidths(colorStops, widthStops, type) {

  // Validate input
  if (!colorStops || colorStops.length === 0) {
    throw new Error('At least one color stop is required.');
  }
  if (!widthStops || widthStops.length === 0) {
    throw new Error('At least one width stop is required.');
  }

  // If the number of color stops matches width stops, map directly
  if (colorStops.length === widthStops.length) {
    return colorStops.map((cs, i) => ({
      value: cs.value,
      width: type === 'circle' ? widthStops[i].width * 2 : widthStops[i].width
    }));
  }

  // If only one width stop, apply it to all color stops
  if (widthStops.length === 1) {
    const width = widthStops[0].width;
    return colorStops.map(cs => ({ value: cs.value, width: type === 'circle' ? width * 2 : width }));
  }

  const convertedWidthStops = widthStops.map(stop => ({
    width: stop.width,
    value: convertStringToNumber(stop.value)
  }));

  const widths = [];
  for (let i = 0; i < colorStops.length; i++) {
    const value = colorStops[i].value;
    const convertedValue = convertStringToNumber(value);
    const width = interpolateWidthAtValue(convertedWidthStops, Math.abs(convertedValue));
    widths.push({ value, width: type === 'circle' ? width * 2 : width });
  }

  return widths;
}

/**
 * Interpolates the width at a given value based on width stops.
 *
 * @param {Array} widthStops - An array of width stop objects, each with a `value` and `width` property.
 * @param {number} value - The value at which to interpolate the width.
 * @returns {number} The interpolated width.
 */
export function interpolateWidthAtValue(widthStops, value) {
  if (value <= widthStops[0].value) {
    return widthStops[0].width;
  }

  if (value >= widthStops[widthStops.length - 1].value) {
    return widthStops[widthStops.length - 1].width;
  }

  for (let i = 0; i < widthStops.length - 1; i++) {
    const startStop = widthStops[i];
    const endStop = widthStops[i + 1];

    if (value >= startStop.value && value <= endStop.value) {
      const ratio =
        (value - startStop.value) / (endStop.value - startStop.value);
      const width =
        startStop.width + ratio * (endStop.width - startStop.width);
      return width;
    }
  }

  return widthStops[widthStops.length - 1].width;
}

/**
 * Interprets a color expression from a map style specification and returns a list of color stops.
 * A color expression can be a simple string representing a color, or an array that defines
 * a color interpolation or match expression.
 *
 * @param {string|Array} expression - The color expression to interpret. This can be a simple
 *                                    color string or an array representing an 'interpolate',
 *                                    'step', or 'match' expression.
 * @returns {Array|null} An array of objects with 'value' and 'color' properties representing
 *                       the color stops, or null if the expression cannot be interpreted.
 */
export const interpretColorExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === "string") {
    return [{ color: expression }];
  } else if (Array.isArray(expression)) {
    // Handle different types of expressions
    switch (expression[0]) {
      case "interpolate":
      case "step":
        // Extract stops from the expression
        const stops = expression.slice(3);
        const colorStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          colorStops.push({
            value: numberWithCommas(stops[i]),
            color: stops[i + 1],
          });
        }
        return colorStops;
      case "case":
        // Extract pairs of case values and colors
        const caseValues = expression.slice(2);
        caseValues.splice(1, 1);
        const stop = [-1, 1, 0];
        const caseColorStops = [];
        forEach(caseValues, (value, index) => {
          caseColorStops.push({
            value: stop[index],
            color: value,
          });
        });
        return caseColorStops;
      case "match":
        // Extract pairs of match values and colors
        const matchValues = expression.slice(2, -1);
        const matchColorStops = [];
        for (let i = 0; i < matchValues.length; i += 2) {
          matchColorStops.push({
            value: matchValues[i],
            color: matchValues[i + 1],
          });
        }
        return matchColorStops;
      default:
        return null;
    }
  }
  return null;
};

/**
 * Interprets a width expression from a map style specification and calculates
 * intermediate width stops. The function assumes linear interpolation between stops.
 * The number of intermediate stops is dynamic and can be specified.
 *
 * @param {Array|number} expression - The width expression from the map style.
 * @returns {Array|null} - An array of width stops or null if the expression is invalid.
 */
export const interpretWidthExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === "number") {
    const arr = [{ width: expression }];
    arr._styleValue = expression;
    return arr;
  } else if (Array.isArray(expression)) {
    if (expression.some((item) => Array.isArray(item) && item.includes("zoom"))) {
      return [];
    }
    switch (expression[0]) {
      case "interpolate":
      case "step":
        const stops = expression.slice(3);
        const widthStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          widthStops.push({
            value: numberWithCommas(stops[i]),
            width: stops[i + 1],
          });
        }
        return widthStops;
      default:
        return [];
    }
  }
  return null;
};

/**
 * Interprets a line-dasharray expression from a map style specification and
 * determines which values should have dashed lines in the legend.
 *
 * @param {Array|Array<number>} expression - The line-dasharray expression from the map style.
 * @returns {Array|null} - An array of dash stops or null if the expression is invalid.
 */
export const interpretDashArrayExpression = (expression) => {
  if (!expression) return null;
  
  if (Array.isArray(expression) && expression.length > 0) {
    // Handle data-driven styling with 'match' expressions
    if (expression[0] === "match") {
      const matchValues = expression.slice(2, -1); // Remove 'match', property, and default value
      const dashStops = [];
      
      for (let i = 0; i < matchValues.length; i += 2) {
        const value = matchValues[i];
        const dashArrayValue = matchValues[i + 1];
        
        // Check if it's a literal array
        let isDashed = false;
        if (Array.isArray(dashArrayValue) && dashArrayValue[0] === 'literal') {
          const actualDashArray = dashArrayValue[1];
          // Consider it dashed if it's not [1, 0] (solid) and not empty
          isDashed = Array.isArray(actualDashArray) && 
                    actualDashArray.length > 0 && 
                    !(actualDashArray.length === 2 && actualDashArray[0] === 1 && actualDashArray[1] === 0);
        }
        
        dashStops.push({
          value: value,
          isDashed: isDashed,
        });
      }
      
      return dashStops;
    }
    
    // Handle simple array (legacy or static dasharray)
    if (typeof expression[0] === 'number') {
      // Simple dash array like [2, 2] - consider it dashed if not [1, 0]
      const isDashed = !(expression.length === 2 && expression[0] === 1 && expression[1] === 0);
      return [{ isDashed }];
    }
  }
  
  return null;
};

/**
 * Determines whether a legend entry has enough information to be rendered.
 *
 * An entry is considered renderable if it has a non-empty label, or if it
 * represents a known swatch type (`circle`, `line`, `fill`) with a positive size.
 *
 * @param {Object|null} e - The legend entry object to check.
 * @returns {boolean} `true` if the entry should be rendered, `false` otherwise.
 */
export const isRenderableEntry = (e) => {
  if (!e) return false;
  const hasLabel = e.label != null && String(e.label).trim() !== '';
  const hasKnownSwatch = ['circle', 'line', 'fill'].includes(e.type);
  const hasSize = e.type === 'fill' ? true : Number(e.width) > 0;
  return hasLabel || (hasKnownSwatch && hasSize);
};

/**
 * Formats a legend label value for display.
 *
 * Converts the value to a number and applies `formatNumber` if it is finite;
 * otherwise returns the original string value unchanged.
 *
 * @param {string|number} value - The raw label value from a color stop.
 * @returns {string|number} The formatted display value.
 */
export const formatLegendLabelValue = (value) => {
  const numericValue = convertStringToNumber(value);
  return Number.isFinite(numericValue) ? formatNumber(numericValue) : value;
};

/**
 * Controls how numeric labels are displayed in both discrete swatches and the
 * continuous gradient bar. Set on a layer via `legendNumberFormat`.
 *
 * @typedef {Object} LegendNumberFormat
 * @property {number} [decimals] - Fixed decimal places. When omitted the bar
 *   auto-detects an appropriate precision from the data values, or falls back
 *   to the generic `formatLegendLabelValue` behaviour for discrete swatches.
 * @property {string} [prefix=''] - String prepended to the formatted number
 *   (e.g. `'£'`, `'$'`).
 * @property {string} [suffix=''] - String appended to the formatted number
 *   (e.g. `'%'`, `' km'`).
 */

/**
 * Formats a legend value according to a {@link LegendNumberFormat} config object.
 *
 * This is the single extension point for label formatting. Both the discrete
 * swatch labels (DynamicLegend.jsx) and the continuous-bar axis / hover tooltip
 * (ContinuousGradientBar.jsx) call this function, so adding a new format option
 * only ever requires changing this one place.
 *
 * @param {string|number}       value                    - The raw value to format.
 * @param {LegendNumberFormat}  [legendFormat={}]        - The legendNumberFormat config from the layer.
 * @param {number|null}         [fallbackPrecision=null] - Auto-detected decimal precision used
 *                                                         when `legendFormat.decimals` is not set.
 *                                                         Pass the bar's auto-detected maxPrecision
 *                                                         here so the hover tooltip stays consistent
 *                                                         with the axis ticks.
 * @returns {string} The formatted display string.
 */
export const formatLegendNumber = (value, legendFormat = {}, fallbackPrecision = null) => {
  const num = convertStringToNumber(value);
  if (!Number.isFinite(num)) return String(value ?? '');

  const { decimals, prefix = '', suffix = '' } = legendFormat;

  // Resolve precision: explicit config wins, then the caller's auto-detected
  // fallback, then fall back to the generic formatLegendLabelValue behaviour.
  const precision = Number.isFinite(decimals) ? decimals
    : Number.isFinite(fallbackPrecision) ? fallbackPrecision
    : null;

  let core;
  if (precision === 0) {
    core = numberWithCommas(Math.round(num));
  } else if (precision !== null) {
    core = formatNumber(parseFloat(num.toFixed(precision)));
  } else {
    core = formatLegendLabelValue(num);
  }

  return `${prefix}${core}${suffix}`;
};

/**
 * Gets the width for a legend entry based on layer type and paint properties.
 *
 * This function determines the appropriate width/diameter for legend swatches by:
 * 1. Using the widthStop value if available (from data-driven styling)
 * 2. Returning null for mobile devices to allow CSS handling
 * 3. For circle layers: using circle-radius * 2 or defaulting to 10px
 * 4. For line layers: searching paintProps["line-width"] array for the label
 *    and returning the next index value, or defaulting to 2px
 * 5. For other layer types: defaulting to 10px
 *
 * @param {Object|null} widthStop - Width stop object with a width property from data-driven styling.
 * @param {boolean} isMobile - Whether the current viewport is mobile (≤ 900px).
 * @param {Object} layer - The map layer object containing type and other metadata.
 * @param {Object} paintProps - The layer's paint properties containing style definitions.
 * @param {string|number} label - The current legend entry label used for line width lookup.
 * @returns {number|null} The calculated width in pixels, or null for mobile devices.
 */
export const getEntryWidth = (widthStop, isMobile, layer, paintProps, label) => {
  if (widthStop) return widthStop.width;
  if (isMobile) return null;
  
  if (layer.type === "circle") {
    return typeof paintProps["circle-radius"] === "number" ? paintProps["circle-radius"] * 2 : 10;
  }
  
  if (layer.type === "line") {
    const lineWidthArray = paintProps["line-width"];
    if (Array.isArray(lineWidthArray)) {
      const labelIndex = lineWidthArray.indexOf(label);
      return labelIndex !== -1 && labelIndex < lineWidthArray.length - 1 
        ? lineWidthArray[labelIndex + 1] 
        : 2;
    }
    return 2;
  }
  
  return 10;
};

/**
 * Gets the dash information for a legend entry based on dash stops and current label value.
 *
 * This function determines whether a legend entry should display as dashed by:
 * 1. Using the dashStop value if available (from data-driven styling)
 * 2. Falling back to checking the raw paintProps["line-dasharray"] for legacy support
 * 3. Considering a line dashed if the dash array is not [1, 0] (solid line indicator)
 *
 * @param {Object|null} dashStop - Dash stop object with isDashed property from data-driven styling.
 * @param {Object} paintProps - The layer's paint properties containing style definitions.
 * @param {string|number} label - The current legend entry label used for dash lookup.
 * @returns {boolean} Whether the legend entry should be displayed as dashed.
 */
export const getEntryDashStatus = (dashStop, paintProps, label) => {
  if (dashStop && typeof dashStop.isDashed === 'boolean') {
    return dashStop.isDashed;
  }
  
  // Fallback for legacy or non-data-driven dash arrays
  const dashArray = paintProps["line-dasharray"];
  if (Array.isArray(dashArray)) {
    // For simple arrays, check if it's not [1, 0] (solid)
    if (typeof dashArray[0] === 'number') {
      return !(dashArray.length === 2 && dashArray[0] === 1 && dashArray[1] === 0);
    }
    
    // For match expressions in legacy format, find the value for this label
    if (dashArray[0] === 'match') {
      const matchValues = dashArray.slice(2, -1);
      for (let i = 0; i < matchValues.length; i += 2) {
        if (matchValues[i] === label) {
          const value = matchValues[i + 1];
          if (Array.isArray(value) && value[0] === 'literal') {
            const actualArray = value[1];
            return Array.isArray(actualArray) && 
                   actualArray.length > 0 && 
                   !(actualArray.length === 2 && actualArray[0] === 1 && actualArray[1] === 0);
          }
          return Array.isArray(value) && 
                 value.length > 0 && 
                 !(value.length === 2 && value[0] === 1 && value[1] === 0);
        }
      }
    }
  }
  
  return false;
};
