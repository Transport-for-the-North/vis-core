import { render, screen } from "@testing-library/react";
import { MapLayout } from ".";
import { AppContext, FilterContext, MapContext } from "contexts";
import { PageContext } from "contexts";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

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
let theme = {
  mq: {
    mobile: "mobile",
  },
};
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
    filters: [
      {
        actions: [{ action: "action" }],
        filterName: "Left",
        visualisations: ["Side"],
        defaultValue: "defaultValue",
      },
    ],
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
const mockPageContext = {
  config: {
    filters: [
      {
        name: "name1",
        containsLegendInfo: false,
      },
      {
        name: "name2",
        containsLegendInfo: true,
      },
    ],
    additionalFeatures: "additionalFeatures",
  },
  pageName: "pageName",
  current: "",
};
const mockAppContexte = {
  //   state: {
  appPages: [{ url: "/" }, { url: "/other" }],
  footer: {
    creditsText: "Im a credits text",
    privacyPolicyLink: "/privacyPolicyLink",
    cookiesLink: "/cookiesLink",
    contactUsLink: "/contactUsLink",
  },
  homePageFragments: [
    {
      id: 1,
      htmlContent: `<p>Fragment 1 content</p>`,
      images: ["https://example1.1", "https://example1.2"],
      content: "foo",
      apiConfig: null,
      sectionTitle: "sectionTitle1",
      alignment: "alignment",
    },
    {
      id: 2,
      htmlContent: `<p>Fragment 2 content with image</p>`,
      content: "bar",
      images: ["https://example2.1"],
      apiConfig: null,
      sectionTitle: "sectionTitle2",
    },
  ],
  //   },
  background: "background",
  methodology: "methodology",
  additionalImage: "additionalImage",
  title: "My App Title",
  backgroundImage: "backgroundImage",
  introduction: "introduction",
  contactText: "contactText",
  contactEmail: "contactEmail",
  legalText: "legalText",
};

jest.mock("Components", () => ({
  ...jest.requireActual("Components"),
  Dimmer: ({ dimmed, showLoader }) => {
    return (
      <>
        <div>dimmed: {dimmed ? "true" : "false"}</div>
        <div>showLoader: {showLoader ? "true" : "false"}</div>
      </>
    );
  },
  Sidebar: ({
    pageName,
    aboutVisualisationText,
    filters,
    legalText,
    onFilterChange,
    bgColor,
    additionalFeatures,
    infoBoxText,
    children,
  }) => {
    return (
      <>
        <button onClick={onFilterChange}>Sidebar</button>
        {children}
      </>
    );
  },
  MapLayerSection: ({ handleColorChange, handleClassificationChange }) => {
    return (
      <>
        <span>MapLayerSection</span>
        <button onClick={handleColorChange}>handleColorChange</button>
        <button onClick={handleClassificationChange}>
          handleClassificationChange
        </button>
      </>
    );
  },
}));
jest.mock("./Map", () => ({
  Map: ({ extraCopyrightText }) => <div>Map: {extraCopyrightText}</div>,
}));
jest.mock("./DualMaps", () => ({
  DualMaps: ({ extraCopyrightText }) => (
    <div>DualMaps: {extraCopyrightText}</div>
  ),
}));

