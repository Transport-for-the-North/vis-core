import { render, screen, waitFor } from "@testing-library/react";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { MapContext } from "contexts";
import userEvent from "@testing-library/user-event";
import { useFetchVisualisationData } from "hooks";
import { ThemeProvider } from "styled-components";

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
      test: {
        name: "Detailed Information",
        type: "calloutCard",
        cardType: "fullscreen",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/avp/pca/locations/{id}",
        htmlFragment:
          "<p>{programme_id}-{label}-{location_id}-{text_with_placeholders}</p>",
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

const theme = {
  mq: { mpbile: false },
};

let props = {
  cardName: "cardName",
  onUpdate: jest.fn(),
  data: {
    programme_id: 1,
    label: "label",
    location_id: "location_id",
    text_with_placeholders: "text_with_placeholders",
  },
  isLoading: false,
  visualisationName: "test",
};
describe("Tests when useFetchVisualisationData return valid values", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Test the render of the html fragment, and the click on the toggle button", async () => {
    render(
      <ThemeProvider theme={theme}>
        <MapContext.Provider value={mockMapContext}>
          <CalloutCardVisualisation {...props} />
        </MapContext.Provider>
      </ThemeProvider>
    );
    expect(screen.getByText("cardName")).toBeInTheDocument();
    // Html fragment
    const htmlFragment = screen.getByText(
      "1-label-location_id-text_with_placeholders"
    );
    expect(htmlFragment).toBeInTheDocument();
    expect(htmlFragment.tagName).toBe("P"); // To be a <p/> element
    // check the button
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    // Wait for the card to become visible (requestAnimationFrame transition)
    await waitFor(() => {
      expect(screen.getByText("ChevronRight")).toBeInTheDocument();
    });
    await userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("ChevronLeft")).toBeInTheDocument();
    });
  });

  it("Function onUpdate have been called", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapContext.Provider value={mockMapContext}>
          <CalloutCardVisualisation {...props} />
        </MapContext.Provider>
      </ThemeProvider>
    );
    // customFormattingFunctions function to have been called
    expect(props.onUpdate).toHaveBeenCalled();
  });
});

describe("Tests when useFetchVisualisationData return isLoading", () => {
  const propsWithLoading = {
    ...props,
    isLoading: true
  }
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Check the isLoading texts", () => {
    render(
      <ThemeProvider theme={theme}>
        <MapContext.Provider value={mockMapContext}>
          <CalloutCardVisualisation {...propsWithLoading} />
        </MapContext.Provider>
      </ThemeProvider>
    );
    const textsIsLoading = screen.getAllByText("Loading...");
    const h2Element = textsIsLoading.find((el) => el.tagName === "H2");
    const h3Element = textsIsLoading.find((el) => el.tagName === "H3");
    expect(h2Element).toBeInTheDocument();
    expect(h3Element).toBeInTheDocument();
  });
  it("Click on the toggle button", async () => {
    render(
      <ThemeProvider theme={theme}>
        <MapContext.Provider value={mockMapContext}>
          <CalloutCardVisualisation {...props} />
        </MapContext.Provider>
      </ThemeProvider>
    );
    const toggleButton = screen.getByRole("button");
    // Wait for the card to become visible (requestAnimationFrame transition)
    await waitFor(() => {
      expect(screen.getByText("ChevronRight")).toBeInTheDocument();
    });
    await userEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByText("ChevronLeft")).toBeInTheDocument();
    });
  });
});

describe("Tests when isLoading is false and without data", () => {
  const propsEmpty = {
    ...props,
    data: undefined,
    isLoading: undefined,
    visualisationName: "test"
  }
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Check the empty returned", () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <MapContext.Provider value={mockMapContext}>
          <CalloutCardVisualisation {...propsEmpty} />
        </MapContext.Provider>
      </ThemeProvider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
