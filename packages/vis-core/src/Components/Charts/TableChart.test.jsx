import React from "react";
import { render, screen } from "@testing-library/react";
import { TableChart } from "./TableChart";

describe("TableChart", () => {
  it("renders without crashing", () => {
    render(<TableChart config={{}} data={[]} />);
    expect(screen.getByLabelText("Table")).toBeInTheDocument();
    expect(screen.getByText("No data available for selection")).toBeInTheDocument();
  });

  const sampleConfig = {
    title: "Test Table Chart",
    columns: [
      { key: "apples", label: "Apples" },
      { key: "bananas", label: "Bananas" },
    ],
  };

  const sampleData = [
    { apples: 10, bananas: 5 },
    { apples: 7, bananas: 8 },
  ];

  it("renders chart title and column headers", () => {
    render(<TableChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Table Chart")).toBeInTheDocument();
    expect(screen.getByText("Apples")).toBeInTheDocument();
    expect(screen.getByText("Bananas")).toBeInTheDocument();
  });

  it("renders table data", () => {
    render(<TableChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
});
