// Legacy bar chart component, still used in some places but should be replaced by BarChartV2 for new use cases.
import React from "react";
import {
  BarChart as RBarChart,
  Bar as RBar,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  Legend as RLegend,
} from "recharts";
import {
  ChartSection,
  DEFAULTS,
  DEFAULT_COLORS,
  computeXAxisHeight,
  defaultFormatters,
  formatTwoDp,
  getAxisLabel,
} from "./ChartRenderer.utils.jsx";

const toLabel = (value) => {
  if (value === null || value === undefined || value === "") return "Unknown";
  return String(value);
};

const sortDynamicItems = (items, config) => {
  const sortBy = config?.sortBy || "label";
  const sortDirection = (config?.sortDirection || "asc").toLowerCase();
  const multiplier = sortDirection === "desc" ? -1 : 1;

  return [...items].sort((left, right) => {
    if (sortBy === "value") {
      const leftTotal = Object.entries(left)
        .filter(([key]) => key !== "label")
        .reduce((sum, [, value]) => sum + Number(value ?? 0), 0);
      const rightTotal = Object.entries(right)
        .filter(([key]) => key !== "label")
        .reduce((sum, [, value]) => sum + Number(value ?? 0), 0);
      return (leftTotal - rightTotal) * multiplier;
    }

    return left.label.localeCompare(right.label, undefined, { numeric: true }) * multiplier;
  });
};

const buildDynamicItems = (rows, config) => {
  const sourceColumns = config.sourceColumns || [];
  const categoryMap = new Map();

  rows.forEach((row) => {
    sourceColumns.forEach((column) => {
      const category = toLabel(row?.[column.key]);
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { label: category });
      }

      const entry = categoryMap.get(category);
      entry[column.key] = Number(entry[column.key] ?? 0) + 1;
    });
  });

  const items = Array.from(categoryMap.values()).map((item) => {
    const completeItem = { ...item };
    sourceColumns.forEach((column) => {
      completeItem[column.key] = Number(completeItem[column.key] ?? 0);
    });
    return completeItem;
  });

  return {
    items: sortDynamicItems(items, config),
    columns: sourceColumns.map((column, idx) => ({
      key: column.key,
      label: column.label ?? column.key,
      color: column.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    })),
  };
};

export const BarChartMultiple = ({
  config,
  data,
  formatters,
  type = "horizontal",
}) => {
  const dynamicSeries = React.useMemo(() => {
    if (Array.isArray(data) && Array.isArray(config.sourceColumns)) {
      return buildDynamicItems(data, config);
    }

    return {
      items: Array.isArray(data) ? data : [],
      columns: config.columns || [],
    };
  }, [config, data]);
  const items = dynamicSeries.items;
  const columns = dynamicSeries.columns;
  const hasXLabel = !!getAxisLabel(config, "x");
  const hasYLabel = !!getAxisLabel(config, "y");
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)) + (hasXLabel ? 18 : 0),
    [config, hasXLabel, items]
  );
  const height = React.useMemo(() => {
    if (config.height) return config.height;
    if (type === "vertical") {
      return Math.max(190, items.length * 42 + 40);
    }
    return Math.max(220, 240);
  }, [config.height, items.length, type]);
  const formatter = (val) =>
    (formatters.commify || defaultFormatters.commify)(val);
  const tooltipFormatter = (val) =>
    formatters.tooltipFormatter
      ? formatters.tooltipFormatter(val)
      : formatTwoDp(val);
  const truncateLabel = (label, maxLen = 7) =>
    label.length > maxLen ? label.slice(0, maxLen) + "…" : label;
  const CustomTick = ({ x, y, payload, angle = 0 }) => (
    <text
      x={x}
      y={y}
      dy={angle ? 16 : 4}
      textAnchor="end"
      fontSize={DEFAULTS.DIMENSIONS.tickFontSize}
      transform={angle ? `rotate(${angle}, ${x}, ${y})` : undefined}
    >
      {truncateLabel(payload.value)}
    </text>
  );
  const yTickFormatter = (val) => Number(val).toFixed(2);
  const chartMargin = { ...DEFAULTS.MARGIN };
  chartMargin.bottom = hasXLabel ? 28 : 12;
  chartMargin.left = hasYLabel ? 52 : 20;
  const shouldUseFullWidth = type === "horizontal";

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Bar chart"}
      title={config.title}
      height={height}
      fullWidth={shouldUseFullWidth}
    >
      <RBarChart
        data={items}
        margin={chartMargin}
        barCategoryGap="18%"
        barGap={2}
        layout={type === "horizontal" ? "horizontal" : "vertical"}
      >
        <RCartesianGrid {...DEFAULTS.GRID} />
        {type === "vertical" ? (
          <>
            <RXAxis
              type="number"
              domain={[0, "dataMax"]}
              allowDecimals={false}
              tickFormatter={formatter}
              tick={<CustomTick />}
              label={
                hasXLabel
                  ? {
                      value: getAxisLabel(config, "x"),
                      position: "insideBottom",
                      offset: -5,
                      fontSize: 14,
                    }
                  : undefined
              }
            />
            <RYAxis
              type="category"
              dataKey={config.xKey || "label"}
              width={Math.min(Math.max(120, Math.max(0, ...items.map((item) => String(item?.label ?? "").length * 7))), 240)}
              tick={<CustomTick />}
              tickLine={false}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 0,
                      fontSize: 10,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <RXAxis
              dataKey={config.xKey || "label"}
              tick={<CustomTick angle={-45} />}
              height={xAxisHeight}
              interval={0}
              label={
                hasXLabel
                  ? {
                      value: getAxisLabel(config, "x"),
                      position: "bottom",
                      offset: 8,
                      fontSize: 10,
                    }
                  : undefined
              }
            />
            <RYAxis
              domain={[0, "dataMax"]}
              allowDataOverflow
              allowDecimals={false}
              tickFormatter={yTickFormatter}
              width={DEFAULTS.DIMENSIONS.yAxisWidth}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 10,
                      fontSize: 10,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        )}
        <RTooltip formatter={tooltipFormatter} cursor={{ fill: "rgba(0,0,0,0.06)" }} />
        <RLegend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: 10 }}
        />
        {columns.map((col, idx) => (
          <RBar
            key={col.key}
            dataKey={col.key}
            name={col.label}
            fill={(config.colors && config.colors[col.key]) || col.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
            barSize={DEFAULTS.BAR_SIZE || 24}
            isAnimationActive={false}
          />
        ))}
      </RBarChart>
    </ChartSection>
  );
};

export default BarChartMultiple;