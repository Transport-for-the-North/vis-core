import React from "react";
import Select from "react-select";
import styled from "styled-components";

const DropdownWrapper = styled.div`
  min-width: 200px;
  width: 100%;
  
  .react-select__control {
    min-height: 32px;
    border-color: #d1d5db;
    font-size: 0.875rem;
    background-color: #fff;
  }
  
  .react-select__single-value {
    color: #1f2937;
  }
  
  .react-select__menu {
    font-size: 0.875rem;
    background-color: #fff;
    max-height: 300px;
    min-width: 200px;
    width: max-content;
  }
  
  .react-select__menu-list {
    max-height: 300px;
    overflow-y: auto;
  }
  
  .react-select__option {
    color: #1f2937;
    background-color: #fff;
    white-space: nowrap;
    padding: 8px 12px;
  }
  
  .react-select__option:hover {
    background-color: #f3f4f6;
  }
  
  .react-select__option--is-selected {
    background-color: #6b46c1;
    color: #fff;
  }
  
  .react-select__placeholder {
    color: #9ca3af;
  }
`;

/**
 * SimpleDropdown component provides a searchable dropdown with clear functionality.
 * Built on top of react-select with custom styling.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string[]} props.options - Array of option values to display in the dropdown.
 * @param {string} props.value - Currently selected value.
 * @param {Function} props.onChange - Callback function invoked when selection changes. Receives the selected value or empty string.
 * @param {string} [props.placeholder="Filter..."] - Placeholder text displayed when no value is selected.
 * @returns {JSX.Element} The rendered SimpleDropdown component.
 */
export const SimpleDropdown = ({ options, value, onChange, placeholder = "Filter..." }) => {
  const formattedOptions = options.map(opt => ({
    value: opt,
    label: opt
  }));

  const selectedValue = value ? { value, label: value } : null;

  return (
    <DropdownWrapper>
      <Select
        classNamePrefix="react-select"
        options={formattedOptions}
        value={selectedValue}
        onChange={(selected) => onChange(selected?.value || "")}
        isClearable
        placeholder={placeholder}
      />
    </DropdownWrapper>
  );
};
