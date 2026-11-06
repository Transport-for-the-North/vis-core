import {
  buildCategoricalLegendKey,
  resolveCategoricalColours,
  getMetricDefinition,
  reclassifyData,
  getWidthProperty,
  isBasePlaceLabelLayer,
  moveTownCityLabelsToTop,
  TOWN_CITY_LABEL_LAYER_IDS,
  createPaintProperty,
  isFeatureHoverable,
  isLayerZeroedBySlider,
  isNoDataHiddenByPaint,
  recordSliderOpacity,
  updateOpacityExpression,
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

describe("isNoDataHiddenByPaint", () => {
  const makeMap = (type, opacity) => ({
    getLayer: () => ({ type }),
    getPaintProperty: () => opacity,
  });
  const opacityPropByType = { fill: "fill-opacity", line: "line-opacity", circle: "circle-opacity" };

  it.each([
    ["polygon-continuous", "fill"],
    ["polygon-diverging", "fill"],
    ["line-continuous", "line"],
    ["line-diverging", "line"],
    ["line-categorical", "line"],
    ["circle-continuous", "circle"],
    ["circle-diverging", "circle"],
    ["circle-categorical", "circle"],
    ["point-continuous", "circle"],
    ["point-diverging", "circle"],
  ])("detects the no-data rule in the real %s paint", (style, type) => {
    const paint = createPaintProperty([0, 10], style, ["#000", "#fff"], 0.5);
    const map = makeMap(type, paint[opacityPropByType[type]]);

    expect(isNoDataHiddenByPaint(map, "layer", { isStylable: true })).toBe(true);
  });

  it("does not treat real polygon-categorical paint as hiding no-data features", () => {
    const paint = createPaintProperty([0, 10], "polygon-categorical", ["#000", "#fff"], 0.5);
    const map = makeMap("fill", paint["fill-opacity"]);

    expect(isNoDataHiddenByPaint(map, "layer", { isStylable: true })).toBe(false);
  });

  it("still detects the rule after the opacity slider has changed it, including to 0", () => {
    const paint = createPaintProperty([0, 10], "polygon-continuous", ["#000", "#fff"], 0.5);

    [0.3, 0].forEach((sliderValue) => {
      const opacity = updateOpacityExpression(paint["fill-opacity"], sliderValue);
      expect(isNoDataHiddenByPaint(makeMap("fill", opacity), "layer")).toBe(true);
    });
  });

  it("treats a constant 0 as hidden only on stylable layers", () => {
    expect(isNoDataHiddenByPaint(makeMap("fill", 0), "layer", { isStylable: true })).toBe(true);
    expect(isNoDataHiddenByPaint(makeMap("fill", 0), "layer", { isStylable: false })).toBe(false);
  });

  it("does not treat other opacity values as hiding no-data features", () => {
    const stylable = { isStylable: true };
    const unrelatedRule = ["case", ["get", "isOpen"], 0, 1];

    expect(isNoDataHiddenByPaint(makeMap("fill", 0.65), "layer", stylable)).toBe(false);
    expect(isNoDataHiddenByPaint(makeMap("fill", undefined), "layer", stylable)).toBe(false);
    expect(isNoDataHiddenByPaint(makeMap("fill", unrelatedRule), "layer", stylable)).toBe(false);
  });

  it("returns false for other layer types and for missing layers", () => {
    const stylable = { isStylable: true };

    expect(isNoDataHiddenByPaint(makeMap("symbol", 0), "layer", stylable)).toBe(false);
    expect(isNoDataHiddenByPaint({ getLayer: () => undefined }, "layer", stylable)).toBe(false);
  });
});

describe("isFeatureHoverable", () => {
  const hidingMap = {
    getLayer: () => ({ type: "fill" }),
    getPaintProperty: () => ["case", ["==", ["feature-state", "value"], null], 0, 0.65],
  };
  const visibleMap = {
    getLayer: () => ({ type: "fill" }),
    getPaintProperty: () => 0.65,
  };
  const noData = { layer: { id: "layer" }, state: {} };

  it("always allows features with data, including a value of 0", () => {
    const strictest = { shouldHaveHoverOnlyOnData: true, hoverNulls: false };

    [5, 0].forEach((value) => {
      const feature = { layer: { id: "layer" }, state: { value } };
      expect(isFeatureHoverable(hidingMap, feature, strictest)).toBe(true);
    });
  });

  it("follows the paint when no flags are set", () => {
    expect(isFeatureHoverable(hidingMap, noData, {})).toBe(false);
    expect(isFeatureHoverable(visibleMap, noData, {})).toBe(true);
  });

  it("lets hoverNulls override the paint in both directions", () => {
    expect(isFeatureHoverable(hidingMap, noData, { hoverNulls: true })).toBe(true);
    expect(isFeatureHoverable(visibleMap, noData, { hoverNulls: false })).toBe(false);
  });

  it("gives shouldHaveHoverOnlyOnData priority over hoverNulls", () => {
    const config = { shouldHaveHoverOnlyOnData: true, hoverNulls: true };

    expect(isFeatureHoverable(visibleMap, noData, config)).toBe(false);
  });

  it("treats a feature without a state object as having no data", () => {
    expect(isFeatureHoverable(hidingMap, { layer: { id: "layer" } }, {})).toBe(false);
  });
});

describe("isLayerZeroedBySlider", () => {
  const makeMap = (opacity, type = "fill") => ({
    getLayer: () => ({ type }),
    getPaintProperty: () => opacity,
  });
  const NULL_RULE = ["==", ["feature-state", "value"], null];

  it("is true after the slider sets a layer to 0, for a rule or a plain number", () => {
    [["case", NULL_RULE, 0, 0], 0].forEach((opacity) => {
      const map = makeMap(opacity);
      recordSliderOpacity(map, "layer", 0);

      expect(isLayerZeroedBySlider(map, "layer")).toBe(true);
    });
  });

  it("covers icon layers", () => {
    const map = makeMap(["case", ["boolean", ["feature-state", "hover"], false], 0, 0], "symbol");
    recordSliderOpacity(map, "layer", 0);

    expect(isLayerZeroedBySlider(map, "layer")).toBe(true);
  });

  it("is false for a layer that is invisible by design, as the slider never touched it", () => {
    expect(isLayerZeroedBySlider(makeMap(0), "layer")).toBe(false);
  });

  it("is false again once the slider moves back up", () => {
    const map = makeMap(["case", NULL_RULE, 0, 0.3]);
    recordSliderOpacity(map, "layer", 0);
    recordSliderOpacity(map, "layer", 0.3);

    expect(isLayerZeroedBySlider(map, "layer")).toBe(false);
  });

  it("ignores an out-of-date record when the layer is being drawn", () => {
    const map = makeMap(["case", NULL_RULE, 0, 0.65]);
    recordSliderOpacity(map, "layer", 0);

    expect(isLayerZeroedBySlider(map, "layer")).toBe(false);
  });

  it("keeps records separate for each map and layer", () => {
    const map = makeMap(0);
    const otherMap = makeMap(0);
    recordSliderOpacity(map, "layer", 0);

    expect(isLayerZeroedBySlider(otherMap, "layer")).toBe(false);
    expect(isLayerZeroedBySlider(map, "otherLayer")).toBe(false);
  });

  it("is false if the layer no longer exists", () => {
    const map = { getLayer: () => undefined, getPaintProperty: () => 0 };
    recordSliderOpacity(map, "layer", 0);

    expect(isLayerZeroedBySlider(map, "layer")).toBe(false);
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
