// FilterContext.js
import React, { createContext, useContext, useReducer } from 'react';

// Define initial state
const initialState = {
  filters: [],
};

// Define reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: state.filters.map((filter) =>
          filter.filterName === action.payload.filterName
            ? { ...filter, value: action.payload.value }
            : filter
        ),
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: state.filters.map((filter) => ({ ...filter, value: null })),
      };
    default:
      return state;
  }
};

// Create context
export const FilterContext = createContext();

// Create context provider
export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};

// Custom hook to use the context
export const useFilter = () => useContext(FilterContext);
