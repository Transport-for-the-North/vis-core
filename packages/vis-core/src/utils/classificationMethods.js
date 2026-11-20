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
  
  // Extract unique values to determine if Jenks is mathematically possible
  const uniqueData = [...new Set(sortedData)];

  // If there are fewer unique values than requested classes, just return the unique values
  if (uniqueData.length <= numClasses) {
    return uniqueData;
  }

  const n = sortedData.length;

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
  let variance = 0;
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

      variance = s2 - (s1 * s1) / w;
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
 * Creates class lower bounds at standard-deviation steps from the mean.
 *
 * @param {number[]} data - Array of numerical values
 * @param {number} [numClasses=7] - Number of classes to create
 * @returns {number[]} Ascending class lower bounds; 
 */
export function standardDeviationBreaks(data, numClasses = 7) {
  const n = data.length;
  if (n === 0) return [];

  const sortedData = [...data].sort((a, b) => a - b);
  const uniqueData = [...new Set(sortedData)];
  if (uniqueData.length <= numClasses) {
    return uniqueData;
  }

  const min = sortedData[0];
  const max = sortedData[n - 1];
  const mean = data.reduce((sum, val) => sum + val, 0) / n;
  const stdDev = Math.sqrt(
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n
  );

  /**
   * Bounds mean + i * step strictly inside (min, max), nearest the mean first.
   * @param {number} step
   * @returns {number[]}
   */
  const innerBounds = (step) => {
    const bounds = [];
    for (let i = Math.ceil((min - mean) / step); mean + i * step < max; i++) {
      const bound = mean + i * step;
      if (bound > min) bounds.push(bound);
    }
    return bounds.sort((a, b) => Math.abs(a - mean) - Math.abs(b - mean));
  };

  const needed = numClasses - 1;
  let bounds = [];
  for (const fraction of [1, 1 / 2, 1 / 3, 1 / 4]) {
    bounds = innerBounds(stdDev * fraction);
    if (bounds.length >= needed) break;
  }

  return [min, ...bounds.slice(0, needed).sort((a, b) => a - b)];
}

/**
 * K-means classification (one-dimensional)
 * Groups values into clusters around their means, refined by Lloyd's algorithm.
 *
 * Centres start at evenly spaced quantiles of the distinct values, not evenly across the
 * value range, so a long tail can't leave starting centres with no values near them. A
 * cluster that still empties is restarted on the value furthest from its centre.
 *
 * @param {number[]} data - Array of numerical values
 * @param {number} numClasses - Number of classes to create
 * @param {number} [maxIterations=100] - Maximum refinement passes
 * @returns {number[]} Ascending class lower bounds (the lowest value in each cluster)
 */
export function kMeansBreaks(data, numClasses, maxIterations = 100) {
  const sortedData = [...data].sort((a, b) => a - b);
  const uniqueData = [...new Set(sortedData)];
  if (uniqueData.length <= numClasses) {
    return uniqueData;
  }

  const n = sortedData.length;
  let centres = Array.from(
    { length: numClasses },
    (_, i) => uniqueData[Math.floor(((i + 0.5) * uniqueData.length) / numClasses)]
  );
  let assignment = new Array(n).fill(-1);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign each value to its nearest centre.
    let changed = false;
    for (let i = 0; i < n; i++) {
      let best = 0;
      for (let c = 1; c < numClasses; c++) {
        if (Math.abs(sortedData[i] - centres[c]) < Math.abs(sortedData[i] - centres[best])) {
          best = c;
        }
      }
      if (assignment[i] !== best) {
        assignment[i] = best;
        changed = true;
      }
    }

    // Move each centre to the mean of its values.
    const sums = new Array(numClasses).fill(0);
    const counts = new Array(numClasses).fill(0);
    for (let i = 0; i < n; i++) {
      sums[assignment[i]] += sortedData[i];
      counts[assignment[i]]++;
    }
    let restarted = false;
    centres = centres.map((centre, c) => {
      if (counts[c] > 0) return sums[c] / counts[c];
      // Empty cluster: restart it on the value furthest from its own centre.
      restarted = true;
      let furthest = 0;
      for (let i = 1; i < n; i++) {
        const distance = (i) => Math.abs(sortedData[i] - centres[assignment[i]]);
        if (distance(i) > distance(furthest)) furthest = i;
      }
      return sortedData[furthest];
    });

    if (!changed && !restarted) break;
  }

  // Lower bound of each non-empty cluster.
  const lowest = new Map();
  for (let i = n - 1; i >= 0; i--) lowest.set(assignment[i], sortedData[i]);
  return [...new Set(lowest.values())].sort((a, b) => a - b);
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
