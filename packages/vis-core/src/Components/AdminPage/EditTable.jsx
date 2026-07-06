import React, { useEffect, useState } from "react";
import { AppButton } from "Components/AppButton";
import {
  DEFAULT_MAX_ROWS,
  inputTypeFor,
  humaniseHeader,
  buildDisplayFields,
  coerceValues,
  buildAlsoInsert,
} from "utils";
import { useTableData, useLookups, useAdminApi, useAdminCanEdit, useAdminRefresh, useTableScrollCap } from "hooks";
import { LookupSelect } from "./LookupSelect";
import { CellValue } from "./CellValue";
import {
  SectionTitle, StatusMessage, ErrorMessage, TableWrap, Table, Th, Td,
  ActionTh, ActionTd, AddRow, FieldInput,
} from "./styles";

/**
 * Renders an editable table with row deletion and a schema-driven add form. Editable
 * columns are derived from the metadata (auto-populated columns are hidden); columns
 * configured with a lookup render as dropdowns.
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
  const { rows, columns, loading, error, setError, refetch } = useTableData(table);
  const { lookups, lookupOptions, lookupLabels } = useLookups(table);
  const [fieldValues, setFieldValues] = useState(fixedValues);
  const [mutating, setMutating] = useState(false);

  // Re-seed the add form with the locked/default values whenever the config changes.
  useEffect(() => {
    setFieldValues(fixedValues);
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
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels, table.hiddenColumns);
  const maxRows = table.maxRows ?? DEFAULT_MAX_ROWS;
  // View-only users (e.g. cross-app super admins) see the table but no delete/add controls.
  const showActions = canEdit && primaryKeys.length > 0;
  // Cap the table at exactly maxRows visible rows (edit rows are taller than the default
  // estimate because of the action button), scrolling beyond that.
  const { scrollRef, maxHeight } = useTableScrollCap(
    maxRows, rows.length, displayFields.length + (showActions ? 1 : 0)
  );

  const canAdd =
    addColumns.length > 0 &&
    addColumns.every((c) => {
      if (c.isNullable) return true;
      const v = fieldValues[c.name];
      return v !== undefined && v !== "";
    });

  /**
   * Resets the add form back to the table's fixed/default values.
   * @returns {void}
   */
  const resetForm = () => setFieldValues(fixedValues);

  /**
   * Inserts the current add-form values (plus an optional audit-log entry in the same
   * transaction), then refreshes the rows.
   * @returns {Promise<void>}
   */
  const handleAdd = async () => {
    const values = coerceValues(columns, fieldValues);
    setMutating(true);
    try {
      await adminApi.addRow({
        tableName: table.tableName,
        schema: table.schema,
        values,
        alsoInsert: buildAlsoInsert(auditWrite, "onAdd", values),
      });
      resetForm();
      refetch();
      requestRefresh(refreshTables);
    } catch {
      setError("Failed to add row.");
    } finally {
      setMutating(false);
    }
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
    try {
      await adminApi.deleteRow({
        tableName: table.tableName,
        schema: table.schema,
        keyValues,
        alsoInsert: buildAlsoInsert(auditWrite, "onDelete", row),
      });
      refetch();
      requestRefresh(refreshTables);
    } catch {
      setError("Failed to delete row.");
    } finally {
      setMutating(false);
    }
  };

  return (
    <div>
      <SectionTitle>{table.displayName}</SectionTitle>
      {error && <ErrorMessage style={{ marginBottom: 8 }}>{error}</ErrorMessage>}
      {loading ? (
        <StatusMessage>Loading…</StatusMessage>
      ) : (
        <>
          <TableWrap ref={scrollRef} $scroll={rows.length > maxRows} $maxRows={maxRows} $maxHeight={maxHeight}>
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
                    <tr key={i}>
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
                    value={fieldValues[c.name] ?? ""}
                    onChange={(val) =>
                      setFieldValues((prev) => ({ ...prev, [c.name]: val }))
                    }
                    placeholder={
                      lookups[c.name].placeholder ??
                      humaniseHeader(c.name) + (c.isNullable ? "" : " *")
                    }
                    disabled={mutating}
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
                Add
              </AppButton>
            </AddRow>
          )}
        </>
      )}
    </div>
  );
}
