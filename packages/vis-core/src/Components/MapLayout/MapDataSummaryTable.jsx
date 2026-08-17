import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

const TablePanel = styled.section`
  border-top: 1px solid #d5dbe6;
  background: #f8fafc;
  height: 230px;
  min-height: 180px;
  max-height: 35vh;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 12px;
  color: #1f2937;
  background: #eef2f7;
  border-bottom: 1px solid #d5dbe6;
`;

const ScrollArea = styled.div`
  overflow: auto;
  flex: 1;
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  table-layout: auto;
`;

const ThButton = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: #0f172a;
  text-align: left;
  padding: 8px;
  cursor: pointer;
`;

const Th = styled.th`
  position: sticky;
  top: 0;
  z-index: 1;
  background: #e5ebf4;
  border-bottom: 1px solid #c8d2e1;
  white-space: nowrap;
`;

const Tr = styled.tr`
  border-bottom: 1px solid #e3e8f0;
  &:hover {
    background: #edf3ff;
  }
`;

const Td = styled.td`
  padding: 7px 8px;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RowButton = styled.button`
  width: 100%;
  border: 0;
  background: transparent;
  text-align: left;
  padding: 0;
  margin: 0;
  cursor: pointer;
  color: inherit;
  font: inherit;
`;

const EmptyState = styled.div`
  padding: 12px;
  font-size: 12px;
  color: #6b7280;
`;

const FilterSummaryWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid #d5dbe6;
  background: #f1f5fb;
`;

const FilterTag = styled.div`
  border: 1px solid #d0dbeb;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  color: #1f2937;
  background: #ffffff;
