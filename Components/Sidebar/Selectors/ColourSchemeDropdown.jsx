import React, { useState } from "react";
import Select from "react-select";
import chroma from "chroma-js";
import styled from "styled-components";
import makeAnimated from "react-select/animated";

import { SelectorLabel } from "./SelectorLabel";

const colorPalettes = {
  sequential: [
    "Blues",
    "BuGn",
    "BuPu",
    "GnBu",
    "Greens",
    "Greys",
    "OrRd",
    "PuBu",
    "PuBuGn",
    "PuRd",
    "Purples",
    "RdPu",
    "Reds",
    "YlGn",
    "YlGnBu",
    "YlOrBr",
    "YlOrRd",
  ],
  diverging: [
    "BrBG",
    "PiYG",
    "PRGn",
    "PuOr",
    "RdBu",
    "RdGy",
    "RdYlBu",
    "RdYlGn",
    "Spectral",
  ],
  categorical: [
    "Accent",
    "Dark2",
    "Paired",
    "Pastel1",
    "Pastel2",
    "Set1",
    "Set2",
    "Set3",
  ],
};

// Custom style for the react-select options
const colourStyles = {
  menuPortal: base => ({
    ...base,
    zIndex: 9999, // Adjust zIndex to be higher than everything else
  }),
  option: (styles, { data }) => {
    return {
      ...styles,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #eee",
      padding: "10px",
      backgroundColor: data.isFocused ? "lightgray" : "white",
      color: "black",
      ":active": {
        ...styles[":active"],
        backgroundColor: "lightgray",
      },
    };
  },
};

// Styled component for color boxes
const ColorBox = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
`;

export const ColourSchemeDropdown = ({ defaultPalette }) => {
  const [selectedPalette, setSelectedPalette] = useState(defaultPalette);
  const animatedComponents = makeAnimated();

  const formatOptionLabel = ({ value, label }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>{label}</div>
      <div style={{ marginLeft: "10px", display: "flex" }}>
        {chroma.brewer[value].map((color) => (
          <div
            key={color}
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
              marginLeft: "2px",
            }}
          />
        ))}
      </div>
    </div>
  );

  const options = Object.keys(colorPalettes).flatMap((key) =>
    colorPalettes[key].map((scheme) => ({ value: scheme, label: scheme }))
  );

  return (
    <>
    <SelectorLabel text="Colour scheme" />
    <Select
      components={animatedComponents}
      options={options}
      formatOptionLabel={formatOptionLabel}
      styles={colourStyles}
      menuPlacement="auto"
      menuPortalTarget={document.body} // Use a portal to render the menu
      onChange={setSelectedPalette}
    />
    </>
  );
};
