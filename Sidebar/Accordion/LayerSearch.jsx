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
margin-top: 10px;
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
        const features = await api.geodataService.fetchMetadataFromPath(layer.metadata.path);
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
    [layer.metadata.path]
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
            layer.metadata.path,
            selectedOption.value
          );
          map.flyTo({ center: centroid.coordinates, zoom: 12 });

          // Add a label for the selected feature
          const labelLayerId = 'feature-label';
          const labelSourceId = 'feature-label-source';

          // Remove existing label if any
          if (map.getLayer(labelLayerId)) {
            map.removeLayer(labelLayerId);
            map.removeSource(labelSourceId);
          }

          map.addSource(labelSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centroid.coordinates
              },
              properties: {
                name: selectedOption.label
              }
            }
          });

          map.addLayer({
            id: labelLayerId,
            type: 'symbol',
            source: labelSourceId,
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'], // Use the same fonts as the app
              'text-size': 14, // Adjust the text size as needed
              'text-offset': [0, 1.5],
              'text-anchor': 'top'
            },
            paint: {
              'text-color': '#000000', // Set the text color
              'text-halo-color': '#ffffff', // Add a halo for better readability
              'text-halo-width': 2
            }
          });

          // Remove the label when the user interacts with the map
          const removeLabel = () => {
            if (map.getLayer(labelLayerId)) {
              map.removeLayer(labelLayerId);
              map.removeSource(labelSourceId);
            }
            map.off('move', removeLabel);
            map.off('click', removeLabel);
          };

          map.on('move', removeLabel);
          map.on('click', removeLabel);

        } catch (error) {
          console.error("Failed to fetch centroid:", error);
        }
      }
    },
    [layer.metadata.path, map]
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