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

/**
 * ScatterSeriesChart renders a scatter plot using recharts, supporting custom colours and tooltips.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.config - Chart configuration
 * @param {Array|Object} props.data - Data to visualise
 * @param {Object} props.formatters - Optional value formatters
 * @returns {JSX.Element}
 */
export const ScatterSeriesChart = ({ config, data, formatters }) => {
  // Convert input data to chart series format
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  // Extract labels for axis rendering
  const labels = React.useMemo(() => items.map((item) => item.label), [items]);
  // Chart height, fallback to default
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  // Scatter point colour
  const fill = config.scatterColor || DEFAULTS.BRAND_COLOR;
  // X axis properties (category axis)
  const xAxisProps = React.useMemo(
    () => ({
      ...getCategoryAxisProps({ config, labels }),
      type: "category",
    }),
    [config, labels]
  );
  // Y axis properties (value axis)
  const yAxisProps = React.useMemo(
    () => ({
      ...getValueAxisProps({ formatters }),
      dataKey: "value",
      type: "number",
    }),
    [formatters]
  );
  // Tooltip formatting
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