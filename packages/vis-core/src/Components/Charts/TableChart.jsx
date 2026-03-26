import React from "react";
import { WarningBox } from "Components";
import { Section, Title } from "./ChartRenderer.styles";
import {
  DEFAULTS,
  getCommifyFormatter,
  getChartGridStyle,
  getValue,
  toRows,
} from "./ChartRenderer.utils.jsx";

const BASE_CELL_STYLE = {
  padding: 8,
  textAlign: "left",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  verticalAlign: "top",
};

const TABLE_STYLE = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: 12,
  background: "white",
  border: "1px solid #ddd",
  borderRadius: 6,
  overflow: "hidden",
};

const HEADER_ROW_STYLE = {
  background: DEFAULTS.BRAND_COLOR,
  color: "white",
};

const getCellStyle = (cellMaxWidth) => ({
  ...BASE_CELL_STYLE,
  ...(cellMaxWidth ? { maxWidth: cellMaxWidth } : {}),
});

export const TableChart = ({ config, data, formatters }) => {
  const tableLayout = config.tableLayout || "rows";
  const rowTableMinWidth = config.minWidth || "100%";
  const cellMaxWidth = config.cellMaxWidth;
  const baseCellStyle = React.useMemo(() => getCellStyle(cellMaxWidth), [cellMaxWidth]);
  const sectionStyle = React.useMemo(
    () => getChartGridStyle(config.layout, config.fullWidth),
    [config]
  );

  if (tableLayout === "rows") {
    const cols = config.columns || [];
    const rowData = toRows(data);
    const visibleRows = Number(config.visibleRows ?? 0);
    const clippedTableHeightPx =
      visibleRows > 0 ? Math.max(220, visibleRows * 34 + 54) : null;
    const rowTableMaxHeight = config.maxHeight || (clippedTableHeightPx ? `${clippedTableHeightPx}px` : undefined);

    if (!rowData.length || !cols.length) {
      return (
        <Section aria-label={config.ariaLabel || "Table"} style={sectionStyle}>
          {config.title && <Title>{config.title}</Title>}
          <WarningBox text="No data available for selection" />
        </Section>
      );
    }

    return (
      <Section aria-label={config.ariaLabel || "Table"} style={sectionStyle}>
        {config.title && <Title>{config.title}</Title>}
        <div
          style={{
            flex: "1 1 auto",
            minHeight: 0,
            overflowX: "auto",
            overflowY: rowTableMaxHeight ? "auto" : "visible",
            margin: "10px 0",
            ...(rowTableMaxHeight ? { maxHeight: rowTableMaxHeight } : {}),
          }}
        >
          <table
            style={{
              ...TABLE_STYLE,
              minWidth: rowTableMinWidth,
              tableLayout: config.fixedTableLayout ? "fixed" : "auto",
            }}
          >
            <thead>
              <tr style={HEADER_ROW_STYLE}>
                {cols.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      ...baseCellStyle,
                      fontWeight: 600,
                      position: config.stickyHeader ? "sticky" : "static",
                      top: 0,
                      background: DEFAULTS.BRAND_COLOR,
                      zIndex: 1,
                    }}
                    title={col.label ?? col.key}
                  >
                    {col.label ?? col.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowData.map((row, rowIndex) => (
                <tr
                  key={row.id ?? row.reference_id ?? rowIndex}
                  style={{
                    borderBottom:
                      rowIndex === rowData.length - 1 ? "none" : "1px solid #eee",
                  }}
                >
                  {cols.map((col, colIndex) => {
                    const value = row?.[col.key];
                    return (
                      <td
                        key={col.key}
                        style={{
                          ...baseCellStyle,
                          borderRight:
                            colIndex === cols.length - 1 ? "none" : "1px solid #eee",
                        }}
                        title={value ?? ""}
                      >
                        {value ?? ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    );
  }

  if (tableLayout !== "perc" && tableLayout !== "perc-table") {
    return (
      <Section aria-label={config.ariaLabel || "Table"}>
        {config.title && <Title>{config.title}</Title>}
        <WarningBox text={`Unsupported table layout: ${tableLayout}`} />
      </Section>
    );
  }

  const cols = config.columns || [];
  const keys = React.useMemo(() => cols.map((col) => col.key), [cols]);
  const rows = React.useMemo(
    () => cols.map((col) => ({ label: col.label ?? col.key, key: col.key })),
    [cols]
  );
  const total = React.useMemo(
    () => keys.reduce((acc, key) => acc + getValue(data, key), 0),
    [keys, data]
  );
  const fmt = {
    commify: getCommifyFormatter(formatters),
    percent: (v) => (total > 0 ? `${((v / total) * 100).toFixed(1)}%` : "0.0%"),
  };
  const firstColHeader = config.tableMetricName || "Metric";

  return (
    <Section aria-label={config.ariaLabel || "Table"} style={sectionStyle}>
      {config.title && <Title>{config.title}</Title>}
      <div style={{ overflowX: "auto", margin: "10px 0" }}>
        <table
          style={TABLE_STYLE}
        >
          <thead>
            <tr style={HEADER_ROW_STYLE}>
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
            {rows.map((row, idx) => {
              const val = getValue(data, row.key);
              return (
                <tr
                  key={row.key}
                  style={{
                    borderBottom: idx === rows.length - 1 ? "none" : "1px solid #eee",
                  }}
                >
                  <td style={{ padding: 8, borderRight: "1px solid #eee" }}>
                    {row.label}
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

export default TableChart;