import React, { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { PageContext } from 'contexts';
import { useMapContext } from 'hooks';

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
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(option => option.displayValue === selectedValue);
    if (selectedOption) {
      onChange(filter, selectedOption.paramValue);
    }
  };

  return (
    <StyledDropdown onChange={handleDropdownChange}>
      {filter.values.values.map((option) => (
        <option key={option.paramValue} value={option.displayValue}>
          {option.displayValue}
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
      onChange={(e) => onChange(filter, e.target.value)}
    />
  );
};


const Sidebar = () => {
  const { state, dispatch } = useMapContext();
  const pageContext = useContext(PageContext);
  const initializedRef = useRef(false); // Ref to track if initialisation has occurred
  // Destructure visualisations from state
  const { visualisations } = state;

  useEffect(() => {
    // Check if visualisations are ready and initialisation has not occurred yet
    if (!initializedRef.current && Object.keys(visualisations).length > 0) {
      // Initialize query params for each filter with a defaultValue
      pageContext.config.filters.forEach((filter) => {
        if (filter.action === 'UPDATE_QUERY_PARAMS') {
          const defaultValue = filter.values?.values[0]?.paramValue;
          if (defaultValue !== undefined) {
            dispatch({
              type: filter.action,
              payload: { filter, value: defaultValue }
            });
          }
        }
      });
      // Mark initialisation as done
      initializedRef.current = true;
    }
  }, [pageContext.config.filters, dispatch, visualisations]);

  const handleFilterChange = (filter, value) => {
    dispatch({
      type: filter.action,
      payload: { filter, value }
    });
  };

  return (
    <SidebarContainer key={pageContext.pageName}>
      {pageContext.config.filters.map((filter) => (
        <FilterContainer key={filter.filterName}>
          <FilterLabel htmlFor={filter.paramName}>{filter.filterName}</FilterLabel>
          {filter.type === 'dropdown' && (
            <DropdownFilter
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) =>
                handleFilterChange(filter, value)
              }
            />
          )}
          {filter.type === 'slider' && (
            <SliderFilter
              key={filter.filterName}
              filter={filter}
              onChange={(filter, value) =>
                handleFilterChange(filter, value)
              }
            />
          )}
        </FilterContainer>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar;