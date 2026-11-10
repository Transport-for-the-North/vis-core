import {
  buildCategoricalLegendKey,
  resolveCategoricalColours,
  getMetricDefinition,
  reclassifyData,
  getWidthProperty,
  isBasePlaceLabelLayer,
  moveTownCityLabelsToTop,
  TOWN_CITY_LABEL_LAYER_IDS,
  getHoverLayerStyle,
  syncHighlightLayerToBase,
  syncHighlightsToBase,
  getSelectedLayerStyle,
  applyHighlightTheme,
  getSelectedInnerLayerStyle,
  SELECT_COLORS,
  HOVER_COLORS,
} from "./map";
import { DisplayMode } from "enums";

describe("buildCategoricalLegendKey", () => {
  it("normalises field names and values into a stable key", () => {
    expect(
      buildCategoricalLegendKey({ fieldName: " Value ", value: " High Risk " })
    ).toBe("value::high risk");
  });

  it("returns null for empty field names or values", () => {
    expect(buildCategoricalLegendKey({ fieldName: "", value: "A" })).toBeNull();
    expect(buildCategoricalLegendKey({ fieldName: "value", value: "  " })).toBeNull();
  });
});

describe("resolveCategoricalColours", () => {
  it("reuses cached colours and only creates entries for unseen categories", () => {
    const cache = {
      "value::a": {
        label: "A",
        colour: "#111111",
        fieldName: "value",
        schemeName: "scheme-a",
      },
    };

    const result = resolveCategoricalColours({
      bins: ["B", "A"],
      colours: ["#aaaaaa", "#bbbbbb"],
      cache,
      fieldName: "value",
      schemeName: "scheme-a",
    });

    expect(result.resolvedBins).toEqual(["A", "B"]);
    expect(result.resolvedColours).toEqual(["#111111", "#aaaaaa"]);
    expect(result.newCacheEntries).toEqual({
      "value::b": {
        label: "B",
          colour: "#aaaaaa",
        fieldName: "value",
        schemeName: "scheme-a",
      },
    });
  });

  it("keeps the same categorical colours when filters change the visible categories", () => {
    const cache = {
      "value::alpha": {
        label: "Alpha",
        colour: "#123456",
        fieldName: "value",
        schemeName: "scheme-a",
      },
      "value::beta": {
        label: "Beta",
        colour: "#654321",
        fieldName: "value",
        schemeName: "scheme-a",
      },
      "value::gamma": {
        label: "Gamma",
        colour: "#abcdef",
        fieldName: "value",
        schemeName: "scheme-a",
      },
    };

    const result = resolveCategoricalColours({
      bins: ["Gamma", "Alpha"],
      colours: ["#ff0000", "#00ff00"],
      cache,
      fieldName: "value",
      schemeName: "scheme-b",
    });

    expect(result.resolvedBins).toEqual(["Alpha", "Gamma"]);
    expect(result.resolvedColours).toEqual(["#123456", "#abcdef"]);
    expect(result.newCacheEntries).toEqual({});
  });

  it("does not assign duplicate colours when cached categories already use earlier palette colours", () => {
    const cache = {
      "value::gamma": {
        label: "Gamma",
        colour: "#111111",
        fieldName: "value",
        schemeName: "scheme-a",
      },
    };

    const result = resolveCategoricalColours({
      bins: ["Alpha", "Beta", "Gamma"],
      colours: ["#111111", "#222222", "#333333"],
      cache,
      fieldName: "value",
      schemeName: "scheme-a",
    });

    expect(result.resolvedBins).toEqual(["Alpha", "Beta", "Gamma"]);
    expect(result.resolvedColours).toEqual(["#222222", "#333333", "#111111"]);
    expect(new Set(result.resolvedColours).size).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// getMetricDefinition
// ---------------------------------------------------------------------------

/** Minimal defaultBands fixture used across getMetricDefinition tests. */
const makeDefaultBands = () => [
  {
    name: "trse",
    metric: [
      { name: "trse", values: [0, 10, 20, 30], colours: ["#fff", "#ccc", "#999", "#333"] },
      { name: "other", values: [1, 2, 3], colours: ["#aaa", "#bbb", "#ccc"] },
    ],
  },
];

/** Minimal currentPage with a category matching the bands fixture. */
const makeCurrentPage = (overrides = {}) => ({
  category: "trse",
  pageName: "trse-page",
  ...overrides,
});

describe("getMetricDefinition", () => {
  describe("bandMetricName option (primary API)", () => {
    it("returns the matching metric when bandMetricName resolves", () => {
      const result = getMetricDefinition(
        makeDefaultBands(),
        makeCurrentPage(),
        {},
        { bandMetricName: "trse" }
      );
      expect(result).toMatchObject({ name: "trse" });
    });

    it("falls through to filter-based resolution when bandMetricName does not match any metric", () => {
      const currentPage = makeCurrentPage({
        config: {
          filters: [{ containsLegendInfo: true, paramName: "metric" }],
        },
      });
      const queryParams = { metric: { value: "other" } };

      const result = getMetricDefinition(
        makeDefaultBands(),
        currentPage,
        queryParams,
        { bandMetricName: "nonexistent" }
      );

      // Should fall through and resolve via the filter path.
      expect(result).toMatchObject({ name: "other" });
    });

    it("returns null when bandMetricName does not match and there is no filter path", () => {
      const result = getMetricDefinition(
        makeDefaultBands(),
        makeCurrentPage(),
        {},
        { bandMetricName: "nonexistent" }
      );
      expect(result).toBeNull();
    });
  });

  describe("filter-based resolution (no bandMetricName)", () => {
    it("resolves via the containsLegendInfo filter when no bandMetricName is given", () => {
      const currentPage = makeCurrentPage({
        config: {
          filters: [{ containsLegendInfo: true, paramName: "metric" }],
        },
      });
      const queryParams = { metric: { value: "other" } };

      const result = getMetricDefinition(makeDefaultBands(), currentPage, queryParams);
      expect(result).toMatchObject({ name: "other" });
    });

    it("returns null when the filter param value does not match any metric", () => {
      const currentPage = makeCurrentPage({
        config: {
          filters: [{ containsLegendInfo: true, paramName: "metric" }],
        },
      });
      const queryParams = { metric: { value: "unknown" } };

      const result = getMetricDefinition(makeDefaultBands(), currentPage, queryParams);
      expect(result).toBeNull();
    });

    it("returns null when defaultBands is empty", () => {
      const result = getMetricDefinition([], makeCurrentPage(), {}, { bandMetricName: "trse" });
      expect(result).toBeNull();
    });

    it("returns null when defaultBands is undefined", () => {
      const result = getMetricDefinition(undefined, makeCurrentPage(), {});
      expect(result).toBeNull();
    });

    it("resolves page category via pageName when category is absent", () => {
      const currentPage = { pageName: "trse" };
      const result = getMetricDefinition(
        makeDefaultBands(),
        currentPage,
        {},
        { bandMetricName: "trse" }
      );
      expect(result).toMatchObject({ name: "trse" });
    });
  });

  describe("display mode resolution", () => {
    /** Bands carrying per-metric entries plus a display-mode entry for the category. */
    const makeDisplayModeBands = () => [
      {
        name: "trse",
        metric: [
          {
            name: "trse",
            values: [0, 10, 20, 30],
            differenceValues: [-30, -10, 0, 10, 30],
            colours: ["#fff", "#ccc", "#999", "#333"],
          },
          {
            name: DisplayMode.PCT_DIFFERENCE,
            differenceValues: [-100, -50, 0, 50, 100],
          },
        ],
      },
    ];

    const makeDisplayModePage = () => ({
      category: "trse",
      pageName: "trse-page",
      config: {
        filters: [{ containsLegendInfo: true, paramName: "metric" }],
      },
    });

    it("returns the metric's own bands when the mode has no matching entry", () => {
      const result = getMetricDefinition(
        makeDisplayModeBands(),
        makeDisplayModePage(),
        { metric: { value: "trse" } },
        { displayMode: DisplayMode.ABSOLUTE }
      );
      expect(result.differenceValues).toEqual([-30, -10, 0, 10, 30]);
    });

    it("returns the mode entry when one is named after the active display mode", () => {
      const result = getMetricDefinition(
        makeDisplayModeBands(),
        makeDisplayModePage(),
        { metric: { value: "trse" } },
        { displayMode: DisplayMode.PCT_DIFFERENCE }
      );
      expect(result.differenceValues).toEqual([-100, -50, 0, 50, 100]);
    });

    it("replaces the metric definition outright rather than merging into it", () => {
      const result = getMetricDefinition(
        makeDisplayModeBands(),
        makeDisplayModePage(),
        { metric: { value: "trse" } },
        { displayMode: DisplayMode.PCT_DIFFERENCE }
      );
      // The metric's absolute-scale keys must not leak into the percentage view.
      expect(result.values).toBeUndefined();
      expect(result.colours).toBeUndefined();
    });

    it("lets the mode entry win over an explicit bandMetricName", () => {
      const result = getMetricDefinition(
        makeDisplayModeBands(),
        makeDisplayModePage(),
        {},
        { bandMetricName: "trse", displayMode: DisplayMode.PCT_DIFFERENCE }
      );
      expect(result.differenceValues).toEqual([-100, -50, 0, 50, 100]);
    });

    it("ignores display mode when the caller supplies none", () => {
      const result = getMetricDefinition(makeDisplayModeBands(), makeDisplayModePage(), {
        metric: { value: "trse" },
      });
      expect(result.differenceValues).toEqual([-30, -10, 0, 10, 30]);
    });

    it("falls back to the metric's bands when the mode has no configured entry", () => {
      // A mode needs no bands.js entry to be usable; callers then classify from the data.
      const result = getMetricDefinition(
        makeDisplayModeBands(),
        makeDisplayModePage(),
        { metric: { value: "trse" } },
        { displayMode: DisplayMode.DIFFERENCE }
      );
      expect(result).toMatchObject({ name: "trse" });
    });
  });
});

describe("reclassifyData", () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it.each([
    ["a { data } envelope", { data: [{ id: 1, value: 5 }] }],
    ["an error payload", { detail: "Not found" }],
    ["a string", "no data"],
    ["undefined", undefined],
  ])("returns no bins and warns when given %s", (_label, data) => {
    expect(reclassifyData(data, "polygon-continuous", "q", [], {}, {})).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it("still classifies a valid array of records", () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8].map((value, id) => ({ id, value }));
    const bins = reclassifyData(data, "polygon-continuous", "q", [], {}, {});

    expect(Array.isArray(bins)).toBe(true);
    expect(bins.length).toBeGreaterThan(1);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});

describe("getWidthProperty", () => {
  let warnSpy;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it("returns line-width for line layers", () => {
    expect(getWidthProperty("line")).toBe("line-width");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns circle-radius for circle layers", () => {
    expect(getWidthProperty("circle")).toBe("circle-radius");
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("returns undefined without warning for fill, symbol, raster, and background layers", () => {
    expect(getWidthProperty("fill")).toBeUndefined();
    expect(getWidthProperty("symbol")).toBeUndefined();
    expect(getWidthProperty("raster")).toBeUndefined();
    expect(getWidthProperty("background")).toBeUndefined();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns and returns undefined for unknown layer types", () => {
    expect(getWidthProperty("unknown-type")).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith("Unable to get width property name for layerType unknown-type");
  });
});

describe("isBasePlaceLabelLayer", () => {
  it("identifies standard place-label symbol layers", () => {
    expect(
      isBasePlaceLabelLayer({
        id: "place_town",
        type: "symbol",
      })
    ).toBe(true);

    expect(
      isBasePlaceLabelLayer({
        id: "place_city",
        type: "symbol",
      })
    ).toBe(true);

    expect(
      isBasePlaceLabelLayer({
        id: "place_village",
        type: "symbol",
      })
    ).toBe(true);

    expect(
      isBasePlaceLabelLayer({
        id: "place_country_major",
        type: "symbol",
      })
    ).toBe(true);
  });

  it("identifies additional place-prefix symbol layers", () => {
    expect(
      isBasePlaceLabelLayer({
        id: "place_region",
        type: "symbol",
      })
    ).toBe(true);

    expect(
      isBasePlaceLabelLayer({
        id: "place-suburb",
        type: "symbol",
      })
    ).toBe(true);
  });

  it("rejects non-symbol and non-place layers", () => {
    expect(
      isBasePlaceLabelLayer({
        id: "place_boundaries",
        type: "line",
      })
    ).toBe(false);

    expect(
      isBasePlaceLabelLayer({
        id: "custom-polygon-layer",
        type: "fill",
      })
    ).toBe(false);

    expect(
      isBasePlaceLabelLayer({
        id: "water",
        type: "symbol",
      })
    ).toBe(false);

    expect(isBasePlaceLabelLayer(null)).toBe(false);
    expect(isBasePlaceLabelLayer({})).toBe(false);
  });

  it("does not target application-owned place-prefixed layers when base sources are known", () => {
    const baseSourceIds = new Set(["openmaptiles"]);

    expect(
      isBasePlaceLabelLayer(
        { id: "place_markers", type: "symbol", source: "app-source" },
        baseSourceIds
      )
    ).toBe(false);

    expect(
      isBasePlaceLabelLayer(
        { id: "place_town", type: "symbol", source: "openmaptiles" },
        baseSourceIds
      )
    ).toBe(true);
  });
});

describe("moveTownCityLabelsToTop", () => {
  it("moves known label layers to the top of the map layer stack in order", () => {
    const existingLayers = new Set(["place_town", "place_city", "place_village"]);
    const moved = [];
    const mockMap = {
      getLayer: jest.fn((id) => (existingLayers.has(id) ? { id, type: "symbol" } : undefined)),
      moveLayer: jest.fn((id) => moved.push(id)),
      getStyle: jest.fn(() => ({
        layers: [
          { id: "background", type: "background" },
          { id: "place_town", type: "symbol" },
          { id: "place_village", type: "symbol" },
          { id: "place_custom", type: "symbol" },
        ],
      })),
    };
    existingLayers.add("place_custom");

    moveTownCityLabelsToTop(mockMap);

    expect(mockMap.moveLayer).toHaveBeenCalledWith("place_town");
    expect(mockMap.moveLayer).toHaveBeenCalledWith("place_village");
    expect(mockMap.moveLayer).toHaveBeenCalledWith("place_custom");
    expect(mockMap.moveLayer).not.toHaveBeenCalledWith("place_city_large");
  });

  it("does not move application-owned place labels when base sources are known", () => {
    const mockMap = {
      getLayer: jest.fn((id) => ({
        id,
        type: "symbol",
        source: id === "place_custom" ? "app-source" : "openmaptiles",
      })),
      moveLayer: jest.fn(),
      getStyle: jest.fn(() => ({
        layers: [
          { id: "place_town", type: "symbol", source: "openmaptiles" },
          { id: "place_custom", type: "symbol", source: "app-source" },
        ],
      })),
    };

    moveTownCityLabelsToTop(mockMap, new Set(["openmaptiles"]));

    expect(mockMap.moveLayer).toHaveBeenCalledWith("place_town");
    expect(mockMap.moveLayer).not.toHaveBeenCalledWith("place_custom");
  });

  it("safely handles maps without getLayer or moveLayer", () => {
    expect(() => moveTownCityLabelsToTop(null)).not.toThrow();
    expect(() => moveTownCityLabelsToTop({})).not.toThrow();
  });
});

/**
 * Minimal stateful map: layers keyed by id, each with a type and a paint object
 * that getPaintProperty / setPaintProperty read and write.
 */
const makePaintMap = (layers) => {
  const store = Object.fromEntries(
    Object.entries(layers).map(([id, { type, paint = {} }]) => [id, { id, type, paint: { ...paint } }])
  );
  return {
    getLayer: jest.fn((id) => store[id]),
    getPaintProperty: jest.fn((id, prop) => store[id]?.paint[prop]),
    setPaintProperty: jest.fn((id, prop, value) => {
      store[id].paint[prop] = value;
    }),
    paintOf: (id) => store[id].paint,
  };
};

describe("getHoverLayerStyle line", () => {
  it("draws an outline around the line instead of a zoom-scaled line", () => {
    const { paint } = getHoverLayerStyle("line");
    expect(paint["line-width"]).toBe(2);
    expect(paint["line-gap-width"]).toBe(1);
    expect(paint["line-offset"]).toBe(0);
  });

  it("starts from the layer's custom offset when one is set", () => {
    const { paint } = getHoverLayerStyle("line", { defaultLineOffset: -3 });
    expect(paint["line-offset"]).toBe(-3);
  });
});

describe("getHoverLayerStyle point", () => {
  it("draws a ring that leaves the point's data colour visible", () => {
    const { paint } = getHoverLayerStyle("point");
    expect(paint["circle-color"]).toBe("transparent");
    expect(paint["circle-stroke-width"]).toBe(2);
    expect(paint["circle-stroke-color"]).toEqual([
      "case",
      ["boolean", ["feature-state", "hover"], false],
      "#1f1f1f",
      "transparent",
    ]);
    expect(paint["circle-radius"]).toBe(5);
  });
});

describe("hover colour by theme", () => {
  const colourOf = (style) => {
    const { paint } = style;
    return (paint["line-color"] ?? paint["circle-stroke-color"])[2];
  };

  it.each(["polygon", "line", "point"])("uses near-black on light and white on dark base maps for %s", (geometryType) => {
    expect(colourOf(getHoverLayerStyle(geometryType))).toBe(HOVER_COLORS.light);
    expect(colourOf(getHoverLayerStyle(geometryType, {}, "light"))).toBe("#1f1f1f");
    expect(colourOf(getHoverLayerStyle(geometryType, {}, "dark"))).toBe("#ffffff");
  });

  it("only shows the colour on the hovered feature", () => {
    const [op, condition, , otherwise] = getHoverLayerStyle("line", {}, "dark").paint["line-color"];
    expect(op).toBe("case");
    expect(condition).toEqual(["boolean", ["feature-state", "hover"], false]);
    expect(otherwise).toBe("transparent");
  });

  it("falls back to the light colour for an unknown theme", () => {
    expect(colourOf(getHoverLayerStyle("polygon", {}, "sepia"))).toBe(HOVER_COLORS.light);
  });

  it("draws line hover at full opacity and polygon outlines no wider than 4px", () => {
    expect(getHoverLayerStyle("line").paint["line-opacity"]).toBe(1);
    const widths = getHoverLayerStyle("polygon").paint["line-width"].slice(3).filter((_, i) => i % 2 === 1);
    expect(Math.max(...widths)).toBe(4);
  });
});

describe("applyHighlightTheme", () => {
  it("recolours line and circle hover layers and skips symbols and missing layers", () => {
    const map = makePaintMap({
      "Links-hover": { type: "line", paint: getHoverLayerStyle("line").paint },
      "Stations-hover": { type: "circle", paint: getHoverLayerStyle("point").paint },
      "Icons-hover": { type: "symbol", paint: {} },
    });

    applyHighlightTheme(map, "Links-hover", "dark");
    applyHighlightTheme(map, "Stations-hover", "dark");
    applyHighlightTheme(map, "Icons-hover", "dark");
    applyHighlightTheme(map, "Missing-hover", "dark");

    expect(map.paintOf("Links-hover")["line-color"][2]).toBe("#ffffff");
    expect(map.paintOf("Stations-hover")["circle-stroke-color"][2]).toBe("#ffffff");
    const touched = map.setPaintProperty.mock.calls.map(([id]) => id);
    expect(touched).not.toContain("Icons-hover");
    expect(touched).not.toContain("Missing-hover");
  });

  it("swaps the select outline and inside colours, including the inner fill, on a theme change", () => {
    const map = makePaintMap({
      "Links-select": { type: "line", paint: getSelectedLayerStyle("line").paint },
      "Links-select-inner": { type: "line", paint: getSelectedInnerLayerStyle("line").paint },
      "Zones-select-inner": { type: "fill", paint: getSelectedInnerLayerStyle("polygon").paint },
      "Stations-spider-select": { type: "circle", paint: getSelectedLayerStyle("point").paint },
    });

    ["Links-select", "Links-select-inner", "Zones-select-inner", "Stations-spider-select"].forEach((id) =>
      applyHighlightTheme(map, id, "dark")
    );

    expect(map.paintOf("Links-select")["line-color"][2]).toBe("#ffffff");
    expect(map.paintOf("Links-select-inner")["line-color"][2]).toBe("#1f1f1f");
    expect(map.paintOf("Zones-select-inner")["fill-color"][2]).toBe("#1f1f1f");
    expect(map.paintOf("Stations-spider-select")["circle-stroke-color"][2]).toBe("#ffffff");
    expect(map.paintOf("Stations-spider-select")["circle-color"][2]).toBe("#1f1f1f");
    // Only colours change; sizes stay as they were.
    expect(map.paintOf("Links-select")["line-width"]).toBe(2);
  });
});

describe("syncHighlightsToBase", () => {
  const dataWidth = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, 1, 100, 8.5];
  const dataOffset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.25, 100, -5];

  it("copies a line layer's data-driven width into the hover gap width and copies the offset", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-hover": { type: "line", paint: getHoverLayerStyle("line").paint },
    });

    syncHighlightsToBase(map, "Links");

    expect(map.paintOf("Links-hover")["line-gap-width"]).toEqual(dataWidth);
    expect(map.paintOf("Links-hover")["line-offset"]).toEqual(dataOffset);
    // The outline thickness itself is left alone.
    expect(map.paintOf("Links-hover")["line-width"]).toBe(2);
  });

  it("follows the base layer when its width and offset change", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-hover": { type: "line", paint: {} },
    });
    syncHighlightsToBase(map, "Links");

    const widened = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, 2, 100, 17];
    const widenedOffset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.75, 100, -9.25];
    map.setPaintProperty("Links", "line-width", widened);
    map.setPaintProperty("Links", "line-offset", widenedOffset);
    syncHighlightsToBase(map, "Links");

    expect(map.paintOf("Links-hover")["line-gap-width"]).toEqual(widened);
    expect(map.paintOf("Links-hover")["line-offset"]).toEqual(widenedOffset);
  });

  it("uses MapLibre's defaults when the base layer leaves width or offset unset", () => {
    const map = makePaintMap({
      Roads: { type: "line", paint: {} },
      "Roads-hover": { type: "line", paint: { "line-gap-width": 9, "line-offset": -4 } },
    });

    syncHighlightsToBase(map, "Roads");

    expect(map.paintOf("Roads-hover")["line-gap-width"]).toBe(1);
    expect(map.paintOf("Roads-hover")["line-offset"]).toBe(0);
  });

  it("copies a circle layer's radius, including onto a custom hover id", () => {
    const radius = ["interpolate", ["linear"], ["to-number", ["feature-state", "valueAbs"]], 0, 2, 50, 25];
    const map = makePaintMap({
      "Stations-spider": { type: "circle", paint: { "circle-radius": radius } },
      "Stations-spider-hover": { type: "circle", paint: { "circle-radius": 5 } },
    });

    syncHighlightLayerToBase(map, "Stations-spider", "Stations-spider-hover");

    expect(map.paintOf("Stations-spider-hover")["circle-radius"]).toEqual(radius);
  });

  it("leaves polygon hover outlines alone", () => {
    const map = makePaintMap({
      Zones: { type: "fill", paint: {} },
      "Zones-hover": { type: "line", paint: { "line-width": 3 } },
    });

    syncHighlightsToBase(map, "Zones");

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it("does nothing when the base or hover layer is missing", () => {
    const map = makePaintMap({ Links: { type: "line", paint: { "line-width": 4 } } });

    expect(() => syncHighlightsToBase(map, "Links")).not.toThrow();
    expect(() => syncHighlightsToBase(map, "Missing")).not.toThrow();
    expect(() => syncHighlightsToBase(null, "Links")).not.toThrow();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });
});

