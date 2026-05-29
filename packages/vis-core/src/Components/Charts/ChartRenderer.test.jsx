import React from "react";
import { render, screen } from "@testing-library/react";
import { ChartRenderer } from "./ChartRenderer";

describe("ChartRenderer", () => {
  it("renders without crashing", () => {
    const { container } = render(<ChartRenderer charts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  const sampleConfig = {
    title: "Test Chart Renderer",
    charts: [{ type: "card", title: "Test Card", id: "card1" }],
  };
  const sampleData = [{ value: 42 }];

  it("renders chart title and card", () => {
    render(<ChartRenderer charts={sampleConfig.charts} data={sampleData} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
  });
});
