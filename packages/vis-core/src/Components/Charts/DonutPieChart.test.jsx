import React from "react";
import { render, screen } from "@testing-library/react";
import { DonutPieChart } from "./DonutPieChart";

const sampleConfig = {
  title: "Test Donut Pie Chart",
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

describe("DonutPieChart", () => {
  it("renders without crashing", () => {
    render(<DonutPieChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Donut chart")).toBeInTheDocument();
  });

  it("renders chart title", () => {
    render(<DonutPieChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Donut Pie Chart")).toBeInTheDocument();
  });

  it("renders pie labels", () => {
    render(<DonutPieChart config={sampleConfig} data={sampleData} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<DonutPieChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByLabelText("Donut chart")).toBeInTheDocument();
  });
});
