import React, { useState, useCallback } from "react";
import styled from "styled-components";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import { api } from "services";
import debounce from "lodash.debounce";
import { SelectorLabel } from "../Selectors/SelectorLabel";

/**
 * Styled container for the search component.
 */
const SearchContainer = styled.div`
  margin-bottom: 10px;
`;

/**
 * Custom MenuList component for react-select using react-window for virtualization.
 */
const MenuList = (props) => {
  const { options, children, maxHeight, getValue } = props;
  const height = 35;
  const [value] = getValue();
  const initialOffset = options.indexOf(value) * height;
  const listHeight = Math.min(options.length * height, maxHeight);

  return (
    <List
      height={listHeight}
      itemCount={children.length}
      itemSize={height}
      initialScrollOffset={initialOffset}
      width="100%"
      style={{ overflowX: "hidden" }} // Ensure no horizontal scrollbar
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

/**
 * LayerSearch component allows users to search for features within a specified layer
 * and zoom to the selected feature on the map.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.map - The MapLibre map instance.
 * @param {Object} props.layer - The layer object containing information about the map layer.
 * @returns {JSX.Element} The rendered LayerSearch component.
 */
export const LayerSearch = ({ map, layer }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetches options based on the input value.
   * @param {string} inputValue - The input value.
   */
  const fetchOptions = useCallback(
    debounce(async (inputValue) => {
      if (!inputValue) {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const features = await api.geodataService.getFeaturesMetadata(layer.id);
        const filteredOptions = features
          .filter((feature) =>
            String(feature.name)
              .toLowerCase()
              .startsWith(inputValue.toLowerCase())
          )
          .map((feature) => ({
            value: feature.id,
            label: feature.name || feature.id,
          }));
        setOptions(filteredOptions);
      } catch (error) {
        console.error("Failed to fetch features:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [layer.id]
  );

  /**
   * Handles the change event when a feature is selected.
   * @param {Object} selectedOption - The selected option.
   */
  const handleChange = useCallback(
    async (selectedOption) => {
      setSelectedOption(selectedOption);
      if (selectedOption) {
        try {
          const centroid = await api.geodataService.getFeatureGeometry(
            layer.id,
            selectedOption.value
          );
          map.flyTo({ center: centroid.coordinates, zoom: 12 });

          // Reset the dropdown after 1.5 seconds
          setTimeout(() => {
            setSelectedOption(null);
            setOptions([]);
          }, 1500);
        } catch (error) {
          console.error("Failed to fetch centroid:", error);
        }
      }
    },
    [layer.id, map]
  );

  /**
   * Handles the input change event.
   * @param {string} inputValue - The input value.
   */
  const handleInputChange = (inputValue) => {
    fetchOptions(inputValue);
  };

  return (
    <SearchContainer>
      <SelectorLabel text="Zoom to map feature" info={"Search for a feature to zoom to"} />
      <Select
        value={selectedOption}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        placeholder={`Search features in ${layer.id}...`}
        components={{ MenuList }}
        isLoading={isLoading}
        menuIsOpen={options.length > 0} // Only show the dropdown if there are options
        maxMenuHeight={200} // Set a maximum height for the dropdown
      />
    </SearchContainer>
  );
};