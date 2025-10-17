import { render, screen, act } from "@testing-library/react";
import { FilterContext, MapContext } from "contexts";
import { useMap } from "hooks";
import { api } from "services";

jest.mock("maplibre-gl", () => {
  class Popup {
    constructor(options) {
      this.options = options;
      this.remove = jest.fn(() => this);
    }
    setLngLat(coords) {
      this.coords = coords;
      return this;
    }
    setHTML(html) {
      this.html = html;
      return this;
    }
    addTo(map) {
      this.map = map;
      return this;
    }
  }

  class LngLatBounds {
    constructor() {
      this.bounds = [];
    }
    extend(coord) {
      this.bounds.push(coord);
      return this;
    }
    getNorthEast() {
      return { lng: 1, lat: 1 };
    }
    getSouthWest() {
      return { lng: -1, lat: -1 };
    }
  }

  return {
    __esModule: true,
    default: {
      Popup: Popup,
      LngLatBounds: LngLatBounds,
      Map: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        remove: jest.fn(),
        addLayer: jest.fn(),
        setStyle: jest.fn(),
        flyTo: jest.fn(),
      })),
    },
    Popup: Popup,
    LngLatBounds: LngLatBounds,
  };
});

import maplibregl from "maplibre-gl";
import Map from "./Map";

const OriginalPopupClass = (() => {
  class Popup {
    constructor(options) {
      this.options = options;
      this.remove = jest.fn(() => this);
    }
    setLngLat(coords) {
      this.coords = coords;
      return this;
    }
    setHTML(html) {
      this.html = html;
      return this;
    }
    addTo(map) {
      this.map = map;
      return this;
    }
  }
  return Popup;
})();

jest.mock("hooks", () => ({
  ...jest.requireActual("hooks"),
  useMap: jest.fn(),
}));
jest.mock("./VisualisationManager", () => ({
  ...jest.requireActual("./VisualisationManager"),
  VisualisationManager: () => <div>VisualisationManager</div>,
}));
jest.mock("components", () => ({
  ...jest.requireActual("components"),
  DynamicLegend: () => <div>DynamicLegend</div>,
}));
jest.mock("services", () => ({
  ...jest.requireActual("services"),
  api: {
    baseService: {
      get: jest.fn(),
    },
  },
}));
let mockMapContext = {
  state: {
    mapStyle: "default",
    mapCentre: [0, 0],
    mapZoom: 10,
    layers: {
      first: { shouldHaveTooltipOnHover: true, hoverNulls: true },
      second: { shouldHaveTooltipOnHover: true, hoverNulls: true },
      id: {
        shouldHaveTooltipOnHover: true,
        hoverNulls: true,
        visualisationName: "visualisationName",
      },
    },
    visualisedFeatureIds: { first: "first", second: "second" },
    visualisations: {
      climate: {
        id: "climate",
        name: "Climate Visualisation",
        legend: ["Low", "Medium", "High"],
        data: [],
        customFormattingFunctions: jest.fn(),
        htmlFragment: "<p>ImAHtmlFragment</p>",
        metadata: {
          source: "NASA",
          updated: "2025-08-27",
        },
      },
      biodiversity: {
        id: "biodiversity",
        name: "Biodiversity Visualisation",
        legend: ["Rare", "Common"],
        data: [],
        customFormattingFunctions: jest.fn(),
        metadata: {
          source: "UNEP",
          updated: "2025-08-20",
        },
      },
      visualisationName: {
        id: "biodiversity",
        name: "Biodiversity Visualisation",
        legend: ["Rare", "Common"],
        data: [],
        customFormattingFunctions: jest.fn(),
        metadata: {
          source: "UNEP",
          updated: "2025-08-20",
        },
      },
    },
    leftVisualisations: {
      data: {
        data: ["dataLeft"],
      },
    },
    rightVisualisations: {
      data: {
        data: ["dataRight"],
      },
    },
    metadataTables: {},
    metadataFilters: [],
    filters: [],
    map: null,
    isMapReady: false,
    isLoading: false,
    pageIsReady: true,
    selectionMode: null,
    selectionLayer: null,
    selectedFeatures: [],
    isFeatureSelectActive: false,
    visualisedFeatureIds: null,
    currentZoom: 10,
    colorSchemesByLayer: {
      id: {
        colors: ["#FF0000", "#00FF00", "#0000FF"],
        classification: "quantile",
        legend: ["Low", "Medium", "High"],
      },
    },
  },
  dispatch: jest.fn(),
};
let mockFilterContext = {
  state: {
    dropdown: "dropdown",
    slider: "slider",
    toggle: "toggle",
    checkbox: "checkbox",
    mapFeatureSelect: "mapFeatureSelect",
    mapFeatureSelectWithControls: "mapFeatureSelectWithControls",
    mapFeatureSelectAndPan: "mapFeatureSelectAndPan",
  },
  dispatch: jest.fn(),
};
let props = {
  extraCopyrightText: "extraCopyrightText",
};

