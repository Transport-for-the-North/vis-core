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
6. [How sections refresh](#how-sections-refresh)
7. [Row limits and scrolling](#row-limits-and-scrolling)
8. [The API](#the-api)
9. [Security model](#security-model)
10. [Adding a new table — checklist](#adding-a-new-table--checklist)

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

Read-only summary cards for a table. Each card shows:

- **Last modified / Created** — the latest-modified row's dates and users, each with a
  relative "· 3 days ago" suffix.
- **Records** — total row count.
- **Uploads** — number of distinct load events (`COUNT(DISTINCT created_date)`).
- **Modifications** — records changed since upload (`modified_date IS DISTINCT FROM
  created_date`).
- Three expandable breakdowns (click to reveal):
  - **Changes by user** — every user's modification count, with the date of their most
    recent change ("· 12 Mar 2026, 09:14 · 3 days ago").
  - **Uploads (n)** — one row per distinct load event: when it ran, who loaded it
    (`created_by`) and how many rows it loaded.
  - **Scenarios missing (n)** — the scenarios registered to *this app* that have no rows in
    this table, i.e. registered but whose data has not been loaded. Shown only for tables
    keyed by `norms_scenario_id`; reads "All registered scenarios have data in this table."
    when there are none. See [Scenarios missing](#scenarios-missing).
- A **stale** amber highlight (and "Stale" badge) when the data hasn't been modified within
  `staleAfterDays` days.

The counts and breakdowns are **pre-computed** in the `rail_data.audit_table_overview`
materialised view (see
`Database-Tools/data_uploads/norms/audit_view/create_norms_audit_view.sql`) and read from
there per request, rather than by scanning each (often large, partitioned) table live. The
figures therefore reflect the last time that view was refreshed
(`REFRESH MATERIALIZED VIEW CONCURRENTLY rail_data.audit_table_overview;` after each data
load), not the instantaneous table state.

**The view defines what is auditable.** There is no separate server-side table whitelist: the
API reads the whole (tiny) view and matches requested tables to its rows in memory, so a table
is auditable precisely when the view is built over it. Add or remove tables by editing the
`audited_tables` array in the view SQL and rebuilding. Only tables carrying the standard
`created_`/`modified_` audit columns are included — the pipeline bookkeeping tables
(`pipeline_apps`, `pipeline_audit_log`, `scenario_app_registrations`),
`input_norms_landuse_scenario` and `output_norms_landuse` are deliberately excluded.

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
| `tableName`      | yes      | Table to audit; must be present in the overview view.             |
| `schema`         | no       | Schema name (defaults to `public`).                               |
| `displayName`    | yes      | Card heading.                                                     |
| `auditColumns`   | no       | Legacy hint of the audit column names. No longer used server-side (the summary is read from the pre-computed view); omit for tables without audit columns. |
| `staleAfterDays` | no       | Age (days) past which the card is highlighted amber as stale.     |

> **Note:** because the summary is read from the pre-computed overview, a per-table `filter`
> no longer scopes the audit counts (the overview is aggregated over the whole table). A table
> requested but not yet present in the view (e.g. added to config before the view is rebuilt)
> renders an empty card rather than erroring.

#### Scenarios missing

Unlike the rest of the card — which comes from the pre-computed view — this list is queried
**live** on each load, because it is scoped to the scenarios registered to the current app:

```sql
SELECT s.scenario_code
FROM rail_data.scenario_app_registrations r
JOIN rail_data.input_norms_scenario s ON s.id = r.scenario_id
WHERE r.app_id = <this app>
  AND NOT EXISTS (SELECT 1 FROM rail_data.<table> o
                  WHERE o.norms_scenario_id = r.scenario_id)
```

Which tables this applies to is **not** configured or hardcoded: the view carries an
`is_scenario_scoped` flag, derived when it is built by checking `information_schema` for a
`norms_scenario_id` column, and the API only runs the query for tables the view flags. The
table names used in that query are taken from the view's own rows rather than from the
request, so nothing client-supplied is ever interpolated into SQL.

The app id is resolved server-side from `pipeline_apps.app_name`, so the list always reflects
the app being administered. The cards reload when a registration is added, removed or sent
elsewhere on the page.

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

#### Adding several rows at once

A lookup marked `multiSelect: true` turns its add-form dropdown into a multi-select, and
**Add** then inserts **one row per selected value** — every other field in the form is shared
across those rows. The button names the count (`Add 4`) once more than one value is picked, and
the outcome is reported above the table ("Added 4 rows.").

- **One multi-select column per table.** If more than one lookup on the same table sets the
  flag, the first one configured is used; the rest stay single-select. Two would otherwise imply
  a cross-product of rows rather than a list.
- **Inserts run one at a time**, each with its own `auditWrite` entry in its own transaction, so
  a row that fails (e.g. a duplicate) leaves the others inserted. A partial failure is reported
  as "Failed to add 1 of 4 rows."
- `excludeRegistered` still applies, so values already in the table are not offered.

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

> **Destinations are restricted to approved data pathways.** The destination dropdown is not
> "every app" — it is populated from the `sendTargets` endpoint, which returns the current app's
> approved targets from `rail_data.app_data_pathways`. The server re-checks the pathway when the
> send is submitted, so a disallowed destination is rejected (400) even if requested directly.
> An app that feeds no other app shows a notice and the tool is disabled. See
> `docs/ScenarioRegistration.md` in the consuming app repo (NoRMS-Visualisation-Framework).

> **Authorisation:** the request is authorised as an **admin of the app being administered**.
> The scenarios are registered into the destination app's registrations, so an app admin can
> affect another app's data — but only along an approved pathway.

> **Note:** `appSource` below is now only a fallback, used if the `sendTargets` endpoint is
> unavailable (e.g. an older backend). Normally the destination list comes from the pathways.

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
    tableAudit:  "/api/admin/maintenance/table-audit", // audit cards
    rows:        "/api/admin/edit-table/rows",         // table rows
    columns:     "/api/admin/edit-table/columns",      // column metadata
    lookup:      "/api/admin/edit-table/lookup",       // lookup option lists
    add:         "/api/admin/edit-table/add",          // insert (with optional alsoInsert)
    remove:      "/api/admin/edit-table/delete",       // delete (with optional alsoInsert)
    sendScenarios: "/api/admin/edit-table/send-scenarios", // bulk register to another app
    sendTargets:   "/api/admin/edit-table/send-targets",   // approved destinations
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
| `sendTargets`   | approved destinations for the Send tool | `/api/admin/edit-table/send-targets`     |

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
        multiSelect: true,            // pick several values at once; Add inserts one row per value
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
| `multiSelect`       | no       | When `true`, the add-form dropdown accepts several values and **Add** inserts one row per selected value (edit tables only). See [Adding several rows at once](#adding-several-rows-at-once). |
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

## How sections refresh

A mutation reloads the sections it affects (its own rows, plus anything named in
`refreshTables`), but a reload is deliberately **invisible apart from the data**:

- **Nothing is unmounted.** The first load shows a "Loading…" placeholder; every reload after
  that keeps the current rows/cards rendered until the new ones arrive (`useTableData` reports
  these separately as `loading` vs `refreshing`). Blanking a section would collapse it, which
  shifts everything below it and throws away the page's scroll position — and, on audit cards,
  the expanded/collapsed state of each breakdown.
- **Rows are keyed by primary key**, not by position (`makeRowKey`), so a refresh patches the
  rows that changed instead of rebuilding the list. The table's own scroll position is kept.
- **Feedback never moves the layout.** "Added 3 rows.", "Updating…" and mutation failures are
  rendered inline on the section's heading line (`SectionHeader` + `InlineStatus`), which has a
  fixed height, rather than as a block that would push the table down as it appears and clears.
  Load failures ("Failed to load table.") remain block messages, since there is no table to
  push down in that case.
- A background reload sets `aria-busy` on the table/grid for assistive technology.

The net effect of an add or delete is that the row appears or disappears and the counts move —
nothing else on the page shifts.

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
| `POST /api/admin/maintenance/table-audit`  | Returns per table: last modified/created (date + user), row/upload/modification counts, modifications-per-user (with each user's last change), per-upload events (date + user + rows), and the app's scenarios missing from that table. |
| `POST /api/admin/edit-table/rows`          | Returns the rows of a table, optionally filtered.                       |
| `POST /api/admin/edit-table/columns`       | Returns column metadata (type, nullability, generated, primary key).    |
| `POST /api/admin/edit-table/lookup`        | Returns value/label options from a metadata table, with optional exclusion. |
| `POST /api/admin/edit-table/add`           | Inserts a row, with an optional secondary insert in the same transaction. |
| `POST /api/admin/edit-table/delete`        | Deletes a row by key(s), with an optional secondary insert in the same transaction. |
| `POST /api/admin/edit-table/send-targets`  | Returns the apps this app may register scenarios into (approved pathways). |
| `POST /api/admin/edit-table/send-scenarios`| Registers several scenarios into a destination app (pathway-checked).   |

The `add` and `delete` requests accept an optional `alsoInsert` object
(`{ table, schema, values }`) which the front end builds from the `auditWrite` config.

Column and table names in these requests are interpolated into SQL, so every table is checked
against a server-side whitelist. Values are always parameterised.

`send-scenarios` and `send-targets` are thin wrappers over `NORMS_ScenarioRegistrationFacade`,
which is shared with the non-admin sidebar registration endpoint — see
`docs/ScenarioRegistration.md` in the consuming app repo (NoRMS-Visualisation-Framework).

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
request is validated against the relevant one before any SQL runs. Entries are
**schema-qualified** (`<schema>.<table>`), so a table is only reachable in the schema it was
approved in, and another application's tables are added simply by listing them under their own
schema:

| Whitelist                      | Used by                                   | Example members                   |
| ------------------------------ | ----------------------------------------- | --------------------------------- |
| `AllowedEditTables`            | reads **and** writes (rows/columns/add/delete) | `rail_data.scenario_app_registrations` |
| `AllowedViewTables`            | reads only (rows/columns)                 | `rail_data.pipeline_audit_log`, `rail_data.pipeline_apps` |
| `AllowedLookupTables`          | lookup option sources                     | `rail_data.input_norms_scenario`, `rail_data.pipeline_apps` |
| `AllowedSecondaryInsertTables` | `alsoInsert` targets                      | `rail_data.pipeline_audit_log`    |

There is no separate schema whitelist — the schema is part of each entry above, which is
stricter than the previous table-list × schema-list combination. A view table can never be
written to, because the add/delete paths validate against `AllowedEditTables` only.

**Audit cards have no whitelist**: the `table-audit` path never interpolates a client-supplied
name (the overview view is read whole and matched in memory), and the per-table
"scenarios missing" query uses names taken from the view's own rows. The view therefore defines
both what is auditable and what is safe to name in SQL.

> **Note:** the table whitelist is global (not scoped per app). The per-app **authorisation**
> check is the security boundary; the whitelist is an additional anti-injection guard. If
> multiple apps ever share this controller with disjoint table sets, make the whitelist per-app
> too (or move to a capabilities endpoint that returns the allowed tables/actions for the
> user+app).

---

## Adding a new table — checklist

1. **Server whitelist** (edit/view/lookup tables only) — add the **schema-qualified** name
   (e.g. `rail_data.my_table`) to the appropriate set in `EditTableFacade`:
   `AllowedEditTables` for editing, `AllowedViewTables` for read-only, `AllowedLookupTables`
   for lookup sources, `AllowedSecondaryInsertTables` for audit-write targets.
2. **Audit cards** — there is no whitelist to update. Instead add the table to the
   `audited_tables` array in
   `Database-Tools/data_uploads/norms/audit_view/create_norms_audit_view.sql`, then rebuild the
   view and `REFRESH MATERIALIZED VIEW rail_data.audit_table_overview;`. The table must carry
   the standard `created_`/`modified_` audit columns. If it has a `norms_scenario_id` column it
   is flagged scenario-scoped automatically and gains the "Scenarios missing" breakdown.
3. **Page config** — add an entry to `auditTables`, `editTables` or `viewTables`, and place it
   in the `layout`.
4. **Optional extras** — add `lookups` (dropdowns/labels), `fixedValues` (locked add values),
   `auditWrite` (secondary insert) and/or `maxRows` as needed.
5. **Restart** — rebuild/restart the API (whitelist change), rebuild + refresh the view (audit
   change), and restart the Vite dev server (config change).
