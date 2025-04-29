import React, { memo, useContext, useState, useEffect } from "react";
import styled from "styled-components";
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
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
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
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
 * Container for the left section of the header.
 * Made clickable to toggle expansion.
 */
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer; /* Make cursor a pointer to indicate clickability */
`;

/**
 * Styled span for expanding/collapsing layer details.
 */
const ExpandCollapseToggle = styled.span`
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
    color: #555;
  }
`;

/**
 * Styled name for the layer.
 */
const LayerName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`;

/**
 * Styled button for toggling layer visibility.
 */
const VisibilityToggle = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #555;
  }
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
 * Styled input for the slider.
 */
const Slider = styled.input`
  flex-grow: 1;
  margin-right: 0.5rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

/**
 * Styled label for form controls.
 */
const ControlLabel = styled.label`
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: #333;
`;

/**
 * Styled span for displaying the opacity value.
 */
const SliderValue = styled.span`
  font-size: 0.9rem;
  width: 36px;
  text-align: right;
`;

/**
 * Styled container for collapsible content with animation.
 */
const CollapsibleContent = styled.div`
  overflow: hidden;
  max-height: ${({ isExpanded }) => (isExpanded ? "1000px" : "0")};
  opacity: ${({ isExpanded }) => (isExpanded ? "1" : "0")};
  transition: max-height 0.3s ease, opacity 0.3s ease;
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

    // State for whether the layer details are expanded
    const [isExpanded, setIsExpanded] = useState(() => {
      // Retrieve the expanded state from localStorage during initial render
      const storedState = localStorage.getItem(
        `layer-${layer.id}-isExpanded`
      );
      return storedState !== null ? JSON.parse(storedState) : true;
    });

    // Update localStorage whenever isExpanded changes
    useEffect(() => {
      localStorage.setItem(
        `layer-${layer.id}-isExpanded`,
        JSON.stringify(isExpanded)
      );
    }, [isExpanded, layer.id]);
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

    const shouldHaveOpacityControl = layer.metadata?.shouldHaveOpacityControl ?? true;
    const enforceNoColourSchemeSelector = layer.metadata?.enforceNoColourSchemeSelector ?? false;
    const enforceNoClassificationMethod = layer.metadata?.enforceNoClassificationMethod ?? false;

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

    // State for opacity of the layer
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

    /**
     * Handle keypress events for accessibility.
     * @param {Object} e - The event object.
     */
    const handleKeyPress = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsExpanded(!isExpanded);
        e.preventDefault();
      }
    };

    const handleWidthFactorChange = (e) => {
      const widthFactor = parseFloat(e.target.value);
      const widthProp = getWidthProperty(layer.type);
      let widthInterpolation, lineOffsetInterpolation, widthExpression;
    
      if (isFeatureStateWidthExpression) {
        // Apply the width factor using the applyWidthFactor function
        const result = applyWidthFactor(currentWidthFactor, widthFactor);
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
          {/* HeaderLeft now handles click and keypress to toggle expansion */}
          <HeaderLeft
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex="0"
            aria-expanded={isExpanded}
            onKeyDown={handleKeyPress}
          >
            {/* Expand/Collapse Toggle (now a span) */}
            <ExpandCollapseToggle>
              {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
            </ExpandCollapseToggle>
            {/* Layer Name */}
            <LayerName>{layer.id}</LayerName>
          </HeaderLeft>
          {/* Visibility Toggle */}
          <VisibilityToggle onClick={toggleVisibility}>
            {visibility === "visible" ? (
              <EyeIcon aria-label="Hide layer" title="Hide layer" />
            ) : (
              <EyeSlashIcon aria-label="Show layer" title="Show layer" />
            )}
          </VisibilityToggle>
        </LayerHeader>
        {/* Collapsible Content with Animation */}
        <CollapsibleContent isExpanded={isExpanded}>
          {/* Layer Search (if applicable) */}
          {layer.metadata?.path && (
            <LayerSearch map={maps[0]} layer={layer} />
          )}
          {/* Opacity Control */}
          {shouldHaveOpacityControl && (<OpacityControl>
            <ControlLabel htmlFor={`opacity-${layer.id}`}>
              Opacity
            </ControlLabel>
            <Slider
              id={`opacity-${layer.id}`}
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={handleOpacityChange}
            />
            <SliderValue>{(opacity * 100).toFixed(0)}%</SliderValue>
          </OpacityControl>)}
          {/* Width Control (if applicable) */}
          {isFeatureStateWidthExpression && ( 
                <>
                <WidthControl>
                <ControlLabel htmlFor={`width-${layer.id}`}>
                  Width factor
                </ControlLabel>
                
                  <Slider
                    id={`width-${layer.id}`}
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={widthFactor}
                    onChange={handleWidthFactorChange}
                  />
                  <SliderValue>{(widthFactor).toFixed(1)}</SliderValue>
                </WidthControl>
                </>)}
          {/* Color Scheme and Classification (if stylable) */}
          {layer.metadata?.isStylable && (
            <div style={{ marginTop: "1rem" }}>
              {!enforceNoColourSchemeSelector && <ColourSchemeDropdown
                colorStyle={colorStyle}
                handleColorChange={handleColorChange}
                layerName={layer.id}
              />}
              {!enforceNoClassificationMethod && <ClassificationDropdown
                classType={{
                  Default: "d",
                  Quantile: "q",
                  Equidistant: "e",
                  Logarithmic: "l",
                  "K-Means": "k",
                }}
                classification={
                  state.layers[layer.id]?.class_method ?? "d"
                }
                onChange={(value) =>
                  handleClassificationChange(value, layer.id)
                }
              />}
          </div>
          )}
        </CollapsibleContent>
      </LayerControlContainer>
    );
  }
);