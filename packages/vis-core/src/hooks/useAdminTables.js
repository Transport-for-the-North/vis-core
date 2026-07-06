// Data hooks and admin-API context for the AdminPage. The hooks depend on an admin API
// service (provided by AdminPage via AdminApiContext) rather than calling the backend or
// knowing endpoint paths directly. Pure helpers live in utils/adminPage; the service
// lives in services/api/AdminApi.

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ROW_HEIGHT_PX, HEADER_HEIGHT_PX } from "utils";

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
 * Cross-section refresh bus. Sections fetch independently, so a mutation in one (e.g.
 * adding a registration) must be able to trigger a reload of another that it affects
 * (e.g. the pipeline audit log). Holds a per-table-name counter; `requestRefresh` bumps
 * the counter for the named table(s), and `useTableData` refetches when its table's
 * counter changes. AdminPage supplies the value.
 *
 * @type {React.Context<{signals: Object<string, number>, requestRefresh: (tables: string|string[]) => void}>}
 */
export const AdminRefreshContext = createContext({ signals: {}, requestRefresh: () => {} });

/**
 * Reads the cross-section refresh bus.
 * @returns {{signals: Object<string, number>, requestRefresh: (tables: string|string[]) => void}}
 */
export const useAdminRefresh = () => useContext(AdminRefreshContext);

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
  const { signals } = useAdminRefresh();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refetch when another section requests a refresh of this table (e.g. an audit log
  // reloaded after a registration is added/removed elsewhere on the page).
  const refreshSignal = signals?.[table.tableName] ?? 0;

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
  }, [table.tableName, refreshSignal]);

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

/**
 * Computes the height at which a table should stop growing and start scrolling so that
 * exactly `maxRows` rows stay visible. It measures the rendered header and first data-row
 * heights rather than assuming a fixed row height, because rows vary (e.g. edit tables are
 * taller due to the row action button). Falls back to the px approximations until measured.
 *
 * Attach the returned `scrollRef` to the scroll container (which must contain the
 * `<thead>`/`<tbody>`), and apply `maxHeight` as its cap.
 *
 * @param {number} maxRows - Rows to keep visible before scrolling.
 * @param {number} rowCount - Current row count (re-measures when it changes).
 * @param {number} colCount - Current column count (re-measures when it changes).
 * @returns {{scrollRef: React.RefObject<HTMLDivElement>, maxHeight: number}}
 */
export function useTableScrollCap(maxRows, rowCount, colCount) {
  const scrollRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(ROW_HEIGHT_PX * maxRows + HEADER_HEIGHT_PX);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    const header = el?.querySelector("thead");
    const firstRow = el?.querySelector("tbody tr");
    if (!header || !firstRow) return;

    const headerHeight = header.getBoundingClientRect().height;
    const rowHeight = firstRow.getBoundingClientRect().height;
    if (rowHeight > 0) {
      setMaxHeight(Math.round(headerHeight + rowHeight * maxRows));
    }
  }, [maxRows, rowCount, colCount]);

  return { scrollRef, maxHeight };
}
