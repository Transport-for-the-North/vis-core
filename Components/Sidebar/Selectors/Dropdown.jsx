import React from 'react';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

/**
 * Dropdown component for selecting options.
 * @property {Object} filter - The filter object containing values.
 * @property {Array} filter.values - An array of values for the dropdown.
 * @property {string} filter.values[].displayValue - The display value of the option.
 * @property {string} filter.values[].paramValue - The parameter value of the option.
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const Dropdown = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(
      (option) => option.paramValue === selectedValue
    );

    if (selectedOption) {
      onChange(filter, selectedOption.paramValue);
    }
  };

  return (
    <StyledDropdown
      value={filterState[filter.id]}
      onChange={handleDropdownChange}
    >
      {filter.values.values.map((option) => (
        <option key={option.paramValue} value={option.paramValue}>
          {option.displayValue}
        </option>
      ))}
    </StyledDropdown>
  );
};