import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { syncMaps } from "utils";
import { defaultMapStyle, defaultMapCentre, defaultMapZoom } from "defaults";
import { registerInitialBaseSources, getInitialBaseSources } from "../map/baseSources";

/**
 * Custom hook to manage two synchronized MapLibre maps.
 * @function useDualMaps
 * @param {React.RefObject} leftMapContainerRef - Ref object pointing to the left map container DOM element.
 * @param {React.RefObject} rightMapContainerRef - Ref object pointing to the right map container DOM element.
 * @param {string} mapStyle - A custom map style to be used for both maps.
 * @param {Array<number>} mapCentre - The initial map center coordinates [longitude, latitude].
 * @param {number} mapZoom - The initial map zoom level.
 * @param {string} extraCopyrightText - Extra copyright text that needs to go in the bottom right bar.
 * @returns {Object} An object containing the left and right map instances, map style loaded state, map loaded state, and map ready state.
 */
export const useDualMaps = (
  leftMapContainerRef,
  rightMapContainerRef,
  mapStyle,
  mapCentre,
  mapZoom,
  extraCopyrightText
) => {
  const [leftMap, setLeftMap] = useState(null);
  const [rightMap, setRightMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded;

  useEffect(() => {
    /**
     * Initializes the two MapLibre map instances.
     */
    const initializeDualMap = () => {      
      const styleValue = typeof mapStyle === "function" ? mapStyle() : (mapStyle || defaultMapStyle);
      const commonOptions = {
        style: styleValue,
        center: mapCentre || defaultMapCentre,
        zoom: mapZoom != null ? mapZoom : defaultMapZoom,
        fadeDuration: 0,
        refreshExpiredTiles: false,
        maxTileCacheSize: 500,
        attributionControl: false,
        transformRequest: (url, resourceType) => {
          if (resourceType !== 'Style' && url.startsWith('https://api.os.uk') ) {
            url = new URL(url);
            if (!url.searchParams.has('key')) url.searchParams.append('key', import.meta.env.VITE_APP_MAP_API_TOKEN);
            if (!url.searchParams.has('srs')) url.searchParams.append('srs', 3857);
            return {
              url: new Request(url).url
            };
          }
        },
      };

      const leftMapInstance = new maplibregl.Map({
        container: leftMapContainerRef.current,
        ...commonOptions,
      });
      
      // Add event listeners after map creation
      leftMapInstance.on("style.load", () => {
        const style = leftMapInstance.getStyle?.();
        if (style?.sources && !getInitialBaseSources(leftMapInstance)) {
          registerInitialBaseSources(
            leftMapInstance,
            new Set(Object.keys(style.sources))
          );
        }
        setIsMapStyleLoaded(true);
      });
      leftMapInstance.on("load", () => {
        setIsMapLoaded(true);
      });
      leftMapInstance.addControl(
        new maplibregl.NavigationControl(),
        "bottom-left"
      );
      leftMapInstance.resize();

      const rightMapInstance = new maplibregl.Map({
        container: rightMapContainerRef.current,
        ...commonOptions,
      });
      
      // Add event listeners after map creation
      rightMapInstance.on("style.load", () => {
        const style = rightMapInstance.getStyle?.();
        if (style?.sources && !getInitialBaseSources(rightMapInstance)) {
          registerInitialBaseSources(
            rightMapInstance,
            new Set(Object.keys(style.sources))
          );
        }
        setIsMapStyleLoaded(true);
      });
      rightMapInstance.on("load", () => {
        setIsMapLoaded(true);
      });
      rightMapInstance.addControl(
        new maplibregl.NavigationControl(),
        "bottom-left"
      );
      rightMapInstance.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: `Contains OS data © Crown copyright and database right ${new Date().getFullYear()}${extraCopyrightText ? ` | ${extraCopyrightText}` : ''}`
        }),
        "bottom-right"
      );
      rightMapInstance.resize();

      const isNarrowViewport = window.matchMedia('(max-width: 900px)').matches;
      const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(any-pointer: coarse)').matches;
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches ||
        window.matchMedia('(any-pointer: fine)').matches;
      const shouldDisableDesktopInteractions = isNarrowViewport && hasCoarsePointer && !hasFinePointer;

      if (shouldDisableDesktopInteractions) {
        [leftMapInstance, rightMapInstance].forEach(map => {
          map.scrollZoom.disable();      // prevent single-finger zoom
          map.dragPan.disable();         // prevent single-finger pan
          map.doubleClickZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();

          // keep two-finger zoom/pan (nice mobile UX)
          map.touchZoomRotate.enable();
          map.touchZoomRotate.disableRotation(); // optional
        });
      }

      // Synchronize the two maps
      syncMaps(leftMapInstance, rightMapInstance);

      setLeftMap(leftMapInstance);
      setRightMap(rightMapInstance);
    };

    if (!leftMap && !rightMap) {
      initializeDualMap();
    }

    return () => {
      if (leftMap) {
        leftMap.remove();
        setLeftMap(null);
      }
      if (rightMap) {
        rightMap.remove();
        setRightMap(null);
      }
      setIsMapLoaded(false);
      setIsMapStyleLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update map center if mapCentre changes
  useEffect(() => {
    if (
      leftMap &&
      rightMap &&
      Array.isArray(mapCentre) &&
      mapCentre.length === 2
    ) {
      leftMap.setCenter(mapCentre);
      rightMap.setCenter(mapCentre);
    }
  }, [leftMap, rightMap, mapCentre]);

  // Update map zoom if mapZoom changes
  useEffect(() => {
    if (leftMap && rightMap && mapZoom != null) {
      leftMap.setZoom(mapZoom);
      rightMap.setZoom(mapZoom);
    }
  }, [leftMap, rightMap, mapZoom]);

  return { leftMap, rightMap, isMapStyleLoaded, isMapLoaded, isMapReady };
};
