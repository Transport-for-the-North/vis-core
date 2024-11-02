import React, { useEffect } from "react";
import Select from "react-select";
import styled from "styled-components";
import { useMapContext } from "hooks";
import { FaMousePointer, FaDrawPolygon } from "react-icons/fa";
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
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.layer - The layer object containing metadata for fetching features.
 * @returns {JSX.Element} The rendered MapFeatureSelect component.
 */
export const MapFeatureSelect = ({ layer }) => {
  const { state: mapState, dispatch: mapDispatch } = useMapContext();

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
  const { options, isLoading, handleInputChange } = useLayerFeatureMetadata(
    layerPath
  );

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
    <Container>
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={handleSelectionChange}
        onInputChange={handleInputChange}
        placeholder="Search and select map features..."
        isLoading={isLoading}
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
