import React from "react";
import styled from "styled-components";
import { Dropdown } from "Components";
import { SelectorLabel } from "Components/Sidebar/Selectors/SelectorLabel";

/**
 * TopFilters
 * Compact, labeled top filter bar that renders each filter using the shared Dropdown.
 *
 * @param {{ filters: any[], onFilterChange: (filter:any, value:any)=>void }} props
 * @returns {JSX.Element}
 */
const FilterTile = styled.section`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: ${(p) => p.theme.borderRadius};
  padding: 8px 10px;
  margin-bottom: 8px;
  position: relative;
  z-index: 3;
  box-sizing: border-box;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterField = styled.div`
  min-width: 220px;
  max-width: 360px;
  flex: 1 1 260px;
`;

export function TopFilters({ filters, onFilterChange }) {
  return (
    <FilterTile>
      <FilterRow>
        {filters.map((filter) => (
          <FilterField key={filter.id}>
            <div style={{ marginBottom: 4, textAlign: "left" }}>
              <SelectorLabel text={filter.filterName} info={filter.info} />
            </div>
            <Dropdown filter={filter} onChange={onFilterChange} />
          </FilterField>
        ))}
      </FilterRow>
    </FilterTile>
  );
}