/**
 * Rounds a number to a specified number of decimal places.
 *
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