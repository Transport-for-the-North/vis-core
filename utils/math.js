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