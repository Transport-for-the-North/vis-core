// contexts/FilterContext.js
import React, { createContext, useReducer } from 'react';
import { saveFilterState } from '../utils/filterPersistence';

/**
 * Create a context for filter values
 * @type {React.Context}
 */
export const FilterContext = createContext();

const initialFilterState = {};

// Define action types
const filterActionTypes = {
  SET_FILTER_VALUE: 'SET_FILTER_VALUE',
  RESET_FILTERS: 'RESET_FILTERS',
  INITIALIZE_FILTERS: 'INITIALIZE_FILTERS',
};

/**
 * Reducer for managing filter values
 * @param {Object} state - Current state
 * @param {Object} action - Action to be performed
 * @returns {Object} New state
 */
const filterReducer = (state, action) => {
  switch (action.type) {
    case filterActionTypes.SET_FILTER_VALUE: {
      const { filterId, value, filter } = action.payload;

      // Prevent null/undefined from being written into state
      if (value == null) {
        // Explicitly store an empty shape for multi-selects
        return { ...state, [filterId]: Array.isArray(state[filterId]) ? [] : state[filterId] };
      }

      // Safe numeric coercion: avoid '' -> 0 and other isNaN quirks
      const toNumberIfNumeric = (v) => {
        if (typeof v !== 'string') return v;
        const t = v.trim();
        // Only coerce strings that are pure numbers (e.g., '123', '-10', '3.14')
        return /^[+-]?\d+(\.\d+)?$/.test(t) ? Number(t) : v;
      };

      // Keep arrays as-is (no element coercion), booleans/numbers as-is,
      // and only coerce numeric-looking strings.
      const parsedValue =
        typeof value === 'boolean'
          ? value
          : Array.isArray(value)
          ? value
          : typeof value === 'number'
          ? value
          : typeof value === 'string'
          ? toNumberIfNumeric(value)
          : value;

      // Check if the value has actually changed
      if (state[filterId] === parsedValue) {
        return state; // No change in state
      }

      // Save to localStorage if filter has persistState enabled
      if (filter && filter.persistState) {
        saveFilterState(filter, parsedValue);
      }

      return {
        ...state,
        [filterId]: parsedValue,
      };
    }
    case filterActionTypes.RESET_FILTERS:
      return initialFilterState;
    case filterActionTypes.INITIALIZE_FILTERS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

/**
 * FilterProvider component to manage filter-related state and context
 * @param {React.ReactNode} children - Child components to be wrapped by the context provider
 * @returns {JSX.Element} The filter context provider component
 */
export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);

  const contextValue = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
};