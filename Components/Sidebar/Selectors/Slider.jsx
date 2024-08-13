import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';

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

/**
 * Renders a slider input element for selecting a numeric value within a specified range.
 * @property {Object} filter - The filter object containing information about the slider.
 * @property {number} filter.min - The minimum value of the slider.
 * @property {number} filter.max - The maximum value of the slider.
 * @property {number} filter.interval - The interval between each selectable value on the slider.
 * @property {Object} filter.displayAs - An optional object specifying how the slider value should be displayed.
 * @property {string} filter.displayAs.operation - The operation to apply to the slider value for display.
 * @property {number} [filter.displayAs.operand] - The operand to be used in the display operation.
 * @property {string} [filter.displayAs.unit] - The unit to display along with the slider value.
 * @property {Function} onChange - The function called when the slider value changes.
 * @returns {JSX.Element} The rendered Slider component.
 */
export const Slider = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();
  const [value, setValue] = useState(filterState[filter.id] || filter.min);

  useEffect(() => {
    setValue(filterState[filter.id] || filter.min);
  }, [filterState, filter.id, filter.min]);

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
