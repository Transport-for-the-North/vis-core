import React from "react";
import { render, screen } from "@testing-library/react";
import { BarChart } from "./BarChart";

describe("BarChart", () => {
  it("renders without crashing", () => {
    render(<BarChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });

  const sampleConfig = {
    title: "Test Bar Chart",
    columns: [
      { key: "apples", label: "Apples" },
      { key: "bananas", label: "Bananas" }
    ],
    xLabel: "Fruit",
    yLabel: "Count",
    colors: { Apples: "#ff0000", Bananas: "#ffff00" }
  };

  const sampleData = {
    apples: 10,
    bananas: 5,
  };

  it("renders chart title and axis labels", () => {
    render(<BarChart config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByText("Test Bar Chart")).toBeInTheDocument();
  });

  it("renders bars for each column", () => {
    render(<BarChart config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getAllByText("Apples").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Bananas").length).toBeGreaterThan(0);
  });

  it("renders an accessible chart section", () => {
    render(<BarChart config={sampleConfig} data={sampleData} formatters={{}} />);
    expect(screen.getByLabelText("Bar chart")).toBeInTheDocument();
  });
});
