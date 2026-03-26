import React from "react";
import {
  LineChart as RLineChart,
  Line as RLine,
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

export const LineSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const labels = React.useMemo(() => items.map((item) => item.label), [items]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke = config.lineColor || DEFAULTS.BRAND_COLOR;
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
      ariaLabel={config.ariaLabel || "Line chart"}
      title={config.title}
      height={height}
    >
      <RLineChart data={items} margin={DEFAULTS.MARGIN}>
        <RCartesianGrid {...DEFAULTS.GRID} />
        <RXAxis {...xAxisProps} />
        <RYAxis {...yAxisProps} />
        <RTooltip {...tooltipProps} />
        <RLine
          type="monotone"
          dataKey="value"
          stroke={stroke}
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </RLineChart>
    </ChartSection>
  );
};

export default LineSeriesChart;