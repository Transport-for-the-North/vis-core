import { render, screen, act } from "@testing-library/react";
import { FilterContext, MapContext } from "contexts";
import { useMap } from "hooks";

jest.mock("maplibre-gl", () => {
  class Popup {
    constructor(options) {
      this.options = options;
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
    remove() {
      return this;
    }
  }

  return {
    __esModule: true,
    default: {
      Popup: Popup,
      Map: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        remove: jest.fn(),
        addLayer: jest.fn(),
        setStyle: jest.fn(),
        flyTo: jest.fn(),
      })),
    },
  };
});

import Map from "./Map";

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
// const addEventListener = jest.fn();

beforeEach(() => {
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
      on,
      getCanvas,
      off,
      getLayer,
      queryRenderedFeatures,
      setFilter,
      setFeatureState,
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
  mockMapContext = {
    ...mockMapContext,
    state: {
      ...mockMapContext.state,
      visualisedFeatureIds: { first: { value: 10 }, second: { value: 15 } },
    },
  };
  beforeEach(() => {
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
        properties: { name: "name" },
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
    const maplibregl = require("maplibre-gl").default;

   render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    const mouseMoveCallback = on.mock.calls.find(
      call => call[0] === "mousemove"
    )[1];

    act(() => {
      mouseMoveCallback({
        point: { x: 100, y: 200 },
        lngLat: { lng: 2.3522, lat: 48.8566 }
      });
    });

    expect(queryRenderedFeatures).toHaveBeenCalledWith(
      [[100, 200], [100, 200]],
      expect.objectContaining({ layers: ["first", "second", "id"] })
    );

    expect(setFeatureState).toHaveBeenCalledWith(
      { source: "source", id: "id", sourceLayer: "source-layer" },
      { hover: true }
    );
  });
});

describe("fetchData function", () => {

  /* 419 - 477 */

  it("Test", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Map {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );


  });
});
