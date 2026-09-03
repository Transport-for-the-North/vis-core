import React from "react";
import { DEFAULT_MAX_ROWS, buildDisplayFields, makeRowKey } from "utils";
import { useTableData, useLookups, useTableScrollCap } from "hooks";
import { CellValue } from "./CellValue";
import {
  SectionTitle, SectionHeader, InlineStatus, StatusMessage, ErrorMessage,
  TableWrap, Table, Th, Td,
} from "./styles";

/**
 * Renders a read-only table: every column from the configured table, no editing.
 * Columns configured with a lookup + addToTable show a friendly-label column instead of
 * the raw id.
 *
 * @param {Object} props
 * @param {Object} props.table - View table config (tableName, schema, displayName, filter, lookups).
 * @returns {JSX.Element} The view table section.
 */
export function ViewTable({ table }) {
  const { rows, columns, loading, refreshing, error } = useTableData(table);
  const { lookups, lookupLabels } = useLookups(table);
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels, table.hiddenColumns);
  const rowKey = makeRowKey(columns);
  const maxRows = table.maxRows ?? DEFAULT_MAX_ROWS;
  // Cap the table at exactly maxRows visible rows, scrolling beyond that.
  const { scrollRef, maxHeight } = useTableScrollCap(maxRows, rows.length, displayFields.length);

  return (
    <div>
      <SectionHeader>
        <SectionTitle>{table.displayName}</SectionTitle>
        {/* Sits on the heading line so reloading never changes the section's height. */}
        {refreshing && <InlineStatus $tone="muted">Updating…</InlineStatus>}
      </SectionHeader>
      {error && <ErrorMessage style={{ marginBottom: 8 }}>{error}</ErrorMessage>}
      {loading ? (
        <StatusMessage>Loading…</StatusMessage>
      ) : (
        <TableWrap
          ref={scrollRef}
          aria-busy={refreshing}
          $scroll={rows.length > maxRows}
          $maxRows={maxRows}
          $maxHeight={maxHeight}
        >
          <Table>
            <thead>
              <tr>{displayFields.map((f) => <Th key={f.key}>{f.header}</Th>)}</tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <Td colSpan={displayFields.length} style={{ color: "#9ca3af", fontStyle: "italic" }}>
                    No rows
                  </Td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={rowKey(row, i)}>
                    {displayFields.map((f) => (
                      <Td key={f.key}><CellValue value={f.render(row)} /></Td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}