const addControl = jest.fn();
const on = jest.fn();
const off = jest.fn();
const getCanvas = jest.fn();
const getLayer = jest.fn();
const queryRenderedFeatures = jest.fn();
const setFilter = jest.fn();
const setFeatureState = jest.fn();
const getZoom = jest.fn();
const querySourceFeatures = jest.fn();
const addLayer = jest.fn();
const setLayoutProperty = jest.fn();
const fitBounds = jest.fn();
const panTo = jest.fn();
// const addEventListener = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();

  maplibregl.Popup = OriginalPopupClass;
  if (!maplibregl.default) {
    maplibregl.default = {};
  }
  maplibregl.default.Popup = OriginalPopupClass;

  on.mockReset();
  on.mockImplementation(() => {});
  getCanvas.mockReturnValue({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    style: {
      cursor: "pointer",
    },
  });
  useMap.mockReturnValue({
    map: {
      addControl,
      on,
      getCanvas,
      off,
      getLayer,
      queryRenderedFeatures,
      setFilter,
      setFeatureState,
      getZoom,
      querySourceFeatures,
      addLayer,
      setLayoutProperty,
      fitBounds,
      panTo,
    },
    isMapReady: true,
  });
});

describe("Initial rendering", () => {
  it("DynamicLegend and VisualisationManager are rendering", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    // Visualisation Manager
    expect(screen.getByText("VisualisationManager")).toBeInTheDocument();
    // DynamicLegend
    expect(screen.getByText("DynamicLegend")).toBeInTheDocument();
  });
});

describe("Conditional rendering of subcomponents", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        visualisations: undefined, // empty
      },
    };
    useMap.mockReturnValue({
      map: {
        addControl,
        on,
        getCanvas,
        off,
        getLayer,
        queryRenderedFeatures,
        setFilter,
        setFeatureState,
      },
      isMapReady: undefined, // empty
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("VisualisationManager", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(screen.queryByText("VisualisationManager")).not.toBeInTheDocument();
  });
  it("DynamicLegend", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(screen.queryByText("DynamicLegend")).not.toBeInTheDocument();
  });
});

describe("Hooks tests", () => {
  it("useMap hook", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(useMap).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.anything() }),
      "default",
      [0, 0],
      10,
      "extraCopyrightText"
    );
  });
  it("should return correct values from useMap hook", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    const { map, isMapReady } = useMap.mock.results[0].value;
    expect(map).toEqual({
      addControl,
      addLayer,
      fitBounds,
      on,
      panTo,
      getCanvas,
      off,
      getLayer,
      getZoom,
      queryRenderedFeatures,
      querySourceFeatures,
      setFilter,
      setFeatureState,
      setLayoutProperty,
    });
    expect(isMapReady).toBe(true);
    expect(screen.getByText("DynamicLegend")).toBeInTheDocument();
  });
});

describe("SET_DRAW_INSTANCE is dispatch with the draw instance", () => {
  it("Test", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: "SET_DRAW_INSTANCE",
      payload: expect.objectContaining({
        modes: expect.any(Object),
        getFeatureIdsAt: expect.any(Function),
        getSelectedIds: expect.any(Function),
        getSelected: expect.any(Function),
        getSelectedPoints: expect.any(Function),
        set: expect.any(Function),
        add: expect.any(Function),
        get: expect.any(Function),
        getAll: expect.any(Function),
        delete: expect.any(Function),
        deleteAll: expect.any(Function),
        changeMode: expect.any(Function),
        getMode: expect.any(Function),
        trash: expect.any(Function),
        combineFeatures: expect.any(Function),
        uncombineFeatures: expect.any(Function),
        setFeatureProperty: expect.any(Function),
        onAdd: expect.any(Function),
        onRemove: expect.any(Function),
        types: expect.any(Object),
        options: expect.any(Object),
      }),
    });
  });
});

