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
    const identifiers = ['DM', 'DS', 'Scen. 1', 'Scen. 2', 'Left', 'Right', 'Scenario 1', 'Scenario 2'];

    // Group filters by their identifiers
    const filterGroups = activeFilters.reduce((groups, filter) => {
        const groupNames = identifiers.filter(id => filter.filterName.includes(id));
        if (groupNames.length > 0) {
            groupNames.forEach(groupName => {
                if (!groups[groupName]) {
                    groups[groupName] = [];
                }
                groups[groupName].push(filter);
            });
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

    // Create a new filters array with updated isValid values
    const updatedFilters = state.filters.map(filter => {
        if (filter.values && filter.values.metadataTableName) {
            const updatedValues = filter.values.values.map(value => ({
                ...value,
                isValid: validValuesMap[filter.id].has(value.paramValue),
                isHidden: filter.shouldFilterOnValidation && !validValuesMap[filter.id].has(value.paramValue)
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
};

/**
 * Check if the condition is valid.
 * @function isValidCondition
 * @param {Object} condition - The condition to validate.
 * @returns {boolean} True if the condition is valid, false otherwise.
 */
export const isValidCondition = (condition) => {
  const validOperands = ['=', '!=', '>', '<', '>=', '<=', 'IN', 'NOT IN'];
  return condition &&
    typeof condition.column === 'string' &&
    validOperands.includes(condition.operand) &&
    (typeof condition.value !== 'undefined' || Array.isArray(condition.values));
};

/**
 * Apply a condition to filter the data.
 * @function applyCondition
 * @param {Array} data - The data to filter.
 * @param {Object} condition - The condition to apply.
 * @returns {Array} The filtered data.
 */
export const applyCondition = (data, condition) => {
  const { column, operand, value, values } = condition;

  return data.filter(item => {
    switch (operand) {
      case '=':
        return item[column] === value;
      case '!=':
        return item[column] !== value;
      case '>':
        return item[column] > value;
      case '<':
        return item[column] < value;
      case '>=':
        return item[column] >= value;
      case '<=':
        return item[column] <= value;
      case 'IN':
        return Array.isArray(values) && values.includes(item[column]);
      case 'NOT IN':
        return Array.isArray(values) && !values.includes(item[column]);
      default:
        return true;
    }
  });
};