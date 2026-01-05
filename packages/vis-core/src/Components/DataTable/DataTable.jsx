import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import { useCompactSelectStyles } from "utils/selectStyles";
import { useDebounced, usePersistentState } from "hooks";

import {
  CompactClearIndicator,
  CompactDropdownIndicator,
  CompactValueContainer,
} from "./CompactSelectParts";

import {
  CellInner,
  ClearBtn,
  FilterInputWrap,
  FilterRowCell,
  HeaderLabel,
  MeasureHost,
  ResizerButton,
  ScrollX,
  StickyControls,
  StyledTable,
  TablePane,
  Td,
  Th,
  ThInner,
  Tr,
} from "./DataTable.styles";

import {
  computeReasonableWrapWidthsPx,
  makeTextMeasurer,
  mergeExpandOnly,
} from "utils/dataTableSizing";

/**
 * @typedef {Object} DataTableColumn
 * @property {string} accessor - Object key used to read a cell value from each row.
 * @property {string} header - Display label for the column header.
 * @property {'text'|'number'} [type] - Affects alignment and sizing heuristics.
 * @property {{type:'dropdown'|'text'|'none'}} [filter] - Filter UI type for the column.
 */

/**
 * @typedef {Object} DataTableProps
 * @property {DataTableColumn[]} columns
 * @property {any[]} data
 * @property {string} clickableAccessor - Row key; truthy values indicate rows are selectable/clickable.
 * @property {(id: string|number, nextSelected: boolean) => void} onToggleSelect
 * @property {Set<string|number>} selectedIds
 * @property {(next: Set<string|number>) => void} setSelectedIds
 * @property {string} [rowIdAccessor='id'] - Row key used as the row identifier.
 * @property {string} [storageKey='dataTable.columnWidths'] - Base key for persisted column widths.
 * @property {number} [autoFitSampleSize=200] - Number of visible rows sampled for sizing heuristics.
 * @property {Record<string, number>} [perColumnMaxPx] - Optional max width override per accessor.
 * @property {string} [caption] - Optional table caption (visually hidden) for screen readers.
 */

/**
 * Filterable, selectable table with persistent column widths and drag-to-resize.
 *
 * Accessibility:
 * - Resizer controls support mouse drag, Enter to auto-fit, and keyboard resizing:
 *   - Left/Right: 10px
 *   - Shift+Left/Shift+Right: 50px
 *   - Home: minimum width
 *   - End: maximum width
 *
 * @param {DataTableProps} props
 * @returns {JSX.Element}
 */
