import { type } from "@testing-library/user-event/dist/type";

/**
 * Updates the validity of filter values based on the metadata table.
 * If `shouldFilterOnValidate` is true, filters out invalid options; otherwise, only updates the `isValid` property.
 * The validation is done within groups identified by the filter name (e.g., DM, DS).
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

    // List of possible identifiers
    const identifiers = ['DM', 'DS', 'Scen. 1', 'Scen. 2', 'Left', 'Right'];

    // Group filters by their identifier
    const filterGroups = activeFilters.reduce((groups, filter) => {
        const groupName = identifiers.find(id => filter.filterName.includes(id));
        if (groupName) {
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(filter);
        } else {
            // If no identifier is found, group under a default key
            if (!groups['default']) {
                groups['default'] = [];
            }
            groups['default'].push(filter);
        }
        return groups;
    }, {});

    // Update validValuesMap based on selected values within each group
    Object.values(filterGroups).forEach(groupFilters => {
        groupFilters.forEach(filter => {
            const selectedValues = filterState[filter.id];
            if (selectedValues && (!Array.isArray(selectedValues) || (Array.isArray(selectedValues) && selectedValues.length > 0))) {
                const sourceName = filter.values.metadataTableName;
                const metadataTable = state.metadataTables[sourceName];
    
                // Ensure selectedValues is an array before using .includes
                const validRows = Array.isArray(selectedValues) 
                    ? metadataTable.filter(row => selectedValues.includes(row[filter.values.paramColumn]))
                    : metadataTable.filter(row => row[filter.values.paramColumn] === selectedValues);
    
                groupFilters.forEach(otherFilter => {
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
    });
    // console.log(validValuesMap);
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