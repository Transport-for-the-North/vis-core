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

export const ColourSchemeDropdown = ({
  colorStyle,
  handleColorChange,
  layerName,
}) => {
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
              width: "17px",
              height: "20px"
            }}
          />
        ))}
      </div>
    </div>
  );

  const { state } = useMapContext();
  const options = useMemo(
    () =>
      colorSchemes[colorStyle].map((scheme) => ({
        value: scheme,
        label: scheme,
      })),
    [colorStyle]
  );

  return (
    <>
      <SelectorLabel text="Colour scheme" />
      <Select
        id={"colors-" + layerName}
        components={animatedComponents}
        options={options}
        defaultValue={
          options.some((e) => e.value === state.color_scheme.value)
            ? state.color_scheme
            : options[0]
        }
        formatOptionLabel={formatOptionLabel}
        styles={colourStyles}
        menuPlacement="auto"
        menuPortalTarget={document.body} // Use a portal to render the menu
        onChange={(color) => handleColorChange(color)}
      />
    </>
  );
};
