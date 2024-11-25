import { useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { defaultMapStyle } from "defaults";
import { defaultMapCentre } from "defaults";
import { defaultMapZoom } from "defaults";

/**
 * Custom hook to initialize and manage a MapLibre map.
 * @function useMap
 * @param {React.RefObject} mapContainerRef - Ref object pointing to the map container DOM element.
 * @param {string} mapStyle - A custom map style.
 * @param {Array<number>} mapCentre - The initial map center coordinates [longitude, latitude].
 * @param {number} mapZoom - The initial map zoom level.
 * @returns {Object} An object containing the map instance, map style loaded state, map loaded state, and map ready state.
 */
export const useMap = (mapContainerRef, mapStyle, mapCentre, mapZoom) => {
  const [map, setMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded;

  useEffect(() => {
    /**
     * Initializes the MapLibre map instance.
     */
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle || defaultMapStyle,
        center: mapCentre || defaultMapCentre,
        zoom: mapZoom != null ? mapZoom : defaultMapZoom,
        // maxZoom: 15,
        // maxBounds: [
        //   [ -10.76418, 49.528423 ],
        //   [ 1.9134116, 61.331151 ]
        // ],
        attributionControl: false,
        transformRequest: (url, resourceType) => {
          if( resourceType !== 'Style' && url.startsWith('https://api.os.uk') ) {
              url = new URL(url);
              if(! url.searchParams.has('key') ) url.searchParams.append('key', process.env.REACT_APP_MAP_API_TOKEN);
              if(! url.searchParams.has('srs') ) url.searchParams.append('srs', 3857);
              return {
                  url: new Request(url).url
              }
          }
      }
      })
        .on("style.load", () => setIsMapStyleLoaded(true))
        .on("load", () => {
          setIsMapLoaded(true);
        });

      mapInstance.addControl(
        new maplibregl.NavigationControl(),
        "bottom-left"
      );
      
      mapInstance.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: `Contains OS data © Crown copyright and database right ${new Date().getFullYear()}`
        }),
        "bottom-right"
      );

      mapInstance.resize();

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
        setIsMapLoaded(false);
        setIsMapStyleLoaded(false);
      }
    };
  }, []);

  // Update map center if mapCentre changes
  useEffect(() => {
    if (map && Array.isArray(mapCentre) && mapCentre.length === 2) {
      map.setCenter(mapCentre);
    }
  }, [map, mapCentre]);

  // Update map zoom if mapZoom changes
  useEffect(() => {
    if (map && mapZoom != null) {
      map.setZoom(mapZoom);
    }
  }, [map, mapZoom]);

  return { map, isMapStyleLoaded, isMapLoaded, isMapReady };
};