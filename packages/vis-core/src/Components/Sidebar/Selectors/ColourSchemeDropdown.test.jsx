import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColourSchemeDropdown } from "Components/Sidebar/Selectors";
import { MapContext } from "contexts";

jest.mock("maplibre-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    setStyle: jest.fn(),
    flyTo: jest.fn(),
  })),
}));
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(() => ({
    layers: [
      {
        id: "water",
        type: "fill",
        source: "mapbox",
        "source-layer": "water",
        paint: {
          "fill-color": "#00ffff",
        },
      },
    ],
  })),
  state: {
    colorSchemesByLayer: {
      default: ["red", "green", "blue"],
      custom: ["yellow", "purple", "orange"],
    },
    colorSchemes: {
      default: ["red", "green", "blue"],
      custom: ["yellow", "purple", "orange"],
    },
  },
};
jest.mock("../../../utils", () => ({
  colorSchemes: {
    default: ["red", "green", "blue"],
    custom: ["yellow", "purple", "orange"],
  },
}));
jest.mock("chroma-js", () => ({
  brewer: {
    yellow: ["#ffffcc", "#ffeda0", "#fed976"],
    purple: ["d923d1"],
    orange: ["D98723"],
    red: ["E01212"],
    green: ["31E012"],
    blue: ["1215E0"],
  },
}));

describe("ColourSchemeDropdown component test", () => {
  it("Basic use", async () => {
    const fakeFunction = jest.fn();
    render(
      <MapContext.Provider value={mockMap}>
        <ColourSchemeDropdown
          colorStyle={"custom"}
          handleColorChange={fakeFunction}
          layerName="default"
        />
      </MapContext.Provider>
    );
    // Label
    const label = screen.getByText("Colour scheme");
    expect(label).toBeInTheDocument();
    // Select
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    userEvent.click(select);
    await waitFor(async() => {
      const menuList = screen.getByRole("listbox");
      const { getByText } = within(menuList);
      const optionToSelect = getByText("yellow");
      expect(optionToSelect).toBeInTheDocument();
      await userEvent.click(optionToSelect);
    });

    expect(fakeFunction).toHaveBeenCalledWith({"label": "yellow", "value": "yellow"}, "default");
  });
});
