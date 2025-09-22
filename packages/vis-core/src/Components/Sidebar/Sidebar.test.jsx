jest.mock("./../../utils", () => ({
  getScrollbarWidth: jest.fn(),
}));
import { getScrollbarWidth } from "utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Sidebar } from ".";
import { AppContext, FilterContext, MapContext } from "contexts";
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
jest.mock("./Accordion/TextSection", () => ({
  TextSection: ({ title, text }) => {
    return (
      <>
        <div>title: {title}</div>
        <div>text: {JSON.stringify(text)}</div>
      </>
    );
  },
}));
jest.mock("./Selectors/SelectorSection", () => ({
  SelectorSection: ({ filters, onFilterChange, bgColor }) => {
    return (
      <>
        <div>filters: {JSON.stringify(filters)}</div>
        <button onClick={onFilterChange}>SelectorSection button</button>
        <div>bgColor: {JSON.stringify(bgColor)}</div>
      </>
    );
  },
}));
jest.mock("./../MessageBox/MessageBox", () => ({
    InfoBox: ({text}) => <span>InfoBox: {text}</span>,
    WarningBox: ({text}) => <span>WarningBox: {text}</span>,
    ErrorBox: ({text}) => <span>ErrorBox: {text}</span>
}));
jest.mock("@heroicons/react/24/solid", () => ({
    ChevronRightIcon: (props) => <span data-testid="chevron-right-icon" {...props}>ChevronRight</span>,
    ChevronLeftIcon: (props) => <span data-testid="chevron-left-icon" {...props}>ChevronLeft</span>
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
let mockAppContext = {
  logoImage: "img/tfn-logo-fullsize.png",
  logoutButtonImage: "img/burger.png",
  appPages: [],
  logoPosition: "left",
  authenticationRequired: true,
};

let props = {
  pageName: "pageName",
  aboutVisualisationText: "aboutVisualisationText",
  filters: ["data1", "data2"],
  legalText: "legalText",
  onFilterChange: jest.fn(),
  bgColor: "#D93314",
  infoBoxText: "infoBoxText",
  children: `<p>I am a paragraph</p>`,
};

describe("Sidebar component test", () => {
  it("Check the rendering then click on the SelectorSection button", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <Sidebar {...props} />
          </AppContext.Provider>
        </FilterContext.Provider>
      </MapContext.Provider>
    );
    // TextSection check
    expect(screen.getByText(/About this visualisation/)).toBeInTheDocument();
    expect(screen.getByText(/aboutVisualisationText/)).toBeInTheDocument();
    // SelectorSection check
    expect(screen.getByText(/\["data1","data2"\]/)).toBeInTheDocument();
    expect(screen.getByText(/SelectorSection button/)).toBeInTheDocument();
    expect(screen.getByText(/#D93314/)).toBeInTheDocument();
    // Children props check
    expect(screen.getByText(/I am a paragraph/)).toBeInTheDocument();
    // Last TextSection check
    expect(screen.getByText(/legal/)).toBeInTheDocument();
    expect(screen.getByText(/legalText/)).toBeInTheDocument();

    // Clicked on the SelectorSection button
    const selectorSectionButton = screen.getByRole("button", {
      name: "SelectorSection button",
    });
    expect(selectorSectionButton).toBeInTheDocument();
    await userEvent.click(selectorSectionButton);
    expect(props.onFilterChange).toHaveBeenCalled();
  });
  it("Check the onMouseEnter and leave of ToggleButton", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <Sidebar {...props} />
          </AppContext.Provider>
        </FilterContext.Provider>
      </MapContext.Provider>
    );
    // check the button
    const toggleButton = screen.getByRole("button", {
      name: "ChevronLeft"
    });
    expect(toggleButton).toBeInTheDocument();
    // Check the hover
    await fireEvent.mouseEnter(toggleButton);
    expect(screen.getByText("Collapse Sidebar")).toBeInTheDocument();
    // Check the leave
    await fireEvent.mouseLeave(toggleButton);
    expect(screen.queryByText("Collapse Sidebar")).not.toBeInTheDocument();
    // Check the click
    await userEvent.click(toggleButton);
    expect(screen.getByText("ChevronRight")).toBeInTheDocument();
  });
});

describe("Firefox browser detection", () => {
  const originalUserAgent = navigator.userAgent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(navigator, "userAgent", {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  it("should detect Firefox and set scrollbar width", async () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
      writable: true,
      configurable: true,
    });

    getScrollbarWidth.mockReturnValue(15);

    const { container } = render(
      <MapContext.Provider value={mockMapContext}>
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <Sidebar {...props} />
          </AppContext.Provider>
        </FilterContext.Provider>
      </MapContext.Provider>
    );

    await waitFor(() => {
      expect(getScrollbarWidth).toHaveBeenCalledWith("thin");
    });
    const sidebarContainer = container.firstChild;
    expect(sidebarContainer).toBeInTheDocument();
    // Check the style
    expect(sidebarContainer).toHaveStyle({
      paddingRight: "calc(10px - 15px)",
    });
  });
  it("should not set scrollbar width for Chrome", async () => {
    // Mock Chrome userAgent
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124",
      writable: true,
      configurable: true,
    });

    const { container } = render(
      <MapContext.Provider value={mockMapContext}>
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <Sidebar {...props} />
          </AppContext.Provider>
        </FilterContext.Provider>
      </MapContext.Provider>
    );
    await waitFor(() => {
      expect(getScrollbarWidth).not.toHaveBeenCalled();
    });
    const sidebarContainer = container.firstChild;
    expect(sidebarContainer).toBeInTheDocument();
    // For Chrome, padding-right should be 6px
    expect(sidebarContainer).toHaveStyle({
      paddingRight: "6px",
    });
  });
});
