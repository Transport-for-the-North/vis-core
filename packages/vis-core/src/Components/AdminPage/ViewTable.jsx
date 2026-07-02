import React from "react";
import { DEFAULT_MAX_ROWS, buildDisplayFields } from "utils";
import { useTableData, useLookups } from "hooks";
import { CellValue } from "./CellValue";
import {
  SectionTitle, StatusMessage, ErrorMessage, TableWrap, Table, Th, Td,
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
  const { rows, columns, loading, error } = useTableData(table);
  const { lookups, lookupLabels } = useLookups(table);
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels, table.hiddenColumns);
  const maxRows = table.maxRows ?? DEFAULT_MAX_ROWS;

  return (
    <div>
      <SectionTitle>{table.displayName}</SectionTitle>
      {error && <ErrorMessage style={{ marginBottom: 8 }}>{error}</ErrorMessage>}
      {loading ? (
        <StatusMessage>Loading…</StatusMessage>
      ) : (
        <TableWrap $scroll={rows.length > maxRows} $maxRows={maxRows}>
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
                  <tr key={i}>
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
