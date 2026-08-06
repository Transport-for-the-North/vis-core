import {
  buildCategoricalLegendKey,
  resolveCategoricalColours,
  getMetricDefinition,
  reclassifyData,
} from "./map";

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