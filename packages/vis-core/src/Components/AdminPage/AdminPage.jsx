import React, { useContext, useEffect, useMemo, useState } from "react";
import styled, { useTheme } from "styled-components";
import Select from "react-select";
import { AppContext } from "contexts";
import { api } from "services";
import { AppButton } from "Components/AppButton";
import { makeSelectStyles } from "utils/selectStyles";

// Tables show at most this many rows before scrolling unless a table sets its own
// `maxRows`; the px values approximate the rendered row/header heights used to cap the
// scroll container.
const DEFAULT_MAX_ROWS = 8;
const ROW_HEIGHT_PX = 40;
const HEADER_HEIGHT_PX = 38;

const Page = styled.div`
  padding: 16px 32px 32px;
  background: #f5f5f5;
  min-height: calc(100vh - 75px);
  box-sizing: border-box;
`;

const LayoutContainer = styled.div`
  display: flex;
  gap: 32px;
  align-items: flex-start;
`;

const Column = styled.div`
  flex: ${({ $flex }) => $flex ?? 1};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CellStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  text-align: left;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  border-left: 4px solid ${({ $hasData }) => ($hasData ? "#7317de" : "#d1d5db")};
`;

const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: #9ca3af;
  flex-shrink: 0;
  margin-right: 12px;
`;

const Value = styled.span`
  color: #111;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
`;

const NoData = styled.span`
  color: #d1d5db;
  font-style: italic;
`;

const StatusMessage = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

const ErrorMessage = styled(StatusMessage)`
  color: #dc2626;
`;

// Caps the table at $maxRows rows; taller content scrolls vertically with the header
// kept in view via sticky <Th>.
const TableWrap = styled.div`
  overflow-x: auto;
  ${({ $scroll, $maxRows }) =>
    $scroll &&
    `
    max-height: ${ROW_HEIGHT_PX * $maxRows + HEADER_HEIGHT_PX}px;
    overflow-y: auto;
  `}
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Td = styled.td`
  padding: 10px 14px;
  font-size: 0.85rem;
  color: #111;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
`;

// Action (Remove) column pinned to the left so it stays visible while the table
// scrolls horizontally.
const ActionTh = styled(Th)`
  left: 0;
  z-index: 2;
`;

const ActionTd = styled(Td)`
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 1;
`;

const AddRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const FieldInput = styled.input`
  flex: 1;
  min-width: 140px;
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #fff;
  color: #111;
  &:disabled { opacity: 0.5; }
`;

const SelectWrap = styled.div`
  flex: 1;
  min-width: 180px;
`;

/**
 * Formats an ISO date/time string into a concise UK-locale label.
 *
 * @param {string|null|undefined} isoString - The ISO timestamp to format.
 * @returns {string|null} The formatted date, the original string if unparseable, or null if empty.
 */
function formatDate(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/**
 * Maps a SQL data type to the most appropriate HTML input type for the add form.
 *
 * @param {string} dataType - The column's SQL data type (e.g. "integer", "boolean").
 * @returns {string} An HTML input type ("number", "datetime-local", "checkbox" or "text").
 */
function inputTypeFor(dataType) {
  const t = (dataType ?? "").toLowerCase();
  if (/(int|numeric|decimal|real|double|serial)/.test(t)) return "number";
  if (/(timestamp|date)/.test(t)) return "datetime-local";
  if (t === "boolean") return "checkbox";
  return "text";
}

/**
 * Formats an arbitrary table cell value for display, rendering nulls as a dash and
 * ISO timestamps via {@link formatDate}.
 *
 * @param {*} value - The raw cell value from the API.
 * @returns {string} A display-ready string.
 */
function formatCell(value) {
  if (value == null) return "—";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDate(value);
  }
  return String(value);
}

/**
 * A single audit summary card showing a table's last modified/created dates and users.
 *
 * @param {Object} props
 * @param {Object} props.entry - The audit result for one table.
 * @param {string} props.entry.displayName - Human-friendly table name.
 * @param {string} [props.entry.modifiedDate] - ISO timestamp of last modification.
 * @param {string} [props.entry.modifiedBy] - User who last modified the table.
 * @param {string} [props.entry.createdDate] - ISO timestamp of creation.
 * @param {string} [props.entry.createdBy] - User who created the table.
 * @returns {JSX.Element} The rendered audit card.
 */
