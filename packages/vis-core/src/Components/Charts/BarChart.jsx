// Legacy bar chart component, still used in some places but should be replaced by BarChartV2 for new use cases.
import React from "react";
import {
  BarChart as RBarChart,
  Bar as RBar,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  Cell as RCell,
} from "recharts";
import {
  ChartSection,
  DEFAULTS,
  computeXAxisHeight,
  defaultFormatters,
  formatTwoDp,
  getAxisLabel,
  toSeries,
} from "./ChartRenderer.utils.jsx";

export const BarChart = ({ config, data, formatters, type = "horizontal" }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const hasXLabel = !!getAxisLabel(config, "x");
  const hasYLabel = !!getAxisLabel(config, "y");
  const formatter = (val) =>
    (formatters.commify || defaultFormatters.commify)(val);
  const tooltipFormatter = (val) =>
    formatters.tooltipFormatter
      ? formatters.tooltipFormatter(val)
      : formatTwoDp(val);
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)),
    [config, items]
  );

  const wrapLabel = (label, maxLen = 15) => {
    const words = label.split(" ");
    let lines = [];
    let currentLine = "";
    words.forEach((word) => {
      if ((currentLine + " " + word).trim().length > maxLen) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += " " + word;
      }
    });
    if (currentLine) lines.push(currentLine.trim());
    return lines.join("\n");
  };

  const CustomTick = (props) => {
    const { x, y, payload } = props;
    const lines = wrapLabel(payload.value, 20).split("\n");
    const startY =
      y - ((lines.length - 1.5) * DEFAULTS.DIMENSIONS.tickFontSize) / 2;

    return (
      <text
        x={x}
        y={startY}
        textAnchor="end"
        fontSize={DEFAULTS.DIMENSIONS.tickFontSize}
      >
        {lines.map((line, idx) => (
          <tspan
            x={x}
            dy={idx === 0 ? 0 : DEFAULTS.DIMENSIONS.tickFontSize}
            key={idx}
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const chartMargin = { ...DEFAULTS.MARGIN };
  if (hasXLabel || hasYLabel) {
    chartMargin.bottom = 20;
    chartMargin.left = 40;
  }

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Bar chart"}
      title={config.title}
      height={config.height ?? items.length * 45}
    >
      <RBarChart
        data={items}
        margin={chartMargin}
        barCategoryGap="18%"
        barGap={2}
        layout={type === "horizontal" ? "horizontal" : "vertical"}
      >
        <RCartesianGrid {...DEFAULTS.GRID} />
        {type === "vertical" ? (
          <>
            <RXAxis
              type="number"
              domain={[0, "dataMax"]}
              allowDecimals={false}
              tickFormatter={formatter}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              label={
                hasXLabel
                  ? {
                      value: getAxisLabel(config, "x"),
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 14,
                    }
                  : undefined
              }
            />
            <RYAxis
              type="category"
              dataKey="label"
              width={100}
              tick={<CustomTick />}
              tickLine={false}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 20,
                      fontSize: 14,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <RXAxis
              dataKey="label"
              angle={DEFAULTS.DIMENSIONS.xAngle}
              textAnchor="end"
              height={xAxisHeight}
              interval={0}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              label={
                hasXLabel
                  ? {
                      value: getAxisLabel(config, "x"),
                      position: "insideBottom",
                      offset: -10,
                      fontSize: 14,
                    }
                  : undefined
              }
            />
            <RYAxis
              domain={[0, "dataMax"]}
              allowDataOverflow
              allowDecimals={false}
              tickFormatter={formatter}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              width={DEFAULTS.DIMENSIONS.yAxisWidth}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 10,
                      fontSize: 14,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        )}
        <RTooltip formatter={tooltipFormatter} cursor={{ fill: "rgba(0,0,0,0.06)" }} />
        <RBar dataKey="value" name="Value">
          {items.map((entry, idx) => (
            <RCell
              key={`cell-${idx}`}
              fill={(config.colors && config.colors[entry.label]) || DEFAULTS.BRAND_COLOR}
            />
          ))}
        </RBar>
      </RBarChart>
    </ChartSection>
  );
};

export default BarChart;