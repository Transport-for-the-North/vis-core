/**
 * Updates the validity and visibility (hiding) of filter values based on the metadata table.
 * - Only sets `isValid` when `shouldBeValidated` is true, so the Dropdown won’t show icons otherwise.
 * - Hides invalid options when `shouldFilterOnValidation` OR `shouldBeFiltered` is true.
 * - Groups individual filters by common identifiers (DM/DS/Scen. 1/2/Left/Right/default).
 * @function updateFilterValidity
 * @param {Object} state - The current MapContext state (contains filters and metadata tables).
 * @param {Object} filterState - The current FilterContext state (current selections by filter id).
 * @returns {Array} Updated filters array with `isValid` and/or `isHidden` applied.
 */
export function updateFilterValidity(state, filterState) {
  const activeFilters = state.filters.filter(
    (filter) => filter.values && filter.values.metadataTableName
  );

  // Build full valid set for each filter from its metadata table
  const validValuesMap = {};
  // Initialise validValuesMap with all possible values for each filter
  activeFilters.forEach((filter) => {
    const sourceName = filter.values.metadataTableName;
    const metadataTable = state.metadataTables[sourceName];
    if (metadataTable) {
      validValuesMap[filter.id] = new Set(
        metadataTable.map((row) => row[filter.values.paramColumn])
      );
    }
  });

  // Group by identifiers
  const identifiers = ['DM', 'DS', 'Scen. 1', 'Scen. 2', 'Left', 'Right', 'Scenario 1', 'Scenario 2'];
  const filterGroups = activeFilters.reduce((groups, filter) => {
    const groupNames = identifiers.filter((id) => filter.filterName.includes(id));
    if (groupNames.length > 0) {
      groupNames.forEach((groupName) => {
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(filter);
      });
    } else {
      if (!groups.default) groups.default = [];
      groups.default.push(filter);
    }
    return groups;
  }, {});

  // Narrow valid sets within each group based on selections,
  // but ONLY when the source filter has shouldFilterOthers = true,
  // and only apply narrowing to filters with shouldBeFiltered = true.
  Object.values(filterGroups).forEach((groupFilters) => {
    groupFilters.forEach((filter) => {
      if (!filter.shouldFilterOthers) return;

      const selectedValues = filterState[filter.id];
      if (
        selectedValues &&
        (!Array.isArray(selectedValues) || (Array.isArray(selectedValues) && selectedValues.length > 0))
      ) {
        const sourceName = filter.values.metadataTableName;
        const metadataTable = state.metadataTables[sourceName];

        const validRows = Array.isArray(selectedValues)
          ? metadataTable.filter((row) => selectedValues.includes(row[filter.values.paramColumn]))
          : metadataTable.filter((row) => row[filter.values.paramColumn] === selectedValues);

        groupFilters.forEach((otherFilter) => {
          // Only narrow filters that should be filtered
          if (
            otherFilter.id !== filter.id &&
            otherFilter.values.metadataTableName === sourceName &&
            !!otherFilter.shouldBeFiltered
          ) {
            const validParamValues = new Set();
            validRows.forEach((row) => {
              validParamValues.add(row[otherFilter.values.paramColumn]);
            });
            validValuesMap[otherFilter.id] = new Set(
              [...validValuesMap[otherFilter.id]].filter((value) => validParamValues.has(value))
            );
          }
        });
      }
    });
  });

  // Apply isValid/isHidden per filter according to flags
  const updatedFilters = state.filters.map((filter) => {
    if (!(filter.values && filter.values.metadataTableName)) return filter;

    const validSet = validValuesMap[filter.id];
    if (!validSet) return filter;

    const shouldSetIsValid = !!filter.shouldBeValidated;
    const shouldHideInvalid = !!filter.shouldFilterOnValidation || !!filter.shouldBeFiltered;

    const updatedValues = filter.values.values.map((value) => {
      const isValidNow = validSet.has(value.paramValue);

      return {
        ...value,
        // Only set isValid when shouldBeValidated is true; otherwise explicitly clear so Dropdown shows no icon
        ...(shouldSetIsValid ? { isValid: isValidNow } : { isValid: undefined }),
        // Hide when flags demand it; otherwise preserve current isHidden (default false)
        isHidden: shouldHideInvalid ? !isValidNow : (value.isHidden ?? false),
      };
    });

    return {
      ...filter,
      values: {
        ...filter.values,
        values: updatedValues,
      },
    };
  });

  return updatedFilters;
}

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