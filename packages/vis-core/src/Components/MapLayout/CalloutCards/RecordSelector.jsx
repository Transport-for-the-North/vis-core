import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const SelectorContainer = styled.div`
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
`;

const SelectorLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  margin-bottom: 6px;
  text-transform: uppercase;
`;

// Custom styles matching the existing dropdown styling
const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  control: (base, state) => ({
    ...base,
    fontFamily: 'var(--font-family-base)',
    borderColor: state.isFocused ? 'var(--palette-navy, #0d0f3d)' : 'var(--palette-grey, #d1d5db)',
    borderRadius: 6,
    minHeight: '32px',
    fontSize: '0.85rem',
    boxShadow: state.isFocused ? '0 0 0 1px var(--palette-navy, #0d0f3d)' : 'none',
    '&:hover': {
      borderColor: 'var(--palette-navy, #0d0f3d)',
    },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    fontFamily: 'var(--font-family-base)',
    fontSize: '0.85rem',
    padding: '8px 12px',
    backgroundColor: isSelected
      ? 'var(--palette-navy, #0d0f3d)'
      : isFocused
      ? 'var(--palette-mid-grey, #f0f0f7)'
      : 'var(--palette-white, #ffffff)',
    color: isSelected ? 'var(--palette-white, #ffffff)' : 'var(--text-icon)',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    fontFamily: 'var(--font-family-base)',
    fontSize: '0.85rem',
    color: 'var(--text-icon)',
  }),
  placeholder: (base) => ({
    ...base,
    fontFamily: 'var(--font-family-base)',
    fontSize: '0.85rem',
  }),
  input: (base) => ({
    ...base,
    fontFamily: 'var(--font-family-base)',
    fontSize: '0.85rem',
  }),
};

/**
 * RecordSelector component for selecting from multiple records in callout cards
 * Uses react-select to match existing dropdown styling throughout the app
 * 
 * @param {Object} props - Component props
 * @param {Array} props.records - Array of record objects
 * @param {number} props.selectedIndex - Index of currently selected record
 * @param {Function} props.onSelect - Callback when a record is selected
 * @param {Function} props.getRecordLabel - Function to get display label for a record
 * @returns {JSX.Element} The record selector dropdown
 */
export const RecordSelector = ({ 
  records, 
  selectedIndex, 
  onSelect, 
  getRecordLabel 
}) => {
  // Convert records to react-select options format, reversing the order so last record is first
  // Keep the original indices as values since selectedIndex refers to original array positions
  const options = records.map((record, index) => ({
    value: index, // Keep original index as value
    label: getRecordLabel(record),
  })).reverse();

  // Find the option that corresponds to the selectedIndex (which is from the original array)
  const selectedOption = options.find(option => option.value === selectedIndex) || options[0] || null;

  const handleChange = (option) => {
    if (option && option.value !== selectedIndex) {
      onSelect(option.value);
    }
  };

  return (
    <SelectorContainer>
      <SelectorLabel>Select Record ({records.length} available)</SelectorLabel>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        styles={customStyles}
        menuPortalTarget={document.body}
        isSearchable={records.length > 5} // Only searchable if many options
        placeholder="Select a record..."
      />
    </SelectorContainer>
  );
};