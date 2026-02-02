import { useContext, useEffect, useMemo, useState } from "react";
import { PageContext, FilterContext } from "contexts";
import { api } from "services";
import { updateFilterValidity } from "utils";
import { applyWhereConditions, sortValues, buildDeterministicFilterId } from "utils";

/**
 * callMetadataEndpoint
 * Executes a GET or POST request using the shared API service for metadata table fetches.
 *
 * Params:
 * - endpoint: { path: string, requestMethod?: 'GET'|'POST', requestOptions?: object, body?: object }
 *
 * Returns:
 * - Promise<any> Parsed response payload
 *
 * Errors:
 * - Propagates API errors to caller for handling (e.g., logging and safe fallbacks).
 */
async function callMetadataEndpoint(endpoint) {
  const method = (endpoint?.requestMethod || "GET").toUpperCase();
  const opts = endpoint?.requestOptions || undefined;
  if (method === "POST") return api.baseService.post(endpoint.path, endpoint.body ?? {}, opts);
  return api.baseService.get(endpoint.path, opts);
}

/**
 * useMetadataDrivenFilters
 * Builds data-driven filters (options sourced from metadata tables) and applies dependency validation.
 * Mirrors MapContext’s pipeline (deterministic IDs, default values, updateFilterValidity) for non-map pages.
 *
 * Returns:
 * - { filters, filterState, onFilterChange, isReady }
 *
 * Errors:
 * - The hook catches and logs fetch errors and continues with empty tables/filters (resilient UI).
 */
export function useMetadataDrivenFilters() {
  const pageContext = useContext(PageContext);
  const { state: filterState, dispatch: filterDispatch } = useContext(FilterContext);

  const [metadataTables, setMetadataTables] = useState({});
  const [filtersWithIds, setFiltersWithIds] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // 1) Fetch metadata tables via API (GET/POST supported).
  useEffect(() => {
    let cancelled = false;
    const loadTables = async () => {
      try {
        const tables = {};
        for (const table of pageContext.config.metadataTables || []) {
          const response = await callMetadataEndpoint(table);
          let rows = response;
          if (Array.isArray(table.where) && table.where.length > 0) {
            rows = applyWhereConditions(rows, table.where);
          }
          tables[table.name] = rows;
        }
        if (!cancelled) setMetadataTables(tables);
      } catch (err) {
        console.error("useMetadataDrivenFilters: failed to fetch metadata tables:", err);
        if (!cancelled) setMetadataTables({});
      }
    };
    loadTables();
    return () => { cancelled = true; };
  }, [pageContext]);

  // 2) Build filters with deterministic IDs and options from metadata tables.
  useEffect(() => {
    const used = new Set();
    const built = (pageContext.config.filters || []).map((f) => {
      const id = buildDeterministicFilterId(f, used);
      const filter = { ...f, id };

      if (filter.values?.source === "metadataTable") {
        const table = metadataTables[filter.values.metadataTableName] || [];
        let rows = table;
        if (filter.values.where) rows = applyWhereConditions(table, filter.values.where);

        let options = [];
        rows.forEach((row) => {
          const value = {
            displayValue: row[filter.values.displayColumn],
            paramValue: row[filter.values.paramColumn],
            legendSubtitleText: row[filter.values?.legendSubtitleTextColumn] || null,
            infoOnHover: row[filter.values?.infoOnHoverColumn] ?? null,
            infoBelowOnChange: row[filter.values?.infoBelowOnChangeColumn] ?? null,
          };
          // Deduplicate on (displayValue, paramValue)
          if (!options.some((o) => o.paramValue === value.paramValue && o.displayValue === value.displayValue)) {
            options.push(value);
          }
        });

        if (filter.values.sort) options = sortValues(options, filter.values.sort);
        if (filter.values.exclude) options = options.filter((o) => !filter.values.exclude.includes(o.paramValue));

        filter.values = { ...filter.values, values: options };
      }

      return filter;
    });

    setFiltersWithIds(built);
  }, [pageContext, metadataTables]);

  // 3) Initialise defaults into FilterContext (single/multi).
  useEffect(() => {
    if (!filtersWithIds.length) return;

    const initial = {};
    filtersWithIds.forEach((f) => {
      if (f.shouldBeBlankOnInit) {
        initial[f.id] = null;
        return;
      }
      if (f.multiSelect && f.shouldInitialSelectAllInMultiSelect) {
        initial[f.id] = f.defaultValue ?? f.min ?? (f.values?.values || []).map((v) => v.paramValue);
      } else {
        initial[f.id] = f.defaultValue ?? f.min ?? f.values?.values?.[0]?.paramValue ?? null;
      }
    });

    filtersWithIds.forEach((f) => {
      if (typeof initial[f.id] !== "undefined") {
        filterDispatch({ type: "SET_FILTER_VALUE", payload: { filterId: f.id, value: initial[f.id] } });
      }
    });

    setIsReady(true);
  }, [filtersWithIds, filterDispatch]);

  // 4) Apply dependency validation/hiding (same routine used in MapLayout).
  const validatedFilters = useMemo(() => {
    if (!isReady) return filtersWithIds;
    const stateLike = { filters: filtersWithIds, metadataTables };
    return updateFilterValidity(stateLike, filterState);
  }, [filtersWithIds, metadataTables, filterState, isReady]);

  /**
   * onFilterChange
   * Dispatches a filter value update into FilterContext.
   *
   * Params:
   * - filter: filter metadata (must include .id)
   * - value: any (array for multi, scalar or null for single)
   *
   * Returns:
   * - void
   */
  const onFilterChange = (filter, value) => {
    filterDispatch({ type: "SET_FILTER_VALUE", payload: { filterId: filter.id, value } });
  };

  return { filters: validatedFilters, filterState, onFilterChange, isReady };
}