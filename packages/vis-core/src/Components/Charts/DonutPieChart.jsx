import React from "react";
import {
  PieChart as RPieChart,
  Pie as RPie,
  Cell as RCell,
  Legend as RLegend,
  Tooltip as RTooltip,
} from "recharts";
import {
  ChartSection,
  DEFAULTS,
  DEFAULT_COLORS,
  getCommifyFormatter,
  toDisplayLabel,
  toSeries,
} from "./ChartRenderer.utils.jsx";

/**
 * Groups and aggregates data for pie/donut chart display.
 *
 * @param {Object} config - Chart configuration
 * @param {Array} data - Data to visualise
 * @returns {Array} Pie chart series
 */
const buildDynamicPieSeries = (config, data) => {
  const categoryKey = config.categoryKey || config.dimensionKey;
  const calc = config.calc || "count";
  const valueKey = config.valueKey;

  if (!Array.isArray(data) || !categoryKey) {
    return toSeries(config, data);
  }

  const grouped = new Map();
  data.forEach((row) => {
    const label = toDisplayLabel(row?.[categoryKey]);
    if (!grouped.has(label)) {
      grouped.set(label, []);
    }
    grouped.get(label).push(row);
  });

  return Array.from(grouped.entries()).map(([label, rows], idx) => {
    const value =
      calc === "sum"
        ? rows.reduce((total, row) => total + Number(row?.[valueKey] ?? 0), 0)
        : rows.length;

    return {
      key: label,
      label,
      value,
      color:
        config?.colors?.[label] ||
        DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    };
  });
};

/**
 * DonutPieChart renders a donut or pie chart using recharts, supporting custom colours and tooltips.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.config - Chart configuration
 * @param {Array|Object} props.data - Data to visualise
 * @param {Object} props.formatters - Optional value formatters
 * @returns {JSX.Element}
 */
export const DonutPieChart = ({ config, data, formatters }) => {
  // Build chart series from data
  const items = buildDynamicPieSeries(config, data);
  // Value formatter
  const commify = getCommifyFormatter(formatters);
  // Calculate legend rows for layout
  const legendRows = Math.max(1, Math.ceil(items.length / 3));
  // Chart size, responsive to legend
  const size =
    config.size ??
    Math.min(
      340,
      Math.max(DEFAULTS.DIMENSIONS.pieSize, 180 + legendRows * 24)
    );
  // Total value for percentage calculation
  const total = Math.max(0.00001, items.reduce((a, b) => a + b.value, 0));
  // Format value as percentage of total
  const pctFmt = (v) =>
    total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0.0%";

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Donut chart"}
      title={config.title}
      height={size}
      layout={config.layout}
    >
      <RPieChart>
        <RTooltip
          formatter={(value, name, props) => [
            commify(value) +
              ` (${pctFmt(value)})`,
            props?.payload?.label || name,
          ]}
        />
        <RLegend
          verticalAlign="bottom"
          align="center"
          layout="horizontal"
          wrapperStyle={{ fontSize: 12 }}
        />
        <RPie
          data={items}
          dataKey="value"
          nameKey="label"
          cx="50%"
          cy="45%"
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={1}
          isAnimationActive
        >
          {items.map((item) => (
            <RCell key={item.key} fill={item.color} />
          ))}
        </RPie>
      </RPieChart>
    </ChartSection>
  );
};

export default DonutPieChart;