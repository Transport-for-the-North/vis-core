import React from "react";
import {
  BarChart as RBarChart,
  Bar as RBar,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  Legend as RLegend,
  Cell as RCell,
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

const SOURCE_COLUMNS_CATEGORY_KEY = "__source_category";
const SOURCE_COLUMNS_GROUP_KEY = "__source_group";

const CALCULATORS = {
  count: ({ rows }) => rows.length,
  sum: ({ rows, valueKey }) =>
    rows.reduce((total, row) => total + Number(row?.[valueKey] ?? 0), 0),
  avg: ({ rows, valueKey }) => {
    if (!rows.length) return 0;
    const total = rows.reduce(
      (sum, row) => sum + Number(row?.[valueKey] ?? 0),
      0
    );
    return total / rows.length;
  },
  min: ({ rows, valueKey }) => {
    if (!rows.length) return 0;
    return Math.min(...rows.map((row) => Number(row?.[valueKey] ?? 0)));
  },
  max: ({ rows, valueKey }) => {
    if (!rows.length) return 0;
    return Math.max(...rows.map((row) => Number(row?.[valueKey] ?? 0)));
  },
  distinctCount: ({ rows, valueKey }) =>
    new Set(rows.map((row) => row?.[valueKey]).filter((value) => value != null)).size,
};

const getConfigValue = (config, primaryKey, fallbackKey) =>
  config?.[primaryKey] ?? (fallbackKey ? config?.[fallbackKey] : undefined);

const toLabel = (value) => {
  if (value === null || value === undefined || value === "") return "Unknown";
  return String(value);
};

const getCategoryAxisWidth = (items, config) => {
  const configuredWidth = Number(config?.yAxisWidth ?? 0);
  if (configuredWidth > 0) return configuredWidth;

  const maxLabelLength = items.reduce(
    (max, item) => Math.max(max, String(item?.label ?? "").length),
    0
  );

  return Math.min(Math.max(110, maxLabelLength * 6), 220);
};

const getValueAxisWidth = (items, config) => {
  const configuredWidth = Number(config?.yAxisWidth ?? 0);
  if (configuredWidth > 0) return configuredWidth;

  const maxValue = items.reduce(
    (currentMax, item) => Math.max(currentMax, Number(item?.value ?? 0)),
    0
  );
  const labelLength = maxValue.toLocaleString("en-GB").length;
  return Math.min(Math.max(44, labelLength * 8 + 12), 96);
};

const getChartMargin = ({ categoryAxis, hasXLabel, hasYLabel }) => {
  const margin = { ...DEFAULTS.MARGIN };

  if (categoryAxis === "y") {
    margin.left = hasYLabel ? 44 : 18;
    margin.bottom = hasXLabel ? 28 : 12;
    return margin;
  }

  margin.left = hasYLabel ? 52 : 18;
  margin.bottom = hasXLabel ? 30 : 12;
  return margin;
};

const getChartHeight = ({ items, hasGroupings, config, categoryAxis }) => {
  const configuredHeight = config.height ?? config.barHeight;
  if (configuredHeight) return configuredHeight;

  if (categoryAxis === "y") {
    const legendHeight = hasGroupings ? 32 : 0;
    const rowHeight = hasGroupings ? 42 : 32;
    return Math.max(
      180,
      items.length * rowHeight + legendHeight + 24
    );
  }

  return Math.max(220, items.length * 32);
};

const resolveAxisConfig = (config) => {
  const hasXCalc = config?.xAxisCalc !== undefined;
  const hasYCalc = config?.yAxisCalc !== undefined;
  const hasXKey = !!config?.xAxisKey;
  const hasYKey = !!config?.yAxisKey;

  let categoryAxis = "y";

  if (hasXKey && hasYCalc) {
    categoryAxis = "x";
  } else if (hasYKey && hasXCalc) {
    categoryAxis = "y";
  } else if (hasXKey && !hasYKey) {
    categoryAxis = "x";
  } else if (hasYKey) {
    categoryAxis = "y";
  }

  const valueAxis = categoryAxis === "y" ? "x" : "y";
  const categoryKey = categoryAxis === "y" ? config?.yAxisKey : config?.xAxisKey;
  const valueKey = valueAxis === "x" ? config?.xAxisKey : config?.yAxisKey;
  const calc =
    valueAxis === "x"
      ? config?.xAxisCalc ?? config?.calc ?? "count"
      : config?.yAxisCalc ?? config?.calc ?? "count";

  return {
    categoryAxis,
    valueAxis,
    categoryKey,
    valueKey,
    calc,
    layout: categoryAxis === "y" ? "vertical" : "horizontal",
  };
};

const normaliseRowsForSourceColumns = (rows, config, axisConfig) => {
  if (!Array.isArray(config?.sourceColumns) || config.sourceColumns.length === 0) {
    return rows;
  }

  const categoryKey = axisConfig.categoryAxis === "x" ? SOURCE_COLUMNS_CATEGORY_KEY : SOURCE_COLUMNS_CATEGORY_KEY;
  const groupKey = config.groupBy || SOURCE_COLUMNS_GROUP_KEY;

  return rows.flatMap((row) =>
    config.sourceColumns.map((column) => ({
      [categoryKey]: toLabel(row?.[column.key]),
      [groupKey]: column.label ?? column.key,
    }))
  );
};

const sortItems = (items, config) => {
  const sortBy = config?.sortBy || "value";
  const sortDirection = (config?.sortDirection || "desc").toLowerCase();
  const multiplier = sortDirection === "asc" ? 1 : -1;

  return [...items].sort((left, right) => {
    if (sortBy === "label") {
      return left.label.localeCompare(right.label, undefined, { numeric: true }) * multiplier;
    }

    if (sortBy === "group") {
      return left.groupLabel.localeCompare(right.groupLabel, undefined, { numeric: true }) * multiplier;
    }

    return (left.value - right.value) * multiplier;
  });
};

const buildGroupedItems = (rows, config, axisConfig) => {
  const categoryKey = axisConfig.categoryKey ?? getConfigValue(config, "yAxisKey", "categoryKey") ?? SOURCE_COLUMNS_CATEGORY_KEY;
  const groupKey = getConfigValue(config, "groupBy", "groupKey") ?? (Array.isArray(config?.sourceColumns) ? SOURCE_COLUMNS_GROUP_KEY : undefined);
  const valueKey = axisConfig.valueKey ?? getConfigValue(config, "xAxisKey", "valueKey");
  const calc =
    axisConfig.calc ?? getConfigValue(config, "xAxisCalc", "calc") ?? "count";
  const calculator = CALCULATORS[calc] || CALCULATORS.count;
  const groupedRows = new Map();

  rows.forEach((row) => {
    const category = toLabel(row?.[categoryKey]);
    const group = groupKey ? toLabel(row?.[groupKey]) : "Value";
    const mapKey = `${category}::${group}`;
    if (!groupedRows.has(mapKey)) {
      groupedRows.set(mapKey, {
        category,
        group,
        rows: [],
      });
    }
    groupedRows.get(mapKey).rows.push(row);
  });

  const items = Array.from(groupedRows.values()).map((entry, idx) => ({
    label: entry.category,
    groupLabel: entry.group,
    value: calculator({ rows: entry.rows, valueKey }),
    color:
      config?.colors?.[entry.group] ||
      config?.colors?.[entry.category] ||
      DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  return sortItems(items, config);
};

const buildStackedSeries = (items) => {
  const byCategory = new Map();

  items.forEach((item) => {
    if (!byCategory.has(item.label)) {
      byCategory.set(item.label, { label: item.label });
    }
    byCategory.get(item.label)[item.groupLabel] = item.value;
  });

  return Array.from(byCategory.values());
};

export const BarChartV2 = ({ config, data, formatters }) => {
  const rows = Array.isArray(data) ? data : [];
  const axisConfig = React.useMemo(() => resolveAxisConfig(config), [config]);
  const normalisedRows = React.useMemo(
    () => normaliseRowsForSourceColumns(rows, config, axisConfig),
    [rows, config, axisConfig]
  );
  const items = React.useMemo(
    () => buildGroupedItems(normalisedRows, config, axisConfig),
    [normalisedRows, config, axisConfig]
  );
  const hasGroupings = React.useMemo(
    () => new Set(items.map((item) => item.groupLabel)).size > 1,
    [items]
  );
  const groupedSeries = React.useMemo(() => buildStackedSeries(items), [items]);
  const groupLabels = React.useMemo(
    () => Array.from(new Set(items.map((item) => item.groupLabel))),
    [items]
  );
  const axisFormatter = config.axisFormatter || formatters.axisFormatter || formatters.commify || defaultFormatters.commify;
  const tooltipFormatter = (val) =>
    formatters.tooltipFormatter
      ? formatters.tooltipFormatter(val)
      : formatTwoDp(val);
  const hasXLabel = !!getAxisLabel(config, "x");
  const hasYLabel = !!getAxisLabel(config, "y");
  const xAxisHeight = React.useMemo(
    () => computeXAxisHeight(config, items.map((item) => item.label)),
    [config, items]
  );
  const resolvedXAxisHeight = React.useMemo(
    () => xAxisHeight + (hasXLabel ? 18 : 0),
    [hasXLabel, xAxisHeight]
  );
  const categoryAxisWidth = React.useMemo(
    () => getCategoryAxisWidth(items, config),
    [items, config]
  );
  const valueAxisWidth = React.useMemo(
    () => getValueAxisWidth(items, config),
    [items, config]
  );
  const chartHeight = React.useMemo(
    () => getChartHeight({ items, hasGroupings, config, categoryAxis: axisConfig.categoryAxis }),
    [items, hasGroupings, config, axisConfig]
  );
  const chartMargin = React.useMemo(
    () =>
      getChartMargin({
        categoryAxis: axisConfig.categoryAxis,
        hasXLabel,
        hasYLabel,
      }),
    [axisConfig.categoryAxis, hasXLabel, hasYLabel]
  );

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Bar chart"}
      title={config.title}
      height={chartHeight}
      layout={config.layout}
    >
      <RBarChart
        data={hasGroupings ? groupedSeries : items}
        margin={chartMargin}
        barCategoryGap="18%"
        barGap={2}
        layout={axisConfig.layout}
      >
        <RCartesianGrid {...DEFAULTS.GRID} />
        {axisConfig.categoryAxis === "y" ? (
          <>
            <RXAxis
              type="number"
              domain={[0, "dataMax"]}
              allowDecimals={config.allowDecimals ?? false}
              tickFormatter={axisFormatter}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
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
              dataKey="label"
              width={categoryAxisWidth}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              tickLine={false}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 20,
                      fontSize: 14,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <RXAxis
              dataKey="label"
              angle={DEFAULTS.DIMENSIONS.xAngle}
              textAnchor="end"
              height={resolvedXAxisHeight}
              interval={0}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              label={
                hasXLabel
                  ? {
                      value: getAxisLabel(config, "x"),
                      position: "bottom",
                      offset: 8,
                      fontSize: 14,
                    }
                  : undefined
              }
            />
            <RYAxis
              domain={[0, "dataMax"]}
              allowDataOverflow
              allowDecimals={config.allowDecimals ?? false}
              tickFormatter={axisFormatter}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              width={valueAxisWidth}
              label={
                hasYLabel
                  ? {
                      value: getAxisLabel(config, "y"),
                      position: "left",
                      offset: 10,
                      fontSize: 14,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        )}
        <RTooltip formatter={tooltipFormatter} cursor={{ fill: "rgba(0,0,0,0.06)" }} />
        {hasGroupings ? <RLegend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 10 }} /> : null}
        {hasGroupings
          ? groupLabels.map((groupLabel, idx) => (
              <RBar
                key={groupLabel}
                dataKey={groupLabel}
                name={groupLabel}
                fill={config?.colors?.[groupLabel] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                stackId={config.stacked ? "stack" : undefined}
                barSize={config.barSize}
                isAnimationActive={config.isAnimationActive ?? false}
              />
            ))
          : (
              <RBar
                dataKey="value"
                name={getAxisLabel(config, "x") || "Value"}
                barSize={config.barSize}
                isAnimationActive={config.isAnimationActive ?? false}
              >
                {items.map((item, idx) => (
                  <RCell
                    key={`${item.label}-${idx}`}
                    fill={item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}
                  />
                ))}
              </RBar>
            )}
      </RBarChart>
    </ChartSection>
  );
};

export default BarChartV2;