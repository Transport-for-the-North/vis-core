/**
 * Rounds a number to a specified number of decimal places.
 * @function roundToNPlaces
 * @param {number} value - The number to be rounded.
 * @param {number} places - The number of decimal places to round to.
 * @returns {number} The rounded number.
 *
 * @example
 * // Returns 123.46
 * roundToNPlaces(123.4567, 2);
 *
 * @example
 * // Returns 120
 * roundToNPlaces(123, -1);
 */
export function roundToNPlaces(value, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(value / multiplier) * multiplier;
}

/**
 * Rounds a number to the nearest two significant figures.
 * @function roundToTwoSignificantFigures
 * @deprecated Use roundToSignificantFigures instead.
 * 
 * @param {number} value - The number to be rounded.
 * @returns {number} The number rounded to the nearest two significant figures.
 *
 * This function works by determining the magnitude (the exponent) of the number
 * when expressed in scientific notation. It then calculates a factor based on
 * this magnitude to round the number to two significant figures.
 *
 * @example
 * // Returns 120
 * roundToTwoSignificantFigures(123);
 *
 * @example
 * // Returns 0.12
 * roundToTwoSignificantFigures(0.1234);
 */
export function roundToTwoSignificantFigures(value) {
  // Handle zero case
  if (value === 0) return 0;

  // Determine the number of digits before the decimal point
  const magnitude = Math.floor(Math.log10(Math.abs(value))) + 1;

  // Calculate the factor to round to two significant figures
  const factor = Math.pow(10, magnitude - 2);

  // Round the value to the nearest two significant figures
  return Math.round(value / factor) * factor;
}


/**
 * Rounds a number to a specified number of significant figures.
 * @function roundToSignificantFigures
 * @param {number} value - The number to be rounded.
 * @param {number} [sigFigs=2] - The number of significant figures to round to (default is 2).
 * @returns {number} The number rounded to the specified number of significant figures.
 *
 * This function works by determining the magnitude (the exponent) of the number
 * when expressed in scientific notation. It then calculates a factor based on
 * this magnitude to round the number to the desired number of significant figures.
 *
 * @example
 * // Returns 120
 * roundToSignificantFigures(123, 2);
 *
 * @example
 * // Returns 0.12
 * roundToSignificantFigures(0.1234, 2);
 */
export function roundToSignificantFigures(value, sigFigs = 2) {
  // Handle zero case
  if (value === 0) return 0;

  // Determine the number of digits before the decimal point
  const magnitude = Math.floor(Math.log10(Math.abs(value))) + 1;

  // Calculate the factor to round to the desired number of significant figures
  const factor = Math.pow(10, magnitude - sigFigs);

  // Round the value to the nearest significant figures
  return Math.round(value / factor) * factor;
}


/**
 * Rounds a value to a specified number of decimal places based on its size.
 * - Values less than 1 are rounded to 2 decimal places.
 * - Values between 1 and 10 are rounded to 1 decimal place.
 * - Values greater than or equal to 10 are rounded to 0 decimal places.
 * @function roundValue
 * @param {number} value - The value to round.
 * @returns {number} - The rounded value.
 */
export const roundValue = (value) => {
  if (value < 1) {
    return parseFloat(value.toFixed(2));
  } else if (value < 10) {
    return parseFloat(value.toFixed(1));
  } else {
    return Math.round(value);
  }
};

/**
 * Helper function to sort values based on the specified order.
 * @function sortValues
 * @param {Array} values - The array of values to sort.
 * @param {string} order - The order to sort by ('ascending' or 'descending').
 * @returns {Array} Sorted array of values.
 */
export const sortValues = (values, order) => {
  return values.sort((a, b) => {
    if (order === 'ascending') {
      return a.displayValue > b.displayValue ? 1 : -1;
    } else if (order === 'descending') {
      return a.displayValue < b.displayValue ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Converts a string representation of a number with commas into a Number.
 * If the input is not a string, it returns the input as is.
 *
 * @param {string|number} value - The value to be converted. If it's a string,
 * it should represent a number and may contain commas as thousand separators.
 * If it's a number, it will be returned unchanged.
 * 
 * @returns {number} - The numeric value if the input was a string with commas,
 * or the original value if it was not a string.
 *
 * @example
 * // returns 12345
 * convertStringToNumber("12,345");
 *
 * @example
 * // returns 67890
 * convertStringToNumber(67890);
 *
 * @example
 * // returns "not a number"
 * convertStringToNumber("not a number");
 */
export function convertStringToNumber(value) {
  return typeof value === 'string' ? Number(value.replace(/,/g, "")) : value;
}