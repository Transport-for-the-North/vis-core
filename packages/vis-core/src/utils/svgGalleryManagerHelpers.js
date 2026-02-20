/**
 * Helper functions for SVG gallery rendering (network schematics).
 * These functions handle dynamic legend/caveat configuration, SVG detection, and data normalisation.
 */

/**
 * Sort an array of option objects by their `displayValue`.
 * @param {Array<Object>} options - Array of option objects with displayValue property.
 * @param {string|Object} sortConfig - Sort direction: 'ascending', 'descending', or config object with 'order' property.
 * @returns {Array<Object>} - Sorted array of options.
 */
export const sortOptions = (options, sortConfig) => {
  if (!sortConfig) return options;
  const sorted = [...options];
  const direction =
    typeof sortConfig === 'string'
      ? sortConfig.toLowerCase()
      : (sortConfig.order || 'ascending').toLowerCase();

  sorted.sort((a, b) => {
    const left = `${a.displayValue ?? ''}`.toLowerCase();
    const right = `${b.displayValue ?? ''}`.toLowerCase();
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
  });

  return direction === 'descending' || direction === 'desc' ? sorted.reverse() : sorted;
};

/**
 * Normalise text for case-insensitive comparison.
 * @param {*} value - The value to normalise.
 * @returns {string} - Lowercase trimmed string.
 */
export const normaliseText = (value) => `${value ?? ''}`.trim().toLowerCase();

/**
 * Normalise an asset path (e.g., converts "public/..." to "/...").
 * @param {string} assetPath - The asset path to normalise.
 * @returns {string|null} - The normalised path or null if invalid.
 */
export const normaliseAssetPath = (assetPath) => {
  if (typeof assetPath !== 'string' || assetPath.trim() === '') return null;
  const trimmed = assetPath.trim();
  if (trimmed.startsWith('public/')) {
    return `/${trimmed.substring(7)}`;
  }
  return trimmed;
};

/**
 * Normalise API response rows based on detected response shape.
 * Handles various response formats: direct array, .data, .rows, .result.
 * @param {*} response - The API response.
 * @returns {Array} - Array of row objects.
 */
export const normaliseRows = (response) => {
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
  if (response?.data?.rows && Array.isArray(response.data.rows)) return response.data.rows;
  if (response?.data?.result && Array.isArray(response.data.result)) return response.data.result;
  if (response?.data?.results && Array.isArray(response.data.results)) return response.data.results;
  if (response?.rows && Array.isArray(response.rows)) return response.rows;
  if (response?.result && Array.isArray(response.result)) return response.result;
  if (response?.results && Array.isArray(response.results)) return response.results;
  return [];
};

/**
 * Check if a rule (from legend/caveat config) matches a selected value.
 * Supports operators: ===, !=, and plain value matching.
 * @param {Object} rule - Rule object with 'match' and optional 'name' properties.
 * @param {*} selectedValue - The value to match against.
 * @returns {boolean} - True if the rule matches.
 */
export const ruleMatchesSelectedValue = (rule, selectedValue) => {
  const selected = normaliseText(selectedValue);
  const rawMatch = rule.match.trim();

  // Check for operator syntax: === or !=
  const operatorMatch = rawMatch.match(/^(===|!=)\s*(.*)$/);
  if (operatorMatch) {
    const [_, operator, expressionValue] = operatorMatch;
    if (operator === '===') return selected === normaliseText(expressionValue);
    if (operator === '!=') return selected !== normaliseText(expressionValue);
  }

  // Backward compatibility: plain value matching (fallback to rule.name if match is empty)
  if (selected === normaliseText(rawMatch)) return true;
  if (!rawMatch && rule.name) {
    return selected === normaliseText(rule.name);
  }

  return false;
};

/**
 * Resolve SVG URL from a data row.
 * Scans multiple column names for raw SVG markup or URLs.
 * @param {Object} row - The data row containing SVG information.
 * @param {Object} [options] - Options controlling resolution.
 * @param {string} [options.valueField] - Preferred field name containing SVG markup/URL.
 * @returns {string|null} - Data URI or URL pointing to the SVG, or null if not found.
 */
export const resolveSvgUrl = (row, options = {}) => {
  if (!row || typeof row !== 'object') return null;

  const valueField = typeof options?.valueField === 'string' && options.valueField.trim() !== ''
    ? options.valueField.trim()
    : null;

  // Candidate column names for SVG content (in order of preference)
  const candidateKeys = [
    ...(valueField ? [valueField] : []),
    'svg',
    'SVG',
    'svg_text',
    'svgText',
    'svg_markup',
    'svgMarkup',
    'svg_content',
    'svgContent',
  ];

  // Try explicit candidate keys first
  const explicitCandidate = candidateKeys
    .map((key) => row?.[key])
    .find((value) => typeof value === 'string' && value.trim() !== '');

  // Fallback: scan all row values for any string containing '<svg'
  const anySvgLikeString =
    explicitCandidate ||
    Object.values(row || {}).find(
      (v) => typeof v === 'string' && v.toLowerCase().includes('<svg')
    );

  // If we found SVG markup, check for data URI or encode it
  if (typeof anySvgLikeString === 'string') {
    const trimmed = anySvgLikeString.trim();
    if (trimmed.startsWith('data:image/svg+xml')) return trimmed;
    if (trimmed.toLowerCase().includes('<svg')) {
      return `data:image/svg+xml;utf8,${encodeURIComponent(trimmed)}`;
    }
  }

  // Fallback to URL fields
  return (
    row?.svg_url ||
    row?.svgUrl ||
    row?.SVG_URL ||
    row?.url ||
    row?.image_url ||
    row?.imageUrl ||
    null
  );
};
