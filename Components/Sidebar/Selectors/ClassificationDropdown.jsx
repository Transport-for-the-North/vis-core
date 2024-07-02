import styled from 'styled-components'

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
export const ClassificationDropdown = ({ classType, onChange }) => {
  const handleDropdownChange = (e) => {
    const selectedValue = classType[e.target.value];
    onChange(selectedValue);
  };

  return (
    <StyledDropdown onChange={handleDropdownChange}>
      {Object.keys(classType).map((option) => (
        <option key={option} value={classType.option}>
          {option}
        </option>
      ))}
    </StyledDropdown>
  );
};