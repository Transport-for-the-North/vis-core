import { render, screen, waitFor } from "@testing-library/react";
import DualMaps from "./DualMaps";
import { MapContext, FilterContext } from "contexts";
import { useDualMaps } from "hooks";
import { ThemeProvider } from "styled-components";

// TO CONTINUE

jest.mock("./VisualisationManager", () => ({
  VisualisationManager: ({ visualisationConfigs, map, left }) => (
    <span>VisualisationManager: {left ? "left" : "right"}</span>
  ),
}));
jest.mock("./Layer", () => ({
  Layer: ({ layer }) => <span>Layer: {JSON.stringify(layer)}</span>,
}));
jest.mock("../DynamicLegend", () => ({
  DynamicLegend: ({ map }) => <span>Dynamic Legend: {map.type}</span>,
}));
jest.mock("hooks", () => ({
  ...jest.requireActual("hooks"),
  useDualMaps: jest.fn(),
}));
jest.mock("maplibre-gl", () => {
  class MockPopup {
    constructor() {
      this.setLngLat = jest.fn().mockReturnValue(this);
      this.setHTML = jest.fn().mockReturnValue(this);
      this.addTo = jest.fn().mockReturnValue(this);
      this.remove = jest.fn();
    }
  }
  return {
    Map: jest.fn(() => ({
      on: jest.fn(),
      off: jest.fn(),
      remove: jest.fn(),
      addLayer: jest.fn(),
      setStyle: jest.fn(),
      flyTo: jest.fn(),
    })),
    Popup: MockPopup,
  };
});
jest.mock("services", () => ({
  ...jest.requireActual("services"),
  api: {
    baseService: {
      get: jest.fn(),
    },
  },
}));
import { api } from "services";
let mockMapContext = {
  state: {
    mapStyle: "default",
    mapCentre: [0, 0],
    mapZoom: 10,
    layers: { first: "first", second: "second" },
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

let theme = {
  mq: {
    mobile: "mobile",
  },
};

let props = {
  extraCopyrightText: "ImAnExtraCopyrightText",
};

const on = jest.fn();
const off = jest.fn();
const getCanvas = jest.fn();
const getLayer = jest.fn(true);
beforeEach(() => {
  useDualMaps.mockReturnValue({
    leftMap: {
      off: off,
      on: on,
      getCanvas: getCanvas,
      getLayer: getLayer,
      type: "left",
    },
    rightMap: { off: off, on: on, getLayer: getLayer, type: "right" },
    isMapStyleLoaded: "isMapStyleLoaded",
    isMapLoaded: "isMapLoaded",
    isMapReady: "isMapReady",
  });
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn().mockReturnValue(true),
    disconnect: jest.fn()
  }));
  window.matchMedia = jest.fn().mockImplementation(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  }))
});
describe("DualMaps component test", () => {
  it("Check the render with a classic use", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    // Check if there are 2 Layer with "first" and 2 Layer with "second"
    const layersFirst = screen.getAllByText(/first/);
    expect(layersFirst.length).toBe(2);
    const layersSecond = screen.getAllByText(/first/);
    expect(layersSecond.length).toBe(2);
    // Check if there are a VisualisationManager right and left
    expect(screen.getByText(/VisualisationManager: right/)).toBeInTheDocument();
    expect(screen.getByText(/VisualisationManager: left/)).toBeInTheDocument();
    // Check if the DynamicLegend is displayed
    expect(screen.getByText(/Dynamic Legend: right/)).toBeInTheDocument();
  });
  it("Display the left map on the DynamicLegend component", () => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        leftVisualisations: {
          data: {
            data: ["dataLeft"],
          },
        },
        rightVisualisations: {
          data: {
            data: [
              /* Empty */
            ],
          },
        },
      },
    };
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    expect(screen.getByText(/Dynamic Legend: left/)).toBeInTheDocument();
  });
});

describe("Test with shouldHaveTooltipOnHover, shouldHaveTooltipOnClick, hoverNulls = true", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          first: {
            shouldHaveTooltipOnHover: true,
            shouldHaveTooltipOnClick: true,
            hoverNulls: true,
          },
          layer1: {
            shouldHaveTooltipOnHover: true,
            shouldHaveTooltipOnClick: true,
            hoverNulls: true,
          },
        },
      },
    };
  });
  it("Tried to throw the handleMapHover function", () => {
    const { unmount } = render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    // On function to have been called
    expect(on).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(on).toHaveBeenCalledWith(
      "mouseleave",
      "first",
      expect.any(Function)
    );
    expect(on).toHaveBeenCalledWith(
      "mouseenter",
      "first",
      expect.any(Function)
    );
    // off functions to be throw when the render is unmount
    unmount();
    // Off function to have been called
    expect(off).toHaveBeenCalledWith("click", expect.any(Function));
    expect(off).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(off).toHaveBeenCalledWith("zoomend", undefined);
  });

  it("should handle hover events on the map", () => {
    const mockFeatures = [
      {
        id: 1,
        layer: { id: "layer1", source: "source1" },
        properties: { name: "Test Feature" },
        state: { value: 100 },
      },
    ];
    const mockLeftMap = {
      on: jest.fn(),
      off: jest.fn(),
      project: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      queryRenderedFeatures: jest.fn().mockReturnValue(mockFeatures),
      setFeatureState: jest.fn(),
      getLayer: jest.fn().mockReturnValue(true),
    };
    useDualMaps.mockReturnValue({
      leftMap: mockLeftMap,
      rightMap: { ...mockLeftMap },
      isMapReady: true,
    });

    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    const mousemoveCall = mockLeftMap.on.mock.calls.find(
      (call) => call[0] === "mousemove"
    );
    const handleMapHoverCallback = mousemoveCall[1];
    // Simulate a hover event
    const mockEvent = {
      point: { x: 150, y: 150 },
      lngLat: { lng: -0.1, lat: 51.5 },
    };
    // Call the callback
    handleMapHoverCallback(mockEvent);
    // Check the effects
    expect(mockLeftMap.queryRenderedFeatures).toHaveBeenCalled();
    expect(mockLeftMap.setFeatureState).toHaveBeenCalled();
  });

  it("Test function getCanvas() is called", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    expect(on).toHaveBeenCalledWith(
      "mouseenter",
      "layer1",
      expect.any(Function)
    );
    expect(on).toHaveBeenCalledWith(
      "mouseleave",
      "layer1",
      expect.any(Function)
    );
  });
});

