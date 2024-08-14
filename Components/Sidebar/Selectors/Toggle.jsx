import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';

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
  border-top-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")};
  border-bottom-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")};
  border-top-right-radius: ${(props) =>
    props.index === props.size - 1 ? "4px" : "0px"};
  border-bottom-right-radius: ${(props) =>
    props.index === props.size - 1 ? "4px" : "0px"};
  border-style: ${(props) =>
    props.index !== 0 ? "none none none solid" : "none"};
  border-width: 0.25px;
  width: ${(props) => 100 / props.size + "%"};
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.span`
  margin-left: 5px;
`;

/**
 * Renders a toggle switch component for selecting between multiple options.
 * @property {Object} filter - The filter object containing information about the toggle options.
 * @property {Array} filter.values - An array of objects representing the possible toggle values.
 * @property {string} filter.values[].paramValue - The parameter value associated with the option.
 * @property {string} filter.values[].displayValue - The display value shown to the user.
 * @property {boolean} [filter.values[].isValid] - The validity of the option.
 * @property {Function} onChange - The function called when a new toggle option is selected.
 * @returns {JSX.Element} The rendered Toggle component.
 */
export const Toggle = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();
  const [currentButton, setCurrentButton] = useState(
    filterState[filter.id] || filter.values.values[0].paramValue
  );

  useEffect(() => {
    setCurrentButton(filterState[filter.id] || filter.values.values[0].displayValue);
  }, [filterState]);

  const handleToggleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(
      (option) => option.paramValue === (isNaN(selectedValue) ? selectedValue : Number(selectedValue))
    );
    if (selectedOption) {
      onChange(filter, selectedOption.paramValue);
      setCurrentButton(selectedOption.displayValue);
    }
  };

  return (
    <StyledToggle>
      {filter.values.values.map((option, index) => (
        <StyledButton
          key={option.paramValue}
          value={option.displayValue}
          onClick={handleToggleChange}
          $isSelected={currentButton === option.displayValue}
          size={filter.values.values.length}
          index={index}
        >
          {option.displayValue}
          {option.isValid !== undefined && (
            <IconWrapper>
              {option.isValid ? '✅' : '⚠️'}
            </IconWrapper>
          )}
        </StyledButton>
      ))}
    </StyledToggle>
  );
};