describe("MapLayout component test", () => {
  it("Basic use", async () => {
    render(
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={mockAppContexte}>
          <PageContext.Provider value={mockPageContext}>
            <FilterContext.Provider value={mockFilterContext}>
              <MapContext.Provider value={mockMapContext}>
                <MapLayout />
              </MapContext.Provider>
            </FilterContext.Provider>
          </PageContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    );
    // Dimmed check
    expect(screen.getByText(/dimmed: false/)).toBeInTheDocument();
    expect(screen.getByText(/showLoader: true/)).toBeInTheDocument();
    // Sidebar
    const buttonSidebar = screen.getByRole("button", { name: "Sidebar" });
    await userEvent.click(buttonSidebar);
    expect(mockMapContext.dispatch).toHaveBeenCalled();
    // MapLayerSection in the Sidebar
    // handleColorChangeButton is called
    const handleColorChangeButton = screen.getByRole("button", {
      name: "handleColorChange",
    });
    await userEvent.click(handleColorChangeButton);
    expect(mockMapContext.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_COLOR_SCHEME",
      })
    );
    // handleClassificationChangeButton is called
    const handleClassificationChangeButton = screen.getByRole("button", {
      name: "handleClassificationChange",
    });
    await userEvent.click(handleClassificationChangeButton);
    expect(mockMapContext.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "UPDATE_CLASSIFICATION_METHOD",
      })
    );
  });

  it("Use of !initializedRef.current && state.pageIsReady is good", async () => {
    render(
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={mockAppContexte}>
          <PageContext.Provider value={mockPageContext}>
            <FilterContext.Provider value={mockFilterContext}>
              <MapContext.Provider value={mockMapContext}>
                <MapLayout />
              </MapContext.Provider>
            </FilterContext.Provider>
          </PageContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    );
    // expect dispatch is called
    const parametersExpected = {
      type: "action",
      payload: {
        filter: {
          actions: [{ action: "action" }],
          filterName: "Left",
          visualisations: ["Side"],
          defaultValue: "defaultValue",
        },
        value: "defaultValue",
        sides: "left",
      },
    };
    expect(mockMapContext.dispatch).toHaveBeenCalledWith(parametersExpected);
  });

  it("filterDispatch is called to reset filters", async () => {
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={mockAppContexte}>
          <PageContext.Provider value={mockPageContext}>
            <FilterContext.Provider value={mockFilterContext}>
              <MapContext.Provider value={mockMapContext}>
                <MapLayout />
              </MapContext.Provider>
            </FilterContext.Provider>
          </PageContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    );
    // filterDispatch is not called because pageContext is not change yet
    expect(mockFilterContext.dispatch).not.toHaveBeenCalled();

    // Change the PageContext
    const newPageContext = {
      pageName: "page2",
      config: { someConfig: "value2" },
    };
    rerender(
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={mockAppContexte}>
          <PageContext.Provider value={newPageContext}>
            <FilterContext.Provider value={mockFilterContext}>
              <MapContext.Provider value={mockMapContext}>
                <MapLayout />
              </MapContext.Provider>
            </FilterContext.Provider>
          </PageContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    );
    expect(mockFilterContext.dispatch).toHaveBeenCalledWith({
      type: "RESET_FILTERS",
    });
  });
});

describe("tests when !filter.visualisations[0].includes(`Side`)", () => {
  let mockMapContext2;
  beforeEach(() => {
    mockMapContext2 = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        filters: [
          {
            actions: [{ action: "UPDATE_COLOR_SCHEME" }],
            filterName: "Left",
            visualisations: ["Other"],
            defaultValue: "defaultValue",
            values: {
              values: [{ paramValue: "dropdown", colourValue: "colourValue" }],
            },
            id: "dropdown",
          },
        ],
      },
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Test when action = UPDATE_COLOR_SCHEME", () => {
    render(
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={mockAppContexte}>
          <PageContext.Provider value={mockPageContext}>
            <FilterContext.Provider value={mockFilterContext}>
              <MapContext.Provider value={mockMapContext2}>
                <MapLayout />
              </MapContext.Provider>
            </FilterContext.Provider>
          </PageContext.Provider>
        </AppContext.Provider>
      </ThemeProvider>
    );
    // expect dispatch is called with type = UPDATE_COLOR_SCHEME
    expect(mockMapContext2.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_COLOR_SCHEME",
      payload: {
        filter: {
          actions: [{ action: "UPDATE_COLOR_SCHEME" }],
          filterName: "Left",
          visualisations: ["Other"],
          defaultValue: "defaultValue",
          values: {
            values: [{ paramValue: "dropdown", colourValue: "colourValue" }],
          },
          id: "dropdown",
        },
        value: "dropdown",
        color_scheme: "colourValue",
      },
    });
  });
});
