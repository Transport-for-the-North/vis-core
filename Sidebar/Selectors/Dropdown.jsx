import React, { useMemo, useEffect, useState, useRef } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import styled from 'styled-components';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useFilterContext } from 'hooks';
import { SelectorLabel } from '.';

const CONTROL_COLOUR = 'rgb(220, 220, 220)';
const CONTROL_BORDER_RADIUS = 6;

// Custom style for the react-select options
const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9998,
  }),
  control: (base, state) => ({
    ...base,
    borderColor: CONTROL_COLOUR,
    borderRadius: CONTROL_BORDER_RADIUS,
    boxShadow: state.isFocused ? '0 0 0 1px rgba(0, 0, 0, 0.06)' : 'none',
    '&:hover': {
      borderColor: CONTROL_COLOUR,
    },
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    display: 'flex',
    fontSize: '0.9rem',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: isFocused ? 'lightgray' : 'white',
    color: 'black',
    cursor: 'pointer',
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
    ':hover': {
      backgroundColor: 'lightgray',
    },
  }),
};

const StyledDropdown = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const InfoBelowPanel = styled.div`
  margin-top: -2px;
  padding: 8px 10px;
  background: ${CONTROL_COLOUR};
  border-right: 1px solid ${CONTROL_COLOUR};
  border-bottom: 1px solid ${CONTROL_COLOUR};
  border-left: 1px solid ${CONTROL_COLOUR};
  border-top: none;
  border-radius: 0 0 ${CONTROL_BORDER_RADIUS}px ${CONTROL_BORDER_RADIUS}px;
  font-size: 0.85rem;
  color: #333;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    background: #adadadff;
    border-bottom-left-radius: ${CONTROL_BORDER_RADIUS}px;
  }
`;

/**
 * Button that toggles the collapse state of the info panel.
 * Uses a ChevronRightIcon rotated to indicate expanded/collapsed.
 *
 * Props:
 * - $collapsed: boolean - whether the panel is collapsed (controls icon rotation).
 */
const CollapseButton = styled.button`
  position: absolute;
  top: 4px;
  right: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 0.9rem;
  padding: 2px;
  line-height: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
    transition: transform 160ms ease;
    transform: rotate(${(p) => (p.$collapsed ? '0deg' : '90deg')});
  }
`;

/**
 * Wrapper for the expanded info content.
 * Adds right padding so the absolute-positioned collapse button does not overlap content.
 */
const InfoBelowContent = styled.div`
  padding-right: 24px;
`;

const InfoBelowSummary = styled.div`
  font-size: 0.8rem;
  color: #555;
  padding-right: 24px;
`;

/**
* Renders a validity icon (✅ for valid, ⚠️ for invalid).
*
* @param {Object} props
* @param {boolean} props.isValid - Validity state
* @returns {JSX.Element} The icon element.
*/
const ValidityIcon = ({ isValid }) => (
  <span style={{ marginRight: 10 }}>{isValid ? '✅' : '⚠️'}</span>
);

/**
* Renders a label with an optional validity icon and ellipsis overflow behavior.
*
* @param {Object} props
* @param {string} props.label - Option label
* @param {boolean} [props.showIcon] - Whether to render a validity icon
* @param {boolean} [props.isValid] - Validity state (used when showIcon = true)
* @returns {JSX.Element} Label content with optional icon.
*/
const LabelWithValidity = ({ label, showIcon, isValid }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0 }}>
    {showIcon && <ValidityIcon isValid={isValid} />}
    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  </span>
);

/**
* Unified label renderer for both menu and value contexts.
* - In 'value' context: shows label + validity icon (when applicable).
* - In 'menu' context: shows label + validity icon and any infoOnHover on the right.
*
* @param {Object} data - The option data { label, value, isValid, infoOnHover }
* @param {Object} meta - Includes { context: 'menu' | 'value' | 'input', selectProps }
* @returns {JSX.Element | string} JSX for custom rendering, or string fallback.
*/
const formatOptionLabel = (data, meta) => {
  const showIcon =
    typeof data?.isValid !== 'undefined' && data?.value !== 'all';

  if (meta.context === 'value') {
    return <LabelWithValidity label={data.label} showIcon={showIcon} isValid={data.isValid} />;
  }

  if (meta.context === 'menu') {
    const hasInfoOnHover = !!data.infoOnHover && data.value !== 'all';
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          width: '100%',
        }}
      >
        <LabelWithValidity label={data.label} showIcon={showIcon} isValid={data.isValid} />
        {hasInfoOnHover && (
          <div style={{ marginLeft: 'auto' }}>
            <SelectorLabel text="" info={data.infoOnHover} />
          </div>
        )}
      </div>
    );
  }

  // Fallback (e.g., for 'input' context)
  return data.label;
};

