import React, { useState, useRef } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { AccordionSection, TextSection } from "./Accordion";
import { SelectorSection } from "./Selectors";
import { Glossary } from "Components/Glossary";
import { Hovertip } from 'Components';
import { DownloadSection } from "./Selectors/DownloadSelection";
import { FilterProvider } from "contexts";

// Styled components for the sidebar
const SidebarHeader = styled.h2`
  font-size: 1.2em;
  color: #4b3e91;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  color: #333;
  user-select: none;
  background-color: rgba(255, 255, 255, 0);
  max-width: 270px;
`;

const SidebarContainer = styled.div`
  --scrollbar-width: 4px; /* Default scrollbar width for Webkit browsers */
  --firefox-scrollbar-width: 8px; /* Approximate scrollbar width for Firefox */

  width: 450px;
  max-width: 95vw;
  max-height: calc(100vh - 235px);
  padding: 10px;
  padding-right: calc(10px - var(--scrollbar-width)); /* Adjust padding for Webkit */
  box-sizing: border-box; /* Include padding and border in width */
  background-color: rgba(240, 240, 240, 0.65);
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;
  position: fixed;
  left: ${({ $isVisible }) => ($isVisible ? '10px' : '-470px')};
  top: 85px;
  z-index: 1000;
  border-radius: 10px;
  transition: left 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* Webkit-based browsers (Chrome, Safari, Edge) */
  /* Custom Scrollbar Styles */
  &::-webkit-scrollbar {
    width: var(--scrollbar-width);
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent; /* Default color */
    border-radius: 10px;
    background-clip: padding-box;
    transition: background-color 0.3s ease-in-out;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: darkgrey; /* Color when hovered */
  }

  /* Firefox-specific styles */
  @-moz-document url-prefix() {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent; /* Default color */
    padding-right: calc(10px - var(--firefox-scrollbar-width)); /* Adjust padding for Firefox */
    &:hover {
      scrollbar-color: darkgrey transparent; /* Color when hovered */
    }
  }
`;


const ToggleButton = styled.button`
  position: absolute;
  left: 400px;
  top: 25px;
  z-index: 1001;
  background-color: ${(props) => props.$bgColor}; /* Access the $bgColor prop */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: left 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isVisible }) => !$isVisible && `
    position: fixed;
    top: 108px;
    left: 10px;
  `}
`;

/**
 * Sidebar component represents a sidebar layout for displaying additional information and options.
 * It contains sections such as about visualisation, filters, additional sections, and legal information.
 * @component
 * @property {string} pageName - The name of the page or visualisation framework displayed in the sidebar header.
 * @property {string} aboutVisualisationText - The text providing information about the visualisation.
 * @property {Array} filters - An array of filter objects used for selecting data options.
 * @property {string} legalText - The legal information text displayed in the sidebar.
 * @property {function} onFilterChange - A function to handle filter changes.
 * @property {React.ReactNode} children - Additional React components or elements to be rendered within the sidebar.
 * @returns {JSX.Element} The rendered Sidebar component.
 */
export const Sidebar = ({
  pageName,
  aboutVisualisationText,
  filters,
  legalText,
  onFilterChange,
  bgColor,
  additionalFeatures,
  children
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const toggleButtonRef = useRef(null);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    setIsHovered(false); // Reset hover state when toggling
  };

  return (
    <>
      <SidebarContainer $isVisible={isVisible}>
        <SidebarHeader>
          {pageName || "Visualisation Framework"}
        </SidebarHeader>
        <ToggleButton
          ref={toggleButtonRef}
          $isVisible={isVisible}
          onClick={toggleSidebar}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          $bgColor={bgColor}
        >
          {isVisible ? <ChevronLeftIcon style={{ width: '20px', height: '20px' }} /> : <ChevronRightIcon style={{ width: '20px', height: '20px' }} />}
        </ToggleButton>
        <Hovertip
          isVisible={isHovered}
          displayText={isVisible ? "Collapse Sidebar" : "Expand Sidebar"}
          side="right"
          refElement={toggleButtonRef}
          alignVertical={true}
        />
        <TextSection title="About this visualisation" text={aboutVisualisationText} />
        {additionalFeatures?.glossary && (
          <AccordionSection title="Glossary">
            <Glossary dataDictionary={additionalFeatures.glossary.dataDictionary} />
          </AccordionSection>
        )}
        {filters && (
          <SelectorSection
            filters={filters}
            onFilterChange={(filter, value) => onFilterChange(filter, value)}
            bgColor={bgColor}
          />
        )}
        {children} {/* Render additional AccordionSections passed as children */}
        {additionalFeatures?.download && (
          <FilterProvider>
            <DownloadSection
              filters={additionalFeatures.download.filters}
              downloadPath={additionalFeatures.download.downloadPath}
              bgColor={bgColor}
            />
          </FilterProvider>
        )}
        <TextSection title="Legal" text={legalText} />
      </SidebarContainer>
    </>
  );
};
