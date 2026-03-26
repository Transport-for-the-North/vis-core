import React from "react";
import {
  ScatterChart as RScatterChart,
  Scatter as RScatter,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
} from "recharts";
import {
  ChartSection,
  DEFAULTS,
  getCategoryAxisProps,
  getTooltipProps,
  getValueAxisProps,
  toSeries,
} from "./ChartRenderer.utils.jsx";

export const ScatterSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const labels = React.useMemo(() => items.map((item) => item.label), [items]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const fill = config.scatterColor || DEFAULTS.BRAND_COLOR;
  const xAxisProps = React.useMemo(
    () => ({
      ...getCategoryAxisProps({ config, labels }),
      type: "category",
    }),
    [config, labels]
  );
  const yAxisProps = React.useMemo(
    () => ({
      ...getValueAxisProps({ formatters }),
      dataKey: "value",
      type: "number",
    }),
    [formatters]
  );
  const tooltipProps = React.useMemo(
    () => getTooltipProps(formatters),
    [formatters]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Scatter chart"}
      title={config.title}
      height={height}
    >
      <RScatterChart margin={DEFAULTS.MARGIN}>
        <RCartesianGrid {...DEFAULTS.GRID} />
        <RXAxis {...xAxisProps} />
        <RYAxis {...yAxisProps} />
        <RTooltip {...tooltipProps} />
        <RScatter data={items} fill={fill} />
      </RScatterChart>
    </ChartSection>
  );
};

export default ScatterSeriesChart;