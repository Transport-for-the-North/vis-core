import React, { useEffect, useState } from 'react';
import chroma from "chroma-js";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useMapContext } from "hooks";
import { useMemo } from "react";
import { colorSchemes } from "utils";
import { SelectorLabel } from "./SelectorLabel";

// Custom style for the react-select options
const colourStyles = {
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Adjust zIndex to be higher than everything else
  }),
  option: (styles, { isFocused }) => {
    return {
      ...styles,
      display: "flex",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      padding: "5px 10px",
      backgroundColor: isFocused ? "lightgray" : "white",
      color: "black",
      ":active": {
        ...styles[":active"],
        backgroundColor: "lightgray",
      },
    };
  },
  singleValue: (styles) => ({
    ...styles,
    display: "flex",
    alignItems: "center",
  }),
};

/**
 * Dropdown component for selecting color schemes.
 * @property {string} colorStyle - The selected color style.
 * @property {Function} handleColorChange - Function to handle color change.
 * @property {string} layerName - The name of the layer.
 * @returns {JSX.Element} The ColourSchemeDropdown component.
 */
export const ColourSchemeDropdown = ({
  colorStyle,
  handleColorChange,
  layerName,
}) => {
  const animatedComponents = makeAnimated();
  const { state } = useMapContext();

  // Retrieve the color scheme for the specific layer
  const layerColorScheme = state.colorSchemesByLayer[layerName];

  /**
   * Custom formatting for option label to include color swatches.
   * The label occupies 30% and the swatches occupy 70%.
   * @property {string} value - The value of the option.
   * @property {string} label - The label of the option.
   * @returns {JSX.Element} The formatted option label.
   */
  const formatOptionLabel = ({ value, label }) => {
    const colors = chroma.brewer[value];
    return (
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <div style={{ width: "30%", paddingRight: "10px" }}>{label}</div>
        <div style={{ width: "70%", display: "flex" }}>
          {colors.map((color) => (
            <div
              key={color}
              style={{
                backgroundColor: color,
                width: `${100 / colors.length}%`,
                height: "20px",
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const options = useMemo(
    () =>
      colorSchemes[colorStyle].map((scheme) => ({
        value: scheme,
        label: scheme,
      })),
    [colorStyle]
  );

  // State to keep track of the selected option
  const [selectedOption, setSelectedOption] = useState(null);

  // Update selected option when layerColorScheme changes
  useEffect(() => {
    if (layerColorScheme) {
      const matchingOption = options.find(
        (option) => option.value === layerColorScheme.value
      );
      setSelectedOption(matchingOption || options[0]);
    }
  }, [layerColorScheme, options]);

  return (
    <>
      <SelectorLabel text="Colour scheme" />
      <Select
        id={"colors-" + layerName}
        components={animatedComponents}
        options={options}
        value={selectedOption}
        formatOptionLabel={formatOptionLabel}
        styles={colourStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body} // Use a portal to render the menu
        onChange={(selectedOption) => handleColorChange(selectedOption, layerName)}
      />
    </>
  );
};