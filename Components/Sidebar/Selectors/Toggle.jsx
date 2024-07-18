import { useMapContext } from "hooks";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledToggle = styled.div`
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  border: 0.25px solid;
  border-radius: 5px;
`;

const StyledButton = styled.button`
  cursor: pointer;
  padding: 5px 2px;
  background-color: ${(props) => (props.$isSelected ? "#7317DE" : "white")};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
  //These lines are to verify if the button is at the far left and then add a border-radius on the left to be sure not overlapping the box borders
  border-top-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")};
  border-bottom-left-radius: ${(props) => (props.index === 0 ? "4px" : "0px")};
  //These lines are to verify if the button is at the far right and then add a border-radius on the right to be sure not overlapping the box borders
  border-top-right-radius: ${(props) =>
    props.index === props.size - 1 ? "4px" : "0px"};
  border-bottom-right-radius: ${(props) =>
    props.index === props.size - 1 ? "4px" : "0px"};
  //If the button is not at one of the extremities, add some border to make a separation
  border-style: ${(props) =>
    props.index !== 0 ? "none none none solid" : "none"};
  border-width: 0.25px;
  width: ${(props) => 100 / props.size + "%"};
  font-family: "Hanken Grotesk", sans-serif;
`;

/**
 * Renders a toggle switch component for selecting between multiple options.
 * @property {Object} filter - The filter object containing information about the toggle options.
 * @property {Array} filter.values - An array of objects representing the possible toggle values.
 * @property {string} filter.values[].paramValue - The parameter value associated with the option.
 * @property {string} filter.values[].displayValue - The display value shown to the user.
 * @property {Function} onChange - The function called when a new toggle option is selected.
 * @returns {JSX.Element} The rendered Toggle component.
 */
export const Toggle = ({ filter, onChange }) => {
  const { state } = useMapContext();
  const metadataFilters = state.metadataFilters[0];
  const currentToggle = useRef(null);
  const [currentButton, setCurrentButton] = useState(
    filter.values.source === "local" ? filter.values.values[0] : null
  );
  const baseParamName = filter.paramName.includes("DoMinimum")
    ? filter.paramName.replace("DoMinimum", "")
    : filter.paramName.includes("DoSomething")
    ? filter.paramName.replace("DoSomething", "")
    : filter.paramName;

  const handleToggleChange = (e) => {
    const selectedValue = e.target.value;
    const selectedOption =
      filter.values.source === "local"
        ? filter.values.values.find(
            (option) => option.displayValue === selectedValue
          )
        : metadataFilters[baseParamName][0].distinct_values.find(
            (option) => option === selectedValue
          );
    if (selectedOption) {
      onChange(
        filter,
        filter.values.source === "local"
          ? selectedOption.paramValue
          : selectedOption
      );
      setCurrentButton(selectedOption);
    }
  };

  //Function to reset the current button to the default value when the metadataFilters are loaded
  useEffect(() => {
    if (
      metadataFilters &&
      currentToggle.current !==
        state.visualisations[Object.keys(state.visualisations)[0]].name
    ) {
      currentToggle.current =
        state.visualisations[Object.keys(state.visualisations)[0]].name;
      setCurrentButton(
        filter.values.source === "local"
          ? filter.values.values[0]
          : metadataFilters[baseParamName][0].distinct_values[0]
      );
    }
  }, [metadataFilters, filter]);

  useEffect(() => {
    if (metadataFilters && currentButton === null)
      setCurrentButton(metadataFilters[baseParamName][0].distinct_values[0]);
  }, [metadataFilters, currentButton, filter.paramName]);

  return (
    <StyledToggle>
      {filter.values.source === "local"
        ? filter.values.values.map((option, index) => (
            <StyledButton
              key={option.paramValue}
              value={option.displayValue}
              onClick={handleToggleChange}
              $isSelected={currentButton.displayValue === option.displayValue}
              size={filter.values.values.length}
              index={index}
            >
              {option.displayValue}
            </StyledButton>
          ))
        : metadataFilters && metadataFilters[baseParamName]
        ? metadataFilters[baseParamName][0].distinct_values.map( 
            (option, index) => (
              <StyledButton
                key={option}
                value={option}
                onClick={handleToggleChange}
                $isSelected={currentButton === option}
                size={
                  metadataFilters[baseParamName][0].distinct_values.length
                }
                index={index}
              >
                {option}
              </StyledButton>
            )
          )
        : null}
    </StyledToggle>
  );
};
