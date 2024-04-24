
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import 'maplibre-gl/dist/maplibre-gl.css';

import { api } from 'services';
import useMap from 'hooks/useMap';
import useDidMountEffect from 'hooks/useDidMountEffect';
import { useFilter } from './FilterContext';

const StyledMapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Map = ({ layers }) => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const { state, dispatch } = useFilter()

  // Event handler for map click
  const handleMapClick = (e, layers) => {
    const clickedFeatures = [];
    
    if (!layers) return
    // Loop through each layer
    layers.forEach((layer) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer.name] });
      
      // Add matched features to the clickedFeatures array
      clickedFeatures.push(...features);
    });
    // Call updateMapFilters with the clicked features
    updateMapFilters(clickedFeatures);
  };

  const updateMapFilters = (clickedFeatures) => {
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
  
  useDidMountEffect(() => {
    if (isMapReady) {
      const addLayersFromGeoJSON = async () => {
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
              }
            });
          })
          .catch((error) => console.error('Error fetching GeoJSON:', error));
      };
      if (layers.length > 0) addLayersFromGeoJSON();
    }
  }, [layers, isMapReady, map]);

  useEffect(() => {
    if (isMapReady){
      map.on('click', (e) => handleMapClick(e, layers))
    }

    return () => {
      
    }
  }, [layers, isMapReady, map]);

  return <StyledMapContainer ref={mapContainerRef} />;
};

export default Map;