function AuditCard({ entry }) {
  const hasData = !!(entry.modifiedDate || entry.createdDate);
  return (
    <Card $hasData={hasData}>
      <CardTitle>{entry.displayName}</CardTitle>
      <Row>
        <Label>Last modified</Label>
        <Value>{formatDate(entry.modifiedDate) ?? <NoData>—</NoData>}</Value>
      </Row>
      <Row>
        <Label>Modified by</Label>
        <Value>{entry.modifiedBy ?? <NoData>—</NoData>}</Value>
      </Row>
      <Row>
        <Label>Created</Label>
        <Value>{formatDate(entry.createdDate) ?? <NoData>—</NoData>}</Value>
      </Row>
      <Row>
        <Label>Created by</Label>
        <Value>{entry.createdBy ?? <NoData>—</NoData>}</Value>
      </Row>
    </Card>
  );
}

/**
 * Fetches and renders a grid of read-only audit cards for the configured tables.
 *
 * @param {Object} props
 * @param {Array<Object>} props.tables - Audit table configs (tableName, schema, displayName, auditColumns, filter).
 * @param {string} [props.title="Table Audit"] - Section heading.
 * @returns {JSX.Element} The audit section.
 */
function AuditSection({ tables, title = "Table Audit" }) {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tables?.length) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api.baseService
      .post("/api/admin/maintenance/table-audit", {
        tables: tables.map((t) => ({
          tableName: t.tableName,
          schema: t.schema ?? "public",
          displayName: t.displayName,
          auditColumns: t.auditColumns,
          filter: t.filter ?? null,
        })),
      })
      .then((data) => setAuditData(data ?? []))
      .catch(() => setError("Failed to load table audit data."))
      .finally(() => setLoading(false));
  }, [tables]);

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {loading && <StatusMessage>Loading…</StatusMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && (
        <Grid>
          {auditData.map((entry) => (
            <AuditCard key={entry.tableName} entry={entry} />
          ))}
        </Grid>
      )}
    </div>
  );
}

/**
 * Shared data hook for view/edit tables. Fetches the table's rows and column metadata
 * together and exposes a refetch for use after mutations.
 *
 * @param {Object} table - Table config (tableName, schema, filter).
 * @returns {{rows: Array<Object>, columns: Array<Object>, loading: boolean,
 *   error: (string|null), setError: Function, refetch: Function}} Table data and helpers.
 */
