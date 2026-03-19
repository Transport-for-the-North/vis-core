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
  computeXAxisHeight,
  defaultFormatters,
  toSeries,
} from "./ChartRenderer.utils.jsx";

export const AreaSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke =
    config.areaStrokeColor || config.lineColor || DEFAULTS.BRAND_COLOR;
  const fill = config.areaFillColor || "rgba(75,62,145,0.25)";
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)),
    [config, items]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Area chart"}
      title={config.title}
      height={height}
    >
      <RAreaChart data={items} margin={DEFAULTS.MARGIN}>
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