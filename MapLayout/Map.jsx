
import React, { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import 'maplibre-gl/dist/maplibre-gl.css';

import { api } from 'services';
import { useMap, useMapContext } from 'hooks';

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
`;

const Map = () => {
  const mapContainerRef = useRef(null);
  const geoJsonCacheRef = useRef({});
  const { map, isMapReady } = useMap(mapContainerRef);
  const { state, dispatch } = useMapContext()

  const addLayersFromGeoJSON = useCallback(async (map, layers) => {
    const fetchLayer = async (layer) => {
      // Check if the layer data is already cached
      if (!geoJsonCacheRef.current[layer.path]) {
        const geojson = await api.geodataService.getLayer(layer);
        geoJsonCacheRef.current[layer.path] = { geojson, geometryType: layer.geometryType };
      }
      return { id: layer.name, ...geoJsonCacheRef.current[layer.path] };
    };

    const geojsonLayers = await Promise.all(layers.map(fetchLayer));

    geojsonLayers.forEach(({ id, geojson, geometryType }) => {
      if (map.getSource(id)) {
        return;
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
          default:
            break;
        }
    });
  }, []);

  useEffect(() => {
    if (isMapReady) {
      console.log('Map load within Map component')
      addLayersFromGeoJSON(map, Object.values(state.layers)); // Then add new layers
    }

    // Remove layers when the component unmounts or layers change
    return () => {
      console.log("Map unmount")
      cleanMap(map, Object.values(state.layers));
    };
  }, [state.layers, isMapReady, map]);

  useEffect(() => {
    if (isMapReady) {
      const handleMapClickWrapped = (e) => handleMapClick(e, map, Object.values(state.layers), dispatch);
      map.on('click', handleMapClickWrapped);
  
      return () => {
        map.off('click', handleMapClickWrapped);
        cleanMap(map, Object.values(state.layers));
      };
    }
  }, [dispatch, state.layers, isMapReady, map]);

  return <StyledMapContainer ref={mapContainerRef} />;
};


// Helper functions
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

export default React.memo(Map);

