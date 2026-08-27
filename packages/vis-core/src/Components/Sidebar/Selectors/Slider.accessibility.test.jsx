import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
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

describe("Slider accessibility", () => {
  it("has an accessible name and no automated accessibility violations", async () => {
    const onChange = jest.fn();
    const filter = {
      id: "distance",
      filterName: "Distance",
      min: 0,
      max: 100,
      interval: 10,
      defaultValue: 20,
    };

    const { container } = render(
      <FilterContext.Provider value={{ state: {}, dispatch: jest.fn() }}>
        <Slider filter={filter} onChange={onChange} />
      </FilterContext.Provider>,
    );

    const slider = screen.getByRole("slider", { name: /distance/i });
    expect(slider).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: "40" } });
    expect(onChange).toHaveBeenCalledWith(filter, 40);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
