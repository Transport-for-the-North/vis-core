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
 * Renders a slider input element for selecting a numeric value within a specified range or from an array of values.
 * @property {Object} filter - The filter object containing information about the slider.
 * @property {number} [filter.min] - The minimum value of the slider.
 * @property {number} [filter.max] - The maximum value of the slider.
 * @property {number} [filter.interval] - The interval between each selectable value on the slider.
 * @property {Object} [filter.values] - An object containing source and values.
 * @property {string} [filter.values.source] - The source of the values.
 * @property {Array} [filter.values.values] - An array of value objects to display on the slider.
 * @property {Function} onChange - The function called when the slider value changes.
 * @returns {JSX.Element} The rendered Slider component.
 */
export const Slider = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();

  // Set the initial value
  const initialValue = filter.values
    ? filter.values.values[0].paramValue
    : filter.min;

  const [value, setValue] = useState(filterState[filter.id] || initialValue);

  useEffect(() => {
    setValue(filterState[filter.id] || initialValue);
  }, [filterState, filter.id, initialValue]);

  const getDisplayValue = (sliderValue) => {
    if (filter.values) {
      // Find the item with the matching paramValue
      const selectedItem = filter.values.values.find(
        (item) => item.paramValue === sliderValue
      );
      return selectedItem ? selectedItem.displayValue : sliderValue;
    } else if (filter.displayAs) {
      const { operation, operand, unit } = filter.displayAs;
      let result = sliderValue;

      switch (operation) {
        case 'divide':
          result = operand ? sliderValue / operand : sliderValue;
          break;
        // Add more cases for different operations if needed
        default:
          result = sliderValue;
      }

      return `${result} ${unit || ''}`;
    }
    return sliderValue;
  };

  const handleSliderChange = (e) => {
    const newIndex = parseInt(e.target.value, 10);
    if (filter.values) {
      const newItem = filter.values.values[newIndex];
      const newValue = newItem.paramValue;
      setValue(newValue);
      onChange(filter, newValue);
    } else {
      const newValue = parseFloat(e.target.value);
      setValue(newValue);
      onChange(filter, newValue);
    }
  };

  // Note that the handling here means filter.values and specifying a min and max are mutually exclusive.
  const sliderProps = filter.values
    ? {
        min: 0,
        max: filter.values.values.length - 1,
        step: 1,
        value: filter.values.values.findIndex(
          (item) => item.paramValue === value
        ),
        onChange: handleSliderChange,
      }
    : {
        min: filter.min,
        max: filter.max,
        step: filter.interval,
        value: value,
        onChange: handleSliderChange,
      };

  return (
    <StyledSliderContainer>
      <StyledSlider type="range" {...sliderProps} />
      <SliderValue>{getDisplayValue(value)}</SliderValue>
    </StyledSliderContainer>
  );
};
