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
  left: ${({ $sidebarIsOpen }) => $sidebarIsOpen ? "470px" : "70px"}; /* Side panel width (450px) + Sidebar border (10px) + distance between elements (10px) */
  right: 10px;
  bottom: 30px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2%;
  transition: left 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.3s, transform 0.7s;
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
  align-items: stretch;
  justify-content: center;
  margin-top: 5%;
  gap: 2rem;
  min-height: 350px;
  max-height: 350px;
`;

/**
 * Title and text container
 */
const TitleTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  justify-content: center;
  @media (max-width: 900px) {
    width: 90%;
    align-items: center;
  }
`;

/**
 * Image container
 */
const ImageContainer = styled.div`
  display: flex;
  width: 50%;
  min-height: 350px;
  max-height: 350px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

/**
 * Image placeholder
 */
const Image = styled.img`
  width: clamp(120px, 30vw, 350px);
  height: clamp(120px, 30vw, 350px);
  object-fit: cover;
  border-radius: 50%;
  display: block;
  max-width: 100%;
  max-height: 100%;
`;

/**
 * Title
 */
const Title = styled.p`
  font-size: clamp(2rem, 5vw, 4rem);
  text-align: center;
  white-space: normal;
  line-height: 1;
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
  transition: opacity 0.3s;
  text-align: left;
  font-size: 1.5em;

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
 * Prefetches the previous or next location's data when hovering over the navigation buttons for smooth and instant transitions.
 * Supports multiple image formats (Blob, ArrayBuffer, Uint8Array, URL).
 *
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.data - Data for the current location/scenario
 * @param {string} props.data.image_url - URL or binary of the image to display for this location
 * @param {string} props.data.label - Human-readable label for the location
 * @param {number} props.data.location_id - Unique identifier for the location
 * @param {number|null} props.data.nav_next_id - ID of the next location in the scenario (null if last)
 * @param {string|null} props.data.nav_next_label - Label of the next location (for navigation button, null if last)
 * @param {number|null} props.data.nav_prev_id - ID of the previous location in the scenario (null if first)
 * @param {string|null} props.data.nav_prev_label - Label of the previous location (for navigation button, null if first)
 * @param {number} props.data.programme_id - Programme identifier
 * @param {number} props.data.scenario_id - Identifier of the scenario this location belongs to
 * @param {string} props.data.text_with_placeholders - Text with placeholders to be replaced (e.g., "{distance}")
 * @param {Object} props.data.values - Values to replace placeholders with (e.g., {distance: 3, duration: 40})
 * @param {Function} props.handleUpdatedData - Callback to load or prefetch the next/previous location
 * @param {Function} props.handleChange - Callback to switch to the next/previous location already prefetched
 *
 * @example
 * const data = {
 *   image_url: "https://www.w3schools.com/howto/img_avatar2.png",
 *   label: "Huddersfield College",
 *   location_id: 2,
 *   nav_next_id: null,
 *   nav_next_label: null,
 *   nav_prev_id: null,
 *   nav_prev_label: null,
 *   programme_id: 0,
 *   scenario_id: 0,
 *   text_with_placeholders: "For this scenario, the distance is <strong>{distance}</strong> km and the journey time is <strong>{duration}</strong> minutes.",
 *   values: {distance: 3, duration: 40},
 *   values_json: "{}"
 * };
 *
 * @returns {JSX.Element|null} The full-screen component or null if no current scenario
 */
export const FullScreenCalloutCardVisualisation = ({
  data,
  handleUpdatedData,
  handleChange,
  ...props
}) => {
  const sidebarIsOpen = props.sidebarIsOpen
  const [isVisible, setIsVisible] = useState(true);
  const handleToggle = () => setIsVisible((v) => !v);

  // the content that will be rendered
  const [content, setContent] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);

  // next and previous buttons
  const previousButtonRef = React.useRef(null);
  const [previousButtonRefIsHovered, setPreviousButtonRefIsHovered] =
    useState(false);
  const nextButtonRef = React.useRef(null);
  const [nextButtonRefIsHovered, setNextButtonRefIsHovered] = useState(false);

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
    const newContent = replacePlaceholders(
      data.text_with_placeholders,
      data.values
    );
    setContent(newContent);
    setImgUrl(null);

    if (data.image_url) {
      if (data.image_url instanceof Blob) {
        const url = URL.createObjectURL(data.image_url);
        setImgUrl(url);
      } else if (data.image_url instanceof ArrayBuffer) {
        const blob = new Blob([data.image_url], {
          type: "image/png",
        });
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } else if (data.image_url instanceof Uint8Array) {
        const blob = new Blob([data.image_url], {
          type: "image/png",
        });
        const url = URL.createObjectURL(blob);
        setImgUrl(url);
      } else if (typeof data.image_url === "string") {
        setImgUrl(data.image_url);
      }
    }
  }, [data]);

  // Check that data exists before rendering
  if (!data) {
    return null;
  }

  return (
    <>
      {!isVisible && (
        <OpenButton onClick={handleToggle} aria-label="Open card">
          <ChevronLeftIcon style={{ width: "20px", height: "20px" }} />
        </OpenButton>
      )}
      <FullscreenContainer $isVisible={isVisible} $sidebarIsOpen={sidebarIsOpen}>
        {/* Close button */}
        {isVisible && (
          <BackButton onClick={handleToggle} aria-label="Close card">
            <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
          </BackButton>
        )}

        {isVisible && (
          <ContentWrapper>
            {/* Title */}
            <CardTitle>{data.label || "Card"}</CardTitle>

            {/* Content */}
            <TitleImageTextWrapper>
              <TitleTextContainer>
                <Title style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}>
                  {data.label || "Card"}
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
                    alt={data.label || "Scenario image"}
                  />
                ) : (
                  <Image src={"https://placehold.co/600x400?text=No+image!"} />
                )}
              </ImageContainer>
            </TitleImageTextWrapper>
          </ContentWrapper>
        )}
        {/* Navigation */}
        {isVisible && (data.nav_next_id || data.nav_prev_id) && (
          <NavigationBar>
            <NavigationButton
              onClick={() => handleChange("previous")}
              disabled={data.nav_prev_id === null}
              ref={previousButtonRef}
              onMouseEnter={() => setPreviousButtonRefIsHovered(true)}
              onMouseLeave={() => setPreviousButtonRefIsHovered(false)}
              aria-label="Previous scenario"
              isHovered={handleUpdatedData(data.nav_prev_id, "previous")}
            >
              <ChevronLeftIcon />
            </NavigationButton>
            <Hovertip
              isVisible={previousButtonRefIsHovered}
              displayText={data.nav_prev_label}
              side="right"
              refElement={previousButtonRef}
              offset={3}
            />
            <NavigationButton
              onClick={() => handleChange("next")}
              disabled={data.nav_next_id === null}
              ref={nextButtonRef}
              onMouseEnter={() => setNextButtonRefIsHovered(true)}
              onMouseLeave={() => setNextButtonRefIsHovered(false)}
              isHovered={handleUpdatedData(data.nav_next_id, "next")}
              aria-label="Next scenario"
            >
              <ChevronRightIcon />
            </NavigationButton>
            <Hovertip
              isVisible={nextButtonRefIsHovered}
              displayText={data.nav_next_label}
              side="left"
              refElement={nextButtonRef}
              offset={3}
            />
          </NavigationBar>
        )}
      </FullscreenContainer>
    </>
  );
};
