import { useEffect, useState, useCallback } from "react";
import { useMapContext } from "hooks";

/**
 * Custom hook to generate a message for layers that are not visible due to zoom level.
 * @returns {string} A message indicating which layers need zooming in or out to be visible.
 */
export const useLayerZoomMessage = () => {
  const { state } = useMapContext();
  const [zoomMessage, setZoomMessage] = useState("");

  const getVisibleLayers = useCallback(() => {
    const maps = Array.isArray(state.maps) ? state.maps.filter(map => map) : [state.map].filter(map => map);
    if (maps.length > 0) {
      const newLayers = maps[0].getStyle().layers;
      return newLayers.filter(
        (layer) =>
          (layer.type === "fill" ||
            layer.type === "line" ||
            layer.type === "circle") &&
            layer.source !== "default" &&
            !layer.id.endsWith("-hover") &&
            layer.id !== "selected-feature-layer" &&
            !layer.id.startsWith("gl-draw")
      );
    }
    return [];
  }, [state.maps, state.map]);

  useEffect(() => {
    const updateZoomMessage = () => {
      const currentZoom = state.currentZoom; // Use the current zoom level from the state
      const layers = getVisibleLayers();

      const zoomInLayers = [];
      const zoomOutLayers = [];

      layers.forEach(layer => {
        const minZoom = layer.minzoom || 0;
        const maxZoom = layer.maxzoom || 24;

        if (currentZoom < minZoom) {
          zoomInLayers.push(layer.id);
        } else if (currentZoom > maxZoom) {
          zoomOutLayers.push(layer.id);
        }
      });

      let message = "";
      if (zoomInLayers.length > 0) {
        const layerNames = zoomInLayers.join(' and ');
        message += `Zoom in to see ${layerNames} layer${zoomInLayers.length > 1 ? 's' : ''}. `;
      }
      if (zoomOutLayers.length > 0) {
        const layerNames = zoomOutLayers.join(' and ');
        message += `Zoom out to see ${layerNames} layer${zoomOutLayers.length > 1 ? 's' : ''}.`;
      }

      setZoomMessage(message.trim());
    };

    // Initial check
    updateZoomMessage();

  }, [state.currentZoom, state.layers, getVisibleLayers]);

  return zoomMessage;
};