describe("handleMapHover is called or not", () => {
  const hoverCallBackMock = jest.fn();
  beforeEach(() => {
    on.mockImplementation((event, callback) => {
      if (event === "mousemove") hoverCallBackMock();
    });
    useMap.mockReturnValue({
      map: {
        addControl,
        on,
        getCanvas,
        off,
        getLayer,
        queryRenderedFeatures,
        setFilter,
        setFeatureState,
      },
      isMapReady: true,
    });
  });
  it("handleMapHover is called if map exist", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(hoverCallBackMock).toHaveBeenCalled();
  });
  it("handleMapHover is not called because map doesn't exist", () => {
    useMap.mockReturnValue({
      // map: { addControl, on, getCanvas, off, getLayer, queryRenderedFeatures, setFilter, setFeatureState }, // is empty
      isMapReady: true,
    });
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(hoverCallBackMock).not.toHaveBeenCalled();
  });
});

describe("Tests of handleMapHover function", () => {
  let setTimeoutSpy;

  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        visualisedFeatureIds: { first: { value: 10 }, second: { value: 15 } },
        layers: {
          ...mockMapContext.state.layers,
          id: {
            ...mockMapContext.state.layers.id,
            hoverTipShouldIncludeMetadata: true,
          },
        },
      },
    };
    jest.useFakeTimers();
    setTimeoutSpy = jest.spyOn(global, "setTimeout");
    api.baseService.get.mockResolvedValue({
      data: "test data",
      someField: "value",
    });
    global.AbortController = jest.fn(() => ({
      signal: "signalMocked",
      abort: jest.fn(),
    }));
    getLayer.mockReturnValue(true);
    queryRenderedFeatures.mockReturnValue([
      {
        layer: {
          id: "id",
          source: "source",
          "source-layer": "source-layer",
        },
        id: "id",
        state: {
          value: 15,
        },
        properties: { name: "name", data: "data" },
      },
    ]);
    on.mockImplementation((event, callback) => {
      if (event === "mousemove") {
        const mockParams = {
          point: { x: 100, y: 200 },
          lngLat: { lng: 2.3522, lat: 48.8566 },
        };
        callback(mockParams);
      }
    });
    useMap.mockReturnValue({
      map: {
        addControl,
        on,
        getCanvas,
        off,
        getLayer,
        queryRenderedFeatures,
        setFilter,
        setFeatureState,
      },
      isMapReady: true,
    });
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  it("Test without e.point", () => {
    on.mockImplementation((event, callback) => {
      if (event === "mousemove") {
        const mockParams = {
          point: null,
          lngLat: { lng: 2.3522, lat: 48.8566 },
        };
        callback(mockParams);
      }
    });
    useMap.mockReturnValue({
      map: {
        addControl,
        on,
        getCanvas,
        off,
        getLayer,
        queryRenderedFeatures,
        setFilter,
        setFeatureState,
      },
      isMapReady: true,
    });
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(queryRenderedFeatures).not.toHaveBeenCalled();
  });
  it("should query all hoverable layers and set hover state when mouse moves over features", () => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        visualisations: {
          visualisationName: {
            id: "biodiversity",
            name: "Biodiversity Visualisation",
            legend: ["Rare", "Common"],
            data: [],
            customFormattingFunctions: jest.fn(),
            metadata: {
              source: "UNEP",
              updated: "2025-08-20",
            },
          },
        },
      },
    };

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    const mouseMoveCallback = on.mock.calls.find(
      (call) => call[0] === "mousemove"
    )[1];

    act(() => {
      mouseMoveCallback({
        point: { x: 100, y: 200 },
        lngLat: { lng: 2.3522, lat: 48.8566 },
      });
    });

    expect(queryRenderedFeatures).toHaveBeenCalledWith(
      [
        [100, 200],
        [100, 200],
      ],
      expect.objectContaining({ layers: ["first", "second", "id"] })
    );

    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "source", id: "id", sourceLayer: "source-layer" },
      { hover: true }
    );
  });

  it("Function with customTooltip", () => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          ...mockMapContext.state.layers,
          id: {
            ...mockMapContext.state.layers.id,
            customTooltip: {
              requestUrl: "/{id}-requestUrl",
              htmlTemplate: "<p>htmlTemplate</p>",
              customFormattingFunctions: "customFormattingFunctions",
            },
          },
        },
      },
    };

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(setTimeoutSpy).toHaveBeenCalled();

    // Advance time to pass setTimeout and lauch fetchData()
    act(() => {
      jest.advanceTimersByTime(100);
    });

    // get is called with a good url and signal
    expect(api.baseService.get).toHaveBeenCalledWith("/id-requestUrl", {
      signal: "signalMocked",
    });
  });

  it("should display 'Data unavailable' when API fails", async () => {
    mockMapContext.state.layers = {
      id: {
        hoverTipShouldIncludeMetadata: true,
        shouldHaveTooltipOnHover: true,
        customTooltip: {
          requestUrl: "/{id}-requestUrl",
          htmlTemplate: "<p>htmlTemplate</p>",
          customFormattingFunctions: {},
        },
      },
    };

    const apiError = new Error("Network error");
    api.baseService.get = jest.fn().mockRejectedValue(apiError);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    let capturedPopup = null;
    const OriginalPopup = require("maplibre-gl").default.Popup;
    const PopupSpy = jest.fn(function (options) {
      const instance = new OriginalPopup(options);
      capturedPopup = instance;
      return instance;
    });
    require("maplibre-gl").default.Popup = PopupSpy;

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    const mouseMoveCallback = on.mock.calls.find(
      (call) => call[0] === "mousemove"
    )[1];

    act(() => {
      mouseMoveCallback({
        point: { x: 100, y: 200 },
        lngLat: { lng: 0, lat: 0 },
      });
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch tooltip data:",
      apiError
    );

    expect(capturedPopup.html).toContain("popup-content");
    expect(capturedPopup.html).toContain("feature-name");
    expect(capturedPopup.html).toContain("name");
    expect(capturedPopup.html).toContain("Data unavailable.");

    expect(capturedPopup.html).toMatch(
      /<div class="popup-content">[\s\S]*<p class="feature-name">name<\/p>[\s\S]*<p>Data unavailable\.<\/p>[\s\S]*<\/div>/
    );

    consoleErrorSpy.mockRestore();
  });
  it("features.length === 0", () => {
    queryRenderedFeatures.mockReturnValue([]);
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
  });
});

