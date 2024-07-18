import styled from "styled-components";
import { useMapContext } from "hooks";

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

/**
 * Dropdown component for selecting options.
 * @property {Object} filter - The filter object containing values.
 * @property {Array} filter.values - An array of values for the dropdown.
 * @property {string} filter.values[].displayValue - The display value of the option.
 * @property {string} filter.values[].paramValue - The parameter value of the option.
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const Dropdown = ({ filter, onChange }) => {
  const { state } = useMapContext();
  const metadataFilters = state.metadataFilters[0];
  const baseParamName = filter.paramName.includes("DoMinimum")
    ? filter.paramName.replace("DoMinimum", "")
    : filter.paramName.includes("DoSomething")
    ? filter.paramName.replace("DoSomething", "")
    : filter.paramName;

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption =
      filter.values.source === "local"
        ? filter.values.values.find(
            (option) => option.displayValue === selectedValue
          ).paramValue
        : metadataFilters[baseParamName][0].distinct_values.find(
            (option) => option === selectedValue
          );

    if (selectedOption) {
      onChange(filter, selectedOption);
    }
  };

  return (
    <StyledDropdown onChange={handleDropdownChange}>
      {filter.values.source === "local"
        ? filter.values.values.map((option) => (
            <option key={option.paramValue} value={option.displayValue}>
              {option.displayValue}
            </option>
          ))
        : metadataFilters && metadataFilters[baseParamName]
        ? metadataFilters[baseParamName][0].distinct_values.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))
        : null}
    </StyledDropdown>
  );
};

