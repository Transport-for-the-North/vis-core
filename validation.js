/**
 * Updates the validity of filter values based on the metadata table.
 * @function updateFilterValidity
 * @param {Object} state - The current state.
 * @param {Object} individualFilter - The individual filter to update.
 * @param {string} paramValue - The selected parameter value.
 * @returns {Array} - The modified filters with updated isValid values.
 */
export function updateFilterValidity(state, individualFilter, paramValue) {
    const sourceName = individualFilter.values?.metadataTableName;
    const relatedFilters = state.filters.filter(filter => filter.values.metadataTableName === sourceName);
    const metadataTable = state.metadataTables[sourceName];

    if (!metadataTable) {
        console.error(`Metadata table with source name ${sourceName} not found.`);
        return state.filters;
    }

    // Find rows in the metadataTable that contain the selected paramValue
    const validRows = metadataTable.filter(row => row[individualFilter.values.paramColumn] === paramValue);

    // Create a new filters array with updated isValid values
    const updatedFilters = state.filters.map(filter => {
        if (filter.values.metadataTableName === sourceName) {
            // Create a set of valid paramValues from the valid rows for the current filter's column
            const validParamValues = new Set();
            validRows.forEach(row => {
                validParamValues.add(row[filter.values.paramColumn]);
            });

            const updatedValues = filter.values.values.map(value => ({
                ...value,
                isValid: validParamValues.has(value.paramValue)
            }));

            return {
                ...filter,
                values: {
                    ...filter.values,
                    values: updatedValues
                }
            };
        }
        return filter;
    });

    return updatedFilters;
}