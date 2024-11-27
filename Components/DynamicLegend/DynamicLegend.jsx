import { forEach } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { convertStringToNumber, numberWithCommas } from "utils";
import { useMapContext } from "hooks";

// Styled components for the legend UI
const LegendContainer = styled.div`
  --scrollbar-width: 4px; /* Default scrollbar width for Webkit browsers */
  --firefox-scrollbar-width: 4px; /* Approximate scrollbar width for Firefox */

  display: flex;
  flex-direction: row; /* Row-based flex layout */
  gap: 8px;
  position: absolute;
  bottom: 40px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  /* Adjust padding-right to account for scrollbar width */
  padding-right: calc(15px - var(--scrollbar-width)); /* For WebKit browsers */
  box-sizing: border-box; /* Include padding and border in width */
  border-radius: 10px;
  z-index: 10;
  max-height: 25vh;
  overflow-y: auto;
  overflow-x: hidden; /* Hide horizontal scrollbar if any */
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-family: "Hanken Grotesk", sans-serif;
  font-size: medium;

  /* WebKit-based browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: var(--scrollbar-width);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent; /* Default color */
    border-radius: 10px;
    background-clip: padding-box;
    transition: background-color 0.3s ease-in-out;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: darkgrey; /* Color when hovered */
  }

  /* Firefox-specific styles */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent; /* Default colors */
  /* Adjust padding-right to account for scrollbar in Firefox */
  padding-right: calc(15px - var(--firefox-scrollbar-width));

  &:hover {
    scrollbar-color: darkgrey transparent; /* Change thumb color on hover */
  }
`;

const LegendItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 6px;
`;

const LegendTitle = styled.div`
  font-weight: bold;
  text-align: left;
  margin-bottom: 2px;
  max-width: 150px;
  font-size: 0.9em;
`;

const LegendSubtitle = styled.h2`
  font-weight: normal;
  text-align: left;
  margin-top: 2px;
  margin-bottom: 2px;
  font-size: small;
  font-style: italic;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2px;
  font-size: medium;
`;

const CircleSwatch = styled.div`
  width: ${(props) => props.diameter}px;
  height: ${(props) => props.diameter}px;
  background-color: ${(props) => props.color};
  border: 1px solid #333;
  border-radius: 50%;
  margin-right: 5px;
`;

const LineSwatch = styled.div`
  width: 50px;
  height: ${(props) => props.height}px;
  background-color: ${(props) => props.color};
  margin-right: 5px;
`;

const PolygonSwatch = styled.div`
  width: 50px;
  height: 20px;
  background-color: ${(props) => props.color};
  border: 1px solid #333;
  margin-right: 5px;
`;

const LegendLabel = styled.span`
  font-size: small;
`;

const LegendDivider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 6px 0;
`;

/**
 * Interpolates widths for color stops based on width stops.
 *
 * @param {Array} colorStops - An array of color stop objects, each with a `value` property.
 * @param {Array} widthStops - An array of width stop objects, each with a `value` and `width` property.
 * @param {string} style - The style of the map, e.g., 'diverging'.
 * @returns {Array} An array of objects with `value` and `width` properties, where `width` is the interpolated diameter.
 * @throws Will throw an error if less than two color stops or width stops are provided.
 *
 * @example
 * const colorStops = [{ value: 1 }, { value: 2 }];
 * const widthStops = [{ value: 1, width: 5 }, { value: 2, width: 10 }];
 * const result = interpolateWidths(colorStops, widthStops);
 * // result: [{ value: 1, width: 10 }, { value: 2, width: 20 }]
 */
function interpolateWidths(colorStops, widthStops, type) {
  if (!colorStops || colorStops.length < 2) {
    throw new Error('At least two color stops are required.');
  }
  if (!widthStops || widthStops.length < 2) {
    throw new Error('At least two width stops are required.');
  }

  const convertedWidthStops = widthStops.map(stop => ({
    width: stop.width,
    value: convertStringToNumber(stop.value)
  }));

  const widths = [];
  for (let i = 0; i < colorStops.length; i++) {
    const value = colorStops[i].value;
    const convertedValue = convertStringToNumber(value);
    const width = interpolateWidthAtValue(convertedWidthStops, Math.abs(convertedValue));
    widths.push({ value, width: type === 'circle' ? width * 2 : width });
  }

  return widths;
}


