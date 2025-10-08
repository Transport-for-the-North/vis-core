import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { darken } from "polished";
import { AccordionSection, TextSection, AccordionIcon } from "./Accordion";
import { SelectorSection } from "./Selectors";
import { Glossary } from "Components/Glossary";
import { Hovertip, InfoBox } from 'Components';
import { DownloadSection } from "./Selectors/DownloadSelection";
import { FilterProvider } from "contexts";
import { getScrollbarWidth } from "utils";
import { MobileBar, SideIcon } from "../MobileBar/MobileBar";

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
  width: 450px;
  max-width: 95vw;
  max-height: calc(100vh - 235px);
  padding: 10px;
  padding-right: ${({ $isFirefox, $scrollbarWidth }) => $isFirefox ? `calc(10px - ${$scrollbarWidth}px)` : `6px`};
  box-sizing: border-box;
  background-color: rgba(240, 240, 240, 0.65);
  overflow-y: scroll;
  overflow-x: hidden;
  text-align: left;
  border-radius: 10px;
  transition: left 0.3s ease-in-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* Desktop: fixed sidebar */
  position: fixed;
  left: ${({ $isVisible }) => ($isVisible ? '10px' : '-470px')};
  top: 85px;
  z-index: 1000;

  /* Mobile/tablet: static sidebar */
  @media ${props => props.theme.mq.mobile} {
    position: static;
    left: auto;
    top: auto;
    max-width: 100%;
    width: 100%;
    max-haight: none;
    border-radius: 0;
    box-shadow: none;
    overflow-y: auto;
    z-index: 1001;
    display: ${({ $isVisible }) => ($isVisible ? 'block' : 'none')};
  }

  /* Custom Scrollbar Styles for non-Firefox browsers */
  ${({ $isFirefox }) => !$isFirefox && `
    /* Webkit-based browsers (Chrome, Safari, Edge) */
    &::-webkit-scrollbar {
      width: 4px; /* Custom scrollbar width */
    }
    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: transparent;
      border-radius: 10px;
      background-clip: padding-box;
      transition: background-color 0.3s ease-in-out;
    }
    &:hover::-webkit-scrollbar-thumb {
      background-color: darkgrey; /* Color when hovered */
    }
  `}

  /* Firefox-specific styles */
  ${({ $isFirefox }) => $isFirefox && `
    scrollbar-width: thin;
    scrollbar-color: transparent transparent; /* Default color */
    &:hover {
      scrollbar-color: darkgrey transparent; /* Color when hovered */
    }
  `}`;

const ToggleButton = styled.button`
  position: absolute;
  left: 392px;
  top: 25px;
  z-index: 1001;
  background-color: ${(props) => props.$bgColor};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: left 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px; /* Minimum touch target size */
  min-height: 32px; /* Minimum touch target size */

  ${({ $isVisible }) => !$isVisible && `
    position: fixed;
    top: 108px;
    left: 10px;
  `}

  @media ${props => props.theme.mq.mobile} {
    display: none; /* Hide on mobile */
  }

  @media (max-width: 460px) {
    left: auto;
    right: 10px;
    padding: 8px 16px;

    ${({ $isVisible }) => !$isVisible && `
      left: 10px;
      right: auto;
    `}
  }

  /* Touch interaction improvements */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation; /* Prevent zoom on touch */


  /* Conditional hover for non-touch devices */
  @media (hover: hover) and (pointer: fine) {
    &:hover {
      background-color: ${({ $bgColor }) => 
        $bgColor && darken(0.1, $bgColor)};
    }
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
 * @property {string} infoBoxText - Any text to appear at the top of the sidebar in an info box.
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
  infoBoxText,
  downloadPath,
  requestMethod,
  children
}) => {
  const initialMobile = typeof window !== 'undefined' ? window.innerWidth <= 900 : false; //detect if the viewport is ≤ 900px on first render.
  const [isVisible, setIsVisible] = useState(!initialMobile); //Defaults to open on desktop (!initialMobile) and closed on mobile.
  const [isMobile, setIsMobile] = useState(initialMobile); //tracks whether we’re currently in a mobile width (used to hide tooltips, switch icons, etc.)
  const [isHovered, setIsHovered] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const [isFirefox, setIsFirefox] = useState(false);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isFirefoxBrowser = ua.indexOf('firefox') > -1;
    setIsFirefox(isFirefoxBrowser);
    if (isFirefoxBrowser) {
      // Set the scrollbar width in state
      const width = getScrollbarWidth('thin');
      setScrollbarWidth(width);
    }
  }, []);

  //Keeps isMobile in sync as the window changes size.
  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setIsVisible(true);     // always visible on desktop
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isFirefox) {
        const width = getScrollbarWidth('thin');
        setScrollbarWidth(width);
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    // Initial calculation
    handleResize();
  
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    setIsHovered(false); // Reset hover state when toggling
  };

  return (
    <>
      {/* Mobile full-width toggle */}
      <MobileBar $bgColor={bgColor} onClick={toggleSidebar}>
        <span>Filters</span>
        <AccordionIcon $isOpen={isVisible} />
      </MobileBar>
      <SidebarContainer $isVisible={isVisible} $scrollbarWidth={scrollbarWidth} $isFirefox={isFirefox}>
        <SidebarHeader>
          {pageName || "Visualisation Framework"}
        </SidebarHeader>
        {infoBoxText && <InfoBox text={infoBoxText} />}
        <ToggleButton
          ref={toggleButtonRef}
          $isVisible={isVisible}
          onClick={toggleSidebar}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          $bgColor={bgColor}
        >
          {isMobile ? (
            <AccordionIcon $isOpen={isVisible} />
          ) : (
            <SideIcon $isOpen={isVisible} />
          )}
        </ToggleButton>
        {!isMobile && (
          <Hovertip
            isVisible={isHovered}
            displayText={isVisible ? "Collapse Sidebar" : "Expand Sidebar"}
            side="right"
            refElement={toggleButtonRef}
            alignVertical={true}
          />
        )}
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
            downloadPath={downloadPath}
            requestMethod={requestMethod || 'GET'}
          />
        )}
        {children} {/* Render additional AccordionSections passed as children */}
        {additionalFeatures?.download && (
          <FilterProvider>
            <DownloadSection
              filters={additionalFeatures.download.filters}
              downloadPath={additionalFeatures.download.downloadPath}
              bgColor={bgColor}
              requestMethod={additionalFeatures.download.requestMethod || 'GET'}
            />
          </FilterProvider>
        )}
        <TextSection title="Legal" text={legalText} />
      </SidebarContainer>
    </>
  );
};
