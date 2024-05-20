import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"; // Assuming you're using Heroicons
import _ from "lodash";
import { memo, useEffect, useState } from "react";
import styled from "styled-components";

import { AccordionSection } from "Components";
import { useMapContext } from "hooks";
import { ColourSchemeDropdown } from "../Selectors";
import { SelectorLabel } from "../Selectors/SelectorLabel";

const LayerControlContainer = styled.div`
  margin-bottom: 10px;
`;

const LayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LayerName = styled.span`
  font-weight: bold;
`;

const VisibilityToggle = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const OpacityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

const OpacitySlider = styled.input`
  flex-grow: 1;
  margin-right: 10px;
`;

const LayerControlEntry = memo(
  ({ layer, map, defaultColor, handleColorChange }) => {
    // Fetch the current paint properties for 'fill-opacity' if the layer is already on the map
    // Otherwise, set the current opacity to null

    let currentOpacity = null;
    if (map.getLayer(layer.id)) {
      currentOpacity = map.getPaintProperty(layer.id, "fill-opacity");
    }

    // Determine if the current opacity is an expression that includes the feature state logic
    const isFeatureStateExpression =
      Array.isArray(currentOpacity) && currentOpacity[0] === "case";
    const initialOpacity = isFeatureStateExpression
      ? currentOpacity[currentOpacity.length - 1]
      : currentOpacity;

    const [visibility, setVisibility] = useState(
      layer.layout?.visibility || "visible"
    );
    const [opacity, setOpacity] = useState(initialOpacity || 1);

    const toggleVisibility = () => {
      const newVisibility = visibility === "visible" ? "none" : "visible";
      map.setLayoutProperty(layer.id, "visibility", newVisibility);
      setVisibility(newVisibility);
    };

    const handleOpacityChange = (e) => {
      const newOpacity = parseFloat(e.target.value);
      let opacityExpression;

      // Apply the logic to filter out nulls and zeroes only if it was originally present
      if (isFeatureStateExpression) {
        opacityExpression = [
          "case",
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
          0, // Set opacity to 0 for null or zero values
          newOpacity, // Set opacity to the slider value otherwise
        ];
      } else {
        opacityExpression = newOpacity;
      }
      map.setPaintProperty(layer.id, "fill-opacity", opacityExpression);
      setOpacity(newOpacity);
    };
    return (
      <LayerControlContainer>
        <LayerHeader>
          <LayerName>{layer.id}</LayerName>
          <VisibilityToggle onClick={toggleVisibility}>
            {visibility === "visible" ? <EyeIcon /> : <EyeSlashIcon />}
          </VisibilityToggle>
        </LayerHeader>
        <SelectorLabel text="Opacity" />
        <OpacityControl>
          <OpacitySlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleOpacityChange}
          />
        </OpacityControl>
        {layer.id !== "Origin Zones" && (
          <ColourSchemeDropdown
            colorStyle={layer?.metadata?.colorStyle ?? "continuous"}
            handleColorChange={handleColorChange}
          />
        )}
      </LayerControlContainer>
    );
  }
);

/**
 * MapLayerSection component is responsible for rendering the layer controls
 * for the map. It allows users to toggle the visibility and adjust the opacity
 * of map layers.
 *
 * Props:
 * - map: A reference to the map instance.
 * - layers: An array of layer objects that the component will use to create
 *   controls for each layer.
 */
export const MapLayerSection = ({ handleColorChange }) => {
  const { state } = useMapContext();
  const { map } = state;
  const [layers, setLayers] = useState([]);

  useEffect(() => {
    if (map) {
      const updateLayers = () => {
        const newLayers = map.getStyle().layers;
        // Perform deep comparison to check if layers have actually changed
        if (!_.isEqual(newLayers, layers)) {
          setLayers(
            newLayers.filter(
              (layer) =>
                (layer.type === "fill" ||
                  layer.type === "line" ||
                  layer.type === "circle") &&
                layer.source !== "default"
            )
          );
        }
      };

      map.on("styledata", updateLayers);
      return () => {
        map.off("styledata", updateLayers);
      };
    }
  }, [map, layers]); // Only re-run the effect if map or layers change

  // If map is not yet available...
  if (!map) {
    return <div>Loading map layers...</div>;
  }

  return (
    <AccordionSection title="Map layer control" defaultValue={true}>
      {layers.map((layer) => (
        <LayerControlEntry
          key={layer.id}
          layer={layer}
          map={map}
          handleColorChange={(color) => handleColorChange(color)}
        />
      ))}
    </AccordionSection>
  );
};
