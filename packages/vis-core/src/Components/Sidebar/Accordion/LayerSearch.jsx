import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { api } from 'services';
import { SelectorLabel } from 'Components/Sidebar/Selectors/SelectorLabel';
import { FeatureSelect } from 'Components/Sidebar/Selectors/FeatureSelect';


import { useMapContext } from "hooks/useMapContext";
import { actionTypes } from 'reducers/mapReducer';

// Styled components
const SearchContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

/**
 * LayerSearch component allows users to search for features within a specified layer
 * and zoom to the selected feature on the map.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.layer - The layer object containing metadata for fetching features.
 * @returns {JSX.Element} The rendered LayerSearch component.
 */
export const LayerSearch = ({ layer }) => {
  const mapContext = useMapContext();
  const mapDispatch = mapContext?.dispatch;
  const [selectedOption, setSelectedOption] = useState(null);
  const zoomToFeaturePlaceholderText = 
    layer.metadata?.zoomToFeaturePlaceholderText || 'Search features in this layer...';
  
  // Reset selected option when layer path changes
  useEffect(() => {
    setSelectedOption(null);
  }, [layer.metadata?.path]);
  
  /**
   * Handles the change event when a feature is selected.
   * Zooms to the selected feature on the map and adds a temporary label.
   * @param {Object} selectedOption - The selected option.
   */
  const handleChange = useCallback(
    async (selectedOption) => {
      setSelectedOption(selectedOption);
      if (selectedOption) {
        try {
          // Get the bounds and centroid of the selected feature
          const { bounds, centroid } = await api.geodataService.getFeatureGeometry(
            layer.metadata.path,
            selectedOption.value
          );

          if (mapDispatch) {
            mapDispatch({
              type: actionTypes.SET_BOUNDS_AND_CENTROID,
              payload: { 
                bounds, 
                centroid, 
                featureName: selectedOption.label, 
                layerMetadata: layer.metadata 
              },
            });
          }

        } catch (error) {
          console.error('Failed to fetch bounds:', error);
        }
      }
    },
    [layer.metadata, mapDispatch]
  );

  return (
    <SearchContainer>
      <SelectorLabel text="Zoom to map feature" info="Search for a feature to zoom to" />
      <FeatureSelect
        layerPath={layer.metadata.path}
        value={selectedOption}
        onChange={handleChange}
        placeholder={zoomToFeaturePlaceholderText}
      />
    </SearchContainer>
  );
};
