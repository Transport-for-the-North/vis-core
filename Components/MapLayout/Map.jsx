import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import { DynamicLegend } from "Components";
import { PageContext } from "contexts";
import { useMap, useMapContext } from "hooks";
import maplibregl from "maplibre-gl";
import { api } from "services";
import { Visualisation } from "./Visualisation";
import { colourSchemeSelectionColour } from "utils";
import { getHoverLayerStyle, getLayerStyle } from "utils";

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
`;

/**
 * Map component that renders a map using MapLibre GL and handles layers,
 * including hover and click interactions.
 * 
 * @returns {JSX.Element} The rendered Map component.
 */
const Map = () => {
  const mapContainerRef = useRef(null);
  const { map, isMapReady } = useMap(mapContainerRef);
  const pageContext = useContext(PageContext);
  const { state, dispatch } = useMapContext();
  const popups = [];
  const listenerCallbackRef = useRef({});


  /**
   * Adds a new layer to the map based on the provided layer configuration.
   * Handles both GeoJSON and tile layers and optionally adds a hover layer
   * if the layer is marked as hoverable.
   * 
   * @param {Object} layer - The layer configuration object containing information about the layer to be added to the map.
   * @param {string} layer.name - The name of the layer.
   * @param {string} layer.type - The type of layer (e.g., "geojson" or "tile").
   * @param {string} layer.geometryType - The geometry type of the layer (e.g., "point", "line", "polygon").
   * @param {boolean} [layer.isStylable=false] - Flag indicating whether the layer is stylable.
   * @param {boolean} [layer.isHoverable=false] - Flag indicating whether the layer is hoverable.
   */
  const addLayerToMap = useCallback(
    (layer) => {
      if (!map.getSource(layer.name)) {
        let sourceConfig = {};
        let layerConfig = getLayerStyle(layer.geometryType);
        layerConfig.id = layer.name;
        layerConfig.visibility = "visible";
        layerConfig.metadata = {
          ...layerConfig.metadata,
          isStylable: layer.isStylable ?? false,
        };

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
            metadata: {
              isStylable: layer.isStylable ?? false,
              bufferSize: layer.geometryType === "line" ? 7 : null,
            },
          });
          if (layer.isHoverable) {
            const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
            hoverLayerConfig.id = `${layer.name}-hover`;
            hoverLayerConfig.source = layer.name;
            hoverLayerConfig["source-layer"] = layer.sourceLayer;
            hoverLayerConfig.metadata = {
              ...hoverLayerConfig.metadata,
              isStylable: false,
            };
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
   * @property {Object} e - The event object containing information about the hover event.
   * @property {string} layerId - The ID of the layer being hovered over.
   */
  const handleLayerHover = useCallback(
    (e, layerId) => {
      if (!map || !e.point) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId],
      });
      if (features.length > 0) {
        const feature = features[0];
        map.setFilter(`${layerId}-hover`, ["==", "id", feature.id]);
      }
    },
    [map]
  );

  /**
   * Handles click events on a layer and displays a popup with information about the clicked feature.
   * @property {Object} e - The event object containing information about the click event.
   * @property {string} layerId - The ID of the layer being clicked.
   * @property {number} bufferSize - The size of the buffer around the click point for querying features.
   */
  const handleLayerClick = (e, layerId, bufferSize) => {
    if (popups.length !== 0) {
      popups.map((popup) => popup.remove());
      popups.length = 0;
    }
    const bufferdPoint = [
      [e.point.x - bufferSize, e.point.y - bufferSize],
      [e.point.x + bufferSize, e.point.y + bufferSize],
    ];
    const feature = map.queryRenderedFeatures(bufferdPoint, {
      layers: [layerId],
    });
    if (feature.length !== 0) {
      const coordinates = e.lngLat;
      const description = `<p>${feature[0].properties.name}</p><p>Value : ${
        feature[0].state.value ?? 0
      }</p>`;
      const newPopup = new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
      popups.push(newPopup);
    }
  };

  /**
   * Handles mouse leave events for a specific layer by clearing the hover state.
   *
   * @property {string} layerId - The ID of the layer from which the mouse has left.
   */
  const handleLayerLeave = useCallback(
    (layerId) => {
      if (!map) return;
      map.setFilter(`${layerId}-hover`, ["==", "id", ""]);
    },
    [map]
  );

  useEffect(() => {
    if (!map) return;

    Object.keys(state.layers).forEach((layerId) => {
      if (state.layers[layerId].isHoverable) {
        map.on("mousemove", layerId, (e) => handleLayerHover(e, layerId));
        map.on("mouseleave", layerId, () => handleLayerLeave(layerId));
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "grab";
        });
      }
      if (state.layers[layerId].shouldHaveTooltipOnClick) {
        const bufferSize = state.layers[layerId].bufferSize ?? 0;
        const clickCallback = (e) => handleLayerClick(e, layerId, bufferSize);
        map.on("click", clickCallback);
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "grab";
        });
        if (!listenerCallbackRef.current[layerId]) {
          listenerCallbackRef.current[layerId] = {};
        }
        listenerCallbackRef.current[layerId].clickCallback = clickCallback;
      }
    });

    return () => {
      Object.keys(state.layers).forEach((layerId) => {
        if (popups.length !== 0) {
          popups.map((popup) => popup.remove());
          popups.length = 0;
        }
        if (state.layers[layerId].shouldHaveTooltipOnClick) {
          const { clickCallback } = listenerCallbackRef.current[layerId];
          map.off("click", clickCallback);
        }
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
   * @property {Object} event - The event object containing information about the click event.
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
          
          // Remove the previous selection layer if it exists
          if (map.getLayer("selected-feature-layer")) {
            map.removeLayer("selected-feature-layer");
            map.removeSource("selected-feature-source");
          }

          let paintProp = {}

          // Here is where we should use the colourSchemeSelectionColour[state.color_scheme] 
          // for the circle paintProp, however we currently dont have full functionality.

          if (feature.layer.type == 'circle') {
            paintProp = {
              "circle-radius": 6,
              "circle-color": "green",
              "circle-opacity": 0.75,
              "circle-stroke-width": 2,
              "circle-stroke-color": "black"
              
            }
          }
          else if (feature.layer.type == 'fill') {
            paintProp = {
              "fill-color": "#f00",
              "fill-opacity": 0.5,
            }
          }

          // Add a new source and layer for the selected feature
          map.addSource("selected-feature-source", {
            type: "geojson",
            data: feature.toJSON(),
          });
          
          map.addLayer({
            id: "selected-feature-layer",
            type: feature.layer.type,
            source: "selected-feature-source",
            paint: paintProp,
          });

          // Dispatch the action with the value from the clicked feature
          filter.actions.map((action) => {
            dispatch({
              type: action.action,
              payload: { filter, value },
            });
          });
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


  useEffect(() => {
    if (isMapReady) {
      Object.values(state.layers).forEach((layer) => addLayerToMap(layer));
    }

    return () => {
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
          if (map.getLayer("selected-feature-layer")) {
            map.removeLayer("selected-feature-layer");
          }
          if (map.getSource("selected-feature-source")) {
            map.removeSource("selected-feature-source");
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
          maps={null}
        />
      ))}
      {isMapReady && <DynamicLegend map={map} />}
    </StyledMapContainer>
  );
};

export default React.memo(Map);
