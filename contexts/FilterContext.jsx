// contexts/FilterContext.js
import React, { createContext, useReducer } from 'react';

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
    case filterActionTypes.SET_FILTER_VALUE:
      return {
        ...state,
        [action.payload.filterId]: action.payload.value,
      };
    case filterActionTypes.RESET_FILTERS:
      return initialFilterState;
    case filterActionTypes.INITIALIZE_FILTERS:
      return {
        ...state,
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