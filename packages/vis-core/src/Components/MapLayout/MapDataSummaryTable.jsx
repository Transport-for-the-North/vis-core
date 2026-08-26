import React, { useCallback, useMemo, useState } from "react";
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
  cursor: pointer;
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

const HIDDEN_COLUMNS = new Set(["geometry", "geom", "coordinates"]);

const DATABASE_COLUMNS = [
  {
    key: "linkId",
    label: "Link ID",
    aliases: ["link_id", "linkid", "linkId", "identifier", "name", "Name", "id", "ID"],
    fallbackAliases: ["name", "Name"],
  },
  {
    key: "passengers",
    label: "Passengers",
    aliases: ["passengers", "passenger", "total_passengers", "pax"],
    metricAliases: ["passenger", "passengers", "pax"],
  },
  {
    key: "totalSeatCapacity",
    label: "Total Seat Capacity",
    aliases: ["total_seat_capacity", "seat_capacity", "seated_capacity", "total_seats"],
    metricAliases: ["seat capacity", "total seat", "seated capacity", "seats"],
  },
  {
    key: "totalCrushCapacity",
    label: "Total Crush Capacity",
    aliases: ["total_crush_capacity", "crush_capacity", "standing_capacity", "total_capacity"],
    metricAliases: ["crush capacity", "standing capacity", "total crush", "total capacity"],
  },
  {
    key: "totalSeatLoadDensityFactor",
    label: "Total Seat Load Density Factor",
    aliases: ["total_seat_load_density_factor", "seat_load_density_factor", "seat_load_factor"],
    metricAliases: ["seat load density", "seat load factor", "seated load"],
  },
  {
    key: "totalCrushLoadDensityFactor",
    label: "Total Crush Load Density Factor",
    aliases: ["total_crush_load_density_factor", "crush_load_density_factor", "crush_load_factor"],
    metricAliases: ["crush load density", "crush load factor", "standing load", "total crush load factor"],
  },
  {
    key: "trainsPerHour",
    label: "Trains per Hour",
    aliases: ["trains_per_hour", "tph", "trainsph", "train_per_hour"],
    metricAliases: ["trains per hour", "tph"],
  },
  {
    key: "passengersOverSeatingCapacity",
    label: "Passengers Over Seating Capacity",
    aliases: ["passengers_over_seating_capacity", "passengers_over_seat_capacity", "over_seating_capacity"],
    metricAliases: ["passengers over seating capacity"],
  },
  {
    key: "excessSeating",
    label: "Excess Seating",
    aliases: ["excess_seating"],
    metricAliases: ["excess seating"],
  },
];

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

function coerceSortValue(value) {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const maybeNum = Number(value);
  if (Number.isFinite(maybeNum) && String(value).trim() !== "") return maybeNum;
  return String(value);
}

function normaliseText(value) {
  return String(value ?? "").toLowerCase().replace(/[_-]+/g, " ").trim();
}

function flattenRow(row) {
  if (!row || typeof row !== "object") return row;

  const merged = { ...row };
  [row.properties, row.attributes, row.data].forEach((nested) => {
    if (!nested || typeof nested !== "object" || Array.isArray(nested)) return;
    Object.entries(nested).forEach(([key, value]) => {
      if (merged[key] == null && (typeof value !== "object" || value === null)) {
        merged[key] = value;
      }
    });
  });

  return merged;
}

function pickValueFromAliases(row, aliases) {
  if (!row || !Array.isArray(aliases)) return null;

  const rowKeyMap = new Map(
    Object.keys(row)
      .filter((key) => !key.startsWith("__") && !HIDDEN_COLUMNS.has(key))
      .map((key) => [normaliseText(key), key])
  );

  for (const alias of aliases) {
    const key = rowKeyMap.get(normaliseText(alias));
    if (key && row[key] != null && String(row[key]).trim() !== "") {
      return row[key];
    }
  }

  return null;
}

function normaliseCompositeLinkValue(value) {
  const text = String(value ?? "").trim();
  const match = text.match(/^(\d+)\s*[_-]\s*(\d+)$/);
  if (!match) return null;
  return `${match[1]}_${match[2]}`;
}

function getValueByNormalisedKey(row, targetKey) {
  if (!row || !targetKey) return null;
  const wanted = normaliseText(targetKey);
  const entry = Object.entries(row).find(([key]) => normaliseText(key) === wanted);
  return entry ? entry[1] : null;
}

