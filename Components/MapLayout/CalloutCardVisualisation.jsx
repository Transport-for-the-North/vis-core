import React, { useEffect, useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import DOMPurify from 'dompurify';

import { MapContext } from 'contexts';
import { useFetchVisualisationData } from 'hooks';
import { replacePlaceholders } from 'utils';
import { Hovertip } from 'Components';

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
  width: ${({ $isVisible }) => ($isVisible ? `${CARD_WIDTH + PADDING * 2}px` : `${TOGGLE_BUTTON_WIDTH + PADDING}px`)};
  transition: width 0.3s ease-in-out;
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
  transform: translateX(${({ $isVisible }) => ($isVisible ? '0' : `100%`)});
  overflow: hidden; /* Prevent content overflow */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  height: ${({ $isVisible }) => ($isVisible ? 'auto' : `${PADDING * 2}px`)};
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
 * It fetches data using the useFetchVisualisationData hook, uses an htmlFragment with
 * placeholders, sanitizes the HTML, and populates the placeholders with the fetched data.
 *
 * @param {Object} props - The component props.
 * @param {string} props.visualisationName - The name of the visualisation.
 * @param {string} [props.cardName] - Optional name for the card.
 * @returns {JSX.Element|null} The rendered CalloutCardVisualisation component.
 */
export const CalloutCardVisualisation = ({ visualisationName, cardName }) => {
  const { state } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];
  const buttonRef = useRef(null);

  const { isLoading, data } = useFetchVisualisationData(visualisation);

  // State to hold the rendered HTML content
  const [renderedContent, setRenderedContent] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Effect to replace placeholders in the HTML fragment with actual data and sanitize it
  useEffect(() => {
    if (data && visualisation.htmlFragment) {
      setIsVisible(true);
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
        <ToggleButton
          ref={buttonRef}
          $isVisible={isVisible}
          onClick={toggleVisibility}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isVisible ? (
            <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
          ) : (
            <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
          )}
        </ToggleButton>
        <Hovertip
          isVisible={isHovered}
          displayText={isVisible ? `Hide ${cardName || 'Card'}` : `Show ${cardName || 'Card'}`}
          side="left"
          refElement={buttonRef}
          offset={5}
        />
        </ParentContainer>
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
      <ParentContainer $isVisible={isVisible}>
      <CardContainer $isVisible={isVisible}>
        <CardTitle>{cardName}</CardTitle>
        <CardContent dangerouslySetInnerHTML={{ __html: renderedContent }} />
      </CardContainer>
      <ToggleButton
          ref={buttonRef}
          $isVisible={isVisible}
          onClick={toggleVisibility}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          cardName={cardName}
        >
        {isVisible ? (
          <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
        ) : (
          <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
        )}
      </ToggleButton>
      <Hovertip
        isVisible={isHovered}
        displayText={isVisible ? `Hide ${cardName || 'Card'}` : `Show ${cardName || 'Card'}`}
        side="left"
        refElement={buttonRef}
        offset={5}
        
      />
      </ParentContainer>
    </>
  );
};