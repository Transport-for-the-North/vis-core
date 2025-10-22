import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { CARD_CONSTANTS } from "defaults";
import { Hovertip } from "Components/Hovertip";
import { replacePlaceholders } from "utils";
const { PADDING, TOGGLE_BUTTON_WIDTH, TOGGLE_BUTTON_HEIGHT } = CARD_CONSTANTS;

/**
 * Scrollable container
 */
const ContentWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
`;

/**
 * Main container full size
 */
const FullscreenContainer = styled.div`
  position: fixed;
  top: 85px; /* Navbar height */
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: white;
  display: flex;
  z-index: 999;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2%;
  transition: opacity 0.3s, transform 0.7s;
  transform: ${({ $isVisible }) =>
    $isVisible ? "translateX(0)" : "translateX(110%)"};
`;

/**
 * Back button
 */
const BackButton = styled.button`
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
 * Open button
 */
const OpenButton = styled.button`
  position: fixed;
  top: 90px; // Below the navbar
  right: 20px;
  z-index: 2000;
  width: ${TOGGLE_BUTTON_WIDTH}px;
  height: ${TOGGLE_BUTTON_HEIGHT}px;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Image, texte, title wrapper
 */
const TitleImageTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5%;
  gap: 2rem;
`;

/**
 * Title and text container
 */
const TitleTextContainer = styled.div`
  display: flex;
  max-width: 50%;
  flex-direction: column;
`;

/**
 * Image container
 */
const ImageContainer = styled.div`
  display: flex;
  max-width: 50%;
`;

/**
 * Image placeholder
 */
const Image = styled.img`
  max-width: 500px;
  width: 70%;
  height: auto;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`;

/**
 * Title
 */
const Title = styled.p`
  font-size: clamp(2rem, 5vw, 4rem);
`;

/**
 * Navigation bar
 */
const NavigationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  margin-top: auto;
  width: calc(100% - 40px);
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 15px;
  }
