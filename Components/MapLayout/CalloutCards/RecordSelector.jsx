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
    borderColor: 'rgb(220, 220, 220)',
    borderRadius: 6,
    minHeight: '32px',
    fontSize: '0.9rem',
    boxShadow: state.isFocused ? '0 0 0 1px rgba(0, 0, 0, 0.06)' : 'none',
    '&:hover': {
      borderColor: 'rgb(220, 220, 220)',
    },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    fontSize: '0.9rem',
    padding: '8px 12px',
    backgroundColor: isSelected ? '#007bff' : isFocused ? '#f5f5f5' : 'white',
    color: isSelected ? 'white' : 'black',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    fontSize: '0.9rem',
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