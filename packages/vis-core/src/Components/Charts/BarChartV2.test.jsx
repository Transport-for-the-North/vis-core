import React from "react";
import { render, screen } from "@testing-library/react";
import { BarChartV2 } from "./BarChartV2";

describe("BarChartV2", () => {
  it("renders without crashing", () => {
    render(<BarChartV2 config={{}} data={[]} formatters={{}} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });

  const sampleConfig = {
    title: "Test Bar Chart V2",
    sourceColumns: [
      { key: "apples", label: "Apples" },
      { key: "bananas", label: "Bananas" }
    ],
    xLabel: "Fruit",
    yLabel: "Count"
  };

  const sampleData = [
    { apples: 10, bananas: 5 },
    { apples: 7, bananas: 8 }
  ];

  it("renders chart title", () => {
    render(<BarChartV2 config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByText("Test Bar Chart V2")).toBeInTheDocument();
  });

  it("renders bar labels", () => {
    render(<BarChartV2 config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<BarChartV2 config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });
});
