// Pure (non-React) helpers, constants and endpoint configuration for the AdminPage.
// Nothing here is table-, column- or app-specific: every domain detail comes from the
// page config. The React components live in Components/AdminPage and the data hooks in
// hooks/useAdminTables.

// Tables show at most this many rows before scrolling unless a table sets its own
// `maxRows`; the px values approximate the rendered row/header heights used to cap the
// scroll container.
export const DEFAULT_MAX_ROWS = 8;
export const ROW_HEIGHT_PX = 40;
export const HEADER_HEIGHT_PX = 38;

/**
 * Default API endpoints used by the AdminPage. Every endpoint can be overridden per app
 * via the `endpoints` key of the admin page config, so the component hardcodes no paths.
 *
 * @type {{tableAudit: string, rows: string, columns: string, lookup: string, add: string, remove: string, sendScenarios: string, sendTargets: string, scenarioCoverage: string}}
 */
export const DEFAULT_ADMIN_ENDPOINTS = {
  tableAudit: "/api/admin/maintenance/table-audit",
  rows: "/api/admin/edit-table/rows",
  columns: "/api/admin/edit-table/columns",
  lookup: "/api/admin/edit-table/lookup",
  add: "/api/admin/edit-table/add",
  remove: "/api/admin/edit-table/delete",
  sendScenarios: "/api/admin/edit-table/send-scenarios",
  sendTargets: "/api/admin/edit-table/send-targets",
  scenarioCoverage: "/api/admin/edit-table/scenario-coverage",
};

/**
 * Merges a (possibly partial) endpoints override from the config over the defaults, so
 * an app can remap any subset of endpoints without redefining them all.
 *
 * @param {Object} [endpoints] - Partial endpoint overrides from the admin page config.
 * @returns {typeof DEFAULT_ADMIN_ENDPOINTS} The resolved endpoint map.
 */
export function resolveAdminEndpoints(endpoints) {
  return { ...DEFAULT_ADMIN_ENDPOINTS, ...(endpoints ?? {}) };
}

/**
 * Formats an ISO date/time string into a concise UK-locale label.
 *
 * @param {string|null|undefined} isoString - The ISO timestamp to format.
 * @returns {string|null} The formatted date, the original string if unparseable, or null if empty.
 */
export function formatDate(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/**
 * Whole days elapsed since the given timestamp (negative for future dates).
 *
 * @param {string|null|undefined} isoString - The ISO timestamp.
 * @returns {number|null} Days since, or null if empty/unparseable.
 */
export function daysSince(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * A concise "time ago" label for a timestamp (e.g. "3 days ago").
 *
 * @param {string|null|undefined} isoString - The ISO timestamp.
 * @returns {string|null} The relative label, or null if empty/unparseable.
 */
export function relativeTimeFromNow(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return null;
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 45) return plural(min, "minute");
  const hr = Math.round(min / 60);
  if (hr < 24) return plural(hr, "hour");
  const day = Math.round(hr / 24);
  if (day < 30) return plural(day, "day");
  const month = Math.round(day / 30);
  if (month < 12) return plural(month, "month");
  return plural(Math.round(day / 365), "year");
}

/**
 * Whether a timestamp is older than `staleAfterDays` (used to flag stale audit data).
 *
 * @param {string|null|undefined} isoString - The ISO timestamp.
 * @param {number|null|undefined} staleAfterDays - Age threshold in days; falsy disables.
 * @returns {boolean} True when the timestamp is older than the threshold.
 */
export function isStale(isoString, staleAfterDays) {
  if (!staleAfterDays) return false;
  const days = daysSince(isoString);
  return days != null && days > staleAfterDays;
}

/**
 * Maps a SQL data type to the most appropriate HTML input type for the add form.
 *
 * @param {string} dataType - The column's SQL data type (e.g. "integer", "boolean").
 * @returns {string} An HTML input type ("number", "datetime-local", "checkbox" or "text").
 */
export function inputTypeFor(dataType) {
  const t = (dataType ?? "").toLowerCase();
  if (/(int|numeric|decimal|real|double|serial)/.test(t)) return "number";
  if (/(timestamp|date)/.test(t)) return "datetime-local";
  if (t === "boolean") return "checkbox";
  return "text";
}

/**
 * Formats an arbitrary table cell value for display, returning `null` for empty values
 * (so the UI can render a friendly "Empty" placeholder) and formatting ISO timestamps via
 * {@link formatDate}.
 *
 * @param {*} value - The raw cell value from the API.
 * @returns {string|null} A display-ready string, or null when the value is empty.
 */
export function formatCell(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return formatDate(value);
  }
  return String(value);
}

// Short tokens that read better fully capitalised than title-cased when they appear as a
// whole word in a column name (e.g. "scenario_id" → "Scenario ID", not "Scenario Id").
const HEADER_ACRONYMS = new Set(["id", "url", "api", "db", "ip", "uid", "sql", "csv"]);

