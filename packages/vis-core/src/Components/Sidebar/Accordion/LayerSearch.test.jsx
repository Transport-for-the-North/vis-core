import { render, screen, waitFor, act } from "@testing-library/react";
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
      {
        padding: 100,
        maxZoom: 14,
        duration: 1000,
        linear: false,
      }
    );
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
        "text-allow-overlap": true,
        "text-ignore-placement": true,
      },
      paint: {
        "text-color": "#000000",
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-opacity": 1,
      },
    });
  });
  it("Test of removeLabel function", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<LayerSearch {...props} />);

    await user.click(screen.getByText("mock FeatureSelect"));
    await waitFor(() => {
      expect(api.geodataService.getFeatureGeometry).toHaveBeenCalled();
    });

    // Reset the mocks and trigger timeout-driven cleanup
    mockMap.removeLayer.mockClear();
    mockMap.removeSource.mockClear();

    mockMap.getLayer.mockReturnValue(true);

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockMap.removeLayer).toHaveBeenCalledWith("feature-label");
    expect(mockMap.removeSource).toHaveBeenCalledWith("feature-label-source");

    jest.useRealTimers();
  });
});
