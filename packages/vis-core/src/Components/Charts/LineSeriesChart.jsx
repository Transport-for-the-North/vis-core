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
  computeXAxisHeight,
  defaultFormatters,
  toSeries,
} from "./ChartRenderer.utils.jsx";

export const LineSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke = config.lineColor || DEFAULTS.BRAND_COLOR;
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)),
    [config, items]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Line chart"}
      title={config.title}
      height={height}
    >
      <RLineChart data={items} margin={DEFAULTS.MARGIN}>
        <RCartesianGrid {...DEFAULTS.GRID} />
        <RXAxis
          dataKey="label"
          angle={DEFAULTS.DIMENSIONS.xAngle}
          textAnchor="end"
          height={xAxisHeight}
          interval={0}
          tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
        />
        <RYAxis
          allowDecimals={false}
          tickFormatter={(v) =>
            (formatters.commify || defaultFormatters.commify)(v)
          }
          tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
          width={DEFAULTS.DIMENSIONS.yAxisWidth}
        />
        <RTooltip
          formatter={(v) =>
            (formatters.commify || defaultFormatters.commify)(v)
          }
          cursor={{ stroke: "#ccc", strokeDasharray: "3 3" }}
        />
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