import { useContext } from "react";
import { FilterContext } from "contexts/FilterContext";

/**
 * Custom hook to use the FilterContext
 * @returns {Object} Filter context value
 */
export const useFilterContext = () => useContext(FilterContext);