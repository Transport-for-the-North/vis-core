import React, { useEffect, useState } from "react";
import { AppButton } from "Components/AppButton";
import {
  DEFAULT_MAX_ROWS,
  inputTypeFor,
  humaniseHeader,
  buildDisplayFields,
  coerceValues,
  buildAlsoInsert,
  makeRowKey,
} from "utils";
// Direct module path: the cache is deliberately not re-exported from the utils barrel.
import { clearMetadataCache } from "utils/metadataCache";
import { useTableData, useLookups, useAdminApi, useAdminCanEdit, useAdminRefresh, useTableScrollCap } from "hooks";
import { LookupSelect } from "./LookupSelect";
import { CellValue } from "./CellValue";
import {
  SectionTitle, SectionHeader, InlineStatus, StatusMessage, ErrorMessage, TableWrap,
  Table, Th, Td, ActionTh, ActionTd, AddRow, FieldInput,
} from "./styles";

/**
 * Renders an editable table with row deletion and a schema-driven add form. Editable
 * columns are derived from the metadata (auto-populated columns are hidden); columns
 * configured with a lookup render as dropdowns.
 *
 * A lookup column marked `multiSelect` lets several values be picked at once, and Add then
 * inserts one row per selected value (all other fields shared). Only one column per table
 * may be `multiSelect` — the first one configured wins — since two would otherwise imply a
 * cross-product of rows.
 *
 * @param {Object} props
 * @param {Object} props.table - Edit table config
 *   (tableName, schema, displayName, filter, fixedValues, lookups, auditWrite, maxRows).
 * @returns {JSX.Element} The edit table section.
 */
