import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SelectorLabel } from "./SelectorLabel";

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

describe("SelectorLabel accessibility", () => {
  it("shows info trigger with accessible name and tooltip role", async () => {
    const { container } = render(<SelectorLabel text="Area" info="Extra guidance" />);

    const infoButton = screen.getByRole("button", {
      name: /more information about area/i,
    });

    expect(infoButton).toBeInTheDocument();

    await userEvent.tab();
    expect(infoButton).toHaveFocus();

    expect(await screen.findByRole("tooltip")).toHaveTextContent("Extra guidance");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