function useTableData(table) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * (Re)loads the table's rows and column metadata from the API.
   * @returns {void}
   */
  const fetchData = () => {
    setLoading(true);
    setError(null);
    const body = {
      tableName: table.tableName,
      schema: table.schema,
      filter: table.filter ?? null,
    };
    Promise.all([
      api.baseService.post("/api/admin/edit-table/rows", body),
      api.baseService.post("/api/admin/edit-table/columns", body),
    ])
      .then(([rowData, colData]) => {
        setRows(rowData ?? []);
        setColumns(colData ?? []);
      })
      .catch(() => setError("Failed to load table."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [table.tableName]);

  return { rows, columns, loading, error, setError, refetch: fetchData };
}

/**
 * Shared hook for lookup-driven columns (used by both view and edit tables). Fetches
 * the full value/label option list for every configured lookup and exposes a
 * value→label map per column for rendering friendly labels.
 *
 * @param {Object} table - Table config; reads `table.lookups`.
 * @returns {{lookups: Object, lookupOptions: Object, lookupLabels: Object}} The lookup
 *   config, the full option lists keyed by column, and value→label maps keyed by column.
 */
function useLookups(table) {
  const lookups = table.lookups ?? {};
  const [lookupOptions, setLookupOptions] = useState({});

  useEffect(() => {
    const entries = Object.entries(lookups);
    if (entries.length === 0) return;
    Promise.all(
      entries.map(([col, cfg]) =>
        api.baseService
          .post("/api/admin/edit-table/lookup", {
            source: {
              table: cfg.table,
              schema: cfg.schema,
              valueColumn: cfg.valueColumn,
              labelColumn: cfg.labelColumn,
              filter: cfg.filter ?? null,
            },
            exclude: null,
          })
          .then((opts) => [col, opts ?? []])
      )
    )
      .then((results) => setLookupOptions(Object.fromEntries(results)))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.tableName]);

  const lookupLabels = useMemo(() => {
    const maps = {};
    Object.keys(lookups).forEach((col) => {
      const map = {};
      (lookupOptions[col] ?? []).forEach((o) => { map[String(o.value)] = o.label; });
      maps[col] = map;
    });
    return maps;
  }, [lookups, lookupOptions]);

  return { lookups, lookupOptions, lookupLabels };
}

/**
 * Builds the ordered display fields for a table: the real columns, plus — for any
 * lookup configured with `addToTable` — an extra read-only column showing the lookup's
 * labelColumn, inserted immediately after its source column.
 *
 * @param {Array<Object>} columns - Column metadata.
 * @param {Object} lookups - Per-column lookup configs.
 * @param {Object} lookupLabels - Per-column value→label maps.
 * @returns {Array<{key: string, header: string, render: Function}>} The display fields.
 */
function buildDisplayFields(columns, lookups, lookupLabels) {
  const labelFor = (col, value) => lookupLabels[col]?.[String(value)] ?? "—";
  return columns.flatMap((c) => {
    const field = { key: c.name, header: c.name, render: (row) => formatCell(row[c.name]) };
    const lk = lookups[c.name];
    if (lk?.addToTable) {
      return [
        field,
        { key: `${c.name}__label`, header: lk.labelColumn, render: (row) => labelFor(c.name, row[c.name]) },
      ];
    }
    return [field];
  });
}

/**
 * A searchable lookup dropdown built on react-select, styled to match the app's
 * dropdowns via the shared {@link makeSelectStyles}.
 *
 * @param {Object} props
 * @param {Array<{value: *, label: string}>} props.options - Available options.
 * @param {*} props.value - The currently selected option value (compared by string).
 * @param {Function} props.onChange - Called with the selected value (or "" when cleared).
 * @param {string} props.placeholder - Placeholder shown when nothing is selected.
 * @param {boolean} [props.disabled] - Whether the control is disabled.
 * @returns {JSX.Element} The lookup dropdown.
 */
function LookupSelect({ options, value, onChange, placeholder, disabled }) {
  const theme = useTheme();
  const selectStyles = useMemo(
    () => makeSelectStyles(theme, { minHeight: 36, fontSize: "0.85rem", borderColor: "#d1d5db" }),
    [theme]
  );
  const selected = options.find((o) => String(o.value) === String(value)) ?? null;

  return (
    <SelectWrap>
      <Select
        styles={selectStyles}
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt ? opt.value : "")}
        isClearable
        isDisabled={disabled}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      />
    </SelectWrap>
  );
}

/**
 * Renders a read-only table: every column from the configured table, no editing.
 * Columns configured with a lookup + addToTable also get a friendly-label column.
 *
 * @param {Object} props
 * @param {Object} props.table - View table config (tableName, schema, displayName, filter, lookups).
 * @param {number} [props.table.maxRows] - Rows shown before scrolling (defaults to DEFAULT_MAX_ROWS).
 * @returns {JSX.Element} The view table section.
 */
function ViewTable({ table }) {
  const { rows, columns, loading, error } = useTableData(table);
  const { lookups, lookupLabels } = useLookups(table);
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels);
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
                      <Td key={f.key}>{f.render(row)}</Td>
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

/**
 * Renders an editable table with row deletion and a schema-driven add form. Editable
 * columns are derived from the metadata (auto-populated columns are hidden); columns
 * configured with a lookup render as dropdowns.
 *
 * @param {Object} props
 * @param {Object} props.table - Edit table config.
 * @param {string} props.table.tableName - The table name.
 * @param {string} props.table.schema - The schema name.
 * @param {string} props.table.displayName - Section heading.
 * @param {Object} [props.table.filter] - Row filter ({ column, value }).
 * @param {Object} [props.table.fixedValues] - Locked/pre-filled add-form values (e.g. app_id).
 * @param {Object} [props.table.lookups] - Per-column lookup configs keyed by column name.
 * @param {Object} [props.table.auditWrite] - Optional secondary insert on add/delete
 *   ({ table, schema, onAdd, onDelete }); each onAdd/onDelete is a column→value template
 *   where a value is a literal or { from: "<row column>" }.
 * @param {number} [props.table.maxRows] - Rows shown before scrolling (defaults to DEFAULT_MAX_ROWS).
 * @returns {JSX.Element} The edit table section.
 */
