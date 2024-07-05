import React, { useRef, useContext, useCallback, useEffect } from "react";
import { api } from "services";
import styled from "styled-components";
import { useDualMaps, useMapContext } from "hooks";
import { PageContext } from "contexts";
import { getHoverLayerStyle, getLayerStyle } from "utils";
import maplibregl from "maplibre-gl";
import { Visualisation } from "./Visualisation";
import { DynamicLegend } from "Components";

const StyledMapContainer = styled.div`
  width: 50%;
  height: 100%;
`;

const DualMaps = () => {
  const leftMapContainerRef = useRef(null);
  const rightMapContainerRef = useRef(null);
  const { leftMap, rightMap, isMapReady } = useDualMaps(leftMapContainerRef, rightMapContainerRef);
  const { state, dispatch } = useMapContext();
  const pageContext = useContext(PageContext);
  const maps = [leftMap, rightMap];
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
      maps.forEach((map) => {
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
      });
    },
    [leftMap, rightMap]
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
      if ((leftMap === null && rightMap === null) || !e.point) return;
      maps.forEach((map) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: [layerId],
        });
        if (features.length > 0) {
          const feature = features[0];
          map.setFilter(`${layerId}-hover`, ["==", "id", feature.id]);
        }
      });
    },
    [leftMap, rightMap]
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
    maps.forEach((map) => {
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
    });
  };

  /**
   * Handles mouse leave events for a specific layer by clearing the hover state.
   *
   * @property {string} layerId - The ID of the layer from which the mouse has left.
   */
  const handleLayerLeave = useCallback(
    (layerId) => {
      if ((leftMap === null && rightMap === null)) return;
      maps.forEach((map) => {
        map.setFilter(`${layerId}-hover`, ["==", "id", ""]);
      });
    },
    [leftMap, rightMap]
  );

  useEffect(() => {
    if ((leftMap === null && rightMap === null)) return;
    Object.keys(state.layers).forEach((layerId) => {
      maps.forEach((map) => {
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
    });

    return () => {
      Object.keys(state.layers).forEach((layerId) => {
        if (popups.length !== 0) {
          popups.map((popup) => popup.remove());
          popups.length = 0;
        }
        maps.forEach((map) => {
          if (state.layers[layerId].shouldHaveTooltipOnClick) {
            const { clickCallback } = listenerCallbackRef.current[layerId];
            map.off("click", clickCallback);
          }
          if (state.layers[layerId].isHoverable) {
            map.off("mousemove", layerId, (e) => handleLayerHover(e, layerId));
            map.off("mouseleave", layerId, () => handleLayerLeave(layerId));
          }
        });
      });
    };
  }, [leftMap, rightMap, handleLayerHover, handleLayerLeave, state.layers]);

  /**
   * Handles map click events and dispatches actions based on the clicked feature.
   *
   * @property {Object} event - The event object containing information about the click event.
   */
  const handleMapClick = useCallback(
    (event) => {
      if (!isMapReady || (leftMap === null && rightMap === null)) return;

      const point = event.point;

      // Get all map filters
      const mapFilters = pageContext.config.filters.filter(
        (filter) => filter.type === "map"
      );

      // For each map filter, check if the clicked point has a feature from the layer
      mapFilters.forEach((filter) => {
        maps.forEach((map) => {
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

            // Add a new source and layer for the selected feature
            map.addSource("selected-feature-source", {
              type: "geojson",
              data: feature.toJSON(),
            });

            map.addLayer({
              id: "selected-feature-layer",
              type: "fill",
              source: "selected-feature-source",
              paint: {
                "fill-color": "#f00",
                "fill-opacity": 0.5,
              },
            });

            console.log(`Updating ${filter.field}`);

            // Dispatch the action with the value from the clicked feature
            filter.actions.map((action) => {
              dispatch({
                type: action.action,
                payload: { filter, value },
              });
            });
          }
        });
      });
    },
    [isMapReady, leftMap, rightMap, pageContext.config.filters, dispatch]
  );

  // Run once to set the state of the map
  useEffect(() => {
    if (isMapReady) {
      dispatch({
        type: "SET_MAP",
        payload: { map: leftMap }, //Not sure about this part, needs some update
      });
    }
  }, [isMapReady]);

  useEffect(() => {
    if (isMapReady) {
      const hasMapFilter = pageContext.config.filters.some(
        (filter) => filter.type === "map"
      );
      if (hasMapFilter) {
        maps.forEach((map) => map.on("click", handleMapClick));
      }
    }

    return () => {
      if (leftMap && rightMap) {
        maps.forEach((map) => map.off("click", handleMapClick));
      }
    };
  }, [isMapReady, leftMap, rightMap, handleMapClick]);

  useEffect(() => {
    if (isMapReady) {
      console.log("Map load within Map component");
      Object.values(state.layers).forEach((layer) => addLayerToMap(layer));
    }

    return () => {
      console.log("Map unmount");
      if (leftMap && rightMap) {
        Object.values(state.layers).forEach((layer) => {
          maps.forEach((map) => {
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
        });
      }
    };
  }, [state.layers, isMapReady, leftMap, rightMap, addLayerToMap]);

  return (
    <>
      <StyledMapContainer ref={leftMapContainerRef}>
      {Object.values(state.leftVisualisations).map((visConfig) => (
          <Visualisation
            key={visConfig.name}
            visualisationName={visConfig.name}
          map={leftMap}
          left={true}
        />
      ))}
        {isMapReady && <DynamicLegend map={leftMap} />}
        </StyledMapContainer>
      <StyledMapContainer ref={rightMapContainerRef}>
        {Object.values(state.rightVisualisations).map((visConfig) => (
          <Visualisation
            key={visConfig.name}
            visualisationName={visConfig.name}
            map={rightMap}
            left={false}
          />
        ))}
        {isMapReady && <DynamicLegend map={rightMap} />}
        </StyledMapContainer>
      
    </>
  );
};

export default React.memo(DualMaps);
