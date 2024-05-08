import { useState, useEffect } from "react";
import maplibregl from "maplibre-gl";

export const useMap = (mapContainerRef) => {
  const [map, setMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded;

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=5f0299a14c344b3399f76c8bc70db6ca",
        center: [-2.597, 53.39],
        zoom: 6
      })
      .on('style.load', () => setIsMapStyleLoaded(true))
        .on('load', () => {
        setIsMapLoaded(true);
      });
      
      mapInstance.addControl(new maplibregl.NavigationControl(), 'bottom-left');
      mapInstance.on("click", (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point);

        // Limit the number of properties we're displaying for
        // legibility and performance
        const displayProperties = [
          "type",
          "properties",
          "id",
          "layer",
          "source",
          "sourceLayer",
          "state",
        ];

        const displayFeatures = features.map((feat) => {
          const displayFeat = {};
          displayProperties.forEach((prop) => {
            displayFeat[prop] = feat[prop];
          });
          return displayFeat;
        });
        console.log(displayFeatures);
      });
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