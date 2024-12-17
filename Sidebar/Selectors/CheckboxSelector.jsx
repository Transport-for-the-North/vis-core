import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFilterContext } from 'hooks';
import { darken } from 'polished';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const StyledCheckbox = styled.input`
  margin-right: 10px;
`;

const SelectAllButton = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${(props) => (props.$isSelected ? props.$bgColor : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  border-radius: 4px;
  border: 0.25px solid;
  font-family: "Hanken Grotesk", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.$isSelected ? darken(0.1, props.$bgColor) : "white")};
    color: ${(props) => (props.$isSelected ? "white" : "black")};
  }
`;

/**
 * CheckboxSelector component allows users to select multiple options from a list.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.filter - The filter object containing id, values, and multiSelect flag.
 * @param {Function} props.onChange - Callback function to handle changes in selection.
 * @param {string} props.bgColor - Background color for the select all button when selected.
 */
export const CheckboxSelector = ({ filter, onChange, bgColor }) => {
  const { state: filterState } = useFilterContext();

  const initialSelection = filter.values.values.reduce((acc, option) => {
    acc[option.displayValue] = false;
    return acc;
  }, {});

  const [selectedCheckboxes, setSelectedCheckboxes] = useState(
    filterState[filter.id] || initialSelection
  );

  useEffect(() => {
    setSelectedCheckboxes(filterState[filter.id] || initialSelection);
  }, [filter.id, filter.values.values]);

  const handleCheckboxChange = (displayValue, paramValue) => {
    let newSelectedCheckboxes;

    if (filter.multiSelect) {
      newSelectedCheckboxes = {
        ...selectedCheckboxes,
        [displayValue]: !selectedCheckboxes[displayValue],
      };
      const selectedValues = Object.keys(newSelectedCheckboxes)
        .filter(key => newSelectedCheckboxes[key])
        .map(key => filter.values.values.find(option => option.displayValue === key).paramValue)
        .join(',');
      onChange(filter, selectedValues);
    } else {
      newSelectedCheckboxes = {
        ...initialSelection,
        [displayValue]: !selectedCheckboxes[displayValue],
      };
      onChange(filter, newSelectedCheckboxes[displayValue]);
    }

    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedCheckboxes).every(Boolean);
    const newSelectedCheckboxes = Object.keys(selectedCheckboxes).reduce((acc, key) => {
      acc[key] = !allSelected;
      return acc;
    }, {});
    const selectedValues = Object.keys(newSelectedCheckboxes)
      .filter(key => newSelectedCheckboxes[key])
      .map(key => filter.values.values.find(option => option.displayValue === key).paramValue)
      .join(',');
    onChange(filter, selectedValues);
    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  const options = filter.values.values;

  return (
    <Container>
      {options.map((option) => (
        <CheckboxContainer key={option.paramValue}>
          <StyledCheckbox
            type="checkbox"
            id={option.paramValue}
            checked={!!selectedCheckboxes[option.displayValue]} // Ensure boolean value
            onChange={() => handleCheckboxChange(option.displayValue, option.paramValue)}
          />
          <label htmlFor={option.paramValue}>{option.displayValue}</label>
        </CheckboxContainer>
      ))}
      {filter.multiSelect && (
        <SelectAllButton
          onClick={handleSelectAll}
          $isSelected={Object.values(selectedCheckboxes).every(Boolean)}
          $bgColor={bgColor}
        >
          Select All
        </SelectAllButton>
      )}
    </Container>
  );
};