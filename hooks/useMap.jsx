import { useRef, useState, useEffect } from "react";
import maplibregl from "maplibre-gl";

// maplibregl.workerClass = require("worker-loader!maplibre-gl/dist/maplibre-gl-csp-worker").default;

const useMap = (mapContainerRef) => {
  const [map, setMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [-2.597, 53.39],
        zoom: 6
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
        setMap(null);
        setIsMapLoaded(false);
        setIsMapStyleLoaded(false);
      }
    };
  }, [mapContainerRef, map]);

  return { map, isMapStyleLoaded, isMapLoaded, isMapReady };
};

export default useMap;