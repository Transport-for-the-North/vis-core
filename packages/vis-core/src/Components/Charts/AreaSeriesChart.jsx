import React from "react";
import {
  AreaChart as RAreaChart,
  Area as RArea,
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
 * AreaSeriesChart renders an area chart using recharts, supporting custom colours and tooltips.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.config - Chart configuration
 * @param {Array|Object} props.data - Data to visualise
 * @param {Object} props.formatters - Optional value formatters
 * @returns {JSX.Element}
 */
export const AreaSeriesChart = ({ config, data, formatters }) => {
  // Convert input data to chart series format
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  // Extract labels for axis rendering
  const labels = React.useMemo(() => items.map((item) => item.label), [items]);
  // Chart height, fallback to default
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  // Area and line colours
  const stroke = config.areaStrokeColor || config.lineColor || DEFAULTS.BRAND_COLOR;
  const fill = config.areaFillColor || "rgba(75,62,145,0.25)";
  // X axis properties (category axis)
  const xAxisProps = React.useMemo(
    () => getCategoryAxisProps({ config, labels }),
    [config, labels]
  );
  // Y axis properties (value axis)
  const yAxisProps = React.useMemo(
    () => getValueAxisProps({ formatters }),
    [formatters]
  );
  // Tooltip formatting
  const tooltipProps = React.useMemo(
    () => getTooltipProps(formatters),
    [formatters]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Area chart"}
      title={config.title}
      height={height}
    >
      <RAreaChart data={items} margin={DEFAULTS.MARGIN}>
        <RCartesianGrid {...DEFAULTS.GRID} />
        <RXAxis {...xAxisProps} />
        <RYAxis {...yAxisProps} />
        <RTooltip {...tooltipProps} />
        <RArea
          type="monotone"
          dataKey="value"
          stroke={stroke}
          fill={fill}
          strokeWidth={2}
        />
      </RAreaChart>
    </ChartSection>
  );
};

export default AreaSeriesChart;