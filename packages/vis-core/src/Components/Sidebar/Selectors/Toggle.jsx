import React, { useEffect, useMemo, useState } from 'react';
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
  cursor: ${(props) => (props.$isHidden ? 'not-allowed' : 'pointer')};
  padding: 5px 2px;

  background-color: ${(props) =>
    props.$isHidden
      ? '#f2f2f2'
      : props.$isSelected
      ? props.$bgColor
      : 'white'};
  color: ${(props) =>
    props.$isHidden
      ? '#888'
      : props.$isSelected
      ? 'white'
      : 'black'};
  opacity: ${(props) => (props.$isHidden ? 0.45 : 1)};
  pointer-events: ${(props) => (props.$isHidden ? 'none' : 'auto')};

  border-top-left-radius: ${(props) => (props.index === 0 ? '4px' : '0px')};
  border-bottom-left-radius: ${(props) => (props.index === 0 ? '4px' : '0px')};
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
    background-color: ${(props) =>
      props.$isHidden
        ? '#f2f2f2'
        : props.$isSelected
        ? darken(0.1, props.$bgColor)
        : 'white'};
    color: ${(props) =>
      props.$isHidden
        ? '#888'
        : props.$isSelected
        ? 'white'
        : 'black'};
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
  font-family: 'Hanken Grotesk', sans-serif;
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
 * - Hidden options (isHidden) are displayed greyed-out and disabled.
 * - Fallbacks:
 *   - Single-select: if the selected option becomes hidden, fall back to the first visible option (or null if none).
 *   - Multi-select: automatically remove hidden selections; if all selected become hidden, fall back to "all visible".
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

  const options = filter.values.values;
  const visibleOptions = useMemo(
    () => options.filter((o) => !o.isHidden),
    [options]
  );

  const [selectedButtons, setSelectedButtons] = useState(
    filter.multiSelect
      ? Array.isArray(filterState[filter.id])
        ? filterState[filter.id]
        : []
      : filterState[filter.id] ?? options[0]?.paramValue ?? null
  );

  // Keep local state in sync with FilterContext and options
  useEffect(() => {
    setSelectedButtons(
      filter.multiSelect
        ? Array.isArray(filterState[filter.id])
          ? filterState[filter.id]
          : []
        : filterState[filter.id] ?? options[0]?.paramValue ?? null
    );
  }, [filter.id, filter.multiSelect, options, filterState]);

  /**
   * Fallbacks when selected option(s) become hidden due to validation/filtering.
   * - Single-select: switch to first visible option or null.
   * - Multi-select: prune hidden selections; if empty after pruning, select all visible.
   */
  useEffect(() => {
    const current = filterState[filter.id];

    if (!filter.multiSelect) {
      const currentlyHidden = options.find((o) => o.paramValue === current)?.isHidden;
      if (currentlyHidden) {
        const fallback = visibleOptions[0]?.paramValue ?? null;
        onChange(filter, fallback);
        setSelectedButtons(fallback);
      }
    } else {
      const currentArr = Array.isArray(current) ? current : [];
      const visibleSet = new Set(visibleOptions.map((o) => o.paramValue));
      const pruned = currentArr.filter((v) => visibleSet.has(v));

      if (pruned.length !== currentArr.length) {
        if (pruned.length === 0) {
          const fallbackAll = visibleOptions.map((o) => o.paramValue);
          onChange(filter, fallbackAll);
          setSelectedButtons(fallbackAll);
        } else {
          onChange(filter, pruned);
          setSelectedButtons(pruned);
        }
      }
    }
  }, [options, visibleOptions, filterState, filter, onChange]);

  const handleToggleChange = (newSelectedValue) => {
    // Prevent selecting hidden options
    const isHidden = options.find((o) => o.paramValue === newSelectedValue)?.isHidden;
    if (isHidden) return;

    if (filter.multiSelect) {
      const current = Array.isArray(selectedButtons) ? selectedButtons : [];
      let next;
      if (current.includes(newSelectedValue)) {
        next = current.filter((v) => v !== newSelectedValue);
      } else {
        next = [...current, newSelectedValue];
      }
      onChange(filter, next);
      setSelectedButtons(next);
    } else {
      onChange(filter, newSelectedValue);
      setSelectedButtons(newSelectedValue);
    }
  };

  /**
   * Toggle-all respects visibility. It toggles only the non-hidden options.
   */
  const handleToggleAll = () => {
    const current = Array.isArray(selectedButtons) ? selectedButtons : [];
    const visibleValues = visibleOptions.map((o) => o.paramValue);

    const isAllVisibleSelected =
      current.length === visibleValues.length &&
      current.every((v) => visibleValues.includes(v));

    const next = isAllVisibleSelected ? [] : visibleValues;
    onChange(filter, next);
    setSelectedButtons(next);
  };

  return (
    <Container>
      <StyledToggle>
        {options.map((option, index) => (
          <StyledButton
            key={option.paramValue}
            value={option.paramValue}
            onClick={() => handleToggleChange(option.paramValue)}
            $isSelected={
              filter.multiSelect
                ? Array.isArray(selectedButtons) &&
                  selectedButtons.includes(option.paramValue)
                : selectedButtons === option.paramValue
            }
            $isHidden={!!option.isHidden}
            size={options.length}
            index={index}
            $bgColor={bgColor}
            aria-disabled={!!option.isHidden}
            title={option.isHidden ? 'Unavailable due to current selection' : undefined}
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
          $isSelected={
            Array.isArray(selectedButtons) &&
            selectedButtons.length === visibleOptions.length &&
            selectedButtons.every((v) =>
              visibleOptions.some((o) => o.paramValue === v)
            )
          }
          $bgColor={bgColor}
        >
          Toggle All
        </ToggleAllButton>
      )}
    </Container>
  );
};
