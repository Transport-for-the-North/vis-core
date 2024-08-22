/**
 * Updates the validity of filter values based on the metadata table.
 * If `shouldFilterOnValidate` is true, filters out invalid options; otherwise, only updates the `isValid` property.
 * @function updateFilterValidity
 * @param {Object} state - The current state.
 * @param {Object} filterState - The current filter state.
 * @returns {Array} - The modified filters with updated values or filtered out invalid options.
 */
export function updateFilterValidity(state, filterState) {
    const activeFilters = state.filters.filter(filter => filter.values && filter.values.metadataTableName);

    // Create a map to store valid values for each filter
    const validValuesMap = {};

    // Initialize validValuesMap with all possible values for each filter
    activeFilters.forEach(filter => {
        const sourceName = filter.values.metadataTableName;
        const metadataTable = state.metadataTables[sourceName];
        if (metadataTable) {
            validValuesMap[filter.id] = new Set(metadataTable.map(row => row[filter.values.paramColumn]));
        }
    });

    // Update validValuesMap based on selected values of other filters
    activeFilters.forEach(filter => {
        const selectedValues = filterState[filter.id];
        if (selectedValues && selectedValues.length > 0) {
            const sourceName = filter.values.metadataTableName;
            const metadataTable = state.metadataTables[sourceName];
            const validRows = metadataTable.filter(row => selectedValues.includes(row[filter.values.paramColumn]));

            activeFilters.forEach(otherFilter => {
                if (otherFilter.id !== filter.id && otherFilter.values.metadataTableName === sourceName) {
                    const validParamValues = new Set();
                    validRows.forEach(row => {
                        validParamValues.add(row[otherFilter.values.paramColumn]);
                    });
                    validValuesMap[otherFilter.id] = new Set([...validValuesMap[otherFilter.id]].filter(value => validParamValues.has(value)));
                }
            });
        }
    });

    // Create a new filters array with updated isValid values
    const updatedFilters = state.filters.map(filter => {
        if (filter.values && filter.values.metadataTableName) {
            const updatedValues = filter.values.values.map(value => ({
                ...value,
                isValid: validValuesMap[filter.id].has(value.paramValue),
                isHidden: !validValuesMap[filter.id].has(value.paramValue)
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