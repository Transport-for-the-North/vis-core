import React, { useEffect, useCallback, useRef, useState, useContext } from "react";
import styled from "styled-components";
import "maplibre-gl/dist/maplibre-gl.css";

import { api } from "services";
import { useMap, useMapContext } from "hooks";
import { Visualisation } from "./Visualisation";
import { PageContext } from "contexts";
import { DynamicLegend } from "Components";
import { featureFilter } from "maplibre-gl";

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
`;

/**
 * Map component that renders a map using MapLibre GL and handles layers,
 * including hover and click interactions.
 */
const Map = () => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const pageContext = useContext(PageContext);
  const { state, dispatch } = useMapContext();
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  /**
   * Generates the style configuration for a regular layer based on the geometry
   * type of the layer.
   *
   * @param {string} geometryType - The type of geometry for the layer. Possible values are "polygon", "line", or "point".
   * @returns {Object} The style configuration object for the layer.
   */
  const getLayerStyle = (geometryType) => {
    switch (geometryType) {
      case "polygon":
        return {
          id: "",
          type: "fill",
          source: "",
          paint: {
            "fill-color": "rgb(255, 255, 0, 0)",
            "fill-outline-color": "rgba(195, 195, 195, 1)",
          },
        };
      case "line":
        return {
          id: "",
          type: "line",
          source: "",
          paint: {
            "line-color": "black",
            "line-opacity": 0.8,
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

  /**
   * Generates the style configuration for a hover layer based on the geometry
   * type of the layer.
   *
   * @param {string} geometryType - The type of geometry for the hover layer. Possible values are "polygon", "line", or "point".
   * @returns {Object} The style configuration object for the hover layer.
   */
  const getHoverLayerStyle = (geometryType) => {
    switch (geometryType) {
      case "polygon":
        return {
          id: "",
          type: "line",
          paint: {
            "line-color": "rgba(0, 0, 0, 1.0)", // Default color
            // Zoom-dependent line width
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              // Specify zoom levels and corresponding line widths
              5, 1, // At zoom level 5, line width will be 1
              10, 2, // At zoom level 10, line width will be 2
              15, 4, // At zoom level 15, line width will be 4
              20, 8  // At zoom level 20, line width will be 8
            ],
          },
          filter: ["==", "id", ""],
        };
      case "line":
        return {
          id: "",
          type: "line",
          paint: {
            "line-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "rgba(255, 255, 255, 1.0)", // Hover color
              "rgba(0, 0, 0, 1.0)", // Default color
            ],
            "line-opacity": 0.8,
          },
          filter: ["==", "id", ""],
        };
      case "point":
        return {
          id: "",
          type: "circle",
          paint: {
            "circle-radius": 5,
            "circle-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "rgba(255, 255, 255, 1.0)", // Hover color
              "rgba(0, 0, 0, 1.0)", // Default color
            ],
          },
          filter: ["==", "id", ""],
        };
      default:
        return {};
    }
  };

  /**
   * Adds a new layer to the map based on the provided layer configuration.
   * Handles both GeoJSON and tile layers and optionally adds a hover layer
   * if the layer is marked as hoverable.
   *
   * @param {Object} layer - The layer configuration object containing information about the layer to be added to the map.
   */
  const addLayerToMap = useCallback(
    (layer) => {
      if (!map.getSource(layer.name)) {
        let sourceConfig = {};
        let layerConfig = getLayerStyle(layer.geometryType);
        layerConfig.id = layer.name;
        layerConfig.visibility = "visible";
        layerConfig.metadata = { ...layerConfig.metadata, isStylable: layer.isStylable ?? false }

        // console.log(map)
        if (layer.type === "geojson") {
          api.geodataService.getLayer(layer).then((geojson) => {
            sourceConfig.type = "geojson";
            sourceConfig.data = geojson;
            map.addSource(layer.name, sourceConfig);
            map.addLayer({ ...layerConfig, source: layer.name });
            if (layer.isHoverable) {
              const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
              hoverLayerConfig.id = `${layer.name}-hover`;
              map.addLayer({ ...hoverLayerConfig, source: layer.name });
            }
          });
        } else if (layer.type === "tile") {
          const url =
            layer.source === "api"
              ? api.geodataService.buildTileLayerUrl(layer.path)
              : layer.path;
          sourceConfig.type = "vector";
          sourceConfig.tiles = [url];
          sourceConfig.promoteId = "id";
          map.addSource(layer.name, sourceConfig);
          map.addLayer({
            ...layerConfig,
            source: layer.name,
            "source-layer": layer.sourceLayer,
            metadata: { isStylable: layer.isStylable ?? false }
          });

          if (layer.isHoverable) {
            const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
            hoverLayerConfig.id = `${layer.name}-hover`;
            hoverLayerConfig.source = layer.name;
            hoverLayerConfig["source-layer"] = layer.sourceLayer;
            hoverLayerConfig.metadata = { ...hoverLayerConfig.metadata, isStylable: false }
            map.addLayer(hoverLayerConfig);
          }
        }
      }
    },
    [map]
  );

  /**
   * Handles hover events for a specific layer by setting the hover state
   * for features under the mouse pointer.
   *
   * @param {Object} e - The event object containing information about the hover event.
   * @param {string} layerId - The ID of the layer being hovered over.
   */
  const handleLayerHover = useCallback((e, layerId) => {
    if (!map || !e.point) return;

    const features = map.queryRenderedFeatures(e.point, {
      layers: [layerId],
    });

    if (features.length > 0) {
      const feature = features[0];
      map.setFilter(`${layerId}-hover`, ["==", "id", feature.id]);
    }
  }, [map]);

  /**
   * Handles mouse leave events for a specific layer by clearing the hover state.
   *
   * @param {string} layerId - The ID of the layer from which the mouse has left.
   */
  const handleLayerLeave = useCallback((layerId) => {
    if (!map) return;
    map.setFilter(`${layerId}-hover`, ["==", "id", ""]);
  }, [map]);

  /**
   * Effect to add hover and leave event listeners to hoverable layers.
   */
  useEffect(() => {
    if (!map) return;

    Object.keys(state.layers).forEach((layerId) => {
      if (state.layers[layerId].isHoverable) {
        map.on("mousemove", layerId, (e) => handleLayerHover(e, layerId));
        map.on("mouseleave", layerId, () => handleLayerLeave(layerId));
      }
    });

    return () => {
      Object.keys(state.layers).forEach((layerId) => {
        if (state.layers[layerId].isHoverable) {
          map.off("mousemove", layerId, (e) => handleLayerHover(e, layerId));
          map.off("mouseleave", layerId, () => handleLayerLeave(layerId));
        }
      });
    };
  }, [map, handleLayerHover, handleLayerLeave, state.layers]);

  /**
   * Handles map click events and dispatches actions based on the clicked feature.
   *
   * @param {Object} event - The event object containing information about the click event.
   */
  const handleMapClick = useCallback(
    (event) => {
      if (!isMapReady || !map) return;

      const point = event.point;

      // Get all map filters
      const mapFilters = pageContext.config.filters.filter(
        (filter) => filter.type === "map"
      );

      // For each map filter, check if the clicked point has a feature from the layer
      mapFilters.forEach((filter) => {
        const features = map.queryRenderedFeatures(point, {
          layers: [filter.layer],
        });
        if (features.length > 0) {
          // Assuming the first feature is the one we're interested in
          const feature = features[0];
          const value = feature.properties[filter.field];

          // Update the selected feature ID
          setSelectedFeatureId(feature.id);

          // Remove the previous selection layer if it exists
          if (map.getLayer('selected-feature-layer')) {
            map.removeLayer('selected-feature-layer');
            map.removeSource('selected-feature-source');
          }

          // Add a new source and layer for the selected feature
          map.addSource('selected-feature-source', {
            type: 'geojson',
            data: feature.toJSON()
          });

          map.addLayer({
            id: 'selected-feature-layer',
            type: 'fill',
            source: 'selected-feature-source',
            paint: {
              'fill-color': '#f00',
              'fill-opacity': 0.5
            }
          });

          console.log(`Updating ${filter.field}`);
          
          // Dispatch the action with the value from the clicked feature
          filter.actions.map((action) => {
              dispatch({
                type: action.action,
                payload: {filter, value}
              });
          })
        }
      });
    },
    [isMapReady, map, pageContext.config.filters, dispatch]
  );

  // Run once to set the state of the map
  useEffect(() => {
    if (isMapReady) {
      dispatch({
        type: "SET_MAP",
        payload: { map },
      });
    }
  }, [isMapReady]);

  /**
   * Effect to add click event listener to the map if there are map filters.
   */
  useEffect(() => {
    if (isMapReady) {
      const hasMapFilter = pageContext.config.filters.some(
        (filter) => filter.type === "map"
      );
      if (hasMapFilter) {
        map.on("click", handleMapClick);
      }
    }

    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [isMapReady, map, handleMapClick]);

  /**
   * Effect to add layers to the map and clean up on component unmount.
   */
  useEffect(() => {
    if (isMapReady) {
      console.log("Map load within Map component");
      Object.values(state.layers).forEach((layer) => addLayerToMap(layer));
    }

    return () => {
      console.log("Map unmount");
      if (map) {
        Object.values(state.layers).forEach((layer) => {
          if (map.getLayer(layer.name)) {
            map.removeLayer(layer.name);
          }
          if (map.getLayer(`${layer.name}-hover`)) {
            map.removeLayer(`${layer.name}-hover`);
          }
          if (map.getSource(layer.name)) {
            map.removeSource(layer.name);
          }
          if (map.getLayer('selected-feature-layer')) {
            map.removeLayer('selected-feature-layer');
          }
          if (map.getSource('selected-feature-source')) {
            map.removeSource('selected-feature-source');
          }
        });
      }
    };
  }, [state.layers, isMapReady, map, addLayerToMap]);

  return (
    <StyledMapContainer ref={mapContainerRef}>
      {Object.values(state.visualisations).map((visConfig) => (
        <Visualisation
          key={visConfig.name}
          visualisationName={visConfig.name}
          map={map}
        />
      ))}
      {isMapReady && <DynamicLegend map={map} />}
    </StyledMapContainer>
  );
};

export default React.memo(Map);
