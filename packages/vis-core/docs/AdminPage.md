# Admin Page

The Admin Page is a fully config-driven administration screen for NoRMS-workstream apps.
It renders three kinds of section — **audit cards**, **editable tables**, and **read-only
tables** — arranged in a configurable grid. Everything on the page is described in the app
configuration; the component contains no table-, column-, or app-specific logic.

- **Component:** `vis-core/packages/vis-core/src/Components/AdminPage/AdminPage.jsx`
- **API:** `TFN_Web_API` — `EditTableController` (`/api/admin/edit-table/*`) and
  `MaintenanceController` (`/api/admin/maintenance/table-audit`)
- **Config (per app):** the `AdminPage` page produced by
  `src/configs/_templates/norms-workstream/pages/AdminPage.js`

---

## Contents

1. [Availability and access](#availability-and-access)
2. [How the config is loaded](#how-the-config-is-loaded)
3. [Page configuration](#page-configuration)
   - [auditTables](#audittables)
   - [editTables](#edittables)
   - [viewTables](#viewtables)
   - [layout](#layout)
4. [Lookups (dropdowns and friendly labels)](#lookups-dropdowns-and-friendly-labels)
5. [Audit writes on add/delete](#audit-writes-on-adddelete)
6. [Row limits and scrolling](#row-limits-and-scrolling)
7. [The API](#the-api)
8. [Security model](#security-model)
9. [Adding a new table — checklist](#adding-a-new-table--checklist)

---

## Availability and access

The Admin Page is intended for the `nortms-dev-partner`, `rmap` and `tfn-internal` apps and
is **not** present in `norms`. It is added to an app by including `PageId.ADMIN_PAGE` in the
app's `enabledPages`; the template factory `createAdminPage` then produces the page.

Access is gated two ways:

- **Route/navigation** — `BaseApp` promotes the page's `config` to `appConfig.adminPage` and
  wraps the route in `withRoleValidation(AdminPage, { adminOnly: true })`. The navbar link
  only appears for users with an `*_admin` role.
- **API** — both controllers are decorated with `[Authorize(Policy = "AdminPolicy")]`, which
  requires one of the admin roles (e.g. `All_Admin`, `NoRMS_Admin`).

---

## How the config is loaded

`BaseApp` extracts the `AdminPage` entry from `appPages`, removes it from the normal page list,
and stores its `config` at `appConfig.adminPage`. The `AdminPage` component reads that object
from `AppContext`:

```js
const adminPage   = appContext?.adminPage ?? {};
const auditTables = adminPage.auditTables ?? [];
const editTables  = adminPage.editTables ?? [];
const viewTables  = adminPage.viewTables ?? [];
const layout      = adminPage.layout ?? defaultLayout();
```

> **Note:** the Vite dev server caches configs via `import.meta.glob` at start-up. After
> changing a config file you must restart the dev server for the change to take effect.

---

## Page configuration

The page `config` has four keys, all optional: `auditTables`, `editTables`, `viewTables` and
`layout`.

### auditTables

Read-only summary cards showing the most recent modified/created dates and users for a table.

```js
{
    tableName: "input_norms_scenario",
    schema: "rail_data",
    displayName: "Input: NoRMS Scenario",
    auditColumns: {
        modifiedDate: "modified_date",
        modifiedBy:   "modified_by",
        createdDate:  "created_date",
        createdBy:    "created_by",
    },
    filter: { column: "app_id", value: 2 }, // optional — restrict to matching rows
}
```

| Field          | Required | Description                                                       |
| -------------- | -------- | ----------------------------------------------------------------- |
| `tableName`    | yes      | Table to audit; must be whitelisted server-side.                  |
| `schema`       | no       | Schema name (defaults to `public`).                               |
| `displayName`  | yes      | Card heading.                                                     |
| `auditColumns` | yes      | Maps the four audit fields to the real column names.              |
| `filter`       | no       | `{ column, value }` to scope the audit to matching rows.          |

A table whose `auditColumns` is omitted is skipped server-side.

### editTables

A table with row deletion and a schema-driven add form. The editable columns are derived from
the database metadata — any column the database auto-populates (identity columns or columns
with a default, such as `registration_id` and `registered_by`) is hidden from the add form
automatically.

```js
{
    tableName: "scenario_app_registrations",
    schema: "rail_data",
    displayName: "Scenario App Registrations",
    filter: { column: "app_id", value: _appContext.appId },
    fixedValues: { app_id: _appContext.appId },
    lookups: { /* see Lookups */ },
    auditWrite: { /* see Audit writes */ },
    maxRows: 8,
}
```

| Field         | Required | Description                                                                              |
| ------------- | -------- | ---------------------------------------------------------------------------------------- |
| `tableName`   | yes      | Table to edit; must be in the server's edit whitelist.                                   |
| `schema`      | no       | Schema name (defaults to `public`).                                                      |
| `displayName` | yes      | Section heading.                                                                         |
| `filter`      | no       | `{ column, value }` restricting which rows are shown (and used by `excludeRegistered`).  |
| `fixedValues` | no       | Values submitted on add but **not** shown as inputs (e.g. `app_id`). Pre-seed the form.  |
| `lookups`     | no       | Per-column dropdown/label configuration. See [Lookups](#lookups-dropdowns-and-friendly-labels). |
| `auditWrite`  | no       | Secondary insert on add/delete. See [Audit writes](#audit-writes-on-adddelete).          |
| `maxRows`     | no       | Rows shown before the table scrolls (defaults to `8`).                                   |

**Add-form value typing.** Inputs always yield strings, so before submitting, each value is
coerced to its column's type (numbers become numbers, booleans become booleans). The server
additionally casts values into user-defined types (e.g. Postgres enums) on insert.

### viewTables

A read-only table showing every column of the configured table. View tables support the same
`lookups`/`addToTable` mechanism as edit tables (useful for showing a friendly label column),
and the same `maxRows`.

```js
{
    tableName: "pipeline_audit_log",
    schema: "rail_data",
    displayName: "Pipeline Audit Log",
    lookups: { /* see Lookups */ },
    maxRows: 8,
}
```

### layout

Optional grid describing how the sections are arranged. Each top-level entry is a **column**
(left to right); each column is an ordered list of **cells** stacked top to bottom.

```js
layout: [
    // Left column (48% of the row width)
    {
        width: 48,
        cells: [
            { type: "view", table: "pipeline_apps" },
            { type: "audit" },
        ],
    },
    // Right column (52%)
    {
        width: 52,
        cells: [
            { type: "edit", table: "scenario_app_registrations" },
            { type: "view", table: "pipeline_audit_log" },
        ],
    },
]
```

**Cell:**

| Field   | Required | Description                                                                          |
| ------- | -------- | ------------------------------------------------------------------------------------ |
| `type`  | yes      | `"audit"`, `"edit"` or `"view"`.                                                      |
| `table` | no       | Limit the cell to one configured table by `tableName`; omit to render every table in that section. |

**Column width** is optional. Use `{ width: <number>, cells: [...] }` instead of a bare array
to set the column's share of the row. Widths are **relative ratios**, so `{ width: 40 }` next
to `{ width: 60 }` gives a 40/60 split, and `{ width: 1 }` next to `{ width: 2 }` gives one
third / two thirds. A bare array defaults to `width: 1`.

Removing `layout` entirely falls back to the default: audit cards on the left; edit tables then
view tables stacked on the right.

---

## Lookups (dropdowns and friendly labels)

A `lookups` map (keyed by column name) turns a column into a dropdown sourced from a metadata
table, and can optionally display a friendly label column in the rendered rows.

```js
lookups: {
    scenario_id: {
        table: "input_norms_scenario",
        schema: "rail_data",
        valueColumn: "id",            // value stored in scenario_id
        labelColumn: "scenario_code", // shown in the dropdown / label column
        filter: { column: "is_deleted", value: false }, // optional source filter
        excludeRegistered: true,      // hide values already present in this table
        addToTable: true,             // add a read-only label column next to the source column
    },
}
```

| Field               | Required | Description                                                                                       |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `table`             | yes      | Metadata table providing the options; must be in the server's lookup whitelist.                   |
| `schema`            | no       | Schema name (defaults to `public`).                                                               |
| `valueColumn`       | yes      | Column whose value is stored/submitted.                                                           |
| `labelColumn`       | yes      | Column shown to the user (in the dropdown and, with `addToTable`, in the table).                  |
| `filter`            | no       | `{ column, value }` restricting which options are offered.                                        |
| `excludeRegistered` | no       | When `true`, omit options whose value is already present in this table (edit tables only).        |
| `addToTable`        | no       | When `true`, insert a read-only column showing `labelColumn` immediately after the source column. |

**Behaviour notes:**

- The full option list (without exclusion) is fetched once and used both to render labels for
  existing rows and to build the dropdown.
- `excludeRegistered` is applied client-side against the currently displayed rows, which are
  scoped by the table's `filter`. Adding or removing a row therefore updates the available
  options automatically.
- For label display in **view** tables, omit the source `filter` if you want labels to resolve
  even for values that are filtered out of the dropdown (e.g. soft-deleted scenarios). A value
  with no matching label renders as `—`.

---

## Audit writes on add/delete

An edit table can write a second row (typically an audit-log entry) **in the same database
transaction** as an add or delete. If the secondary insert fails, the whole operation is rolled
back, so the two tables cannot drift apart.

```js
auditWrite: {
    table: "pipeline_audit_log",
    schema: "rail_data",
    onAdd: {
        action_type: "REGISTERED",          // literal value
        scenario_id:   { from: "scenario_id" }, // taken from the added row
        target_app_id: { from: "app_id" },
    },
    onDelete: {
        action_type: "DEREGISTERED",
        scenario_id:   { from: "scenario_id" }, // taken from the deleted row
        target_app_id: { from: "app_id" },
    },
}
```

| Field      | Required | Description                                                                  |
| ---------- | -------- | ---------------------------------------------------------------------------- |
| `table`    | yes      | Target table for the secondary insert; must be in the server's audit-write whitelist. |
| `schema`   | no       | Schema name (defaults to `public`).                                          |
| `onAdd`    | no       | Column→value template applied when a row is added.                           |
| `onDelete` | no       | Column→value template applied when a row is deleted.                         |

Both `auditWrite` itself and each of `onAdd`/`onDelete` are **optional** — most edit tables
will omit `auditWrite` entirely, and you may define just one direction if you only want to
audit adds or only deletes.

**Value templates.** Each entry is either:

- a **literal** (string/number/boolean) inserted as-is — e.g. the `action_type` enum value; or
- `{ from: "<column>" }`, which pulls the value from the row the mutation concerns. On **add**
  this is the set of inserted values; on **delete** it is the row being removed.

Literal values destined for a Postgres enum column work because the server casts each value to
the target column's user-defined type on insert.

---

## Row limits and scrolling

Both edit and view tables show at most `maxRows` rows (default `8`) before the body scrolls
vertically. The column header stays pinned while scrolling, and the Remove column on edit
tables is pinned to the left so it remains visible during horizontal scrolling. Set `maxRows`
per table to override the default.

---

## The API

All endpoints are under `/api/admin` and require `AdminPolicy`.

| Method & path                              | Purpose                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `POST /api/admin/maintenance/table-audit`  | Returns the latest audit row (modified/created date and user) per table.|
| `POST /api/admin/edit-table/rows`          | Returns the rows of a table, optionally filtered.                       |
| `POST /api/admin/edit-table/columns`       | Returns column metadata (type, nullability, generated, primary key).    |
| `POST /api/admin/edit-table/lookup`        | Returns value/label options from a metadata table, with optional exclusion. |
| `POST /api/admin/edit-table/add`           | Inserts a row, with an optional secondary insert in the same transaction. |
| `POST /api/admin/edit-table/delete`        | Deletes a row by key(s), with an optional secondary insert in the same transaction. |

The `add` and `delete` requests accept an optional `alsoInsert` object
(`{ table, schema, values }`) which the front end builds from the `auditWrite` config.

Column and table names in these requests are interpolated into SQL, so every table is checked
against a server-side whitelist. Values are always parameterised.

---

## Security model

The `EditTableFacade` maintains four whitelists, and every request is validated against the
relevant one before any SQL runs:

| Whitelist                      | Used by                                   | Example members                   |
| ------------------------------ | ----------------------------------------- | --------------------------------- |
| `AllowedEditTables`            | reads **and** writes (rows/columns/add/delete) | `scenario_app_registrations`  |
| `AllowedViewTables`            | reads only (rows/columns)                 | `pipeline_audit_log`, `pipeline_apps` |
| `AllowedLookupTables`          | lookup option sources                     | `input_norms_scenario`, `pipeline_apps` |
| `AllowedSecondaryInsertTables` | `alsoInsert` targets                      | `pipeline_audit_log`              |

Schemas are also whitelisted (`public`, `rail_data`). A view table can never be written to,
because the add/delete paths validate against `AllowedEditTables` only.

---

## Adding a new table — checklist

1. **Server whitelist** — add the table name to the appropriate set in `EditTableFacade`
   (`AllowedEditTables` for editing, `AllowedViewTables` for read-only, `AllowedLookupTables`
   for lookup sources, `AllowedSecondaryInsertTables` for audit-write targets). For audit cards,
   add it to `_allowedTableNames` in `TableAuditFacade`. Confirm its schema is in
   `AllowedSchemas`.
2. **Page config** — add an entry to `auditTables`, `editTables` or `viewTables`, and place it
   in the `layout`.
3. **Optional extras** — add `lookups` (dropdowns/labels), `fixedValues` (locked add values),
   `auditWrite` (secondary insert) and/or `maxRows` as needed.
4. **Restart** — rebuild/restart the API (whitelist change) and restart the Vite dev server
   (config change).
