import styled from 'styled-components'

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;

export const Dropdown = ({ filter, onChange }) => {
  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption = filter.values.values.find(
      (option) => option.displayValue === selectedValue
    );
    if (selectedOption) {
      onChange(filter, selectedOption.paramValue);
    }
  };

  return (
    <StyledDropdown onChange={handleDropdownChange}>
      {filter.values.values.map((option) => (
        <option key={option.paramValue} value={option.displayValue}>
          {option.displayValue}
        </option>
      ))}
    </StyledDropdown>
  );
};