import { actionTypes, mapReducer } from "./mapReducer";

describe("mapReducer categorical legend cache", () => {
  it("registers categorical legend entries without replacing the existing cache", () => {
    const initialState = {
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#111111",
          fieldName: "value",
          schemeName: "scheme-a",
        },
      },
    };

    const nextState = mapReducer(initialState, {
      type: actionTypes.REGISTER_CATEGORICAL_LEGEND_ITEMS,
      payload: {
        "value::b": {
          label: "B",
          colour: "#222222",
          fieldName: "value",
          schemeName: "scheme-a",
        },
      },
    });

    expect(nextState.categoricalLegendCache).toEqual({
      "value::a": {
        label: "A",
        colour: "#111111",
        fieldName: "value",
        schemeName: "scheme-a",
      },
      "value::b": {
        label: "B",
        colour: "#222222",
        fieldName: "value",
        schemeName: "scheme-a",
      },
    });
  });

  it("merges categorical legend cache updates over existing keys", () => {
    const initialState = {
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#111111",
          fieldName: "value",
          schemeName: "scheme-a",
        },
      },
    };

    const nextState = mapReducer(initialState, {
      type: actionTypes.MERGE_CATEGORICAL_LEGEND_CACHE,
      payload: {
        "value::a": {
          label: "A",
          colour: "#ff0000",
          fieldName: "value",
          schemeName: "scheme-b",
        },
      },
    });

    expect(nextState.categoricalLegendCache["value::a"]).toEqual({
      label: "A",
      colour: "#ff0000",
      fieldName: "value",
      schemeName: "scheme-b",
    });
  });

  it("preserves the categorical legend cache when resetting page context", () => {
    const initialState = {
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#111111",
          fieldName: "value",
          schemeName: "scheme-a",
        },
      },
      layers: { layerA: { id: "layerA" } },
      visualisations: { visA: { id: "visA" } },
      colorSchemesByLayer: { layerA: { value: "YlGnBu", label: "YlGnBu" } },
      filters: [{ id: "filter-a" }],
      leftVisualisations: { leftA: {} },
      rightVisualisations: { rightA: {} },
      isLoading: false,
      pageIsReady: true,
      selectionMode: "single",
      selectionLayer: "layerA",
      selectedFeatures: [1],
      isFeatureSelectActive: true,
      visualisedFeatureIds: [1],
    };

    const nextState = mapReducer(initialState, {
      type: actionTypes.RESET_CONTEXT,
    });

    expect(nextState.categoricalLegendCache).toEqual(initialState.categoricalLegendCache);
    expect(nextState.layers).toEqual({});
    expect(nextState.visualisations).toEqual({});
    expect(nextState.filters).toEqual([]);
  });

  it("clears the categorical legend cache explicitly", () => {
    const initialState = {
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#111111",
          fieldName: "value",
          schemeName: "scheme-a",
        },
      },
    };

    const nextState = mapReducer(initialState, {
      type: actionTypes.CLEAR_CATEGORICAL_LEGEND_CACHE,
    });

    expect(nextState.categoricalLegendCache).toEqual({});
  });
});