describe("selected highlight style", () => {
  const selected = (colour) => ["case", ["boolean", ["feature-state", "selected"], false], colour, "transparent"];

  it("uses the theme's hover colour for the outline and the opposite colour inside", () => {
    expect(SELECT_COLORS.light).toEqual({ outline: "#1f1f1f", inside: "#ffffff" });
    expect(SELECT_COLORS.dark).toEqual({ outline: "#ffffff", inside: "#1f1f1f" });
  });

  it("draws a selected line as an outline around the line, filled by the inner layer", () => {
    const { paint } = getSelectedLayerStyle("line");
    expect(paint["line-color"]).toEqual(selected("#1f1f1f"));
    expect(paint["line-width"]).toBe(2);
    expect(paint["line-gap-width"]).toBe(1);
    expect(paint["line-offset"]).toBe(0);

    const inner = getSelectedInnerLayerStyle("line");
    expect(inner.type).toBe("line");
    expect(inner.paint["line-color"]).toEqual(selected("#ffffff"));
  });

  it("fills a selected polygon under its outline", () => {
    expect(getSelectedLayerStyle("polygon").paint["line-color"]).toEqual(selected("#1f1f1f"));
    const inner = getSelectedInnerLayerStyle("polygon");
    expect(inner.type).toBe("fill");
    expect(inner.paint).toEqual({ "fill-color": selected("#ffffff"), "fill-opacity": 1 });
  });

  it("fills a selected point inside its ring, with no inner layer", () => {
    const { paint } = getSelectedLayerStyle("point");
    expect(paint["circle-color"]).toEqual(selected("#ffffff"));
    expect(paint["circle-opacity"]).toBe(1);
    expect(paint["circle-stroke-color"]).toEqual(selected("#1f1f1f"));
    expect(paint["circle-stroke-width"]).toBe(2);
    expect(getSelectedInnerLayerStyle("point")).toBeNull();
    expect(getSelectedInnerLayerStyle("symbol")).toBeNull();
  });

  it("reverses the colours on a dark base map", () => {
    expect(getSelectedLayerStyle("line", "dark").paint["line-color"]).toEqual(selected("#ffffff"));
    expect(getSelectedInnerLayerStyle("line", "dark").paint["line-color"]).toEqual(selected("#1f1f1f"));
    expect(getSelectedLayerStyle("point", "dark").paint["circle-color"]).toEqual(selected("#1f1f1f"));
  });
});

