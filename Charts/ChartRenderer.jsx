import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart as RBarChart,
  Bar as RBar,
  XAxis as RXAxis,
  YAxis as RYAxis,
  CartesianGrid as RCartesianGrid,
  Tooltip as RTooltip,
  PieChart as RPieChart,
  Pie as RPie,
  Cell as RCell,
  Legend as RLegend,
  LineChart as RLineChart,
  Line as RLine,
  AreaChart as RAreaChart,
  Area as RArea,
  ScatterChart as RScatterChart,
  Scatter as RScatter,
} from "recharts";
import styled from "styled-components";
import { WarningBox } from "Components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CARD_CONSTANTS } from "defaults";
const { CARD_WIDTH, PADDING, TOGGLE_BUTTON_WIDTH, TOGGLE_BUTTON_HEIGHT } =
  CARD_CONSTANTS;

// Shared styles
const Section = styled.section`
  margin: 8px 0 12px;
`;

const Title = styled.h3`
  margin: 6px 0 8px;
  font-size: 1.1em;
  color: #4b3e91;
`;

// Ranking display element for the ranking table
const RankBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: #a99ad6;
  color: white;
  border-radius: 50%;
  font-size: 13px;
  font-weight: bold;
  margin-right: 8px;
`;

const NameCell = styled.td`
  color: #7c5cd6;
  font-weight: 500;
`;

const ScoreCell = styled.td`
  font-weight: bold;
  color: #333;
  text-align: right;
`;

const RowTr = styled.tr`
  &.row-enter {
    opacity: 0;
    transform: translateY(-10px);
  }
  &.row-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.3s, transform 0.3s;
  }
  &.row-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.row-exit-active {
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s, transform 0.3s;
  }
`;

/**
 * Styled component for the toggle button.
 */
const ToggleButton = styled.button`
  z-index: 1001;
  width: ${TOGGLE_BUTTON_WIDTH}px;
  height: ${TOGGLE_BUTTON_HEIGHT}px;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: right 0.3s ease-in-out;
`;

const RotatingIcon = styled(FaChevronDown)`
  transition: transform 0.3s;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