/**
 * Interpolates the width at a given value based on width stops.
 *
 * @param {Array} widthStops - An array of width stop objects, each with a `value` and `width` property.
 * @param {number} value - The value at which to interpolate the width.
 * @returns {number} The interpolated width.
 *
 * @example
 * const widthStops = [{ value: 1, radius: 5 }, { value: 2, width: 10 }];
 * const width = interpolateWidthAtValue(widthStops, 1.5);
 * // width: 7.5
 */
function interpolateWidthAtValue(widthStops, value) {
  if (value <= widthStops[0].value) {
    return widthStops[0].width;
  }

  if (value >= widthStops[widthStops.length - 1].value) {
    return widthStops[widthStops.length - 1].width;
  }

  for (let i = 0; i < widthStops.length - 1; i++) {
    const startStop = widthStops[i];
    const endStop = widthStops[i + 1];

    if (value >= startStop.value && value <= endStop.value) {
      const ratio =
        (value - startStop.value) / (endStop.value - startStop.value);
      const width =
        startStop.width + ratio * (endStop.width - startStop.width);
      return width;
    }
  }

  return widthStops[widthStops.length - 1].width;
}

/**
 * Interprets a color expression from a map style specification and returns a list of color stops.
 * A color expression can be a simple string representing a color, or an array that defines
 * a color interpolation or match expression.
 *
 * @param {string|array} expression - The color expression to interpret. This can be a simple
 *                                    color string or an array representing an 'interpolate',
 *                                    'step', or 'match' expression.
 * @returns {array|null} An array of objects with 'value' and 'color' properties representing
 *                       the color stops, or null if the expression cannot be interpreted.
 *
 * @example
 * // Simple color string
 * const colorString = '#FF5733';
 * const result = interpretColorExpression(colorString);
 * // result: [{ color: '#FF5733' }]
 * 
 * @example
 * // Interpolate expression
 * const interpolateExpression = ['interpolate', ['linear'], ['zoom'], 5, '#F00', 10, '#0F0'];
 * const result = interpretColorExpression(interpolateExpression);
 * // result: [{ value: 5, color: '#F00' }, { value: 10, color: '#0F0' }]
 *
 * @example
 * // Interpolate expression
 * const interpolateExpression = ['interpolate', ['linear'], ['zoom'], 5, '#F00', 10, '#0F0'];
 * const result = interpretColorExpression(interpolateExpression);
 * // result: [{ value: 5, color: '#F00' }, { value: 10, color: '#0F0' }]
 * 
 * @example
 * // Step expression
 * const stepExpression = ['step', ['zoom'], '#F00', 5, '#0F0'];
 * const result = interpretColorExpression(stepExpression);
 * // result: [{ value: 5, color: '#0F0' }]
 * 
 *  @example
 * // Match expression
 * const matchExpression = ['match', ['get', 'property'], 'value1', '#F00', 'value2', '#0F0', '#FFF'];
 * const result = interpretColorExpression(matchExpression);
 * // result: [{ value: 'value1', color: '#F00' }, { value: 'value2', color: '#0F0' }, { value: null, color: '#FFF' }]
 */

const interpretColorExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === "string") {
    return [{ color: expression }];
  } else if (Array.isArray(expression)) {
    // Handle different types of expressions
    switch (expression[0]) {
      case "interpolate":
      case "step":
        // Extract stops from the expression
        const stops = expression.slice(3);
        const colorStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          colorStops.push({
            value: numberWithCommas(stops[i]),
            color: stops[i + 1],
          });
        }
        return colorStops;
      case "case":
        // Extract pairs of case values and colors
        const caseValues = expression.slice(2);
        caseValues.splice(1, 1);
        const stop = [-1, 1, 0];
        const caseColorStops = [];
        forEach(caseValues, (value, index) => {
          caseColorStops.push({
            value: stop[index],
            color: value,
          });
        });
        return caseColorStops;
      case "match":
        // Extract pairs of match values and colors
        const matchValues = expression.slice(2, -1);
        const matchColorStops = [];
        for (let i = 0; i < matchValues.length; i += 2) {
          matchColorStops.push({
            value: matchValues[i],
            color: matchValues[i + 1],
          });
        }
        return matchColorStops;
      default:
        return null;
    }
  }
  return null;
};

/**
 * Interprets a width expression from a map style specification and calculates
 * intermediate width stops. The function assumes linear interpolation between stops.
 * The number of intermediate stops is dynamic and can be specified.
 *
 * @param {Array|number} expression - The width expression from the map style.
 * @param {number} [numInterpolatedStops=4] - The number of intermediate stops to calculate.
 * @returns {Array|null} - An array of width stops or null if the expression is invalid.
 *
 * @example
 * // Simple width value
 * const widthValue = 2;
 * const result = interpretWidthExpression(widthValue);
 * // result: [{ width: 2 }]
 * 
 * @example
 * // Interpolate expression
 * const interpolateExpression = ['interpolate', ['linear'], ['zoom'], 5, 1, 10, 5];
 * const result = interpretWidthExpression(interpolateExpression, 6);
 * // result: [{ value: 5, width: 1 }, { value: 6.8, width: 3.4 }, { value: 8.6, width: 5 }]
 * 
 * @example
 * // Step expression
 * const stepExpression = ['step', ['zoom'], 1, 5, 3];
 * const result = interpretWidthExpression(stepExpression);
 * // result: [{ value: 1, width: 5 }]
 */
const interpretWidthExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === "number") {
    return [{ width: expression }];
  } else if (Array.isArray(expression)) {
    if (expression.some((item) => Array.isArray(item) && item.includes("zoom"))) {
      return [];
    }
    switch (expression[0]) {
      case "interpolate":
      case "step":
        const stops = expression.slice(3);
        const widthStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          widthStops.push({
            value: numberWithCommas(stops[i]),
            width: stops[i + 1],
          });
        }
        return widthStops;
      default:
        return [];
    }
  }
  return null;
};

/**
 * DynamicLegend is a React component that renders a map legend based on the styles of map layers.
 * It listens for changes in the map's style and updates the legend items accordingly. Each legend
 * item displays color and/or width swatches along with labels indicating the corresponding values.
 * 
 * @component
 * @property {Object} map - The map instance from Mapbox or MapLibre.
 * @returns {JSX.Element|null} The rendered legend component or null if there are no legend items.
 */
