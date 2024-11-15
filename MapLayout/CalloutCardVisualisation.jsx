import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import DOMPurify from 'dompurify';

import { MapContext } from 'contexts';
import { useFetchVisualisationData } from 'hooks';

// Constants for dimensions and spacing
const CARD_WIDTH = 300;
const TOGGLE_BUTTON_WIDTH = 40;
const TOGGLE_BUTTON_HEIGHT = 30;
const PADDING = 10;

/**
 * Styled component for the card container.
 */
const CardContainer = styled.div`
  position: absolute;
  top: ${PADDING}px;
  right: ${PADDING}px;
  width: ${CARD_WIDTH}px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: ${PADDING}px;
  z-index: 1000;
  transition: transform 0.3s ease-in-out;
  transform: translateX(${({ $isVisible }) => ($isVisible ? '0' : `${CARD_WIDTH + PADDING * 3}px`)});
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
  margin-top: 8px;
  font-size: 1em;
  color: #666;
  text-align: left;
`;

/**
 * Styled component for the toggle button.
 */
const ToggleButton = styled.button`
  position: absolute;
  top: ${PADDING * 2}px;
  right: ${({ $isVisible }) =>
    $isVisible
      ? `${PADDING * 2 + CARD_WIDTH - TOGGLE_BUTTON_WIDTH}px`
      : `${PADDING}px`};
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

  &:hover::after {
    content: ${({ $isVisible }) => ($isVisible ? "'Hide Card'" : "'Show Card'")};
    position: absolute;
    right: 100%;
    transform: translateX(0);
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 6px;
    font-size: 0.8em;
    white-space: nowrap;
  }
`;

/**
 * CalloutCardVisualisation component to display a card-like element within the map.
 * It fetches data using the useFetchVisualisationData hook, uses an htmlFragment with
 * placeholders, sanitizes the HTML, and populates the placeholders with the fetched data.
 *
 * @param {Object} props - The component props.
 * @param {string} props.visualisationName - The name of the visualisation.
 * @returns {JSX.Element|null} The rendered CalloutCardVisualisation component.
 */
export const CalloutCardVisualisation = ({ visualisationName }) => {
  const { state } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];

  // const { isLoading, data } = useFetchVisualisationData(visualisation);
  const isLoading = false
  const data = {
    title: "Example Combined Authority",
    content: "Some example content"
  }
  // State to hold the rendered HTML content
  const [renderedContent, setRenderedContent] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Replaces placeholders in the HTML fragment with actual data.
   * Placeholders are denoted by {key}, where 'key' corresponds to a key in the data object.
   *
   * @param {string} htmlFragment - The HTML fragment containing placeholders.
   * @param {Object} data - The data object containing key-value pairs.
   * @returns {string} The HTML fragment with placeholders replaced.
   */
  const replacePlaceholders = (htmlFragment, data) => {
    // Use a regular expression to find all placeholders in the format {key}
    return htmlFragment.replace(/{(\w+)}/g, (match, key) => {
      // Replace the placeholder with the corresponding value from data
      return data[key] !== undefined ? data[key] : match;
    });
  };

  // Effect to replace placeholders in the HTML fragment with actual data and sanitize it
  useEffect(() => {
    if (data && visualisation.htmlFragment) {
      const htmlWithPlaceholdersReplaced = replacePlaceholders(visualisation.htmlFragment, data);
      // Sanitize the HTML to prevent XSS attacks
      const sanitizedHtml = DOMPurify.sanitize(htmlWithPlaceholdersReplaced);
      setRenderedContent(sanitizedHtml);
    }
  }, [data, visualisation.htmlFragment]);

  /**
   * Toggles the visibility of the card.
   */
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Render loading state if data is still being fetched
  if (isLoading) {
    return (
      <>
        <CardContainer $isVisible={isVisible}>
          Loading...
        </CardContainer>
        <ToggleButton $isVisible={isVisible} onClick={toggleVisibility}>
          {isVisible ? (
            <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
          ) : (
            <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
          )}
        </ToggleButton>
      </>
    );
  }

  // If there is no data to display, don't render the card
  if (!data || Object.keys(data).length === 0) {
    return null; // Don't render the card if there's no data
  }

  // Render the card with dynamic content
  return (
    <>
      <CardContainer $isVisible={isVisible}>
        <CardTitle>{visualisation.name}</CardTitle>
        <CardContent dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </CardContainer>
      <ToggleButton $isVisible={isVisible} onClick={toggleVisibility}>
        {isVisible ? (
          <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
        ) : (
          <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
        )}
      </ToggleButton>
    </>
  );
};
