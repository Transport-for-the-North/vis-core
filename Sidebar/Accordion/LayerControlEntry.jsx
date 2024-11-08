import React, { memo, useContext, useState } from "react";
import styled from "styled-components";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { getOpacityProperty } from "utils";
import { LayerSearch } from "./LayerSearch";
import { ColourSchemeDropdown } from "../Selectors";
import { SelectorLabel } from "../Selectors/SelectorLabel";
import { ClassificationDropdown } from "../Selectors/ClassificationDropdown";
import { AppContext, PageContext } from "contexts";

/**
 * Styled container for the layer control entry.
 */
const LayerControlContainer = styled.div`
  margin-bottom: 10px;
`;

/**
 * Styled header for the layer control entry.
 */
const LayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Styled name for the layer.
 */
const LayerName = styled.span`
  font-weight: bold;
`;

/**
 * Styled button for toggling layer visibility.
 */
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

/**
 * Styled container for the opacity control.
 */
const OpacityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

/**
 * Styled input for the opacity slider.
 */
const OpacitySlider = styled.input`
  flex-grow: 1;
  margin-right: 10px;
`;

/**
 * LayerControlEntry component represents a single layer control entry in the map layer control panel.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.layer - The layer object containing information about the map layer.
 * @param {Array} props.maps - An array of MapLibre map instances.
 * @param {Function} props.handleColorChange - The function to handle color changes for the layer.
 * @param {Function} props.handleClassificationChange - The function to handle classification changes for the layer.
 * @returns {JSX.Element} The rendered LayerControlEntry component.
 */
export const LayerControlEntry = memo(
  ({ layer, maps, handleColorChange, handleClassificationChange, state }) => {
    const [visibility, setVisibility] = useState(
      layer.layout?.visibility || "visible"
    );
    const currentPage = useContext(PageContext);
    const appConfig = useContext(AppContext);
    const selectedMetricParamName = currentPage.config.filters.find(
      (filter) => filter.containsLegendInfo === true
    );
    const selectedPageBands = appConfig.defaultBands.find(
      (band) => band.name === currentPage.category
    );
    const visualisation = currentPage.pageName.includes("Side-by-Side") || currentPage.pageName.includes("Side by Side")
      ? state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]
      : state.visualisations[Object.keys(state.visualisations)[0]];
    const hasDefaultBands = selectedPageBands?.metric.find(
      (metric) =>
        metric.name ===
        visualisation.queryParams[selectedMetricParamName.paramName]
    );
    let currentOpacity = null;

    if (maps.length > 0 && maps[0].getLayer(layer.id)) {
      const opacityProp = getOpacityProperty(layer.type);
      currentOpacity = maps[0].getPaintProperty(layer.id, opacityProp);
    }

    const isFeatureStateExpression =
      Array.isArray(currentOpacity) && currentOpacity[0] === "case";
    const initialOpacity = isFeatureStateExpression
      ? currentOpacity[currentOpacity.length - 1]
      : currentOpacity;

    const [opacity, setOpacity] = useState(initialOpacity || 0.5);

    const toggleVisibility = () => {
      const newVisibility = visibility === "visible" ? "none" : "visible";
      maps.forEach((map) => {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(layer.id, "visibility", newVisibility);
        }
      });
      setVisibility(newVisibility);
    };

    const handleOpacityChange = (e) => {
      const newOpacity = parseFloat(e.target.value);
      const opacityProp = getOpacityProperty(layer.type);
      let opacityExpression;

      if (isFeatureStateExpression) {
        opacityExpression = [
          "case",
          ["in", ["feature-state", "value"], ["literal", [0, null]]],
          0,
          newOpacity,
        ];
      } else {
        opacityExpression = newOpacity;
      }

      maps.forEach((map) => {
        if (map.getLayer(layer.id)) {
          map.setPaintProperty(layer.id, opacityProp, opacityExpression);
        }
      });
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
        {layer.metadata?.path && <LayerSearch map={maps[0]} layer={layer} />}
        <SelectorLabel text="Opacity" />
        <OpacityControl>
          <OpacitySlider
            id={`opacity-${layer.id}`}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={handleOpacityChange}
          />
        </OpacityControl>
        {layer.metadata?.isStylable && (
          <>
            <ColourSchemeDropdown
              colorStyle={layer?.metadata?.colorStyle ?? "continuous"}
              handleColorChange={handleColorChange}
              layerName={layer.id}
            />
            <ClassificationDropdown
              classType={{
                ...(hasDefaultBands && { Default: "d" }),
                Quantile: "q",
                Equidistant: "e",
                Logarithmic: "l",
                "K-Means": "k",
              }}
              classification={state.class_method ?? "d"}
              onChange={handleClassificationChange}
            />
          </>
        )}
      </LayerControlContainer>
    );
  }
);