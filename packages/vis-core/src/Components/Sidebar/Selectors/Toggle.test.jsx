import { render, screen } from "@testing-library/react";
import { Toggle } from "./Toggle";
import { FilterContext } from "contexts";
import userEvent from "@testing-library/user-event";

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
jest.mock("polished", () => ({
  darken: jest.fn((amount, color) => `darkened-${color}`),
}));
const mockFilterContext = {
  state: {
    dropdown: "dropdown",
    slider: "slider",
    toggle: "toggle",
    checkbox: "checkbox",
    mapFeatureSelect: "mapFeatureSelect",
    mapFeatureSelectWithControls: "mapFeatureSelectWithControls",
    mapFeatureSelectAndPan: "mapFeatureSelectAndPan",
    id: 14,
  },
  dispatch: jest.fn(),
};

let props = {
  filter: {
    values: {
      values: [
        {
          paramValue: "paramValue",
          displayValue: "displayValue",
          isValid: true,
        },
        {
          paramValue: "paramValue1",
          displayValue: "displayValue1",
          isValid: true,
        },
        {
          paramValue: "paramValue2",
          displayValue: "displayValue2",
          isValid: true,
        },
      ],
    },
    multiSelect: true,
  },
  onChange: jest.fn(),
};
describe("Toggle component tests", () => {
  it("Click on the displayValue button with multiselect", async () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Toggle {...props} />
      </FilterContext.Provider>
    );
    // Check the render
    expect(screen.getByText("displayValue")).toBeInTheDocument();
    expect(screen.getByText("displayValue1")).toBeInTheDocument();
    expect(screen.getByText("displayValue2")).toBeInTheDocument();
    expect(screen.getByText("Toggle All")).toBeInTheDocument();

    // Click on the displayValue button
    const firstButton = screen.getByRole("button", { name: "displayValue ✅" });
    expect(firstButton).toBeInTheDocument();
    await userEvent.click(firstButton);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        values: {
          values: [
            {
              paramValue: "paramValue",
              displayValue: "displayValue",
              isValid: true,
            },
            {
              paramValue: "paramValue1",
              displayValue: "displayValue1",
              isValid: true,
            },
            {
              paramValue: "paramValue2",
              displayValue: "displayValue2",
              isValid: true,
            },
          ],
        },
        multiSelect: true,
      },
      ["paramValue"]
    );
    // Click on the displayValue1 button
    const secondButton = screen.getByRole("button", {
      name: "displayValue1 ✅",
    });
    expect(secondButton).toBeInTheDocument();
    await userEvent.click(secondButton);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        values: {
          values: [
            {
              paramValue: "paramValue",
              displayValue: "displayValue",
              isValid: true,
            },
            {
              paramValue: "paramValue1",
              displayValue: "displayValue1",
              isValid: true,
            },
            {
              paramValue: "paramValue2",
              displayValue: "displayValue2",
              isValid: true,
            },
          ],
        },
        multiSelect: true,
      },
      ["paramValue", "paramValue1"] // Because it's a multiselect button
    );
  });
  it("Click on the Toggle All button", async () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Toggle {...props} />
      </FilterContext.Provider>
    );
    const allButton = screen.getByRole("button", { name: "Toggle All" });
    expect(allButton).toBeInTheDocument();
    await userEvent.click(allButton);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        values: {
          values: [
            {
              paramValue: "paramValue",
              displayValue: "displayValue",
              isValid: true,
            },
            {
              paramValue: "paramValue1",
              displayValue: "displayValue1",
              isValid: true,
            },
            {
              paramValue: "paramValue2",
              displayValue: "displayValue2",
              isValid: true,
            },
          ],
        },
        multiSelect: true,
      },
      ["paramValue", "paramValue1", "paramValue2"] // All elements are selected
    );
  });
  it("Click on the displayValue button with multiselect at false", async () => {
    props = {
      ...props,
      filter: {
        ...props.filter,
        multiSelect: false,
      },
    };
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Toggle {...props} />
      </FilterContext.Provider>
    );
    // Check the render
    expect(screen.queryByText("Toggle All")).not.toBeInTheDocument();

    // Click on the displayValue button
    const firstButton = screen.getByRole("button", { name: "displayValue ✅" });
    expect(firstButton).toBeInTheDocument();
    await userEvent.click(firstButton);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        values: {
          values: [
            {
              paramValue: "paramValue",
              displayValue: "displayValue",
              isValid: true,
            },
            {
              paramValue: "paramValue1",
              displayValue: "displayValue1",
              isValid: true,
            },
            {
              paramValue: "paramValue2",
              displayValue: "displayValue2",
              isValid: true,
            },
          ],
        },
        multiSelect: false,
      },
      "paramValue" // Because it's not a multiselect button
    );
  });
});
