import React, { useCallback, useEffect, useState } from 'react';
import { AccordionSection } from 'Components';
import { useMapContext } from 'hooks';
import { LayerControlEntry } from './LayerControlEntry';

/**
 * MapLayerSection component represents a section for controlling map layers.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleColorChange - The function to handle color changes for the layers.
 * @param {Function} props.handleClassificationChange - The function to handle classification changes for the layers.
 * @returns {JSX.Element} The rendered MapLayerSection component.
 */
export const MapLayerSection = ({ handleColorChange, handleClassificationChange }) => {
  const { state } = useMapContext();
  const { map } = state;
  const [layers, setLayers] = useState([]);

  const updateLayers = useCallback(() => {
    const newLayers = map.getStyle().layers;
    const filteredLayers = newLayers.filter(
      (layer) =>
        (layer.type === 'fill' || layer.type === 'line' || layer.type === 'circle') &&
        layer.source !== 'default' && !layer.id.endsWith("-hover") && layer.id !== "selected-feature-layer"
    );
    setLayers(filteredLayers);
  }, [map]);

  useEffect(() => {
    if (map) {
      map.on('styledata', updateLayers);
      return () => {
        map.off('styledata', updateLayers);
      };
    }
  }, [map, updateLayers]);

  if (!map) {
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
          map={map}
          handleColorChange={handleColorChange}
          handleClassificationChange={handleClassificationChange}
          state={state}
        />
      ))}
    </AccordionSection>
  );
};
