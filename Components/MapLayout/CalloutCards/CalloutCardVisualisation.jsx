import React, { useEffect, useState, useContext, useRef } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import DOMPurify from "dompurify";

import { MapContext } from "contexts";
import { replacePlaceholders } from "utils";
import { Hovertip, WarningBox, ChartRenderer } from "Components";

import { CARD_CONSTANTS } from "defaults";
const { CARD_WIDTH, PADDING, TOGGLE_BUTTON_WIDTH, TOGGLE_BUTTON_HEIGHT } =
  CARD_CONSTANTS;

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
  transform: translateX(${({ $isVisible }) => ($isVisible ? "0" : `100%`)});
  overflow: hidden; /* Prevent content overflow */
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
  @media ${(props) => props.theme.mq.mobile} {
    font-size: 1.2em;
    text-align: left;
    margin: 0;
  }
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

  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 0 0px;
    justify-content: center;
  }

  .row.small {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 0 0px;
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

/**
 * Styled component for the toggle button.
 */
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

/**
 * CalloutCardVisualisation component to display a card-like element within the map.
 *
 * @param {Object} props - The component props.
 * @param {string} props.visualisationName - The name of the visualisation.
 * @param {string} [props.cardName] - Optional name for the card.
 * @param {Function} [props.onUpdate] - Optional function to call when the card updates.
 * @returns {JSX.Element|null} The rendered CalloutCardVisualisation component.
 */
export const CalloutCardVisualisation = ({
  visualisationName,
  cardName,
  onUpdate,
  data,
  isLoading,
  hideHandleOnMobile = false,
  onVisibilityChange,
}) => {
  const { state } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];
  let customFormattingFunctions = visualisation.customFormattingFunctions || {};
  const buttonRef = useRef(null);

  // Do not render the card if no data is available,
  // or if the data is an empty object,
  // or if every value in the data dictionary is nullish.
  let hasDataShouldRender = true;
  if (
    !data ||
    Object.keys(data).length === 0 ||
    Object.values(data).every(
      (value) => value === null || value === undefined || value === 0
    )
  ) {
    hasDataShouldRender = false;
  }

  const actuallyVisible = !isLoading && hasDataShouldRender;

  useEffect(() => {
    if (onVisibilityChange) onVisibilityChange(actuallyVisible);
    return () => {
      if (onVisibilityChange) onVisibilityChange(false);
    };
  }, [actuallyVisible, onVisibilityChange]);

  // State to hold the rendered HTML content
  const [renderedContent, setRenderedContent] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const showHandle = !hideHandleOnMobile;
  const contentRef = useRef(null); // NEW
  const [dynamicCardTitle, setDynamicCardTitle] = useState("");

  // Effect to replace placeholders in the HTML fragment with actual data and sanitize it
  useEffect(() => {
    if (data && visualisation.htmlFragment) {
      setIsVisible(true);
      let html = replacePlaceholders(visualisation.htmlFragment, data, {
        customFunctions: customFormattingFunctions,
      });
      const sanitizedHtml = DOMPurify.sanitize(html);
      setRenderedContent(sanitizedHtml);
      if (onUpdate) onUpdate();
    } else {
      setRenderedContent("");
    }
  }, [visualisation.htmlFragment]);

  // Compute dynamic card title for charts (if configured)
  useEffect(() => {
    if (data && visualisation.cardTitle) {
      const title = replacePlaceholders(String(visualisation.cardTitle), data, {
        customFunctions: customFormattingFunctions,
      });
      // Render as plain text to avoid HTML injection in the title
      setDynamicCardTitle(
        DOMPurify.sanitize(title, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
      );
    } else {
      setDynamicCardTitle("");
    }
  }, [data, visualisation.cardTitle]);

  useEffect(() => {
    if (hideHandleOnMobile) setIsVisible(true);
  }, [hideHandleOnMobile]);

  /**
   * Toggles the visibility of the card.
   */
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    setIsHovered(false);
  };

  // Render loading state if data is still being fetched
  if (isLoading) {
    return (
      <>
        <ParentContainer $isVisible={isVisible}>
          <CardContainer $isVisible={isVisible}>
            <CardTitle>Loading...</CardTitle>
            <CardContent>
              <h3>Loading...</h3>
            </CardContent>
          </CardContainer>
          {showHandle && (
            <>
              <ToggleButton
                ref={buttonRef}
                $isVisible={isVisible}
                onClick={toggleVisibility}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {isVisible ? (
                  <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
                ) : (
                  <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
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
          )}
        </ParentContainer>
      </>
    );
  }

  // If there is no data to display, don't render the card
  // if (!data || Object.keys(data).length === 0) {
  //   return null; // Don't render the card if there's no data
  // }

  if (!hasDataShouldRender) {
    return null;
  }

  function formatNumberWithUnit(value, unit = "") {
    if (value === null || value === undefined || isNaN(value)) return "N/A";
    if (Math.abs(value) >= 1e9) return (value / 1e9).toFixed(2) + "bn" + unit;
    if (Math.abs(value) >= 1e6) return (value / 1e6).toFixed(2) + "M" + unit;
    if (Math.abs(value) >= 1e3) return (value / 1e3).toFixed(2) + "K" + unit;
    return Number(value).toFixed(2) + unit;
  }

  customFormattingFunctions = {
    ...customFormattingFunctions,
    formatNumberWithUnit,
  };

  if (visualisation.layout && visualisation.layout.length > 0) {
    return (
      <ParentContainer $isVisible={isVisible}>
        <CardContainer $isVisible={isVisible}>
          <CardTitle>{cardName}</CardTitle>
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
                  const html = replacePlaceholders(
                    item.fragment,
                    mergedData, // Here you replace with the data object
                    { customFunctions: customFormattingFunctions }
                  );
                  return (
                    <CardContent
                      key={idx}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(html),
                      }}
                    />
                  );
                } else {
                  const allGraphs = Object.entries(data)
                    .filter(([key, obj]) => obj && obj.type !== undefined)
                    .map(([key, obj]) => ({ key, ...obj }));
                  return allGraphs.map((chart, idx) => {
                    const configs = {
                      type: chart.type,
                      title: chart.header || "Title",
                      x_axis_title: chart?.x_axis_title,
                      y_axis_title: chart?.y_axis_title,
                      columns: chart.values.map((obj) => ({
                        key: obj.name,
                        label: obj.name,
                      })),
                    };

                    const hasRank = chart.values.some(
                      (obj) => obj.rank !== undefined
                    );

                    if (hasRank) {
                      configs.ranks = chart.values.reduce((acc, obj) => {
                        if (obj.rank !== undefined) {
                          acc[obj.name] = obj.rank;
                        }
                        return acc;
                      }, {});
                    }
                    const data = chart.values.reduce((acc, obj) => {
                      acc[obj.name] = obj.columnValue;
                      return acc;
                    }, {});
                    return (
                      <CardContent key={idx}>
                        <ChartRenderer
                          charts={[configs]}
                          data={data}
                          formatters={customFormattingFunctions}
                          barHeight={225}
                        />
                      </CardContent>
                    );
                  });
                }
              })}
            </>
          )}
        </CardContainer>
        {showHandle && (
          <>
            <ToggleButton
              ref={buttonRef}
              $isVisible={isVisible}
              onClick={toggleVisibility}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isVisible ? (
                <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
              ) : (
                <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
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
        )}
      </ParentContainer>
    );
  }

  // Render the card with dynamic content
  return (
    <>
      <ParentContainer $isVisible={isVisible}>
        <CardContainer $isVisible={isVisible}>
          <CardTitle>{cardName}</CardTitle>
          {!hasDataShouldRender ? (
            <CardContent>
              <WarningBox text="No data available for selection" />
            </CardContent>
          ) : (
            <>
              {/* Render charts if provided */}
              {Array.isArray(visualisation.charts) && visualisation.charts.length > 0 && (
                <CardContent>
                  {/* Optional dynamic title for charts, controlled by visualisation.cardTitle */}
                  {dynamicCardTitle ? <h2>{dynamicCardTitle}</h2> : null}
                  <ChartRenderer charts={visualisation.charts} data={data} formatters={customFormattingFunctions} barHeight={225} />
                </CardContent>
              )}
              {/* Render HTML fragment if provided (after charts to match nssec config concatenation) */}
              {renderedContent && (
                <CardContent
                  ref={contentRef}
                  dangerouslySetInnerHTML={{ __html: renderedContent }}
                />
              )}
            </>
          )}
        </CardContainer>
        {showHandle && (
          <>
            <ToggleButton
              ref={buttonRef}
              $isVisible={isVisible}
              onClick={toggleVisibility}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isVisible ? (
                <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
              ) : (
                <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
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
        )}
      </ParentContainer>
    </>
  );
};
