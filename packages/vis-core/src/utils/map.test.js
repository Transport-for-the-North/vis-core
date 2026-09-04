import {
  buildCategoricalLegendKey,
  resolveCategoricalColours,
  getMetricDefinition,
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

  describe("band variants", () => {
    /** defaultBands fixture carrying both category-level and metric-level variants. */
    const makeVariantBands = () => [
      {
        name: "trse",
        variants: {
          percentage: {
            differenceValues: [-50, -20, 0, 20, 50],
            legendSubtitleText: "% difference",
          },
        },
        metric: [
          {
            name: "trse",
            values: [0, 10, 20, 30],
            differenceValues: [-30, -10, 0, 10, 30],
            colours: ["#fff", "#ccc", "#999", "#333"],
          },
          {
            name: "other",
            values: [1, 2, 3],
            differenceValues: [-3, 0, 3],
            variants: {
              percentage: { differenceValues: [-5, 0, 5] },
            },
          },
        ],
      },
    ];

    /** Page whose metric filter drives the lookup and whose toggle drives the variant. */
    const makeVariantPage = () => ({
      category: "trse",
      pageName: "trse-page",
      config: {
        filters: [
          { containsLegendInfo: true, paramName: "metric" },
          { containsBandVariantInfo: true, paramName: "differenceType" },
        ],
      },
    });

    it("returns the base metric when no variant filter value is set", () => {
      const result = getMetricDefinition(makeVariantBands(), makeVariantPage(), {
        metric: { value: "trse" },
      });
      expect(result.differenceValues).toEqual([-30, -10, 0, 10, 30]);
      expect(result.legendSubtitleText).toBeUndefined();
    });

    it("returns the base metric when the variant key does not match a declared variant", () => {
      const result = getMetricDefinition(makeVariantBands(), makeVariantPage(), {
        metric: { value: "trse" },
        differenceType: { value: "absolute" },
      });
      expect(result.differenceValues).toEqual([-30, -10, 0, 10, 30]);
    });

    it("overlays the category-level variant onto the resolved metric", () => {
      const result = getMetricDefinition(makeVariantBands(), makeVariantPage(), {
        metric: { value: "trse" },
        differenceType: { value: "percentage" },
      });
      expect(result.differenceValues).toEqual([-50, -20, 0, 20, 50]);
      expect(result.legendSubtitleText).toBe("% difference");
      // Keys the variant does not restate are carried through untouched.
      expect(result.values).toEqual([0, 10, 20, 30]);
      expect(result.name).toBe("trse");
    });

    it("prefers a metric-level variant over the category-level one", () => {
      const result = getMetricDefinition(makeVariantBands(), makeVariantPage(), {
        metric: { value: "other" },
        differenceType: { value: "percentage" },
      });
      expect(result.differenceValues).toEqual([-5, 0, 5]);
      // The category variant's subtitle is not applied when a metric variant wins.
      expect(result.legendSubtitleText).toBeUndefined();
    });

    it("applies the variant on the bandMetricName path too", () => {
      const result = getMetricDefinition(
        makeVariantBands(),
        makeVariantPage(),
        { differenceType: { value: "percentage" } },
        { bandMetricName: "trse" }
      );
      expect(result.differenceValues).toEqual([-50, -20, 0, 20, 50]);
    });

    it("ignores the variant when the page declares no band-variant filter", () => {
      const currentPage = {
        category: "trse",
        pageName: "trse-page",
        config: { filters: [{ containsLegendInfo: true, paramName: "metric" }] },
      };
      const result = getMetricDefinition(makeVariantBands(), currentPage, {
        metric: { value: "trse" },
        differenceType: { value: "percentage" },
      });
      expect(result.differenceValues).toEqual([-30, -10, 0, 10, 30]);
    });
  });
});