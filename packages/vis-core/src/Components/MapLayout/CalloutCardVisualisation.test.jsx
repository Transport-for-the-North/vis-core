import { render, screen } from "@testing-library/react";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { MapContext } from "contexts";
import userEvent from "@testing-library/user-event";
import { useFetchVisualisationData } from "hooks";

jest.mock("@heroicons/react/24/solid", () => ({
  ChevronRightIcon: (props) => <span>ChevronRight</span>,
  ChevronLeftIcon: (props) => <span>ChevronLeft</span>,
}));
jest.mock("hooks", () => ({
  useFetchVisualisationData: jest.fn(),
}));
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
let mockMapContext = {
  state: {
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

let props = {
  visualisationName: "climate",
  cardName: "cardName",
  onUpdate: jest.fn(),
};
describe("Tests when useFetchVisualisationData return valid values", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      isLoading: false, // Not loading
      data: { visualisation: "visualisation" }, // Valid data
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Test the render of the html fragment, and the click on the toggle button", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <CalloutCardVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(screen.getByText("cardName")).toBeInTheDocument();
    // Html fragment
    const htmlFragment = screen.getByText("ImAHtmlFragment");
    expect(htmlFragment).toBeInTheDocument();
    expect(htmlFragment.tagName).toBe("P"); // To be a <p/> element
    // check the button
    expect(screen.getByText("ChevronRight")).toBeInTheDocument();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(screen.getByText("ChevronLeft")).toBeInTheDocument();
  });

  it("Function onUpdate have been called", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <CalloutCardVisualisation {...props} />
      </MapContext.Provider>
    );
    // customFormattingFunctions function to have been called
    expect(props.onUpdate).toHaveBeenCalled();
  });
});

describe("Tests when useFetchVisualisationData return isLoading", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      isLoading: true, // Loading
      data: { visualisation: "visualisation" }, // Unvalid data
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Check the isLoading texts", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <CalloutCardVisualisation {...props} />
      </MapContext.Provider>
    );
    const textsIsLoading = screen.getAllByText("Loading...");
    const h2Element = textsIsLoading.find((el) => el.tagName === "H2");
    const h3Element = textsIsLoading.find((el) => el.tagName === "H3");
    expect(h2Element).toBeInTheDocument();
    expect(h3Element).toBeInTheDocument();
  });
  it("Click on the toggle button", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <CalloutCardVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(screen.getByText("ChevronRight")).toBeInTheDocument();
    const toggleButton = screen.getByRole("button");
    await userEvent.click(toggleButton);
    expect(screen.getByText("ChevronLeft")).toBeInTheDocument();
  });
});

describe("Tests when isLoading is false and without data", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      isLoading: false, // Not loading
      data: undefined, // Undefined data
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Check the empty returned", () => {
    const { container } = render(
      <MapContext.Provider value={mockMapContext}>
        <CalloutCardVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
