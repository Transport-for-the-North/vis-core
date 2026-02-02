import { render, screen, waitFor } from "@testing-library/react";
import { LayerSearch } from "Components/Sidebar/Accordion/LayerSearch";
import { api } from "services";
import userEvent from "@testing-library/user-event";

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

jest.mock("Components/Sidebar/Selectors/FeatureSelect", () => ({
  FeatureSelect: ({ onChange, placeholder }) => (
    <button onClick={() => onChange({ value: "123", label: "label" })}>
      mock FeatureSelect
    </button>
  ),
}));
jest.mock("services", () => ({
  api: {
    geodataService: {
      getFeatureGeometry: jest.fn(),
    },
  },
}));

const mockLayer = {
  metadata: {
    zoomToFeaturePlaceholderText: "zoomToFeaturePlaceholderText",
    path: "/",
  },
};
let props = {
  map: {},
  layer: mockLayer,
};
let mockMap = {};

// I don't know why, but I have to put this in the beforeEach, otherwise it doesn't work.
beforeEach(() => {
  api.geodataService.getFeatureGeometry.mockResolvedValue({
    bounds: {
      coordinates: [
        [
          [0, 0],
          [1, 1],
        ],
      ],
    },
    centroid: { coordinates: [0.5, 0.5] },
  });

  mockMap = {
    fitBounds: jest.fn(),
    setCenter: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    getLayer: jest.fn(() => true),
    removeLayer: jest.fn(),
    removeSource: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  };

  props = {
    ...props,
    map: mockMap,
  };
});

describe("LayerSearch component test", () => {
  it("Test", async () => {
    render(<LayerSearch {...props} />);

    expect(screen.getByText("Zoom to map feature")).toBeInTheDocument();
    expect(screen.getByText("ℹ")).toBeInTheDocument();

    await userEvent.click(screen.getByText("mock FeatureSelect"));

    await waitFor(() => {
      expect(api.geodataService.getFeatureGeometry).toHaveBeenCalledWith(
        "/",
        "123"
      );
    });
    expect(mockMap.fitBounds).toHaveBeenCalledWith(
      [
        [0, 0],
        [1, 1],
      ],
      { padding: 20 }
    );
    expect(mockMap.setCenter).toHaveBeenCalledWith([0.5, 0.5]);
    expect(mockMap.removeLayer).toHaveBeenCalledWith("feature-label");
    expect(mockMap.removeSource).toHaveBeenCalledWith("feature-label-source");
    expect(mockMap.addSource).toHaveBeenCalledWith("feature-label-source", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0.5, 0.5],
        },
        properties: {
          name: "label",
        },
      },
    });
    expect(mockMap.addLayer).toHaveBeenCalledWith({
      id: "feature-label",
      type: "symbol",
      source: "feature-label-source",
      layout: {
        "text-field": ["get", "name"],
        "text-font": ["Noto Sans Bold"],
        "text-size": 14,
        "text-offset": [0, 1.5],
        "text-anchor": "top",
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
      },
    });
    expect(mockMap.on).toHaveBeenCalledWith("move", expect.any(Function));
  });
  it("Test of removeLabel function", async () => {
    let moveCallback;
    let clickCallback;

    // Modify the mock to capture the callbacks
    mockMap.on = jest.fn((event, callback) => {
      if (event === "move") moveCallback = callback;
      if (event === "click") clickCallback = callback;
    });

    render(<LayerSearch {...props} />);

    await userEvent.click(screen.getByText("mock FeatureSelect"));
    await waitFor(() => {
      expect(api.geodataService.getFeatureGeometry).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockMap.on).toHaveBeenCalledTimes(2); // move and click
    });

    // Now check the events
    expect(mockMap.on).toHaveBeenCalledWith("move", expect.any(Function));
    expect(mockMap.on).toHaveBeenCalledWith("click", expect.any(Function));

    // Reset the mocks
    mockMap.removeLayer.mockClear();
    mockMap.removeSource.mockClear();
    mockMap.off.mockClear();

    mockMap.getLayer.mockReturnValue(true);

    // Execute the move callback
    expect(moveCallback).toBeDefined();
    moveCallback();

    // Check that removeLabel has been executed
    expect(mockMap.removeLayer).toHaveBeenCalledWith("feature-label");
    expect(mockMap.removeSource).toHaveBeenCalledWith("feature-label-source");
    expect(mockMap.off).toHaveBeenCalledWith("move", moveCallback);
    expect(mockMap.off).toHaveBeenCalledWith("click", moveCallback);

    // Test also with click
    mockMap.removeLayer.mockClear();
    mockMap.removeSource.mockClear();
    mockMap.off.mockClear();
    mockMap.getLayer.mockReturnValue(true);

    clickCallback();

    expect(mockMap.removeLayer).toHaveBeenCalledWith("feature-label");
    expect(mockMap.removeSource).toHaveBeenCalledWith("feature-label-source");
  });
});
