import { render, screen, waitFor } from "@testing-library/react";
import { MapLayerSection } from "Components/Sidebar";
import { MapContext } from "contexts";

jest.mock("maplibre-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    setStyle: jest.fn(),
    flyTo: jest.fn(),
  })),
}));

const props = {
  handleColorChange: jest.fn(),
  handleClassificationChange: jest.fn(),
  handleWidthFactorChange: jest.fn(),
};

const mockMap1 = {
  id: "map1",
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(),
};

const mockMap2 = {
  id: "map2",
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(),
};

const mockMapContext = {
  state: {
    maps: [mockMap1, mockMap2],
    mapStyle: "default",
    mapCentre: [0, 0],
    mapZoom: 10,
    layers: {},
    visualisations: {
      climate: {
        id: "climate",
        name: "Climate Visualisation",
        legend: ["Low", "Medium", "High"],
        data: [],
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
        metadata: {
          source: "UNEP",
          updated: "2025-08-20",
        },
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

jest.mock("Components/Sidebar/Accordion/LayerControlEntry", () => ({
  LayerControlEntry: ({
    layer,
    maps,
    handleColorChange,
    handleClassificationChange,
    handleWidthFactorChange,
    state,
  }) => {
    return (
      <div data-testid={`layer-${layer.id}`}>
        <div>layer: {JSON.stringify(layer)}</div>
        <div>maps: {JSON.stringify(maps)}</div>
        <button onClick={handleColorChange}>handleColorChange</button>
        <button onClick={handleClassificationChange}>
          handleClassificationChange
        </button>
        <button onClick={handleWidthFactorChange}>
          handleWidthFactorChange
        </button>
        <div>state: {JSON.stringify(state)}</div>
      </div>
    );
  },
}));

jest.mock("Components", () => ({
  AccordionSection: ({ title, children }) => (
    <div data-testid="accordion-section">
      <h3>{title}</h3>
      {children}
    </div>
  ),
}));

describe("MapLayerSection component test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset getStyle mocks for each test
    mockMap1.getStyle.mockReturnValue({
      layers: [
        { id: "layer1", type: "fill", source: "source1" },
        { id: "layer2", type: "line", source: "source2" },
      ],
    });

    mockMap2.getStyle.mockReturnValue({
      layers: [{ id: "layer3", type: "circle", source: "source3" }],
    });
  });

  it("Should filter out hover, select, and system layers", async () => {
    // Redefine the mock for this specific test
    mockMap1.getStyle.mockReturnValue({
      layers: [
        { id: "layer1", type: "fill", source: "source1" }, // include
        { id: "layer2-hover", type: "fill", source: "source2" }, // filtered
        { id: "layer3-select", type: "line", source: "source3" }, // filtered
        { id: "selected-feature-layer", type: "circle", source: "source4" }, // filtered
        { id: "hide_layer4", type: "fill", source: "source5" }, // filtered
        { id: "gl-draw-layer", type: "line", source: "source6" }, // filtered
        { id: "layer5", type: "line", source: "default" }, // filtered (default)
        { id: "layer6", type: "circle", source: "source7" }, // include
      ],
    });

    render(
      <MapContext.Provider value={mockMapContext}>
        <MapLayerSection {...props} />
      </MapContext.Provider>
    );

    // Trigger the styledata event
    const styleDataCallback = mockMap1.on.mock.calls.find(
      call => call[0] === 'styledata'
    )[1];
    styleDataCallback();
    await waitFor(() => {
      expect(screen.getByText("Map layer control")).toBeInTheDocument();
    });

    // Ensure that only valid layers are rendered
    await waitFor(() => {
      expect(screen.getByTestId("layer-layer1")).toBeInTheDocument();
      expect(screen.getByTestId("layer-layer6")).toBeInTheDocument();
    });

    // Check that filtered layers are not rendered
    expect(screen.queryByTestId("layer-layer2-hover")).not.toBeInTheDocument();
    expect(screen.queryByTestId("layer-layer3-select")).not.toBeInTheDocument();
    expect(screen.queryByTestId("layer-selected-feature-layer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("layer-hide_layer4")).not.toBeInTheDocument();
    expect(screen.queryByTestId("layer-gl-draw-layer")).not.toBeInTheDocument();
    expect(screen.queryByTestId("layer-layer5")).not.toBeInTheDocument();
  });

  it("Should handle map context with single map in state.map", async () => {
    const contextWithSingleMap = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        maps: undefined,
        map: mockMap1,
      },
    };

    render(
      <MapContext.Provider value={contextWithSingleMap}>
        <MapLayerSection {...props} />
      </MapContext.Provider>
    );

    // Trigger the styledata event
    const styleDataCallback = mockMap1.on.mock.calls.find(
      call => call[0] === 'styledata'
    )[1];
    styleDataCallback();
    await waitFor(() => {
      expect(screen.getByText("Map layer control")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId("layer-layer1")).toBeInTheDocument();
      expect(screen.getByTestId("layer-layer2")).toBeInTheDocument();
    });
  });

  it("Should cleanup event listeners on unmount", () => {
    const { unmount } = render(
      <MapContext.Provider value={mockMapContext}>
        <MapLayerSection {...props} />
      </MapContext.Provider>
    );

    unmount();

    // Check that the event listeners have been deleted
    expect(mockMap1.off).toHaveBeenCalledWith('styledata', expect.any(Function));
    expect(mockMap2.off).toHaveBeenCalledWith('styledata', expect.any(Function));
  });
});