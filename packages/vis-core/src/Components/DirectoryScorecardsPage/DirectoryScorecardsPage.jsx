import React, { useContext, useEffect, useMemo, useState } from "react";
import { PageContext } from "contexts";
import { useMetadataDrivenFilters } from "hooks/useMetadataDrivenFilters";
import { DataTable } from "Components/DataTable";
import { Scorecard } from "Components/Scorecard";
import { TopFilters } from "./TopFilters";
import { api } from "services";
import { applyTopFilterScoping } from "utils/applyTopFilterScoping";

import {
  DetailsGrid,
  LeftPane,
  Page,
  RightPane,
  Tag,
  TileBody,
  Title,
  Toolbar,
  TwoPane,
} from "./DirectoryScorecardsPage.styles";

import { AppButton } from "Components/AppButton";

/**
 * Config-driven page that renders:
 * - Top filters (metadata-driven)
 * - Records table with selection
 * - Per-selected-record scorecards with details fetched on demand
 */
export function DirectoryScorecardsPage() {
  const pageContext = useContext(PageContext);
  const { pageName, config } = pageContext;

  const { filters, filterState, onFilterChange, isReady } = useMetadataDrivenFilters();

  const [records, setRecords] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingList(true);
      try {
        const rows = await api.endpointDefinitionClient.fetchList(
          config.recordsEndpoint,
          filters,
          filterState
        );
        if (!cancelled) setRecords(rows);
      } finally {
        if (!cancelled) setIsLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [config.recordsEndpoint, filters, filterState]);

  const scopedRows = useMemo(
    () => applyTopFilterScoping(records, filters, filterState, isReady),
    [records, filters, filterState, isReady]
  );

  const idAccessor = config.selection?.rowIdAccessor || "id";
  const titleAccessor = config.selection?.titleAccessor || idAccessor;
  const clickableAccessor =
    config.selection?.clickableAccessor ||
    config.clickBehavior?.clickableAccessor ||
    "hasDetailedData";

  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const onToggleSelect = (id, nextSelected) => {
    const row = scopedRows.find((r) => r[idAccessor] === id);
    if (!row || !row[clickableAccessor]) return;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (nextSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const clearSelected = () => setSelectedIds(new Set());

  const [detailsCache, setDetailsCache] = useState({});

  useEffect(() => {
    let cancelled = false;

    const ids = Array.from(selectedIds);
    const missing = ids.filter((id) => !detailsCache[id]);
    if (missing.length === 0) return;

    (async () => {
      try {
        const results = await Promise.all(
          missing.map(async (id) => {
            const payload = await api.endpointDefinitionClient.fetchDetails(
              config.recordDetailsEndpoint,
              {
                idParamName: config.selection?.rowIdQueryParam || "run_id",
                idValue: id,
              }
            );
            return { id, payload };
          })
        );

        if (cancelled) return;

        setDetailsCache((prev) => {
          const next = { ...prev };
          results.forEach(({ id, payload }) => {
            next[id] = payload;
          });
          return next;
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("DirectoryScorecardsPage: failed to load record details:", e);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds, config.recordDetailsEndpoint, config.selection?.rowIdQueryParam]);

  const formatterRegistry = useMemo(() => config.formatters || {}, [config.formatters]);
  const panelsTemplate = useMemo(() => config.panels || [], [config.panels]);

  const rowsWithPanels = useMemo(
    () => scopedRows.map((r) => ({ ...r, panels: panelsTemplate })),
    [scopedRows, panelsTemplate]
  );

  return (
    <Page>
      <Title>{pageName}</Title>

      <TopFilters filters={filters} onFilterChange={onFilterChange} />

      <TwoPane>
        <LeftPane>
          <TileBody>
            <Toolbar>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                <Tag>Rows: {rowsWithPanels.length}</Tag>
                <Tag>Selected: {selectedIds.size}</Tag>
                {isLoadingList ? <Tag>Loading…</Tag> : null}
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <AppButton 
                  disabled={selectedIds.size === 0}
                  onClick={clearSelected}
                >
                  Clear Selected
                </AppButton>
              </div>
            </Toolbar>

            <DataTable
              caption="Directory records"
              columns={config.columns || []}
              data={rowsWithPanels}
              clickableAccessor={clickableAccessor}
              onToggleSelect={onToggleSelect}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              rowIdAccessor={idAccessor}
              storageKey="directoryScorecards.columnWidths"
            />
          </TileBody>
        </LeftPane>

        <RightPane>
          <TileBody>
            <h3 style={{ margin: 0, fontSize: "0.95rem", textAlign: "left" }}>Selected Records</h3>

            {selectedIds.size === 0 ? (
              <div style={{ marginTop: 6 }}>
                <Tag>No records selected</Tag>
              </div>
            ) : (
              <DetailsGrid>
                {Array.from(selectedIds)
                  .map((id) => rowsWithPanels.find((r) => r[idAccessor] === id))
                  .filter(Boolean)
                  .map((record) => {
                    const recordId = record[idAccessor];

                    return (
                      <Scorecard
                        key={recordId}
                        record={record}
                        details={detailsCache[recordId]}
                        idAccessor={idAccessor}
                        titleAccessor={titleAccessor}
                        formatterRegistry={formatterRegistry}
                        onRemove={(remId) => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev);
                            next.delete(remId);
                            return next;
                          });

                          setDetailsCache((prev) => {
                            const next = { ...prev };
                            delete next[remId];
                            return next;
                          });
                        }}
                      />
                    );
                  })}
              </DetailsGrid>
            )}
          </TileBody>
        </RightPane>
      </TwoPane>
    </Page>
  );
}