/**
 * Dropdown component for selecting options.
 * Includes optional rich info when infoOnHover and infoBelowOnChange are provided in the values.
 * @property {Object} filter - The filter object containing values.
 * @property {Array} filter.values - An array of values for the dropdown.
 * @property {string} filter.values[].displayValue - The display value of the option.
 * @property {string} filter.values[].paramValue - The parameter value of the option.
 * @property {string} filter.values[].infoOnHover - The info shown on hovering the option.
 * @property {string} filter.values[].infoBelowOnChange- The info to show below the dropdown, based on selection.
 * @property {boolean} filter.values[].isValid - Indicates if the option is valid.
 * @property {boolean} filter.shouldBeBlankOnInit - Indicates if the filter should be blank on initialization.
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const Dropdown = ({ filter, onChange }) => {
  const { state: filterState } = useFilterContext();
  const animatedComponents = makeAnimated();
  const [loading, setLoading] = useState(false);
  const [isInfoCollapsed, setInfoCollapsed] = useState(true);
  const prevOptionsRef = useRef([]);
  const prevSelectedOptionsRef = useRef(null);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const options = useMemo(() => {
    const filteredOptions = filter.values.values
      .filter((option) => !option.isHidden)
      .map((option) => ({
        value: option.paramValue,
        label: option.displayValue,
        isValid: option?.isValid,
        infoOnHover: option?.infoOnHover ?? null,
        infoBelowOnChange: option?.infoBelowOnChange ?? null,
      }));
    if (filter.multiSelect) {
      const allOption = {
        value: 'all',
        label: 'All',
      };
      return [allOption, ...filteredOptions];
    }
    return filteredOptions;
  }, [filter.values.values, filter.multiSelect]);

  const selectedOptions = useMemo(() => {
    if (Array.isArray(filterState[filter.id])) {
      return options.slice(1).filter((option) => filterState[filter.id]?.includes(option.value));
    }
    return options.find((option) => option.value === filterState[filter.id]);
  }, [filterState, filter.id, options]);

  useEffect(() => {
    if (!filter.shouldBeBlankOnInit && selectedOptions === undefined && filterState[filter.id] !== null) {
      onChange(filter, null);
    }
  }, [selectedOptions, filterState, filter, onChange]);

  /**
   * Computes a stable signature representing the visible options for this dropdown,
   * excluding the 'All' option for multi-select. The signature includes each option's
   * value and its validity (isValid). This allows us to set the loading state only
   * when filtering/validation actually changes what is visible or the validity shown.
   *
   * Rationale:
   * - Filtering via isHidden affects the visible options list (options.length).
   * - Validation updates isValid when shouldBeValidated is true, which is included here.
   * - Selections do not alter this signature, so user choices alone won't trigger loading.
   */
  const optionsSignature = useMemo(() => {
    const visible = filter.multiSelect ? options.slice(1) : options;
    // Build a compact signature including value and validity flag
    // Note: undefined isValid (for filters with shouldBeValidated = false) will not flicker loading.
    return JSON.stringify(
      visible.map((o) => ({
        v: o.value,
        // Normalise validity to a tri-state to avoid unnecessary changes:
        val: typeof o.isValid === 'undefined' ? 'u' : o.isValid ? 't' : 'f',
      }))
    );
  }, [options, filter.multiSelect]);

  /**
   * Sets loading only when the visible options or their validity change,
   * which corresponds to actual filtering or validation updates.
   */
  useEffect(() => {
    // If signature changes, reflect a short loading state
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [optionsSignature]);

  useEffect(() => {
    const prevOptions = prevOptionsRef.current;
    const currentOptions = options.slice(1).map((option) => option.value);

    if (Array.isArray(filterState[filter.id]) && isAllSelected) {
      if (JSON.stringify(prevOptions) !== JSON.stringify(currentOptions)) {
        onChange(filter, currentOptions);
      }
    }

    prevOptionsRef.current = currentOptions;
  }, [options, filterState, filter, onChange, isAllSelected]);

  const handleDropdownChange = (selectedOptions) => {
    if (Array.isArray(selectedOptions)) {
      if (selectedOptions.some(option => option.value === 'all')) {
        setIsAllSelected(true);
        onChange(filter, options.slice(1).map(option => option.value));
      } else {
        setIsAllSelected(false);
        const values = selectedOptions.map(option => option.value);
        onChange(filter, values);
      }
    } else if (selectedOptions) {
      setIsAllSelected(false);
      onChange(filter, selectedOptions.value);
    } else {
      // Set state to null when cleared
      setIsAllSelected(false);
      onChange(filter, null);
    }
  };

  useEffect(() => {
    // Update the previous selected options ref whenever the selection changes
    prevSelectedOptionsRef.current = filterState[filter.id];
  }, [filterState, filter.id]);

  useEffect(() => {
    // Automatically select the only option if there's just one available
    if (options.length === 1 && filterState[filter.id] !== options[0].value) {
      onChange(filter, options[0].value);
    }
  }, [options, filter, onChange, filterState]);

  const hasSelection = useMemo(() => {
    const val = filterState[filter.id];
    return Array.isArray(val) ? val.length > 0 : !!val;
  }, [filterState, filter.id]);

  const infoBelowItems = useMemo(() => {
    if (!hasSelection) return [];
    if (Array.isArray(selectedOptions)) {
      return selectedOptions
        .filter((o) => !!o.infoBelowOnChange)
        .map((o) => ({ label: o.label, text: o.infoBelowOnChange }));
    }
    if (selectedOptions?.infoBelowOnChange) {
      return [{ label: selectedOptions.label, text: selectedOptions.infoBelowOnChange }];
    }
    return [];
  }, [hasSelection, selectedOptions]);

  const infoBelowSummaryText = useMemo(() => {
    if (infoBelowItems.length === 0) return '';
    if (Array.isArray(selectedOptions)) {
      return `Details available for ${infoBelowItems.length} selection${infoBelowItems.length > 1 ? 's' : ''} — expand for details.`;
    }
    return `Details available — expand for details.`;
  }, [infoBelowItems, selectedOptions]);

  return (
    <StyledDropdown>
      <Select
        components={animatedComponents}
        options={options}
        value={selectedOptions}
        onChange={handleDropdownChange}
        formatOptionLabel={formatOptionLabel}
        styles={customStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        isClearable={filter.isClearable}
        isMulti={filter.multiSelect}
        isLoading={loading}
      />
      {hasSelection && infoBelowItems.length > 0 && (
        <InfoBelowPanel>
          <CollapseButton
            onClick={() => setInfoCollapsed((c) => !c)}
            aria-label={isInfoCollapsed ? 'Expand details' : 'Collapse details'}
            title={isInfoCollapsed ? 'Expand details' : 'Collapse details'}
            aria-expanded={!isInfoCollapsed}
            $collapsed={isInfoCollapsed}
          >
            <ChevronRightIcon aria-hidden="true" />
          </CollapseButton>

          {isInfoCollapsed ? (
            <InfoBelowSummary>{infoBelowSummaryText}</InfoBelowSummary>
          ) : (
            <InfoBelowContent>
              {Array.isArray(selectedOptions) ? (
                <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                  {infoBelowItems.map((item, i) => (
                    <li key={`${item.label}-${i}`}>
                      <strong style={{ marginRight: 4 }}>{item.label}:</strong>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <strong style={{ marginRight: 4 }}>{infoBelowItems[0].label}:</strong>
                  <span>{infoBelowItems[0].text}</span>
                </div>
              )}
            </InfoBelowContent>
          )}
        </InfoBelowPanel>
      )}
    </StyledDropdown>
  );
};
