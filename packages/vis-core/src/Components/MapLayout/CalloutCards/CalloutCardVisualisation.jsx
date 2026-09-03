import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import DOMPurify from "dompurify";

import { MapContext } from "contexts/MapContext";
import { replacePlaceholders, formatNumber } from "utils";
import { Hovertip } from "Components/Hovertip/Hovertip";
import { WarningBox } from "Components/MessageBox/MessageBox";
import { ChartRenderer } from "Components/Charts/ChartRenderer";
import { api } from 'services';
import { actionTypes } from 'reducers/mapReducer';

import { CARD_CONSTANTS } from "defaults";

const { CARD_WIDTH, PADDING, TOGGLE_BUTTON_WIDTH, TOGGLE_BUTTON_HEIGHT } =
  CARD_CONSTANTS;
const UPDATE_MARKER_TIMEOUT_MS = 2800;

/**
 * Styled component for the parent container.
 * Adjusted to resize when the card is hidden.
 */
const ParentContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: ${({ $isVisible }) =>
    $isVisible
      ? `${CARD_WIDTH + PADDING * 2}px`
      : `${TOGGLE_BUTTON_WIDTH + PADDING}px`};
  transition: width 0.3s ease-in-out;

  @media ${(props) => props.theme.mq.mobile} {
    width: 100%;
  }
`;

/**
 * Styled component for the card container.
 * Slides in/out by adjusting the transform property.
 */
const CardContainer = styled.div`
  width: ${CARD_WIDTH}px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  padding: ${PADDING}px;
  z-index: 1000;

  transition: transform 0.3s ease-in-out, height 0.3s ease-in-out;
  transform: translateX(${({ $isVisible }) => ($isVisible ? "0" : "100%")});

  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;

  height: ${({ $isVisible }) => ($isVisible ? "auto" : `${PADDING * 2}px`)};

  @media ${(props) => props.theme.mq.mobile} {
    width: 100%;
    box-shadow: none;
    flex-shrink: 1;
  }
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 82px;
  align-items: start;
  gap: 8px;
  min-height: 30px;
`;

/**
 * Styled component for the card title.
 */
const CardTitle = styled.h2`
  font-size: 1.2em;
  color: #4b3e91;
  font-weight: bold;
  margin-top: 5px;
  user-select: none;
  background-color: rgba(255, 255, 255, 0);
  min-width: 0;

  @media ${(props) => props.theme.mq.mobile} {
    font-size: 1.2em;
    text-align: left;
    margin: 0;
  }
`;

const StatusSlot = styled.div`
  min-width: 82px;
  min-height: 22px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: 4px;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  max-width: 82px;
  padding: 2px 7px;

  border-radius: 999px;
  background: ${({ $kind }) =>
    $kind === "updated"
      ? "rgba(0, 222, 198, 0.18)"
      : "rgba(240, 240, 247, 0.95)"};
  color: ${({ $kind }) =>
    $kind === "updated" ? "rgb(13, 15, 61)" : "#4b3e91"};

  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
