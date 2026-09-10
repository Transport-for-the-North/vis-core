import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Toggle } from "./Toggle";
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

describe("Toggle accessibility", () => {
  const filter = {
    id: "travel-mode",
    multiSelect: true,
    values: {
      values: [
        { paramValue: "rail", displayValue: "Rail", isValid: true },
        { paramValue: "bus", displayValue: "Bus", isValid: true },
      ],
    },
  };

  it("supports keyboard interaction and has no automated accessibility violations", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <FilterContext.Provider value={{ state: {}, dispatch: jest.fn() }}>
        <Toggle filter={filter} onChange={onChange} />
      </FilterContext.Provider>,
    );

    const railButton = screen.getByRole("button", { name: /rail/i });
    expect(railButton).toBeInTheDocument();

    await userEvent.tab();
    expect(railButton).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalled();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
