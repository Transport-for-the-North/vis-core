import { render, screen } from "@testing-library/react";
import { MapStatus } from "Components/MapStatus";

describe("MapStatus component test", () => {
  it("Test renders MapStatus with map instance", () => {
    const map = {
      getZoom: jest.fn(() => 10),
      getCenter: jest.fn(() => ({ lng: 20, lat: 30 })),
      on: jest.fn(),
      off: jest.fn(),
    };

    render(<MapStatus map={map} />);
    expect(screen.getByText("Zoom: 10.00")).toBeInTheDocument();

    expect(
      screen.getByText((content, element) => {
        return element?.textContent === "Center: [20.00000, 30.00000]";
      })
    ).toBeInTheDocument();
  });
    it("Test with bad data, without map", () => {
    render(<MapStatus />);
    expect(screen.queryByText("Zoom:")).not.toBeInTheDocument();
    expect(screen.queryByText("Center:")).not.toBeInTheDocument();
  });
});
