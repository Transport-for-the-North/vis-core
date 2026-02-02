import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { api } from 'services';
import { SelectorLabel } from '../Selectors/SelectorLabel';
import { FeatureSelect } from '../Selectors/FeatureSelect';

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
 * @param {Object} props.map - The MapLibre map instance.
 * @param {Object} props.layer - The layer object containing metadata for fetching features.
 * @returns {JSX.Element} The rendered LayerSearch component.
 */
export const LayerSearch = ({ map, layer }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const zoomToFeaturePlaceholderText = 
    layer.metadata?.zoomToFeaturePlaceholderText || 'Search features in this layer...';
  const zoomToFeatureMaxZoom = layer.metadata?.zoomToFeatureMaxZoom ?? 14;
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

          // Extract the bounding box coordinates
          // bounds.coordinates[0] is the polygon ring, we need to find min/max
          const coords = bounds.coordinates[0];
          const lngs = coords.map(c => c[0]);
          const lats = coords.map(c => c[1]);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          
          // Calculate padding based on geometry size
          const lngDiff = maxLng - minLng;
          const latDiff = maxLat - minLat;
          const maxDiff = Math.max(lngDiff, latDiff);
          const basePadding = maxDiff < 0.01 ? 150 : maxDiff < 0.05 ? 120 : 100;
          
          // Fit bounds to show entire geometry - DO NOT use center option as it conflicts
          map.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
            padding: basePadding,
            // Prevent over-zooming when the geometry bounds are very small
            maxZoom: zoomToFeatureMaxZoom,
          });

          // Add a temporary label for the selected feature with guaranteed visibility
          const labelLayerId = 'feature-label';
          const labelSourceId = 'feature-label-source';

          // Remove existing label if any
          if (map.getLayer(labelLayerId)) {
            map.removeLayer(labelLayerId);
            map.removeSource(labelSourceId);
          }

          // Add new source and layer for the label
          map.addSource(labelSourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: centroid.coordinates,
              },
              properties: {
                name: selectedOption.label,
              },
            },
          });

          map.addLayer({
            id: labelLayerId,
            type: 'symbol',
            source: labelSourceId,
            layout: {
              'text-field': ['get', 'name'],
              'text-font': ['Noto Sans Bold'],
              'text-size': 14,
              'text-offset': [0, 1.5],
              'text-anchor': 'top',
              'text-allow-overlap': true,
              'text-ignore-placement': true,
            },
            paint: {
              'text-color': '#000000',
              'text-halo-color': '#ffffff',
              'text-halo-width': 2,
              'text-opacity': 1,
            },
          });

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
          console.error('Failed to fetch bounds:', error);
        }
      }
    },
    [layer.metadata.path, map, zoomToFeatureMaxZoom]
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
