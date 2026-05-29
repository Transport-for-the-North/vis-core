import React from "react";
import { render, screen } from "@testing-library/react";
import { RankingChart } from "./RankingChart";

const sampleConfig = {
  title: "Test Ranking Chart",
  columns: [
    { key: "apples", label: "Apples" },
    { key: "bananas", label: "Bananas" }
  ],
  xLabel: "Fruit",
  yLabel: "Count"
};

const sampleData = {
  apples: 10,
  bananas: 5
};

describe("RankingChart", () => {
  it("renders without crashing", () => {
    render(<RankingChart config={{}} data={[]} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders chart title and table headers", () => {
    render(<RankingChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Test Ranking Chart")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
  });

  it("renders ranking labels", () => {
    render(<RankingChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("Apples")).toBeInTheDocument();
    expect(screen.getByText("Bananas")).toBeInTheDocument();
  });

  it("renders ranking scores", () => {
    render(<RankingChart config={sampleConfig} data={sampleData} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
