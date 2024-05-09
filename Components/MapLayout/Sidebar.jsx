import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import parse from "html-react-parser";

import { PageContext, AppContext } from "contexts";
import { useMapContext } from "hooks";
import { AccordionSection } from "Components";

const InfoButton = styled.button`
  background: #e6e6e6;
  border: none;
  padding: 0 5px 0 5px;
  margin-left: 5px;
  cursor: pointer;
  position: relative;
  border-radius: 2px;

  &:hover {
    background: #cccccc; // Change color on hover
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 9999; // Ensures it appears above all interface components
  bottom: 125%; // Positions the tooltip above the button
  left: 50%;
  margin-left: -60px; // Centers the tooltip
  opacity: 0;
  transition: opacity 0.3s;
  overflow: visible;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

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

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const FilterLabelWithInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const FilterLabel = ({ text, info }) => (
  <FilterLabelWithInfo>
    <span>{text}</span>
    {/* <InfoButton>
      ℹ
      <TooltipText>{info}</TooltipText>
    </InfoButton> */}
  </FilterLabelWithInfo>
);

const StyledSliderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledSlider = styled.input`
  flex: 3;
  width: 75%;
  margin-right: 10%;
`;

const SliderValue = styled.span`
  width: 25%;
  text-align: right;
  padding: 5px;
  background-color: #e6e6e6;
  border-radius: 4px;
`;

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

const DropdownFilter = ({ filter, onChange }) => {
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(
      (option) => option.displayValue === selectedValue
    );
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
  const [value, setValue] = useState(filter.min); // Initialize the state with the minimum value

  const getDisplayValue = (sliderValue) => {
    if (filter.displayAs) {
      const { operation, operand, unit } = filter.displayAs;
      let result = sliderValue;

      switch (operation) {
        case "divide":
          result = operand ? sliderValue / operand : sliderValue;
          break;
        // Add more cases for different operations if needed
        default:
          result = sliderValue;
      }

      return `${result} ${unit || ""}`;
    }
    return sliderValue;
  };

  const handleSliderChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue); // Update the state with the new value
    onChange(filter, newValue); // Call the onChange handler with the new value
  };

  return (
    <StyledSliderContainer>
      <StyledSlider
        type="range"
        min={filter.min}
        max={filter.max}
        step={filter.interval}
        value={value} // Set the value of the slider to the state value
        onChange={handleSliderChange}
      />
      <SliderValue>{getDisplayValue(value)}</SliderValue>
    </StyledSliderContainer>
  );
};

const Sidebar = () => {
  const { state, dispatch } = useMapContext();
  const pageContext = useContext(PageContext);
  const appContext = useContext(AppContext);
  const initializedRef = useRef(false); // Ref to track if initialisation has occurred
  // Destructure visualisations from state
  const { visualisations } = state;

  useEffect(() => {
    // Check if visualisations are ready and initialisation has not occurred yet
    if (!initializedRef.current && Object.keys(visualisations).length > 0) {
      // Initialize query params for each filter with a defaultValue
      pageContext.config.filters.forEach((filter) => {
        if (filter.action === "UPDATE_QUERY_PARAMS") {
          let defaultValue;
          if (filter.type === "dropdown") {
            defaultValue = filter.values?.values[0]?.paramValue;
          } else if (filter.type === "slider") {
            defaultValue = filter.min;
          }

          if (defaultValue !== undefined) {
            dispatch({
              type: filter.action,
              payload: { filter, value: defaultValue },
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
      payload: { filter, value },
    });
  };

  return (
    <SidebarContainer key={pageContext.pageName}>
      <SidebarHeader>
        {pageContext.pageName || "Visualisation Framework"}
      </SidebarHeader>
      <AccordionSection title="About this visualisation">
        <p>PLACEHOLDER</p>
      </AccordionSection>
      <AccordionSection
        title="Filtering and data selection"
        defaultValue={true}
      >
        {pageContext.config.filters.map((filter) => (
          <FilterContainer key={filter.filterName}>
            <FilterLabel
              htmlFor={filter.paramName}
              text={filter.filterName}
              info="Placeholder text for information"
            />
            {filter.type === "dropdown" && (
              <DropdownFilter
                key={filter.filterName}
                filter={filter}
                onChange={(filter, value) => handleFilterChange(filter, value)}
              />
            )}
            {filter.type === "slider" && (
              <SliderFilter
                key={filter.filterName}
                filter={filter}
                onChange={(filter, value) => handleFilterChange(filter, value)}
              />
            )}
          </FilterContainer>
        ))}
      </AccordionSection>
      <AccordionSection title="Legal Mentions">
        {parse(appContext.legalText)}
      </AccordionSection>
    </SidebarContainer>
  );
};

export default Sidebar;
