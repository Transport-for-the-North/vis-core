import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { DynamicLegend } from "Components";
import { useDualMaps, useMapContext, useFilterContext } from "hooks";
import maplibregl from "maplibre-gl";
import { api } from "services";

import {
  getSourceLayer,
  numberWithCommas,
  replacePlaceholders,
} from "utils";
import "./MapLayout.css";
import { VisualisationManager } from "./VisualisationManager";
import { Layer } from './Layer'
import "./MapLayout.css";

const Wrap = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  @media ${props => props.theme.mq.mobile} {
    flex-direction: column;
    height: auto; /* let content dictate height */
  }
`;

const StyledMapContainer = styled.div`
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;

  /* make the map fill the slot */
  .maplibregl-map {
    position: absolute;
    inset: 0;
  }

  @media ${props => props.theme.mq.mobile} {
    width: 100%;
    height: 100%;    /* <-- give it real height so the map isn't 0px tall */

    & .maplibregl-map,
    & .maplibregl-map canvas {
      position: absolute;
      inset: 0;
      width: 100% !important;
      height: 100% !important;
      display: block;
    }
  }
`;

/**
 * DualMaps component that renders two synchronized maps side by side using MapLibre GL and handles layers,
 * including hover and click interactions.
 *
 * @returns {JSX.Element} The rendered DualMaps component.
 */
const DualMaps = (props) => {
  const leftMapContainerRef = useRef(null);
  const rightMapContainerRef = useRef(null);
  const { state, dispatch } = useMapContext();
  const { mapStyle, mapCentre, mapZoom } = state;
  const { leftMap, rightMap, isMapReady } = useDualMaps(
    leftMapContainerRef,
    rightMapContainerRef,
    mapStyle,
    mapCentre,
    mapZoom,
    props.extraCopyrightText
  );
  const { dispatch: filterDispatch } = useFilterContext();

  const maps = { left: leftMap, right: rightMap };
  const popups = { left: null, right: null };
  const listenerCallbackRef = useRef({});
  const hoverIdRef = useRef({ left: {}, right: {} });

  // Refs to manage hover state
  const hoverEventIdRef = useRef(0);
  const hoverInfoRef = useRef({ left: {}, right: {} });
  const prevHoveredFeaturesRef = useRef({ left: [], right: [] });

  /**
   * Handles hover events on the map and displays a popup with information about hovered features.
   * When a feature is hovered on either map, the hover tooltip appears on both maps.
   * The hover tooltip on each map corresponds with the features and their state on that map.
   *
   * @param {Object} e - The event object containing information about the hover event.
   * @param {string} mapType - The side of the map where the hover event occurred ('left' or 'right').
   */
  const handleMapHover = useCallback(
    (e, mapType) => {
      const map = maps[mapType];
      const otherMapType = mapType === "left" ? "right" : "left";
      const otherMap = maps[otherMapType];
      if (!map || !otherMap || !e.point) return;

      // Get layers that have shouldHaveTooltipOnHover set to true and are available on the map
      const hoverableLayers = Object.keys(state.layers).filter(
        (layerId) =>
          state.layers[layerId].shouldHaveTooltipOnHover && map.getLayer(layerId)
      );

      if (hoverableLayers.length === 0) {
        // Clean up if no hoverable layers
        ["left", "right"].forEach((side) => {
          if (hoverInfoRef.current[side]?.popup) {
            hoverInfoRef.current[side].popup.remove();
            hoverInfoRef.current[side].popup = null;
          }
          // Clear hover state for previously hovered features
          prevHoveredFeaturesRef.current[side].forEach(({ source, sourceLayer, featureId }) => {
            maps[side].setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
          });
          prevHoveredFeaturesRef.current[side] = [];
        });
        return;
      }

      // Determine the maximum bufferSize among the layers
      const maxBufferSize = Math.max(
        ...hoverableLayers.map(
          (layerId) => state.layers[layerId].bufferSize ?? 0
        )
      );

      // Get the event's geographical coordinates
      const lngLat = e.lngLat;

      // Project the geographical coordinates to screen coordinates on both maps
      const pointOnLeftMap = maps.left.project(lngLat);
      const pointOnRightMap = maps.right.project(lngLat);

      const bufferedPointLeft = [
        [pointOnLeftMap.x - maxBufferSize, pointOnLeftMap.y - maxBufferSize],
        [pointOnLeftMap.x + maxBufferSize, pointOnLeftMap.y + maxBufferSize],
      ];

      const bufferedPointRight = [
        [pointOnRightMap.x - maxBufferSize, pointOnRightMap.y - maxBufferSize],
        [pointOnRightMap.x + maxBufferSize, pointOnRightMap.y + maxBufferSize],
      ];

      // Query features on both maps at the corresponding points
      const featuresOnLeftMap = maps.left.queryRenderedFeatures(bufferedPointLeft, {
        layers: hoverableLayers,
      });

      const featuresOnRightMap = maps.right.queryRenderedFeatures(bufferedPointRight, {
        layers: hoverableLayers,
      });

      // Prepare hover info for both maps
      const hoverData = {
        left: { features: featuresOnLeftMap, map: maps.left, mapType: 'left' },
        right: { features: featuresOnRightMap, map: maps.right, mapType: 'right' },
      };

      // Process hover data for both maps
      ["left", "right"].forEach((side) => {
        const { features, map } = hoverData[side];

        if (features.length === 0) {
          // No features, cleanup
          if (hoverInfoRef.current[side]?.popup) {
            hoverInfoRef.current[side].popup.remove();
            hoverInfoRef.current[side].popup = null;
          }
          // Clear hover state for previously hovered features
          prevHoveredFeaturesRef.current[side].forEach(({ source, sourceLayer, featureId }) => {
            map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
          });
          prevHoveredFeaturesRef.current[side] = [];
          return;
        }

        // Collect current hovered features for this map side
        const currentHoveredFeatures = features.map((feature) => ({
          layerId: feature.layer.id,
          featureId: feature.id,
          source: feature.layer.source,
          sourceLayer: feature.layer["source-layer"],
        }));

        // Update hover states
        // First, unset hover state for previous features that are no longer hovered
        prevHoveredFeaturesRef.current[side].forEach((prevFeature) => {
          const stillHovered = currentHoveredFeatures.find(
            (currFeature) =>
              currFeature.layerId === prevFeature.layerId &&
              currFeature.featureId === prevFeature.featureId
          );
          if (!stillHovered) {
            map.setFeatureState(
              {
                source: prevFeature.source,
                id: prevFeature.featureId,
                sourceLayer: prevFeature.sourceLayer,
              },
              { hover: false }
            );
          }
        });

        // Then, set hover state for newly hovered features
        currentHoveredFeatures.forEach((currFeature) => {
          const wasHovered = prevHoveredFeaturesRef.current[side].find(
            (prevFeature) =>
              prevFeature.layerId === currFeature.layerId &&
              prevFeature.featureId === currFeature.featureId
          );
          if (!wasHovered) {
            map.setFeatureState(
              {
                source: currFeature.source,
                id: currFeature.featureId,
                sourceLayer: currFeature.sourceLayer,
              },
              { hover: true }
            );
          }
        });

        // Now proceed to update the popup position
        const coordinates = lngLat;

        // Check if the features are the same as before
        const prevHoveredFeatures = prevHoveredFeaturesRef.current[side] || [];

        const isSameFeatures =
          prevHoveredFeatures.length === currentHoveredFeatures.length &&
          prevHoveredFeatures.every((prevFeature, index) => {
            const currFeature = currentHoveredFeatures[index];
            return (
              prevFeature.layerId === currFeature.layerId &&
              prevFeature.featureId === currFeature.featureId
            );
          });

        if (isSameFeatures) {
          // Same features, update popup position
          if (hoverInfoRef.current[side]?.popup) {
            hoverInfoRef.current[side].popup.setLngLat(coordinates);
          }
          // No need to re-fetch data or update descriptions
          return;
        }

        // Update previous hovered features for this side
        prevHoveredFeaturesRef.current[side] = currentHoveredFeatures;

        // Increment hoverEventId
        hoverEventIdRef.current += 1;
        const currentHoverEventId = hoverEventIdRef.current;

        // Remove existing popup if any
        if (hoverInfoRef.current[side]?.popup) {
          hoverInfoRef.current[side].popup.remove();
          hoverInfoRef.current[side].popup = null;
        }

        // Cancel any ongoing API requests
        if (hoverInfoRef.current[side]?.abortController) {
          hoverInfoRef.current[side].abortController.abort();
          hoverInfoRef.current[side].abortController = null;
        }

        // Clear any pending timeout
        if (hoverInfoRef.current[side]?.timeoutId) {
          clearTimeout(hoverInfoRef.current[side].timeoutId);
          hoverInfoRef.current[side].timeoutId = null;
        }

        let descriptions = [];
        const apiRequests = [];

        // Process each feature for immediate tooltip or API-based tooltip
        features.forEach((feature) => {
          const layerId = feature.layer.id;
          const layerConfig = state.layers[layerId];
          const customTooltip = layerConfig?.customTooltip;
          const hoverNulls = layerConfig.hoverNulls ?? true;
          // Check if additional metadata should be appended
          const shouldIncludeMetadata = layerConfig?.hoverTipShouldIncludeMetadata;

          const featureValue = feature.state.value;
          if (!hoverNulls && (featureValue === null || featureValue === undefined)) {
            return; // Skip this feature
          }

          const featureName = feature.properties.name || "";
          const featureValueDisplay =
            featureValue !== undefined && featureValue !== null
              ? numberWithCommas(featureValue)
              : "";
          const layerVisualisationName = state.layers[layerId]?.visualisationName;
          const legendText =
            state.visualisations[layerVisualisationName]?.legendText?.[0]?.legendSubtitleText ?? "";

          let description = "";

          if (!customTooltip) {
            // Immediate data tooltip
            if (featureName && featureValue !== undefined && featureValue !== null) {
              description = `
                    <div class="popup-content">
                      <p class="feature-name">${featureName}</p>
                      <hr class="divider">
                      <div class="metadata-item">
                        <span class="metadata-key">Value:</span>
                        <span class="metadata-value">${featureValueDisplay} ${legendText}</span>
                      </div>
                    </div>`;
            } else if (featureName) {
              description = `
                <div class="popup-content">
                  <p class="feature-name">${featureName}</p>
                </div>`;
            }

            // Inject additional metadata if enabled
            if (description && shouldIncludeMetadata) {
              const metadataKeys = Object.keys(feature.properties).filter(
                (key) => !["id", "name", "value"].includes(key)
              );
              if (metadataKeys.length > 0) {
                let metadataDescription = '<div class="metadata-section">';
                metadataKeys.forEach((key) => {
                  metadataDescription += `
                    <div class="metadata-item">
                      <span class="metadata-key">${key}:</span>
                      <span class="metadata-value">${feature.properties[key]}</span>
                    </div>`;
                });
                metadataDescription += '</div>';
            
                // Get the index of the last closing </div> to ensure we are appending the metadata inside .popup-content
                const lastDivIndex = description.lastIndexOf("</div>");
                if (lastDivIndex !== -1) {
                  description = description.slice(0, lastDivIndex) + metadataDescription + description.slice(lastDivIndex);
                }
              }
            }

            if (description) {
              descriptions.push(description);
            }
          } else {
            // Custom tooltip requiring API call – add a placeholder
            description = `
                <div class="popup-content">
                  <p class="feature-name">${featureName}</p>
                  <p>Loading data...</p>
                </div>`;
            descriptions.push(description);

            // Prepare the API request
            apiRequests.push({ feature, layerId, featureName });
          }
        });

        // Show the popup with the initial descriptions
        if (descriptions.length > 0) {
          const aggregatedHtml = descriptions.join('<hr class="thick-divider">');
          const popup = new maplibregl.Popup({
            className: "custom-popup",
            closeButton: false,
            closeOnClick: false,
          })
            .setLngLat(coordinates)
            .setHTML(aggregatedHtml)
            .addTo(map);
          hoverInfoRef.current[side] = { popup };
        } else {
          // No descriptions, do not show popup
          return;
        }

        if (apiRequests.length > 0) {
          // Delay the API calls
          const fetchData = () => {
            const controller = new AbortController();
            hoverInfoRef.current[side].abortController = controller;

            const fetchPromises = apiRequests.map(
              ({ feature, layerId, featureName }) => {
                const layerConfig = state.layers[layerId];
                const customTooltip = layerConfig?.customTooltip;
                const { url, htmlTemplate, customFormattingFunctions } = customTooltip;
                const featureId = feature.id;
                const requestUrl = url.replace("{id}", featureId);

                return api.baseService
                  .get(requestUrl, { signal: controller.signal })
                  .then((responseData) => {
                    const tooltipHtml = replacePlaceholders(
                      htmlTemplate,
                      responseData,
                      { customFunctions: customFormattingFunctions }
                    )
                    return tooltipHtml;
                  })
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error("Failed to fetch tooltip data:", error);
                    }
                    // Return a placeholder tooltip HTML on error
                    return `
                          <div class="popup-content">
                            <p class="feature-name">${featureName}</p>
                            <p>Data unavailable.</p>
                          </div>`;
                  });
              }
            );

            Promise.all(fetchPromises).then((results) => {
              if (
                hoverEventIdRef.current === currentHoverEventId &&
                hoverInfoRef.current[side]?.popup
              ) {
                // Update popup content by combining any existing non-loading descriptions with the fetched results
                const existingDescriptions = descriptions.filter(
                  (desc) => !desc.includes("Loading data...")
                );
                const newDescriptions = existingDescriptions.concat(results);
                const aggregatedHtml = newDescriptions.join(
                  '<hr class="thick-divider">'
                );
                hoverInfoRef.current[side].popup.setHTML(aggregatedHtml);
              }
            });
          };

          const timeoutId = setTimeout(fetchData, 100);
          hoverInfoRef.current[side].timeoutId = timeoutId;
        }
      });
    },
    [maps, state.layers, state.visualisations]
  );


  /**
   * Handles click events on a layer and displays a popup with information about the clicked feature.
   * @property {Object} e - The event object containing information about the click event.
   * @property {string} layerId - The ID of the layer being clicked.
   * @property {number} bufferSize - The size of the buffer around the click point for querying features.
   */
  const handleLayerClick = (e, layerId, bufferSize) => {
    ["left", "right"].forEach((side) => {
      const map = maps[side];

      if (popups[side]?.[layerId]?.length) {
        popups[side][layerId].forEach((popup) => popup.remove());
        popups[side][layerId] = [];
      }

      const pointOnMap = map.project(e.lngLat);

      const bufferedPoint = [
        [pointOnMap.x - bufferSize, pointOnMap.y - bufferSize],
        [pointOnMap.x + bufferSize, pointOnMap.y + bufferSize],
      ];

      const features = map.queryRenderedFeatures(bufferedPoint, {
        layers: [layerId],
      });

      if (features.length !== 0) {
        const coordinates = e.lngLat;
        const description = `<p>${
          features[0].properties.name ?? ""
        }</p><p> Id: ${features[0].properties.id}</p><p>Value: ${
          features[0].state.value ?? 0
        }</p>`;
        const newPopup = new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
        if (!popups[side]) {
          popups[side] = {};
        }
        if (!popups[side][layerId]) {
          popups[side][layerId] = [];
        }
        popups[side][layerId].push(newPopup);
      }
    });
  };

  /**
   * Handles mouse leave events for a specific layer by clearing the hover state.
   *
   * @property {string} layerId - The ID of the layer from which the mouse has left.
   * @property {string} mapType - The side of the map ('left' or 'right').
   */
  const handleLayerLeave = useCallback(
    (layerId, mapType) => {
      if (!maps.left || !maps.right) return;
      ["left", "right"].forEach((side) => {
        const map = maps[side];
        const hoverId = hoverIdRef.current[side][layerId];

        if (map.getLayer(`${layerId}-hover`) && hoverId) {
          const sourceLayer = getSourceLayer(map, layerId);
          map.setFeatureState(
            { source: layerId, id: hoverId, sourceLayer },
            { hover: false }
          );
        }
      });
    },
    [maps]
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
      ["left", "right"].forEach((side) => {
        const map = maps[side];
        const mapZoomLevel = map.getZoom();

        dispatch({
          type: "STORE_CURRENT_ZOOM",
          payload: mapZoomLevel,
        });

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
              const geometryType = features[0].geometry.type
              
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
      });
    },
    [maps]
  );

  useEffect(() => {
    if (!maps.left || !maps.right) return;

    Object.keys(state.layers).forEach((layerId) => {
      ["left", "right"].forEach((side) => {
        const map = maps[side];
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
        if (state.layers[layerId].shouldHaveTooltipOnHover) {
          const hoverCallback = (e) => handleMapHover(e, side);
          map.on("mousemove", hoverCallback);
          map.on("mouseleave", layerId, () => handleLayerLeave(layerId, side));
          map.on("mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "grab";
          });
          if (!listenerCallbackRef.current[layerId]) {
            listenerCallbackRef.current[layerId] = {};
          }
          listenerCallbackRef.current[layerId].hoverCallback = hoverCallback;
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
        ["left", "right"].forEach((side) => {
          const map = maps[side];
          if (state.layers[layerId].shouldHaveTooltipOnClick) {
            const { clickCallback, hoverCallback, zoomHandler } =
              listenerCallbackRef.current[layerId];
            map.off("click", clickCallback);
            map.off("mousemove", hoverCallback);
            map.off('zoomend', zoomHandler);
          }
          if (state.layers[layerId].shouldHaveLabel) {
            const zoomHandler = listenerCallbackRef.current[layerId]?.zoomHandler;
            map.off('zoomend', zoomHandler);
          }
        });
      });
    };
  }, [maps, handleLayerLeave, state.layers, state.visualisations]);

  /**
   * Handles map click events and dispatches actions based on the clicked feature.
   *
   * @property {Object} event - The event object containing information about the click event.
   */
  const handleMapClick = useCallback(
    (event) => {
      if (!isMapReady || (!maps.left && !maps.right)) return;

      const point = event.point;

      // Get all map filters
      const mapFilters = state.filters.filter(
        (filter) => filter.type === "map"
      );

      // For each map filter, check if the clicked point has a feature from the layer
      mapFilters.forEach((filter) => {
        ["left", "right"].forEach((side) => {
          const map = maps[side];
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
                payload: { filter, value, sides: "both" },
              });
            });
          }
        });
      });
    },
    [isMapReady, maps, state.filters, dispatch]
  );

  // Run once to set the state of the map
  useEffect(() => {
    if (isMapReady) {
      dispatch({
        type: "SET_MAP",
        payload: { map: maps.left },
      });
      dispatch({
        type: "SET_DUAL_MAPS",
        payload: { maps: [maps.left, maps.right] },
      });
    }
  }, [isMapReady]);

  useEffect(() => {
    if (isMapReady & (state.filters.length > 0)) {
      const hasMapFilter = state.filters.some(
        (filter) => filter.type === "map"
      );
      if (hasMapFilter) {
        ["left", "right"].forEach((side) => {
          maps[side].on("click", handleMapClick);
        });
      }
    }

    return () => {
      if (maps.left && maps.right) {
        ["left", "right"].forEach((side) => {
          maps[side].off("click", handleMapClick);
        });
      }
    };
  }, [isMapReady, maps, handleMapClick]);

  useEffect(() => {
  if (!leftMap || !rightMap) return;

  const roLeft = new ResizeObserver(() => leftMap.resize());
  const roRight = new ResizeObserver(() => rightMap.resize());

  if (leftMapContainerRef.current) roLeft.observe(leftMapContainerRef.current);
  if (rightMapContainerRef.current) roRight.observe(rightMapContainerRef.current);

  // Also force a resize when the media query flips
  const mq = window.matchMedia('(max-width: 900px)');
  const onChange = () => {
    leftMap.resize();
    rightMap.resize();
  };
  mq.addEventListener('change', onChange);

  return () => {
    roLeft.disconnect();
    roRight.disconnect();
    mq.removeEventListener('change', onChange);
  };
}, [leftMap, rightMap]);

  return (
    <Wrap>
      <StyledMapContainer ref={leftMapContainerRef}>
        {Object.values(state.layers).map((layer) => (
          <Layer key={layer.name} layer={layer} />
        ))}
        {state.leftVisualisations && <VisualisationManager
            visualisationConfigs={state.leftVisualisations}
            map={maps.left}
            left={true}
          />}
      </StyledMapContainer>
      <StyledMapContainer ref={rightMapContainerRef}>
        {Object.values(state.layers).map((layer) => (
          <Layer key={layer.name} layer={layer} />
        ))}
        {state.rightVisualisations && <VisualisationManager
          visualisationConfigs={state.rightVisualisations}
          map={maps.right}
          left={false}
        />}
        {isMapReady &&
          (state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]
            .data.length === 0 &&
          state.rightVisualisations[Object.keys(state.rightVisualisations)[0]]
            .data.length !== 0 ? (
            <DynamicLegend map={maps.right} />
          ) : state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]
              .data.length !== 0 &&
            state.rightVisualisations[Object.keys(state.rightVisualisations)[0]]
              .data.length === 0 ? (
            <DynamicLegend map={maps.left} />
          ) : (
            <DynamicLegend map={maps.right} />
          ))}
      </StyledMapContainer>
    </Wrap>
  );
};

export default React.memo(DualMaps);
