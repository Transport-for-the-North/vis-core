import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaMousePointer, FaDrawPolygon } from 'react-icons/fa';
import { useMapContext, useFeatureSelect } from 'hooks';
import { FeatureSelect } from './FeatureSelect'; 
import { darken } from "polished";
import { isEqual } from 'lodash';

// Styled components
const Container = styled.div`
  margin-bottom: 10px;
`;

const SelectionModeContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const StyledToggle = styled.div`
  display: flex;
  border: 1px solid ${(props) => (props.enabled ? 'black' : '#ccc')};
  border-radius: 5px;
  flex-grow: 1;
`;

const ModeButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.selected ? props.$bgColor : 'white')};
  color: ${(props) => (props.selected ? 'white' : 'black')};
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Hanken Grotesk', sans-serif;
  width: 50%;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover {
    background-color: ${(props) => (props.selected ? darken(0.1, props.$bgColor) : 'white')};
    color: ${(props) => (props.selected ? 'white' : 'black')};
  }

  svg {
    margin-right: 5px;
  }

  &:first-child {
    border-radius: 5px 0 0 5px;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
  }
`;

const EnableSelectButton = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${(props) => (props.enabled ? props.$bgColor : 'white')};
  color: ${(props) => (props.enabled ? 'white' : 'black')};
  border: 1px solid ${(props) => (props.enabled ? 'black' : '#ccc')};
  border-radius: 4px;
  margin-right: 10px;
  font-family: 'Hanken Grotesk', sans-serif;

  &:hover {
    background-color: ${(props) => (props.enabled ? darken(0.1, props.$bgColor) : 'white')};
    color: ${(props) => (props.enabled ? 'white' : 'black')};
  }
`;

/**
 * BaseMapFeatureSelect component provides the core functionality for selecting map features.
 * It can optionally render controls for selection mode and enabling/disabling selection.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string|number} props.key - Unique key for the component.
 * @param {Object} props.filter - The filter object containing filter details.
 * @param {Array} props.value - The selected feature values.
 * @param {Function} props.onChange - Function to call when the selected features change.
 * @param {boolean} props.showControls - Whether to show selection mode controls.
 * @returns {JSX.Element} The rendered BaseMapFeatureSelect component.
 */
export const BaseMapFeatureSelect = ({ key, filter, value, onChange, showControls, ...props }) => {
  const { state: mapState } = useMapContext();
  const { map } = mapState;
  const prevTransformedFeaturesRef = useRef();
  const [isFeatureSelectActive, setFeatureSelectActive] = useState(false);
  const [selectionMode, setSelectionMode] = useState("feature");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const transformedFeatures = useFeatureSelect(
    map,
    filter,
    isFeatureSelectActive,
    setFeatureSelectActive,
    selectionMode,
    selectedOptions
  );
  

  // Check if filter.layer is provided
  if (!filter || !filter.layer) {
    console.error(
      `Error: attempting to instantiate a mapFeatureSelect filter without providing layer property in the filter definition. Filter name is "${filter.filterName}":`
    );
    console.log(filter);
  }

  // Get the layer using filter.layer from mapState
  const layer = mapState.layers[filter.layer];

  // Check if the specified layer exists in mapState
  if (!layer) {
    console.error(
      `Error: Layer '${filter.layer}' not found in mapState while attempting to instantiate a mapFeatureSelect filter.`
    );
  }

  

  // Ensure layer and its properties are defined
  const layerPath = layer?.metadata?.path ?? layer?.path;

  /**
   * Handles the change in selected options from the dropdown.
   *
   * @param {Array} options - The selected options from the dropdown.
   */
  const handleSelectionChange = useCallback((options) => {
    setSelectedOptions(options);
    onChange(filter, options);
  }, [filter, onChange]);

  /**
   * Handles the change in selection mode (feature or rectangle).
   *
   * @param {string} mode - The new selection mode.
   */
  const handleSelectionModeChange = (mode) => {
    if (isFeatureSelectActive) {
      setSelectionMode(mode);
    }
  };

  /**
   * Toggles the feature selection enabled state and sets the selection mode.
   */
  const toggleSelectEnabled = () => {
    const newState = !isFeatureSelectActive;
    setFeatureSelectActive(newState);

    // Automatically set the selection mode when enabling the filter
    if (newState) {
      setSelectionMode(selectionMode);
    }
  };

  useEffect(() => {
    if (!isEqual(prevTransformedFeaturesRef.current, transformedFeatures)) {
      prevTransformedFeaturesRef.current = transformedFeatures;
      handleSelectionChange(transformedFeatures);
    }
  }, [transformedFeatures, handleSelectionChange]);

  return (
    <Container key={key}>
      <FeatureSelect
        layerPath={layerPath}
        value={selectedOptions}
        onChange={handleSelectionChange}
        isMulti={props.isMulti !== undefined ? props.isMulti : filter.multiSelect}
        placeholder={props.placeholder || "Search and select map features..."}
        isClearable
      />

      {showControls && (
        <SelectionModeContainer>
          <EnableSelectButton
            enabled={isFeatureSelectActive}
            onClick={toggleSelectEnabled}
            $bgColor={props.bgColor}
          >
            {isFeatureSelectActive ? 'Disable Selection' : 'Enable Selector'}
          </EnableSelectButton>

          <StyledToggle enabled={isFeatureSelectActive}>
            <ModeButton
              selected={selectionMode === 'feature'}
              onClick={() => handleSelectionModeChange('feature')}
              disabled={!isFeatureSelectActive}
              $bgColor={props.bgColor}
            >
              <FaMousePointer />
              Pointer Select
            </ModeButton>
            <ModeButton
              selected={selectionMode === 'rectangle'}
              onClick={() => handleSelectionModeChange('rectangle')}
              disabled={!isFeatureSelectActive}
              $bgColor={props.bgColor}
            >
              <FaDrawPolygon />
              Rectangle Select
            </ModeButton>
          </StyledToggle>
        </SelectionModeContainer>
      )}
    </Container>
  );
};

export const MapFeatureSelectWithControls = (props) => (
  <BaseMapFeatureSelect {...props} showControls={true} isMulti />
);  

export const MapFeatureSelect = (props) => (
  <BaseMapFeatureSelect {...props} showControls={false} />
);