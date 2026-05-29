import React from "react";
import styled from "styled-components";
import { WarningBox } from "Components";
import { Section, Title } from "./ChartRenderer.styles";
import {
  formatTwoDp,
  getCommifyFormatter,
  getChartGridStyle,
  toDisplayLabel,
  toRows,
} from "./ChartRenderer.utils.jsx";

const CardGrid = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 108px;
`;

const FixedTitle = styled.div`
  min-height: 48px;
  max-height: 48px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  text-align: center;
  width: 100%;
  overflow: hidden;
  padding-top: 0;
`;

const TitleSpacer = styled.div`
  height: 12px;
  width: 100%;
`;

const CenteredCardValue = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 56px;
  width: 100%;
`;

const CardValue = styled.div`
  color: #2b2b2b;
  font-size: clamp(1.5rem, 2vw, 2.1rem);
  font-weight: 700;
  line-height: 1.1;
  word-break: break-word;
`;

const CardMeta = styled.div`
  color: #516173;
  font-size: 0.95rem;
  line-height: 1.35;
`;

const toNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const getNumericValues = (rows, column) =>
  rows
    .map((row) => toNumber(row?.[column]))
    .filter((value) => value !== null);

const calculateAggregate = ({ rows, calc, column }) => {
  const mode = String(calc || "count").toLowerCase();

  if (mode === "count") {
    return rows.length;
  }

  if (!column) {
    return null;
  }

  const values = getNumericValues(rows, column);

  if (!values.length) {
    return null;
  }

  if (mode === "mean" || mode === "avg" || mode === "average") {
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  }

  if (mode === "sum") {
    return values.reduce((sum, value) => sum + value, 0);
  }

  if (mode === "min") {
    return Math.min(...values);
  }

  if (mode === "max") {
    return Math.max(...values);
  }

  return null;
};

const calculateGroupedAggregate = ({ rows, calc, column, groupBy, show }) => {
  if (!groupBy) {
    return null;
  }

  const groupedRows = new Map();

  rows.forEach((row) => {
    const label = toDisplayLabel(row?.[groupBy]);

    if (!groupedRows.has(label)) {
      groupedRows.set(label, []);
    }

    groupedRows.get(label).push(row);
  });

  const groupedValues = Array.from(groupedRows.entries())
    .map(([label, groupRows]) => ({
      label,
      value: calculateAggregate({ rows: groupRows, calc, column }),
    }))
    .filter((entry) => entry.value !== null);

  if (!groupedValues.length) {
    return null;
  }

  const comparator = (left, right) => {
    if (left.value === right.value) {
      return left.label.localeCompare(right.label, undefined, { numeric: true });
    }

    return left.value - right.value;
  };

  const sorted = [...groupedValues].sort(comparator);
  return String(show || "best").toLowerCase() === "worst"
    ? sorted[0]
    : sorted[sorted.length - 1];
};

const resolveFormatter = (config, formatters, fallback) => {
  if (typeof config?.valueFormatter === "function") {
    return config.valueFormatter;
  }

  if (
    typeof config?.valueFormatter === "string" &&
    typeof formatters?.[config.valueFormatter] === "function"
  ) {
    return formatters[config.valueFormatter];
  }

  return fallback;
};

const formatMetricValue = ({ value, config, formatters, isCount }) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  const fallbackFormatter = isCount
    ? getCommifyFormatter(formatters)
    : formatTwoDp;
  const formatter = resolveFormatter(config, formatters, fallbackFormatter);
  const formattedValue = formatter(value);
  const prefix = config?.valuePrefix || "";
  const suffix = config?.valueSuffix || "";

  return `${prefix}${formattedValue}${suffix}`;
};

const buildCardContent = ({ config, rows, formatters }) => {
  const calc = String(config?.calc || "count").toLowerCase();
  const column = config?.column || config?.valueKey;

  if (config?.groupBy) {
    const groupedResult = calculateGroupedAggregate({
      rows,
      calc,
      column,
      groupBy: config.groupBy,
      show: config.show,
    });

    if (!groupedResult) {
      return {
        value: "N/A",
        meta: config?.emptyText || "No data available for selection",
      };
    }

    return {
      value: groupedResult.label,
      meta: `${config?.summaryLabel || "Average"}: ${formatMetricValue({
        value: groupedResult.value,
        config,
        formatters,
        isCount: calc === "count",
      })}`,
    };
  }

  const aggregateValue = calculateAggregate({ rows, calc, column });

  if (aggregateValue === null) {
    return {
      value: "N/A",
      meta: config?.emptyText || "No data available for selection",
    };
  }

  return {
    value: formatMetricValue({
      value: aggregateValue,
      config,
      formatters,
      isCount: calc === "count",
    }),
    meta: config?.description || null,
  };
};

/**
 * Card renders a summary card for a single metric or grouped aggregate, with optional title and meta.
 *
 * Supports aggregation (count, sum, mean, min, max, etc), grouping, and custom formatting.
 *
 * @param {Object} props - Component properties
 * @param {Object} props.config - Card configuration (title, calc, column, groupBy, etc)
 * @param {Array|Object} props.data - Data to summarise
 * @param {Object} props.formatters - Optional value formatters
 * @returns {JSX.Element}
 */
export const Card = ({ config, data, formatters = {} }) => {
  // Convert data to array of rows
  const rows = React.useMemo(() => toRows(data), [data]);
  // Memoise section style for layout
  const sectionStyle = React.useMemo(
    () => getChartGridStyle(config.layout, config.fullWidth),
    [config]
  );
  // Build card value and meta content
  const content = React.useMemo(
    () => buildCardContent({ config, rows, formatters }),
    [config, formatters, rows]
  );

  // Show warning if no data
  if (!rows.length) {
    return (
      <Section aria-label={config.ariaLabel || config.title || "Card"} style={sectionStyle}>
        {config.title && <Title>{config.title}</Title>}
        <WarningBox text={config?.emptyText || "No data available for selection"} />
      </Section>
    );
  }

  return (
    <Section aria-label={config.ariaLabel || config.title || "Card"} style={sectionStyle}>
      <CardGrid>
        {config.title && (
          <>
            <FixedTitle>
              <Title>{config.title}</Title>
            </FixedTitle>
            <TitleSpacer />
          </>
        )}
        <CenteredCardValue><CardValue>{content.value}</CardValue></CenteredCardValue>
        {content.meta ? (
          <>
            <TitleSpacer />
            <CardMeta>{content.meta}</CardMeta>
          </>
        ) : null}
      </CardGrid>
    </Section>
  );
};

export default Card;