function deriveCompositeFromNodePair(row) {
  const nodePairs = [
    ["from_node", "to_node"],
    ["fromnode", "tonode"],
    ["a_node", "b_node"],
    ["anode", "bnode"],
    ["i_node", "j_node"],
    ["inode", "jnode"],
    ["from", "to"],
    ["from_id", "to_id"],
    ["fromid", "toid"],
  ];

  for (const [leftKey, rightKey] of nodePairs) {
    const left = getValueByNormalisedKey(row, leftKey);
    const right = getValueByNormalisedKey(row, rightKey);
    if (left == null || right == null) continue;

    const leftNum = Number(left);
    const rightNum = Number(right);
    if (!Number.isFinite(leftNum) || !Number.isFinite(rightNum)) continue;

    return `${Math.trunc(leftNum)}_${Math.trunc(rightNum)}`;
  }

  return null;
}

function pickLinkId(row) {
  const aliasCandidates = DATABASE_COLUMNS[0].aliases
    .map((alias) => pickValueFromAliases(row, [alias]))
    .filter((value) => value != null && String(value).trim() !== "")
    .map((value) => String(value).trim());

  const compositeAlias = aliasCandidates
    .map((value) => normaliseCompositeLinkValue(value))
    .find(Boolean);
  if (compositeAlias) return compositeAlias;

  const compositeFromNodes = deriveCompositeFromNodePair(row);
  if (compositeFromNodes) return compositeFromNodes;

  const compositeFromAnyField = Object.entries(row || {})
    .filter(([key]) => !key.startsWith("__") && !HIDDEN_COLUMNS.has(key))
    .map(([key, value]) => {
      const keyLooksRelevant = /(link|arc|name|id|identifier)/i.test(key);
      if (!keyLooksRelevant) return null;
      return normaliseCompositeLinkValue(value);
    })
    .find(Boolean);
  if (compositeFromAnyField) return compositeFromAnyField;

  if (aliasCandidates.length === 0) {
    const fallback = pickValueFromAliases(row, DATABASE_COLUMNS[0].fallbackAliases || []);
    return fallback == null ? null : String(fallback).trim();
  }

  const textLike = aliasCandidates.find((value) => !/^\d+$/.test(value));
  if (textLike) return textLike;

  return aliasCandidates[0];
}

function resolveMetricColumn(metricLabel) {
  const normalised = normaliseText(metricLabel);
  if (!normalised) return null;

  return DATABASE_COLUMNS.find((column) =>
    (column.metricAliases || []).some((alias) => normalised.includes(normaliseText(alias)))
  );
}

function extractCoordinatesFromRow(row) {
  if (!row || typeof row !== "object") return null;

  const lng = row.lng ?? row.lon ?? row.longitude ?? row.x ?? row.center_lng ?? row.centre_lng;
  const lat = row.lat ?? row.latitude ?? row.y ?? row.center_lat ?? row.centre_lat;
  if (Number.isFinite(Number(lng)) && Number.isFinite(Number(lat))) {
    return [Number(lng), Number(lat)];
  }

  if (row.geometry?.coordinates) {
    return normaliseCoordinates(row.geometry);
  }

  return null;
}

function isEquivalentId(left, right) {
  const leftText = String(left ?? "").trim();
  const rightText = String(right ?? "").trim();
  if (!leftText || !rightText) return false;
  if (leftText === rightText) return true;

  const leftNum = Number(leftText);
  const rightNum = Number(rightText);
  if (Number.isFinite(leftNum) && Number.isFinite(rightNum)) {
    return leftNum === rightNum;
  }

  return leftText.toLowerCase() === rightText.toLowerCase();
}

