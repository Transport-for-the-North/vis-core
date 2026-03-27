import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card component", () => {
  it("renders with title and value", () => {
    const config = {
      title: "Test Card",
      calc: "sum",
      column: "value",
      valueFormatter: (value) => String(value),
    };
    const data = [{ value: 42 }];
    render(<Card config={config} data={data} />);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders with meta if provided", () => {
    const config = { title: "Meta Card", description: "Meta info" };
    const data = [{ value: 100 }];
    render(<Card config={config} data={data} />);
    expect(screen.getByText("Meta info")).toBeInTheDocument();
  });
});
