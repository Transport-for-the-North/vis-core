import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

describe("SelectorLabel component test", () => {
  it("Basic use", async () => {
    render(<SelectorLabel text="text" info="info" />);
    expect(screen.getByText("text")).toBeInTheDocument();
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
    // Mouse enter
    fireEvent.mouseEnter(btn);
    await waitFor(() => {
      expect(screen.getByText("info")).toBeInTheDocument();
    });
    // Mouse leave
    fireEvent.mouseLeave(btn);
    await waitFor(() => {
      expect(screen.queryByText("info")).not.toBeInTheDocument();
    });
  });
});
