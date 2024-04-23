// import React, { useState, useEffect } from 'react';
import React from 'react';
import styled from 'styled-components';

// Styled components for the sidebar
const SidebarContainer = styled.div`
  width: 300px;
  background-color: #f0f0f0;
  padding: 20px;
  overflow-y: auto;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const StyledSlider = styled.input`
    width: 100%;
    /* Add any other CSS styles you want to apply to your slider here */
  `;

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const DropdownFilter = ({ filter, onChange }) => {
  
  return (
    <StyledDropdown onChange={(e) => onChange(filter.paramName, e.target.value)}>
      {filter.values.values.map((option) => (
        <option key={option.id} value={option.id}>
          {option.friendly}
        </option>
      ))}
    </StyledDropdown>
  );
};

const SliderFilter = ({ filter, onChange }) => {
  
  return (
    <StyledSlider
      type="range"
      min={filter.min}
      max={filter.max}
      step={filter.interval}
      onChange={(e) => onChange(filter.paramName, e.target.value)}
    />
  );
};

const Sidebar = ({ filters }) => {

  const handleFilterChange = (actionType, paramName, value) => {
    
    console.log(actionType)
    // if (actionType === 'getGeometry') {
    //   dispatch(updateGeometryFilter(paramName, value));
    // } else if (actionType === 'getVisData') {
    //   dispatch(updateVisDataFilter(paramName, value));
    // }
  };

  return (
    <SidebarContainer>
      {filters.map((filter) => (
        <FilterContainer key={filter.filterName}>
          <FilterLabel htmlFor={filter.paramName}>{filter.filterName}</FilterLabel>
          {filter.type === 'dropdown' && (
            <DropdownFilter
              key={filter.filterName}
              filter={filter}
              onChange={(paramName, value) =>
                handleFilterChange(filter.action, paramName, value)
              }
            />
          )}
          {filter.type === 'slider' && (
            <SliderFilter
              key={filter.filterName}
              filter={filter}
              onChange={(paramName, value) =>
                handleFilterChange(filter.action, paramName, value)
              }
            />
          )}
        </FilterContainer>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;