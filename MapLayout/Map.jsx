import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { DynamicLegend } from "Components";
import { useMap, useMapContext, useFilterContext, useFeatureSelect } from "hooks";
import { actionTypes } from "reducers";
import maplibregl from "maplibre-gl";
import { VisualisationManager } from "./VisualisationManager";
import { Layer } from "./Layer";
import {
  getSourceLayer,
  numberWithCommas,
} from "utils";
import "./MapLayout.css";

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
  const { state, dispatch } = useMapContext();
  const { mapStyle, mapCentre, mapZoom } = state;
  const { map, isMapReady } = useMap(mapContainerRef, mapStyle, mapCentre, mapZoom);
  const { dispatch: filterDispatch } = useFilterContext();
  const popups = {};
  const listenerCallbackRef = useRef({});
  const hoverIdRef = useRef({});

  /**
   * Handles hover events for a specific layer by setting the hover state
   * for features under the mouse pointer. If hoverNulls is false, only sets
   * the hover state for features where feature-state value is not null or undefined.
   *
   * @property {Object} e - The event object containing information about the hover event.
   * @property {string} layerId - The ID of the layer being hovered over.
   * @property {number} bufferSize - The size of the buffer around the hover point for querying features.
   * @property {boolean} hoverNulls - Flag indicating whether to set hover state for features with null feature-state values.
   */
  const handleLayerHover = useCallback(
    (e, layerId, bufferSize, hoverNulls) => {
      if (!map || !e.point) return;

      const hoverLayerId = `${layerId}-hover`;
      const bufferdPoint = [
        [e.point.x - bufferSize, e.point.y - bufferSize],
        [e.point.x + bufferSize, e.point.y + bufferSize],
      ];
      let features = [];
      if (layerId in map.style._layers) {
        features = map.queryRenderedFeatures(bufferdPoint, {
          layers: [layerId],
        });
      }
      if (features.length === 0) {
        if (map.getLayer(hoverLayerId) && hoverIdRef.current[layerId]) {
          const sourceLayer = getSourceLayer(map, layerId);
          map.setFeatureState(
            { source: layerId, id: hoverIdRef.current[layerId], sourceLayer },
            { hover: false }
          );
        }
        return;
      }
      const feature = features[0];
      const source = feature.layer.source;
      const sourceLayer = feature.layer["source-layer"];

      // Check hoverNulls and feature-state value
      if (!hoverNulls && (feature.state.value === null || feature.state.value === undefined)) {
        return; // Skip setting hover state if hoverNulls is false and feature-state value is null or undefined
      }

      if (map.getLayer(hoverLayerId) && hoverIdRef.current[layerId]) {
        map.setFeatureState(
          { source, id: hoverIdRef.current[layerId], sourceLayer },
          { hover: false }
        );
        hoverIdRef.current[layerId] = feature.id;
        map.setFeatureState(
          { source, id: hoverIdRef.current[layerId], sourceLayer },
          { hover: true }
        );
        return;
      }

      hoverIdRef.current[layerId] = feature.id;
      map.setFeatureState(
        { source, id: hoverIdRef.current[layerId], sourceLayer },
        { hover: true }
      );
    },
    [map]
  );

  /**
 * Handles hover events on a layer and displays a popup with information about the hovered feature.
 * If hoverNulls is false, the hover tooltip does not render for features where the feature-state value is null.
 *
 * @param {Object} e - The event object containing information about the hover event.
 * @param {string} layerId - The ID of the layer being hovered.
 * @param {number} bufferSize - The size of the buffer around the hover point for querying features.
 * @param {boolean} hoverNulls - Flag indicating whether to show tooltips for features with null feature-state values.
 */
  const handleLayerHoverTooltip = useCallback(
    (e, layerId, bufferSize, hoverNulls) => {
      if (popups[layerId]?.length) {
        popups[layerId].forEach((popup) => popup.remove());
        popups[layerId] = [];
      }
      const shouldIncludeMetadata = state.layers[layerId]?.hoverTipShouldIncludeMetadata ?? false;
  
      const bufferdPoint = [
        [e.point.x - bufferSize, e.point.y - bufferSize],
        [e.point.x + bufferSize, e.point.y + bufferSize],
      ];
  
      let features = [];
      if (layerId in map.style._layers) {
        features = map.queryRenderedFeatures(bufferdPoint, {
          layers: [layerId],
        });
      }
  
      if (features.length !== 0) {
        const coordinates = e.lngLat;
        let descriptions = '';
  
        features.forEach((feature, index) => {
          const featureName = feature.properties.name || '';
          const featureValue = feature.state.value || '';
  
          if (!hoverNulls && featureValue === '') {
            return;
          }
  
          let description = '';
          if (featureName && featureValue) {
            description = `
              <div class="popup-content">
                <p class="feature-name">${featureName}</p>
                <hr class="divider">
                <div class="metadata-item">
                  <span class="metadata-key">Value:</span>
                  <span class="metadata-value">${numberWithCommas(featureValue)} ${state.visualisations[state.layers[layerId].visualisationName].legendText[0].legendSubtitleText}</span>
                </div>
              </div>`;
          } else if (featureName) {
            description = `
              <div class="popup-content">
                <p class="feature-name">${featureName}</p>
              </div>`;
          }
  
          // Extract additional metadata columns
          const metadataKeys = Object.keys(feature.properties).filter(
            key => !['id', 'name', 'value'].includes(key)
          );
  
          if (metadataKeys.length > 0 && shouldIncludeMetadata) {
            let metadataDescription = '<div class="metadata-section">';
            metadataKeys.forEach(key => {
              metadataDescription += `
                <div class="metadata-item">
                  <span class="metadata-key">${key}:</span>
                  <span class="metadata-value">${feature.properties[key]}</span>
                </div>`;
            });
            metadataDescription += '</div>';
            description += metadataDescription;
          }
  
          if (description) {
            descriptions += description;
            if (index < features.length - 1) {
              descriptions += '<hr class="thick-divider">';
            }
          }
        });
  
        if (descriptions) {
          const newPopup = new maplibregl.Popup({
            className: 'custom-popup',
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat(coordinates)
            .setHTML(descriptions)
            .addTo(map);
          if (!popups[layerId]) {
            popups[layerId] = [];
          }
          popups[layerId].push(newPopup);
        }
      }
    },
    [map, popups, state.visualisations]
  );
  

  /**
   * Handles click events on a layer and displays a popup with information about the clicked feature.
   * @property {Object} e - The event object containing information about the click event.
   * @property {string} layerId - The ID of the layer being clicked.
   * @property {number} bufferSize - The size of the buffer around the click point for querying features.
   */
  const handleLayerClick = (e, layerId, bufferSize) => {
    if (popups[layerId]?.length) {
      popups[layerId].forEach((popup) => popup.remove());
      popups[layerId] = [];
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
      const description = `<p>${feature[0].properties.name ?? ""}</p><p> Id: ${feature[0].properties.id}</p><p>Value: ${
          feature[0].state.value ?? 0
        }</p>`;
      const newPopup = new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
      if (!popups[layerId]) {
        popups[layerId] = [];
      }
      popups[layerId].push(newPopup);
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
      if (map.getLayer(`${layerId}-hover`) && hoverIdRef.current[layerId]) {
        const sourceLayer = getSourceLayer(map, layerId);
        map.setFeatureState(
          { source: layerId, id: hoverIdRef.current[layerId], sourceLayer },
          { hover: false }
        );
      }
    },
    [map]
  );

  /**
 * Handles zoom events to control the visibility and creation of label layers.
 * If labelNulls is true, labels all features. If false, only labels features where feature-state is not null.
 *
 * @param {number} labelZoomLevel - The zoom level at which labels should start appearing.
 * @param {string} layerId - The ID of the layer for which labels are being controlled.
 * @param {string} sourceLayerName - The name of the source layer.
 * @param {boolean} labelNulls - Flag indicating whether to label features with null feature-state values.
 */
  const handleZoom = useCallback(
    (labelZoomLevel, layerId, sourceLayerName, labelNulls) => {
      const mapZoomLevel = map.getZoom();
      if (mapZoomLevel <= labelZoomLevel) {
        if (map.getLayer(`${layerId}-label`)) {
          map.setLayoutProperty(`${layerId}-label`, 'visibility', 'none');
        }
      } else {
        if (!map.getLayer(`${layerId}-label`)) {
          // Query the source features to determine the geometry type
          const features = map.querySourceFeatures(layerId, {
            sourceLayer: sourceLayerName
          });
  
          if (features.length > 0) {
            const geometryType = features[0].geometry.type;
  
            // Determine symbol placement based on geometry type
            let symbolPlacement = 'point'; // Default to point
            if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
              symbolPlacement = 'line';
            }
  
            // Create the layer if it does not exist
            map.addLayer({
              id: `${layerId}-label`,
              type: 'symbol',
              source: layerId,
              'source-layer': sourceLayerName,
              layout: {
                'text-field': ['get', 'name'],
                'text-size': 14,
                'text-anchor': 'center', // Center the text
                'text-offset': [0, 1.5], // No offset
                'text-allow-overlap': false,
                'symbol-placement': symbolPlacement, // Dynamic placement
                'symbol-spacing': 250
              },
              paint: {
                'text-color': '#000000',  // Black text
                'text-halo-color': '#ffffff',  // White halo for readability
                'text-halo-width': 2.5,
                'text-opacity': labelNulls ? 1 : ['case', ["in", ["feature-state", "value"], ["literal", [null]]], 0, 1],
              }
            });
          }
        } else {
          map.setLayoutProperty(`${layerId}-label`, 'visibility', 'visible');
        }
      }
    },
    [map]
  );
  
  

  useEffect(() => {
    if (!map) return;

    Object.keys(state.layers).forEach((layerId) => {
      if (state.layers[layerId].shouldHaveLabel) {
        const layerData = state.layers[layerId];
        const zoomLevel = layerData.labelZoomLevel || 12;
        const sourceLayer = layerData.sourceLayer;
        const labelNulls = layerData.labelNulls;

        const zoomHandler = () => handleZoom(zoomLevel, layerId, sourceLayer, labelNulls);
        map.on('zoomend', zoomHandler);
        if (!listenerCallbackRef.current[layerId]) {
          listenerCallbackRef.current[layerId] = {};
        }
        listenerCallbackRef.current[layerId].zoomHandler = zoomHandler;
      }
      if (state.layers[layerId].isHoverable) {
        const hoverNulls = state.layers[layerId].hoverNulls ?? true
        const layerHover = (e) =>
          handleLayerHover(e, layerId, state.layers[layerId].bufferSize ?? 0, hoverNulls)
        map.on("mousemove", layerHover);
        map.on("mouseleave", layerId, () => handleLayerLeave(layerId));
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "grab";
        });
        if (!listenerCallbackRef.current[layerId]) {
          listenerCallbackRef.current[layerId] = {};
        }
        listenerCallbackRef.current[layerId].layerHoverCallback =
          layerHover;
      }
      if (state.layers[layerId].shouldHaveTooltipOnHover) {
        const hoverNulls = state.layers[layerId].hoverNulls ?? true
        const hoverCallback = (e) =>
          handleLayerHoverTooltip(
            e,
            layerId,
            state.layers[layerId].bufferSize ?? 0,
            hoverNulls
          );
        map.on("mousemove", hoverCallback);
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "grab";
        });
        if (!listenerCallbackRef.current[layerId]) {
          listenerCallbackRef.current[layerId] = {};
        }
        listenerCallbackRef.current[layerId].hoverCallback =
          hoverCallback;
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
        if (popups[layerId]?.length) {
          popups[layerId].forEach((popup) => popup.remove());
          popups[layerId] = [];
        }
        if (
          state.layers[layerId].shouldHaveTooltipOnClick ||
          state.layers[layerId].shouldHaveTooltipOnHover
        ) {
          const { clickCallback, hoverCallback, layerHoverCallback, zoomHandler } =
            listenerCallbackRef.current[layerId];
          map.off("mousemove", hoverCallback);
          map.off("mousemove", layerHoverCallback);
          map.off("click", clickCallback);
          map.off('zoomend', zoomHandler);
        }
        if (state.layers[layerId].isHoverable) {
          map.off("mousemove", layerId, (e) =>
            handleLayerHover(e, layerId, state.layers[layerId].bufferSize ?? 0)
          );
          map.off("mouseleave", layerId, () => handleLayerLeave(layerId));
        }
        if (state.layers[layerId].shouldHaveLabel) {
          const zoomHandler = listenerCallbackRef.current[layerId]?.zoomHandler;
          map.off('zoomend', zoomHandler);
        }
      });
    };
  }, [map, handleLayerHover, handleLayerLeave, state.layers, state.visualisations]);

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
      const mapFilters = state.filters.filter(
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

          let paintProp = {};

          // Here is where we should use the colourSchemeSelectionColour[state.color_scheme]
          // for the circle paintProp, however we currently dont have full functionality.

          if (feature.layer.type == "circle") {
            paintProp = {
              "circle-radius": 6,
              "circle-color": "green",
              "circle-opacity": 0.75,
              "circle-stroke-width": 2,
              "circle-stroke-color": "black",
            };
          } else if (feature.layer.type == "fill") {
            paintProp = {
              "fill-color": "#f00",
              "fill-opacity": 0.5,
            };
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
          filterDispatch({
            type: 'SET_FILTER_VALUE',
            payload: { filterId: filter.id, value },
          });
          filter.actions.map((action) => {
            dispatch({
              type: action.action,
              payload: { filter, value, ...action.payload },
            });
          });
        }
      });
    },
    [isMapReady, map, state.filters, dispatch]
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

  const featureSelectConfig = state.filters.find((filter) => filter.type.startsWith('mapFeatureSelect'));
  useFeatureSelect(map, featureSelectConfig, featureSelectConfig?.defaultMode ?? null);

  useEffect(() => {
    if (isMapReady & state.filters.length > 0) {
      const hasMapFilter = state.filters.some(
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

  // **Apply layer filters**
  useEffect(() => {
    if (!map) return;

    Object.keys(state.layers).forEach((layerId) => {
      if (map.getLayer(layerId)) {
        const featureIdsForLayer = state.visualisedFeatureIds[layerId];
        if (featureIdsForLayer && featureIdsForLayer.length > 0) {
          // Extract the values from featureIdsForLayer
          const featureIdValues = featureIdsForLayer.map(feature => parseInt(feature.value));
        
          // Apply filter to show only features with IDs in featureIdValues
          map.setFilter(layerId, [
            "in",
            ["get", "id"], // Assuming "id" is the property name
            ["literal", featureIdValues],
          ]);
        } else {
          // No filter applied for this layer
          map.setFilter(layerId, null);
        }
      }
    });
  }, [map, state.visualisedFeatureIds]);

  // **Pan and centre map**
  useEffect(() => {
    if (map && state.mapBoundsAndCentroid) {
      const { centroid, bounds } = state.mapBoundsAndCentroid;
      if (bounds) {
        map.fitBounds(bounds.coordinates[0], { padding: 20 });
      }
      if (centroid) {
        map.panTo(centroid.coordinates);
      }
      // Clear the bounds and centroid after panning
      dispatch({ type: actionTypes.CLEAR_BOUNDS_AND_CENTROID });
    }
  }, [map, state.mapBoundsAndCentroid, dispatch]);
  
  return (
    <StyledMapContainer ref={mapContainerRef}>
      {Object.values(state.layers).map((layer) => (
        <Layer key={layer.name} layer={layer} />
      ))}
      {state.visualisations && <VisualisationManager
        visualisationConfigs={state.visualisations}
        map={map}
        maps={null}
      />}
      {isMapReady && <DynamicLegend map={map} />}
    </StyledMapContainer>
  );
};

export default React.memo(Map);
