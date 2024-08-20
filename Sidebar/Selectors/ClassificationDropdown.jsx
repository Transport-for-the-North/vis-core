import styled from "styled-components";
import { SelectorLabel } from "./SelectorLabel";
import { useMemo } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const StyledDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
`;
const customStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Adjust zIndex to be higher than everything else
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
    cursor: 'pointer', // Change cursor to pointer
    ':active': {
      ...styles[':active'],
      backgroundColor: 'lightgray',
    },
    ':hover': {
      backgroundColor: 'lightgray', // Highlight on hover
    },
  }),
};

/**
 * Dropdown component for selecting options.
 * @property {Object} filter - The filter object containing values.
 * @property {Array} filter.values - An array of values for the dropdown.
 * @property {string} filter.values[].displayValue - The display value of the option.
 * @property {string} filter.values[].paramValue - The parameter value of the option.
 * @property {Function} onChange - The function called when a new option is selected.
 * @returns {JSX.Element} The Dropdown component.
 */
export const ClassificationDropdown = ({
  classType,
  onChange,
  classification,
}) => {
  const animatedComponents = makeAnimated();
  const options = useMemo(
    () =>
      Object.keys(classType).map((scheme) => ({
        value: classType[scheme],
        label: scheme,
      })),
    [classType]
  );

  return (
    <div style={{ marginTop: "10px" }}>
      <SelectorLabel
        text="Symbology mode"
        info={"Select symbology banding mode"}
      />
      <Select
        components={animatedComponents}
        options={options}
        defaultValue={
          options.some((e) => e.value === classification)
            ? options.find((e) => e.value === classification)
            : options[0]
        }
        styles={customStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body}
        onChange={classification => onChange(classification.value)}
      />
    </div>
  );
};