`;

/**
 * Styled component for the card content.
 */
const CardContent = styled.div`
  text-align: left;

  h2 {
    font-size: 1.5em;
    color: #4b3e91;
    margin-bottom: 0.5em;

    @media ${(props) => props.theme.mq.mobile} {
      font-size: 1.2em;
    }
  }

  p {
    font-size: 1.2em;
    color: #333;
    line-height: 1.6;
    margin: 0.5em 0;
  }

  .highlight {
    font-weight: bold;
    color: #e74c3c;
  }

  .card-container {
    display: flex;
    flex-wrap: wrap;
    margin-left: -0.5em;
    margin-right: -0.5em;
  }

  .card {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 1em;
    margin: 0.5em;
    flex: 1 0 100px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: left;
  }

  .card.small {
    width: auto;
    padding: 0.5em;
    margin: 0;
    flex: 0 0 auto;
  }

  .row,
  .row.small {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 0;
    justify-content: center;
  }

  .card .label {
    font-size: 1em;
    color: #666;
    margin-bottom: 0.5em;
    font-weight: bold;
  }

  .card .value {
    font-size: 2em;
    color: #4b3e91;
    font-weight: bold;
  }

  .card .value.small {
    font-size: 1em;
  }

  @media (max-width: 900px) {
    .card {
      flex: 1 0 45%;
    }

    .card .value {
      font-size: 1.5em;
    }

    .card .label {
      font-size: 0.8em;
    }
  }

  details {
    margin-top: 1em;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 0.5em;
    background-color: #f4f4f4;

    summary {
      font-size: 1.2em;
      font-weight: bold;
      cursor: pointer;
      position: relative;
      outline: none;
      color: #333333;
    }

    .card-container {
      margin-left: -0.5em;
      margin-right: -0.5em;
      margin-top: 1em;
    }
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: ${PADDING}px;
  left: ${PADDING}px;
  width: ${TOGGLE_BUTTON_WIDTH}px;
  height: ${TOGGLE_BUTTON_HEIGHT}px;
  z-index: 1001;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: right 0.3s ease-in-out;
`;

const TogglePing = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;

  min-width: 17px;
  height: 17px;
  padding: 0 4px;

  border-radius: 999px;
  background: ${({ $kind }) => ($kind === "updated" ? "#00dec6" : "#f0f0f7")};
  color: rgb(13, 15, 61);

  font-size: 10px;
  font-weight: 800;
  line-height: 17px;
  text-align: center;

  box-shadow:
    0 0 0 2px #fff,
    0 2px 6px rgba(0, 0, 0, 0.25);

  pointer-events: none;
`;

/**
 * Serialises a value for comparison without throwing on unusual inputs.
 *
 * @param {any} value - Value to serialise.
 * @returns {string} JSON output when possible, otherwise `String(value)`.
 */
const safeStringify = (value) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

/**
 * CalloutCardVisualisation component to display a card-like element within the map.
 *
 * @param {Object} props - The component props.
 * @param {string} props.visualisationName - The name of the visualisation.
 * @param {string} [props.cardName] - Optional name for the card.
 * @param {Function} [props.onUpdate] - Backwards-compatible function to call when the card first becomes visible.
 * @param {Function} [props.onFirstVisible] - Function to call when the card first becomes visible.
 * @param {Function} [props.onCardUpdated] - Callback fired with update expiry details when hydrated card data changes.
 * @param {Function} [props.onCardUpdateAcknowledged] - Callback fired when the user opens an updated card.
 * @param {Object} props.data - Data used by the card.
 * @param {boolean} props.isLoading- Whether this is the initial loading state.
 * @param {boolean} props.isUpdating - Whether data is refreshing after first hydration.
 * @param {boolean} [props.hideHandleOnMobile]
 * @param {Function} [props.onVisibilityChange] - Callback fired when real card data becomes renderable or hidden.
 * @param {React.ReactNode} [props.recordSelector]
 * @param {Function} [props.toggleVisibility]
 * @param {Function} [props.getAllColors]
 * @returns {JSX.Element|null} The rendered CalloutCardVisualisation component.
 */
export const CalloutCardVisualisation = ({
  visualisationName,
  cardName,
  onUpdate,
  onFirstVisible,
  onCardUpdated,
  onCardUpdateAcknowledged,
  data,
  isLoading,
  isUpdating = false,
  hideHandleOnMobile = false,
  onVisibilityChange,
  recordSelector = null,
  toggleVisibility: externalToggleVisibility = null,
  getAllColors,
}) => {
  const { state, dispatch: mapDispatch } = useContext(MapContext);

  const visualisation = state.visualisations[visualisationName];

  const buttonRef = useRef(null);
  const contentRef = useRef(null);
  const hasFiredFirstVisibleRef = useRef(false);
  const previousDataSignatureRef = useRef(null);
  const updatePingTimerRef = useRef(null);
  const isVisibleRef = useRef(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState(false);

  const showHandle = !hideHandleOnMobile;

  const handleRowClick = async (rowId, rowName) => {
    let layerName = visualisation.joinLayer;
    if (!layerName) {
      // Find the first visualisation that has a joinLayer defined (usually the map layer)
      const mapVis = Object.values(state.visualisations).find(v => v.joinLayer);
      layerName = mapVis?.joinLayer;
    }
    
    if (!layerName) return;

    const layer = state.layers[layerName];
    if (!layer) return;
    const layerPath = layer?.metadata?.path ?? layer?.path;
    if (!layerPath) return;

    try {
      const { bounds, centroid } = await api.geodataService.getFeatureGeometry(layerPath, rowId);
      mapDispatch({
        type: actionTypes.SET_BOUNDS_AND_CENTROID,
        payload: { 
          bounds, 
          centroid,
          featureName: rowName,
          layerMetadata: layer.metadata
        },
      });
      
      mapDispatch({
        type: actionTypes.SET_SELECTED_FEATURES,
        payload: [{
          type: "Feature",
          id: rowId,
          properties: { name: rowName }
        }]
      });
    } catch (err) {
      console.warn(`Failed to zoom to zone: ${err.message}`);
    }
  };

  const colorsList = useMemo(() => {
    if (typeof getAllColors === "function") return getAllColors();

    return ["#A0CA2A", "#E97132", "#7317DE", "#6D6875", "#3A86FF"];
  }, [getAllColors]);

  // Do not render the card if no data is available,
  // or if the data is an empty object,
  // or if every value in the data dictionary is nullish.
  const hasDataShouldRender = useMemo(() => {
    if (!data) return false;
    if (typeof data !== "object") return true;

    const values = Object.values(data);

    if (values.length === 0) return false;

    return !values.every(
      (value) => value === null || value === undefined || value === 0
    );
  }, [data]);

  const actuallyVisible = !isLoading && hasDataShouldRender;

  const dataUpdateSignature = useMemo(() => {
    if (!data) return "";
    return safeStringify(data);
  }, [data]);

  /**
   * Mirrors React state into a ref so delayed update-ping timers can tell
   * whether the card is open without closing over stale state.
   */
  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  /**
   * Reports whether this card currently has renderable data.
   */
  useEffect(() => {
    onVisibilityChange?.(actuallyVisible);
  }, [actuallyVisible, onVisibilityChange]);

  /**
   * Detects post-hydration data changes, raises the per-card update marker, and
   * only auto-clears it when the card is open and visible.
   */
  useEffect(() => {
    if (!actuallyVisible) return;
    if (!dataUpdateSignature) return;

    if (previousDataSignatureRef.current === null) {
      previousDataSignatureRef.current = dataUpdateSignature;
      return;
    }

    if (previousDataSignatureRef.current === dataUpdateSignature) {
      return;
    }

    previousDataSignatureRef.current = dataUpdateSignature;

    const autoClearAt = Date.now() + UPDATE_MARKER_TIMEOUT_MS;

    setRecentlyUpdated(true);
    onCardUpdated?.({ autoClearAt, timeoutMs: UPDATE_MARKER_TIMEOUT_MS });

    if (updatePingTimerRef.current) {
      clearTimeout(updatePingTimerRef.current);
    }

    updatePingTimerRef.current = setTimeout(() => {
      /**
       * Only auto-clear the updated ping if the card is open.
       * If the card is closed/collapsed, keep the handle ping visible until
       * the user opens the card.
       */
      if (isVisibleRef.current) {
        setRecentlyUpdated(false);
      }
    }, Math.max(0, autoClearAt - Date.now()));
  }, [actuallyVisible, dataUpdateSignature, onCardUpdated]);

  /**
   * Fires the first-visible callbacks once, after the card has real data.
   */
  useEffect(() => {
    if (!actuallyVisible) return;
    if (hasFiredFirstVisibleRef.current) return;

    hasFiredFirstVisibleRef.current = true;

    if (typeof onFirstVisible === "function") {
      onFirstVisible();
    }

    // Backwards compatibility: older parents may still pass onUpdate.
    // Fire it once on first visible render rather than on every data update.
    if (typeof onUpdate === "function") {
      onUpdate();
    }
  }, [actuallyVisible, onFirstVisible, onUpdate]);

  /**
   * Opens the card on the next animation frame once data is available so the
   * slide-in transition can run instead of jumping directly to the open state.
   */
  useEffect(() => {
    if (actuallyVisible) {
      // next frame ensures CSS transition fires
      const id = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(id);
    }

    return undefined;
  }, [actuallyVisible]);

  /**
   * Keeps mobile-rendered cards open when their handle is intentionally hidden.
   */
  useEffect(() => {
    if (hideHandleOnMobile) setIsVisible(true);
  }, [hideHandleOnMobile]);

  /**
   * Toggles the visibility of the card and acknowledges pending update markers
   * when the user opens a collapsed card.
   */
  const toggleVisibility = () => {
    if (externalToggleVisibility) {
      externalToggleVisibility();
    } else {
      setIsVisible((current) => {
        const next = !current;

        /**
         * Opening the card acknowledges the update immediately.
         * Closing it does not.
         */
        if (next) {
          setRecentlyUpdated(false);

          if (updatePingTimerRef.current) {
            clearTimeout(updatePingTimerRef.current);
            updatePingTimerRef.current = null;
          }

          onCardUpdateAcknowledged?.();
        }

        return next;
      });
    }

    setIsHovered(false);
  };

  /**
   * Clears any pending update-ping timer when the card unmounts.
   */
  useEffect(() => {
    return () => {
      if (updatePingTimerRef.current) {
        clearTimeout(updatePingTimerRef.current);
      }
    };
  }, []);

  /**
   * Formats numeric placeholder values and appends an optional unit.
   *
   * @param {number|string|null|undefined} value - Value to format.
   * @param {string} [unit=""] - Unit suffix to append.
   * @returns {string} Formatted value or "N/A" for invalid input.
   */
  const formatNumberWithUnit = useCallback((value, unitOrData = "") => {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    // replacePlaceholders calls custom functions with (argValue, fullDataObject)
    // when func.length >= 2. Handle both: a plain string unit suffix, or the full
    // data object (in which case we read data.units).
    const unit =
      typeof unitOrData === "string" ? unitOrData : (unitOrData?.units ?? "");
    return formatNumber(Number(value)) + unit;
  }, []);

  const customFormattingFunctions = useMemo(
    () => ({
      ...(visualisation?.customFormattingFunctions || {}),
      formatNumberWithUnit,
    }),
    [visualisation?.customFormattingFunctions, formatNumberWithUnit]
  );

  /**
   * Builds the sanitised HTML fragment and dynamic title in one memoised step to
   * avoid intermediate renders with mismatched content.
   */
  const { sanitizedHtml, safeDynamicTitle } = useMemo(() => {
    if (!data || !visualisation) {
      return { sanitizedHtml: "", safeDynamicTitle: "" };
    }

    const htmlFromFragment = visualisation.htmlFragment
      ? DOMPurify.sanitize(
          replacePlaceholders(visualisation.htmlFragment, data, {
            customFunctions: customFormattingFunctions,
          })
        )
      : "";

    const dynamicTitle = visualisation.cardTitle
      ? replacePlaceholders(String(visualisation.cardTitle), data, {
          customFunctions: customFormattingFunctions,
        })
      : "";

    const safeTitle = DOMPurify.sanitize(dynamicTitle, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });

    return {
      sanitizedHtml: htmlFromFragment,
      safeDynamicTitle: safeTitle,
    };
  }, [
    data,
    visualisation,
    visualisation?.htmlFragment,
    visualisation?.cardTitle,
    customFormattingFunctions,
  ]);

  const statusKind = isUpdating
    ? "updating"
    : recentlyUpdated
    ? "updated"
    : null;

  const statusLabel =
    statusKind === "updating"
      ? "Updating…"
      : statusKind === "updated"
      ? "Updated"
      : "";

  /**
   * Renders the transient loading/update status badge in the reserved header slot.
   *
   * @returns {JSX.Element|null} Status badge when active.
   */
  const renderStatusBadge = () => {
    if (!statusKind) return null;

    return (
      <StatusBadge $kind={statusKind} role="status">
        {statusLabel}
      </StatusBadge>
    );
  };

  /**
   * Renders a stable two-column header so status changes do not shift the title.
   *
   * @param {string} title - Card title text.
   * @param {Object} [options] - Header render options.
   * @param {boolean} [options.showStatus=true] - Whether to show update status.
   * @returns {JSX.Element} Card header.
   */
  const renderCardHeader = (title, { showStatus = true } = {}) => (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <StatusSlot aria-live="polite">
        {showStatus ? renderStatusBadge() : null}
      </StatusSlot>
    </CardHeader>
  );

  /**
   * Renders the collapse/expand handle and update ping for desktop cards.
   *
   * @returns {JSX.Element|null} Toggle handle when enabled.
   */
  const renderHandle = () =>
    showHandle ? (
      <>
        <ToggleButton
          ref={buttonRef}
          $isVisible={isVisible}
          data-callout-card-toggle
          data-callout-card-toggle-for={visualisationName}
          onClick={toggleVisibility}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={
            isVisible
              ? `Hide ${cardName || "Card"}`
              : `Show ${cardName || "Card"}`
          }
        >
          {isVisible ? (
            <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
          ) : (
            <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
          )}

          {statusKind && (
            <TogglePing $kind={statusKind} aria-hidden="true">
              {statusKind === "updated" ? "!" : "•"}
            </TogglePing>
          )}
        </ToggleButton>

        <Hovertip
          isVisible={isHovered}
          displayText={
            isVisible
              ? `Hide ${cardName || "Card"}`
              : `Show ${cardName || "Card"}`
          }
          side="left"
          refElement={buttonRef}
          offset={5}
        />
      </>
    ) : null;

  if (!visualisation) return null;

  if (isLoading) {
    return (
      <ParentContainer
        $isVisible={isVisible}
        data-callout-card-name={visualisationName}
        data-callout-card-open={isVisible ? "true" : "false"}
      >
        <CardContainer $isVisible={isVisible}>
          {renderCardHeader("Loading...", { showStatus: false })}
          <CardContent>
            <h3>Loading...</h3>
          </CardContent>
        </CardContainer>

        {renderHandle()}
      </ParentContainer>
    );
  }

  if (!hasDataShouldRender) {
    return null;
  }

  if (visualisation.layout && visualisation.layout.length > 0) {
    return (
      <ParentContainer
        $isVisible={isVisible}
        data-callout-card-name={visualisationName}
        data-callout-card-open={isVisible ? "true" : "false"}
      >
        <CardContainer $isVisible={isVisible}>
          {renderCardHeader(cardName)}

          {recordSelector}

          {!hasDataShouldRender ? (
            <CardContent>
              <WarningBox text="No data available for selection" />
            </CardContent>
          ) : (
            <>
              {visualisation.layout.map((item, idx) => {
                if (item.type === "html") {
                  const mergedData = {
                    ...(data.mainValues || {}),
                    ...data,
                  };

                  const html = replacePlaceholders(item.fragment, mergedData, {
                    customFunctions: customFormattingFunctions,
                  });

                  return (
                    <CardContent
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(html),
                      }}
                    />
                  );
                }

                const allGraphs = Object.entries(data)
                  .filter(([, obj]) => obj && obj.type !== undefined)
                  .map(([key, obj]) => ({ key, ...obj }));
                // Association of networks has a colour
                const networkColorMap = {};
                let colorIdx = 0;

                allGraphs.forEach((chart) => {
                  if (
                    chart.type === "multiple_bar" &&
                    Array.isArray(chart.values)
                  ) {
                    chart.values.forEach((obj) => {
                      const network = obj.network;

                      if (network && !(network in networkColorMap)) {
                        networkColorMap[network] =
                          colorsList[colorIdx % colorsList.length];
                        colorIdx += 1;
                      }
                    });
                  }
                });

                return allGraphs.map((chart, chartIdx) => {
                  let title = chart.header || "Title";
                  
                  // Dynamic title for ranking charts
                  if (chart.type === "ranking" && !chart.header && visualisation.queryParams?.dataTypeName?.value) {
                    title = "Top 5 by " + visualisation.queryParams.dataTypeName.value;
                  }

                  let chartData;
                  const chartSpecificConfigs = {};

                  switch (chart.type) {
                    case "multiple_bar": {
                      // Categories = all 'name'
                      const categories = [...new Set(chart.values.map((obj) => obj.name))];
                      // Series = all networks
                      const series = [...new Set(chart.values.map((obj) => obj.network))];

                      // Data formatted for grouped bars
                      chartData = categories.map((cat) => {
                        const entry = { label: cat };
                        chart.values.forEach((obj) => {
                          if (obj.name === cat) {
                            entry[obj.network] = obj.columnValue;
                          }
                        });
                        return entry;
                      });

                      chartSpecificConfigs.columns = series.map((network) => ({
                        key: network,
                        label: network,
                      }));
                      chartSpecificConfigs.xKey = "label";
                      break;
                    }

                    case "line":
                    case "multiple_line": {
                      chartData = chart.values;
                      if (chart.type === "multiple_line") {
                        chartSpecificConfigs.columns = chart.columns;
                        chartSpecificConfigs.xKey = chart.xKey || "label";
                      }
                      break;
                    }

                    default: {
                      // Data formatted for single bar
                      chartSpecificConfigs.columns = chart.values.map((obj) => ({
                        key: obj.name,
                        label: obj.name,
                      }));

                      chartData = chart.values.reduce((acc, obj) => {
                        acc[obj.name] = obj.columnValue;
                        return acc;
                      }, {});

                      // Always create ranks mapping if rank exists
                      chartSpecificConfigs.ranks = chart.values.reduce((acc, obj) => {
                        if (obj.rank != null) {
                          acc[obj.name] = obj.rank;
                        }
                        return acc;
                      }, {});

                      chartSpecificConfigs.ids = chart.values.reduce((acc, obj) => {
                        if (obj.id != null) {
                          acc[obj.name] = obj.id;
                        }
                        return acc;
                      }, {});
                      break;
                    }
                  }

                  const configs = {
                    type: chart.type,
                    title,
                    chartKey: chart.key,
                    units: chart.units || data.mainValues?.units || data.units || "",
                    x_axis_title: chart.x_axis_title,
                    y_axis_title: chart.y_axis_title,
                    primaryLabel: chart.primaryLabel,
                    comparatorLabel: chart.comparatorLabel,
                    comparatorKey: chart.comparatorKey,
                    comparatorColor: chart.comparatorColor,
                    colors: networkColorMap,
                    ...chartSpecificConfigs,
                  };

                  return (
                    <CardContent key={`${idx}-${chartIdx}`}>
                      <ChartRenderer
                        charts={[configs]}
                        data={chartData}
                        formatters={customFormattingFunctions}
                        onRowClick={handleRowClick}
                        barHeight={225}
                      />
                    </CardContent>
                  );
                });
              })}
            </>
          )}
        </CardContainer>

        {renderHandle()}
      </ParentContainer>
    );
  }

  // Render the card with dynamic content
  return (
    <ParentContainer
        $isVisible={isVisible}
        data-callout-card-name={visualisationName}
        data-callout-card-open={isVisible ? "true" : "false"}
      >
      <CardContainer $isVisible={isVisible}>
        {renderCardHeader(cardName)}

        {recordSelector}

        {!hasDataShouldRender ? (
          <CardContent>
            <WarningBox text="No data available for selection" />
          </CardContent>
        ) : (
          <>
            {/* Render charts if provided */}
            {Array.isArray(visualisation.charts) &&
              visualisation.charts.length > 0 && (
                <CardContent>
                  {safeDynamicTitle ? <h2>{safeDynamicTitle}</h2> : null}
                  <ChartRenderer
                    charts={visualisation.charts}
                    data={data}
                    formatters={customFormattingFunctions}
                    onRowClick={handleRowClick}
                    barHeight={225}
                  />
                </CardContent>
              )}

            {sanitizedHtml && (
              <CardContent
                ref={contentRef}
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
              />
            )}
          </>
        )}
      </CardContainer>

      {renderHandle()}
    </ParentContainer>
  );
};
