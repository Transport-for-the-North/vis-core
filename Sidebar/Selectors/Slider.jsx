import { useState } from 'react'
import styled from 'styled-components'


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

export const Slider = ({ filter, onChange }) => {
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