describe("syncHighlightsToBase select layer", () => {
  const dataWidth = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, 1, 100, 8.5];
  const dataOffset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.25, 100, -5];

  it("gives the select outline the same width and offset as the base line, alongside the hover", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-hover": { type: "line", paint: getHoverLayerStyle("line").paint },
      "Links-select": { type: "line", paint: getSelectedLayerStyle("line").paint },
    });

    syncHighlightsToBase(map, "Links");

    for (const id of ["Links-hover", "Links-select"]) {
      expect(map.paintOf(id)["line-gap-width"]).toEqual(dataWidth);
      expect(map.paintOf(id)["line-offset"]).toEqual(dataOffset);
    }
    expect(map.paintOf("Links-select")["line-color"][2]).toBe("#1f1f1f");
  });

  it("gives the inner line exactly the base line's width and offset, so the outline wraps it", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-select": { type: "line", paint: getSelectedLayerStyle("line").paint },
      "Links-select-inner": { type: "line", paint: getSelectedInnerLayerStyle("line").paint },
    });

    syncHighlightsToBase(map, "Links");

    expect(map.paintOf("Links-select-inner")["line-width"]).toEqual(dataWidth);
    expect(map.paintOf("Links-select-inner")["line-offset"]).toEqual(dataOffset);
    expect(map.paintOf("Links-select-inner")["line-gap-width"]).toBeUndefined();
    expect(map.paintOf("Links-select")["line-gap-width"]).toEqual(dataWidth);
  });

  it("leaves a polygon's inner fill alone", () => {
    const map = makePaintMap({
      Zones: { type: "fill", paint: {} },
      "Zones-select-inner": { type: "fill", paint: getSelectedInnerLayerStyle("polygon").paint },
    });

    syncHighlightsToBase(map, "Zones");

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it("syncs the select layer on its own when the layer is not hoverable", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-select": { type: "line", paint: getSelectedLayerStyle("line").paint },
    });

    syncHighlightsToBase(map, "Links");

    expect(map.paintOf("Links-select")["line-gap-width"]).toEqual(dataWidth);
    expect(map.paintOf("Links-select")["line-offset"]).toEqual(dataOffset);
  });

  it("sizes the selected point circle from the base radius and leaves polygon select alone", () => {
    const radius = ["interpolate", ["linear"], ["to-number", ["feature-state", "valueAbs"]], 0, 2, 50, 25];
    const map = makePaintMap({
      Stations: { type: "circle", paint: { "circle-radius": radius } },
      "Stations-select": { type: "circle", paint: getSelectedLayerStyle("point").paint },
      Zones: { type: "fill", paint: {} },
      "Zones-select": { type: "line", paint: getSelectedLayerStyle("polygon").paint },
    });

    syncHighlightsToBase(map, "Stations");
    syncHighlightsToBase(map, "Zones");

    expect(map.paintOf("Stations-select")["circle-radius"]).toEqual(radius);
    expect(map.paintOf("Zones-select")["line-width"]).toBe(2);
    expect(map.paintOf("Zones-select")["line-gap-width"]).toBeUndefined();
  });
});
