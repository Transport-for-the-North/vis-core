
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import 'maplibre-gl/dist/maplibre-gl.css';

import { api } from 'services';
import {useMap, useDidMountEffect } from 'hooks';
import { useFilter } from './FilterContext';

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Map = ({ layers }) => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const { state, dispatch } = useFilter()

  useEffect(() => {
    if (isMapReady) {
      cleanMap(map, layers); // Clean up existing layers first
      addLayersFromGeoJSON(map, layers); // Then add new layers
    }

    // Cleanup function to remove layers when the component unmounts or layers change
    return () => {
      cleanMap(map, layers);
    };
  }, [layers, isMapReady, map]);

  useEffect(() => {
    if (isMapReady){
      map.on('click', (e) => handleMapClick(e, map, layers, dispatch))
    }

    return () => {
      cleanMap(map, layers)
    }
  }, [layers, isMapReady, map]);

  return <StyledMapContainer ref={mapContainerRef} />;
};

const cleanMap = (map, layers) => {
  if (map) {
    layers.forEach((layer) => {
      if (map.getLayer(layer.name)) {
        map.removeLayer(layer.name);
      }
      if (map.getSource(layer.name)) {
        map.removeSource(layer.name);
      }
    });
  }
};

const addLayersFromGeoJSON = async (map, layers) => {
  const fetchLayer = async (layer) => {
    const geojson = await api.geodataService.getLayer(layer)
    return { id: layer.name, geojson: geojson, geometryType: layer.geometryType };
  };

  Promise.all(layers.map(fetchLayer))
    .then((geojsonLayers) => {
      geojsonLayers.forEach(({ id, geojson, geometryType }) => {
        if (map.getSource(id)) {
          map.removeLayer(id);
          map.removeSource(id);
        }

        map.addSource(id, { type: 'geojson', data: geojson });
        switch (geometryType) {
          case 'line':
            map.addLayer({
              'id': id,
              'type': 'line',
              'source': id,
              'paint': {
                'line-color': 'black',
                'line-opacity': 0.8
              }
            });
            break;
          case 'polygon':
            map.addLayer({
              'id': id,
              'type': 'fill',
              'source': id,
              'paint': {
                'fill-color': 'black',
                'fill-opacity': 0.8
              }
            });
            break;
        }
      });
    })
    .catch((error) => console.error('Error fetching GeoJSON:', error));
};

// Event handler for map click
const handleMapClick = (e, map, layers, dispatch) => {
  const clickedFeatures = [];
  
  if (!layers) return
  // Loop through each layer
  layers.forEach((layer) => {
    const features = map.queryRenderedFeatures(e.point, { layers: [layer.name] });
    
    // Add matched features to the clickedFeatures array
    clickedFeatures.push(...features);
  });
  // Call updateMapFilters with the clicked features
  updateMapFilters(clickedFeatures, dispatch);
};

const updateMapFilters = (clickedFeatures, dispatch) => {
  // Iterate through all clicked features
  clickedFeatures.forEach((clickedFeature) => {
    // Check if the feature's layer matches the layer specified in any filter with a 'map' type
    dispatch({
      type: "UPDATE_FILTER",
      payload: {
        filterName: 'test',
        value: clickedFeature.properties.id
      }
    }
  );
  });
};

export default Map;

