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

export const AreaSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const labels = React.useMemo(() => items.map((item) => item.label), [items]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke =
    config.areaStrokeColor || config.lineColor || DEFAULTS.BRAND_COLOR;
  const fill = config.areaFillColor || "rgba(75,62,145,0.25)";
  const xAxisProps = React.useMemo(
    () => getCategoryAxisProps({ config, labels }),
    [config, labels]
  );
  const yAxisProps = React.useMemo(
    () => getValueAxisProps({ formatters }),
    [formatters]
  );
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