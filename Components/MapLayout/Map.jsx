import "maplibre-gl/dist/maplibre-gl.css";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { DynamicLegend } from "Components";
import { useMap, useMapContext, useFilterContext } from "hooks";
import { actionTypes } from "reducers";
import { api } from "services";
import maplibregl from "maplibre-gl";
import { VisualisationManager } from "./VisualisationManager";
import { Layer } from "./Layer";
import {
  getSourceLayer,
  numberWithCommas,
  replacePlaceholders,
  buildDefaultTooltip,
  buildLoadingTooltip,
  buildErrorTooltip,
  buildLoadingSection,
  insertCustomIntoDefault,
  resolveTooltipRequestUrl,
} from "utils";
import "./MapLayout.css";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { RectangleMode } from "@ookla/mapbox-gl-draw-rectangle";
import { uniq } from "lodash";

const StyledMapContainer = styled.div`
  width: 100%;
  height: calc(100vh - 75px);
  @media ${props => props.theme.mq.mobile} {
   height: auto;             /* let content dictate height */
  }
`;

/**
 * Map component that renders a map using MapLibre GL and handles layers,
 * including hover and click interactions.
 *
 * @returns {JSX.Element} The rendered Map component.
 */
const Map = (props) => {
  const mapContainerRef = useRef(null);
  const { state, dispatch } = useMapContext();
  const { mapStyle, mapCentre, mapZoom } = state;
  const { map, isMapReady } = useMap(mapContainerRef, mapStyle, mapCentre, mapZoom, props.extraCopyrightText);
  const { dispatch: filterDispatch } = useFilterContext();
  const popups = {};
  const listenerCallbackRef = useRef({});
  const hoverIdRef = useRef({});
  const sidebarIsOpen = props.sidebarIsOpen
  
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
  
  // Refs to manage hover state
  const hoverEventIdRef = useRef(0);
  const hoverInfoRef = useRef({});
  const prevHoveredFeaturesRef = useRef([]);
  
  // Keep track of previously selected features per layer
  const prevSelectedFeatures = useRef({});

  const memoizedFilters = useMemo(() => state.filters, [state.filters]);

  const lastTouchTimeRef = useRef(0);

  // Single feature picker for map clicks
  const pickFeatureAtPoint = useCallback(
    (point) => {
      if (!map) return null;

      const filterLayers = memoizedFilters
        .filter((f) => f.type === "map")
        .map((f) => f.layer)
        .filter((id) => map.getLayer(id));

      if (filterLayers.length) {
        const hits = map.queryRenderedFeatures(point, { layers: filterLayers });
        if (hits.length) return hits[0]; // top-most feature on a filter layer
      }

      const otherLayers = Object.keys(state.layers).filter(
        (id) =>
          (state.layers[id].shouldHaveTooltipOnClick ||
            state.layers[id].shouldHaveTooltipOnHover) &&
          map.getLayer(id)
      );
      if (otherLayers.length) {
        const hits = map.queryRenderedFeatures(point, { layers: otherLayers });
        if (hits.length) return hits[0];
      }

      return null;
    },
    [map, memoizedFilters, state.layers]
  );

  // **Draw control logic
  useEffect(() => {
    if (!map) return ;

    const drawInstance = new MapboxDraw({
      displayControlsDefault: false,
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: RectangleMode,
      },
      controls: {},
      styles: [
        {
          id: "gl-draw-polygon-fill-inactive",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          paint: {
            "fill-color": "#007bff",
            "fill-outline-color": "#007bff",
            "fill-opacity": 0.3,
          },
        },
        {
          id: "gl-draw-polygon-fill-active",
          type: "fill",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "Polygon"],
          ],
          paint: {
            "fill-color": "#007bff",
            "fill-outline-color": "#007bff",
            "fill-opacity": 0.3,
          },
        },
        {
          id: "gl-draw-polygon-stroke-inactive",
          type: "line",
          filter: [
            "all",
            ["==", "active", "false"],
            ["==", "$type", "Polygon"],
            ["!=", "mode", "static"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#007bff",
            "line-width": 2,
          },
        },
        {
          id: "gl-draw-polygon-stroke-active",
          type: "line",
          filter: [
            "all",
            ["==", "active", "true"],
            ["==", "$type", "Polygon"],
          ],
          layout: {
            "line-cap": "round",
            "line-join": "round",
          },
          paint: {
            "line-color": "#007bff",
            "line-width": 2,
          },
        },
      ],
    });

    map.addControl(drawInstance);
    dispatch(
      { type: 'SET_DRAW_INSTANCE', payload: drawInstance }
    );
    
  }, [map]); 


  /**
   * Handles hover events on the map and displays a single popup with information about all hovered features.
   * The API requests are delayed by 100ms. If the user moves the mouse away before 100ms, the API calls are canceled.
   * Uses hoverEventId to ensure consistency and prevent outdated data from updating the tooltip.
   *
   * @param {Object} e - The event object containing information about the hover event.
   */
  const handleMapHover = useCallback(
    (e, forcedFeatures = null) => {
      if (!map || !e.point) return;

      // Get layers that have shouldHaveTooltipOnHover set to true and are available on the map
      // Treat click-tooltips as hover-tooltips on touch devices
      const isTouchonMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches || navigator.maxTouchPoints > 0;
      
      const hoverableLayers = Object.keys(state.layers).filter((layerId) => {
        const cfg = state.layers[layerId];
        const showOnTouch = isTouchonMobile && cfg.shouldHaveTooltipOnClick;
        return (cfg.shouldHaveTooltipOnHover || showOnTouch) && map.getLayer(layerId);
      });

      let features = [];
      if (forcedFeatures && forcedFeatures.length) {
        features = forcedFeatures;
      } else {
        if (hoverableLayers.length === 0) {
          // Clean up if no hoverable layers
          if (hoverInfoRef.current.popup) {
            hoverInfoRef.current.popup.remove();
            hoverInfoRef.current.popup = null;
          }
          // Clear hover state for previously hovered features
          prevHoveredFeaturesRef.current.forEach(({ source, sourceLayer, featureId }) => {
            map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
          });
          prevHoveredFeaturesRef.current = [];
          return;
        }

        // Determine the maximum bufferSize among the layers
         const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
         const dpr = window.devicePixelRatio || 1;
         // On touch devices, used a minimum buffer to account for finger size
         const minTapBufferPx = isTouch ? Math.round(6 * dpr) : 0;
          const maxBufferSize = Math.max(
           minTapBufferPx,
            ...hoverableLayers.map((layerId) => state.layers[layerId].bufferSize ?? 0)
         );
          const bufferedPoint = [
           [e.point.x - maxBufferSize, e.point.y - maxBufferSize],
           [e.point.x + maxBufferSize, e.point.y + maxBufferSize],
         ];
          const featuresWithDuplicates = map.queryRenderedFeatures(bufferedPoint, {
           layers: hoverableLayers,
         });
          if (isTouchonMobile) {
           features = featuresWithDuplicates.length ? [featuresWithDuplicates[0]] : [];
         } else {      
           // Below removes duplicates from features array
           const seen = new Set();
           for (const f of featuresWithDuplicates) {
             if (!seen.has(f.id)) { seen.add(f.id); features.push(f); }
           }
       }
      }

      if (features.length === 0) {
        // No features under mouse, cleanup and return
        if (hoverInfoRef.current.popup) {
          hoverInfoRef.current.popup.remove();
          hoverInfoRef.current.popup = null;
        }
        // Clear hover state for previously hovered features
        prevHoveredFeaturesRef.current.forEach(({ source, sourceLayer, featureId }) => {
          map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
        });
        prevHoveredFeaturesRef.current = [];
        return;
      }

      // Filter features based on their individual layer's shouldHaveHoverOnlyOnData setting
      const filteredFeatures = features.filter((feature) => {
        const layerId = feature.layer.id;
        const layerConfig = state.layers[layerId];
        const shouldHaveHoverOnlyOnData = layerConfig?.shouldHaveHoverOnlyOnData ?? false;
        const featureValue = feature.state.value;
        
        // If this layer has shouldHaveHoverOnlyOnData enabled, only include features with data
        if (shouldHaveHoverOnlyOnData && (featureValue === null || featureValue === undefined)) {
          return false; // Exclude this feature as it has no data
        }
        
        return true; // Include this feature
      });

      // If after filtering we have no features, cleanup and return
      if (filteredFeatures.length === 0) {
        if (hoverInfoRef.current.popup) {
          hoverInfoRef.current.popup.remove();
          hoverInfoRef.current.popup = null;
        }
        // Clear hover state for previously hovered features
        prevHoveredFeaturesRef.current.forEach(({ source, sourceLayer, featureId }) => {
          map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
        });
        prevHoveredFeaturesRef.current = [];
        return;
      }

      // Collect current hovered features (using filtered features)
      const currentHoveredFeatures = filteredFeatures.map((feature) => ({
        layerId: feature.layer.id,
        featureId: feature.id,
        source: feature.layer.source,
        sourceLayer: feature.layer["source-layer"],
      }));

      // Update hover states
      // First, unset hover state for previous features that are no longer hovered
      prevHoveredFeaturesRef.current.forEach((prevFeature) => {
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
        const wasHovered = prevHoveredFeaturesRef.current.find(
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
      const coordinates = e.lngLat;

      // Check if the features are the same as before
      const prevHoveredFeatures = prevHoveredFeaturesRef.current || [];

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
        if (hoverInfoRef.current.popup) {
          hoverInfoRef.current.popup.setLngLat(coordinates);
        }
        // No need to re-fetch data or update descriptions
        return;
      }

      // Update previous hovered features
      prevHoveredFeaturesRef.current = currentHoveredFeatures;

      // Increment hoverEventId
      hoverEventIdRef.current += 1;
      const currentHoverEventId = hoverEventIdRef.current;

      // Remove existing popup if any
      if (hoverInfoRef.current.popup) {
        hoverInfoRef.current.popup.remove();
        hoverInfoRef.current.popup = null;
      }

      // Cancel any ongoing API requests
      if (hoverInfoRef.current.abortController) {
        hoverInfoRef.current.abortController.abort();
        hoverInfoRef.current.abortController = null;
      }

      // Clear any pending timeout
      if (hoverInfoRef.current.timeoutId) {
        clearTimeout(hoverInfoRef.current.timeoutId);
        hoverInfoRef.current.timeoutId = null;
      }

  let descriptions = [];
  // Track API requests and how they map back to description indexes so we can merge results precisely
  const apiRequests = [];
  const requestIndexByDescriptionIndex = {};

      filteredFeatures.forEach((feature) => {
        const layerId = feature.layer.id;
        const layerConfig = state.layers[layerId];
        const customTooltip = layerConfig?.customTooltip;
        const hoverNulls = layerConfig.hoverNulls ?? true;
        const shouldIncludeMetadata = layerConfig?.hoverTipShouldIncludeMetadata;
        const shouldHaveHoverOnlyOnData = layerConfig?.shouldHaveHoverOnlyOnData ?? false;

        const featureValue = feature.state.value;
        if (
          !hoverNulls &&
          (featureValue === null || featureValue === undefined)
        ) {
          return; // Skip this feature
        }

        // If shouldHaveHoverOnlyOnData is enabled, only show hover for features with data
        if (
          shouldHaveHoverOnlyOnData &&
          (featureValue === null || featureValue === undefined)
        ) {
          return; // Skip this feature as it has no data
        }

        const featureName = feature.properties.name || "";
        const featureValueDisplay =
          featureValue !== undefined && featureValue !== null
            ? numberWithCommas(featureValue)
            : "";
        const layerVisualisationName =
          state.layers[layerId]?.visualisationName;
        const legendText =
          state.visualisations[layerVisualisationName]?.legendText?.[0]?.legendSubtitleText ?? "";

  let description = "";

        if (!customTooltip) {
          // Immediate data
          description = buildDefaultTooltip({
            featureName,
            featureValueDisplay,
            legendText,
          });

          // Inject additional metadata if available and enabled
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
          // Custom tooltip present; decide whether to join with default tooltip
          const joinToDefault = !!customTooltip.joinToDefaultTooltip;

          if (joinToDefault) {
            description = buildDefaultTooltip({
              featureName,
              featureValueDisplay,
              legendText,
            });

            // Inject additional metadata if available and enabled
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
            // Always push to maintain index mapping, even if description is empty
            descriptions.push(description || "");
            // Prepare the API request and map it to this description index
            const requestIndex = apiRequests.length;
            apiRequests.push({ feature, layerId, featureName, joinToDefault: true });
            requestIndexByDescriptionIndex[descIndex] = requestIndex;
          } else {
            // If not joining, show a loading placeholder and later replace fully with custom HTML
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
          closeOnMove: false,
        })
          .setLngLat(coordinates)
          .setHTML(aggregatedHtml)
          .addTo(map);
        hoverInfoRef.current.popup = popup;
      } else {
        // No descriptions, do not show popup
        return;
      }

      if (apiRequests.length > 0) {
        // Delay the API calls
        const fetchData = () => {
          const controller = new AbortController();
          hoverInfoRef.current.abortController = controller;

          const fetchPromises = apiRequests.map(
            ({ feature, layerId, featureName, joinToDefault }) => {
            const layerConfig = state.layers[layerId];
            const customTooltip = layerConfig?.customTooltip;
            const { htmlTemplate, customFormattingFunctions } = customTooltip;
            const featureId = feature.id;
            const requestUrlWithId = resolveTooltipRequestUrl(customTooltip, featureId);

            return api.baseService
              .get(requestUrlWithId, { signal: controller.signal })
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
              hoverInfoRef.current.popup
            ) {
              // Merge results back into the right places based on the original description order
              const combinedDescriptions = [];
              for (let i = 0; i < descriptions.length; i++) {
                const requestIdx = requestIndexByDescriptionIndex[i];
                if (requestIdx === undefined) {
                  // No custom part for this description; keep as is
                  combinedDescriptions.push(descriptions[i]);
                } else {
                  const req = apiRequests[requestIdx];
                  const resultHtml = results[requestIdx];
                  if (req.joinToDefault) {
                    // Insert custom HTML into the base tooltip structure
                    const base = descriptions[i] || "";
                    combinedDescriptions.push(insertCustomIntoDefault(base, resultHtml));
                  } else {
                    // Replace the placeholder with the custom HTML
                    combinedDescriptions.push(resultHtml);
                  }
                }
              }
              const aggregatedHtml = combinedDescriptions.join('<hr class="thick-divider">');
              hoverInfoRef.current.popup.setHTML(aggregatedHtml);
            }
          });
        };

        const timeoutId = setTimeout(fetchData, 100);
        hoverInfoRef.current.timeoutId = timeoutId;
      }
    },
    [map, state.layers, state.visualisations]
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
      const newPopup = new maplibregl.Popup({ closeOnClick: false })
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
                'text-anchor': 'center', // centre the text
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
  
  
  // **Set up click and zoom handlers**
  useEffect(() => {
    if (!map) return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

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
      if (!isTouch && state.layers[layerId].shouldHaveTooltipOnClick) {
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
          state.layers[layerId].shouldHaveTooltipOnClick
        ) {
          const { clickCallback, zoomHandler } =
            listenerCallbackRef.current[layerId];
          if (clickCallback) {map.off("click", clickCallback)};
          map.off('zoomend', zoomHandler);

          // Clean up hover info
          if (hoverInfoRef.current[layerId]) {
            const { timeoutId, abortController, popup } =
              hoverInfoRef.current[layerId];
            if (timeoutId) clearTimeout(timeoutId);
            if (abortController) abortController.abort();
            if (popup) popup.remove();
            hoverInfoRef.current[layerId] = null;
          }
        }
        if (state.layers[layerId].shouldHaveLabel) {
          const zoomHandler = listenerCallbackRef.current[layerId]?.zoomHandler;
          map.off('zoomend', zoomHandler);
        }
      });
    };
  }, [map, handleLayerLeave, state.layers, state.visualisations]);

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
      const mapFilters = memoizedFilters.filter((filter) => filter.type === "map");

      // Get the list of layer names from the filters
      const layerNames = mapFilters.map((filter) => filter.layer);

      // Query for features from all layers specified in mapFilters
      const features = map.queryRenderedFeatures(point, {
        layers: layerNames,
      });

      if (features.length > 0) {
        // Get the top-most feature
        const feature = features[0];
        const layerId = feature.layer.id;

        // Unset the 'selected' state of the previously selected feature for this layer
        if (prevSelectedFeatures.current[layerId]) {
          const prevFeature = prevSelectedFeatures.current[layerId];
          map.setFeatureState(
            {
              source: prevFeature.source,
              sourceLayer: prevFeature.sourceLayer,
              id: prevFeature.id,
            },
            { selected: false }
          );
        }

        // Set the 'selected' state of the currently selected feature
        map.setFeatureState(
          {
            source: feature.layer.source,
            sourceLayer: feature.layer["source-layer"],
            id: feature.id,
          },
          { selected: true }
        );

        // Update the reference to the currently selected feature for this layer
        prevSelectedFeatures.current[layerId] = {
          id: feature.id,
          source: feature.layer.source,
          sourceLayer: feature.layer["source-layer"],
        };

        // Find the corresponding filter
        const filter = mapFilters.find((f) => f.layer === layerId);

        if (filter) {
          const value = feature.properties[filter.field];

          // Dispatch the action with the value from the clicked feature
          filterDispatch({
            type: "SET_FILTER_VALUE",
            payload: { filterId: filter.id, value },
          });
          filter.actions.forEach((action) => {
            dispatch({
              type: action.action,
              payload: { filter, value, ...action.payload },
            });
          });
        }
      } else {
        // When clicking on an area with no features, unset selected features on all layers if needed
        layerNames.forEach((layerId) => {
          if (prevSelectedFeatures.current[layerId]) {
            const prevFeature = prevSelectedFeatures.current[layerId];
            map.setFeatureState(
              {
                source: prevFeature.source,
                sourceLayer: prevFeature.sourceLayer,
                id: prevFeature.id,
              },
              { selected: false }
            );
            delete prevSelectedFeatures.current[layerId];
          }
        });
      }
    },
    [isMapReady, map, memoizedFilters, dispatch, filterDispatch]
  );

  // **Create map hover/tap handler **
  useEffect(() => {
    if (!map) return;

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (!isTouch) {
      // ----- DESKTOP: normal hover -----
      const hoverCallback = (e) => handleMapHover(e);
      map.on("mousemove", hoverCallback);

      const mouseLeaveCallback = () => {
        if (hoverInfoRef.current.popup) {
          hoverInfoRef.current.popup.remove();
          hoverInfoRef.current.popup = null;
        }
        if (hoverInfoRef.current.abortController) {
          hoverInfoRef.current.abortController.abort();
          hoverInfoRef.current.abortController = null;
        }
        if (hoverInfoRef.current.timeoutId) {
          clearTimeout(hoverInfoRef.current.timeoutId);
          hoverInfoRef.current.timeoutId = null;
        }
        prevHoveredFeaturesRef.current.forEach(({ source, sourceLayer, featureId }) => {
          map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
        });
        prevHoveredFeaturesRef.current = [];
      };
      map.getCanvas().addEventListener("mouseleave", mouseLeaveCallback);

      listenerCallbackRef.current.hoverCallback = hoverCallback;
      listenerCallbackRef.current.mouseLeaveCallback = mouseLeaveCallback;

      return () => {
        if (listenerCallbackRef.current.hoverCallback) {
          map.off("mousemove", listenerCallbackRef.current.hoverCallback);
        }
        if (listenerCallbackRef.current.mouseLeaveCallback) {
          map.getCanvas().removeEventListener("mouseleave", listenerCallbackRef.current.mouseLeaveCallback);
        }
      };
    }

    // ----- MOBILE/TABLET: tap behavior -----
    const onTap = (e) => {
      const now = Date.now();
      const isTouch =
        e.type === 'touchend' ||
        (e.originalEvent && ('changedTouches' in e.originalEvent || 'touches' in e.originalEvent));

      // Prevent handling mouse event if a touch event was recently processed
      if (!isTouch && now - lastTouchTimeRef.current < 350) {
        return; 
      }
      if (isTouch) {
        lastTouchTimeRef.current = now;
      }

      // Pick the exact feature at the tap point 
      let point = e.point;
      if (!point && e.originalEvent && e.originalEvent.changedTouches && e.originalEvent.changedTouches[0]) {
        const t = e.originalEvent.changedTouches[0];
        const rect = map.getCanvas().getBoundingClientRect();
        point = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }
      const picked = point ? pickFeatureAtPoint(point) : null;

      if (picked) {
        if (isTouch) {
          const evtForClick = { ...e, point }; // ensure .point exists for handleMapClick
          handleMapClick(evtForClick);
        }
        setTimeout(() => handleMapHover({ ...e, point }, [picked]), 0);
        return;
      }
      // clear on empty tap
      if (hoverInfoRef.current.popup) {
        hoverInfoRef.current.popup.remove();
        hoverInfoRef.current.popup = null;
      }
      prevHoveredFeaturesRef.current.forEach(({ source, sourceLayer, featureId }) => {
        map.setFeatureState({ source, id: featureId, sourceLayer }, { hover: false });
      });
      prevHoveredFeaturesRef.current = [];
    };

    map.on('click', onTap);
    map.on('touchend', onTap);

    return () => {
      map.off('click', onTap);
      map.off('touchend', onTap);
    };
  }, [map, handleMapHover, handleMapClick, state.layers, memoizedFilters]);


  // Fallback for touch devices that do support hover
  useEffect(() => {
    if (!map) return;

    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const hasHover = window.matchMedia('(hover: hover)').matches;
    if (!(isTouch && hasHover)) return; // run only on hover-capable touch devices

    const onTouchEndShowTooltip = (te) => {
      const t = te.changedTouches && te.changedTouches[0];
      if (!t) return;
      const rect = map.getCanvas().getBoundingClientRect();
      const point = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      const lngLat = map.unproject(point);
      handleMapHover({ point, lngLat });
    };

    map.getCanvas().addEventListener('touchend', onTouchEndShowTooltip, { passive: true });
    return () => map.getCanvas().removeEventListener('touchend', onTouchEndShowTooltip);
  }, [map, handleMapHover]);

  // Run once to set the state of the map
  useEffect(() => {
    if (isMapReady) {
      dispatch({
        type: "SET_MAP",
        payload: { map },
      });
    }
  }, [isMapReady]);

  // **Handle map clicks (for map filters)**
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
      if (bounds && centroid) {
        // Initialize a new LngLatBounds object
        const mapBounds = new maplibregl.LngLatBounds();
  
        // Extend bounds with the coordinates from your bounds data
        bounds.coordinates[0].forEach(coord => mapBounds.extend(coord));
  
        // Calculate the northeast and southwest points of the bounds
        const ne = mapBounds.getNorthEast();
        const sw = mapBounds.getSouthWest();
  
        // Get the centre coordinates
        const centre = centroid.coordinates; // [lng, lat]
  
        // Calculate offsets based on the difference between the centre and the bounds
        const offset = {
          ne: [
            centre[0] - ne.lng,
            centre[1] - ne.lat,
          ],
          sw: [
            centre[0] - sw.lng,
            centre[1] - sw.lat,
          ],
        };
  
        // Adjust the bounds by extending them with the offset points
        mapBounds.extend([centre[0] + offset.ne[0], centre[1] + offset.ne[1]]);
        mapBounds.extend([centre[0] + offset.sw[0], centre[1] + offset.sw[1]]);
  
        // Define the fitBounds options
        const options = {
          padding: 80,
          duration: 0,
        };
  
        // Fit the map to the adjusted bounds and pan
        map.fitBounds(mapBounds, options);
        map.panTo(centre)
      }
      if (centroid && !bounds) {
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
        sidebarIsOpen={sidebarIsOpen}
      />}
      {isMapReady && <DynamicLegend map={map} />}
    </StyledMapContainer>
  );
};

export default React.memo(Map);
