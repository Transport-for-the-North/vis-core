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
  syncHoverLayerToBase,
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
      "red",
      "transparent",
    ]);
    expect(paint["circle-radius"]).toBe(5);
  });
});

describe("syncHoverLayerToBase", () => {
  const dataWidth = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, 1, 100, 8.5];
  const dataOffset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.25, 100, -5];

  it("copies a line layer's data-driven width into the hover gap width and copies the offset", () => {
    const map = makePaintMap({
      Links: { type: "line", paint: { "line-width": dataWidth, "line-offset": dataOffset } },
      "Links-hover": { type: "line", paint: getHoverLayerStyle("line").paint },
    });

    syncHoverLayerToBase(map, "Links");

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
    syncHoverLayerToBase(map, "Links");

    const widened = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, 2, 100, 17];
    const widenedOffset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.75, 100, -9.25];
    map.setPaintProperty("Links", "line-width", widened);
    map.setPaintProperty("Links", "line-offset", widenedOffset);
    syncHoverLayerToBase(map, "Links");

    expect(map.paintOf("Links-hover")["line-gap-width"]).toEqual(widened);
    expect(map.paintOf("Links-hover")["line-offset"]).toEqual(widenedOffset);
  });

  it("uses MapLibre's defaults when the base layer leaves width or offset unset", () => {
    const map = makePaintMap({
      Roads: { type: "line", paint: {} },
      "Roads-hover": { type: "line", paint: { "line-gap-width": 9, "line-offset": -4 } },
    });

    syncHoverLayerToBase(map, "Roads");

    expect(map.paintOf("Roads-hover")["line-gap-width"]).toBe(1);
    expect(map.paintOf("Roads-hover")["line-offset"]).toBe(0);
  });

  it("copies a circle layer's radius, including onto a custom hover id", () => {
    const radius = ["interpolate", ["linear"], ["to-number", ["feature-state", "valueAbs"]], 0, 2, 50, 25];
    const map = makePaintMap({
      "Stations-spider": { type: "circle", paint: { "circle-radius": radius } },
      "Stations-spider-hover": { type: "circle", paint: { "circle-radius": 5 } },
    });

    syncHoverLayerToBase(map, "Stations-spider", "Stations-spider-hover");

    expect(map.paintOf("Stations-spider-hover")["circle-radius"]).toEqual(radius);
  });

  it("leaves polygon hover outlines alone", () => {
    const map = makePaintMap({
      Zones: { type: "fill", paint: {} },
      "Zones-hover": { type: "line", paint: { "line-width": 3 } },
    });

    syncHoverLayerToBase(map, "Zones");

    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it("does nothing when the base or hover layer is missing", () => {
    const map = makePaintMap({ Links: { type: "line", paint: { "line-width": 4 } } });

    expect(() => syncHoverLayerToBase(map, "Links")).not.toThrow();
    expect(() => syncHoverLayerToBase(map, "Missing")).not.toThrow();
    expect(() => syncHoverLayerToBase(null, "Links")).not.toThrow();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });
});
