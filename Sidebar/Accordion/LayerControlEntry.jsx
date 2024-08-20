import React, { memo, useContext, useState } from 'react';
import styled from 'styled-components';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { getOpacityProperty } from 'utils';
import { LayerSearch } from './LayerSearch';
import { ColourSchemeDropdown } from '../Selectors';
import { SelectorLabel } from '../Selectors/SelectorLabel';
import { ClassificationDropdown } from '../Selectors/ClassificationDropdown';
import { AppContext } from 'contexts';

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
 * @param {Object} props.map - The MapLibre map instance.
 * @param {Function} props.handleColorChange - The function to handle color changes for the layer.
 * @param {Function} props.handleClassificationChange - The function to handle classification changes for the layer.
 * @returns {JSX.Element} The rendered LayerControlEntry component.
 */
export const LayerControlEntry = memo(({ layer, map, handleColorChange, handleClassificationChange, state }) => {
  const [visibility, setVisibility] = useState(layer.layout?.visibility || 'visible');
  const appConfig = useContext(AppContext);
  const currentPage = appConfig.appPages.find((page) => page.url === window.location.pathname);
  const selectedMetricParamName = currentPage.config.filters.find((filter) => filter.containsLegendInfo === true);
  const selectedPageBands = appConfig.defaultBands.find((band) => band.name === currentPage.category);
  const hasDefaultBands = selectedPageBands?.metric.find((metric) => metric.name === state.visualisations[Object.keys(state.visualisations)[0]].queryParams[selectedMetricParamName.paramName])

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

  const [opacity, setOpacity] = useState(initialOpacity || 0.5);

  const toggleVisibility = () => {
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty(layer.id, 'visibility', newVisibility);
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
      <LayerHeader>
        <LayerName>{layer.id}</LayerName>
        <VisibilityToggle onClick={toggleVisibility}>
          {visibility === 'visible' ? <EyeIcon /> : <EyeSlashIcon />}
        </VisibilityToggle>
      </LayerHeader>
      {layer.metadata?.path && <LayerSearch map={map} layer={layer} />}
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
              ...(hasDefaultBands && {'Default': 'd'}),
              'Quantile': 'q',
              'Equidistant': 'e',
              'Logarithmic': 'l',
              'K-Means': 'k'
            }}
            classification={state.class_method ?? 'd'}
            onChange={handleClassificationChange}
          />
        </>
      )}
    </LayerControlContainer>
  );
});