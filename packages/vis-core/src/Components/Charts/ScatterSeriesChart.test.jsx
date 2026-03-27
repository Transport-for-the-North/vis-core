import React from "react";
import { render, screen } from "@testing-library/react";
import { ScatterSeriesChart } from "./ScatterSeriesChart";

const sampleConfig = {
  title: "Test Scatter Series Chart",
  columns: [
    { key: "apples", label: "Apples" },
    { key: "bananas", label: "Bananas" }
  ],
  xLabel: "Fruit",
  yLabel: "Count"
};

const sampleData = {
  apples: 10,
  bananas: 5,
};

describe("ScatterSeriesChart", () => {
  it("renders without crashing", () => {
    render(<ScatterSeriesChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Scatter chart")).toBeInTheDocument();
  });

  it("renders chart title", () => {
    render(<ScatterSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Scatter Series Chart")).toBeInTheDocument();
  });

  it("renders scatter labels", () => {
    render(<ScatterSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<ScatterSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByLabelText("Scatter chart")).toBeInTheDocument();
  });
});
