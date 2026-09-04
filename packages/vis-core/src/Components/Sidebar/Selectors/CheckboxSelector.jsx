import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFilterContext } from "hooks/useFilterContext";
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

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 10px;
`;

const SelectAllButton = styled.button`
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${(props) => (props.$isSelected ? props.$bgColor : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  border-radius: 4px;
  border: 0.25px solid;
  font-family: var(--font-family-base);
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
export const CheckboxSelector = ({ filter, onChange, bgColor, disabled, excludeValue }) => {
  const { state: filterState } = useFilterContext();

  const options = React.useMemo(() => {
    let opts = filter.values.values || [];
    if (excludeValue !== undefined && excludeValue !== null) {
      opts = opts.filter(o => String(o.paramValue) !== String(excludeValue));
    }
    return opts;
  }, [filter.values.values, excludeValue]);

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
    if (disabled) return;
    
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
    if (disabled) return;
    
    const allSelected = options.every(option => selectedCheckboxes[option.displayValue]);
    const newSelectedCheckboxes = { ...selectedCheckboxes };
    
    options.forEach(option => {
      newSelectedCheckboxes[option.displayValue] = !allSelected;
    });

    const selectedValues = Object.keys(newSelectedCheckboxes)
      .filter(key => newSelectedCheckboxes[key])
      .map(key => filter.values.values.find(option => option.displayValue === key)?.paramValue)
      .filter(Boolean)
      .join(',');
    onChange(filter, selectedValues);
    setSelectedCheckboxes(newSelectedCheckboxes);
  };

  return (
    <Container style={{ opacity: disabled ? 0.45 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
      {options.map((option) => {
        const checkboxId = `${filter.id || 'checkbox'}-${option.paramValue || option.displayValue}`;
        return (
        <CheckboxContainer key={option.displayValue}>
        <label htmlFor={checkboxId} style={{ display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          <StyledCheckbox
            id={checkboxId}
            checked={!!selectedCheckboxes[option.displayValue]} // Ensure boolean value
            onChange={() => handleCheckboxChange(option.displayValue, option.paramValue)}
            disabled={disabled}
          />
          {option.displayValue}
        </label>
      </CheckboxContainer>
      )})}
      {filter.multiSelect && (
        <SelectAllButton
          onClick={handleSelectAll}
          $isSelected={options.every(option => selectedCheckboxes[option.displayValue])}
          $bgColor={bgColor}
          disabled={disabled}
        >
          Select All
        </SelectAllButton>
      )}
    </Container>
  );
};