import React, { useMemo } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';

// Custom style for the react-select options
const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Adjust zIndex to be higher than everything else
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
    cursor: 'pointer', // Change cursor to pointer
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
    ':hover': {
      backgroundColor: 'lightgray', // Highlight on hover
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
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const Dropdown = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();
  const animatedComponents = makeAnimated();

  const options = useMemo(
    () =>
      filter.values.values.map((option) => ({
        value: option.paramValue,
        label: option.displayValue,
        isValid: option?.isValid,
      })),
    [filter.values.values]
  );

  const handleDropdownChange = (selectedOption) => {
    if (selectedOption) {
      onChange(filter, selectedOption.value);
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
        value={options.find(option => option.value === filterState[filter.id])}
        onChange={handleDropdownChange}
        formatOptionLabel={formatOptionLabel}
        styles={customStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body} // Use a portal to render the menu
      />
    </StyledDropdown>
  );
};
