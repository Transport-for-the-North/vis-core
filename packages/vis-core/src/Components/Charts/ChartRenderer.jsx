import React from "react";
import { WarningBox } from "Components";
import { Section } from "./ChartRenderer.styles";
import { defaultFormatters, hasChartData } from "./ChartRenderer.utils.jsx";
import { BarChart } from "./BarChart";
import { BarChartMultiple } from "./BarChartMultiple";
import { BarChartV2 } from "./BarChartV2";
import { LineSeriesChart } from "./LineSeriesChart";
import { AreaSeriesChart } from "./AreaSeriesChart";
import { ScatterSeriesChart } from "./ScatterSeriesChart";
import { DonutPieChart } from "./DonutPieChart";
import { Card } from "./Card";
import { TableChart } from "./TableChart";
import { RankingChart } from "./RankingChart";

const renderUnsupportedChart = (cfg, key) => (
  <Section key={key}>
    <WarningBox text={`Unsupported chart type: ${cfg.type}`} />
  </Section>
);

const getChartKey = (cfg, idx) => cfg?.id || cfg?.key || `${String(cfg?.type || "chart")}-${idx}`;

const getChartConfigWithResolvedHeight = (cfg, barHeight) => {
  const resolvedBarChartHeight = cfg?.height ?? cfg?.barHeight ?? barHeight;
  return resolvedBarChartHeight === undefined
    ? cfg
    : { ...cfg, height: resolvedBarChartHeight };
};

const CHART_RENDERERS = {
  card: ({ chartKey, config, data, formatters }) => (
    <Card key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  bar: ({ chartKey, config, data, formatters }) => (
    <BarChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  bar_vertical: ({ chartKey, config, data, formatters }) => (
    <BarChart key={chartKey} config={config} data={data} formatters={formatters} type="vertical" />
  ),
  multiple_bar: ({ chartKey, config, data, formatters }) => (
    <BarChartMultiple key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  multiple_bar_vertical: ({ chartKey, config, data, formatters }) => (
    <BarChartMultiple key={chartKey} config={config} data={data} formatters={formatters} type="vertical" />
  ),
  barv2: ({ chartKey, config, data, formatters }) => (
    <BarChartV2 key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  line: ({ chartKey, config, data, formatters }) => (
    <LineSeriesChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  area: ({ chartKey, config, data, formatters }) => (
    <AreaSeriesChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  scatter: ({ chartKey, config, data, formatters }) => (
    <ScatterSeriesChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  pie: ({ chartKey, config, data, formatters }) => (
    <DonutPieChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  donut: ({ chartKey, config, data, formatters }) => (
    <DonutPieChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  table: ({ chartKey, config, data, formatters }) => (
    <TableChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
  ranking: ({ chartKey, config, data, formatters }) => (
    <RankingChart key={chartKey} config={config} data={data} formatters={formatters} />
  ),
};

/**
 * ChartRenderer is the main chart rendering component that supports multiple chart types.
 *
 * Renders different types of charts based on configuration including:
 * - Bar charts (BarChartV2, legacy BarChart/BarChartMultiple)
 * - Line, Area, Scatter, Pie/Donut, Table, and Ranking charts
 *
 * @param {Object} props - Component properties
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
        const renderer = CHART_RENDERERS[type];
        const chartKey = getChartKey(cfg, idx);
        const resolvedConfig = getChartConfigWithResolvedHeight(cfg, barHeight);

        if (!renderer) {
          return renderUnsupportedChart(cfg, chartKey);
        }

        return renderer({
          chartKey,
          config: resolvedConfig,
          data,
          formatters: f,
        });
      })}
    </div>
  );
};

export default ChartRenderer;
