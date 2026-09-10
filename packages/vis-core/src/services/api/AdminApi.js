/**
 * Admin API service — the single place that knows how the admin panel talks to the
 * backend. It owns the endpoint paths (supplied by config, defaulted elsewhere) and the
 * request shapes, and stamps every request with the target `app` so the server can scope
 * the action to that app's administrator. Components and hooks depend on this service
 * rather than calling the API (or knowing endpoints) directly.
 */

/**
 * Creates an admin API bound to a set of endpoints and a target app.
 *
 * @param {Object} params
 * @param {Object} params.baseService - The HTTP service (e.g. `api.baseService`) used to POST.
 * @param {Object} params.endpoints - Resolved endpoint map (see DEFAULT_ADMIN_ENDPOINTS).
 * @param {string} params.app - The app the admin is acting on (sent with every request).
 * @returns {{
 *   getTableAudit: (tables: Array<Object>) => Promise<Array<Object>>,
 *   getRows: (table: Object) => Promise<Array<Object>>,
 *   getColumns: (table: Object) => Promise<Array<Object>>,
 *   getLookup: (lookup: Object) => Promise<Array<Object>>,
 *   addRow: (input: Object) => Promise<Object>,
 *   deleteRow: (input: Object) => Promise<Object>,
 * }} The admin API.
 */
export function createAdminApi({ baseService, endpoints, app }) {
  const post = (path, body) => baseService.post(path, { app, ...body });

  return {
    /**
     * Fetches the latest audit summary for each configured table.
     * @param {Array<Object>} tables - Audit table configs.
     * @returns {Promise<Array<Object>>}
     */
    getTableAudit(tables) {
      return post(endpoints.tableAudit, {
        tables: (tables ?? []).map((t) => ({
          tableName: t.tableName,
          schema: t.schema ?? "public",
          displayName: t.displayName,
          auditColumns: t.auditColumns,
          filter: t.filter ?? null,
        })),
      });
    },

    /**
     * Fetches the rows of a table, optionally filtered.
     * @param {Object} table - Table config ({ tableName, schema, filter }).
     * @returns {Promise<Array<Object>>}
     */
    getRows(table) {
      return post(endpoints.rows, {
        tableName: table.tableName,
        schema: table.schema,
        filter: table.filter ?? null,
      });
    },

    /**
     * Fetches column metadata for a table.
     * @param {Object} table - Table config ({ tableName, schema, filter }).
     * @returns {Promise<Array<Object>>}
     */
    getColumns(table) {
      return post(endpoints.columns, {
        tableName: table.tableName,
        schema: table.schema,
        filter: table.filter ?? null,
      });
    },

    /**
     * Fetches value/label options for a lookup dropdown.
     * @param {Object} lookup - Lookup config ({ table, schema, valueColumn, labelColumn, filter }).
     * @returns {Promise<Array<Object>>}
     */
    getLookup(lookup) {
      return post(endpoints.lookup, {
        source: {
          table: lookup.table,
          schema: lookup.schema,
          valueColumn: lookup.valueColumn,
          labelColumn: lookup.labelColumn,
          filter: lookup.filter ?? null,
          descriptionColumns: lookup.descriptionColumns ?? null,
        },
        exclude: null,
      });
    },

    /**
     * Inserts a row (with an optional secondary insert in the same transaction).
     * @param {Object} input - ({ tableName, schema, values, alsoInsert }).
     * @returns {Promise<Object>}
     */
    addRow({ tableName, schema, values, alsoInsert }) {
      return post(endpoints.add, { tableName, schema, values, alsoInsert });
    },

    /**
     * Deletes a row by key(s) (with an optional secondary insert in the same transaction).
     * @param {Object} input - ({ tableName, schema, keyValues, alsoInsert }).
     * @returns {Promise<Object>}
     */
    deleteRow({ tableName, schema, keyValues, alsoInsert }) {
      return post(endpoints.remove, { tableName, schema, keyValues, alsoInsert });
    },

    /**
     * Registers multiple scenarios to a destination app in one action. The request is
     * authorised against the current app, but the scenarios are registered to `targetAppId`,
     * which may be any app the current app has an approved data pathway to (enforced server-side).
     * @param {Object} input - ({ targetAppId, scenarioIds }).
     * @returns {Promise<{registered: number, skipped: number}>}
     */
    sendScenarios({ targetAppId, scenarioIds }) {
      return post(endpoints.sendScenarios, { targetAppId, scenarioIds });
    },

    /**
     * Fetches the destination apps the current app is permitted to send scenarios to
     * (approved data pathways). Used to populate the Send Scenarios destination list.
     * @returns {Promise<Array<{appId: number, appName: string, appDescription: string}>>}
     */
    getSendTargets() {
      return post(endpoints.sendTargets, {});
    },
  };
}
