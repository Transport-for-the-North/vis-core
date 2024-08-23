import { useState, useEffect } from "react";
import maplibregl from "maplibre-gl";

/**
 * Custom hook to initialize and manage a MapLibre map.
 * @function useMap
 * @param {React.RefObject} mapContainerRef - Ref object pointing to the map container DOM element.
 * @returns {Object} An object containing the map instance, map style loaded state, map loaded state, and map ready state.
 */
export const useMap = (mapContainerRef) => {
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
        style: "https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=5f0299a14c344b3399f76c8bc70db6ca",
        center: [-2.597, 53.39],
        zoom: 8
      })
      .on('style.load', () => setIsMapStyleLoaded(true))
        .on('load', () => {
        setIsMapLoaded(true);
      });
      
      mapInstance.addControl(new maplibregl.NavigationControl(), 'bottom-left');

      mapInstance.resize();

      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
        setIsMapLoaded(false);
        setIsMapStyleLoaded(false);
      }
    };
  }, []);

  return { map, isMapStyleLoaded, isMapLoaded, isMapReady };
};