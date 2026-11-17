import { render, screen, fireEvent } from "@testing-library/react";
import { BandEditor } from "./BandEditor";

const NINE_BANDS = [0, 10, 20, 30, 40, 50, 60, 70, 80];

const renderEditor = (props = {}) => {
  const handlers = {
    onChange: jest.fn(),
    onBandCountChange: jest.fn(),
    onReset: jest.fn(),
  };
  const utils = render(
    <BandEditor bands={NINE_BANDS} isDiverging={false} {...handlers} {...props} />
  );
  return { ...utils, ...handlers, ...props };
};

const setCount = (count) =>
  fireEvent.change(screen.getByRole("combobox"), { target: { value: String(count) } });
const clickUpdate = () => fireEvent.click(screen.getByRole("button", { name: "Update" }));
const clickReset = () => fireEvent.click(screen.getByRole("button", { name: "Reset" }));
const bandValues = () =>
  screen.getAllByRole("spinbutton").map((input) => Number(input.value));

describe("BandEditor number of bands", () => {
  it("asks for a reclassification when only the count changes under a non-custom method", () => {
    const { onChange, onBandCountChange } = renderEditor();

    setCount(5);
    clickUpdate();

    expect(onBandCountChange).toHaveBeenCalledWith(5);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("drops the preview after Update and shows the new bins once they arrive", () => {
    const { rerender, onChange, onBandCountChange, onReset } = renderEditor();

    setCount(5);
    expect(bandValues()).toEqual([0, 10, 20, 30, 40]);
    clickUpdate();
    expect(bandValues()).toEqual(NINE_BANDS);

    rerender(
      <BandEditor
        bands={[0, 5, 15, 45, 90]}
        isDiverging={false}
        onChange={onChange}
        onBandCountChange={onBandCountChange}
        onReset={onReset}
      />
    );
    expect(bandValues()).toEqual([0, 5, 15, 45, 90]);
  });

  it("keeps the truncate behaviour and custom bands for the custom method", () => {
    const { onChange, onBandCountChange } = renderEditor({ isCustom: true });

    setCount(5);
    clickUpdate();

    expect(onChange).toHaveBeenCalledWith([0, 10, 20, 30, 40]);
    expect(onBandCountChange).not.toHaveBeenCalled();
  });

  it("pads with made-up values for the custom method when the count grows", () => {
    const { onChange } = renderEditor({ isCustom: true, bands: [0, 10, 20] });

    setCount(5);
    clickUpdate();

    expect(onChange).toHaveBeenCalledWith([0, 10, 20, 21, 22]);
  });

  it("trims and pads custom diverging bands at both ends, keeping 0 in the middle", () => {
    const { onChange } = renderEditor({
      isCustom: true,
      isDiverging: true,
      bands: [-20, -10, 0, 10, 20],
    });

    setCount(3);
    expect(bandValues()).toEqual([-10, 0, 10]);
    setCount(7);
    expect(bandValues()).toEqual([-12, -11, -10, 0, 10, 11, 12]);
    clickUpdate();

    expect(onChange).toHaveBeenCalledWith([-12, -11, -10, 0, 10, 11, 12]);
  });

  it("makes the bands custom when a value was typed as well as the count changed", () => {
    const { onChange, onBandCountChange } = renderEditor();

    fireEvent.change(screen.getAllByRole("spinbutton")[1], { target: { value: "12" } });
    setCount(5);
    clickUpdate();

    expect(onChange).toHaveBeenCalledWith([0, 12, 20, 30, 40]);
    expect(onBandCountChange).not.toHaveBeenCalled();
  });

  it("falls back to custom bands when no onBandCountChange is given", () => {
    const onChange = jest.fn();
    render(<BandEditor bands={NINE_BANDS} isDiverging={false} onChange={onChange} />);

    setCount(5);
    clickUpdate();

    expect(onChange).toHaveBeenCalledWith([0, 10, 20, 30, 40]);
  });
});

describe("BandEditor preview of a reclassification", () => {
  it("shows the real preview and keeps it after Update", () => {
    const previewBandsForCount = jest.fn(() => [0, 5, 15, 45, 90]);
    const { onBandCountChange } = renderEditor({ previewBandsForCount });

    setCount(5);
    expect(previewBandsForCount).toHaveBeenCalledWith(5);
    expect(bandValues()).toEqual([0, 5, 15, 45, 90]);

    clickUpdate();
    expect(onBandCountChange).toHaveBeenCalledWith(5);
    expect(bandValues()).toEqual([0, 5, 15, 45, 90]);
  });

  it("sends the picked count when the method gives fewer bands", () => {
    const { onBandCountChange } = renderEditor({
      previewBandsForCount: () => [0, 20, 60],
    });

    setCount(6);
    expect(screen.getByRole("combobox")).toHaveValue("6");
    expect(bandValues()).toEqual([0, 20, 60]);

    clickUpdate();
    expect(onBandCountChange).toHaveBeenCalledWith(6);
  });

  it("falls back to trimming when there is no preview", () => {
    renderEditor({ previewBandsForCount: () => null });

    setCount(5);
    expect(bandValues()).toEqual([0, 10, 20, 30, 40]);
  });

  it("does not preview for the custom method", () => {
    const previewBandsForCount = jest.fn(() => [0, 5, 15, 45, 90]);
    renderEditor({ isCustom: true, previewBandsForCount });

    setCount(5);
    expect(previewBandsForCount).not.toHaveBeenCalled();
    expect(bandValues()).toEqual([0, 10, 20, 30, 40]);
  });
});

describe("BandEditor reset", () => {
  it("clears a chosen band count on a non-custom reset", () => {
    const { onBandCountChange, onReset } = renderEditor({ hasBandCount: true });

    const reset = screen.getByRole("button", { name: "Reset" });
    expect(reset).not.toBeDisabled();
    clickReset();

    expect(onBandCountChange).toHaveBeenCalledWith(null);
    expect(onReset).not.toHaveBeenCalled();
  });

  it("is disabled with no edits and no chosen band count", () => {
    renderEditor();
    expect(screen.getByRole("button", { name: "Reset" })).toBeDisabled();
  });

  it("only reverts unsaved edits when no band count was chosen", () => {
    const { onBandCountChange } = renderEditor();

    setCount(5);
    clickReset();

    expect(bandValues()).toEqual(NINE_BANDS);
    expect(onBandCountChange).not.toHaveBeenCalled();
  });

  it("delegates a custom reset to onReset without clearing the count", () => {
    const { onBandCountChange, onReset } = renderEditor({ isCustom: true, hasBandCount: true });

    clickReset();

    expect(onReset).toHaveBeenCalled();
    expect(onBandCountChange).not.toHaveBeenCalled();
  });
});
