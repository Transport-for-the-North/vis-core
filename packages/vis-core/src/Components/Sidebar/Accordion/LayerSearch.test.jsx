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

const mockDispatch = jest.fn();
jest.mock("hooks/useMapContext", () => ({
  useMapContext: () => ({
    dispatch: mockDispatch,
  }),
}));

const mockLayer = {
  metadata: {
    zoomToFeaturePlaceholderText: "zoomToFeaturePlaceholderText",
    path: "/",
  },
};
let props = {
  layer: mockLayer,
};

beforeEach(() => {
  mockDispatch.mockClear();
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
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "SET_BOUNDS_AND_CENTROID",
      payload: {
        bounds: {
          coordinates: [
            [
              [0, 0],
              [1, 1],
            ],
          ],
        },
        centroid: { coordinates: [0.5, 0.5] },
        featureName: "label",
        layerMetadata: mockLayer.metadata,
      },
    });
  });
});
