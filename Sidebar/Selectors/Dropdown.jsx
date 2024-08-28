import React, { useMemo, useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';

// Custom style for the react-select options
const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    display: 'flex',
    fontSize: '0.9rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: isFocused ? 'lightgray' : 'white',
    color: 'black',
    cursor: 'pointer',
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
    ':hover': {
      backgroundColor: 'lightgray',
    },
  }),
};

const StyledDropdown = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

/**
 * Dropdown component for selecting options.
 * @property {Object} filter - The filter object containing values.
 * @property {Array} filter.values - An array of values for the dropdown.
 * @property {string} filter.values[].displayValue - The display value of the option.
 * @property {string} filter.values[].paramValue - The parameter value of the option.
 * @property {boolean} filter.values[].isValid - Indicates if the option is valid.
 * @property {boolean} filter.shouldBeBlankOnInit - Indicates if the filter should be blank on initialization.
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const Dropdown = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();
  const animatedComponents = makeAnimated();
  const [loading, setLoading] = useState(false);

  const options = useMemo(() => {
    const filteredOptions = filter.values.values
      .filter(option => !option.isHidden)
      .map((option) => ({
        value: option.paramValue,
        label: option.displayValue,
        isValid: option?.isValid,
      }));
    if (filter.multiSelect) {
      const allOption = {
        value: 'all',
        label: 'All',
      };
      return [allOption, ...filteredOptions];
    }
    return filteredOptions;
  }, [filter.values.values, filter.multiSelect]);

  const selectedOptions = useMemo(() => {
    if (Array.isArray(filterState[filter.id])) {
      if (filterState[filter.id].length === options.length - 1) {
        return options.slice(1).filter(option => filterState[filter.id]?.includes(option.value));
      }
      return options.slice(1).filter(option => filterState[filter.id]?.includes(option.value));
    }
    return options.find(option => option.value === filterState[filter.id]);
  }, [filterState, filter.id, options]);

  useEffect(() => {
    if (!filter.shouldBeBlankOnInit && selectedOptions === undefined && filterState[filter.id] !== null) {
      onChange(filter, null);
    }
  }, [selectedOptions, filterState, filter, onChange]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filterState]);

  const handleDropdownChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
      if (selectedOptions.some(option => option.value === 'all')) {
        onChange(filter, options.slice(1).map(option => option.value));
      } else {
        const values = selectedOptions.map(option => option.value);
        onChange(filter, values);
      }
    } else if (selectedOptions) {
      onChange(filter, selectedOptions.value);
    } else {
      onChange(filter, null);
    }
  };

  const formatOptionLabel = ({ label, isValid }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isValid !== undefined && (
        <span style={{ marginRight: '10px' }}>{isValid ? '✅' : '⚠️'}</span>
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <StyledDropdown>
      <Select
        components={animatedComponents}
        options={options}
        value={selectedOptions}
        onChange={handleDropdownChange}
        formatOptionLabel={filter.shouldBeValidated ?? formatOptionLabel}
        styles={customStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        isClearable={filter.isClearable}
        isMulti={filter.multiSelect}
        isLoading={filter.shouldFilterOthers === false && loading}
      />
    </StyledDropdown>
  );
};
