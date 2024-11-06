import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { useLayerFeatureMetadata } from 'hooks/useLayerFeatureMetadata';

// Styled components
const Container = styled.div`
  margin-bottom: 10px;
`;

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
 * @returns {JSX.Element} The rendered FeatureSelect component.
 */
export const FeatureSelect = ({ layerPath, value, onChange, isMulti = false, placeholder }) => {
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
        options={options}
        value={value}
        onChange={onChange}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        isLoading={isLoading}
        noOptionsMessage={() => noOptionsMessage}
        onMenuOpen={handleMenuOpen}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({ ...base, minHeight: '35px' }),
        }}
        menuPortalTarget={document.body}
      />
    </Container>
  );
};
