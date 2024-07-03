import { useState, useEffect } from "react";
import maplibregl from "maplibre-gl";
import { syncMaps } from "@mapbox/mapbox-gl-sync-move";

export const useDualMaps = (mapContainerRef) => {
  const [leftMap, setLeftMap] = useState(null);
  const [rightMap, setRightMap] = useState(null);
  const [isMapStyleLoaded, setIsMapStyleLoaded] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const isMapReady = isMapLoaded && isMapStyleLoaded;

  useEffect(() => {
    const initializeDualMap = () => {
      const leftMapInstance = new maplibregl.Map({
        container: mapContainerRef.current,
        style:
          "https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=5f0299a14c344b3399f76c8bc70db6ca",
        center: [-2.597, 53.39],
        zoom: 6,
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
        container: mapContainerRef.current,
        style:
          "https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=5f0299a14c344b3399f76c8bc70db6ca",
        center: [-2.597, 53.39],
        zoom: 6,
      })
        .on("style.load", () => setIsMapStyleLoaded(true))
        .on("load", () => {
          setIsMapLoaded(true);
        });
      rightMapInstance.addControl(
        new maplibregl.NavigationControl(),
        "bottom-left"
      );
      rightMapInstance.resize();
      syncMaps(leftMapInstance, rightMapInstance);

      setLeftMap(leftMapInstance);
      setRightMap(rightMapInstance);
    };

    if (!leftMap && !rightMap) {
      initializeDualMap();
    }

    return () => {
      if (leftMap && rightMap) {
        leftMap.remove();
        rightMap.remove();
        setIsMapLoaded(false);
        setIsMapStyleLoaded(false);
      }
    };
  }, []);

  return { leftMap, rightMap, isMapStyleLoaded, isMapLoaded, isMapReady };
};
