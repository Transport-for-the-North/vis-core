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
 * @property {number} [filter.defaultValue] - The default slider value (validated to be between min and max and divisible by the interval).
 * @property {Object} [filter.values] - An object containing source and values.
 * @property {string} [filter.values.source] - The source of the values.
 * @property {Array} [filter.values.values] - An array of value objects to display on the slider.
 * @property {Function} onChange - The function called when the slider value changes.
 * @returns {JSX.Element} The rendered Slider component.
 */
export const Slider = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();

  // Determine the initial value for the slider.
  // If using discrete values from filter.values, use the first item's paramValue.
  // Otherwise, if a defaultValue is provided, validate it; if invalid, fall back to filter.min.
  const initialValue = (() => {
    if (filter.values) {
      return filter.values.values[0].paramValue;
    } else {
      const { min, max, interval, defaultValue } = filter;
      if (defaultValue !== undefined) {
        if (
          defaultValue < min ||
          defaultValue > max ||
          ((defaultValue - min) % interval !== 0)
        ) {
          console.warn(
            `defaultValue (${defaultValue}) is invalid. It should be between ${min} and ${max} and divisible by the interval (${interval}). Using ${min} instead.`
          );
          return min;
        }
        return defaultValue;
      }
      return min;
    }
  })();

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
    if (filter.values) {
      const newIndex = parseInt(e.target.value, 10);
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
