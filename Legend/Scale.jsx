import React from "react";

import { roundToSignificantFigures } from "utils";

/**
 * Function to add commas to a number for better readability.
 * @param {number} x - The number to format.
 * @returns {string} The formatted number with commas.
 * @example
 * // Returns "1,234,567"
 * numberWithCommas(1234567);
 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Component to render a scale for color or size.
 * @component
 * @property {array} colorScale - The color scale to render.
 * @property {string} selectedVariable - The selected variable for the scale.
 * @property {number} binMin - The minimum bin value.
 * @property {number} binMax - The maximum bin value.
 * @property {boolean} isCategorical - Indicates if the scale is categorical.
 * @property {array} sizeScale - The size scale to render.
 * @returns {JSX.Element} The Scale component.
 */
const Scale = ({
  colorScale,
  selectedVariable,
  binMin,
  binMax,
  isCategorical,
  sizeScale,
}) => {

  const scale = colorScale

  /**
   * Renders the color scale.
   * @returns {JSX.Element[]} Array of color scale elements.
   */
  const renderColorScale = () => {
    return (
      scale &&
      scale.map((step, index) => {
        let { value, color } = step;
        const borderOpacity = (index + 2) / 10;
        if (typeof value === "number") {
          value = roundToSignificantFigures(value);
          if (!isCategorical && (value < binMin || value > binMax)) return null;
        }else value = value.charAt(0).toUpperCase() + value.slice(1)

        return (
          <div
            key={`scale-step-${index}`}
            id={`scale-step-${index}`}
            className="legend-scale__step"
          >
            <span
              className="legend-scale__step-swatch"
              style={{
                width: "9px",
                height: "9px",
                backgroundColor: color,
                border: `1px solid rgba(0, 0, 0, ${borderOpacity})`,
              }}
            />
            {numberWithCommas(value)}
          </div>
        );
      })
    );
  };

  /**
   * Renders the size scale.
   * @returns {JSX.Element[]} Array of size scale elements.
   */
  const renderSizeScale = () => {
    return (
      sizeScale &&
      sizeScale.map((step, index) => {
        let [value, size] = step;
        if (typeof value === "number") {
          value = roundToSignificantFigures(value);
          if (!isCategorical && (value < binMin || value > binMax)) return null;
        } else value = value.charAt(0).toUpperCase() + value.slice(1)

        return (
          <div
            key={`scale-step-${index}`}
            id={`scale-step-${index}`}
            className="legend-scale__step"
          >
            <span
              className="legend-scale__step-swatch"
              style={{
                height: `${size * 2}px`,
                width: `${size * 2}px`,
                border: `1px solid black`,
                alignItems: "center",
              }}
            />
            {numberWithCommas(value)}
          </div>
        );
      })
    );
  };

  return (
    <div>
      <div className="legend-section legend-section--column">
        <div className="legend-label">{selectedVariable}</div>
        <div className="legend-scale">
          {renderColorScale()}
        </div>
      </div>

      {sizeScale && (
        <div className="legend-section legend-section--column">
          <div className="legend-scale">{renderSizeScale()}</div>
        </div>
      )}
    </div>
  );
};

export default Scale;