`;

/**
 * Centralized chart configuration defaults
 * @constant {Object}
 */
const DEFAULTS = {
  BRAND_COLOR: "#4b3e91",
  DIMENSIONS: {
    baseHeight: 220,
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

/**
 * Default color palette for chart series (matches nssec pie legend)
 * @constant {Array<string>}
 */
const DEFAULT_COLORS = [
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

/**
 * Safely extracts a numeric value from data object
 * @param {Object} data - The data object containing values
 * @param {string} key - The key to extract from the data
 * @returns {number} - A finite number or 0 if value is invalid
 */
const getValue = (data, key) => {
  const raw = data?.[key];
  const n = Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Estimates the vertical space needed for rotated X-axis labels
 * @param {Array} labels - Array of label strings to measure
 * @param {number} angleDeg - Rotation angle in degrees (default: -45)
 * @param {number} fontSize - Font size in pixels (default: 11)
 * @param {number} avgCharWidth - Average character width in pixels (default: 7)
 * @returns {number} - Estimated height in pixels needed for rotated labels
 */
const estimateRotatedLabelBand = (
  labels = [],
  angleDeg = -45,
  fontSize = 11,
  avgCharWidth = 7
) => {
  if (!labels.length) return 40; // default axis height used elsewhere
  const rad = (Math.abs(angleDeg) * Math.PI) / 180;
  const s = Math.sin(rad);
  const c = Math.cos(rad);
  const maxWidth = Math.max(
    0,
    ...labels.map((l) => String(l ?? "").length * avgCharWidth)
  );
  const projected = s * maxWidth + c * fontSize + 2; // minimal padding to avoid extra whitespace
  return Math.max(40, Math.ceil(projected));
};

/**
 * Computes the appropriate X-axis height based on configuration and label dimensions
 * @param {Object} config - Chart configuration object
 * @param {Array} labels - Array of label strings for the X-axis
 * @returns {number} - Calculated height in pixels for the X-axis
 */
const computeXAxisHeight = (config, labels) => {
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

/**
 * Shared wrapper component for chart sections with consistent layout
 * @param {string} ariaLabel - Accessibility label for the chart section
 * @param {string} title - Optional title to display above the chart
 * @param {number} height - Height of the chart container
 * @param {React.ReactNode} children - Chart components to render inside
 * @returns {JSX.Element} - Wrapped chart section with responsive container
 */
const ChartSection = ({ ariaLabel, title, height, children }) => (
  <Section aria-label={ariaLabel}>
    {title && <Title>{title}</Title>}
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  </Section>
);

/**
 * Default formatting functions for chart values
 * @constant {Object}
 */
const defaultFormatters = {
  commify: (v) => {
    const n = Number(v ?? 0);
    return Number.isFinite(n) ? n.toLocaleString("en-GB") : String(v ?? "");
  },
  percent: (value, data, keys) => {
    const total = (keys || Object.keys(data || {})).reduce(
      (acc, k) => acc + getValue(data, k),
      0
    );
    const num = Number(value ?? 0);
    return total > 0 ? `${((num / total) * 100).toFixed(1)}%` : "0.0%";
  },
};

/**
 * Transforms configuration columns and data into series format for Recharts
 * @param {Object} config - Chart configuration containing columns definition
 * @param {Object} data - Raw data object with values
 * @returns {Array} - Array of series objects with key, label, value, color, and title
 */
const toSeries = (config, data) =>
  (config.columns || []).map((col, idx) => ({
    key: col.key,
    label: col.label ?? col.key,
    value: getValue(data, col.key),
    color: col.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
    title: col.title,
  }));

/**
 * Renders a responsive bar chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @param {Object} props.type - Value that defines whether the graph will be horizontal or vertical
 * @returns {JSX.Element} - Bar chart component with X/Y axes, grid, and tooltip
 */
const BarChart = ({ config, data, formatters, type = "horizontal" }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const hasXLabel = !!config.x_axis_title;
  const hasYLabel = !!config.y_axis_title;
  const formatter = (val) =>
    (formatters.commify || defaultFormatters.commify)(val);
  const barFill = config.barColor || DEFAULTS.BRAND_COLOR;
  const xAxisHeight = React.useMemo(
    () =>
      computeXAxisHeight(
        config,
        items.map((i) => i.label)
      ),
    [config, items]
  );
  const truncateLabel = (label, maxLen = 18) =>
    label.length > maxLen ? label.slice(0, maxLen) + "…" : label;
  const CustomTick = (props) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x}
        y={y}
        dy={4}
        textAnchor="end"
        fontSize={DEFAULTS.DIMENSIONS.tickFontSize}
      >
        {truncateLabel(payload.value)}
      </text>
    );
  };

  const chartMargin = { ...DEFAULTS.MARGIN };
  if (hasXLabel || hasYLabel) {
    chartMargin.bottom = 20;
  }

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Bar chart"}
      title={config.title}
      height={height}
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
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              label={
                hasXLabel
                  ? {
                      value: config.x_axis_title,
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
              width={100}
              tick={<CustomTick />}
              tickLine={false}
              label={
                hasYLabel
                  ? {
                      value: config.y_axis_title,
                      position: "bottom",
                      offset: 10,
                      fontSize: 14,
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
              height={xAxisHeight}
              interval={0}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
            />
            <RYAxis
              domain={[0, "dataMax"]}
              allowDataOverflow
              allowDecimals={false}
              tickFormatter={formatter}
              tick={{ fontSize: DEFAULTS.DIMENSIONS.tickFontSize }}
              width={DEFAULTS.DIMENSIONS.yAxisWidth}
            />
          </>
        )}
        <RTooltip formatter={formatter} cursor={{ fill: "rgba(0,0,0,0.06)" }} />
        <RBar dataKey="value" name="Value">
          {items.map((entry, idx) => (
            <RCell
              key={`cell-${idx}`}
              fill={config.colors[entry.label] || DEFAULTS.BRAND_COLOR}
            />
          ))}
        </RBar>
      </RBarChart>
    </ChartSection>
  );
};

/**
 * Renders a responsive multiple bar chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @param {Object} props.type - Value that defines whether the graph will be horizontal or vertical
 * @returns {JSX.Element} - Bar chart component with X/Y axes, grid, and tooltip
 */
const BarChartMultiple = ({
  config,
  data,
  formatters,
  type = "horizontal",
}) => {
  const items = React.useMemo(() => data, [data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const hasXLabel = !!config.x_axis_title;
  const hasYLabel = !!config.y_axis_title;
  const formatter = (val) =>
    (formatters.commify || defaultFormatters.commify)(val);
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
  const chartMargin = { ...DEFAULTS.MARGIN };
  if (hasXLabel || hasYLabel) {
    chartMargin.bottom = 20;
  }
  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Bar chart"}
      title={config.title}
      height={height}
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
                      value: config.x_axis_title,
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
              width={100}
              tick={<CustomTick />}
              tickLine={false}
              label={
                hasYLabel
                  ? {
                      value: config.y_axis_title,
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
              tick={<CustomTick angle={-45}/>}
              interval={0}
            />
            <RYAxis
              domain={[0, "dataMax"]}
              allowDataOverflow
              allowDecimals={false}
              tickFormatter={formatter}
              tick={<CustomTick />}
              width={DEFAULTS.DIMENSIONS.yAxisWidth}
              label={
                hasYLabel
                  ? {
                      value: config.y_axis_title,
                      position: "left",
                      offset: 0,
                      fontSize: 10,
                      angle: -90,
                    }
                  : undefined
              }
            />
          </>
        )}
        <RTooltip formatter={formatter} cursor={{ fill: "rgba(0,0,0,0.06)" }} />
        <RLegend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ paddingBottom: 10 }}
        />
        {config.columns.map((col, idx) => (
          <RBar
            key={col.key}
            dataKey={col.key}
            name={col.label}
            fill={config.colors[col.key]}
            barSize={DEFAULTS.BAR_SIZE || 24}
            isAnimationActive={false}
          />
        ))}
      </RBarChart>
    </ChartSection>
  );
};

/**
 * Renders a responsive line chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @returns {JSX.Element} - Line chart component with X/Y axes, grid, and tooltip
 */
const LineSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke = config.lineColor || DEFAULTS.BRAND_COLOR;
  const xAxisHeight = React.useMemo(
    () =>
      computeXAxisHeight(
        config,
        items.map((i) => i.label)
      ),
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

/**
 * Renders a responsive area chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @returns {JSX.Element} - Area chart component with X/Y axes, grid, and tooltip
 */
const AreaSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const stroke =
    config.areaStrokeColor || config.lineColor || DEFAULTS.BRAND_COLOR;
  const fill = config.areaFillColor || "rgba(75,62,145,0.25)";
  const xAxisHeight = React.useMemo(
    () =>
      computeXAxisHeight(
        config,
        items.map((i) => i.label)
      ),
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

/**
 * Renders a responsive scatter chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @returns {JSX.Element} - Scatter chart component with X/Y axes, grid, and tooltip
 */
const ScatterSeriesChart = ({ config, data, formatters }) => {
  const items = React.useMemo(() => toSeries(config, data), [config, data]);
  const height = config.height ?? DEFAULTS.DIMENSIONS.baseHeight;
  const fill = config.scatterColor || DEFAULTS.BRAND_COLOR;
  const xAxisHeight = React.useMemo(
    () =>
      computeXAxisHeight(
        config,
        items.map((i) => i.label)
      ),
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

/**
 * Renders a responsive donut/pie chart using Recharts
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to chart
 * @param {Object} props.formatters - Custom formatting functions for values
 * @returns {JSX.Element} - Donut pie chart component with legend and tooltip
 */
const DonutPieChart = ({ config, data, formatters }) => {
  const items = toSeries(config, data);
  const size = config.size ?? DEFAULTS.DIMENSIONS.pieSize; // controls height only; radii are percentages to auto-fit width
  const total = Math.max(
    0.00001,
    items.reduce((a, b) => a + b.value, 0)
  );
  const pctFmt = (v) =>
    total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0.0%";

  return (
    <ChartSection
      ariaLabel={config.ariaLabel || "Donut chart"}
      title={config.title}
      height={size}
    >
      <RPieChart>
        <RTooltip
          formatter={(value, name, props) => [
            (formatters?.commify || defaultFormatters.commify)(value) +
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
          {items.map((it) => (
            <RCell key={it.key} fill={it.color} />
          ))}
        </RPie>
      </RPieChart>
    </ChartSection>
  );
};

/**
 * Renders data as an HTML table with metric names, counts, and percentages
 * @param {Object} props - Component props
 * @param {Object} props.config - Chart configuration object
 * @param {Object} props.data - Data object containing values to display
 * @param {Object} props.formatters - Custom formatting functions for values
 * @returns {JSX.Element} - Styled table component with headers and data rows
 */
const TableChart = ({ config, data, formatters }) => {
  const cols = config.columns || [];
  const keys = React.useMemo(() => cols.map((c) => c.key), [cols]);
  const rows = React.useMemo(
    () => cols.map((c) => ({ label: c.label ?? c.key, key: c.key })),
    [cols]
  );
  const total = React.useMemo(
    () => keys.reduce((acc, k) => acc + getValue(data, k), 0),
    [keys, data]
  );
  const fmt = {
    commify: formatters.commify || defaultFormatters.commify,
    percent: (v) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0.0%"),
  };
  const firstColHeader = config.tableMetricName || "Metric";

  return (
    <Section aria-label={config.ariaLabel || "Table"}>
      {config.title && <Title>{config.title}</Title>}
      <div style={{ overflowX: "auto", margin: "10px 0" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 12,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ background: DEFAULTS.BRAND_COLOR, color: "white" }}>
              <th style={{ padding: 8, textAlign: "left", fontWeight: 600 }}>
                {firstColHeader}
              </th>
              <th style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>
                Count
              </th>
              <th style={{ padding: 8, textAlign: "right", fontWeight: 600 }}>
                %
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const val = getValue(data, r.key);
              return (
                <tr
                  key={r.key}
                  style={{
                    borderBottom:
                      idx === rows.length - 1 ? "none" : "1px solid #eee",
                  }}
                >
                  <td style={{ padding: 8, borderRight: "1px solid #eee" }}>
                    {r.label}
                  </td>
                  <td
                    style={{
                      padding: 8,
                      textAlign: "right",
                      borderRight: "1px solid #eee",
                    }}
                  >
                    {fmt.commify(val)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {fmt.percent(val)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Section>
  );
};

const RankingChart = ({ config, data, formatters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const cols = config.columns || [];
  const rows = React.useMemo(
    () => cols.map((c) => ({ label: c.label ?? c.key, key: c.key })),
    [cols]
  );
  const ranks = config?.ranks;

  const sortedRows = React.useMemo(() => {
    if (ranks) {
      return [...rows].sort((a, b) => {
        const rankA = ranks[a.key] ?? Infinity;
        const rankB = ranks[b.key] ?? Infinity;
        return rankA - rankB;
      });
    }
    return rows;
  }, [rows, ranks]);

  // Display everything if isOpen, otherwise only the first 5
  const visibleRows = isOpen ? sortedRows : sortedRows.slice(0, 5);

  const fmt = {
    commify:
      formatters?.commify || ((v) => Number(v ?? 0).toLocaleString("en-GB")),
  };

  return (
    <div style={{ overflowX: "auto", margin: "10px 0" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title>{config.title}</Title>
        {rows.length > 5 ? (
          <ToggleButton onClick={() => setIsOpen(!isOpen)}>
            <RotatingIcon $isOpen={isOpen} />
          </ToggleButton>
        ) : null}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
          background: "transparent",
          border: "none",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 32 }}></th>
            <th style={{ textAlign: "left", fontWeight: 600 }}>Name</th>
            <th style={{ textAlign: "right", fontWeight: 600 }}>Score</th>
          </tr>
        </thead>
        <TransitionGroup component="tbody">
          {visibleRows.map((r, idx) => {
            const val = data[r.key];
            return (
              <CSSTransition key={r.key} timeout={300} classNames="row">
                <RowTr>
                  <td>
                    <RankBadge>{ranks ? ranks[r.key] : idx + 1}</RankBadge>
                  </td>
                  <NameCell>{r.label}</NameCell>
                  <ScoreCell>{fmt.commify(val)}</ScoreCell>
                </RowTr>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        {/* Display "..." only if the list is collapsed */}
        {!isOpen && rows.length > 5 && (
          <RowTr>
            <td colSpan={3} style={{ color: "#888", paddingLeft: 32 }}>
              ...
            </td>
          </RowTr>
        )}
      </table>
    </div>
  );
};

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

  // Determine if data has values
  const hasAny = Array.isArray(data)
    ? data.length > 0 &&
      data.some((row) =>
        Object.entries(row)
          .filter(([k]) => k !== (charts[0]?.xKey || "label"))
          .some(([, v]) => Number(v) > 0)
      )
    : data && Object.values(data).some((v) => (Number(v) || 0) > 0);

  if (!hasAny) return null;

  return (
    <div>
      {charts.map((cfg, idx) => {
        const type = (cfg.type || "").toLowerCase();
        switch (type) {
          case "bar":
            return (
              <BarChart
                key={idx}
                config={{
                  ...cfg,
                  height:
                    cfg.height ?? barHeight ?? DEFAULTS.DIMENSIONS.baseHeight,
                }}
                data={data}
                formatters={f}
              />
            );
          case "bar_vertical":
            return (
              <BarChart
                key={idx}
                config={{
                  ...cfg,
                  height:
                    cfg.height ?? barHeight ?? DEFAULTS.DIMENSIONS.baseHeight,
                }}
                data={data}
                formatters={f}
                type="vertical"
              />
            );
          case "multiple_bar":
            return (
              <BarChartMultiple
                key={idx}
                config={{
                  ...cfg,
                  height:
                    cfg.height ?? barHeight ?? DEFAULTS.DIMENSIONS.baseHeight,
                }}
                data={data}
                formatters={f}
              />
            );
          case "multiple_bar_vertical":
            return (
              <BarChartMultiple
                key={idx}
                config={{
                  ...cfg,
                  height:
                    cfg.height ?? barHeight ?? DEFAULTS.DIMENSIONS.baseHeight,
                }}
                data={data}
                formatters={f}
                type="vertical"
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
          case "histogram":
            return (
              <Section key={idx}>
                <Title>{cfg.title || `${type} chart`}</Title>
                <WarningBox
                  text={`${type} not implemented yet in chart engine.`}
                />
              </Section>
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
