import React, { useEffect, useCallback, useRef, useContext } from "react";
import styled from "styled-components";
import "maplibre-gl/dist/maplibre-gl.css";

import { api } from 'services';
import { useMap, useMapContext } from 'hooks';
import { Visualisation } from './Visualisation'
import { PageContext } from "contexts";

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
`;

//{mapData, colourScheme}
const Map = () => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const pageContext = useContext(PageContext)
  const { state, dispatch } = useMapContext();
  
  const getLayerStyle = (geometryType) => {
    switch (geometryType) {
      case "polygon":
        return {
          id: "",
          type: "fill",
          source: "",
          paint: {
            "fill-color": "black",
            "fill-opacity": 0.1,
          },
        };
      case "line":
        return {
          id: "",
          type: "line",
          source: "",
          paint: {
            "line-color": "black",
            "line-opacity": 0.1,
          },
        };
      case "point":
        return {
          id: "",
          type: "circle",
          source: "",
          paint: {
            "circle-radius": 5,
            "circle-color": "black",
          },
        };
      default:
        return {};
    }
  };

  const addLayerToMap = useCallback(
    (layer) => {
      if (!map.getSource(layer.name)) {
        let sourceConfig = {};
        let layerConfig = getLayerStyle(layer.geometryType);
        layerConfig.id = layer.name;

        if (layer.type === "geojson") {
          // Fetch and add a GeoJSON layer
          api.geodataService.getLayer(layer).then((geojson) => {
            sourceConfig.type = "geojson";
            sourceConfig.data = geojson;
            sourceConfig.promoteId = "id";
            map.addSource(layer.name, sourceConfig);
            map.addLayer({ ...layerConfig, source: layer.name});
          });
        } else if (layer.type === "tile") {
          // Add a tile layer
          const url =
            layer.source === "api"
              ? api.geodataService.buildTileLayerUrl(layer.path)
              : layer.path;
          sourceConfig.type = "vector";
          sourceConfig.tiles = [url];
          map.addSource(layer.name, sourceConfig);
          map.addLayer({
            ...layerConfig,
            source: layer.name,
            "source-layer": layer.sourceLayer,
          });
        }
        // if (state.visualisations[layer.visualisationName].data && state.visualisations[layer.visualisationName].data.length > 0) {
        //   state.visualisations[layer.visualisationName].data.forEach((row) => {
        //     map.setFeatureState(
        //       {
        //         source: layer.name,
        //         sourceLayer: layer,
        //         id: layerConfig.id
        //       },
        //       {
        //         value: row["value"],
        //         valueAbs: Math.abs(row["value"]),
        //         filter: row["filter"]
        //       }
        //     )
        //   })
        // }
      }
    },
    [map]
  );

  
  // Function to handle map click events
  const handleMapClick = useCallback((event) => {
    if (!isMapReady || !map) return;

    // Get the point where the map is clicked
    const point = event.point;

    // Get all map filters
    const mapFilters = pageContext.config.filters.filter(filter => filter.type === 'map');

    // For each map filter, check if the clicked point has a feature from the layer
    mapFilters.forEach(filter => {
      const features = map.queryRenderedFeatures(point, { layers: [filter.layer] });
      if (features.length > 0) {
        // Assuming the first feature is the one we're interested in
        const feature = features[0];
        const value = feature.properties[filter.field];
        console.log(`Updating ${filter.field}`)
        // Dispatch the action with the value from the clicked feature
        dispatch({
          type: filter.action,
          payload: { filter, value }
        });
      }
    });
  }, [isMapReady, map, pageContext.config.filters, dispatch]);
  
  // Set up the click event listener
  useEffect(() => {
    if (isMapReady) {
      // Check if there is a map filter before adding the click handler
      const hasMapFilter = pageContext.config.filters.some(filter => filter.type === 'map');
      if (hasMapFilter) {
        map.on('click', handleMapClick);
      }
    }

    // Remove the click event listener when the component unmounts or dependencies change
    return () => {
      if (map) {
        map.off('click', handleMapClick);
      }
    };
  }, [isMapReady, map, handleMapClick]);

  useEffect(() => {
    if (isMapReady) {
      console.log("Map load within Map component");
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
        <Visualisation key={visConfig.name} visualisationName={visConfig.name} map={map} />
      ))}
    </StyledMapContainer>
  );
};

export default React.memo(Map);