export function DataTable({
  columns,
  data,
  clickableAccessor,
  onToggleSelect,
  selectedIds,
  setSelectedIds,
  rowIdAccessor = "id",
  storageKey = "dataTable.columnWidths",
  autoFitSampleSize = 200,
  perColumnMaxPx,
  caption,
}) {
  const compactStyles = useCompactSelectStyles();

  const tableId = useMemo(
    () => `datatable-${Math.random().toString(36).slice(2)}`,
    []
  );
  const resizeHelpId = `${tableId}-resize-help`;

  const MIN_COL_WIDTH_PX = 30;
  const DEFAULT_MAX_COL_WIDTH_PX = 520;

  /** @type {React.MutableRefObject<HTMLInputElement|null>} */
  const selectAllRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLTableElement|null>} */
  const tableRef = useRef(null);
  /** @type {React.MutableRefObject<HTMLDivElement|null>} */
  const measureHostRef = useRef(null);

  const [colWidthsPx, setColWidthsPx] = usePersistentState(`${storageKey}.px`, {});
  const [localInputs, setLocalInputs] = useState({});
  const colFilters = useDebounced(localInputs, 200);

  const didInitialAutoSizeRef = useRef(false);

  const columnOptions = useMemo(() => {
    /** @type {Record<string, Array<{value:any,label:string}>>} */
    const map = {};

    columns.forEach((c) => {
      if (c.filter?.type !== "dropdown") return;

      const uniq = Array.from(
        new Set(data.map((r) => r[c.accessor]).filter((v) => v != null))
      ).sort((a, b) =>
        String(a).localeCompare(String(b), undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );

      map[c.accessor] = uniq.map((v) => ({ value: v, label: String(v) }));
    });

    return map;
  }, [columns, data]);

  const filtered = useMemo(() => {
    const activeEntries = Object.entries(colFilters).filter(([_, v]) =>
      Array.isArray(v) ? v.length > 0 : v !== "" && v != null
    );
    if (activeEntries.length === 0) return data;

    return data.filter((row) =>
      activeEntries.every(([accessor, filterVal]) => {
        const col = columns.find((c) => c.accessor === accessor);
        if (!col || col.filter?.type === "none") return true;

        const cell = row[accessor];

        if (col.filter?.type === "dropdown") {
          const vals = Array.isArray(filterVal) ? filterVal : [filterVal];
          return vals.includes(cell);
        }

        return String(cell ?? "")
          .toLowerCase()
          .includes(String(filterVal).toLowerCase());
      })
    );
  }, [data, colFilters, columns]);

  const visibleEligibleIds = useMemo(
    () => filtered.filter((r) => r[clickableAccessor]).map((r) => r[rowIdAccessor]),
    [filtered, clickableAccessor, rowIdAccessor]
  );

  const selectedEligibleCount = useMemo(
    () => visibleEligibleIds.filter((id) => selectedIds.has(id)).length,
    [visibleEligibleIds, selectedIds]
  );

  useEffect(() => {
    if (!selectAllRef.current) return;

    selectAllRef.current.indeterminate =
      selectedEligibleCount > 0 && selectedEligibleCount < visibleEligibleIds.length;
  }, [selectedEligibleCount, visibleEligibleIds.length]);

  /**
   * Selects or deselects all currently visible + eligible rows.
   *
   * @returns {void}
   */
  const toggleSelectAll = () => {
    const next = new Set(selectedIds);
    const allSelected = selectedEligibleCount === visibleEligibleIds.length;

    if (allSelected) visibleEligibleIds.forEach((id) => next.delete(id));
    else visibleEligibleIds.forEach((id) => next.add(id));

    setSelectedIds(next);
  };

  /**
   * Recomputes and overwrites all column widths from the current filtered rows.
   *
   * @returns {void}
   */
  const resetWidths = useCallback(() => {
    if (!measureHostRef.current || !tableRef.current) return;

    measureHostRef.current.innerHTML = "";
    const { measureOneLinePx, measureHeaderTwoLineWidthPx } = makeTextMeasurer(
      measureHostRef.current,
      tableRef.current
    );

    const next = computeReasonableWrapWidthsPx({
      columns,
      filteredRows: filtered,
      autoFitSampleSize,
      measureOneLinePx,
      measureHeaderTwoLineWidthPx,
      perColumnMaxPx,
    });

    setColWidthsPx(next);
  }, [autoFitSampleSize, columns, filtered, perColumnMaxPx, setColWidthsPx]);

  /**
   * Ensures the current widths are sufficient for the filtered content by
   * expanding columns as needed (never shrinking).
   *
   * @returns {void}
   */
  const ensureWidthsFitFiltered = useCallback(() => {
    if (!measureHostRef.current || !tableRef.current) return;

    measureHostRef.current.innerHTML = "";
    const { measureOneLinePx, measureHeaderTwoLineWidthPx } = makeTextMeasurer(
      measureHostRef.current,
      tableRef.current
    );

    const required = computeReasonableWrapWidthsPx({
      columns,
      filteredRows: filtered,
      autoFitSampleSize,
      measureOneLinePx,
      measureHeaderTwoLineWidthPx,
      perColumnMaxPx,
    });

    setColWidthsPx((prev) => mergeExpandOnly(prev, required, columns.length));
  }, [autoFitSampleSize, columns, filtered, perColumnMaxPx, setColWidthsPx]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (!didInitialAutoSizeRef.current) {
        didInitialAutoSizeRef.current = true;
        resetWidths();
        return;
      }

      ensureWidthsFitFiltered();
    });

    return () => cancelAnimationFrame(id);
  }, [resetWidths, ensureWidthsFitFiltered]);

  /* ---------------------------- Drag column resizing ---------------------------- */

  /**
   * @type {React.MutableRefObject<null | {startX: number, idx: number, startW: number}>}
   */
  const dragStateRef = useRef(null);

  /**
   * @param {MouseEvent} e
   * @returns {void}
   */
  const onMouseMove = (e) => {
    const ds = dragStateRef.current;
    if (!ds) return;

    const deltaPx = e.clientX - ds.startX;
    const nextW = Math.max(MIN_COL_WIDTH_PX, Math.round(ds.startW + deltaPx));
    setColWidthsPx((prev) => ({ ...prev, [ds.idx]: nextW }));
  };

  /**
   * @returns {void}
   */
  const onMouseUp = () => {
    dragStateRef.current = null;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  /**
   * @param {React.MouseEvent<HTMLButtonElement>} e
   * @param {number} idx
   * @returns {void}
   */
  const onResizerMouseDown = (e, idx) => {
    const startW = colWidthsPx[idx] ?? 160;
    dragStateRef.current = { startX: e.clientX, idx, startW };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    e.preventDefault();
  };

  /**
   * Auto-fits a single column using the same deterministic sizing heuristic as reset.
   *
   * @param {number} i
   * @returns {void}
   */
  const autoFitColumn = useCallback(
    (i) => {
      if (!measureHostRef.current || !tableRef.current) return;

      measureHostRef.current.innerHTML = "";
      const { measureOneLinePx, measureHeaderTwoLineWidthPx } = makeTextMeasurer(
        measureHostRef.current,
        tableRef.current
      );

      const all = computeReasonableWrapWidthsPx({
        columns,
        filteredRows: filtered,
        autoFitSampleSize,
        measureOneLinePx,
        measureHeaderTwoLineWidthPx,
        perColumnMaxPx,
      });

      setColWidthsPx((prev) => ({ ...prev, [i]: all[i] ?? prev[i] ?? 160 }));
    },
    [autoFitSampleSize, columns, filtered, perColumnMaxPx, setColWidthsPx]
  );

  /**
   * Updates a single column width (clamped to min/max).
   *
   * @param {number} idx
   * @param {(prevWidth: number) => number} computeNext
   * @returns {void}
   */
  const updateColumnWidth = (idx, computeNext) => {
    const maxW =
      perColumnMaxPx?.[columns[idx]?.accessor] ?? DEFAULT_MAX_COL_WIDTH_PX;

    setColWidthsPx((prev) => {
      const prevW = prev?.[idx] ?? 160;
      const nextW = Math.max(MIN_COL_WIDTH_PX, Math.min(maxW, computeNext(prevW)));
      return { ...prev, [idx]: nextW };
    });
  };

  /**
   * @param {React.KeyboardEvent<HTMLButtonElement>} e
   * @param {number} i
   * @returns {void}
   */
  const onResizerKeyDown = (e, i) => {
    const step = e.shiftKey ? 50 : 10;
    const maxW =
      perColumnMaxPx?.[columns[i]?.accessor] ?? DEFAULT_MAX_COL_WIDTH_PX;

    switch (e.key) {
      case "Enter":
        autoFitColumn(i);
        e.preventDefault();
        break;
      case "ArrowLeft":
        updateColumnWidth(i, (w) => w - step);
        e.preventDefault();
        break;
      case "ArrowRight":
        updateColumnWidth(i, (w) => w + step);
        e.preventDefault();
        break;
      case "Home":
        updateColumnWidth(i, () => MIN_COL_WIDTH_PX);
        e.preventDefault();
        break;
      case "End":
        updateColumnWidth(i, () => maxW);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  /**
   * @param {number} idx
   * @returns {{width: string}}
   */
  const getColumnWidthStyle = (idx) => {
    const w = colWidthsPx[idx] ?? 160;
    return { width: `${w}px` };
  };

  return (
    <TablePane>
      <StickyControls>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem" }}>Filtered: {filtered.length}</span>

          {/* Screen reader instructions shared by all column resizers. */}
          <span
            id={resizeHelpId}
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
            }}
          >
            To resize a column: use Left and Right arrow keys. Hold Shift for larger steps.
            Press Home for minimum width and End for maximum width. Press Enter to auto-fit.
          </span>
        </div>

        <button
          type="button"
          onClick={resetWidths}
          title="Reset column widths"
          aria-label="Reset column widths"
          style={{ padding: "5px 8px", borderRadius: 5 }}
        >
          Reset Widths
        </button>
      </StickyControls>

      <MeasureHost ref={measureHostRef} />

      <ScrollX>
        <StyledTable ref={tableRef} id={tableId}>
          {caption ? (
            <caption
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              {caption}
            </caption>
          ) : null}

          <colgroup>
            <col style={{ width: "75px" }} />
            {columns.map((_, idx) => (
              <col key={idx} style={getColumnWidthStyle(idx)} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <Th style={{ width: 75 }} scope="col">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={
                      visibleEligibleIds.length > 0 &&
                      selectedEligibleCount === visibleEligibleIds.length
                    }
                    onChange={toggleSelectAll}
                    aria-label="Select all eligible rows"
                  />
                  <span>Select</span>
                </div>
              </Th>

              {columns.map((c, idx) => {
                const widthNow = colWidthsPx[idx] ?? 160;
                const maxW = perColumnMaxPx?.[c.accessor] ?? DEFAULT_MAX_COL_WIDTH_PX;

                return (
                  <Th key={c.accessor} style={getColumnWidthStyle(idx)} scope="col">
                    <ThInner>
                      <HeaderLabel>{c.header}</HeaderLabel>

                      {idx < columns.length - 1 && (
                        <ResizerButton
                          type="button"
                          role="separator"
                          aria-orientation="vertical"
                          aria-label={`Resize column ${c.header}`}
                          aria-controls={tableId}
                          aria-describedby={resizeHelpId}
                          aria-valuemin={MIN_COL_WIDTH_PX}
                          aria-valuemax={maxW}
                          aria-valuenow={widthNow}
                          title="Drag to resize. Use Left/Right arrows (Shift for larger steps). Enter auto-fits."
                          onMouseDown={(e) => onResizerMouseDown(e, idx)}
                          onDoubleClick={() => autoFitColumn(idx)}
                          onKeyDown={(e) => onResizerKeyDown(e, idx)}
                        />
                      )}
                    </ThInner>
                  </Th>
                );
              })}
            </tr>

            <tr>
              <FilterRowCell style={{ width: 75 }} />
              {columns.map((c, idx) => {
                if (c.filter?.type === "dropdown") {
                  const ops = columnOptions[c.accessor] || [];
                  const value = (localInputs[c.accessor] || []).map((v) => ({
                    value: v,
                    label: String(v),
                  }));

                  return (
                    <FilterRowCell
                      key={`f-${c.accessor}`}
                      $numeric={c.type === "number"}
                      style={getColumnWidthStyle(idx)}
                    >
                      <Select
                        classNamePrefix="rs"
                        isClearable
                        isMulti
                        isSearchable
                        placeholder="Filter"
                        value={value}
                        onChange={(opts) => {
                          const vals = Array.isArray(opts) ? opts.map((o) => o.value) : [];
                          setLocalInputs((prev) => ({
                            ...prev,
                            [c.accessor]: vals,
                          }));
                        }}
                        options={ops}
                        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
                        components={{
                          ValueContainer: CompactValueContainer,
                          MultiValue: () => null,
                          ClearIndicator: CompactClearIndicator,
                          DropdownIndicator: CompactDropdownIndicator,
                          IndicatorSeparator: () => null,
                        }}
                        styles={compactStyles}
                        aria-label={`Filter ${c.header}`}
                      />
                    </FilterRowCell>
                  );
                }

                if (c.filter?.type === "text") {
                  const val = localInputs[c.accessor] ?? "";
                  return (
                    <FilterRowCell
                      key={`f-${c.accessor}`}
                      $numeric={c.type === "number"}
                      style={getColumnWidthStyle(idx)}
                    >
                      <FilterInputWrap>
                        <input
                          style={{
                            width: "100%",
                            fontSize: "0.85rem",
                            padding: "3px 22px 3px 6px",
                            border: "1px solid #ddd",
                            borderRadius: 6,
                            textAlign: c.type === "number" ? "right" : "left",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                          type="text"
                          placeholder="Filter"
                          value={val}
                          onChange={(e) =>
                            setLocalInputs((prev) => ({
                              ...prev,
                              [c.accessor]: e.target.value,
                            }))
                          }
                          aria-label={`Filter ${c.header}`}
                        />
                        {val && (
                          <ClearBtn
                            type="button"
                            aria-label={`Clear filter for ${c.header}`}
                            title={`Clear filter for ${c.header}`}
                            onClick={() =>
                              setLocalInputs((prev) => ({
                                ...prev,
                                [c.accessor]: "",
                              }))
                            }
                          >
                            ×
                          </ClearBtn>
                        )}
                      </FilterInputWrap>
                    </FilterRowCell>
                  );
                }

                return (
                  <FilterRowCell key={`f-${c.accessor}`} style={getColumnWidthStyle(idx)} />
                );
              })}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, rIdx) => {
              const id = row[rowIdAccessor];
              const isClickable = Boolean(row[clickableAccessor]);
              const isSelected = selectedIds.has(id);

              return (
                <Tr key={id ?? rIdx} $index={rIdx}>
                  <Td onClick={(e) => e.stopPropagation()} style={{ width: 75 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!isClickable}
                      onChange={() => {
                        if (!isClickable) return;
                        onToggleSelect(id, !isSelected);
                      }}
                      aria-label={`Select row ${String(id)}`}
                    />
                  </Td>

                  {columns.map((c, i) => (
                    <Td
                      key={c.accessor}
                      $numeric={c.type === "number"}
                      data-col={i}
                      style={getColumnWidthStyle(i)}
                      onClick={() => {
                        if (!isClickable) return;
                        onToggleSelect(id, !isSelected);
                      }}
                    >
                      <CellInner>{row[c.accessor]}</CellInner>
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </tbody>
        </StyledTable>
      </ScrollX>
    </TablePane>
  );
}