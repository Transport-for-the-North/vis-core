import { forEach } from "lodash";
import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { numberWithCommas } from "utils";
import { useMapContext } from "hooks";
import { AppContext } from '../../contexts/AppContext';

const LegendContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  z-index: 10;
  max-height: 315px;
  overflow-y: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-family: "Hanken Grotesk", sans-serif;
  font-size: medium;
`;

const LegendTitle = styled.div`
  font-weight: bold;
  text-align: left;
  margin-bottom: 4px;
`;

const LegendSubtitle = styled.h2`
  font-weight: normal;
  text-align: left;
  margin-top: 4px;
  margin-bottom: 4px;
  font-size: small;
  font-style: italic;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const ColorSwatch = styled.div`
  width: 15px;
  height: 15px;
  background-color: ${(props) => props.color};
  border: 1px solid #333;
  margin-right: 5px;
  border-radius: 50%;
`;

const WidthSwatch = styled.div`
  width: 50px;
  height: ${(props) => props.width}px;
  background-color: ${(props) => props.color ?? "#333"};
  margin-right: 8px;
`;

const LegendLabel = styled.span`
  font-size: small;
`;

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
    // Simple color value
    return null;
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
const interpretWidthExpression = (expression, numInterpolatedStops = 7) => {
  if (!expression) return null;
  if (typeof expression === "number") {
    // Simple width value
    return [{ width: expression }];
  } else if (Array.isArray(expression)) {
    // Handle different types of expressions
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
        return null;
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
 * @note The map instance is expected to be an object from MapLibre or Mapbox,
 * which follows a specific API for style manipulation and event handling.
 */
export const DynamicLegend = ({ map }) => {
  const [legendItems, setLegendItems] = useState([]);
  const { state } = useMapContext();
  const config = useContext(AppContext); // Accessing config from AppContext

  useEffect(() => {
    if (!map) return;

    const updateLegend = () => {
      // Access the first key in visualisations
      const visualisationKey = Object.keys(state.visualisations)[0];
      const visualisation = state.visualisations[visualisationKey];
    
      const legendTexts = visualisation?.legendText || [];
      const layers = map.getStyle().layers;
    
      const items = layers
        .filter((layer) => layer.metadata && layer.metadata.isStylable)
        .map((layer, index) => {
          const title = layer.id;
    
          const pageConfig = config.appPages.find(page => page.pageName === visualisationKey);
          const legendFilter = pageConfig?.config?.filters?.find(filter => filter.containsLegendInfo === true);
    
          let displayValue;
          let legendSubtitleText;
    
          if (legendFilter) {
            const filterParamName = legendFilter.paramName;
            const filter = pageConfig.config.filters.find(filter => filter.paramName === filterParamName);
            const filterValues = filter?.values || [];
    
            // Default values from filterName
            const defaultDisplayValue = filterValues[0]?.displayValue || title;
            const defaultLegendSubtitleText = filterValues[0]?.legendSubtitleText || "";
    
            displayValue = legendTexts[index]?.displayValue || defaultDisplayValue;
            legendSubtitleText = legendTexts[index]?.legendSubtitleText || defaultLegendSubtitleText;
          } else {
            displayValue = legendTexts[index]?.displayValue || title;
            legendSubtitleText = legendTexts[index]?.legendSubtitleText || ""; // Default subtitle if legendFilter is not found
          }
          const paintProps = layer.paint;
          const colorStops = interpretColorExpression(
            paintProps["line-color"] ||
            paintProps["circle-color"] ||
            paintProps["fill-color"]
          );
          const widthStops = interpretWidthExpression(paintProps["line-width"]);
          return { 
            title: displayValue,
            subtitle: legendSubtitleText,
            colorStops, 
            widthStops, 
            style: layer.metadata.colorStyle,
          };
        });
      setLegendItems(items);
    };

    map.on("styledata", updateLegend);

    // Call updateLegend initially to set the legend items on mount
    updateLegend();

    return () => {
      map.off("styledata", updateLegend);
    };
  }, [config.appPages, map, state.visualisations]);

  if (legendItems.length === 0) {
    return null;
  }

  return (
    <LegendContainer>
      {legendItems.map((item, index) => (
        <div key={index}>
          <LegendTitle>{item.title}</LegendTitle>
          <LegendSubtitle>{item.subtitle}</LegendSubtitle>
          {item.colorStops &&
            !item.widthStops &&
            item.colorStops.map((stop, idx) => (
              <LegendItem key={idx}>
                <ColorSwatch color={stop.color} />
                <LegendLabel>
                  {stop.value !== undefined ? `${stop.value}` : "Color"}
                </LegendLabel>
              </LegendItem>
            ))}
          {item.widthStops &&
            item.style === "continuous" &&
            item.widthStops.map((stop, idx) => (
              <LegendItem key={idx}>
                <WidthSwatch width={stop.width} color={item.colorStops[idx].color} />
                <LegendLabel>
                  {stop.value !== undefined ? `${stop.value}` : "Width"}
                </LegendLabel>
              </LegendItem>
            ))}
          {item.widthStops && item.style === "diverging" && (
            <>
              {item.widthStops.slice(1)
                .reduceRight((acc, stop) => {
                  acc.push(stop);
                  return acc;
                }, [])
                .map((stop, idx) => (
                  <LegendItem key={idx}>
                    <WidthSwatch
                      width={stop.width}
                      color={item.colorStops[0].color}
                    />
                    <LegendLabel>
                      {stop.value !== undefined ? `-${stop.value}` : "Width"}
                    </LegendLabel>
                  </LegendItem>
                ))}
              {item.widthStops.map((stop, idx) => (
                <LegendItem key={idx}>
                  <WidthSwatch
                    width={stop.width}
                    color={item.colorStops[1].color}
                  />
                  <LegendLabel>
                    {stop.value !== undefined ? `${stop.value}` : "Width"}
                  </LegendLabel>
                </LegendItem>
              ))}
            </>
          )}
        </div>
      ))}
    </LegendContainer>
  );
};
