import { render, screen, waitFor } from "@testing-library/react";

// Mock all dependencies before importing the components
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useReducer: jest.fn(),
}));

jest.mock("services", () => ({
  api: {
    baseService: {
      get: jest.fn(),
    },
  },
}));

jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  hasRouteParameterOrQuery: jest.fn(() => true),
  extractParamsWithValues: jest.fn(() => true),
  processParameters: jest.fn(() => ({
    params: {},
    missingParams: [],
  })),
  updateUrlParameters: jest.fn((path) => path),
  checkSecurityRequirements: jest.fn(() => true),
  sortValues: jest.fn((values) => values),
  isValidCondition: jest.fn(() => true),
  applyCondition: jest.fn(),
  parseStringToArray: jest.fn((str) => (Array.isArray(str) ? str : [str])),
  getGetParameters: jest.fn(() => []),
  buildParamsMap: jest.fn(() => ({})),
  getDefaultLayerBufferSize: jest.fn(() => 0),
  applyWhereConditions: jest.fn((data) => data),
  buildDeterministicFilterId: jest.fn(() => "mock-filter-id"),
}));

jest.mock("defaults", () => ({
  defaultMapStyle: "mock-style",
  defaultMapZoom: 10,
  defaultMapCentre: [0, 0],
  CARD_CONSTANTS: {
    PADDING: 10,
    TOGGLE_BUTTON_WIDTH: 20,
    TOGGLE_BUTTON_HEIGHT: 20,
  },
}));

// Now import after mocks
import React from "react";
import { AppContext, FilterContext, MapProvider, PageContext } from "contexts";
import { api } from "services";
import { actionTypes } from "reducers";
import {
  hasRouteParameterOrQuery,
  processParameters,
  getGetParameters,
  buildParamsMap,
  getDefaultLayerBufferSize,
  updateUrlParameters,
} from "utils";

const mockDispatch = jest.fn();
const mockUseReducer = React.useReducer;
const mockGet = api.baseService.get;
const mockProcessParameters = processParameters;
const mockHasRouteParameterOrQuery = hasRouteParameterOrQuery;
const mockGetGetParameters = getGetParameters;
const mockBuildParamsMap = buildParamsMap;
const mockGetDefaultLayerBufferSize = getDefaultLayerBufferSize;
const mockUpdateUrlParameters = updateUrlParameters;

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
const mockAppContexte = {
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
  background: "background",
  methodology: "methodology",
  additionalImage: "additionalImage",
  title: "My App Title",
  backgroundImage: "backgroundImage",
  introduction: "introduction",
  contactText: "contactText",
  contactEmail: "contactEmail",
  legalText: "legalText",
  apiSchema: {
    paths: { baz: { get: { parameters: "parameters" } }, bar: {} },
  },
  defaultBands: [
    {
      name: "climate",
      label: "Climate Band",
      color: "#00FF00",
      opacity: 0.5,
    },
    {
      name: "biodiversity",
      label: "Biodiversity Band",
      color: "#0000FF",
      opacity: 0.7,
    },
  ],
};
const mockPageContext = {
  config: {
    filters: [
      {
        name: "metadataTableName",
        containsLegendInfo: false,
        values: {
          source: "metadataTable",
          metadataTableName: "metadataTableName",
          values: [
            { displayValue: "Value 1", paramValue: "val1"},
            { displayValue: "Value 2", paramValue: "val2"},
          ],
        },
        visualisations: ["Side"],
        filterName: "Left",
        type: "metadataTable"
      },
      {
        name: "name2",
        containsLegendInfo: true,
        values: {
          source: "local",
          values: [
            { displayValue: "Value 1", paramValue: "val1" },
            { displayValue: "Value 2", paramValue: "val2" },
          ],
        },
        visualisations: ["Side"],
        filterName: "Left",
      },
    ],
    additionalFeatures: "additionalFeatures",
    layers: [{ path: "/foo" }, { path: "/bar" }],
    visualisations: [{ dataPath: "/baz" }],
    metadataTables: [{ where: "where", name: "metadataTableName", path: "/path" }],
  },
  pageName: "pageName",
  current: "",
};

beforeEach(() => {
  jest.clearAllMocks();
  
  // Re-initialize mock implementations after clearAllMocks
  mockGet.mockResolvedValue([{ id: 1 }]);
  mockUseReducer.mockReturnValue([
    {
      pageIsReady: true,
      filters: [],
      visualisations: {},
      leftVisualisations: {},
      rightVisualisations: {},
    },
    jest.fn(),
  ]);
  mockProcessParameters.mockReturnValue({
    params: {},
    missingParams: [],
  });
  mockHasRouteParameterOrQuery.mockReturnValue(true);
  mockGetGetParameters.mockReturnValue([]);
  mockBuildParamsMap.mockReturnValue({});
  mockGetDefaultLayerBufferSize.mockReturnValue(0);
  mockUpdateUrlParameters.mockImplementation((path) => path);
});

describe("MapProvider component tests", () => {
  it("Check the render", async () => {
    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <FilterContext.Provider value={mockFilterContext}>
            <MapProvider>
              <p>ImAChildren</p>
            </MapProvider>
          </FilterContext.Provider>
        </AppContext.Provider>
      </PageContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText("ImAChildren")).toBeInTheDocument();
    });
  });
});

describe("parameterisedLayers for each layer", () => {
  beforeEach(() => {
    mockUseReducer.mockReturnValue([
      {
        pageIsReady: false,
        filters: [],
        visualisations: {},
        leftVisualisations: {},
        rightVisualisations: {},
      },
      mockDispatch,
    ]);

    mockProcessParameters.mockReturnValue({
      params: "params",
      missingParams: "missingParams",
    });
    mockHasRouteParameterOrQuery.mockReturnValue(true);
  });

  it("Basic render", () => {
    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <FilterContext.Provider value={mockFilterContext}>
            <MapProvider>
              <p>ImAChildren</p>
            </MapProvider>
          </FilterContext.Provider>
        </AppContext.Provider>
      </PageContext.Provider>
    );

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("filters metadata rows using valid filter values and propagates filtered scenarios", async () => {
    const scenarioRows = [
      { id: 1, vis_description: "Scenario 1" },
      { id: 2, vis_description: "Scenario 2" },
      { id: 3, vis_description: "Scenario 3" },
    ];

    mockUseReducer.mockReturnValue([
      {
        pageIsReady: false,
        filters: [],
        visualisations: {
          testVisualisation: { name: "testVisualisation" },
        },
        leftVisualisations: {
          testVisualisation: { name: "testVisualisation" },
        },
        rightVisualisations: {
          testVisualisation: { name: "testVisualisation" },
        },
      },
      mockDispatch,
    ]);

    mockGet
      .mockResolvedValueOnce([1, 3])
      .mockResolvedValueOnce(scenarioRows);

    const appContextWithMetadataFiltering = {
      ...mockAppContexte,
      visualiserAppName: "Sandbox",
      metadataFiltering: {
        path: "/api/norms-app-scenario",
        queryParamName: "appName",
        metadataTableName: "metadataTableName",
        metadataColumn: "id",
      },
    };

    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={appContextWithMetadataFiltering}>
          <FilterContext.Provider value={mockFilterContext}>
            <MapProvider>
              <p>ImAChildren</p>
            </MapProvider>
          </FilterContext.Provider>
        </AppContext.Provider>
      </PageContext.Provider>
    );

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith("/api/norms-app-scenario", {
        queryParams: { appName: "Sandbox" },
      });
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: actionTypes.SET_FILTERED_SCENARIOS,
        payload: [scenarioRows[0], scenarioRows[2]],
      });
    });
  });
});
