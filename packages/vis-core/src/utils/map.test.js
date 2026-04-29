import {
  buildCategoricalLegendKey,
  resolveCategoricalColours,
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