import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid"; // Assuming you're using Heroicons
import _ from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import { AccordionSection } from "Components";
import { useMapContext } from "hooks";
import { ColourSchemeDropdown } from "../Selectors";
import { SelectorLabel } from "../Selectors/SelectorLabel";
import { getOpacityProperty } from "utils";
import { ClassificationDropdown } from "../Selectors/ClassificationDropdown";

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

/**
 * A memoized component representing a single layer control entry in a map layer control panel.
 * @property {object} layer - The layer object containing information about the map layer.
 * @property {object} map - The map object on which the layer is rendered.
 * @property {string} defaultColor - The default color for the layer.
 * @property {Function} handleColorChange - The function to handle color changes for the layer.
 * @returns {JSX.Element} The LayerControlEntry component.
 */
const LayerControlEntry = memo(
  ({ layer, map, defaultColor, handleColorChange, handleClassificationChange }) => {
    // Fetch the current paint properties for 'fill-opacity' if the layer is already on the map
    // Otherwise, set the current opacity to null

    const classificationMethods = {
      'Equidistant': 'e',
      'Quantile': 'q',
      'Logarithmic': 'l',
      'K-Means': 'k'
    }

    let currentOpacity = null;

    if (map.getLayer(layer.id)) {
      const opacityProp = getOpacityProperty(layer.type);
      currentOpacity = map.getPaintProperty(layer.id, opacityProp);
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
    const [opacity, setOpacity] = useState(initialOpacity || 0.5);

    const toggleVisibility = () => {
      const newVisibility = visibility === "visible" ? "none" : "visible";
      map.setLayoutProperty(layer.id, "visibility", newVisibility);
      setVisibility(newVisibility);
    };

    const handleOpacityChange = (e) => {
      const newOpacity = parseFloat(e.target.value);
      const opacityProp = getOpacityProperty(layer.type);
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
      map.setPaintProperty(layer.id, opacityProp, opacityExpression);
      setOpacity(newOpacity);
    };
    return (
      <LayerControlContainer>
        <ClassificationDropdown 
          classType={classificationMethods}
          onChange={handleClassificationChange}
        />
        <LayerHeader>
          <LayerName>{layer.id}</LayerName>
          <VisibilityToggle onClick={toggleVisibility}>
            {visibility === "visible" ? <EyeIcon /> : <EyeSlashIcon />}
          </VisibilityToggle>
        </LayerHeader>
        <SelectorLabel text="Opacity" />
        <OpacityControl>
          <OpacitySlider
            id={"opacity-" + layer.id}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleOpacityChange}
          />
        </OpacityControl>
        {layer.type !== "line" && <ColourSchemeDropdown
          colorStyle={layer?.metadata?.colorStyle ?? "continuous"}
          handleColorChange={handleColorChange}
          layerName={layer.id}
        />}
      </LayerControlContainer>
    );
  }
);

/**
 * Component representing a section for controlling map layers.
 * @property {Function} handleColorChange - The function to handle color changes for the layers.
 * @returns {JSX.Element} The MapLayerSection component.
 */
export const MapLayerSection = ({ handleColorChange, handleClassificationChange }) => {
  const { state } = useMapContext();
  const { map } = state;
  const [layers, setLayers] = useState([]);

  /**
   * Updates the layers based on the current map style.
   */
  const updateLayers = useCallback(() => {
    const newLayers = map.getStyle().layers;
    // Perform deep comparison to check if layers have actually changed
    if (!_.isEqual(newLayers, layers)) {
      const filteredLayers = newLayers.filter(
        (layer) =>
          (layer.type === "fill" ||
        layer.type === "line" ||
        layer.type === "circle") &&
        layer.source !== "default" &&
        layer.metadata?.isStylable
      );
      setLayers(filteredLayers);
    }
  }, [layers, map, setLayers]);

  useEffect(() => {
    if (map) {
      map.on("styledata", updateLayers);
      return () => {
        map.off("styledata", updateLayers);
      };
    }
  }, [map, updateLayers]); // Only re-run the effect if map or layers change

  // If map is not yet available...
  if (!map) {
    return <div>Loading map layers...</div>;
  }
  // console.log(layers)

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
          handleColorChange={(color) => handleColorChange(color)}
          handleClassificationChange={(classType) => handleClassificationChange(classType)}
        />
      ))}
    </AccordionSection>
  );
};
