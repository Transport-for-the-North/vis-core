import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { syncMaps } from "utils";
import { defaultMapStyle, defaultMapCentre, defaultMapZoom } from "defaults";

/**
 * Custom hook to manage two synchronized MapLibre maps.
 * @function useDualMaps
 * @param {React.RefObject} leftMapContainerRef - Ref object pointing to the left map container DOM element.
 * @param {React.RefObject} rightMapContainerRef - Ref object pointing to the right map container DOM element.
 * @param {string} mapStyle - A custom map style to be used for both maps.
 * @param {Array<number>} mapCentre - The initial map center coordinates [longitude, latitude].
 * @param {number} mapZoom - The initial map zoom level.
 * @param {string} extraCopyrightText - Extra copyright text for attribution.
 * @returns {Object} An object containing the left and right map instances, map loaded states, and base source refs.
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

  const leftKnownBaseSourceIds = useRef(null);
  const rightKnownBaseSourceIds = useRef(null);
  const knownBaseSourceIds = useRef({
    left: null,
    right: null,
  });

  useEffect(() => {
    let leftMapInstance = null;
    let rightMapInstance = null;
    let isCleanedUp = false;

    let leftLoaded = false;
    let rightLoaded = false;
    let leftStyleLoaded = false;
    let rightStyleLoaded = false;

    let leftContainerResizeObserver = null;
    let rightContainerResizeObserver = null;

    /**
     * Safely resize/repaint a map.
     */
    const safeResizeAndRepaint = (mapInstance) => {
      if (isCleanedUp || !mapInstance) return;

      try {
        mapInstance.resize();
        mapInstance.triggerRepaint?.();
      } catch {
        // Ignore resize/repaint calls after map removal.
      }
    };

    /**
     * Capture the initial base source IDs for one side.
     * 
     * These are used later during runtime style switching so the application can
     * preserve custom sources/layers while replacing only the basemap style.
     */
    const captureInitialBaseSourceIds = (side, mapInstance) => {
      if (!mapInstance) return;

      if (side === "left" && leftKnownBaseSourceIds.current) return;
      if (side === "right" && rightKnownBaseSourceIds.current) return;

      const style = mapInstance.getStyle();
      const sourceIds = Object.keys(style?.sources ?? {});
      const sourceIdSet = new Set(sourceIds);

      if (side === "left") {
        leftKnownBaseSourceIds.current = sourceIdSet;
      } else {
        rightKnownBaseSourceIds.current = sourceIdSet;
      }

      knownBaseSourceIds.current[side] = sourceIdSet;
    };

    /**
     * Expose the map instances only when both maps have loaded.
     */
    const maybeExposeMaps = () => {
      if (isCleanedUp) return;

      if (leftStyleLoaded && rightStyleLoaded) {
        setIsMapStyleLoaded(true);
      }

      if (leftLoaded && rightLoaded) {
        setIsMapLoaded(true);
        setLeftMap(leftMapInstance);
        setRightMap(rightMapInstance);
      }
    };

    /**
     * Initializes the two MapLibre map instances.
     */
    const initializeDualMap = () => {
      const leftContainer = leftMapContainerRef.current;
      const rightContainer = rightMapContainerRef.current;

      if (!leftContainer || !rightContainer) return;

      const styleValue = typeof mapStyle === "function" ? mapStyle() : mapStyle ||
            (typeof defaultMapStyle === "function"
              ? defaultMapStyle()
              : defaultMapStyle);

      const commonOptions = {
        style: styleValue,
        center: mapCentre || defaultMapCentre,
        zoom: mapZoom != null ? mapZoom : defaultMapZoom,
        // maxZoom: 16,
        // maxBounds: [
        //   [ -10.76418, 49.528423 ],
        //   [ 1.9134116, 61.331151 ]
        // ],
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
          return { url };
        },
      };

      leftMapInstance = new maplibregl.Map({
        container: leftContainer,
        ...commonOptions,
      });

      rightMapInstance = new maplibregl.Map({
        container: rightContainer,
        ...commonOptions,
      });
      
      // Add event listeners after map creation
      leftMapInstance.on("style.load", () => {
        leftStyleLoaded = true;
        captureInitialBaseSourceIds("left", leftMapInstance);
        maybeExposeMaps();
      });

      leftMapInstance.on("load", () => {
        leftLoaded = true;
        maybeExposeMaps();
      });

      leftMapInstance.addControl(
        new maplibregl.NavigationControl(),
        "bottom-left"
      );

      rightMapInstance.on("style.load", () => {
        rightStyleLoaded = true;
        captureInitialBaseSourceIds("right", rightMapInstance);
        maybeExposeMaps();
      });

      rightMapInstance.on("load", () => {
        rightLoaded = true;
        maybeExposeMaps();
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

      /**
       * Resize observers.
       *
       * DualMaps.jsx also has resize handling, but doing it here too makes the
       * hook more resilient during first load and layout changes.
       */
      if ("ResizeObserver" in window) {
        leftContainerResizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            safeResizeAndRepaint(leftMapInstance);
          });
        });

        rightContainerResizeObserver = new ResizeObserver(() => {
          requestAnimationFrame(() => {
            safeResizeAndRepaint(rightMapInstance);
          });
        });

        leftContainerResizeObserver.observe(leftContainer);
        rightContainerResizeObserver.observe(rightContainer);
      }

      /**
       * Initial resize.
       */
      safeResizeAndRepaint(leftMapInstance);
      safeResizeAndRepaint(rightMapInstance);

      /**
       * Mobile interaction adjustment.
       */
      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      if (isMobile) {
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
    };

    initializeDualMap();

    return () => {
      isCleanedUp = true;

      if (leftContainerResizeObserver) {
        leftContainerResizeObserver.disconnect();
      }

      if (rightContainerResizeObserver) {
        rightContainerResizeObserver.disconnect();
      }

      if (leftMapInstance) {
        leftMapInstance.remove();
        leftMapInstance = null;
      }

      if (rightMapInstance) {
        rightMapInstance.remove();
        rightMapInstance = null;
      }

      setLeftMap(null);
      setRightMap(null);
      setIsMapLoaded(false);
      setIsMapStyleLoaded(false);

      leftKnownBaseSourceIds.current = null;
      rightKnownBaseSourceIds.current = null;
      knownBaseSourceIds.current = {
        left: null,
        right: null,
      };
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


  
  return { leftMap, rightMap, isMapStyleLoaded, isMapLoaded, isMapReady, leftKnownBaseSourceIds, rightKnownBaseSourceIds, knownBaseSourceIds, };
};