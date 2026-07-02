// Data hooks and admin-API context for the AdminPage. The hooks depend on an admin API
// service (provided by AdminPage via AdminApiContext) rather than calling the backend or
// knowing endpoint paths directly. Pure helpers live in utils/adminPage; the service
// lives in services/api/AdminApi.

import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * Carries the admin API service (see `createAdminApi`) down to the data hooks and
 * sections, so no component talks to the backend directly. AdminPage supplies the value.
 */
export const AdminApiContext = createContext(null);

/**
 * Reads the admin API service from context.
 * @returns {ReturnType<import("services").createAdminApi>} The admin API.
 */
export const useAdminApi = () => useContext(AdminApiContext);

/**
 * Whether the current user may edit (add/delete) on the admin page. Defaults to true;
 * AdminPage sets it to false for view-only users (e.g. cross-app super admins).
 */
export const AdminCanEditContext = createContext(true);

/**
 * Reads whether the current user may edit admin data.
 * @returns {boolean} True when add/delete are permitted.
 */
export const useAdminCanEdit = () => useContext(AdminCanEditContext);

/**
 * Shared data hook for view/edit tables. Fetches the table's rows and column metadata
 * together and exposes a refetch for use after mutations.
 *
 * @param {Object} table - Table config (tableName, schema, filter).
 * @returns {{rows: Array<Object>, columns: Array<Object>, loading: boolean,
 *   error: (string|null), setError: Function, refetch: Function}} Table data and helpers.
 */
export function useTableData(table) {
  const adminApi = useAdminApi();
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
    Promise.all([adminApi.getRows(table), adminApi.getColumns(table)])
      .then(([rowData, colData]) => {
        setRows(rowData ?? []);
        setColumns(colData ?? []);
      })
      .catch(() => setError("Failed to load table."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.tableName]);

  return { rows, columns, loading, error, setError, refetch: fetchData };
}

/**
 * Shared hook for lookup-driven columns (used by both view and edit tables). Fetches the
 * full value/label option list for every configured lookup and exposes a value→label map
 * per column for rendering friendly labels.
 *
 * @param {Object} table - Table config; reads `table.lookups`.
 * @returns {{lookups: Object, lookupOptions: Object, lookupLabels: Object}} The lookup
 *   config, the full option lists keyed by column, and value→label maps keyed by column.
 */
export function useLookups(table) {
  const adminApi = useAdminApi();
  const lookups = table.lookups ?? {};
  const [lookupOptions, setLookupOptions] = useState({});

  useEffect(() => {
    const entries = Object.entries(lookups);
    if (entries.length === 0) return;
    Promise.all(
      entries.map(([col, cfg]) =>
        adminApi.getLookup(cfg).then((opts) => [col, opts ?? []])
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
