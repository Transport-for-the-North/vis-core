import React from "react";

function myRound(value, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(value * multiplier) / multiplier;
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const Scale = ({
  colorScale,
  selectedVariable,
  binMin,
  binMax,
  isCategorical,
  sizeScale,
}) => {

  const scale = colorScale
  const renderColorScale = () => {
    return (
      scale &&
      scale.map((step, index) => {
        let { value, color } = step;
        const borderOpacity = (index + 2) / 10;
        if (typeof value === "number") {
          value = Math.round(value);
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

  const renderSizeScale = () => {
    return (
      sizeScale &&
      sizeScale.map((step, index) => {
        let [value, size] = step;
        if (typeof value === "number") {
          value = Math.round(value);
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
