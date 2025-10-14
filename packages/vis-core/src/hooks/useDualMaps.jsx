import { useState, useEffect } from "react";
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
      const commonOptions = {
        style: mapStyle || defaultMapStyle,
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
            if (!url.searchParams.has('key')) url.searchParams.append('key', process.env.REACT_APP_MAP_API_TOKEN);
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
      })
        .on("style.load", () => setIsMapStyleLoaded(true))
        .on("load", () => {
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
      })
        .on("style.load", () => setIsMapStyleLoaded(true))
        .on("load", () => {
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

      const isMobile = window.matchMedia('(max-width: 900px)').matches;
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
