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
 * Image, texte, title wrapper
 */
const TitleImageTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10%;
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

export const FullScreenCalloutCardVisualisation = ({
  data,
  includeCarouselNavigation,
  possibleCarouselNavData,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleToggle = () => setIsVisible((v) => !v);
  const [currentScenario, setCurrentScenario] = useState(data[0]);
  const [content, setContent] = useState(null);
  // next and previous buttons
  const previousButtonRef = React.useRef(null);
  const [previousButtonRefIsHovered, setPreviousButtonRefIsHovered] =
    useState(false);
  const nextButtonRef = React.useRef(null);
  const [nextButtonRefIsHovered, setNextButtonRefIsHovered] = useState(false);
  const currentIndex = data.findIndex(
    (item) => item.scenario_id === currentScenario.scenario_id
  );
  const [imgUrl, setImgUrl] = useState(null);

  // content to show
  useEffect(() => {
    if (currentScenario) {
      const newContent = replacePlaceholders(
        currentScenario.text_with_placeholders,
        currentScenario.values
      );
      setContent(newContent);
      setImgUrl(null);
      if (currentScenario.image) {
        if (currentScenario.image instanceof Blob) {
          // Blob (binary)
          const url = URL.createObjectURL(currentScenario.image);
          setImgUrl(url);
        } else if (currentScenario.image instanceof ArrayBuffer) {
          // ArrayBuffer (binary)
          const blob = new Blob([currentScenario.image], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setImgUrl(url);
        } else if (currentScenario.image instanceof Uint8Array) {
          // Uint8Array (binary)
          const blob = new Blob([currentScenario.image], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          setImgUrl(url);
        } else if (typeof currentScenario.image === "string") {
          // It is a URL
          setImgUrl(currentScenario.image);
        }
      }
    }
  }, [currentScenario]);

  useEffect(() => {
    if (data && data.length > 0) {
      setCurrentScenario(data[0]);
    }
  }, [data]);

  // Navigation for the carousel
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentScenario(data[currentIndex - 1]);
    }
  };
  const handleNext = () => {
    if (currentIndex < data.length - 1) {
      setCurrentScenario(data[currentIndex + 1]);
    }
  };

  return (
    <FullscreenContainer $isVisible={isVisible}>
      {/* Close button */}
      <BackButton onClick={handleToggle} aria-label="Close">
        <ChevronRightIcon style={{ width: "20px", height: "20px" }} />
      </BackButton>

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
              />
            ) : (
              <Image src={"https://placehold.co/600x400?text=No+image!"} />
            )}
          </ImageContainer>
        </TitleImageTextWrapper>
      </ContentWrapper>

      {/* Navigation */}
      {includeCarouselNavigation && (
        <NavigationBar>
          <NavigationButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            ref={previousButtonRef}
            onMouseEnter={() => setPreviousButtonRefIsHovered(true)}
            onMouseLeave={() => setPreviousButtonRefIsHovered(false)}
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
  );
};
