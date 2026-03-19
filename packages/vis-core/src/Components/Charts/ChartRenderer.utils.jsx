import React from "react";
import { ResponsiveContainer } from "recharts";
import { Section, Title } from "./ChartRenderer.styles";

export const DEFAULTS = {
  BRAND_COLOR: "#4b3e91",
  DIMENSIONS: {
    baseHeight: 200,
    pieSize: 220,
    xAngle: -45,
    tickFontSize: 11,
    yAxisWidth: 44,
    xAxisMinHeight: 40,
    avgCharWidth: 6,
  },
  MARGIN: { top: 4, right: 10, bottom: 2, left: 10 },
  GRID: { stroke: "#eee", vertical: false },
};

export const DEFAULT_COLORS = [
  "#4e79a7",
  "#59a14f",
  "#9c755f",
  "#f28e2b",
  "#edc948",
  "#76b7b2",
  "#b07aa1",
  "#e15759",
  "#ff9da7",
  "#4b3e91",
];

export const getValue = (data, key) => {
  const raw = data?.[key];
  const n = Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
};

export const estimateRotatedLabelBand = (
  labels = [],
  angleDeg = -45,
  fontSize = 11,
  avgCharWidth = 7
) => {
  if (!labels.length) return 40;
  const rad = (Math.abs(angleDeg) * Math.PI) / 180;
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const maxWidth = Math.max(
    0,
    ...labels.map((label) => String(label ?? "").length * avgCharWidth)
  );
  const projected = s * maxWidth + c * fontSize + 2;
  return Math.max(40, Math.ceil(projected));
};

export const computeXAxisHeight = (config, labels) => {
  const avgCharWidth = Number(
    config?.xLabelAvgCharWidth ?? DEFAULTS.DIMENSIONS.avgCharWidth
  );
  const explicit = Number(config?.xAxisHeight ?? 0) || 0;
  const est = estimateRotatedLabelBand(
    labels,
    DEFAULTS.DIMENSIONS.xAngle,
    DEFAULTS.DIMENSIONS.tickFontSize,
    avgCharWidth
  );
  return Math.max(DEFAULTS.DIMENSIONS.xAxisMinHeight, explicit, est);
};

export const getChartGridStyle = (layout = {}, fullWidth = false) => {
  const style = {};

  if (layout?.area) {
    style.gridArea = layout.area;
  }

  if (Number(layout?.columnSpan) > 0) {
    style["--chart-grid-column"] = `span ${Number(layout.columnSpan)}`;
  }

  if (Number(layout?.rowSpan) > 0) {
    style.gridRow = `span ${Number(layout.rowSpan)}`;
  }

  if (fullWidth) {
    style["--chart-grid-column"] = "1 / -1";
  }

  return style;
};

export const ChartSection = ({
  ariaLabel,
  title,
  height,
  children,
  fullWidth = false,
  layout,
}) => (
  <Section
    aria-label={ariaLabel}
    style={getChartGridStyle(layout, fullWidth)}
  >
    {title && <Title>{title}</Title>}
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </Section>
);

export const defaultFormatters = {
  commify: (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n.toLocaleString("en-GB") : String(v ?? "");
  },
  percent: (value, data, keys) => {
    const total = (keys || Object.keys(data || {})).reduce(
      (acc, key) => acc + getValue(data, key),
      0
    );
    const num = Number(value ?? 0);
    return total > 0 ? `${((num / total) * 100).toFixed(1)}%` : "0.0%";
  },
};

export const formatTwoDp = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
};

export const toSeries = (config, data) =>
  (config.columns || []).map((col, idx) => ({
    key: col.key,
    label: col.label ?? col.key,
    value: getValue(data, col.key),
    color: col.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    title: col.title,
  }));

export const getAxisLabel = (config, axis) =>
  config?.[`${axis}Label`] ?? config?.[`${axis}_axis_title`];

export const hasChartData = (config, data) => {
  const type = String(config?.type || "").toLowerCase();

  if (type === "table" && (config?.tableLayout || "rows") === "rows") {
    return Array.isArray(data)
      ? data.length > 0
      : !!data && Object.keys(data).length > 0;
  }

  if (type === "barv2") {
    return Array.isArray(data) && data.length > 0;
  }

  if (
    (type === "multiple_bar" || type === "multiple_bar_vertical") &&
    Array.isArray(config?.sourceColumns)
  ) {
    return Array.isArray(data) && data.length > 0;
  }

  if (
    (type === "pie" || type === "donut") &&
    (config?.categoryKey || config?.dimensionKey)
  ) {
    return Array.isArray(data) && data.length > 0;
  }

  if (Array.isArray(data)) {
    return (
      data.length > 0 &&
      data.some((row) =>
        Object.entries(row)
          .filter(([key]) => key !== (config?.xKey || "label"))
          .some(([, value]) => Number(value) > 0)
      )
    );
  }

  return !!data && Object.values(data).some((value) => (Number(value) || 0) > 0);
};