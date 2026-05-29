import React from "react";
import { render, screen } from "@testing-library/react";
import { BarChartMultiple } from "./BarChartMultiple";

const sampleConfig = {
  title: "Test Bar Chart Multiple",
  columns: [
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

describe("BarChartMultiple", () => {
  it("renders without crashing", () => {
    render(<BarChartMultiple config={{}} data={[]} formatters={{}} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });

  it("renders chart title", () => {
    render(<BarChartMultiple config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByText("Test Bar Chart Multiple")).toBeInTheDocument();
  });

  it("renders bar labels", () => {
    render(<BarChartMultiple config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<BarChartMultiple config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });
});
