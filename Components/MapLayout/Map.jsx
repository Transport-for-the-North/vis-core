import React, { useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import 'maplibre-gl/dist/maplibre-gl.css';

import { api } from 'services';
import { useMap, useMapContext } from 'hooks';
import { Visualisation } from './Visualisation'

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
`;

const Map = () => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const { state, dispatch } = useMapContext();

  const getLayerStyle = (geometryType) => {
    switch (geometryType) {
      case 'polygon':
        return {
          'id': '',
          'type': 'fill',
          'source': '',
          'paint': {
            'fill-color': 'black',
            'fill-opacity': 0.1
          }
        };
      case 'line':
        return {
          'id': '',
          'type': 'line',
          'source': '',
          'paint': {
            'line-color': 'black',
            'line-opacity': 0.1
          }
        };
      case 'point':
        return {
          'id': '',
          'type': 'circle',
          'source': '',
          'paint': {
            'circle-radius': 5,
            'circle-color': 'black'
          }
        };
      default:
        return {};
    }
  };

  const addLayerToMap = useCallback((layer) => {
    if (!map.getSource(layer.name)) {
      let sourceConfig = {};
      let layerConfig = getLayerStyle(layer.geometryType);
      layerConfig.id = layer.name;

      if (layer.type === 'geojson') {
        // Fetch and add a GeoJSON layer
        api.geodataService.getLayer(layer).then((geojson) => {
          sourceConfig.type = 'geojson';
          sourceConfig.data = geojson;
          map.addSource(layer.name, sourceConfig);
          map.addLayer({ ...layerConfig, 'source': layer.name });
        });
      } else if (layer.type === 'tile') {
        // Add a tile layer
        const url = layer.source === 'api' ? api.geodataService.buildTileLayerUrl(layer.path) : layer.path;
        sourceConfig.type = 'vector';
        sourceConfig.tiles = [url];
        map.addSource(layer.name, sourceConfig);
        map.addLayer({ ...layerConfig, 'source': layer.name, 'source-layer': layer.sourceLayer });
      }
    }
  }, [map]);

  useEffect(() => {
    if (isMapReady) {
      console.log('Map load within Map component');
      Object.values(state.layers).forEach((layer) => addLayerToMap(layer));
    }

    // Remove layers when the component unmounts or layers change
    return () => {
      console.log("Map unmount");
      if (map) {
        Object.values(state.layers).forEach((layer) => {
          if (map.getLayer(layer.name)) {
            map.removeLayer(layer.name);
          }
          if (map.getSource(layer.name)) {
            map.removeSource(layer.name);
          }
        });
      }
    };
  }, [state.layers, isMapReady, map, addLayerToMap]);

  return (
    <StyledMapContainer ref={mapContainerRef}>
      {Object.values(state.visualisations).map((visConfig) => (
        <Visualisation key={visConfig.name} visualisationName={visConfig.name} />
      ))}
    </StyledMapContainer>
  );
};

const handleMapClick = (e, map, layers, dispatch) => {
  const clickedFeatures = [];
  if (!layers) return;

  layers.forEach((layer) => {
    const features = map.queryRenderedFeatures(e.point, { layers: [layer.name] });
    clickedFeatures.push(...features);
  });

  updateMapFilters(clickedFeatures, dispatch);
};

const updateMapFilters = (clickedFeatures, dispatch) => {
  clickedFeatures.forEach((clickedFeature) => {
    dispatch({
      type: "UPDATE_FILTER",
      payload: {
        filterName: 'test',
        value: clickedFeature.properties.id,
      },
    });
  });
};

export default React.memo(Map);