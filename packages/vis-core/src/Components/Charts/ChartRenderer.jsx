import React from "react";
import { WarningBox } from "Components";
import { Section, Title } from "./ChartRenderer.styles";
import { defaultFormatters, hasChartData } from "./ChartRenderer.utils.jsx";
import { BarChart } from "./BarChart";
import { BarChartMultiple } from "./BarChartMultiple";
import { BarChartV2 } from "./BarChartV2";
import { LineSeriesChart } from "./LineSeriesChart";
import { AreaSeriesChart } from "./AreaSeriesChart";
import { ScatterSeriesChart } from "./ScatterSeriesChart";
import { DonutPieChart } from "./DonutPieChart";
import { TableChart } from "./TableChart";
import { RankingChart } from "./RankingChart";

/**
 * Main chart rendering component that supports multiple chart types
 * Renders different types of charts based on configuration including:
 * - Bar charts
 * - Line charts
 * - Area charts
 * - Scatter charts
 * - Pie/Donut charts
 * - Table charts
 * - Histogram (placeholder - not implemented)
 *
 * @param {Object} props - Component props
 * @param {Array} props.charts - Array of chart configuration objects
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @param {number} props.barHeight - Optional height override for bar charts
 * @returns {JSX.Element|null} - Rendered charts or null if no charts provided
 */
export const ChartRenderer = ({
  charts = [],
  data,
  formatters = {},
  barHeight,
}) => {
  if (!charts.length) return null;
  const f = { ...defaultFormatters, ...formatters };
  const hasAny = charts.some((cfg) => hasChartData(cfg, data));

  if (!hasAny) return null;

  return (
    <div>
      {charts.map((cfg, idx) => {
        const type = (cfg.type || "").toLowerCase();
        const resolvedBarChartHeight = cfg?.height ?? cfg?.barHeight ?? barHeight;
        const cfgWithResolvedHeight =
          resolvedBarChartHeight === undefined
            ? cfg
            : { ...cfg, height: resolvedBarChartHeight };
        switch (type) {
          case "bar":
            return (
              <BarChart
                key={idx}
                config={cfgWithResolvedHeight}
                data={data}
                formatters={f}
              />
            );
          case "bar_vertical":
            return (
              <BarChart
                key={idx}
                config={cfgWithResolvedHeight}
                data={data}
                formatters={f}
                type="vertical"
              />
            );
          case "multiple_bar":
            return (
              <BarChartMultiple
                key={idx}
                config={cfgWithResolvedHeight}
                data={data}
                formatters={f}
              />
            );
          case "multiple_bar_vertical":
            return (
              <BarChartMultiple
                key={idx}
                config={cfgWithResolvedHeight}
                data={data}
                formatters={f}
                type="vertical"
              />
            );
          case "barv2":
            return (
              <BarChartV2
                key={idx}
                config={cfgWithResolvedHeight}
                data={data}
                formatters={f}
              />
            );
          case "line":
            return (
              <LineSeriesChart
                key={idx}
                config={cfg}
                data={data}
                formatters={f}
              />
            );
          case "area":
            return (
              <AreaSeriesChart
                key={idx}
                config={cfg}
                data={data}
                formatters={f}
              />
            );
          case "scatter":
            return (
              <ScatterSeriesChart
                key={idx}
                config={cfg}
                data={data}
                formatters={f}
              />
            );
          case "pie":
          case "donut":
            return (
              <DonutPieChart
                key={idx}
                config={cfg}
                data={data}
                formatters={f}
              />
            );
          case "table":
            return (
              <TableChart key={idx} config={cfg} data={data} formatters={f} />
            );
          case "ranking":
            return (
              <RankingChart key={idx} config={cfg} data={data} formatters={f} />
            );
          default:
            return (
              <Section key={idx}>
                <WarningBox text={`Unsupported chart type: ${cfg.type}`} />
              </Section>
            );
        }
      })}
    </div>
  );
};

export default ChartRenderer;
