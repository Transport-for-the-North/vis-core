import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

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
`;

/**
 * Back button
 */
const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }

  &:hover {
    background-color: #f5f5f5;
    border-color: #ccc;

    svg {
      color: #333;
    }
  }
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

  /* Style pour l'icône */
  svg {
    width: 24px;
    height: 24px;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: #333;
  }
`;

const NavigationButtonWithTooltip = styled(NavigationButton)`
  &:hover + ${Tooltip} {
    opacity: 1;
    visibility: visible;
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
  content,
  title,
  includeCarouselNavigation,
  possibleCarouselNavData,
  onClose,
}) => {
  // props is load
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isIncludeCarouselNavigation, setIsIncludeCarouselNavigation] =
    useState(false);
  // index
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (content) setIsContentVisible(true);
    if (title) setIsTitleVisible(true);
    if (includeCarouselNavigation && possibleCarouselNavData)
      setIsIncludeCarouselNavigation(true);
  }, [content, title, includeCarouselNavigation, possibleCarouselNavData]);

  const handlePrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };
  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
    /* Fetch date here */
  };

  return (
    <FullscreenContainer>
      {/* Back button */}
      <BackButton onClick={onClose} aria-label="Fermer">
        <XMarkIcon />
      </BackButton>

      <ContentWrapper>
        {/* Title */}
        {isTitleVisible ? (
          <CardTitle>{title}</CardTitle>
        ) : (
          <CardTitle>Loading...</CardTitle>
        )}

        {/* Content */}
        {isContentVisible ? (
          <CardContent
            dangerouslySetInnerHTML={{ __html: content }}
          ></CardContent>
        ) : (
          <CardContent>
            <h3>Loading...</h3>
          </CardContent>
        )}
      </ContentWrapper>

      {/* Navigation */}
      {isIncludeCarouselNavigation && (
        <NavigationBar>
          <TooltipWrapper>
            <NavigationButtonWithTooltip
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeftIcon />
            </NavigationButtonWithTooltip>
            {currentIndex > 0 && (
              <Tooltip>
                {possibleCarouselNavData[currentIndex - 1].value}
              </Tooltip>
            )}
          </TooltipWrapper>
          <TooltipWrapper>
            <NavigationButtonWithTooltip
              onClick={handleNext}
              disabled={currentIndex === possibleCarouselNavData.length - 1}
            >
              <ChevronRightIcon />
            </NavigationButtonWithTooltip>
            {currentIndex < possibleCarouselNavData.length - 1 && (
              <Tooltip>
                {possibleCarouselNavData[currentIndex + 1].value}
              </Tooltip>
            )}
          </TooltipWrapper>
        </NavigationBar>
      )}
    </FullscreenContainer>
  );
};
