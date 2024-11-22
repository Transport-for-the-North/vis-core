import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';
import { darken } from "polished";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledToggle = styled.div`
  display: flex;
  border: 0.25px solid;
  border-radius: 5px;
  flex-grow: 1;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.$isSelected ? props.$bgColor : "white")};
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

  &:hover {
    background-color: ${(props) => (props.$isSelected ?  darken(0.1, props.$bgColor) : "white")};
    color: ${(props) => (props.$isSelected ? "white" : "black")};
  }
`;

const ToggleAllButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.$isSelected ? props.$bgColor : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  border-radius: 4px;
  border: 0.25px solid;
  margin-left: 10px;
  width: 80px; /* Fixed width */
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.$isSelected ?  darken(0.1, props.$bgColor) : "white")};
    color: ${(props) => (props.$isSelected ? "white" : "black")};
  }
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
export const Toggle = ({ filter, onChange, bgColor }) => {
  const { state: filterState } = useFilterContext();
  const [selectedButtons, setSelectedButtons] = useState(
    filterState[filter.id] || (filter.multiSelect ? [] : filter.values.values[0].paramValue)
  );

  useEffect(() => {
    setSelectedButtons(filterState[filter.id] || (filter.multiSelect ? [] : filter.values.values[0].paramValue));
  }, [filter.id, filter.multiSelect, filter.values.values]);

  const handleToggleChange = (newSelectedValue) => {
    if (filter.multiSelect) {
      let newSelectedButtons;
      if (selectedButtons.includes(newSelectedValue)) {
        newSelectedButtons = selectedButtons.filter(value => value !== newSelectedValue);
      } else {
        newSelectedButtons = [...selectedButtons, newSelectedValue];
      }
      onChange(filter, newSelectedButtons);
      setSelectedButtons(newSelectedButtons);
    } else {
      onChange(filter, newSelectedValue);
      setSelectedButtons(newSelectedValue);
    }
  };

  const handleToggleAll = () => {
    let newSelectedButtons;
    if (selectedButtons.length === filter.values.values.length) {
      newSelectedButtons = [];
    } else {
      newSelectedButtons = filter.values.values.map(option => option.paramValue);
    }
    onChange(filter, newSelectedButtons);
    setSelectedButtons(newSelectedButtons);
  };

  const options = filter.values.values;

  return (
    <Container>
      <StyledToggle>
        {options.map((option, index) => (
          <StyledButton
            key={option.paramValue}
            value={option.paramValue}
            onClick={() => handleToggleChange(option.paramValue)}
            $isSelected={filter.multiSelect ? selectedButtons.includes(option.paramValue) : selectedButtons === option.paramValue}
            size={options.length}
            index={index}
            $bgColor={bgColor}
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
      {filter.multiSelect && (
        <ToggleAllButton
          onClick={handleToggleAll}
          $isSelected={selectedButtons.length === filter.values.values.length}
          $bgColor={bgColor}
        >
          Toggle All
        </ToggleAllButton>
      )}
    </Container>
  );
};
