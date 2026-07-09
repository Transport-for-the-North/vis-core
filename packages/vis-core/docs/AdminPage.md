# Admin Page

The Admin Page is a fully config-driven administration screen for any application.
It renders three kinds of section — **audit cards**, **editable tables**, and **read-only
tables** — arranged in a configurable grid. Everything on the page is described in the app
configuration; the component contains no table-, column-, or app-specific logic.

- **Components:** `src/Components/AdminPage/` — a thin `AdminPage.jsx` shell plus one file
  per section (`AuditSection`, `ViewTable`, `EditTable`, `LookupSelect`, `LayoutCell`) and
  `styles.js`. Pure helpers live in `src/utils/adminPage.js`; the data hooks + admin-API
  context in `src/hooks/useAdminTables.js`.
- **Backend abstraction:** the page never calls the API directly — all backend
  interaction goes through the admin API service (`src/services/api/AdminApi.js`,
  `createAdminApi`), the single place that knows the endpoint paths and request shapes.
- **API:** the endpoints are **configurable** (see [endpoints](#endpoints)); the defaults
  target `TFN_Web_API` — `EditTableController` (`/api/admin/edit-table/*`) and
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
   - [sendScenarios](#sendscenarios)
   - [layout](#layout)
   - [endpoints](#endpoints)
4. [Lookups (dropdowns and friendly labels)](#lookups-dropdowns-and-friendly-labels)
5. [Audit writes on add/delete](#audit-writes-on-adddelete)
6. [Row limits and scrolling](#row-limits-and-scrolling)
7. [The API](#the-api)
8. [Security model](#security-model)
9. [Adding a new table — checklist](#adding-a-new-table--checklist)

---

## Availability and access

Access is **scoped to the specific app**. Two role families grant access, and another app's
roles never do (e.g. `rmap_admin` cannot reach a NoRMS app):

| Role family    | Roles                                        | Rights                    |
| -------------- | -------------------------------------------- | ------------------------- |
| **Admin**      | `<appName>_admin`, `all_admin`               | View **and** edit         |
| **Superuser**  | `<appName>_superuser`, `all_superuser`       | View only (no add/delete) |

Gated in two places:

- **Route/navigation** — `BaseApp` wraps the route in
  `withRoleValidation(AdminPage, { adminOnly: true })`, which admits any of the four roles
  above. The navbar Admin link and any `adminOnly` pages are shown on the same condition.
- **API** — read endpoints require an admin **or** superuser of the app; write endpoints
  (add/delete) require an **admin** only. The controllers verify this per request against the
  `app` named in the body (see [The API](#the-api) and [Security model](#security-model)); the
  frontend sends `app` automatically. Superusers also see the page with the Add form and
  Remove buttons hidden.

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

The page `config` keys are all optional: `auditTables`, `editTables`, `viewTables`,
`sendScenarios`, `layout`, `endpoints` and `warning`.

### auditTables

Read-only summary cards for a table. Each card shows, all scoped by the optional `filter`:

- **Last modified / Created** — the latest-modified row's dates and users, each with a
  relative "· 3 days ago" suffix.
- **Records** — total row count.
- **Uploads** — number of distinct load events (`COUNT(DISTINCT created_date)`).
- **Modifications** — records changed since upload (`modified_date IS DISTINCT FROM
  created_date`), plus an expandable **"Changes by user"** breakdown (click to reveal every
  user's modification count).
- A **stale** amber highlight (and "Stale" badge) when the data hasn't been modified within
  `staleAfterDays` days.

The counts and breakdown are **pre-computed** in the `rail_data.audit_table_overview`
materialised view (see
`Database-Tools/data_uploads/norms/audit_view/create_norms_audit_view.sql`) and read from
there per request, rather than by scanning each (often large, partitioned) table live. The
figures therefore reflect the last time that view was refreshed
(`REFRESH MATERIALIZED VIEW CONCURRENTLY rail_data.audit_table_overview;` after each data
load), not the instantaneous table state. Tables without `created_/modified_` audit columns
show a **Records** count only. The set of audited tables must stay in step with the tables
that view is built over (both are server-side whitelisted).

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
    staleAfterDays: 30,                      // optional — amber highlight past this age
}
```

| Field            | Required | Description                                                       |
| ---------------- | -------- | ----------------------------------------------------------------- |
| `tableName`      | yes      | Table to audit; must be whitelisted server-side and present in the overview view. |
| `schema`         | no       | Schema name (defaults to `public`).                               |
| `displayName`    | yes      | Card heading.                                                     |
| `auditColumns`   | no       | Legacy hint of the audit column names. No longer used server-side (the summary is read from the pre-computed view); omit for tables without audit columns. |
| `staleAfterDays` | no       | Age (days) past which the card is highlighted amber as stale.     |

> **Note:** because the summary is read from the pre-computed overview, a per-table `filter`
> no longer scopes the audit counts (the overview is aggregated over the whole table). A table
> requested but not yet present in the view (e.g. added to config before the view is rebuilt)
> renders an empty card rather than erroring.

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
| `hiddenColumns` | no     | Column names to omit from the table (e.g. an app-identifier column fixed to the current app). |
| `lookups`     | no       | Per-column dropdown/label configuration. See [Lookups](#lookups-dropdowns-and-friendly-labels). |
| `auditWrite`  | no       | Secondary insert on add/delete. See [Audit writes](#audit-writes-on-adddelete).          |
| `refreshTables` | no     | Names of other sections' tables to reload after an add/delete here (e.g. `["pipeline_audit_log"]` so the audit log refreshes once `auditWrite` appends an entry). |
| `maxRows`     | no       | Rows shown before the table scrolls (defaults to `8`).                                   |

**Add-form value typing.** Inputs always yield strings, so before submitting, each value is
coerced to its column's type (numbers become numbers, booleans become booleans). The server
additionally casts values into user-defined types (e.g. Postgres enums) on insert.

### viewTables

A read-only table showing every column of the configured table. View tables support the same
`lookups`/`addToTable` mechanism as edit tables (useful for showing a friendly label column),
plus the same `maxRows` and `hiddenColumns`.

```js
{
    tableName: "pipeline_audit_log",
    schema: "rail_data",
    displayName: "Pipeline Audit Log",
    lookups: { /* see Lookups */ },
    maxRows: 8,
}
```

### sendScenarios

A tool (rendered by a `{ type: "send" }` layout cell) for registering **several** scenarios to
a **chosen destination app** in one action. Unlike `editTables` — whose registrations editor is
fixed to the current app — the destination is picked here, so an admin can push scenarios to
another app. Each registration created also appends a `REGISTERED` entry to the pipeline audit
log server-side; scenarios already registered to the target app are skipped. The tool is shown
only to users who can edit (app admins), and posts to the `sendScenarios` endpoint.

> **Authorisation:** the request is authorised as an admin of the app being administered, but
> the scenarios may be sent to *any* destination app — an app admin can register scenarios into
> another app's registrations.

```js
sendScenarios: {
    title: "Send Scenarios to App",
    // Scenarios offered in the multi-select (a lookup source, as in Lookups below).
    scenarioSource: {
        table: "input_norms_scenario",
        schema: "rail_data",
        valueColumn: "id",
        labelColumn: "scenario_code",
        filter: { column: "is_deleted", value: false },
        descriptionColumns: ["vis_description", "network_desc"],
        placeholder: "Select scenarios to send",
    },
    // Destination apps offered in the single-select.
    appSource: {
        table: "pipeline_apps",
        schema: "rail_data",
        valueColumn: "app_id",
        labelColumn: "app_name",
        placeholder: "Select destination app",
    },
    // Sections to reload after a successful send.
    refreshTables: ["pipeline_audit_log", "scenario_app_registrations"],
}
```

| Field            | Required | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `title`          | no       | Section heading (defaults to "Send Scenarios to App").                      |
| `scenarioSource` | yes      | Lookup source for the scenario multi-select (see [Lookups](#lookups-dropdowns-and-friendly-labels)). |
| `appSource`      | yes      | Lookup source for the destination-app single-select.                        |
| `refreshTables`  | no       | Names of other sections' tables to reload after a successful send.          |

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
| `type`  | yes      | `"audit"`, `"edit"`, `"view"` or `"send"` (the [Send scenarios](#sendscenarios) tool). |
| `table` | no       | Limit the cell to one configured table by `tableName`; omit to render every table in that section. (Ignored for `"send"`.) |

**Column width** is optional. Use `{ width: <number>, cells: [...] }` instead of a bare array
to set the column's share of the row. Widths are **relative ratios**, so `{ width: 40 }` next
to `{ width: 60 }` gives a 40/60 split, and `{ width: 1 }` next to `{ width: 2 }` gives one
third / two thirds. A bare array defaults to `width: 1`.

Removing `layout` entirely falls back to the default: audit cards on the left; edit tables then
view tables stacked on the right.

### endpoints

The page hardcodes no API paths. Each request the page makes resolves its path from an
`endpoints` map, which **defaults** to the `TFN_Web_API` admin routes. Supply `endpoints`
in the config to point any subset of these at a different backend; the keys you omit keep
their defaults.

```js
endpoints: {
    tableAudit: "/api/admin/maintenance/table-audit", // audit cards
    rows:       "/api/admin/edit-table/rows",         // table rows
    columns:    "/api/admin/edit-table/columns",      // column metadata
    lookup:     "/api/admin/edit-table/lookup",       // lookup option lists
    add:        "/api/admin/edit-table/add",          // insert (with optional alsoInsert)
    remove:     "/api/admin/edit-table/delete",       // delete (with optional alsoInsert)
}
```

| Key          | Used by                                    | Default                                  |
| ------------ | ------------------------------------------ | ---------------------------------------- |
| `tableAudit` | audit cards (`AuditSection`)               | `/api/admin/maintenance/table-audit`     |
| `rows`       | view/edit table rows (`useTableData`)      | `/api/admin/edit-table/rows`             |
| `columns`    | view/edit column metadata (`useTableData`) | `/api/admin/edit-table/columns`          |
| `lookup`     | lookup option lists (`useLookups`)         | `/api/admin/edit-table/lookup`           |
| `add`        | edit-table add                             | `/api/admin/edit-table/add`              |
| `remove`     | edit-table delete                          | `/api/admin/edit-table/delete`           |
| `sendScenarios` | send scenarios to a destination app     | `/api/admin/edit-table/send-scenarios`   |

The defaults live in `DEFAULT_ADMIN_ENDPOINTS` (`src/utils/adminPage.js`); the resolved map
is used to build the admin API service (`createAdminApi`) that the hooks and sections call.

### warning

An optional string rendered as an informational banner pinned to the top of the page (the
shared `InfoBox`). The token `{app}` is replaced with the current app name. Use it to remind
admins that app-scoped tables only show the current app's data:

```js
warning:
    "Any tables shown here to edit/view that have application identifier columns are " +
    "fixed and only show data for the current application. In this case any registrations " +
    "and logs shown are for this current app: {app}.",
```

Omit `warning` to show no banner.

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
        addToTable: true,             // show the friendly label in the table (replacing the raw id)
        // headerLabel: "Scenario",   // optional: override the label column's header
        // showValueColumn: true,     // optional: also show the raw id column
        // placeholder: "Please select scenario code…", // optional: add-form dropdown prompt
        // descriptionColumns: ["vis_description", "network_desc"], // optional: extra detail per option
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
| `addToTable`        | no       | When `true`, show the `labelColumn` in the table **in place of** the raw id/value column.          |
| `headerLabel`       | no       | Overrides the label column's header. Defaults to the humanised source column name with a trailing `_id` removed (e.g. `scenario_id` → "Scenario"). |
| `showValueColumn`   | no       | When `true`, keep the raw id/value column alongside the friendly label instead of replacing it.    |
| `placeholder`       | no       | Custom prompt for the add-form dropdown (defaults to the humanised column name).                   |
| `descriptionColumns`| no       | Extra source columns fetched per option and shown as muted secondary lines under the label in the dropdown menu (e.g. `["vis_description", "network_desc"]`). Must be plain column identifiers. |

**Behaviour notes:**

- Column headers throughout the page are humanised for readability — underscores become
  spaces and each word is title-cased (e.g. `modified_by` → "Modified By", `target_app_id`
  → "Target App ID"). This applies to table headers and add-form field placeholders.
- A raw id column with a configured label (`addToTable`) is hidden by default, since the
  friendly label makes the id redundant. Set `showValueColumn: true` to show both.
- Empty cell values (null or blank) render as a greyed **"Empty"** placeholder, so blank
  cells read clearly instead of appearing as gaps.
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

Sections fetch their data independently, so when the audit table is also shown on the page
(e.g. a `pipeline_audit_log` view), add `refreshTables: ["pipeline_audit_log"]` to this edit
table so that view reloads after each add/delete and shows the new entry without a page
reload.

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

All endpoints are under `/api/admin`. Every request body carries an **`app`** field naming
the app being administered; the server checks the caller's roles for that app before doing
anything (400 if `app` is missing, 403 if not permitted). Reads require an admin **or**
superuser of the app; the writes (`add`/`delete`) require an **admin**. The frontend adds
`app` automatically — the admin API service (`createAdminApi`) stamps it onto every request.

| Method & path                              | Purpose                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `POST /api/admin/maintenance/table-audit`  | Returns per table: last modified/created (date + user), row/upload/modification counts, and modifications-per-user. |
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

Authorisation is **per app**. Each admin controller derives from
`AppScopedAdminControllerBase`. Read actions call `RequireAppView(request)` and write actions
call `RequireAppEdit(request)` at the top of the action:

- `RequireAppView` — allows an **admin** (`ClaimsPrincipal.IsAppAdmin`: `<app>_admin` or
  `all_admin`) **or** a **superuser** (`IsAppSuperuser`: `<app>_superuser` or `all_superuser`)
  of the request's `app`.
- `RequireAppEdit` — allows an **admin** only. Superusers are view-only and are rejected.

No *other* app's role grants access — so a user of one app can neither read nor mutate
another app's data, even by calling the API directly.

On top of the per-app check, the `EditTableFacade` maintains four table whitelists (an
anti-injection safety net, since table/column names are interpolated into SQL), and every
request is validated against the relevant one before any SQL runs:

| Whitelist                      | Used by                                   | Example members                   |
| ------------------------------ | ----------------------------------------- | --------------------------------- |
| `AllowedEditTables`            | reads **and** writes (rows/columns/add/delete) | `scenario_app_registrations`  |
| `AllowedViewTables`            | reads only (rows/columns)                 | `pipeline_audit_log`, `pipeline_apps` |
| `AllowedLookupTables`          | lookup option sources                     | `input_norms_scenario`, `pipeline_apps` |
| `AllowedSecondaryInsertTables` | `alsoInsert` targets                      | `pipeline_audit_log`              |

Schemas are also whitelisted (`public`, `rail_data`). A view table can never be written to,
because the add/delete paths validate against `AllowedEditTables` only.

> **Note:** the table whitelist is currently global (not scoped per app). The per-app
> **authorisation** check is the security boundary; the whitelist is an additional
> anti-injection guard. If multiple apps ever share this controller with disjoint table
> sets, make the whitelist per-app too (or move to a capabilities endpoint that returns the
> allowed tables/actions for the user+app).

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