`;

function normaliseCoordinates(geometry) {
  if (!geometry || !geometry.type) return null;

  const coords = [];

  const walk = (node) => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number" && typeof node[1] === "number") {
      coords.push(node);
      return;
    }
    node.forEach(walk);
  };

  walk(geometry.coordinates);
  if (coords.length === 0) return null;

  let minLng = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  coords.forEach(([lng, lat]) => {
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  });

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) return null;

  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

const HIDDEN_COLUMNS = new Set(["geometry", "geom", "coordinates"]);

function titleCase(value) {
  const text = String(value ?? "").replace(/[_-]+/g, " ").trim();
  if (!text) return "(unnamed)";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function coerceSortValue(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const maybeNum = Number(value);
  if (Number.isFinite(maybeNum) && String(value).trim() !== "") return maybeNum;
  return String(value);
}

function extractCoordinatesFromRow(row) {
  if (!row || typeof row !== "object") return null;

  const lng = row.lng ?? row.lon ?? row.longitude ?? row.x;
  const lat = row.lat ?? row.latitude ?? row.y;
  if (Number.isFinite(Number(lng)) && Number.isFinite(Number(lat))) {
    return [Number(lng), Number(lat)];
  }

  if (row.geometry?.coordinates) {
    return normaliseCoordinates(row.geometry);
  }

  return null;
}

export function MapDataSummaryTable({
  map,
  layers,
  filters,
  filterState,
  visualisations,
  maxRows = 120,
  maxColumns = 8,
  focusZoom = 11,
}) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const targetLayerIds = useMemo(() => {
    if (!map) return [];

    const mapFilterLayers = (filters || [])
      .filter((filter) => filter?.type === "map")
      .map((filter) => filter.layer)
      .filter((layerId) => layerId && map.getLayer(layerId));

    if (mapFilterLayers.length > 0) {
      return mapFilterLayers;
    }

    return Object.keys(layers || {}).filter((layerId) => map.getLayer(layerId));
  }, [filters, layers, map]);

  const mapVisualisationEntries = useMemo(
    () =>
      Object.entries(visualisations || {}).filter(([, visualisation]) => {
        const type = visualisation?.type;
        return type === "joinDataToMap" || type === "geojson";
      }),
    [visualisations]
  );

  const rows = useMemo(() => {
    const merged = [];

    mapVisualisationEntries.forEach(([name, visualisation]) => {
      const dataRows = Array.isArray(visualisation?.data) ? visualisation.data : [];
      dataRows.forEach((row, index) => {
        if (!row || typeof row !== "object") return;
        merged.push({
          __rowId: `${name}:${row.id ?? row.name ?? index}`,
          __visualisationName: name,
          ...row,
        });
      });
    });

    return merged.slice(0, maxRows);
  }, [mapVisualisationEntries, maxRows]);

  const columns = useMemo(() => {
    const priority = ["name", "id", "value"];
    const keySet = new Set();

    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (!key.startsWith("__") && !HIDDEN_COLUMNS.has(key)) {
          keySet.add(key);
        }
      });
    });

    const allKeys = Array.from(keySet);
    const prioritized = priority.filter((key) => keySet.has(key));
    const remaining = allKeys
      .filter((key) => !priority.includes(key))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    return [...prioritized, ...remaining].slice(0, maxColumns);
  }, [rows, maxColumns]);

  useEffect(() => {
    if (!sortBy && columns.length > 0) {
      setSortBy(columns[0]);
      setSortDirection(columns[0] === "value" ? "desc" : "asc");
    }
    if (sortBy && columns.length > 0 && !columns.includes(sortBy)) {
      setSortBy(columns[0]);
      setSortDirection(columns[0] === "value" ? "desc" : "asc");
    }
  }, [columns, sortBy]);

  const sortedRows = useMemo(() => {
    if (!sortBy) return rows;

    const multiplier = sortDirection === "asc" ? 1 : -1;
    const copy = [...rows];

    copy.sort((a, b) => {
      const left = coerceSortValue(a[sortBy]);
      const right = coerceSortValue(b[sortBy]);

      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * multiplier;
      }

      return String(left).localeCompare(String(right), undefined, {
        numeric: true,
        sensitivity: "base",
      }) * multiplier;
    });

    return copy;
  }, [rows, sortBy, sortDirection]);

  const setSortColumn = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(column);
    setSortDirection(column === "value" ? "desc" : "asc");
  };

  const findFeatureCoordinates = useCallback(
    (row) => {
      if (!map || !row || targetLayerIds.length === 0) return null;

      const keyCandidates = [row.id, row.ID, row.identifier, row.name, row.Name]
        .filter((value) => value != null)
        .map((value) => String(value));

      if (keyCandidates.length === 0) return null;

      const rendered = map.queryRenderedFeatures({ layers: targetLayerIds }) || [];
      const match = rendered.find((feature) => {
        const candidateValues = [
          feature?.id,
          feature?.properties?.id,
          feature?.properties?.ID,
          feature?.properties?.name,
          feature?.properties?.Name,
        ]
          .filter((value) => value != null)
          .map((value) => String(value));

        return candidateValues.some((value) => keyCandidates.includes(value));
      });

      return match ? normaliseCoordinates(match.geometry) : null;
    },
    [map, targetLayerIds]
  );

  const handleFocusRow = useCallback(
    (row) => {
      if (!map) return;

      const directCoords = extractCoordinatesFromRow(row);
      const featureCoords = directCoords ?? findFeatureCoordinates(row);
      if (!featureCoords) return;

      map.flyTo({
        center: featureCoords,
        zoom: Math.max(map.getZoom(), focusZoom),
        essential: true,
      });
    },
    [focusZoom, findFeatureCoordinates, map]
  );

  const sortMarker = (column) => {
    if (sortBy !== column) return "";
    return sortDirection === "asc" ? " \u2191" : " \u2193";
  };

  const selectedFilterSummaries = useMemo(() => {
    return (filters || [])
      .filter((filter) => filterState?.[filter.id] != null)
      .map((filter) => {
        const rawValue = filterState[filter.id];
        const asArray = Array.isArray(rawValue) ? rawValue : [rawValue];
        const displayValues = asArray.map((value) => {
          const mapped = filter.values?.values?.find((item) => item.paramValue === value);
          return mapped?.displayValue ?? String(value);
        });
        return {
          label: filter.filterName || filter.paramName || "Filter",
          value: displayValues.join(", "),
        };
      });
  }, [filters, filterState]);

  return (
    <TablePanel aria-label="Map data summary">
      <PanelHeader>
        <span>Filter Data Table</span>
        <span>{sortedRows.length} rows</span>
      </PanelHeader>

      {selectedFilterSummaries.length > 0 && (
        <FilterSummaryWrap>
          {selectedFilterSummaries.map((entry) => (
            <FilterTag key={`${entry.label}:${entry.value}`}>
              {entry.label}: {entry.value}
            </FilterTag>
          ))}
        </FilterSummaryWrap>
      )}

      <ScrollArea>
        {sortedRows.length === 0 ? (
          <EmptyState>Select filters to load data for this map page.</EmptyState>
        ) : (
          <SummaryTable>
            <thead>
              <tr>
                {columns.map((column) => (
                  <Th key={column}>
                    <ThButton type="button" onClick={() => setSortColumn(column)}>
                      {titleCase(column)}{sortMarker(column)}
                    </ThButton>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <Tr key={row.__rowId}>
                  {columns.map((column, index) => {
                    const value = row[column];
                    const displayValue = value == null ? "-" : String(value);

                    if (index === 0) {
                      return (
                        <Td key={`${row.__rowId}:${column}`}>
                          <RowButton
                            type="button"
                            onClick={() => handleFocusRow(row)}
                            title="Focus map on this record"
                          >
                            {displayValue}
                          </RowButton>
                        </Td>
                      );
                    }

                    return <Td key={`${row.__rowId}:${column}`}>{displayValue}</Td>;
                  })}
                </Tr>
              ))}
            </tbody>
          </SummaryTable>
        )}
      </ScrollArea>
    </TablePanel>
  );
}
