/**
 * Jenks Natural Breaks classification (Fisher-Jenks algorithm)
 * Groups data to minimize variance within classes and maximize between classes
 * 
 * @param {number[]} data - Array of numerical values
 * @param {number} numClasses - Number of classes to create
 * @returns {number[]} Array of break points
 */
export function jenksBreaks(data, numClasses) {
  // Sort data in ascending order
  const sortedData = [...data].sort((a, b) => a - b);
  const n = sortedData.length;

  if (n <= numClasses) {
    return [...new Set(sortedData)];
  }

  // Initialize matrices
  const mat1 = Array(n + 1).fill(null).map(() => Array(numClasses + 1).fill(0));
  const mat2 = Array(n + 1).fill(null).map(() => Array(numClasses + 1).fill(0));

  // Initialize matrices with large values
  for (let i = 1; i <= numClasses; i++) {
    mat1[1][i] = 1;
    mat2[1][i] = 0;
    for (let j = 2; j <= n; j++) {
      mat2[j][i] = Infinity;
    }
  }

  // Calculate variance
  let variance;
  for (let l = 2; l <= n; l++) {
    let s1 = 0;
    let s2 = 0;
    let w = 0;

    for (let m = 1; m <= l; m++) {
      const lowerClassLimit = l - m + 1;
      const val = sortedData[lowerClassLimit - 1];

      w++;
      s2 += val * val;
      s1 += val;

      const variance = s2 - (s1 * s1) / w;
      const i4 = lowerClassLimit - 1;

      if (i4 !== 0) {
        for (let j = 2; j <= numClasses; j++) {
          if (mat2[l][j] >= variance + mat2[i4][j - 1]) {
            mat1[l][j] = lowerClassLimit;
            mat2[l][j] = variance + mat2[i4][j - 1];
          }
        }
      }
    }

    mat1[l][1] = 1;
    mat2[l][1] = variance;
  }

  // Extract break points
  const breaks = [];
  let k = n;

  for (let j = numClasses; j >= 2; j--) {
    const id = mat1[k][j] - 1;
    breaks.push(sortedData[id]);
    k = mat1[k][j] - 1;
  }

  breaks.push(sortedData[0]); // Add minimum value
  return breaks.reverse();
}

/**
 * Standard Deviation classification
 * Creates breaks based on standard deviations from the mean
 * 
 * @param {number[]} data - Array of numerical values
 * @param {number} numClasses - Number of classes (typically 5-7 for ±1, ±2, ±3 std devs)
 * @returns {number[]} Array of break points
 */
export function standardDeviationBreaks(data, numClasses = 7) {
  const n = data.length;
  
  // Calculate mean
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate standard deviation
  const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  // Generate breaks based on standard deviations
  const breaks = [];
  const numStdDevs = Math.floor(numClasses / 2); // e.g., for 7 classes: -3, -2, -1, 0, 1, 2, 3

  for (let i = -numStdDevs; i <= numStdDevs; i++) {
    breaks.push(mean + (i * stdDev));
  }

  // Ensure breaks are within data range
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  return breaks
    .filter(b => b >= min && b <= max)
    .sort((a, b) => a - b);
}

/**
 * Head/Tail Breaks classification
 * Recursively divides data at the mean for heavy-tailed distributions
 * 
 * @param {number[]} data - Array of numerical values
 * @param {number} [maxIterations=10] - Maximum recursion depth
 * @returns {number[]} Array of break points
 */
export function headTailBreaks(data, maxIterations = 10) {
  const breaks = [];
  
  function recursiveBreak(values, iteration = 0) {
    if (values.length <= 1 || iteration >= maxIterations) {
      return;
    }

    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    breaks.push(mean);

    // Split into head (values above mean) and continue recursion
    const head = values.filter(v => v > mean);
    
    // Only continue if head has significant values (more than 40% above mean indicates heavy tail)
    if (head.length > 0 && head.length < values.length * 0.6) {
      recursiveBreak(head, iteration + 1);
    }
  }

  // Start with minimum value
  const sortedData = [...data].sort((a, b) => a - b);
  breaks.push(sortedData[0]);
  
  recursiveBreak(sortedData);
  
  return [...new Set(breaks)].sort((a, b) => a - b);
}
