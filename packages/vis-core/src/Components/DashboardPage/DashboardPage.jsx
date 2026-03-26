import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { ChartRenderer, WarningBox, Dimmer } from "Components";
import { AppContext, PageContext } from "contexts";
import { useFetchVisualisationData } from "hooks";
import { useFilterContext } from "hooks";
import { api } from "services";
import {
  applyWhereConditions,
  buildDeterministicFilterId,
  checkSecurityRequirements,
  sortValues,
  updateFilterValidity,
} from "utils";
import { DashboardSidebar } from "./DashboardSidebar";

const LayoutContainer = styled.div`
  min-height: calc(100vh - 75px);
  background: #f8f9fa;
  padding: 10px;
  display: flex;
  gap: 16px;
  align-items: flex-start;

  @media ${(props) => props.theme.mq.mobile} {
    flex-direction: column;
    padding: 0 0 20px;
    gap: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
  padding: 12px 8px 24px 0;

  @media ${(props) => props.theme.mq.mobile} {
    width: 100%;
    padding: 16px 12px 24px;
  }
`;

const ContentInner = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
`;

const DEFAULT_DESKTOP_CARD_WIDTH = 320;
const EMPTY_CHARTS_MESSAGE = "No dashboard charts are configured for this page.";
const EMPTY_DATA_MESSAGE = "No data available for the selected filters, please try different filters.";

const gcd = (left, right) => {
  let a = Math.abs(Number(left) || 0);
  let b = Math.abs(Number(right) || 0);

  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a || 1;
};

const lcm = (left, right) => Math.abs((left * right) / gcd(left, right || 1)) || left || right || 1;

const tokenizeAreaRow = (row = "") =>
  String(row)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

const groupAreaTokens = (tokens = []) => {
  const groups = [];

  tokens.forEach((token) => {
    const previous = groups[groups.length - 1];
    if (previous?.area === token) {
      previous.count += 1;
      return;
    }

    groups.push({ area: token, count: 1 });
  });

  return groups;
};

const allocateSlots = (groups = [], targetColumns = groups.length) => {
  if (!groups.length) return [];

  const totalWeight = groups.reduce((sum, group) => sum + group.count, 0) || groups.length;
  const rawSlots = groups.map((group) => (group.count / totalWeight) * targetColumns);
  const slots = rawSlots.map((value) => Math.max(1, Math.floor(value)));
  let allocated = slots.reduce((sum, value) => sum + value, 0);

  while (allocated < targetColumns) {
    let bestIndex = 0;
    let bestRemainder = -Infinity;

    rawSlots.forEach((value, index) => {
      const remainder = value - slots[index];
      if (remainder > bestRemainder) {
        bestRemainder = remainder;
        bestIndex = index;
      }
    });

    slots[bestIndex] += 1;
    allocated += 1;
  }

  while (allocated > targetColumns) {
    let bestIndex = -1;
    let bestPenalty = Infinity;

    rawSlots.forEach((value, index) => {
      if (slots[index] <= 1) return;
      const penalty = slots[index] - value;
      if (penalty < bestPenalty) {
        bestPenalty = penalty;
        bestIndex = index;
      }
    });

    if (bestIndex === -1) break;
    slots[bestIndex] -= 1;
    allocated -= 1;
  }

  return slots;
};

const normaliseDashboardLayout = (layout = {}) => {
  const desktopAreas = Array.isArray(layout.desktopAreas) ? layout.desktopAreas : [];
  const desktopColumns = Array.isArray(layout.desktopColumns)
    ? layout.desktopColumns.map((value) => Number(value)).filter((value) => value > 0)
    : null;

  if (!desktopColumns?.length || !desktopAreas.length) {
    return {
      desktopColumns: Number(layout.desktopColumns) > 0 ? Number(layout.desktopColumns) : layout.desktopColumns,
      desktopAreas,
    };
  }

  const normalizedColumns = desktopColumns.reduce((acc, value) => lcm(acc, value), 1);
  const normalizedAreas = desktopAreas.map((row, rowIndex) => {
    const groups = groupAreaTokens(tokenizeAreaRow(row));
    const spans = allocateSlots(groups, normalizedColumns);
    const expandedRow = groups.flatMap((group, groupIndex) => Array.from({ length: spans[groupIndex] }, () => group.area));

    return expandedRow.join(" ");
  });

  return {
    desktopColumns: normalizedColumns,
    desktopAreas: normalizedAreas,
  };
};

const getDesktopGridColumns = (columns, minCardWidth) => {
  if (Number(columns) > 0) {
    return `repeat(${Number(columns)}, minmax(0, 1fr))`;
  }

  return `repeat(auto-fit, minmax(min(100%, ${minCardWidth}px), 1fr))`;
};

const getDesktopGridAreas = (areas = []) => {
  if (!Array.isArray(areas) || areas.length === 0) return "none";
  return areas.map((row) => `"${row}"`).join(" ");
};

const ChartsViewport = styled.div`
  width: 100%;
  overflow: visible;
  padding-right: 0;
  --chart-surface-background: #ffffff;
  --chart-surface-border: 1px solid #dbe4ee;
  --chart-surface-radius: ${(props) => props.theme.borderRadius};
  --chart-surface-padding: 12px;

  > div {
    width: 100%;
    display: grid;
    grid-template-columns: ${(props) =>
      getDesktopGridColumns(props.$desktopColumns, props.$minCardWidth)};
    grid-template-areas: ${(props) => getDesktopGridAreas(props.$desktopAreas)};
    gap: 16px;
    align-items: stretch;
  }

  @media (max-width: 1400px) {
    > div {
      grid-template-columns: repeat(${(props) => Math.min(2, Math.max(1, Number(props.$desktopColumns) || 2))}, minmax(0, 1fr));
      grid-template-areas: none;
    }
  }

  @media (max-width: 980px) {
    > div {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: none;
    }
  }

  @media ${(props) => props.theme.mq.mobile} {
    overflow: visible;
    padding-right: 0;

    > div {
      grid-template-columns: minmax(0, 1fr);
    }
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 18px;
  margin: 0 0 20px;

  @media ${(props) => props.theme.mq.mobile} {
    flex-direction: column;
    gap: 12px;
  }
`;

const HeaderDivider = styled.div`
  width: 1px;
  background: #d1d5db;
  flex: 0 0 1px;
  align-self: stretch;

  @media ${(props) => props.theme.mq.mobile} {
    display: none;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
`;

const HeaderMeta = styled.div`
  flex: 1;
  min-width: 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;

  @media ${(props) => props.theme.mq.mobile} {
    display: block;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.45rem, 1.7vw, 1.75rem);
  line-height: 1.15;
  white-space: nowrap;
  text-align: left;

  @media ${(props) => props.theme.mq.mobile} {
    white-space: normal;
  }
`;

const AboutText = styled.div`
  margin: 0;
  color: #4b5563;
  font-size: 0.88rem;
  line-height: 1.3;
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  display: block;
  overflow: visible;
  white-space: normal;

  p {
    margin: 0;
    display: inline;
  }

  p:last-child {
    margin-bottom: 0;
  }

  @media ${(props) => props.theme.mq.mobile} {
    display: block;
    overflow: visible;
  }
`;

function summariseAboutText(htmlText = "") {
  return String(htmlText)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EmptyState = styled.section`
  background: #ffffff;
  border: 1px solid #dbe4ee;
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 18px;
`;

async function callMetadataEndpoint(endpoint) {
  const method = (endpoint?.requestMethod || "GET").toUpperCase();
  const opts = endpoint?.requestOptions || undefined;
  if (method === "POST") {
    return api.baseService.post(endpoint.path, endpoint.body ?? {}, opts);
  }
  return api.baseService.get(endpoint.path, opts);
}

async function fetchMetadataTables(configuredTables = []) {
  if (configuredTables.length === 0) {
    return {};
  }

  const tableEntries = await Promise.all(
    configuredTables.map(async (table) => {
      const response = await callMetadataEndpoint(table);
      let rows = response;
      if (Array.isArray(table.where) && table.where.length > 0) {
        rows = applyWhereConditions(rows, table.where);
      }

      return [table.name, rows];
    })
  );

  return Object.fromEntries(tableEntries);
}

function buildDashboardFilters(configuredFilters = [], metadataTables = {}) {
  const usedIds = new Set();

  return configuredFilters.map((sourceFilter) => {
    const filter = { ...sourceFilter, id: buildDeterministicFilterId(sourceFilter, usedIds) };

    if (filter.values?.source !== "metadataTable") {
      return filter;
    }

    const table = metadataTables[filter.values.metadataTableName] || [];
    const rows = filter.values.where
      ? applyWhereConditions(table, filter.values.where)
      : table;

    let options = [];
    const seenOptions = new Set();
    rows.forEach((row) => {
      const option = {
        displayValue: row[filter.values.displayColumn],
        paramValue: row[filter.values.paramColumn],
        legendSubtitleText: row[filter.values?.legendSubtitleTextColumn] || null,
        infoOnHover: row[filter.values?.infoOnHoverColumn] ?? null,
        infoBelowOnChange: row[filter.values?.infoBelowOnChangeColumn] ?? null,
      };

      const optionKey = `${String(option.paramValue)}::${String(option.displayValue)}`;
      if (!seenOptions.has(optionKey)) {
        seenOptions.add(optionKey);
        options.push(option);
      }
    });

    if (filter.values.sort) {
      options = sortValues(options, filter.values.sort);
    }
    if (filter.values.exclude) {
      options = options.filter((item) => !filter.values.exclude.includes(item.paramValue));
    }

    return {
      ...filter,
      values: { ...filter.values, values: options },
    };
  });
}

function buildInitialFilterState(filters = []) {
  return filters.reduce((initial, filter) => {
    if (filter.shouldBeBlankOnInit) {
      initial[filter.id] = null;
      return initial;
    }

    if (filter.multiSelect && filter.shouldInitialSelectAllInMultiSelect) {
      initial[filter.id] =
        filter.defaultValue ?? filter.min ?? (filter.values?.values || []).map((value) => value.paramValue);
      return initial;
    }

    initial[filter.id] = filter.defaultValue ?? filter.min ?? filter.values?.values?.[0]?.paramValue ?? null;
    return initial;
  }, {});
}

function useDashboardFilters() {
  const pageContext = useContext(PageContext);
  const { state: filterState, dispatch: filterDispatch } = useFilterContext();
  const [metadataTables, setMetadataTables] = useState({});
  const [filtersWithIds, setFiltersWithIds] = useState([]);
  const [hasLoadedMetadata, setHasLoadedMetadata] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setHasLoadedMetadata(false);
    setIsReady(false);
    setMetadataTables({});
    setFiltersWithIds([]);

    const loadTables = async () => {
      try {
        const tables = await fetchMetadataTables(pageContext.config.metadataTables || []);

        if (!cancelled) {
          setMetadataTables(tables);
          setHasLoadedMetadata(true);
        }
      } catch (error) {
        console.error("DashboardPage: failed to fetch metadata tables:", error);
        if (!cancelled) {
          setMetadataTables({});
          setHasLoadedMetadata(true);
        }
      }
    };

    loadTables();

    return () => {
      cancelled = true;
    };
  }, [pageContext]);

  useEffect(() => {
    if (!hasLoadedMetadata) return;

    setFiltersWithIds(buildDashboardFilters(pageContext.config.filters || [], metadataTables));
  }, [hasLoadedMetadata, metadataTables, pageContext]);

  useEffect(() => {
    if (!hasLoadedMetadata) return;

    filterDispatch({ type: "INITIALIZE_FILTERS", payload: buildInitialFilterState(filtersWithIds) });
    setIsReady(true);
  }, [filterDispatch, filtersWithIds, hasLoadedMetadata]);

  const validatedFilters = useMemo(() => {
    if (!isReady) return filtersWithIds;
    return updateFilterValidity({ filters: filtersWithIds, metadataTables }, filterState);
  }, [filterState, filtersWithIds, isReady, metadataTables]);

  const onFilterChange = (filter, value) => {
    filterDispatch({ type: "SET_FILTER_VALUE", payload: { filterId: filter.id, value, filter } });
  };

  return {
    filters: validatedFilters,
    filterState,
    onFilterChange,
    isReady,
  };
}

function resolveDashboardEndpoint(pageContext) {
  const config = pageContext?.config || {};
  const endpoint = config.dataEndpoint || {};
  const path = endpoint.path || pageContext?.dataPath || config.dataPath;
  const requestMethod = endpoint.requestMethod || config.requestMethod || "GET";

  if (!path) return null;

  return {
    ...endpoint,
    path,
    requestMethod,
  };
}

function getRouteParamNames(path = "") {
  const matches = path.matchAll(/:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g);
  return new Set(
    Array.from(matches, (match) => match[1] || match[2]).filter(Boolean)
  );
}

function buildVisualisation(pageContext, filters, filterState, apiSchema) {
  const endpoint = resolveDashboardEndpoint(pageContext);
  if (!endpoint?.path) return null;

  const requestMethod = String(endpoint.requestMethod || "GET").toUpperCase();
  if (requestMethod !== "GET") return null;

  const routeParamNames = getRouteParamNames(endpoint.path);
  const queryParams = {};
  const pathParams = {};

  (filters || []).forEach((filter) => {
    if (!filter?.paramName) return;
    if (["fixed", "hidetoggle", "mapViewport"].includes(filter.type)) return;

    const value = filterState?.[filter.id];
    const target = routeParamNames.has(filter.paramName) ? pathParams : queryParams;
    target[filter.paramName] = {
      value,
      required: !!filter.forceRequired,
    };
  });

  return {
    name: pageContext?.pageName || "Dashboard",
    dataPath: endpoint.path,
    queryParams,
    pathParams,
    requiresAuth: checkSecurityRequirements(apiSchema, endpoint.path),
  };
}

function hasInitialisedDashboardFilters(filters = [], filterState = {}, isReady = false) {
  if (!isReady) return false;

  return filters.every((filter) => Object.prototype.hasOwnProperty.call(filterState, filter.id));
}

function resolveDashboardAdditionalFeatures(config, filters) {
  const configuredAdditionalFeatures = config.additionalFeatures || {};
  if (configuredAdditionalFeatures.download || configuredAdditionalFeatures.glossary) {
    return configuredAdditionalFeatures;
  }

  if (!config.download) return null;

  return {
    ...configuredAdditionalFeatures,
    download: {
      ...config.download,
      filters: config.download.filters || filters,
    },
  };
}

function normaliseDashboardCharts(charts = []) {
  return charts.map((chart) =>
    String(chart?.type || "").toLowerCase() === "table" && (chart?.tableLayout || "rows") === "rows"
      ? {
          ...chart,
          maxHeight: chart.maxHeight,
          minWidth: chart.minWidth || "100%",
          stickyHeader: chart.stickyHeader ?? true,
        }
      : chart
  );
}

function getDashboardContentState({ endpoint, error, charts, data }) {
  const fetchError = !endpoint?.path
    ? "Dashboard data path is not configured for this page."
    : String(endpoint?.requestMethod || "GET").toUpperCase() !== "GET"
    ? "Dashboard currently supports GET data endpoints when using useFetchVisualisationData."
    : error?.message || null;

  const hasCharts = Array.isArray(charts) && charts.length > 0;
  const hasData = Array.isArray(data)
    ? data.length > 0
    : !!data && Object.keys(data).length > 0;

  return {
    fetchError,
    hasCharts,
    hasData,
  };
}

export function DashboardPage() {
  const pageContext = useContext(PageContext);
  const appContext = useContext(AppContext);
  const { pageName, config = {} } = pageContext;
  const dashboardLayout = config.layout || {};
  const { filters, filterState, onFilterChange, isReady } = useDashboardFilters();
  const aboutSummary = useMemo(() => summariseAboutText(pageContext.about || ""), [pageContext.about]);
  const hasInitialisedFilterState = useMemo(
    () => hasInitialisedDashboardFilters(filters, filterState, isReady),
    [filterState, filters, isReady]
  );

  const endpoint = useMemo(
    () => resolveDashboardEndpoint(pageContext),
    [pageContext]
  );

  const visualisation = useMemo(() => {
    if (!isReady || !hasInitialisedFilterState) return null;
    return buildVisualisation(pageContext, filters, filterState, appContext.apiSchema);
  }, [appContext.apiSchema, filterState, filters, hasInitialisedFilterState, isReady, pageContext]);

  const additionalFeatures = useMemo(() => {
    return resolveDashboardAdditionalFeatures(config, filters);
  }, [config.additionalFeatures, config.download, filters]);

  const dashboardCharts = useMemo(
    () => normaliseDashboardCharts(config.charts || []),
    [config.charts]
  );

  const resolvedDashboardLayout = useMemo(
    () => normaliseDashboardLayout(dashboardLayout),
    [dashboardLayout]
  );

  const {
    isLoading,
    data,
    error,
  } = useFetchVisualisationData(visualisation);
  const { fetchError, hasCharts, hasData } = useMemo(
    () => getDashboardContentState({ endpoint, error, charts: dashboardCharts, data }),
    [dashboardCharts, data, endpoint, error]
  );

  return (
    <LayoutContainer>
      <Dimmer dimmed={isLoading} showLoader={true} />
      <DashboardSidebar
        legalText={pageContext.legalText || ""}
        filters={filters}
        onFilterChange={onFilterChange}
        bgColor={pageContext.navbarLinkBgColour || "#4b3e91"}
        additionalFeatures={additionalFeatures}
      />

      <ContentArea>
        <ContentInner>
          <HeaderRow>
            <TitleBlock>
              <Title>{pageName}</Title>
            </TitleBlock>
            <HeaderDivider />
            <HeaderMeta>
              {aboutSummary ? (
                <AboutText>
                  {aboutSummary}
                </AboutText>
              ) : null}
            </HeaderMeta>
          </HeaderRow>

          {fetchError ? <WarningBox text={fetchError} /> : null}

          {!fetchError && !hasCharts ? (
            <EmptyState>
              <WarningBox text={EMPTY_CHARTS_MESSAGE} />
            </EmptyState>
          ) : null}

          {!fetchError && hasCharts && !isLoading && !hasData ? (
            <EmptyState>
              <WarningBox text={EMPTY_DATA_MESSAGE} />
            </EmptyState>
          ) : null}

          {!fetchError && hasCharts && hasData ? (
            <ChartsViewport
              $desktopColumns={resolvedDashboardLayout.desktopColumns}
              $desktopAreas={resolvedDashboardLayout.desktopAreas}
              $minCardWidth={dashboardLayout.minCardWidth || DEFAULT_DESKTOP_CARD_WIDTH}
            >
              <ChartRenderer
                charts={dashboardCharts}
                data={data}
                formatters={config.formatters}
                barHeight={config.barHeight}
              />
            </ChartsViewport>
          ) : null}
        </ContentInner>
      </ContentArea>
    </LayoutContainer>
  );
}

export default DashboardPage;