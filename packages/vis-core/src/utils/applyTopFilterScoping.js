/**
 * Applies client-side scoping based on top filter state:
 * - Multi-select values are treated as an "IN" constraint.
 * - Single values are treated as strict equality.
 *
 * Expects filter metadata that provides a `paramName` mapping to a row key.
 *
 * @param {any[]} records
 * @param {Array<{id: string, paramName?: string}>} filters
 * @param {Record<string, any>} filterState
 * @param {boolean} isReady
 * @returns {any[]}
 */
export function applyTopFilterScoping(records, filters, filterState, isReady) {
  if (!isReady) return records;

  let rows = records.slice();

  filters.forEach((f) => {
    const val = filterState[f.id];
    if (val == null) return;

    const column = f.paramName;
    if (!column) return;

    if (Array.isArray(val)) {
      if (val.length > 0) rows = rows.filter((r) => val.includes(r[column]));
      return;
    }

    if (val !== "") rows = rows.filter((r) => r[column] === val);
  });

  return rows;
}