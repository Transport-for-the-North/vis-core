import { forEach } from "lodash";
import React, { useEffect, useState, useRef, useContext } from "react";
import styled from "styled-components";
import { convertStringToNumber, numberWithCommas } from "utils";
import { useMapContext } from "hooks";
import { PageContext, useAppContext } from "contexts";

// Styled components for the legend UI
const LegendContainer = styled.div`
  --scrollbar-width: 4px; /* Default scrollbar width for Webkit browsers */
  --firefox-scrollbar-width: 4px; /* Approximate scrollbar width for Firefox */  
  
  display: inline-flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 0 15px;
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
  min-width: 0;
  max-height: 35vh;
  max-width: 80vw;
  overflow: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-family: "Hanken Grotesk", sans-serif;
  font-size: medium;
  
  /* Custom scrollbar styling for Webkit-based browsers */
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
  @-moz-document url-prefix() {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent; /* Default color */
    padding-right: calc(15px - var(--firefox-scrollbar-width)); /* Adjust padding for Firefox */
    &:hover {
      scrollbar-color: darkgrey transparent; /* Color when hovered */
    }
  }
`;

const LegendItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const LegendGroup = styled.div`
  width: max-content;
  min-width: 0;
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
  min-width: 0;
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
  width: 15px;
  height: 15px;
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
  margin: 4px;
  max-width: 80%;
  width: 80px;
`;

