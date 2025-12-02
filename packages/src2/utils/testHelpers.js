/**
 * Helper: Creates a filter object in the shape expected by processParameters.
 * The filter values structure mirrors your application's expected shape.
 *
 * @param {string} paramName - Name of the parameter this filter applies to.
 * @param {any} firstValue - The first available value to use when resolving.
 * @returns {Object} A filter object with a single value entry.
 */
export function makeFilter(paramName, firstValue, forceRequired = undefined) {
  const base = {
    paramName,
    values: {
      values: firstValue !== undefined ? [{ paramValue: firstValue }] : [],
    },
  };
  if (forceRequired !== undefined) base.forceRequired = forceRequired;
  return base;
}