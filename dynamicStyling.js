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
  
  // If we have both negative and positive values, check for diverging pattern
  // Only consider diverging for larger datasets that weren't caught by categorical
  if (hasNegativeAndPositive) {
    const zeroOrNearZero = values.filter(val => Math.abs(val) < 0.01).length;
    const totalValues = values.length;
    
    // If there's a reasonable center point (zero or near-zero values) or symmetric distribution
    if (zeroOrNearZero > 0 || isSymmetricDistribution(values)) {
      return 'diverging';
    }
  }
  
  // Default to continuous for numeric data
  return 'continuous';
};

/**
 * Checks if the distribution of values is roughly symmetric around zero
 * @param {Array} values - Array of numeric values
 * @returns {boolean} True if distribution appears symmetric
 */
const isSymmetricDistribution = (values) => {
  const positiveValues = values.filter(val => val > 0);
  const negativeValues = values.filter(val => val < 0);
  
  // Check if we have a reasonable balance of positive and negative values
  const ratio = Math.min(positiveValues.length, negativeValues.length) / 
                Math.max(positiveValues.length, negativeValues.length);
  
  return ratio > 0.3; // At least 30% balance between positive and negative
};