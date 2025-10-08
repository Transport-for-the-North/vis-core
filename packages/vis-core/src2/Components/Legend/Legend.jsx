import React from "react";
import Scale from "./Scale";
import "./Legend.css";

/**
 * Legend component renders a legend for visualizing color or size scales.
 * 
 * @component
 * @property {function} colorScale - The color scale function for mapping data values to colors.
 * @property {string} selectedVariable - The selected variable for which the legend is displayed.
 * @property {number} binMin - The minimum value of the data range.
 * @property {number} binMax - The maximum value of the data range.
 * @property {function} sizeScale - The size scale function for mapping data values to sizes (optional).
 * @property {boolean} isCategorical - Indicates whether the data is categorical (true) or continuous (false).
 * @returns {JSX.Element} The rendered Legend component.
 */
export const Legend = ({
  colorScale,
  selectedVariable,
  binMin,
  binMax,
  sizeScale,
  isCategorical,
}) => (
  <div id="state-legend" className="legend">
    <Scale
      colorScale={colorScale}
      selectedVariable={selectedVariable}
      binMin={binMin}
      binMax={binMax}
      isCategorical={isCategorical}
      sizeScale={sizeScale}
    />
  </div>
);
