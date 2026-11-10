import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { DynamicLegend } from "Components/DynamicLegend/DynamicLegend";
import { useDualMaps } from "hooks/useDualMaps";
import { useMapContext } from "hooks/useMapContext";
import { useFilterContext } from "hooks/useFilterContext";
import maplibregl from "maplibre-gl";
import { actionTypes } from "reducers";
import { api } from "services";

import { useBaseMapTransition } from "hooks/useBaseMapTransition";
import { getBaseMap } from "../../map/baseMaps";
import {
  getSourceLayer,
  isFeatureHoverable,
  isLayerVisibleOnMap,
  isLayerZeroedBySlider,
  numberWithCommas,
  replacePlaceholders,
  buildDefaultTooltip,
  buildLoadingTooltip,
  buildErrorTooltip,
  buildLoadingSection,
  insertCustomIntoDefault,
  resolveTooltipRequestUrl,
  resolveVisualisationUnit,
} from "utils";
import "./MapLayout.css";
import { VisualisationManager } from "./VisualisationManager";
import { Layer } from './Layer'
import MapStyleToggle from "./MapStyleToggle";

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

const SIDES = ["left", "right"];

const SELECTED_FEATURE_LAYER = "selected-feature-layer";
const SELECTED_FEATURE_SOURCE = "selected-feature-source";

/**
 * Replaces the selection highlight on a map with the given feature, or just removes it when
 * there is no feature.
 *
 * A feature with an id is selected through feature state, which the layer's own `-select` layer
 * draws (as Map.jsx does). That draws the whole feature, not the tile-clipped piece, and is cheap:
 * adding a layer on an existing vector source would make MapLibre reload every tile of it.
 * Features without an id fall back to a GeoJSON copy in a temporary layer.
 *
 * @param {maplibregl.Map} map - The map to update.
 * @param {Object|null} feature - The rendered feature to highlight, or null to clear.
 * @param {Object|null} previous - The feature-state target this returned last time, if any.
 * @returns {Object|null} The feature-state target now selected, to pass back as `previous`.
 */
