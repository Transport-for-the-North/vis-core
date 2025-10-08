import React, { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import styled from 'styled-components';
import { useLayerFeatureMetadata } from 'hooks/useLayerFeatureMetadata';

// Styled components
const Container = styled.div`
  margin-bottom: 10px;
`;

// Custom ValueContainer to display count of selected features
const CustomValueContainer = ({ children, ...props }) => {
  const MAX_DISPLAY_COUNT = 100;
  const { getValue } = props;
  const selectedValues = getValue();

  let displayValue = children;

  if (selectedValues.length > MAX_DISPLAY_COUNT) {
    displayValue = `${selectedValues.length} features selected`;
  }

  return (
    <components.ValueContainer {...props}>
      {displayValue}
    </components.ValueContainer>
  );
};

/**
 * FeatureSelect component provides a dropdown to select features from a map layer.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.layerPath - The path to fetch feature metadata.
 * @param {Array} props.value - The selected feature values.
 * @param {Function} props.onChange - Function to call when the selected features change.
 * @param {boolean} props.isMulti - Whether multiple selections are allowed.
 * @param {string} props.placeholder - Placeholder text for the select input.
 * @param {boolean} props.isClearable - Whether the select input can be cleared.
 * @returns {JSX.Element} The rendered FeatureSelect component.
 */
export const FeatureSelect = ({ layerPath, value, onChange, isMulti = false, placeholder, isClearable = false }) => {
  const { options, isLoading, handleInputChange } = useLayerFeatureMetadata(layerPath);
  const [noOptionsMessage, setNoOptionsMessage] = useState('Start typing to search features');

  useEffect(() => {
    let timer;
    if (isLoading) {
      setNoOptionsMessage('Searching...');
    } else {
      timer = setTimeout(() => {
        setNoOptionsMessage('No features found');
      }, 300);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleMenuOpen = () => {
    setNoOptionsMessage('Start typing to search features');
  };

  return (
    <Container>
      <Select
        isMulti={isMulti}
        isClearable={isClearable}
        options={options}
        value={value}
        onChange={onChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isLoading={isLoading}
        noOptionsMessage={() => noOptionsMessage}
        onMenuOpen={handleMenuOpen}
        components={{ ValueContainer: CustomValueContainer }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '1rem',
            maxHeight: '10rem',
            overflowY: 'auto', // Ensure control itself can scroll if needed
          }),
          menu: (base) => ({
            ...base,
            maxHeight: '10rem',
            overflowY: 'auto', // Enable scrolling for dropdown menu
          }),
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          menuList: (base) => ({
            ...base,
            maxHeight: '10rem',
            overflowY: 'auto', // Ensure menu list is scrollable
          }),
          clearIndicator: (base) => ({
            ...base,
            alignSelf: 'flex-start', // Position clear control at top
          }),
        }}
        menuPortalTarget={document.body}
        menuPosition="fixed"
      />
    </Container>
  );
};