/**
* Interpolates widths for color stops based on width stops.
*
* @param {Array} colorStops - An array of color stop objects, each with a `value` property.
* @param {Array} widthStops - An array of width stop objects, each with a `value` and `width` property.
* @param {string} type - The type of the layer (e.g., 'circle', 'line').
* @returns {Array} An array of objects with `value` and `width` properties, where `width` is the interpolated diameter.
* @throws Will throw an error if less than two color stops or width stops are provided.
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
*/
export const interpretColorExpression = (expression) => {
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
* @returns {Array|null} - An array of width stops or null if the expression is invalid.
*/
export const interpretWidthExpression = (expression) => {
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
  const { defaultBands } = useAppContext();
  const legendRef = useRef(null);
  const currentPage = useContext(PageContext);
  const pageCategory = currentPage.category || currentPage.pageName;

  useEffect(() => {
    if (!map) return;

    const updateLegend = () => {
      const layers = map.getStyle().layers;

      const items = layers
        .filter((layer) => {
          const isStylableOrShouldShow = layer.metadata && (layer.metadata.isStylable || layer.metadata.shouldShowInLegend);
          const isWithinZoomRange = (layer.minzoom === undefined || state.currentZoom >= layer.minzoom) &&
            (layer.maxzoom === undefined || state.currentZoom <= layer.maxzoom);
          return isStylableOrShouldShow && isWithinZoomRange;
        })
        .map((layer, index) => {
          // Get the visualisation associated with this layer via joinLayer
          const visualisationKey = Object.keys(state.visualisations).find(key => {
            return state.visualisations[key].joinLayer === layer.id;
          });
          const visualisation = state.visualisations[visualisationKey];
          // Get legendText from visualisation
          const legendText = visualisation?.legendText || [];

          const title = layer.id;
          let displayValue = title;
          let legendSubtitleText = "";

          if (layer.metadata.isStylable) {
            const legendFilter = state?.filters?.find(
              (filter) => filter.containsLegendInfo === true
            );

            if (legendFilter) {
              const filterParamName = legendFilter.paramName;
              const filterObj = state.filters.find(
                (filter) => filter.paramName === filterParamName
              );
              const filterValues = filterObj?.values?.values || [];
              const defaultDisplayValue = filterValues[0]?.displayValue || title;
              const defaultLegendSubtitleText =
                filterValues[0]?.legendSubtitleText || "";

              displayValue =
                legendText[0]?.displayValue || defaultDisplayValue;
              legendSubtitleText =
                legendText[0]?.legendSubtitleText ||
                defaultLegendSubtitleText;
            } else {
              displayValue = legendText[0]?.displayValue || title;
              legendSubtitleText =
                legendText[0]?.legendSubtitleText || "";
            }
          }
          
          // Look up custom labels from defaultBands using pageCategory
          let customLabels = null;
          if (visualisation && visualisation.queryParams) {
            const legendFilter = state?.filters?.find(
              (filter) => filter.containsLegendInfo === true
            );
            if (legendFilter) {
              const filterParamName = legendFilter.paramName;
              const metricName = visualisation.queryParams[filterParamName]?.value;
              const defaultBandEntry = defaultBands.find(band => band.name === pageCategory);
              if (defaultBandEntry) {
                const metricDefinition = defaultBandEntry.metric.find(
                  m => m.name === metricName
                );
                if (metricDefinition && metricDefinition.labels && metricDefinition.labels.length > 0) {
                  customLabels = metricDefinition.labels;
                }
              }
            }
          }
          
          const invertColorScheme = state.layers[layer.id]?.invertedColorScheme === true;
          const trseLabel = state.layers[layer.id]?.trseLabel === true;
          const paintProps = layer.paint;
          // Interpret expressions
          let colorStops = interpretColorExpression(
            paintProps["line-color"] ||
            paintProps["circle-color"] ||
            paintProps["fill-color"]
          );
          let widthStops = interpretWidthExpression(
            paintProps["line-width"] || paintProps["circle-radius"]
          );

          // Invert color and width stops if necessary
          if (invertColorScheme && colorStops) {
            colorStops = colorStops.slice().reverse();
            if (widthStops) {
              widthStops = widthStops.slice().reverse();
            }
          }
          if (
            layer.type === "circle" &&
            colorStops &&
            widthStops?.length > 0 &&
            colorStops.length !== widthStops.length
          ) {
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
          
          // Process legend entries
          let legendEntries = [];
          if (colorStops && colorStops.length > 0) {
            const length = trseLabel ? colorStops.length - 1 : colorStops.length;
            for (let idx = 0; idx < length; idx++) {
              const stop = colorStops[idx];
              const nextStop = colorStops[idx + 1];
              const widthStop = widthStops ? widthStops[idx] : null;
              let label;
              if (customLabels && customLabels.length === length) {
                label = customLabels[idx];
              } else if (trseLabel && nextStop) {
                const startValue = stop.value;
                const endValue = nextStop.value;
                if (idx === 0) {
                  label = `${startValue}-${endValue} (Lowest Risk of TRSE)`;
                } else if (idx === length - 1) {
                  label = `${startValue}-${endValue} (Highest Risk of TRSE)`;
                } else {
                  label = `${startValue}-${endValue}`;
                }
              } else {
                label = stop.value;
              }
              legendEntries.push({
                color: stop.color,
                width: widthStop ? widthStop.width : null,
                label,
                type: layer.type,
              });
            }
          }
          // If no legend entries or exactly one, consider this a default style scenario.
          let noStyle = false;
          if (legendEntries.length <= 1) {
            noStyle = true;
            if (legendEntries.length === 0) {
              const defaultColor =
                paintProps["line-color"] ||
                paintProps["circle-color"] ||
                paintProps["fill-color"] ||
                "#000";
              let defaultWidth;
              if (layer.type === "circle") {
                defaultWidth = paintProps["circle-radius"]
                  ? paintProps["circle-radius"] * 2
                  : 10;
              } else if (layer.type === "line") {
                defaultWidth = paintProps["line-width"] || 2;
              } else {
                defaultWidth = 10;
              }
              legendEntries.push({
                color: defaultColor,
                width: defaultWidth,
                label: title,
                type: layer.type,
              });
            } else {
              // If there is exactly one entry, force the label to be the layer name.
              legendEntries[0].label = title;
            }
          }
          
          return {
            layerId: layer.id,
            title: displayValue,
            subtitle: legendSubtitleText,
            legendEntries,
            trseLabel,
            type: layer.type,
            style: layer.metadata.colorStyle,
            noStyle,
          };
        });
      setLegendItems(items);
    };
  
    map.on("styledata", updateLegend);
  
    updateLegend();
  
    return () => {
      map.off("styledata", updateLegend);
    };
  }, [state.filters, map, state.visualisations, state.currentZoom, currentPage]);
  
  // This effect forces the container's width to update after legendItems change,
  // working around Firefox's flex-wrap column bug.
  useEffect(() => {
    if (legendRef.current) {
      // Reset width so container can shrink-wrap its content naturally.
      legendRef.current.style.width = "auto";
      
      // Calculate the scrollbar width:
      // offsetWidth includes scrollbar, clientWidth does not.
      const scrollbarWidth = legendRef.current.offsetWidth - legendRef.current.clientWidth;
      
      // Get the container's natural content width plus the scrollbar width.
      const newWidth = legendRef.current.scrollWidth + scrollbarWidth;
      legendRef.current.style.width = `${newWidth}px`;
    }
  }, [legendItems]);
  
  if (legendItems.length === 0) {
    return null;
  }
  
  return (
    <LegendContainer ref={legendRef}>
      {legendItems.map((item, index) => (
        <LegendGroup key={item.layerId}>
          <LegendItemContainer>
            {item.noStyle ? (
              item.legendEntries.map((entry, idx) => (
                <LegendItem key={idx}>
                  {item.type === "circle" ? (
                    <CircleSwatch diameter={entry.width || 10} color={entry.color} />
                  ) : item.type === "line" ? (
                    <LineSwatch height={entry.width || 2} color={entry.color} />
                  ) : item.type === "fill" ? (
                    <PolygonSwatch color={entry.color} />
                  ) : null}
                  <LegendLabel>{entry.label}</LegendLabel>
                </LegendItem>
              ))
            ) : (
              <>
                <LegendTitle>{item.title}</LegendTitle>
                <LegendSubtitle>{item.subtitle}</LegendSubtitle>
                {item.legendEntries.map((entry, idx) => (
                  <LegendItem key={idx}>
                    {entry.type === "circle" ? (
                      <CircleSwatch
                        diameter={entry.width || 10}
                        color={entry.color}
                      />
                    ) : entry.type === "line" ? (
                      <LineSwatch
                        height={entry.width || 2}
                        color={entry.color}
                      />
                    ) : entry.type === "fill" ? (
                      <PolygonSwatch
                        color={entry.color}
                      />
                    ) : null}
                    <LegendLabel>{entry.label}</LegendLabel>
                  </LegendItem>
                ))}
              </>
            )}
          </LegendItemContainer>
          {/* Render divider within the group, if not the last group */}
          {index < legendItems.length - 1 && <LegendDivider />}
        </LegendGroup>
      ))}
    </LegendContainer>
  );
};