import React from "react";
import { render, screen } from "@testing-library/react";
import { AreaSeriesChart } from "./AreaSeriesChart";

const sampleConfig = {
  title: "Test Area Chart",
  columns: [
    { key: "apples", label: "Apples" },
    { key: "bananas", label: "Bananas" }
  ],
  xLabel: "Fruit",
  yLabel: "Count",
  areaStrokeColor: "#ff0000",
  areaFillColor: "#ffeeee"
};

const sampleData = {
  apples: 10,
  bananas: 5,
};

describe("AreaSeriesChart", () => {
  it("renders without crashing", () => {
    render(<AreaSeriesChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Area chart")).toBeInTheDocument();
  });

  it("renders chart title", () => {
    render(<AreaSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Area Chart")).toBeInTheDocument();
  });

  it("renders area labels", () => {
    render(<AreaSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<AreaSeriesChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByLabelText("Area chart")).toBeInTheDocument();
  });
});