describe("handleLayerClick function test", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          ...mockMapContext.state.layers,
          id: {
            ...mockMapContext.state.layers.id,
            shouldHaveTooltipOnClick: true,
          },
        },
      },
    };
    on.mockImplementation((event, callback) => {
      if (event === "click") {
        const mockParams = {
          point: { x: 100, y: 200 },
          lngLat: { lng: 2.3522, lat: 48.8566 },
        };
        callback(mockParams);
      }
    });
    queryRenderedFeatures.mockReturnValue([
      {
        id: 1,
        layer: {
          id: "id",
          source: "source",
          "source-layer": "source-layer",
        },
        state: {
          value: 15,
        },
        properties: {
          name: "name",
          id: "test-id",
          data: "data",
        },
      },
    ]);
  });

  it("queryRenderedFeatures is called with the great parameters", () => {
    const PopupSpy = jest.fn(function (options) {
      const instance = {
        options,
        coords: null,
        html: null,
        map: null,
        setLngLat: function (coords) {
          this.coords = coords;
          return this;
        },
        setHTML: function (html) {
          this.html = html;
          return this;
        },
        addTo: function (map) {
          this.map = map;
          return this;
        },
        remove: function () {
          return this;
        },
      };
      capturedPopup = instance;
      return instance;
    });

    require("maplibre-gl").default.Popup = PopupSpy;
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(queryRenderedFeatures).toHaveBeenCalledWith(
      [
        [100, 200],
        [100, 200],
      ],
      { layers: ["id"] }
    );
  });

  it("should call setLngLat, setHTML and addTo on popup", () => {
    let capturedPopup = null;

    const PopupSpy = jest.fn(function (options) {
      const instance = {
        options,
        coords: null,
        html: null,
        map: null,
        setLngLat: function (coords) {
          this.coords = coords;
          return this;
        },
        setHTML: function (html) {
          this.html = html;
          return this;
        },
        addTo: function (map) {
          this.map = map;
          return this;
        },
        remove: function () {
          return this;
        },
      };
      capturedPopup = instance;
      return instance;
    });

    require("maplibre-gl").default.Popup = PopupSpy;

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    expect(capturedPopup).not.toBeNull();

    expect(capturedPopup.coords).toEqual({
      lng: 2.3522,
      lat: 48.8566,
    });

    expect(capturedPopup.html).toContain("name");
    expect(capturedPopup.html).toContain("Id: test-id");
    expect(capturedPopup.html).toContain("Value: 15");

    expect(capturedPopup.map).toBeDefined();
  });
});

