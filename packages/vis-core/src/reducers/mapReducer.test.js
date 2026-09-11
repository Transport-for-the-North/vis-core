import { actionTypes, mapReducer } from "./mapReducer";
import { DisplayMode, DEFAULT_DISPLAY_MODE } from "enums";

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

  it("updates baseMapId and mapStyle atomically on SET_BASE_MAP", () => {
    const initialState = {
      baseMapId: "positron",
      mapStyle: "https://maps.geoapify.com/v1/styles/positron/style.json",
    };

    const nextState = mapReducer(initialState, {
      type: actionTypes.SET_BASE_MAP,
      payload: "darkMatter",
    });

    expect(nextState.baseMapId).toBe("darkMatter");
    expect(nextState.mapStyle).toBe("https://tiles.openfreemap.org/styles/dark");
  });
});

describe("mapReducer display mode", () => {
  const makeState = () => ({
    visualisations: {
      "Link Totals": { displayMode: DEFAULT_DISPLAY_MODE, queryParams: {} },
      "Zone Totals": { displayMode: DEFAULT_DISPLAY_MODE, queryParams: {} },
    },
  });

  it("gives every added visualisation a display mode", () => {
    const nextState = mapReducer(
      { visualisations: {} },
      {
        type: actionTypes.ADD_VISUALISATION,
        payload: { "Link Totals": { queryParams: {} } },
      }
    );

    expect(nextState.visualisations["Link Totals"].displayMode).toBe(
      DEFAULT_DISPLAY_MODE
    );
  });

  it("honours a display mode pinned in page configuration", () => {
    const nextState = mapReducer(
      { visualisations: {} },
      {
        type: actionTypes.ADD_VISUALISATION,
        payload: {
          "Link Difference": { displayMode: DisplayMode.DIFFERENCE, queryParams: {} },
        },
      }
    );

    expect(nextState.visualisations["Link Difference"].displayMode).toBe(
      DisplayMode.DIFFERENCE
    );
  });

  it("tracks the selected mode on the named visualisations", () => {
    const nextState = mapReducer(makeState(), {
      type: actionTypes.UPDATE_DISPLAY_MODE,
      payload: {
        filter: { visualisations: ["Link Totals"] },
        value: DisplayMode.PCT_DIFFERENCE,
      },
    });

    expect(nextState.visualisations["Link Totals"].displayMode).toBe(
      DisplayMode.PCT_DIFFERENCE
    );
    expect(nextState.visualisations["Zone Totals"].displayMode).toBe(
      DEFAULT_DISPLAY_MODE
    );
  });

  it("applies to every visualisation when the filter names none", () => {
    const nextState = mapReducer(makeState(), {
      type: actionTypes.UPDATE_DISPLAY_MODE,
      payload: {
        filter: { visualisations: null },
        value: DisplayMode.PCT_DIFFERENCE,
      },
    });

    expect(nextState.visualisations["Link Totals"].displayMode).toBe(
      DisplayMode.PCT_DIFFERENCE
    );
    expect(nextState.visualisations["Zone Totals"].displayMode).toBe(
      DisplayMode.PCT_DIFFERENCE
    );
  });

  it("falls back to the default rather than storing an unknown mode", () => {
    const nextState = mapReducer(makeState(), {
      type: actionTypes.UPDATE_DISPLAY_MODE,
      payload: { filter: { visualisations: ["Link Totals"] }, value: "nonsense" },
    });

    expect(nextState.visualisations["Link Totals"].displayMode).toBe(
      DEFAULT_DISPLAY_MODE
    );
  });

  it("ignores visualisations that are not on the page", () => {
    const state = makeState();
    const nextState = mapReducer(state, {
      type: actionTypes.UPDATE_DISPLAY_MODE,
      payload: {
        filter: { visualisations: ["Absent Visualisation"] },
        value: DisplayMode.PCT_DIFFERENCE,
      },
    });

    expect(nextState.visualisations["Absent Visualisation"]).toBeUndefined();
    expect(nextState.visualisations["Link Totals"].displayMode).toBe(
      DEFAULT_DISPLAY_MODE
    );
  });

  it("leaves the rest of the visualisation untouched", () => {
    const nextState = mapReducer(makeState(), {
      type: actionTypes.UPDATE_DISPLAY_MODE,
      payload: {
        filter: { visualisations: ["Link Totals"] },
        value: DisplayMode.PCT_DIFFERENCE,
      },
    });

    expect(nextState.visualisations["Link Totals"].queryParams).toEqual({});
  });
});