/**
 * Turns a raw column name into a friendly, human-readable header: underscores/hyphens
 * become spaces and each word is title-cased (with common acronyms fully capitalised).
 *
 * @param {string} name - The raw column name (e.g. "modified_by").
 * @returns {string} The humanised header (e.g. "Modified By").
 */
export function humaniseHeader(name) {
  if (name == null) return "";
  return String(name)
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      HEADER_ACRONYMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/**
 * Derives the header for a lookup-labelled column. Defaults to the humanised source
 * column name with a trailing "_id" dropped (so "scenario_id" → "Scenario"), since the
 * column shows the friendly label rather than the raw id. Overridable via the lookup's
 * `headerLabel`.
 *
 * @param {string} columnName - The source column name.
 * @param {Object} lookup - The lookup config for that column.
 * @returns {string} The header to display.
 */
function lookupHeader(columnName, lookup) {
  if (lookup.headerLabel) return lookup.headerLabel;
  return humaniseHeader(columnName.replace(/_id$/i, ""));
}

/**
 * Builds the ordered display fields for a table. Column headers are humanised
 * (underscores → spaces, title-cased). For any column configured with a lookup +
 * `addToTable`, the friendly label is shown *in place of* the raw id/value column, since
 * the id is redundant once a label is available; set the lookup's `showValueColumn: true`
 * to keep the raw value column alongside the label. Columns listed in `hiddenColumns` are
 * omitted entirely (e.g. application-identifier columns that are fixed to the current app).
 *
 * Each field's `render` returns a display string, or `null` when the cell is empty so the
 * UI can show a friendly "Empty" placeholder.
 *
 * @param {Array<Object>} columns - Column metadata.
 * @param {Object} lookups - Per-column lookup configs.
 * @param {Object} lookupLabels - Per-column value→label maps.
 * @param {Array<string>} [hiddenColumns=[]] - Column names to omit from the table.
 * @returns {Array<{key: string, header: string, render: Function}>} The display fields.
 */
export function buildDisplayFields(columns, lookups, lookupLabels, hiddenColumns = []) {
  const hidden = new Set(hiddenColumns);
  const labelFor = (col, value) => lookupLabels[col]?.[String(value)] ?? null;
  return columns
    .filter((c) => !hidden.has(c.name))
    .flatMap((c) => {
      const rawField = {
        key: c.name,
        header: humaniseHeader(c.name),
        render: (row) => formatCell(row[c.name]),
      };
      const lk = lookups[c.name];
      if (lk?.addToTable) {
        const labelField = {
          key: `${c.name}__label`,
          header: lookupHeader(c.name, lk),
          render: (row) => labelFor(c.name, row[c.name]),
        };
        // The raw id/value column is hidden in favour of the friendly label unless the
        // config explicitly asks to keep it.
        return lk.showValueColumn ? [rawField, labelField] : [labelField];
      }
      return [rawField];
    });
}

/**
 * Coerces each add-form value to match its column's data type, since text/number inputs
 * always yield strings (so e.g. an integer column is sent as a number, not "145"). Empty
 * values are dropped so the DB applies its own defaults.
 *
 * @param {Array<Object>} columns - Column metadata (provides each column's dataType).
 * @param {Object} fieldValues - The raw add-form values keyed by column name.
 * @returns {Object} The typed values to insert.
 */
export function coerceValues(columns, fieldValues) {
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
}

/**
 * Resolves a configured audit-write value template against a source row. Each value is
 * either a literal (inserted as-is) or { from: "<column>" } which pulls the value from
 * the row being added/deleted.
 *
 * @param {Object} template - The value template (e.g. auditWrite.onAdd).
 * @param {Object} sourceRow - The row the mutation concerns.
 * @returns {Object} The resolved column→value map to insert.
 */
export function resolveAuditValues(template, sourceRow) {
  const out = {};
  Object.entries(template).forEach(([col, spec]) => {
    out[col] = spec && typeof spec === "object" && "from" in spec ? sourceRow[spec.from] : spec;
  });
  return out;
}

/**
 * Builds the optional secondary-insert payload for a mutation, or null when no
 * audit-write is configured for that action.
 *
 * @param {Object|null} auditWrite - The table's auditWrite config ({ table, schema, onAdd, onDelete }).
 * @param {"onAdd"|"onDelete"} action - Which audit template to use.
 * @param {Object} sourceRow - The row the mutation concerns.
 * @returns {(Object|null)} The alsoInsert payload, or null.
 */
export function buildAlsoInsert(auditWrite, action, sourceRow) {
  if (!auditWrite?.[action]) return null;
  return {
    table: auditWrite.table,
    schema: auditWrite.schema,
    values: resolveAuditValues(auditWrite[action], sourceRow),
  };
}

/**
 * Builds the fallback layout used when the config supplies none: audit cards on the
 * left; edit tables then view tables stacked on the right.
 *
 * @returns {Array<Array<Object>>} A column-based layout definition.
 */
export function defaultLayout() {
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
export function normaliseColumn(column) {
  return Array.isArray(column) ? { width: undefined, cells: column } : column;
}
