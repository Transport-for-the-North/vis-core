import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { CheckboxSelector } from "Components/Sidebar/Selectors";
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

describe("CheckboxSelector accessibility", () => {
  const filter = {
    id: "modes",
    multiSelect: true,
    values: {
      values: [
        { displayValue: "Rail", paramValue: "rail" },
        { displayValue: "Bus", paramValue: "bus" },
      ],
    },
  };

  it("renders accessible checkboxes and supports Select All", async () => {
    const onChange = jest.fn();
    const { container } = render(
      <FilterContext.Provider value={{ state: {}, dispatch: jest.fn() }}>
        <CheckboxSelector onChange={onChange} bgColor="#0d0f3d" filter={filter} />
      </FilterContext.Provider>,
    );

    const railCheckbox = screen.getByRole("checkbox", { name: "Rail" });
    const busCheckbox = screen.getByRole("checkbox", { name: "Bus" });
    expect(railCheckbox).toBeInTheDocument();
    expect(busCheckbox).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /select all/i }));
    expect(railCheckbox).toBeChecked();
    expect(busCheckbox).toBeChecked();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
