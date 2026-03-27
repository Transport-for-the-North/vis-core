import React from "react";
import { render, screen } from "@testing-library/react";
import { LineSeriesChart } from "./LineSeriesChart";

const sampleConfig = {
  title: "Test Line Series Chart",
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

describe("LineSeriesChart", () => {
  it("renders without crashing", () => {
    render(<LineSeriesChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Line chart")).toBeInTheDocument();
  });

  it("renders chart title", () => {
    render(<LineSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Line Series Chart")).toBeInTheDocument();
  });

  it("renders line labels", () => {
    render(<LineSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<LineSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByLabelText("Line chart")).toBeInTheDocument();
  });
});
