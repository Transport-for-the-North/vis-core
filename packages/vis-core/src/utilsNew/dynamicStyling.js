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
  // Check if all values are strings or if there are very few unique numeric values
  const uniqueValues = [...new Set(values)];
  const isAllStrings = values.every(val => typeof val === 'string');
  const hasNegativeAndPositive = values.some(val => val < 0) && values.some(val => val > 0);
  
  // If all values are strings, it's categorical
  if (isAllStrings) {
    return 'categorical';
  }
  
  // Prioritize categorical for small datasets with few unique values (including boolean-like data)
  // This handles cases like [0,1], [-1,1], [1,2,3], etc.
  if (uniqueValues.length <= 10 && values.every(val => Number.isInteger(val))) {
    return 'categorical';
  }
  
  // If we have both negative and positive values, it's diverging
  // Diverging color schemes are designed to show data that diverges from a central value
  if (hasNegativeAndPositive) {
    return 'diverging';
  }
  
  // Default to continuous for numeric data
  return 'continuous';
};