export function EditTable({ table }) {
  const adminApi = useAdminApi();
  const canEdit = useAdminCanEdit();
  const { requestRefresh } = useAdminRefresh();
  const fixedValues = table.fixedValues ?? {};
  const auditWrite = table.auditWrite ?? null;
  // Other sections (by table name) to reload after a mutation here — e.g. the audit log,
  // which this table's auditWrite appends to on add/delete.
  const refreshTables = table.refreshTables ?? [];
  const { rows, columns, loading, refreshing, error, refetch } = useTableData(table);
  const { lookups, lookupOptions, lookupLabels } = useLookups(table);
  const [fieldValues, setFieldValues] = useState(fixedValues);
  const [mutating, setMutating] = useState(false);
  // Outcome of the last add/delete as `{ text, tone }`. Kept separate from the hook's load
  // error because a mutation is followed by a refetch, which resets that one.
  const [feedback, setFeedback] = useState(null);

  // Re-seed the add form with the locked/default values whenever the config changes.
  useEffect(() => {
    setFieldValues(fixedValues);
    setFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.tableName]);

  /**
   * Builds the add-dropdown options for a lookup column, excluding values already
   * present in the table when the config requests it (rows are scoped by the same filter).
   *
   * @param {string} col - The column name.
   * @returns {Array<{value: *, label: string}>} The selectable options.
   */
  const optionsForColumn = (col) => {
    const all = lookupOptions[col] ?? [];
    if (!lookups[col]?.excludeRegistered) return all;
    const used = new Set(rows.map((r) => String(r[col])));
    return all.filter((o) => !used.has(String(o.value)));
  };

  // Columns shown in the add form: everything the DB does not auto-populate (no
  // default / not identity) and that the config does not lock via fixedValues.
  const addColumns = columns.filter(
    (c) => !c.isGenerated && !(c.name in fixedValues)
  );
  const primaryKeys = columns.filter((c) => c.isPrimaryKey).map((c) => c.name);
  const rowKey = makeRowKey(columns);
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels, table.hiddenColumns);
  const maxRows = table.maxRows ?? DEFAULT_MAX_ROWS;
  // View-only users (e.g. cross-app super admins) see the table but no delete/add controls.
  const showActions = canEdit && primaryKeys.length > 0;
  // Cap the table at exactly maxRows visible rows (edit rows are taller than the default
  // estimate because of the action button), scrolling beyond that.
  const { scrollRef, maxHeight } = useTableScrollCap(
    maxRows, rows.length, displayFields.length + (showActions ? 1 : 0)
  );

  // The one column (if any) whose selection fans out into several inserts. Restricted to a
  // single column so the rows added stay a plain list rather than a cross-product.
  const multiSelectColumn = addColumns.find((c) => lookups[c.name]?.multiSelect)?.name ?? null;

  /**
   * The add-form value for a column, normalised to an array for multi-select columns.
   * @param {string} col - The column name.
   * @returns {Array<*>} The selected values (empty when nothing is picked).
   */
  const selectedValues = (col) => {
    const v = fieldValues[col];
    return Array.isArray(v) ? v : v === undefined || v === "" ? [] : [v];
  };

  const canAdd =
    addColumns.length > 0 &&
    addColumns.every((c) => {
      if (c.isNullable) return true;
      if (c.name === multiSelectColumn) return selectedValues(c.name).length > 0;
      const v = fieldValues[c.name];
      return v !== undefined && v !== "";
    });

  // Rows the current form would insert: one per value picked in the multi-select column
  // (sharing every other field), or a single row when there is no multi-select column.
  const pendingRows = (() => {
    const values = multiSelectColumn ? selectedValues(multiSelectColumn) : [];
    if (values.length === 0) return [fieldValues];
    return values.map((v) => ({ ...fieldValues, [multiSelectColumn]: v }));
  })();

  /**
   * Resets the add form back to the table's fixed/default values.
   * @returns {void}
   */
  const resetForm = () => setFieldValues(fixedValues);

  /**
   * Inserts a row per selected value (each with an optional audit-log entry in the same
   * transaction), then refreshes the rows. Inserts run one at a time so a partial failure
   * can be reported precisely — the rows that succeeded stay inserted.
   * @returns {Promise<void>}
   */
  const handleAdd = async () => {
    setMutating(true);
    setFeedback(null);

    let added = 0;
    for (const row of pendingRows) {
      const values = coerceValues(columns, row);
      try {
        await adminApi.addRow({
          tableName: table.tableName,
          schema: table.schema,
          values,
          alsoInsert: buildAlsoInsert(auditWrite, "onAdd", values),
        });
        added += 1;
      } catch {
        // Counted below; the loop continues so one bad row doesn't block the rest.
      }
    }

    // One line covering both halves of a partial failure, since the feedback shares the
    // heading line and only one message can be shown.
    const total = pendingRows.length;
    const failed = total - added;
    if (failed === 0) {
      setFeedback({ text: `Added ${added} row${added === 1 ? "" : "s"}.`, tone: "success" });
    } else if (added === 0) {
      setFeedback({
        text: total === 1 ? "Failed to add row." : `Failed to add all ${total} rows.`,
        tone: "error",
      });
    } else {
      setFeedback({ text: `Added ${added} of ${total} rows — ${failed} failed.`, tone: "error" });
    }

    if (added > 0) {
      resetForm();
      // What was just inserted can change what a metadata endpoint returns (e.g. the
      // scenarios registered to this app), so drop the cached responses — otherwise the
      // stale list is served from sessionStorage for the rest of the browser session.
      clearMetadataCache();
    }
    refetch();
    requestRefresh(refreshTables);
    setMutating(false);
  };

  /**
   * Deletes a row by its primary key(s) (plus an optional audit-log entry in the same
   * transaction), then refreshes the rows.
   *
   * @param {Object} row - The row to delete (keyed by column name).
   * @returns {Promise<void>}
   */
  const handleDelete = async (row) => {
    const keyValues = {};
    primaryKeys.forEach((k) => { keyValues[k] = row[k]; });
    setMutating(true);
    setFeedback(null);
    try {
      await adminApi.deleteRow({
        tableName: table.tableName,
        schema: table.schema,
        keyValues,
        alsoInsert: buildAlsoInsert(auditWrite, "onDelete", row),
      });
      // As with add: the deleted row may be part of what a metadata endpoint returns.
      clearMetadataCache();
      refetch();
      requestRefresh(refreshTables);
    } catch {
      setFeedback({ text: "Failed to delete row.", tone: "error" });
    } finally {
      setMutating(false);
    }
  };

  // Transient feedback shares the heading line so it can appear and clear without moving the
  // table. A load failure stays a block message below, since the table is empty anyway.
  const inlineStatus = feedback ?? (refreshing ? { text: "Updating…", tone: "muted" } : null);

  return (
    <div>
      <SectionHeader>
        <SectionTitle>{table.displayName}</SectionTitle>
        {inlineStatus && <InlineStatus $tone={inlineStatus.tone}>{inlineStatus.text}</InlineStatus>}
      </SectionHeader>
      {error && <ErrorMessage style={{ marginBottom: 8 }}>{error}</ErrorMessage>}
      {loading ? (
        <StatusMessage>Loading…</StatusMessage>
      ) : (
        <>
          <TableWrap
            ref={scrollRef}
            aria-busy={refreshing}
            $scroll={rows.length > maxRows}
            $maxRows={maxRows}
            $maxHeight={maxHeight}
          >
            <Table>
              <thead>
                <tr>
                  {showActions && <ActionTh />}
                  {displayFields.map((f) => <Th key={f.key}>{f.header}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <Td colSpan={displayFields.length + (showActions ? 1 : 0)} style={{ color: "#9ca3af", fontStyle: "italic" }}>
                      No rows
                    </Td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr key={rowKey(row, i)}>
                      {showActions && (
                        <ActionTd>
                          <AppButton
                            $bgColor="#dc2626"
                            $height="28px"
                            disabled={mutating}
                            onClick={() => handleDelete(row)}
                          >
                            Remove
                          </AppButton>
                        </ActionTd>
                      )}
                      {displayFields.map((f) => (
                        <Td key={f.key}><CellValue value={f.render(row)} /></Td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
          {canEdit && addColumns.length > 0 && (
            <AddRow>
              {addColumns.map((c) =>
                lookups[c.name] ? (
                  <LookupSelect
                    key={c.name}
                    options={optionsForColumn(c.name)}
                    value={fieldValues[c.name] ?? (c.name === multiSelectColumn ? [] : "")}
                    onChange={(val) =>
                      setFieldValues((prev) => ({ ...prev, [c.name]: val }))
                    }
                    placeholder={
                      lookups[c.name].placeholder ??
                      humaniseHeader(c.name) + (c.isNullable ? "" : " *")
                    }
                    disabled={mutating}
                    multi={c.name === multiSelectColumn}
                  />
                ) : (
                  <FieldInput
                    key={c.name}
                    type={inputTypeFor(c.dataType)}
                    placeholder={humaniseHeader(c.name) + (c.isNullable ? "" : " *")}
                    value={fieldValues[c.name] ?? ""}
                    onChange={(e) =>
                      setFieldValues((prev) => ({ ...prev, [c.name]: e.target.value }))
                    }
                    disabled={mutating}
                  />
                )
              )}
              <AppButton disabled={!canAdd || mutating} onClick={handleAdd}>
                {/* Name the row count once several can be added in one press. */}
                {canAdd && pendingRows.length > 1 ? `Add ${pendingRows.length}` : "Add"}
              </AppButton>
            </AddRow>
          )}
        </>
      )}
    </div>
  );
}
