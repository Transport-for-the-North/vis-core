import styled from "styled-components";

import { TextSection } from "./Accordion";
import { SelectorSection } from "./Selectors";


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
`;

const SidebarContainer = styled.div`
  width: 300px;
  max-height: calc(100vh - 235px);
  background-color: rgba(240, 240, 240, 0.65);
  padding: 10px;
  overflow-y: auto;
  text-align: left;
  position: fixed;
  left: 10px;
  top: 85px;
  z-index: 1000;
  border-radius: 10px;
  backdrop-filter: blur(8px);
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`;

export const Sidebar = ({
  pageName,
  aboutVisualisationText,
  filters,
  legalText,
  onFilterChange,
  children, // Accept children props
}) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        {pageName || "Visualisation Framework"}
      </SidebarHeader>
      <TextSection title="About this visualisation" text={aboutVisualisationText} />
      {filters && (
        <SelectorSection
          filters={filters}
          onFilterChange={(filter, value) => onFilterChange(filter, value)}
        />
      )}
      {children} {/* Render additional AccordionSections passed as children */}
      <TextSection title="Legal" text={legalText} />
    </SidebarContainer>
  );
};
