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
  computeXAxisHeight,
  defaultFormatters,
  toSeries,
} from "./ChartRenderer.utils.jsx";

export const ScatterSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const fill = config.scatterColor || DEFAULTS.BRAND_COLOR;
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)),
    [config, items]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Scatter chart"}
      title={config.title}
      height={height}
    >
      <RScatterChart margin={DEFAULTS.MARGIN}>
        <RCartesianGrid {...DEFAULTS.GRID} />
        <RXAxis
          dataKey="label"
          type="category"
          angle={DEFAULTS.DIMENSIONS.xAngle}
          textAnchor="end"
          height={xAxisHeight}
          interval={0}
          tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
        />
        <RYAxis
          dataKey="value"
          type="number"
          allowDecimals={false}
          tickFormatter={(v) =>
            (formatters.commify || defaultFormatters.commify)(v)
          }
          tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
          width={DEFAULTS.DIMENSIONS.yAxisWidth}
        />
        <RTooltip
          cursor={{ stroke: "#ccc", strokeDasharray: "3 3" }}
          formatter={(v) =>
            (formatters.commify || defaultFormatters.commify)(v)
          }
        />
        <RScatter data={items} fill={fill} />
      </RScatterChart>
    </ChartSection>
  );
};

export default ScatterSeriesChart;