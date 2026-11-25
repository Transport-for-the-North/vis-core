import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useFilterContext } from "hooks/useFilterContext";

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

const NumberInput = styled.input`
  width: 68px;
  text-align: right;
  padding: 4px 6px;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: inherit;
  color: inherit;

  &:focus {
    outline: 2px solid #0d0f3d;
    border-color: transparent;
  }
`;

const RangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const RangeTrackContainer = styled.div`
  position: relative;
  height: 22px;
  display: flex;
  align-items: center;
`;

const RangeTrackBase = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
`;

const RangeTrackActive = styled.div`
  position: absolute;
  height: 6px;
  background-color: #0d0f3d;
  border-radius: 3px;
`;

const DualRangeInput = styled.input`
  position: absolute;
  left: 0;
  width: 100%;
  margin: 0;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
  appearance: none;
  height: 6px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0d0f3d;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #0d0f3d;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
    cursor: pointer;
  }
`;

const RangeInputsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const RangeInputGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: #475569;
`;

/**
 * Renders a two-way range slider using `filter.min`, `filter.max`, and a paired max filter.
 */
const RangeSlider = ({ filter, filters, onChange, disabled }) => {
  const { state: filterState } = useFilterContext();
  const maxFilter = filter.maxParamName
    ? filters.find((f) => f.paramName === filter.maxParamName)
    : null;

  const trackMin = filter.min;
  const trackMax = filter.max;
  const step = filter.interval ?? 1;
  const initialMin = filter.defaultValue ?? trackMin;
  const currentMaxState = maxFilter ? filterState[maxFilter.id] : undefined;

  const [localMin, setLocalMin] = useState(filterState[filter.id] ?? initialMin);
  const [localMax, setLocalMax] = useState(currentMaxState ?? trackMax);
  const [minText, setMinText] = useState(String(filterState[filter.id] ?? initialMin));
  const [maxText, setMaxText] = useState(currentMaxState != null ? String(currentMaxState) : "");
  const draggingRef = useRef(false);

  useEffect(() => {
    if (draggingRef.current) return;
    const nextMin = filterState[filter.id] ?? initialMin;
    const nextMax = currentMaxState ?? trackMax;
    setLocalMin(nextMin);
    setLocalMax(nextMax);
    setMinText(String(nextMin));
    setMaxText(currentMaxState != null ? String(currentMaxState) : "");
  }, [filterState, filter.id, initialMin, currentMaxState, trackMax]);

  const commitMin = (num) => {
    const clamped = Math.max(trackMin, Number.isFinite(num) ? num : initialMin);
    const bounded = maxText !== "" && Number.isFinite(Number(maxText))
      ? Math.min(clamped, Number(maxText))
      : clamped;
    setLocalMin(bounded);
    setMinText(String(bounded));
    onChange(filter, bounded);
  };

  const commitMax = (raw) => {
    if (!maxFilter) return;
    const trimmed = String(raw).trim();
    if (trimmed === "") {
      setLocalMax(trackMax);
      setMaxText("");
      onChange(maxFilter, null);
      return;
    }
    const parsed = parseFloat(trimmed);
    if (!Number.isFinite(parsed)) {
      setMaxText(currentMaxState != null ? String(currentMaxState) : "");
      return;
    }
    const clamped = Math.max(parsed, localMin);
    setLocalMax(clamped);
    setMaxText(String(clamped));
    onChange(maxFilter, clamped);
  };

  const commitMinDrag = () => {
    draggingRef.current = false;
    onChange(filter, localMin);
  };

  const commitMaxDrag = () => {
    draggingRef.current = false;
    if (maxFilter) {
      onChange(maxFilter, localMax >= trackMax ? null : localMax);
    }
  };

  const span = trackMax - trackMin || 1;
  const minPct = Math.min(100, Math.max(0, ((Math.min(localMin, trackMax) - trackMin) / span) * 100));
  const maxPct = Math.min(100, Math.max(0, ((Math.min(localMax, trackMax) - trackMin) / span) * 100));

  return (
    <RangeWrapper
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <RangeTrackContainer>
        <RangeTrackBase />
        <RangeTrackActive
          style={{
            left: `${minPct}%`,
            width: `${Math.max(0, maxPct - minPct)}%`,
          }}
        />
        <DualRangeInput
          type="range"
          disabled={disabled}
          min={trackMin}
          max={trackMax}
          step={step}
          value={Math.min(localMin, trackMax)}
          aria-label={`${filter.filterName || "Range"} minimum`}
          style={{ zIndex: localMin > trackMax - step * 2 ? 4 : 3 }}
          onChange={(e) => {
            draggingRef.current = true;
            const next = Math.min(parseFloat(e.target.value), localMax);
            setLocalMin(next);
            setMinText(String(next));
          }}
          onMouseUp={commitMinDrag}
          onTouchEnd={commitMinDrag}
          onKeyUp={commitMinDrag}
        />
        <DualRangeInput
          type="range"
          disabled={disabled}
          min={trackMin}
          max={trackMax}
          step={step}
          value={Math.min(Math.max(localMax, localMin), trackMax)}
          aria-label={`${filter.filterName || "Range"} maximum`}
          style={{ zIndex: 3 }}
          onChange={(e) => {
            draggingRef.current = true;
            const next = Math.max(parseFloat(e.target.value), localMin);
            setLocalMax(next);
            setMaxText(next >= trackMax ? "" : String(next));
          }}
          onMouseUp={commitMaxDrag}
          onTouchEnd={commitMaxDrag}
          onKeyUp={commitMaxDrag}
        />
      </RangeTrackContainer>

      <RangeInputsRow>
        <RangeInputGroup>
          <span>Min</span>
          <NumberInput
            type="number"
            disabled={disabled}
            min={trackMin}
            step={step}
            value={minText}
            aria-label={`${filter.filterName || "Range"} minimum input`}
            onChange={(e) => setMinText(e.target.value)}
            onBlur={() => commitMin(parseFloat(minText))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitMin(parseFloat(minText));
                e.currentTarget.blur();
              }
            }}
          />
        </RangeInputGroup>

        <RangeInputGroup>
          <span>Max</span>
          <NumberInput
            type="number"
            disabled={disabled}
            min={trackMin}
            step={step}
            placeholder="No max"
            value={maxText}
            aria-label={`${filter.filterName || "Range"} maximum input`}
            onChange={(e) => setMaxText(e.target.value)}
            onBlur={() => commitMax(maxText)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commitMax(maxText);
                e.currentTarget.blur();
              }
            }}
          />
        </RangeInputGroup>
      </RangeInputsRow>
    </RangeWrapper>
  );
};

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
 * @property {Array} [filters] - Full list of filters (used to resolve paired max filter when isRange is true).
 * @property {Function} onChange - The function called when the slider value changes.
 * @returns {JSX.Element} The rendered Slider component.
 */
export const Slider = ({ filter, filters = [], onChange, disabled }) => {
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

  if (filter.isRange) {
    return (
      <RangeSlider
        filter={filter}
        filters={filters}
        onChange={onChange}
        disabled={disabled}
      />
    );
  }

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
    if (disabled) return;
    
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
    <StyledSliderContainer
      style={{
        opacity: disabled ? 0.45 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <StyledSlider
        type="range"
        disabled={disabled}
        aria-label={filter.filterName || filter.id || "Slider control"}
        {...sliderProps}
      />
      <SliderValue>{getDisplayValue(value)}</SliderValue>
    </StyledSliderContainer>
  );
};
