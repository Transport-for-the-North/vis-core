import React, { memo, useContext, useState } from "react";
import styled from "styled-components";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { getOpacityProperty, getWidthProperty } from "utils";
import { LayerSearch } from "./LayerSearch";
import { ColourSchemeDropdown } from "../Selectors";
import { SelectorLabel } from "../Selectors/SelectorLabel";
import { ClassificationDropdown } from "../Selectors/ClassificationDropdown";
import { AppContext, PageContext } from "contexts";
import { calculateMaxWidthFactor, MAP_CONSTANTS, applyWidthFactor} from "utils/map"

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
 * Styled container for the width control.
 */
const WidthControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

/**
 * Styled input for the width slider.
 */
const WidthSlider = styled.input`
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
  ({
    layer,
    maps,
    handleColorChange,
    handleClassificationChange,
    state,
  }) => {
    const [visibility, setVisibility] = useState(
      layer.layout?.visibility || "visible"
    );
    const currentPage = useContext(PageContext);
    const appConfig = useContext(AppContext);
    const selectedMetricParamName = currentPage.config.filters.find(
      (filter) => filter.containsLegendInfo === true
    );
    const selectedPageBands = appConfig.defaultBands.find((band) => {
      if (!currentPage) return false;
      const categoryOrName = currentPage.category || currentPage.pageName;
      return band.name === categoryOrName;
    });
    const visualisation =
      currentPage.pageName.includes("Side-by-Side") ||
      currentPage.pageName.includes("Side by Side")
        ? state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]
        : state.visualisations[Object.keys(state.visualisations)[0]];

    const colorStyle = visualisation?.style?.split("-")[1] || "continuous";

    const hasDefaultBands = selectedPageBands?.metric.find(
      (metric) =>
        metric.name ===
        visualisation.queryParams[selectedMetricParamName.paramName]?.value
    );
    let currentWidthFactor = null;
    let currentOpacity = null;

    if (maps.length > 0 && maps[0].getLayer(layer.id)) {
      const opacityProp = getOpacityProperty(layer.type);
      currentOpacity = maps[0].getPaintProperty(layer.id, opacityProp);
      const widthProp = getWidthProperty(layer.type);
      currentWidthFactor = widthProp ? maps[0].getPaintProperty(layer.id, widthProp) : null;
    }

    const isFeatureStateExpression =
      Array.isArray(currentOpacity) && currentOpacity[0] === "case";
    const initialOpacity = isFeatureStateExpression
      ? currentOpacity[currentOpacity.length - 1]
      : currentOpacity;

    const isFeatureStateWidthExpression =
      Array.isArray(currentWidthFactor) && currentWidthFactor[0] === "interpolate";
    const initialWidth = isFeatureStateWidthExpression
      ? calculateMaxWidthFactor(currentWidthFactor[currentWidthFactor.length - 1])
      : currentWidthFactor;

    const [opacity, setOpacity] = useState(initialOpacity || 0.5);
    const [widthFactor, setWidth] = useState(initialWidth || 1);

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

    const handleWidthFactorChange = (e) => {
      const widthFactor = parseFloat(e.target.value);
      const widthProp = getWidthProperty(layer.type);
      let widthInterpolation, lineOffsetInterpolation, widthExpression;
    
      if (isFeatureStateWidthExpression) {
        // Apply the width factor using the applyWidthFactor function
        const result = applyWidthFactor(currentWidth, widthFactor);
        widthInterpolation = result.widthInterpolation;
        lineOffsetInterpolation = result.lineOffsetInterpolation;
      } else {
        widthExpression = 1; // Default width expression if not using feature-state
      }
    
      maps.forEach((map) => {
        if (map.getLayer(layer.id)) {
          // Set the width property
          map.setPaintProperty(layer.id, widthProp, widthInterpolation || widthExpression);
    
          // Set the line-offset property if applicable
          if (widthProp.includes("line") && lineOffsetInterpolation) {
            map.setPaintProperty(layer.id, "line-offset", lineOffsetInterpolation);
          }
        }
      });
    
      setWidth(widthFactor);
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
              colorStyle={colorStyle}
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
              classification={state.layers[layer.id]?.class_method ?? "d"}
              onChange={(value) => handleClassificationChange(value, layer.id)}
            />
            <SelectorLabel text="Link Width" />
            <WidthControl>
              <WidthSlider
                id={`width-${layer.id}`}
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={widthFactor}
                onChange={handleWidthFactorChange}
              />
            </WidthControl>
          </>
        )}
      </LayerControlContainer>
    );
  }
);