describe("handleZoom function tests", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          ...mockMapContext.state.layers,
          id: {
            ...mockMapContext.state.layers.id,
            shouldHaveLabel: true,
          },
        },
      },
    };
    on.mockImplementation((event, callback) => {
      if (event === "zoomend") {
        const mockParams = {
          point: { x: 100, y: 200 },
          lngLat: { lng: 2.3522, lat: 48.8566 },
        };
        callback(mockParams);
      }
    });
    querySourceFeatures.mockReturnValue([
      { geometry: { type: "firstType" } },
      { geometry: { type: "secondType" } },
    ]);
    getZoom.mockReturnValue(10); // 10 < 12
    getLayer.mockReturnValue("getLayer returned value");
  });
  it("Test when mapZoomLevel <= labelZoomLevel", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: "STORE_CURRENT_ZOOM",
      payload: 10,
    });
    expect(getLayer).toHaveBeenCalledWith("id-label");
    expect(setLayoutProperty).toHaveBeenCalledWith(
      "id-label",
      "visibility",
      "none"
    );
  });

  it("Test when map.getLayer", () => {
    getZoom.mockReturnValue(14); // 14 > 12
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(setLayoutProperty).toHaveBeenCalledWith(
      "id-label",
      "visibility",
      "visible"
    );
  });
  it("Test when !map.getLayer", () => {
    getLayer.mockReturnValue(null);
    getZoom.mockReturnValue(14); // 14 > 12
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(querySourceFeatures).toHaveBeenCalledWith("id", {
      sourceLayer: undefined,
    });
    expect(addLayer).toHaveBeenCalledWith({
      id: "id-label",
      type: "symbol",
      source: "id",
      "source-layer": undefined,
      layout: {
        "text-field": ["get", "name"],
        "text-size": 14,
        "text-anchor": "center",
        "text-offset": [0, 1.5],
        "text-allow-overlap": false,
        "symbol-placement": "point",
        "symbol-spacing": 250,
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2.5,
        "text-opacity": ["case", expect.any(Array), 0, 1],
      },
    });
  });
});

describe("Pan and centre map", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        mapBoundsAndCentroid: {
          centroid: {
            coordinates: [5, 10],
          },
          bounds: {
            coordinates: [["un", "deux"], 10],
          },
        },
      },
    };
  });

  it("Classic test", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(fitBounds).toHaveBeenCalledWith(
      expect.objectContaining({
        bounds: ["un", "deux", [9, 19], [11, 21]],
      }),
      { padding: 80, duration: 0 }
    );
    expect(panTo).toHaveBeenCalledWith([5, 10]);
  });
  it("Test when !bounds", () => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        mapBoundsAndCentroid: {
          centroid: {
            coordinates: [5, 10],
          },
        },
      },
    };
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );
    expect(panTo).toHaveBeenCalledWith([5, 10]);
  });
});

describe("mouseLeaveCallback function test", () => {
  let canvasMock;

  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        visualisedFeatureIds: {
          first: {
            value: 10,
          },
        },
        layers: {
          ...mockMapContext.state.layers,
          id: {
            ...mockMapContext.state.layers.id,
            hoverNulls: true,
          },
        },
      },
    };

    jest.useFakeTimers();

    // need to create a popup to test it
    queryRenderedFeatures.mockReturnValue([
      {
        id: 123,
        layer: {
          id: "id",
          source: "test-source",
          "source-layer": "test-source-layer",
        },
        properties: {
          name: "Test Feature",
        },
        state: {
          value: 10,
        },
      },
    ]);
    getLayer.mockReturnValue(true);
    canvasMock = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      style: { cursor: "pointer" },
    };
    getCanvas.mockReturnValue(canvasMock);
    on.mockImplementation((event, callback) => {
      if (event === "mousemove") {
        const mockParams = {
          point: { x: 100, y: 200 },
          lngLat: { lng: 2.3522, lat: 48.8566 },
        };
        callback(mockParams);
      }
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should trigger mouseLeaveCallback", async () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    const mouseLeaveCall = canvasMock.addEventListener.mock.calls.find(
      (call) => call[0] === "mouseleave"
    );

    expect(mouseLeaveCall).toBeDefined();
    const mouseLeaveCallback = mouseLeaveCall[1];

    await act(async () => {
      mouseLeaveCallback();
    });
  });
  it("prevHoveredFeaturesRef.current is not empty", async () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    const mousemoveCallback = on.mock.calls.find(
      (call) => call[0] === "mousemove"
    )?.[1];

    expect(mousemoveCallback).toBeDefined();

    await act(async () => {
      mousemoveCallback({
        point: { x: 100, y: 200 },
        lngLat: { lng: 2.3522, lat: 48.8566 },
      });
    });

    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "test-source", id: 123, sourceLayer: "test-source-layer" },
      { hover: true }
    );
  });
});
