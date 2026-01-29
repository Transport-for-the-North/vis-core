import { fireEvent, render, screen } from "@testing-library/react";
import { Slider } from "./Slider";
import { FilterContext } from "contexts";

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
    min: 0,
    max: 1000,
    interval: 10,
    defaultValue: 0,
    id: "id"
  },
  onChange: jest.fn(),
};

describe("Slider component test", () => {
  it("Test without values in props", async () => {
    props = {
        ...props,
        filter: {
            ...props.filter,
            displayAs: {operation: "divide", operand: 10, unit: "m"}
        }
    }
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Slider {...props} />
      </FilterContext.Provider>
    );
    // Check the input in the render
    const input = screen.getByRole("slider");
    expect(input).toBeInTheDocument();

    // Check all attributes
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "1000");
    expect(input).toHaveAttribute("step", "10");
    expect(input).toHaveAttribute("value", "14");

    // Change the slider's value
    await fireEvent.change(input, { target: { value: "54" } });
    expect(props.onChange).toHaveBeenCalled();
    expect(input).toHaveValue("54");
    expect(screen.getByText("5.4 m")).toBeInTheDocument(); // By applying the modified data of the props: {operation: "divide", operand: 10, unit: "m"}
  });
  it("Basic use with values in props", () => {
    props = {
      ...props,
      filter: {
        ...props.filter,
        values: {
          source: "source",
          values: [
            { paramValue: "1" },
            { paramValue: "2" },
            { paramValue: "3" },
          ],
        },
      },
    };
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Slider {...props} />
      </FilterContext.Provider>
    );
    const input = screen.getByRole("slider");
    expect(input).toBeInTheDocument();

    // Check all attributes
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "2");
    expect(input).toHaveAttribute("step", "1");
    expect(input).toHaveAttribute("value", "-1");
  });
  it("Test with a value < min < max", () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    props = {
      ...props,
      filter: {
        min: 20,
        max: 1000,
        interval: 10,
        defaultValue: 0,
        id: "id",
      },
    };
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Slider {...props} />
      </FilterContext.Provider>
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      `defaultValue (0) is invalid. It should be between 20 and 1000 and divisible by the interval (10). Using 20 instead.`
    );
    // clean
    consoleWarnSpy.mockRestore();
  });
});
