import React, { useState } from "react";
import styled from "styled-components";
import { FilterProvider } from "contexts";
import { Glossary } from "Components/Glossary";
import { AccordionSection, TextSection, AccordionIcon } from "../Sidebar/Accordion";
import { MobileBar } from "../MobileBar/MobileBar";
import { Dropdown } from "../Sidebar/Selectors/Dropdown";
import { Slider } from "../Sidebar/Selectors/Slider";
import { Toggle } from "../Sidebar/Selectors/Toggle";
import { CheckboxSelector } from "../Sidebar/Selectors/CheckboxSelector";
import { SelectorLabel } from "../Sidebar/Selectors/SelectorLabel";
import { DownloadSection } from "../Sidebar/Selectors/DownloadSelection";

const SidebarShell = styled.aside`
  width: 450px;
  max-width: 95vw;
  box-sizing: border-box;
  align-self: flex-start;
  position: sticky;
  top: 85px;
  max-height: calc(100vh - 120px);
  z-index: 10;

  @media ${(props) => props.theme.mq.mobile} {
    width: 100%;
    max-width: 100%;
    position: static;
    top: auto;
    max-height: none;
  }
`;

const SidebarContainer = styled.div`
  padding: 10px;
  background-color: rgba(240, 240, 240, 0.65);
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: inherit;

  @media ${(props) => props.theme.mq.mobile} {
    display: ${({ $isVisible }) => ($isVisible ? "block" : "none")};
    max-height: none;
    border-radius: 0;
    box-shadow: none;
    padding: 10px 12px;
  }
`;

const SelectorContainer = styled.div`
  margin-bottom: 10px;
`;

/**
 * DashboardSidebarFilters renders filter controls (dropdowns, sliders, toggles, checkboxes) for the dashboard.
 *
 * @param {Object} props - Component properties
 * @param {Array} props.filters - List of filter configuration objects
 * @param {Function} props.onFilterChange - Callback for filter value changes
 * @param {string} props.bgColor - Optional background colour for controls
 * @returns {JSX.Element}
 */
function DashboardSidebarFilters({
  filters,
  onFilterChange,
  bgColor,
}) {
  // Render the appropriate filter control for each filter type
  const renderFilterControl = (filter) => {
    switch (filter.type) {
      case "dropdown":
        return <Dropdown filter={filter} onChange={onFilterChange} />;
      case "slider":
        return <Slider filter={filter} onChange={onFilterChange} />;
      case "toggle":
        return <Toggle filter={filter} onChange={onFilterChange} bgColor={bgColor} />;
      case "checkbox":
        return <CheckboxSelector filter={filter} onChange={onFilterChange} bgColor={bgColor} />;
      default:
        return null;
    }
  };

  // Only render non-fixed, non-hidden filters
  return (
    <AccordionSection title="Filtering and data selection" defaultValue={true}>
      {(filters || [])
        .filter((filter) => !["fixed", "hidetoggle", "mapViewport"].includes(filter.type))
        .map((filter) => (
          <SelectorContainer key={filter.id}>
            <SelectorLabel
              htmlFor={filter.paramName}
              text={filter.filterName}
              info={filter.info ?? null}
            />
            {renderFilterControl(filter)}
          </SelectorContainer>
        ))}
    </AccordionSection>
  );
}

/**
 * DashboardSidebar is the main sidebar for the dashboard, containing filters, glossary, downloads, and legal information.
 *
 * - Renders filter controls, glossary, download section, and legal text
 * - Responsive for mobile/desktop
 *
 * @param {Object} props - Component properties
 * @param {string} props.legalText - Optional legal disclaimer text
 * @param {Array} props.filters - List of filter configuration objects
 * @param {Function} props.onFilterChange - Callback for filter value changes
 * @param {string} props.bgColor - Optional background colour for controls
 * @param {Object} props.additionalFeatures - Optional features (glossary, download)
 * @returns {JSX.Element}
 */
export function DashboardSidebar({
  legalText,
  filters,
  onFilterChange,
  bgColor,
  additionalFeatures,
}) {
  // Show sidebar as hidden on mobile by default
  const initialMobile = typeof window !== "undefined" ? window.innerWidth <= 900 : false;
  const [isVisible, setIsVisible] = useState(!initialMobile);

  // Sidebar layout with mobile toggle, filters, glossary, download, and legal information
  return (
    <SidebarShell>
      <MobileBar $bgColor={bgColor} onClick={() => setIsVisible((current) => !current)}>
        <span>Filters</span>
        <AccordionIcon $isOpen={isVisible} />
      </MobileBar>

      <SidebarContainer $isVisible={isVisible}>
        <DashboardSidebarFilters
          filters={filters}
          onFilterChange={onFilterChange}
          bgColor={bgColor}
        />

        {additionalFeatures?.glossary?.dataDictionary ? (
          <AccordionSection title="Glossary">
            <Glossary dataDictionary={additionalFeatures.glossary.dataDictionary} />
          </AccordionSection>
        ) : null}

        {additionalFeatures?.download?.downloadPath ? (
          <FilterProvider>
            <DownloadSection
              filters={additionalFeatures.download.filters || filters}
              downloadPath={additionalFeatures.download.downloadPath}
              bgColor={bgColor}
              requestMethod={additionalFeatures.download.requestMethod || "GET"}
            />
          </FilterProvider>
        ) : null}

        {legalText ? <TextSection title="Legal" text={legalText} /> : null}
      </SidebarContainer>
    </SidebarShell>
  );
}

export default DashboardSidebar;