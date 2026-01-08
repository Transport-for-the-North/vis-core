/**
 * Utility functions for dynamic styling based on data analysis
 */

/**
 * Analyzes a data sample to determine the appropriate styling suffix
 * @param {Array} dataSample - Sample of data to analyze
 * @param {string} baseStyle - Base style (e.g., 'line', 'point', 'polygon', 'circle')
 * @returns {string} Complete style string (e.g., 'line-categorical', 'point-continuous')
 */
export const determineDynamicStyle = (dataSample, baseStyle) => {
  if (!dataSample || dataSample.length === 0) {
    return `${baseStyle}-continuous`; // Default fallback
  }

  const values = dataSample.map(item => item.value).filter(val => val !== null && val !== undefined);
  
  if (values.length === 0) {
    return `${baseStyle}-continuous`; // Default fallback
  }

  const stylingType = analyzeDataType(values);
  return `${baseStyle}-${stylingType}`;
};

/**
 * Analyzes data values to determine if they should be categorical, continuous, or diverging
 * @param {Array} values - Array of data values
 * @returns {string} 'categorical', 'continuous', or 'diverging'
 */
export const analyzeDataType = (values) => {
  // Check if all values are strings
  const uniqueValues = [...new Set(values)];
  const isAllStrings = values.every(val => typeof val === 'string');
  const hasNegativeAndPositive = values.some(val => val < 0) && values.some(val => val > 0);

  // If all values are strings, it's categorical
  if (isAllStrings) {
    return 'categorical';
  }

  // Only treat boolean-like integer sets as categorical: [0], [1], [0,1], [1,0]
  if (
    values.every(val => Number.isInteger(val)) &&
    (
      (uniqueValues.length === 1 && (uniqueValues[0] === 0 || uniqueValues[0] === 1)) ||
      (uniqueValues.length === 2 && uniqueValues.includes(0) && uniqueValues.includes(1))
    )
  ) {
    return 'categorical';
  }

  // If we have both negative and positive values, it's diverging
  if (hasNegativeAndPositive) {
    return 'diverging';
  }

  // Default to continuous for numeric data
  return 'continuous';
};