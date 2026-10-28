import { fireEvent, render, screen } from "@testing-library/react";
import { RangeSlider } from "./RangeSlider";

describe("RangeSlider", () => {
  it("renders both slider handles and displayed values", () => {
    render(
      <RangeSlider min={0} max={10} value={[2, 8]} onChange={jest.fn()} ariaLabel="Test range" />
    );

    expect(screen.getByLabelText("Test range minimum")).toHaveValue("2");
    expect(screen.getByLabelText("Test range maximum")).toHaveValue("8");
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("normalises min and max ordering when a handle crosses over", () => {
    const onChange = jest.fn();
    render(
      <RangeSlider min={0} max={10} value={[2, 8]} onChange={onChange} ariaLabel="Test range" />
    );

    fireEvent.change(screen.getByLabelText("Test range minimum"), {
      target: { value: "9" },
    });

    expect(onChange).toHaveBeenCalledWith([8, 9]);
  });

  it("clamps emitted values to the configured domain", () => {
    const onChange = jest.fn();
    render(
      <RangeSlider min={0} max={10} value={[2, 8]} onChange={onChange} ariaLabel="Test range" />
    );

    fireEvent.change(screen.getByLabelText("Test range minimum"), {
      target: { value: "15" },
    });

    expect(onChange).toHaveBeenCalledWith([8, 10]);
  });
});
