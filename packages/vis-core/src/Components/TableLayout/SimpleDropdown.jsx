import React, { useMemo } from "react";
import Select from "react-select";
import styled, { useTheme } from "styled-components";
import { makeSelectStyles } from "utils/selectStyles";

const DropdownWrapper = styled.div`
  min-width: 200px;
  width: 100%;
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
  const theme = useTheme();
  const selectStyles = useMemo(() => {
    const base = makeSelectStyles(theme, { minHeight: 32, fontSize: '0.875rem', borderColor: '#d1d5db' });
    return {
      ...base,
      menu: (provided) => ({
        ...provided,
        minWidth: 200,
        width: 'max-content',
        maxHeight: 300,
      }),
      menuList: (provided) => ({
        ...provided,
        maxHeight: 300,
        overflowY: 'auto',
      }),
      option: (provided, state) => ({
        ...base.option(provided, state),
        whiteSpace: 'nowrap',
        padding: '8px 12px',
      }),
    };
  }, [theme]);

  const formattedOptions = options.map(opt => ({
    value: opt,
    label: opt
  }));

  const selectedValue = value ? { value, label: value } : null;

  return (
    <DropdownWrapper>
      <Select
        styles={selectStyles}
        options={formattedOptions}
        value={selectedValue}
        onChange={(selected) => onChange(selected?.value || "")}
        isClearable
        placeholder={placeholder}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
      />
    </DropdownWrapper>
  );
};