describe("Test with shouldHaveLabel = true", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          first: {
            shouldHaveLabel: true,
          },
          layer1: {
            shouldHaveLabel: true,
          },
        },
      },
    };
  });
  it("Test handleZoom function is called", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
  });
});

describe("Tests when apiRequest is not null", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          first: {
            // shouldHaveLabel: true,
            customTooltip: true,
            shouldHaveTooltipOnHover: true,
          },
          layer1: {
            shouldHaveLabel: true,
            customTooltip: true,
            shouldHaveTooltipOnHover: true,
          },
          id: {
            hoverNulls: false,
            customTooltip: {
              url: "/url-{id}",
              htmlTemplate: "<p>paragraph</p>",
              customFormattingFunctions: "customFormattingFunctions",
            },
          },
        },
      },
    };

    api.baseService.get.mockResolvedValue(true);

    const on = jest.fn((event, callback) => {
      if (event === "mousemove") {
        callback({
          lngLat: { lng: 0, lat: 0 },
          point: { x: 100, y: 100 },
        });
      }
    });
    const off = jest.fn();
    const getCanvas = jest.fn();
    const getLayer = jest.fn();
    const project = jest.fn();
    const setFeatureState = jest.fn();
    const queryRenderedFeatures = jest.fn();
    getLayer.mockReturnValue(true);
    project.mockReturnValue(true);
    queryRenderedFeatures.mockReturnValue([
      {
        layer: { id: "id", "source-layer": "sourceLayer", source: "source" },
        id: "id",
        state: { value: "value" },
        properties: { name: "name" },
      },
    ]);
    useDualMaps.mockReturnValue({
      leftMap: {
        off: off,
        on: on,
        getCanvas: getCanvas,
        getLayer: getLayer,
        project: project,
        queryRenderedFeatures: queryRenderedFeatures,
        setFeatureState: setFeatureState,
        type: "left",
      },
      rightMap: {
        off: off,
        on: on,
        getLayer: getLayer,
        project: project,
        queryRenderedFeatures: queryRenderedFeatures,
        setFeatureState: setFeatureState,
        type: "right",
      },
      isMapStyleLoaded: "isMapStyleLoaded",
      isMapLoaded: "isMapLoaded",
      isMapReady: "isMapReady",
    });

    // fake timer for mock setTimeout
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
  it("Basic test", async () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );
    await waitFor(() => {
      expect(api.baseService.get).toHaveBeenCalledWith(
        "/url-id",
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });
});

describe("Tests when features is null", () => {
  let setFeatureState;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        layers: {
          id: {
            hoverNulls: false,
            shouldHaveTooltipOnHover: true,
            customTooltip: {
              url: "/url-{id}",
              htmlTemplate: "<p>paragraph</p>",
              customFormattingFunctions: {},
            },
          },
        },
      },
    };

    api.baseService.get.mockResolvedValue(true);

    const on = jest.fn((event, callback) => {
      if (event === "mousemove") {
        callback({
          lngLat: { lng: 0, lat: 0 },
          point: { x: 100, y: 100 },
        });
      }
    });
    const off = jest.fn();
    const getCanvas = jest.fn();
    const getLayer = jest.fn().mockReturnValue(true);
    const project = jest.fn().mockReturnValue(true);
    const queryRenderedFeatures = jest.fn().mockReturnValue([]);

    setFeatureState = jest.fn();

    useDualMaps.mockReturnValue({
      leftMap: {
        off,
        on,
        getCanvas,
        getLayer,
        project,
        queryRenderedFeatures,
        setFeatureState,
        type: "left",
      },
      rightMap: {
        off,
        on,
        getLayer,
        project,
        queryRenderedFeatures,
        setFeatureState,
        type: "right",
      },
      isMapStyleLoaded: true,
      isMapLoaded: true,
      isMapReady: true,
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // TO CONTINUE
  it("should call setFeatureState when features is empty", () => {
    render(
      <ThemeProvider theme={theme}>
        <FilterContext.Provider value={mockFilterContext}>
          <MapContext.Provider value={mockMapContext}>
            <DualMaps {...props} />
          </MapContext.Provider>
        </FilterContext.Provider>
      </ThemeProvider>
    );

    // expect(setFeatureState).toHaveBeenCalled();
  });
});
