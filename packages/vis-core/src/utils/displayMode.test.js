import {
  isDisplayMode,
  normaliseDisplayMode,
  getVisualisationDisplayMode,
  resolveDisplayUnit,
  resolveVisualisationUnit,
} from "./displayMode";
import { DisplayMode, DEFAULT_DISPLAY_MODE } from "enums";

describe("isDisplayMode", () => {
  it("recognises every mode the library defines", () => {
    Object.values(DisplayMode).forEach((mode) => {
      expect(isDisplayMode(mode)).toBe(true);
    });
  });

  it("rejects unknown tokens and non-strings", () => {
    expect(isDisplayMode("sideways")).toBe(false);
    expect(isDisplayMode(undefined)).toBe(false);
    expect(isDisplayMode(null)).toBe(false);
    expect(isDisplayMode(1)).toBe(false);
  });

  it("does not treat inherited Object properties as modes", () => {
    expect(isDisplayMode("toString")).toBe(false);
    expect(isDisplayMode("constructor")).toBe(false);
  });
});

describe("normaliseDisplayMode", () => {
  it("passes through a recognised mode", () => {
    expect(normaliseDisplayMode(DisplayMode.PCT_DIFFERENCE)).toBe(
      DisplayMode.PCT_DIFFERENCE
    );
  });

  it("falls back to the default for anything unrecognised", () => {
    expect(normaliseDisplayMode("not-a-mode")).toBe(DEFAULT_DISPLAY_MODE);
    expect(normaliseDisplayMode(undefined)).toBe(DEFAULT_DISPLAY_MODE);
  });

  it("defaults to absolute, which is the pre-display-mode behaviour", () => {
    expect(DEFAULT_DISPLAY_MODE).toBe(DisplayMode.ABSOLUTE);
  });
});

describe("getVisualisationDisplayMode", () => {
  it("reads the mode tracked on the visualisation", () => {
    expect(
      getVisualisationDisplayMode({ displayMode: DisplayMode.PCT_DIFFERENCE })
    ).toBe(DisplayMode.PCT_DIFFERENCE);
  });

  it("defaults for a visualisation that predates display modes", () => {
    expect(getVisualisationDisplayMode({})).toBe(DEFAULT_DISPLAY_MODE);
    expect(getVisualisationDisplayMode(undefined)).toBe(DEFAULT_DISPLAY_MODE);
  });
});

describe("resolveDisplayUnit", () => {
  it("keeps the metric's own unit in absolute mode", () => {
    expect(resolveDisplayUnit(DisplayMode.ABSOLUTE, "Passengers")).toBe("Passengers");
  });

  it("keeps the metric's own unit in difference mode", () => {
    expect(resolveDisplayUnit(DisplayMode.DIFFERENCE, "Passengers")).toBe("Passengers");
  });

  it("shows % in percentage difference mode, whatever the metric's unit", () => {
    expect(resolveDisplayUnit(DisplayMode.PCT_DIFFERENCE, "Passengers")).toBe("%");
    expect(resolveDisplayUnit(DisplayMode.PCT_DIFFERENCE, "")).toBe("%");
    expect(resolveDisplayUnit(DisplayMode.PCT_DIFFERENCE, undefined)).toBe("%");
  });

  it("returns an empty string rather than undefined when there is no unit", () => {
    expect(resolveDisplayUnit(DisplayMode.ABSOLUTE, undefined)).toBe("");
  });

  it("treats an unknown mode as absolute so the map still reads sensibly", () => {
    expect(resolveDisplayUnit("some-future-mode", "Passengers")).toBe("Passengers");
  });
});

describe("resolveVisualisationUnit", () => {
  it("gives the legend and the hovertip the same answer for one visualisation", () => {
    const visualisation = { displayMode: DisplayMode.PCT_DIFFERENCE };
    expect(resolveVisualisationUnit(visualisation, "Passengers")).toBe("%");
  });

  it("leaves units untouched for a visualisation with no mode tracked", () => {
    expect(resolveVisualisationUnit({}, "Passengers")).toBe("Passengers");
  });
});