`;

const NavigationButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;

  /* Style for the icon */
  svg {
    width: 24px;
    height: 24px;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
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

  @media (max-width: 800px) {
    .card {
      flex: 1 0 45%;
    }
  }

  @media (max-width: 500px) {
    .card {
      flex: 1 0 90%;
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
 * FullScreenCalloutCardVisualisation - Full-screen display component with carousel navigation
 *
 * Displays scenario data in full-screen mode with carousel navigation.
 * Handles automatic prefetching of upcoming scenarios for smooth navigation.
 * Supports multiple image formats (Blob, ArrayBuffer, Uint8Array, URL).
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array<Object>} props.data - List of scenarios to display
 * @param {number} props.data[].scenario_id - Unique scenario identifier
 * @param {string} props.data[].label - Scenario label
 * @param {number} [props.data[].programme_id] - Programme identifier
 * @param {Object} [props.data[].point_geom] - GeoJSON Point geometry
 * @param {string} props.data[].point_geom.type - Geometry type (e.g., "Point")
 * @param {Array<number>} props.data[].point_geom.coordinates - [longitude, latitude]
 * @param {Object} [props.data[].polygon_geom] - GeoJSON Polygon geometry
 * @param {string} props.data[].polygon_geom.type - Geometry type (e.g., "Polygon")
 * @param {Array<Array<Array<number>>>} props.data[].polygon_geom.coordinates - Polygon coordinates
 * @param {string} [props.data[].text_with_placeholders] - Text with placeholders to replace (e.g., "{distance}")
 * @param {Object} [props.data[].values] - Values to replace placeholders with
 * @param {string|Blob|ArrayBuffer|Uint8Array} [props.data[].image] - Scenario image (URL or binary data)
 * @param {boolean} props.includeCarouselNavigation - Enable/disable carousel navigation
 * @param {Array<{key: number, value: string}>} props.possibleCarouselNavData - Data for navigation tooltips
 * @param {Function} props.handleNextFetch - Callback to load upcoming scenarios
 *
 * @example
 * const scenariosData = [
 *   {
 *     scenario_id: 12,
 *     programme_id: 0,
 *     label: "Huddersfield College",
 *     point_geom: {
 *       type: "Point",
 *       coordinates: [-1.553621, 53.79969]
 *     },
 *     polygon_geom: {
 *       type: "Polygon",
 *       coordinates: [[[-1.554, 53.799], [-1.552, 53.799], ...]]
 *     },
 *     text_with_placeholders: "Distance: <strong>{distance}</strong> km",
 *     values: { distance: 2, duration: 30 },
 *     image: "https://example.com/image.png"
 *   }
 * ];
 *
 * @returns {JSX.Element|null} The full-screen component or null if no current scenario
 */
export const FullScreenCalloutCardVisualisation = ({
  data,
  includeCarouselNavigation,
  possibleCarouselNavData,
  handleNextFetch,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const handleToggle = () => setIsVisible((v) => !v);
  const [currentScenarioId, setCurrentScenarioId] = useState(
    data[0]?.scenario_id
  );
  const [content, setContent] = useState(null);

  // next and previous buttons
  const previousButtonRef = React.useRef(null);
  const [previousButtonRefIsHovered, setPreviousButtonRefIsHovered] =
    useState(false);
  const nextButtonRef = React.useRef(null);
  const [nextButtonRefIsHovered, setNextButtonRefIsHovered] = useState(false);

  // Find currentScenario from the ID in data (always up to date)
  let currentScenario = data;
  let currentIndex;
  if (
    possibleCarouselNavData.length > 0 &&
    includeCarouselNavigation === true
  ) {
    currentScenario = data.find(
      (item) => item.scenario_id === currentScenarioId
    );
    currentIndex = data.findIndex(
      (item) => item.scenario_id === currentScenarioId
    );
  }

  const [imgUrl, setImgUrl] = useState(null);

  /**
   * Updates content and image when the current scenario changes
   *
   * Handles different image formats:
   * - Blob: converted to object URL
   * - ArrayBuffer: converted to Blob then object URL
   * - Uint8Array: converted to Blob then object URL
   * - String: used directly as URL
   */
  useEffect(() => {
    if (!currentScenario) {
      return;
    }

    if (!currentScenario.text_with_placeholders || !currentScenario.values) {
      return;
    }

    const newContent = replacePlaceholders(
      currentScenario.text_with_placeholders,
      currentScenario.values
    );
    setContent(newContent);
    setImgUrl(null);

    if (currentScenario.image_url) {
      if (currentScenario.image_url instanceof Blob) {
        const url = URL.createObjectURL(currentScenario.image_url);
        setImgUrl(url);
      } else if (currentScenario.image_url instanceof ArrayBuffer) {
        const blob = new Blob([currentScenario.image_url], {
          type: "image/png",
        });
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } else if (currentScenario.image_url instanceof Uint8Array) {
        const blob = new Blob([currentScenario.image_url], {
          type: "image/png",
        });
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } else if (typeof currentScenario.image_url === "string") {
        setImgUrl(currentScenario.image_url);
      }
    }
  }, [currentScenario, data]);

  /**
   * Opens the card with animation when you click on an image
   */
  useEffect(() => {
    let timeout;
    if (!isVisible) {
      timeout = setTimeout(() => setIsVisible(true), 30);
      return () => clearTimeout(timeout);
    }
  }, [currentScenarioId]);

  /**
   * Navigates to the previous scenario in the carousel
   */
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentScenarioId(data[currentIndex - 1].scenario_id);
    }
  };

  /**
   * Navigates to the next scenario and triggers prefetch if needed
   *
   * Prefetch logic:
   * - Fetches scenario at +2 position if incomplete
   * - Falls back to +1 position if no +2 exists
   */
  const handleNext = () => {
    // When object +2 does not have text_with_placeholders and exists in data
    if (
      !data[currentIndex + 2]?.text_with_placeholders &&
      data[currentIndex + 2]
    ) {
      handleNextFetch(data[currentIndex + 2].scenario_id);
    }
    // When there is no +2 scenario but there is a +1 that does not have any data
    else if (
      !data[currentIndex + 1]?.text_with_placeholders &&
      data[currentIndex + 1]
    ) {
      handleNextFetch(data[currentIndex + 1].scenario_id);
    }

    // Move to the next object
    if (currentIndex < data.length - 1) {
      setCurrentScenarioId(data[currentIndex + 1].scenario_id);
    }
  };

  // Check that currentScenario exists before rendering
  if (!currentScenario) {
    return null;
  }

  return (
    <>
      {!isVisible && (
        <OpenButton onClick={handleToggle} aria-label="Open card">
          <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
        </OpenButton>
      )}
      <FullscreenContainer $isVisible={isVisible}>
        {/* Close button */}
        {isVisible && (
          <BackButton onClick={handleToggle} aria-label="Close card">
            <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
          </BackButton>
        )}

        {isVisible && (
          <ContentWrapper>
            {/* Title */}
            <CardTitle>{currentScenario.label || "Card"}</CardTitle>

            {/* Content */}
            <TitleImageTextWrapper>
              <TitleTextContainer>
                <Title style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                  {currentScenario.label || "Card"}
                </Title>
                <CardContent dangerouslySetInnerHTML={{ __html: content }} />
              </TitleTextContainer>
              <ImageContainer>
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    onError={() => {
                      setImgUrl(null);
                    }}
                    alt={currentScenario.label || "Scenario image"}
                  />
                ) : (
                  <Image src={"https://placehold.co/600x400?text=No+image!"} />
                )}
              </ImageContainer>
            </TitleImageTextWrapper>
          </ContentWrapper>
        )}
        {/* Navigation */}
        {isVisible && includeCarouselNavigation && (
          <NavigationBar>
            <NavigationButton
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              ref={previousButtonRef}
              onMouseEnter={() => setPreviousButtonRefIsHovered(true)}
              onMouseLeave={() => setPreviousButtonRefIsHovered(false)}
              aria-label="Previous scenario"
            >
              <ChevronLeftIcon />
            </NavigationButton>
            {currentIndex > 0 && (
              <Hovertip
                isVisible={previousButtonRefIsHovered}
                displayText={possibleCarouselNavData[currentIndex - 1].value}
                side="right"
                refElement={previousButtonRef}
                offset={3}
              />
            )}
            <NavigationButton
              onClick={handleNext}
              disabled={currentIndex === possibleCarouselNavData.length - 1}
              ref={nextButtonRef}
              onMouseEnter={() => setNextButtonRefIsHovered(true)}
              onMouseLeave={() => setNextButtonRefIsHovered(false)}
              aria-label="Next scenario"
            >
              <ChevronRightIcon />
            </NavigationButton>
            {currentIndex < possibleCarouselNavData.length - 1 && (
              <Hovertip
                isVisible={nextButtonRefIsHovered}
                displayText={possibleCarouselNavData[currentIndex + 1].value}
                side="left"
                refElement={nextButtonRef}
                offset={3}
              />
            )}
          </NavigationBar>
        )}
      </FullscreenContainer>
    </>
  );
};