export const DynamicLegend = ({ map }) => {
  const [legendItems, setLegendItems] = useState([]);
  const { state } = useMapContext();

  useEffect(() => {
    if (!map) return;

    const updateLegend = () => {
      const visualisationKey = Object.keys(state.visualisations)[0];
      const visualisation = state.visualisations[visualisationKey];
      const legendTexts = visualisation?.legendText || [];
      const layers = map.getStyle().layers;

      const items = layers
        .filter((layer) => {
          const isStylableOrShouldShow = layer.metadata && (layer.metadata.isStylable || layer.metadata.shouldShowInLegend);
          const isWithinZoomRange = (layer.minzoom === undefined || state.currentZoom >= layer.minzoom) &&
                                    (layer.maxzoom === undefined || state.currentZoom <= layer.maxzoom);
          return isStylableOrShouldShow && isWithinZoomRange;
        })
        .map((layer, index) => {
          const title = layer.id;
          let displayValue = title;
          let legendSubtitleText = "";

          if (layer.metadata.isStylable) {
            const legendFilter = state?.filters?.find(
              (filter) => filter.containsLegendInfo === true
            );

            if (legendFilter) {
              const filterParamName = legendFilter.paramName;
              const filter = state.filters.find(
                (filter) => filter.paramName === filterParamName
              );
              const filterValues = filter?.values.values || [];
              const defaultDisplayValue =
                filterValues[0]?.displayValue || title;
              const defaultLegendSubtitleText =
                filterValues[0]?.legendSubtitleText || "";

              displayValue =
                legendTexts[index]?.displayValue || defaultDisplayValue;
              legendSubtitleText =
                legendTexts[index]?.legendSubtitleText ||
                defaultLegendSubtitleText;
            } else {
              displayValue = legendTexts[index]?.displayValue || title;
              legendSubtitleText =
                legendTexts[index]?.legendSubtitleText || "";
            }
          }

          const paintProps = layer.paint;
          let colorStops = interpretColorExpression(
            paintProps["line-color"] ||
            paintProps["circle-color"] ||
            paintProps["fill-color"]
          );
          let widthStops = interpretWidthExpression(
            paintProps["line-width"] || paintProps["circle-radius"]
          );
          
          if (layer.type === "circle" && colorStops && widthStops?.length > 0 && colorStops.length !== widthStops.length) {
            widthStops = interpolateWidths(colorStops, widthStops, layer.type);
          }
          
          if (layer.type === "line" && layer.metadata.colorStyle === "diverging" && colorStops.length === 3) {
            const negativeColor = colorStops.find(stop => stop.value === -1)?.color;
            const positiveColor = colorStops.find(stop => stop.value === 1)?.color;
          
            const negativeWidthStops = widthStops
              .filter(stop => convertStringToNumber(stop.value) > 0)
              .map(stop => ({
                ...stop,
                value: `-${stop.value}` // Add a '-' to the start of the value
              }))
              .reverse();
          
            widthStops = [...negativeWidthStops, ...widthStops];
            // Ensure there is a 0 value in widthStops
            if (!widthStops.some(stop => convertStringToNumber(stop.value) === 0)) {
              widthStops.push({ value: 0, width: 0 });
              widthStops = widthStops.sort((a, b) => convertStringToNumber(a.value) - convertStringToNumber(b.value));
            }
          
            // Assign colors based on the value sign
            colorStops = widthStops.map(stop => ({
              ...stop,
              color: convertStringToNumber(stop.value) < 0 ? negativeColor : positiveColor
            }));
          }
          
          return {
            title: displayValue,
            subtitle: legendSubtitleText,
            colorStops: colorStops || [],
            widthStops: widthStops || [],
            type: layer.type,
            style: layer.metadata.colorStyle,
          };
        });
      setLegendItems(items);
    };

    map.on("styledata", updateLegend);

    updateLegend();

    return () => {
      map.off("styledata", updateLegend);
    };
  }, [state.filters, map, state.visualisations, state.currentZoom]);

  if (legendItems.length === 0) {
    return null;
  }
  return (
    <LegendContainer>
      {legendItems.map((item, index) => (
        <LegendItemContainer key={index}>
          <LegendTitle>{item.title}</LegendTitle>
          <LegendSubtitle>{item.subtitle}</LegendSubtitle>
          {item.colorStops &&
            item.widthStops &&
            item.colorStops.map((stop, idx) => (
              <LegendItem key={idx}>
                {item.type === "circle" ? (
                  <CircleSwatch
                    diameter={item.widthStops[idx]?.width || 10}
                    color={stop.color}
                  />
                ) : item.type === "line" ? (
                  <LineSwatch
                    height={item.widthStops[idx]?.width || 2}
                    color={stop.color}
                  />
                ) : item.type === "fill" ? (
                  <PolygonSwatch
                    color={stop.color}
                  />
                ) : null}
                <LegendLabel>
                  {stop.value !== undefined ? `${stop.value}` : "Value"}
                </LegendLabel>
              </LegendItem>
            ))}
          {index < legendItems.length - 1 && <LegendDivider />}
        </LegendItemContainer>
      ))}
    </LegendContainer>
  );
};