import styled from "styled-components";
import { useState } from "react";

const StyledToggle = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  border: 0.25px solid;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.$isSelected ? "#7317DE" : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  //These lines are to verify if the button is at the far left and then add a border-radius on the left to be sure not overlapping the box borders
  border-top-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")}; 
  border-bottom-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")};
  //These lines are to verify if the button is at the far right and then add a border-radius on the right to be sure not overlapping the box borders
  border-top-right-radius: ${(props) => (props.index === props.size-1 ? "4px" : "0px")};
  border-bottom-right-radius: ${(props) => (props.index === props.size - 1 ? "4px" : "0px")};
  //If the button is not at one of the extremities, add some border to make a separation
  border-style: ${(props) => (props.index !== 0 ? "none none none solid" : "none")};
  border-width: 0.25px;
  width: ${(props) => 100 / props.size + "%"};
  font-family: 'Hanken Grotesk', sans-serif;
`;

/**
 * Renders a toggle switch component for selecting between multiple options.
 * @property {Object} filter - The filter object containing information about the toggle options.
 * @property {Array} filter.values - An array of objects representing the possible toggle values.
 * @property {string} filter.values[].paramValue - The parameter value associated with the option.
 * @property {string} filter.values[].displayValue - The display value shown to the user.
 * @property {Function} onChange - The function called when a new toggle option is selected.
 * @returns {JSX.Element} The rendered Toggle component.
 */
export const Toggle = ({ filter, onChange }) => {
  const [currentButton, setCurrentButton] = useState(filter.values.values[0]);

  const handleToggleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(
      (option) => option.displayValue === selectedValue
    );
    if (selectedOption) {
      onChange(filter, selectedOption.paramValue);
      setCurrentButton(selectedOption);
    }
  };

  return (
    <StyledToggle>
      {filter.values.values.map((option, index) => (
        <StyledButton
          key={option.paramValue}
          value={option.displayValue}
          onClick={handleToggleChange}
          $isSelected={currentButton.displayValue === option.displayValue}
          size={filter.values.values.length}
          index={index}
        >
          {option.displayValue}
        </StyledButton>
      ))}
    </StyledToggle>
  );
};
