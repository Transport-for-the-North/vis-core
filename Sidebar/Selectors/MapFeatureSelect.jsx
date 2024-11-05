import React, { useEffect, useState } from "react";
import Select from "react-select";
import styled from "styled-components";
import { FaMousePointer, FaDrawPolygon } from "react-icons/fa";
import { useMapContext } from "hooks";
import { useLayerFeatureMetadata } from "hooks/useLayerFeatureMetadata";

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
  border: 1px solid ${(props) => (props.enabled ? "black" : "#ccc")};
  border-radius: 5px;
  flex-grow: 1;
`;

const ModeButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.selected ? "#7317DE" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: none;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Hanken Grotesk", sans-serif;
  width: 50%;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    background-color: ${(props) => (props.selected ? "#7317DE" : "white")};
    color: ${(props) => (props.selected ? "white" : "black")};
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
  background-color: ${(props) => (props.enabled ? "#7317DE" : "white")};
  color: ${(props) => (props.enabled ? "white" : "black")};
  border: 1px solid ${(props) => (props.enabled ? "black" : "#ccc")};
  border-radius: 4px;
  margin-right: 10px;
  font-family: "Hanken Grotesk", sans-serif;

  &:hover {
    background-color: ${(props) => (props.enabled ? "#7317DE" : "white")};
    color: ${(props) => (props.enabled ? "white" : "black")};
  }
`;

/**
 * MapFeatureSelect component allows users to select features from a map layer
 * and toggle between different selection modes (feature or rectangle).
 *
 * If there are no options and the user hasn't entered any input, a placeholder
 * message 'Start typing to search features' is displayed. If the user has started
 * typing and there are no options found, a placeholder 'No features found' is displayed.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string|number} props.key - Unique key for the component.
 * @param {Object} props.filter - The filter object containing filter details.
 * @param {Array} props.value - The selected feature values.
 * @param {Function} props.onChange - Function to call when the selected features change.
 * @returns {JSX.Element} The rendered MapFeatureSelect component.
 */
export const MapFeatureSelect = ({ key, filter, value, onChange }) => {
  const { state: mapState, dispatch: mapDispatch } = useMapContext();

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

  // Extract values from mapState and set default values if necessary
  const selectedOptions = mapState.selectedFeatures?.value || [];
  const selectionMode = mapState.selectionMode || "feature";
  const isSelectEnabled =
    typeof mapState.isFeatureSelectActive === "boolean"
      ? mapState.isFeatureSelectActive
      : false;

  // Ensure layer and its properties are defined
  const layerPath = layer?.metadata?.path ?? layer?.path;

  // Use custom hook to fetch feature options
  const { options, isLoading, handleInputChange } =
    useLayerFeatureMetadata(layerPath);

  // State to manage the no options message
  const [noOptionsMessage, setNoOptionsMessage] = useState("Start typing to search features");

  // Effect to handle message transitions
  useEffect(() => {
    let timer;
    if (isLoading) {
      setNoOptionsMessage("Searching...");
    } else {
      timer = setTimeout(() => {
        setNoOptionsMessage("No features found");
      }, 300); // Adjust the delay as needed
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Reset the message when the dropdown is opened
  const handleMenuOpen = () => {
    setNoOptionsMessage("Start typing to search features");
  };

  /**
   * Handles the change in selected options from the dropdown.
   *
   * @param {Array} options - The selected options from the dropdown.
   */
  const handleSelectionChange = (options) => {
    mapDispatch({
      type: "SET_SELECTED_FEATURES",
      payload: { value: options || [] },
    });

    onChange(filter, options);
  };

  /**
   * Handles the change in selection mode (feature or rectangle).
   *
   * @param {string} mode - The new selection mode.
   */
  const handleSelectionModeChange = (mode) => {
    if (isSelectEnabled) {
      mapDispatch({
        type: "SET_SELECTION_MODE",
        payload: mode,
      });
    }
  };

  // Disable selection when the layer changes
  useEffect(() => {
    mapDispatch({
      type: "SET_IS_FEATURE_SELECT_ACTIVE",
      payload: false,
    });
  }, [layer, mapDispatch]);

  /**
   * Toggles the feature selection enabled state and sets the selection mode.
   */
  const toggleSelectEnabled = () => {
    const newState = !isSelectEnabled;
    mapDispatch({
      type: "SET_IS_FEATURE_SELECT_ACTIVE",
      payload: newState,
    });

    // Automatically set the selection mode when enabling the filter
    if (newState) {
      mapDispatch({
        type: "SET_SELECTION_MODE",
        payload: selectionMode, // Use current selectionMode
      });
    }
  };

  

  return (
    <Container key={key}>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleSelectionChange}
        onInputChange={handleInputChange}
        placeholder="Search and select map features..."
        isLoading={isLoading}
        noOptionsMessage={() => noOptionsMessage}
        onMenuOpen={handleMenuOpen}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({ ...base, minHeight: "35px" }),
        }}
        menuPortalTarget={document.body}
      />

      <SelectionModeContainer>
        <EnableSelectButton
          enabled={isSelectEnabled}
          onClick={toggleSelectEnabled}
        >
          {isSelectEnabled ? "Disable Filter" : "Enable Filter"}
        </EnableSelectButton>

        <StyledToggle enabled={isSelectEnabled}>
          <ModeButton
            selected={selectionMode === "feature"}
            onClick={() => handleSelectionModeChange("feature")}
            disabled={!isSelectEnabled}
          >
            <FaMousePointer />
            Pointer Selection
          </ModeButton>
          <ModeButton
            selected={selectionMode === "rectangle"}
            onClick={() => handleSelectionModeChange("rectangle")}
            disabled={!isSelectEnabled}
          >
            <FaDrawPolygon />
            Rectangle Selection
          </ModeButton>
        </StyledToggle>
      </SelectionModeContainer>
    </Container>
  );
};