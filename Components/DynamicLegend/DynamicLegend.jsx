import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  position: absolute;
  bottom: 40px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 10px;
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-family: "Hanken Grotesk", sans-serif;
  font-size: medium;
`;

const LegendTitle = styled.div`
  font-weight: bold;
  text-align: left;
  margin-bottom: 8px;
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
  background-color: #333;
  margin-right: 8px;
`;

const LegendLabel = styled.span`
  font-size: small;
`;

// Utility function to interpret color expressions
const interpretColorExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === 'string') {
    // Simple color value
    return [{ color: expression }];
  } else if (Array.isArray(expression)) {
    // Handle different types of expressions
    switch (expression[0]) {
      case 'interpolate':
      case 'step':
        // Extract stops from the expression
        const stops = expression.slice(3);
        const colorStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          colorStops.push({ value: stops[i], color: stops[i + 1] });
        }
        return colorStops;
      case 'match':
        // Extract pairs of match values and colors
        const matchValues = expression.slice(2, -1);
        const matchColorStops = [];
        for (let i = 0; i < matchValues.length; i += 2) {
          matchColorStops.push({ value: matchValues[i], color: matchValues[i + 1] });
        }
        return matchColorStops;
      default:
        return null;
    }
  }
  return null;
};

// Utility function to interpret width expressions
const interpretWidthExpression = (expression) => {
  if (!expression) return null;
  if (typeof expression === 'number') {
    // Simple width value
    return [{ width: expression }];
  } else if (Array.isArray(expression)) {
    // Handle different types of expressions
    switch (expression[0]) {
      case 'interpolate':
      case 'step':
        // Extract stops from the expression
        const stops = expression.slice(3);
        const widthStops = [];
        for (let i = 0; i < stops.length; i += 2) {
          widthStops.push({ value: stops[i], width: stops[i + 1] });
        }
        return widthStops;
      default:
        return null;
    }
  }
  return null;
};

export const DynamicLegend = ({ map }) => {
  const [legendItems, setLegendItems] = useState([]);

  useEffect(() => {
    if (!map) return;

    const updateLegend = () => {
      const layers = map.getStyle().layers;
      const items = layers
        .filter((layer) => layer.metadata && layer.metadata.isStylable)
        .map((layer) => {
          const title = layer.id;
          const paintProps = layer.paint;
          const colorStops = interpretColorExpression(
            paintProps['line-color'] || paintProps['circle-color'] || paintProps['fill-color']
          );
          const widthStops = interpretWidthExpression(
            paintProps['line-width'] || paintProps['circle-radius']
          );
          return { title, colorStops, widthStops };
        });
      setLegendItems(items);
    };

    map.on('styledata', updateLegend);

    return () => {
      map.off('styledata', updateLegend);
    };
  }, [map]);

  if (legendItems.length === 0) {
    return null
  };

  return (
    <LegendContainer>
      {legendItems.map((item, index) => (
        <div key={index}>
          <LegendTitle>{item.title}</LegendTitle>
          {item.colorStops && item.colorStops.map((stop, idx) => (
            <LegendItem key={idx}>
              <ColorSwatch color={stop.color} />
              <LegendLabel>{stop.value !== undefined ? `${stop.value}` : 'Color'}</LegendLabel>
            </LegendItem>
          ))}
          {item.widthStops && item.widthStops.map((stop, idx) => (
            <LegendItem key={idx}>
              <WidthSwatch width={stop.width} />
              <LegendLabel>{stop.value !== undefined ? `${stop.value}` : 'Width'}</LegendLabel>
            </LegendItem>
          ))}
        </div>
      ))}
    </LegendContainer>
  );
};