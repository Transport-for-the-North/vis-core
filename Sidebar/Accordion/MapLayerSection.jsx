import React, { useCallback, useEffect, useState } from "react";
import { AccordionSection } from "Components";
import { useMapContext } from "hooks";
import { LayerControlEntry } from "./LayerControlEntry";

/**
 * MapLayerSection component represents a section for controlling map layers.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleColorChange - The function to handle color changes for the layers.
 * @param {Function} props.handleClassificationChange - The function to handle classification changes for the layers.
 * @returns {JSX.Element} The rendered MapLayerSection component.
 */
export const MapLayerSection = ({
  handleColorChange,
  handleClassificationChange,
}) => {
  const { state } = useMapContext();
  const maps = Array.isArray(state.maps) ? state.maps.filter(map => map) : [state.map].filter(map => map);
  const [layers, setLayers] = useState([]);

  const updateLayers = useCallback(() => {
    if (maps.length > 0) {
      const newLayers = maps[0].getStyle().layers;
      const filteredLayers = newLayers.filter(
        (layer) =>
          (layer.type === "fill" ||
            layer.type === "line" ||
            layer.type === "circle") &&
            layer.source !== "default" &&
            !layer.id.endsWith("-hover") &&
            layer.id !== "selected-feature-layer" &&
            !layer.id.startsWith("gl-draw")
      );
      setLayers(filteredLayers);
    }
  }, [maps]);

  useEffect(() => {
    if (maps.length > 0) {
      maps.forEach((map) => {
        if (map) {
          map.on('styledata', updateLayers);
        }
      });
      return () => {
        maps.forEach((map) => {
          if (map) {
            map.off('styledata', updateLayers);
          }
        });
      };
    }
  }, [maps, updateLayers]);

  if (maps.length === 0) {
    return <div>Loading map layers...</div>;
  }

  if (layers.length === 0) {
    return null;
  }

  return (
    <AccordionSection title="Map layer control">
      {layers.map((layer) => (
        <LayerControlEntry
          key={layer.id}
          layer={layer}
          maps={maps}
          handleColorChange={handleColorChange}
          handleClassificationChange={handleClassificationChange}
          state={state}
        />
      ))}
    </AccordionSection>
  );
};