export function MapDataSummaryTable({
  map,
  layers,
  filters,
  visualisations,
  tableDataVisualisation,
  valueField,
  maxRows = 0,
  focusZoom = 11,
  debug = false,
  joinIdField,
  mapJoinIdFields,
  canonicalLinkIdField = "id",
  strictIdMapping = false,
}) {
  const [sortBy, setSortBy] = useState("linkId");
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

  const sourceEntries = useMemo(() => {
    if (!tableDataVisualisation) return mapVisualisationEntries;

    return mapVisualisationEntries.filter(([name]) => name === tableDataVisualisation);
  }, [mapVisualisationEntries, tableDataVisualisation]);

  const sourceRows = useMemo(() => {
    const merged = [];

    sourceEntries.forEach(([name, visualisation]) => {
      const dataRows = Array.isArray(visualisation?.data) ? visualisation.data : [];
      const metricLabel =
        visualisation?.legendText?.[0]?.displayValue ||
        visualisation?.legendText?.[0]?.legendSubtitleText ||
        visualisation?.valueField ||
        name;

      dataRows.forEach((row, index) => {
        if (!row || typeof row !== "object") return;
        const flattened = flattenRow(row);
        merged.push({
          __rowId: `${name}:${flattened.id ?? flattened.name ?? index}`,
          __visualisationName: name,
          __joinLayer: visualisation?.joinLayer ?? null,
          __metricLabel: metricLabel,
          ...flattened,
        });
      });
    });

    return merged;
  }, [sourceEntries]);

  const configuredMapJoinFields = useMemo(() => {
    if (Array.isArray(mapJoinIdFields)) {
      return mapJoinIdFields.filter((field) => typeof field === "string" && field.trim() !== "");
    }
    if (typeof mapJoinIdFields === "string" && mapJoinIdFields.trim() !== "") {
      return [mapJoinIdFields.trim()];
    }
    return [];
  }, [mapJoinIdFields]);

  const getValueByConfiguredField = useCallback((obj, fieldName) => {
    if (!obj || !fieldName) return null;

    if (fieldName === "__featureId") {
      return obj?.id ?? null;
    }

    if (obj[fieldName] != null && String(obj[fieldName]).trim() !== "") {
      return obj[fieldName];
    }

    const match = Object.entries(obj).find(([key, value]) => {
      if (normaliseText(key) !== normaliseText(fieldName)) return false;
      return value != null && String(value).trim() !== "";
    });

    return match ? match[1] : null;
  }, []);

  const popupLookup = useMemo(() => {
    if (!map) return { global: new Map(), scoped: new Map() };

    const rendered = targetLayerIds.length > 0
      ? map.queryRenderedFeatures({ layers: targetLayerIds }) || []
      : map.queryRenderedFeatures() || [];

    const globalLookup = new Map();
    const scopedLookup = new Map();
    rendered.forEach((feature) => {
      const popupId =
        getValueByConfiguredField(feature?.properties || {}, canonicalLinkIdField) ??
        (!strictIdMapping ? feature?.properties?.id ?? feature?.id : null);
      if (popupId == null || String(popupId).trim() === "") return;

      const featureLayerId = feature?.layer?.id;

      const configuredJoinCandidates = configuredMapJoinFields
        .map((fieldName) => getValueByConfiguredField(feature, fieldName))
        .filter((value) => value != null)
        .map((value) => String(value));

      const joinCandidates = configuredJoinCandidates.length > 0 || strictIdMapping
        ? configuredJoinCandidates
        : [
            feature?.id,
            feature?.properties?.id,
            feature?.properties?.ID,
            feature?.properties?.link_id,
            feature?.properties?.linkId,
            feature?.properties?.linkid,
            feature?.properties?.identifier,
          ]
            .filter((value) => value != null)
            .map((value) => String(value));

      joinCandidates.forEach((candidate) => {
        if (!globalLookup.has(candidate)) {
          globalLookup.set(candidate, String(popupId));
        }

        if (featureLayerId) {
          const scopedKey = `${featureLayerId}::${candidate}`;
          if (!scopedLookup.has(scopedKey)) {
            scopedLookup.set(scopedKey, String(popupId));
          }
        }
      });
    });

    return { global: globalLookup, scoped: scopedLookup };
  }, [
    canonicalLinkIdField,
    configuredMapJoinFields,
    getValueByConfiguredField,
    map,
    strictIdMapping,
    targetLayerIds,
  ]);

  const databaseRows = useMemo(() => {
    const rowMap = new Map();

    sourceRows.forEach((sourceRow) => {
      const configuredJoinId = joinIdField
        ? getValueByConfiguredField(sourceRow, joinIdField)
        : null;
      const joinIdCandidate = configuredJoinId ?? sourceRow.id ?? sourceRow.ID;
      const linkId = pickLinkId(sourceRow);
      if (
        (joinIdCandidate == null || String(joinIdCandidate).trim() === "") &&
        (linkId == null || String(linkId).trim() === "")
      ) {
        return;
      }

      const key = joinIdCandidate != null && String(joinIdCandidate).trim() !== ""
        ? `join:${String(joinIdCandidate)}`
        : `link:${String(linkId)}`;

      if (!rowMap.has(key)) {
        rowMap.set(key, {
          __rowId: sourceRow.__rowId,
          __mapJoinId: joinIdCandidate ?? null,
          __mapJoinIds: [],
          __mapLayerIds: sourceRow.__joinLayer ? [String(sourceRow.__joinLayer)] : [],
          __configuredJoinId: configuredJoinId ?? null,
          __sourceLinkId: linkId,
          __debugPopupIdByJoin: null,
          __zoomMatchSource: null,
          linkId,
          passengers: null,
          totalSeatCapacity: null,
          totalCrushCapacity: null,
          totalSeatLoadDensityFactor: null,
          totalCrushLoadDensityFactor: null,
          trainsPerHour: null,
          passengersOverSeatingCapacity: null,
          excessSeating: null,
          ...sourceRow,
        });
      }

      const target = rowMap.get(key);

      if (target.__configuredJoinId == null && configuredJoinId != null) {
        target.__configuredJoinId = configuredJoinId;
      }

      if (
        target.__mapJoinId == null &&
        (configuredJoinId != null || sourceRow.id != null || sourceRow.ID != null)
      ) {
        target.__mapJoinId = configuredJoinId ?? sourceRow.id ?? sourceRow.ID;
      }

      if (joinIdCandidate != null) {
        const joinIdText = String(joinIdCandidate);
        if (!target.__mapJoinIds.includes(joinIdText)) {
          target.__mapJoinIds.push(joinIdText);
        }
      }

      if (sourceRow.__joinLayer != null) {
        const layerText = String(sourceRow.__joinLayer);
        if (!target.__mapLayerIds.includes(layerText)) {
          target.__mapLayerIds.push(layerText);
        }
      }

      DATABASE_COLUMNS.slice(1).forEach((column) => {
        const value = pickValueFromAliases(sourceRow, column.aliases);
        if (value != null && String(value).trim() !== "") {
          target[column.key] = value;
        }
      });

      const metricColumn = resolveMetricColumn(
        sourceRow.metric_name || sourceRow.metric || sourceRow.indicator || sourceRow.__metricLabel
      );
      const fallbackValue =
        (valueField && sourceRow[valueField] != null ? sourceRow[valueField] : null) ??
        sourceRow.value;

      if (
        metricColumn &&
        fallbackValue != null &&
        String(fallbackValue).trim() !== "" &&
        (target[metricColumn.key] == null || String(target[metricColumn.key]).trim() === "")
      ) {
        target[metricColumn.key] = fallbackValue;
      }
    });

    const rows = Array.from(rowMap.values());

    rows.forEach((row) => {
      const joinCandidates = [
        ...(Array.isArray(row.__mapJoinIds) ? row.__mapJoinIds : []),
        row.__mapJoinId,
      ]
        .filter((value) => value != null)
        .map((value) => String(value));

      const layerCandidates = Array.isArray(row.__mapLayerIds)
        ? row.__mapLayerIds.map((value) => String(value))
        : [];

      let matchedPopupId = null;

      for (const layerId of layerCandidates) {
        for (const joinId of joinCandidates) {
          const scoped = popupLookup.scoped.get(`${layerId}::${joinId}`);
          if (scoped != null && String(scoped).trim() !== "") {
            matchedPopupId = scoped;
            break;
          }
        }
        if (matchedPopupId) break;
      }

      if (!matchedPopupId) {
        matchedPopupId = joinCandidates
          .map((joinId) => popupLookup.global.get(joinId))
          .find((value) => value != null && String(value).trim() !== "");
      }

      row.__debugPopupIdByJoin = matchedPopupId ?? null;

      if (matchedPopupId) {
        row.linkId = matchedPopupId;
      }
    });

    if (maxRows > 0) return rows.slice(0, maxRows);
    return rows;
  }, [
    getValueByConfiguredField,
    joinIdField,
    maxRows,
    popupLookup,
    sourceRows,
    valueField,
  ]);

  const sortedRows = useMemo(() => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    const copy = [...databaseRows];

    copy.sort((a, b) => {
      const left = coerceSortValue(a[sortBy]);
      const right = coerceSortValue(b[sortBy]);

      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;

      if (typeof left === "number" && typeof right === "number") {
        return (left - right) * multiplier;
      }

      return (
        String(left).localeCompare(String(right), undefined, {
          numeric: true,
          sensitivity: "base",
        }) * multiplier
      );
    });

    return copy;
  }, [databaseRows, sortBy, sortDirection]);

  const setSortColumn = (column) => {
    if (sortBy === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }
    setSortBy(column);
    setSortDirection(column === "passengers" ? "desc" : "asc");
  };

  const findFeatureCoordinates = useCallback(
    (row) => {
      if (!map || !row) return null;

      const primaryKeyCandidates = [
        ...(Array.isArray(row.__mapJoinIds) ? row.__mapJoinIds : []),
        row.__configuredJoinId,
        row.__mapJoinId,
      ];

      const fallbackKeyCandidates = [
        row.linkId,
        row.link_id,
        row.linkid,
        row.id,
        row.ID,
        row.identifier,
        row.name,
        row.Name,
      ];

      const keyCandidates = [
        ...primaryKeyCandidates,
        ...(strictIdMapping ? [] : fallbackKeyCandidates),
      ]
        .filter((value) => value != null)
        .map((value) => String(value));

      if (keyCandidates.length === 0) return null;

      const collectCandidateValues = (feature) => {
        const props = feature?.properties || {};
        const configuredValues = configuredMapJoinFields
          .map((fieldName) => getValueByConfiguredField(feature, fieldName))
          .filter((value) => value != null)
          .map((value) => String(value));

        if (configuredValues.length > 0 || strictIdMapping) {
          return configuredValues;
        }

        const propertyKeys = [
          "id",
          "ID",
          "link_id",
          "linkId",
          "linkid",
          "identifier",
          "name",
          "Name",
          "arc_id",
          "arcid",
        ];

        return [feature?.id, ...propertyKeys.map((key) => props[key])]
          .filter((value) => value != null)
          .map((value) => String(value));
      };

      const matchesFeature = (feature) => {
        const candidateValues = collectCandidateValues(feature);
        return candidateValues.some((candidate) =>
          keyCandidates.some((keyCandidate) => isEquivalentId(candidate, keyCandidate))
        );
      };

      const renderedInTargetLayers = targetLayerIds.length > 0
        ? map.queryRenderedFeatures({ layers: targetLayerIds }) || []
        : [];

      let match = renderedInTargetLayers.find(matchesFeature);
      let matchSource = match ? "rendered:targetLayers" : null;
      if (!match) {
        const renderedEverywhere = map.queryRenderedFeatures() || [];
        match = renderedEverywhere.find(matchesFeature);
        if (match) {
          matchSource = "rendered:anyLayer";
        }
      }

      if (!match) {
        const sourceLayerIds = targetLayerIds.length > 0
          ? targetLayerIds
          : Object.keys(layers || {});

        for (const layerId of sourceLayerIds) {
          const mapLayerConfig = layers?.[layerId];
          const sourceLayerName = mapLayerConfig?.sourceLayer;

          try {
            const sourceFeatures = sourceLayerName
              ? map.querySourceFeatures(layerId, { sourceLayer: sourceLayerName }) || []
              : map.querySourceFeatures(layerId) || [];

            match = sourceFeatures.find(matchesFeature);
            if (match) {
              matchSource = `source:${layerId}`;
              break;
            }
          } catch {
            // Ignore unsupported source-feature queries for this layer.
          }
        }
      }

      if (row && typeof row === "object") {
        row.__zoomMatchSource = matchSource;
      }

      return match ? normaliseCoordinates(match.geometry) : null;
    },
    [configuredMapJoinFields, getValueByConfiguredField, layers, map, strictIdMapping, targetLayerIds]
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

  const visibleColumns = useMemo(() => {
    if (!debug) return DATABASE_COLUMNS;

    return [
      ...DATABASE_COLUMNS,
      { key: "__sourceLinkId", label: "Debug Source Link ID" },
      { key: "__configuredJoinId", label: "Debug Configured Join ID" },
      { key: "__mapJoinId", label: "Debug Join ID" },
      { key: "__mapJoinIds", label: "Debug Join IDs" },
      { key: "__debugPopupIdByJoin", label: "Debug Popup ID by Join" },
      { key: "__zoomMatchSource", label: "Debug Zoom Match Source" },
    ];
  }, [debug]);

  return (
    <TablePanel aria-label="Map data summary">
      <PanelHeader>
        <span>Link Database View</span>
        <span>{sortedRows.length} rows</span>
      </PanelHeader>

      <ScrollArea>
        {sortedRows.length === 0 ? (
          <EmptyState>No link-level data is available for this page.</EmptyState>
        ) : (
          <SummaryTable>
            <thead>
              <tr>
                {visibleColumns.map((column) => (
                  <Th key={column.key}>
                    <ThButton type="button" onClick={() => setSortColumn(column.key)}>
                      {column.label}
                      {sortMarker(column.key)}
                    </ThButton>
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row) => (
                <Tr
                  key={row.__rowId}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleFocusRow(row)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleFocusRow(row);
                    }
                  }}
                >
                  {visibleColumns.map((column, index) => {
                    const value = row[column.key];
                    const displayValue =
                      Array.isArray(value)
                        ? value.join(", ")
                        : value == null || String(value).trim() === ""
                          ? "-"
                          : String(value);

                    if (index === 0) {
                      return (
                        <Td key={`${row.__rowId}:${column.key}`}>
                          <RowButton
                            type="button"
                            title="Focus map on this link"
                          >
                            {displayValue}
                          </RowButton>
                        </Td>
                      );
                    }

                    return <Td key={`${row.__rowId}:${column.key}`}>{displayValue}</Td>;
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