function EditTable({ table }) {
  const fixedValues = table.fixedValues ?? {};
  const auditWrite = table.auditWrite ?? null;
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
   * present in the table when the config requests it (equivalent to the old
   * server-side excludeRegistered, since rows are scoped by the same filter).
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
  // fixedValues (e.g. app_id) are still submitted — they are just not shown as inputs;
  // registration_id and registered_by (which have defaults) are hidden too.
  const addColumns = columns.filter(
    (c) => !c.isGenerated && !(c.name in fixedValues)
  );
  const primaryKeys = columns.filter((c) => c.isPrimaryKey).map((c) => c.name);
  const displayFields = buildDisplayFields(columns, lookups, lookupLabels);
  const maxRows = table.maxRows ?? DEFAULT_MAX_ROWS;

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
   * Coerces each add-form value to match its column's data type, since text/number
   * inputs always yield strings (so e.g. scenario_id is sent as an integer, not "145").
   * Empty values are dropped so the DB applies its own defaults.
   * @returns {Object} The typed values to insert.
   */
  const coerceValues = () => {
    const typeByName = Object.fromEntries(columns.map((c) => [c.name, c.dataType]));
    const out = {};
    Object.entries(fieldValues).forEach(([name, value]) => {
      if (value === "" || value == null) return;
      const type = inputTypeFor(typeByName[name]);
      if (typeof value === "string" && type === "number") {
        const n = Number(value);
        out[name] = Number.isNaN(n) ? value : n;
      } else if (typeof value === "string" && type === "checkbox") {
        out[name] = value === "true" || value === "on";
      } else {
        out[name] = value;
      }
    });
    return out;
  };

  /**
   * Resolves a configured audit-write value template against a source row. Each value
   * is either a literal (inserted as-is) or { from: "<column>" } which pulls the value
   * from the row being added/deleted.
   *
   * @param {Object} template - The value template (e.g. auditWrite.onAdd).
   * @param {Object} sourceRow - The row the mutation concerns.
   * @returns {Object} The resolved column→value map to insert.
   */
  const resolveAuditValues = (template, sourceRow) => {
    const out = {};
    Object.entries(template).forEach(([col, spec]) => {
      out[col] = spec && typeof spec === "object" && "from" in spec ? sourceRow[spec.from] : spec;
    });
    return out;
  };

  /**
   * Builds the optional secondary-insert payload for a mutation, or null when no
   * audit-write is configured for that action.
   *
   * @param {"onAdd"|"onDelete"} action - Which audit template to use.
   * @param {Object} sourceRow - The row the mutation concerns.
   * @returns {(Object|null)} The alsoInsert payload, or null.
   */
  const buildAlsoInsert = (action, sourceRow) => {
    if (!auditWrite?.[action]) return null;
    return {
      table: auditWrite.table,
      schema: auditWrite.schema,
      values: resolveAuditValues(auditWrite[action], sourceRow),
    };
  };

  /**
   * Inserts the current add-form values (plus an optional audit-log entry in the same
   * transaction), then refreshes the rows (which also updates the available dropdown
   * options, since they exclude values present in the table).
   * @returns {Promise<void>}
   */
  const handleAdd = async () => {
    const values = coerceValues();
    setMutating(true);
    try {
      await api.baseService.post("/api/admin/edit-table/add", {
        tableName: table.tableName,
        schema: table.schema,
        values,
        alsoInsert: buildAlsoInsert("onAdd", values),
      });
      resetForm();
      refetch();
    } catch {
      setError("Failed to add row.");
    } finally {
      setMutating(false);
    }
  };

  /**
   * Deletes a row by its primary key(s) (plus an optional audit-log entry in the same
   * transaction), then refreshes the rows (which also restores the deleted value to the
   * available dropdown options).
   *
   * @param {Object} row - The row to delete (keyed by column name).
   * @returns {Promise<void>}
   */
  const handleDelete = async (row) => {
    const keyValues = {};
    primaryKeys.forEach((k) => { keyValues[k] = row[k]; });
    setMutating(true);
    try {
      await api.baseService.post("/api/admin/edit-table/delete", {
        tableName: table.tableName,
        schema: table.schema,
        keyValues,
        alsoInsert: buildAlsoInsert("onDelete", row),
      });
      refetch();
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
          <TableWrap $scroll={rows.length > maxRows} $maxRows={maxRows}>
            <Table>
              <thead>
                <tr>
                  {primaryKeys.length > 0 && <ActionTh />}
                  {displayFields.map((f) => <Th key={f.key}>{f.header}</Th>)}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <Td colSpan={displayFields.length + 1} style={{ color: "#9ca3af", fontStyle: "italic" }}>
                      No rows
                    </Td>
                  </tr>
                ) : (
                  rows.map((row, i) => (
                    <tr key={i}>
                      {primaryKeys.length > 0 && (
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
                        <Td key={f.key}>{f.render(row)}</Td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </TableWrap>
          {addColumns.length > 0 && (
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
                    placeholder={c.name + (c.isNullable ? "" : " *")}
                    disabled={mutating}
                  />
                ) : (
                  <FieldInput
                    key={c.name}
                    type={inputTypeFor(c.dataType)}
                    placeholder={c.name + (c.isNullable ? "" : " *")}
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

/**
 * Renders one layout cell. `type` selects the section; `table` (optional) narrows it
 * to a single configured table, otherwise every table in that section renders.
 *
 * @param {Object} props
 * @param {Object} props.cell - The cell config ({ type, table? }).
 * @param {Array<Object>} props.auditTables - All configured audit tables.
 * @param {Array<Object>} props.editTables - All configured edit tables.
 * @param {Array<Object>} props.viewTables - All configured view tables.
 * @returns {JSX.Element|Array<JSX.Element>|null} The rendered section(s) for the cell.
 */
function LayoutCell({ cell, auditTables, editTables, viewTables }) {
  /**
   * Narrows a section's table list to the cell's configured table, if any.
   * @param {Array<Object>} list - The section's full table list.
   * @returns {Array<Object>} The (possibly filtered) list.
   */
  const pick = (list) =>
    cell.table ? list.filter((t) => t.tableName === cell.table) : list;

  switch (cell.type) {
    case "audit":
      return <AuditSection tables={pick(auditTables)} title={cell.title} />;
    case "edit":
      return pick(editTables).map((t) => <EditTable key={t.tableName} table={t} />);
    case "view":
      return pick(viewTables).map((t) => <ViewTable key={t.tableName} table={t} />);
    default:
      return null;
  }
}

/**
 * Builds the fallback layout used when the config supplies none: audit cards on the
 * left; edit tables then view tables stacked on the right.
 *
 * @returns {Array<Array<Object>>} A column-based layout definition.
 */
function defaultLayout() {
  return [
    [{ type: "audit" }],
    [{ type: "edit" }, { type: "view" }],
  ];
}

/**
 * Normalises a layout column, which may be a plain array of cells or a
 * { width, cells } object, into the latter form.
 *
 * @param {(Array<Object>|{width?: number, cells: Array<Object>})} column - The column config.
 * @returns {{width: (number|undefined), cells: Array<Object>}} The normalised column.
 */
function normaliseColumn(column) {
  return Array.isArray(column) ? { width: undefined, cells: column } : column;
}

/**
 * The admin page. Reads its configuration from the app context's `adminPage` and
 * renders a fully config-driven grid of audit, edit and view sections.
 *
 * @returns {JSX.Element} The admin page.
 */
export const AdminPage = () => {
  const appContext = useContext(AppContext);
  const adminPage = appContext?.adminPage ?? {};

  const auditTables = adminPage.auditTables ?? [];
  const editTables = adminPage.editTables ?? [];
  const viewTables = adminPage.viewTables ?? [];
  const layout = adminPage.layout ?? defaultLayout();

  return (
    <Page>
      <LayoutContainer>
        {layout.map(normaliseColumn).map((column, colIdx) => (
          <Column key={colIdx} $flex={column.width}>
            {column.cells.map((cell, cellIdx) => (
              <CellStack key={cellIdx}>
                <LayoutCell
                  cell={cell}
                  auditTables={auditTables}
                  editTables={editTables}
                  viewTables={viewTables}
                />
              </CellStack>
            ))}
          </Column>
        ))}
      </LayoutContainer>
    </Page>
  );
};
