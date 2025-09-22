import { render, screen, waitFor } from "@testing-library/react";
import { AppContext, FilterContext, MapProvider, PageContext } from "contexts";

const mockDispatch = jest.fn();
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
jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid-id"),
}));
jest.mock("utils", () => ({
  hasRouteParameterOrQuery: jest.fn(() => true),
  extractParamsWithValues: jest.fn(() => true),
  processParameters: jest.fn(),
  updateUrlParameters: jest.fn(() => true),
  checkSecurityRequirements: jest.fn(() => true),
}));
import { api } from "services";
import { hasRouteParameterOrQuery, processParameters } from "utils";
import { v4 as uuidv4 } from "uuid";
import React from "react";
const mockUseReducer = React.useReducer;
const mockGet = api.baseService.get;
const mockUuid = uuidv4;
const mockProcessParameters = processParameters;
const mockHasRouteParameterOrQuery = hasRouteParameterOrQuery;

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
  mockUuid.mockReturnValue("mocked-uuid-id");
  mockGet.mockResolvedValue([{ id: 1 }]);
      mockUseReducer.mockReturnValue([
      {pageIsReady: true},
      jest.fn(),
    ]);
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
    mockUseReducer.mockReturnValue([{}, mockDispatch]);

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
});