const highlightSelectedFeature = (map, feature, previous) => {
  if (previous && map.getSource(previous.source)) {
    map.setFeatureState(previous, { selected: false });
  }
  if (map.getLayer(SELECTED_FEATURE_LAYER)) {
    map.removeLayer(SELECTED_FEATURE_LAYER);
  }
  if (map.getSource(SELECTED_FEATURE_SOURCE)) {
    map.removeSource(SELECTED_FEATURE_SOURCE);
  }
  if (!feature) return null;

  if (feature.id != null && feature.layer.source) {
    const target = {
      source: feature.layer.source,
      ...(feature.layer["source-layer"] && { sourceLayer: feature.layer["source-layer"] }),
      id: feature.id,
    };
    map.setFeatureState(target, { selected: true });
    return target;
  }

  // Here is where we should use the colourSchemeSelectionColour[state.color_scheme]
  // for the circle paintProp, however we currently dont have full functionality.
  let paintProp = {};
  if (feature.layer.type === "circle") {
    paintProp = {
      "circle-radius": 6,
      "circle-color": "green",
      "circle-opacity": 0.75,
      "circle-stroke-width": 2,
      "circle-stroke-color": "black",
    };
  } else if (feature.layer.type === "fill") {
    paintProp = {
      "fill-color": "#f00",
      "fill-opacity": 0.5,
    };
  }

  map.addSource(SELECTED_FEATURE_SOURCE, {
    type: "geojson",
    data: feature.toJSON(),
  });
  map.addLayer({
    id: SELECTED_FEATURE_LAYER,
    type: feature.layer.type,
    source: SELECTED_FEATURE_SOURCE,
    paint: paintProp,
  });
  return null;
};

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
  const { baseMapId, mapStyle, mapCentre, mapZoom } = state;
  const currentBaseMap = getBaseMap(baseMapId);
  const { leftMap, rightMap, isMapReady } = useDualMaps(
    leftMapContainerRef,
    rightMapContainerRef,
    mapStyle,
    mapCentre,
    mapZoom,
    props.extraCopyrightText
  );

  const activeMaps = React.useMemo(
    () => [leftMap, rightMap].filter(Boolean),
    [leftMap, rightMap]
  );

  // Shared transition coordinator: same hook as Map.jsx, just with two maps.
  useBaseMapTransition({
    maps: activeMaps,
    descriptor: currentBaseMap,
    applicationLayers: state.layers,
  });

  const { dispatch: filterDispatch } = useFilterContext();

  // Memoised so the callbacks and effects that depend on it don't re-run on every render.
  const maps = React.useMemo(() => ({ left: leftMap, right: rightMap }), [leftMap, rightMap]);
  const popups = { left: null, right: null };
  const hoverIdRef = useRef({ left: {}, right: {} });

  // Refs to manage hover state
  const hoverEventIdRef = useRef(0);
  const hoverInfoRef = useRef({ left: {}, right: {} });
  const prevHoveredFeaturesRef = useRef({ left: [], right: [] });
  // Feature-state target of each side's clicked feature, so the next click can unselect it.
  const selectedFeatureRef = useRef({ left: null, right: null });

  /**
   * Generates HTML for metadata section of tooltips
   * @param {Object} properties - Feature properties object
   * @returns {string} HTML string for metadata section
   */
  const generateMetadataHtml = useCallback((properties) => {
    const metadataKeys = Object.keys(properties).filter(
      (key) => !["id", "name", "value"].includes(key)
    );
    if (metadataKeys.length === 0) {
      return "";
    }
    
    let metadataDescription = '<div class="metadata-section">';
    metadataKeys.forEach((key) => {
      metadataDescription += `
        <div class="metadata-item">
          <span class="metadata-key">${key}:</span>
          <span class="metadata-value">${properties[key]}</span>
        </div>`;
    });
    metadataDescription += '</div>';
    return metadataDescription;
  }, []);

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

      // Get layers that have shouldHaveTooltipOnHover set to true and are visible on the map.
      const hoverableLayers = Object.keys(state.layers).filter(
        (layerId) =>
          state.layers[layerId].shouldHaveTooltipOnHover && isLayerVisibleOnMap(map, layerId)
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
      const BUFFER_FLOOR = 3; // Minimum buffer size in pixels
      
      // Calculate buffer with line width offset to extend from line edge
      const maxBufferSize = Math.max(
        BUFFER_FLOOR,
        ...hoverableLayers.map(
          (layerId) => {
            const layer = state.layers[layerId];
            const baseBuffer = layer.bufferSize ?? 0;
            
            // For line layers, add half the line width to buffer so it extends from edge
            if (layer.geometryType === 'line' && layer.mapLayer?.paint?.['line-width']) {
              const lineWidth = layer.mapLayer.paint['line-width'];
              // Handle both constant and expression-based line widths
              const width = typeof lineWidth === 'number' ? lineWidth : 7.5; // Use max default if expression
              return baseBuffer + (width / 2);
            }
            
            return baseBuffer;
          }
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

        // Filter out layers set to 0 with the slider, and no-data features that are invisible
        // or that the layer opts out of hovering
        const filteredFeatures = features.filter(
          (feature) =>
            !isLayerZeroedBySlider(map, feature.layer.id) &&
            isFeatureHoverable(map, feature, state.layers[feature.layer.id])
        );

        // If after filtering we have no features, cleanup and return
        if (filteredFeatures.length === 0) {
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

        const selectedFeatures = [filteredFeatures[0]];

        // Collect current hovered features for this map side (using filtered features)
        const currentHoveredFeatures = selectedFeatures.map((feature) => ({
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
  const requestIndexByDescriptionIndex = {};

        // Process each feature for immediate tooltip or API-based tooltip (using filtered features)
        selectedFeatures.forEach((feature) => {
          const layerId = feature.layer.id;
          const layerConfig = state.layers[layerId];
          const customTooltip = layerConfig?.customTooltip;
          // Check if additional metadata should be appended
          const shouldIncludeMetadata = layerConfig?.hoverTipShouldIncludeMetadata;

          const featureValue = feature.state.value;

          const featureName = feature.properties.name || "";
          const featureValueDisplay =
            featureValue !== undefined && featureValue !== null
              ? numberWithCommas(featureValue)
              : "";
          const layerVisualisationName = state.layers[layerId]?.visualisationName;
          const layerVisualisation = state.visualisations[layerVisualisationName];
          const baseUnitText =
            layerConfig.defaultTooltipUnitName ??
            layerVisualisation?.legendText?.[0]?.legendSubtitleText ?? "";
          const unitText = resolveVisualisationUnit(layerVisualisation, baseUnitText);
          const valueText =
            layerConfig.defaultTooltipValueName ??
            state.visualisations[layerVisualisationName]?.legendText?.[0]?.displayValue ?? "Value";
          const identifierLabel = layerConfig?.defaultTooltipIdentifierLabel || "";

          let description = "";

          if (!customTooltip) {
            // Immediate data tooltip
            description = buildDefaultTooltip({
              featureName,
              featureValueDisplay,
              unitText,
              valueText,
              identifierLabel
            });

            // Inject additional metadata if enabled
            if (description && shouldIncludeMetadata) {
              const metadataDescription = generateMetadataHtml(feature.properties);
              if (metadataDescription) {
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
            // Custom tooltip present; check if we should join with default tooltip
            const joinToDefault = !!customTooltip.joinToDefaultTooltip;

            if (joinToDefault) {
              // Build default description first
              const customValueText = customTooltip.defaultValueName || valueText;

              description = buildDefaultTooltip({
                featureName,
                featureValueDisplay,
                unitText,
                valueText: customValueText,
                identifierLabel
              });

              // Inject additional metadata if enabled
              if (description && shouldIncludeMetadata) {
                const metadataDescription = generateMetadataHtml(feature.properties);
                if (metadataDescription) {
                  const lastDivIndex = description.lastIndexOf("</div>");
                  if (lastDivIndex !== -1) {
                    description = description.slice(0, lastDivIndex) + metadataDescription + description.slice(lastDivIndex);
                  }
                }
              }

              // Insert loading section in the middle (between title and value) to show that custom data is being loaded
              if (description) {
                description = insertCustomIntoDefault(description, buildLoadingSection());
              }

              const descIndex = descriptions.length;
              descriptions.push(description || "");
              const requestIndex = apiRequests.length;
              apiRequests.push({ feature, layerId, featureName, joinToDefault: true });
              requestIndexByDescriptionIndex[descIndex] = requestIndex;
            } else {
              // Placeholder which will be replaced by custom HTML later
              description = buildLoadingTooltip(featureName);
              const descIndex = descriptions.length;
              descriptions.push(description);
              const requestIndex = apiRequests.length;
              apiRequests.push({ feature, layerId, featureName, joinToDefault: false });
              requestIndexByDescriptionIndex[descIndex] = requestIndex;
            }
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
          
          // Store initial popup for later height calculation
          hoverInfoRef.current[side].initialPopup = popup;
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
              ({ feature, layerId, featureName, joinToDefault }) => {
                const layerConfig = state.layers[layerId];
                const customTooltip = layerConfig?.customTooltip;
                const { htmlTemplate, customFormattingFunctions } = customTooltip;
                const featureId = feature.id;
                const requestUrlResolved = resolveTooltipRequestUrl(customTooltip, featureId);
                const showAllDataInTooltip = layerConfig?.showAllDataInTooltipForEachGeom;

                return api.baseService
                  .get(requestUrlResolved, { signal: controller.signal })
                  .then((responseData) => {
                    // Check if we should show all data and we have an array of records
                    if (showAllDataInTooltip && Array.isArray(responseData) && responseData.length > 0) {
                      // Reverse the array so most recently painted features appear first
                      const reversedData = [...responseData].reverse();
                      
                      // Only show the first tooltip
                      const firstTooltipHtml = replacePlaceholders(
                        htmlTemplate,
                        reversedData[0],
                        { customFunctions: customFormattingFunctions }
                      );
                      
                      // Add indicator if there are more records than displayed
                      if (reversedData.length > 1) {
                        return `${firstTooltipHtml}<hr class="thick-divider"><div class="more-records-indicator">... and ${reversedData.length - 1} more record(s)</div>`;
                      }
                      
                      return firstTooltipHtml;
                    } else {
                      // Single item or showAllDataInTooltip is false - use original logic
                      const dataToUse = Array.isArray(responseData) ? responseData[0] : responseData;
                      const tooltipHtml = replacePlaceholders(
                        htmlTemplate,
                        dataToUse,
                        { customFunctions: customFormattingFunctions }
                      );
                      return tooltipHtml;
                    }
                  })
                  .catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error("Failed to fetch tooltip data:", error);
                    }
                    // Return placeholder - for joinToDefault, return plain text to be inserted
                    if (joinToDefault) {
                      return "<p>Data unavailable.</p>";
                    } else {
                      return buildErrorTooltip(featureName);
                    }
                  });
              }
            );

            Promise.all(fetchPromises).then((results) => {
              if (
                hoverEventIdRef.current === currentHoverEventId &&
                hoverInfoRef.current[side]?.popup
              ) {
                // Merge results into the appropriate positions
                const combinedDescriptions = [];
                for (let i = 0; i < descriptions.length; i++) {
                  const requestIdx = requestIndexByDescriptionIndex[i];
                  if (requestIdx === undefined) {
                    combinedDescriptions.push(descriptions[i]);
                  } else {
                    const req = apiRequests[requestIdx];
                    const resultHtml = results[requestIdx];
                    if (req.joinToDefault) {
                      const base = descriptions[i] || "";
                      combinedDescriptions.push(insertCustomIntoDefault(base, resultHtml));
                    } else {
                      combinedDescriptions.push(resultHtml);
                    }
                  }
                }
                const aggregatedHtml = combinedDescriptions.join('<hr class="thick-divider">');
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
        // Labels must never show while their parent layer is hidden
        const parentHidden =
          !!map.getLayer(layerId) && map.getLayoutProperty(layerId, 'visibility') === 'none';

        if (mapZoomLevel <= labelZoomLevel || parentHidden) {
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

  // Hover: one mousemove listener per map, registered once, calling the latest handleMapHover
  // through a ref and coalescing moves to one per animation frame. handleMapHover works out the
  // hoverable layers itself, so it doesn't need a listener per layer, nor re-registering whenever
  // the layers or visualisations change.
  const handleMapHoverRef = useRef(handleMapHover);
  handleMapHoverRef.current = handleMapHover;

  useEffect(() => {
    if (!leftMap || !rightMap) return;

    const registrations = [];
    [["left", leftMap], ["right", rightMap]].forEach(([side, map]) => {
      let frameId = null;
      let lastEvent = null;
      const onMouseMove = (e) => {
        lastEvent = e;
        if (frameId !== null) return;
        frameId = requestAnimationFrame(() => {
          frameId = null;
          handleMapHoverRef.current(lastEvent, side);
        });
      };
      // A hover pass still pending when the mouse leaves would re-hover a feature after leaving.
      const cancelPendingHover = () => {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
      };
      map.on("mousemove", onMouseMove);
      map.on("mouseout", cancelPendingHover);
      registrations.push(() => {
        map.off("mousemove", onMouseMove);
        map.off("mouseout", cancelPendingHover);
        cancelPendingHover();
      });
    });

    return () => registrations.forEach((unregister) => unregister());
  }, [leftMap, rightMap]);

  useEffect(() => {
    if (!maps.left || !maps.right) return;

    // Everything registered here is recorded so the cleanup removes exactly that.
    const registrations = [];
    const listen = (map, ...args) => {
      map.on(...args);
      registrations.push(() => map.off(...args));
    };

    Object.keys(state.layers).forEach((layerId) => {
      const layerData = state.layers[layerId];
      ["left", "right"].forEach((side) => {
        const map = maps[side];
        if (layerData.shouldHaveLabel) {
          const zoomLevel = layerData.labelZoomLevel || 12;
          const zoomHandler = () =>
            handleZoom(zoomLevel, layerId, layerData.sourceLayer, layerData.labelNulls);
          listen(map, "zoomend", zoomHandler);
        }
        if (layerData.shouldHaveTooltipOnHover || layerData.shouldHaveTooltipOnClick) {
          listen(map, "mouseenter", layerId, () => {
            map.getCanvas().style.cursor = "pointer";
          });
          listen(map, "mouseleave", layerId, () => {
            map.getCanvas().style.cursor = "grab";
          });
        }
        if (layerData.shouldHaveTooltipOnHover) {
          listen(map, "mouseleave", layerId, () => handleLayerLeave(layerId, side));
        }
        if (layerData.shouldHaveTooltipOnClick) {
          const bufferSize = layerData.bufferSize ?? 0;
          listen(map, "click", (e) => handleLayerClick(e, layerId, bufferSize));
        }
      });
    });

    return () => registrations.forEach((unregister) => unregister());
  }, [maps, handleLayerLeave, handleZoom, state.layers, state.visualisations]);

  /**
   * Handles map click events for `type: "map"` filters.
   *
   * Each side takes the feature under the clicked point on its own map, so the two sides can use
   * different layers' features (e.g. different zoning systems) and each fetches its own data.
   * A side with no feature under the point is cleared: its selection highlight is removed and its
   * param is set to null. A click with no feature on either side is ignored.
   *
   * @property {Object} event - The event object containing information about the click event.
   */
  const handleMapClick = useCallback(
    (event) => {
      if (!isMapReady || !maps.left || !maps.right) return;

      const point = event.point;
      const clickedSide = event.target === maps.right ? "right" : "left";

      // Get all map filters
      const mapFilters = state.filters.filter(
        (filter) => filter.type === "map"
      );

      mapFilters.forEach((filter) => {
        const featureBySide = {};
        SIDES.forEach((side) => {
          featureBySide[side] =
            maps[side].queryRenderedFeatures(point, { layers: [filter.layer] })[0] ?? null;
        });

        if (!featureBySide.left && !featureBySide.right) return;

        const valueBySide = {};
        SIDES.forEach((side) => {
          const map = maps[side];
          const feature = featureBySide[side];
          const value = feature ? feature.properties[filter.field] : null;
          valueBySide[side] = value;

          selectedFeatureRef.current[side] = highlightSelectedFeature(
            map,
            feature,
            selectedFeatureRef.current[side]
          );

          filter.actions.forEach((action) => {
            dispatch({
              type: action.action,
              payload: { filter, value, sides: side },
            });
          });
        });

        // The filter holds one value, so show the clicked side's (or the other side's if the
        // clicked side had none).
        filterDispatch({
          type: 'SET_FILTER_VALUE',
          payload: {
            filterId: filter.id,
            value: valueBySide[clickedSide] ?? valueBySide[clickedSide === "left" ? "right" : "left"],
          },
        });
      });
    },
    [isMapReady, maps, state.filters, dispatch, filterDispatch]
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

  // **Pan and centre** on a feature chosen by a select-and-pan filter, as Map.jsx does.
  // Only the left map is moved; the right map follows it through syncMaps.
  useEffect(() => {
    if (!leftMap || !state.mapBoundsAndCentroid) return;
    const { centroid, bounds, layerMetadata = {} } = state.mapBoundsAndCentroid;

    if (bounds && centroid) {
      const coords = bounds.coordinates[0];
      const lngs = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const maxDiff = Math.max(maxLng - minLng, maxLat - minLat);

      leftMap.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
        padding: maxDiff < 0.01 ? 150 : maxDiff < 0.05 ? 120 : 100,
        maxZoom: layerMetadata.zoomToFeatureMaxZoom ?? 14,
        duration: layerMetadata.zoomToFeatureDuration ?? 1000,
        linear: layerMetadata.zoomToFeatureLinear ?? false,
      });
    } else if (centroid) {
      leftMap.panTo(centroid.coordinates, {
        duration: layerMetadata.zoomToFeatureDuration ?? 1000,
      });
    }

    dispatch({ type: "CLEAR_BOUNDS_AND_CENTROID" });
  }, [leftMap, state.mapBoundsAndCentroid, dispatch]);

  useEffect(() => {
  if (!leftMap || !rightMap) return;

  const isNarrowViewport = window.matchMedia('(max-width: 900px)').matches;
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(any-pointer: coarse)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches ||
    window.matchMedia('(any-pointer: fine)').matches;
  const isTouchOnlyMobile = isNarrowViewport && hasCoarsePointer && !hasFinePointer;

  if (isTouchOnlyMobile) {
    [leftMap, rightMap].forEach(m => {
      m.dragPan.enable();
      m.touchZoomRotate.enable();
      m.touchZoomRotate.disableRotation();
      m.scrollZoom.disable();
      m.doubleClickZoom.disable();
      m.boxZoom.disable();
      m.keyboard.disable();
    });
   }

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
        {Object.values(state.layers).map((layer, index) => (
          <Layer key={layer.name || layer.id || index} layer={layer} />
        ))}
        {state.leftVisualisations && <VisualisationManager
            visualisationConfigs={state.leftVisualisations}
            map={maps.left}
            left={true}
          />}
      </StyledMapContainer>
      <StyledMapContainer ref={rightMapContainerRef}>
        {props.showMapStyleToggle && <MapStyleToggle map={rightMap} />}
        {Object.values(state.layers).map((layer, index) => (
          <Layer key={layer.name || layer.id || index} layer={layer} />
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
