import React from "react";
import Scale from "./Scale";
import "./Legend.css";

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
