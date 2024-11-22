import React, { useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { AccordionSection, TextSection } from "./Accordion";
import { SelectorSection } from "./Selectors";
import { Glossary } from "Components/Glossary";
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
  max-width: 270px
`;

const SidebarContainer = styled.div`
  width: 450px;
  max-height: calc(100vh - 235px);
  background-color: rgba(240, 240, 240, 0.65);
  padding: 10px;
  overflow-y: auto;
  text-align: left;
  position: fixed;
  left: ${({ $isVisible }) => ($isVisible ? "10px" : "-470px")};
  top: 85px;
  z-index: 1000;
  border-radius: 10px;
  scrollbar-width: none;
  transition: left 0.3s ease-in-out;
`;

const ToggleButton = styled.button`
  position: absolute;
  left: 420px;
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

  &:hover::after {
    content: ${({ $isVisible }) => ($isVisible ? "'Collapse Sidebar'" : "'Expand Sidebar'")};
    position: absolute;
    ${({ $isVisible }) => ($isVisible ? "right: 100%;" : "left: 100%;")}
    transform: translateX(0); /* No horizontal translation */
    background-color: black;
    color: white;
    padding: 5px;
    border-radius: 6px;
    font-size: 0.8em;
    white-space: nowrap;
  }
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

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      <SidebarContainer $isVisible={isVisible}>
        <SidebarHeader>
          {pageName || "Visualisation Framework"}
        </SidebarHeader>
      <ToggleButton $isVisible={isVisible} onClick={toggleSidebar} $bgColor={bgColor}>
        {isVisible ? <ChevronLeftIcon style={{ width: '20px', height: '20px' }} /> : <ChevronRightIcon style={{ width: '20px', height: '20px' }} />}
      </ToggleButton>
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
        {additionalFeatures.download && (
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