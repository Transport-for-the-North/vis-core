import { render, screen } from "@testing-library/react";
import { Legend } from "Components/Legend/Legend";
import { numberWithCommas } from "Components/Legend/Scale"

const colorScale = [
  { value: 5, color: "#FECACA" },
  { value: 25, color: "#FD8D3C" },
  { value: 50, color: "#BD0026" },
  { value: "other", color: "#DDDDDD" },
];

const sizeScale = [
    [1, 1],
    ["deux", 2],
    [1234567, 3]
]

describe("Legend component test", () => {
    it("test of numberWithCommas function", () => {
        const result = numberWithCommas(1234567);
        expect(result).toBe("1,234,567");
    });
    it("basic use of Legend", () => {
        render(
            <Legend colorScale={colorScale} selectedVariable="selectedVariable" binMin={2} binMax={100} isCategorical={true} sizeScale={sizeScale} />
        );
        const un = screen.getByText(1);
        const deux = screen.getByText("Deux");
        const split = screen.getByText("1,200,000")
        // Text
        expect(un).toBeInTheDocument();
        expect(deux).toBeInTheDocument();
        expect(split).toBeInTheDocument();
        // Style
        const spanUn = screen.getByTestId("1");
        const spanDeux = screen.getByTestId("2");
        const spanSplit = screen.getByTestId("3");
        // first value
        expect(spanUn).toBeInTheDocument();
        expect(spanUn).toHaveStyle("height: 2px"); // height: `${size * 2}px`,
        // second value
        expect(spanDeux).toBeInTheDocument();
        expect(spanDeux).toHaveStyle("height: 4px"); // height: `${size * 2}px`,
        // split value
        expect(spanSplit).toBeInTheDocument();
        expect(spanSplit).toHaveStyle("height: 6px"); // height: `${size * 2}px`,
    });
});