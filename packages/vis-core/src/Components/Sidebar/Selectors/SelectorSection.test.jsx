import { render, screen, waitFor } from "@testing-library/react";
import { SelectorSection } from ".";
import { MapContext, FilterContext, AppContext } from "contexts";
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
jest.mock("./Dropdown", () => ({
  Dropdown: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-dropdown">
      <div>key: {key}</div>
      <div>filter: {JSON.stringify(filter)}</div>
      <div>value: {value}</div>
      <button onClick={onChange(filter, value)}>onChange</button>
    </div>
  ),
}));
jest.mock("./Slider", () => ({
  Slider: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-slider">
      <div>key: {key}</div>
      <div>filter: {JSON.stringify(filter)}</div>
      <div>value: {value}</div>
      <button onClick={onChange(filter, value)}>onChange</button>
    </div>
  ),
}));
jest.mock("./Toggle", () => ({
  Toggle: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-toggle">
      <button data-testid="toggle" onClick={onChange(filter, value)}></button>
    </div>
  ),
}));
jest.mock("./CheckboxSelector", () => ({
  CheckboxSelector: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-checkbox">
      <button data-testid="checkbox" onClick={onChange(filter, value)}></button>
    </div>
  ),
}));
jest.mock("./MapFeatureSelect", () => ({
  MapFeatureSelect: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-mapFeatureSelect">
      <button
        data-testid="mapFeatureSelect"
        onClick={onChange(filter, value)}
      ></button>
    </div>
  ),
  MapFeatureSelectWithControls: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-mapFeatureSelectWithControls">
      <button
        data-testid="mapFeatureSelectWithControls"
        onClick={onChange(filter, value)}
      ></button>
    </div>
  ),
}));
jest.mock("./MapFeatureSelectAndPan", () => ({
  MapFeatureSelectAndPan: ({ key, filter, value, onChange }) => (
    <div data-testid="mock-mapFeatureSelectAndPan">
      <button
        data-testid="mapFeatureSelectAndPan"
        onClick={onChange(filter, value)}
      ></button>
    </div>
  ),
}));

const mockAppContexte = {
  //   state: {
  appPages: [
    {
      url: "/",
      location: { pathname: "/pathname1" },
      pageName: ["Difference", "Authority"],
    },
    {
      url: "/url2",
      location: { pathname: "/pathname2" },
    },
  ],
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
  apiSchema: {
    paths: {
      "/downloadPath": {
        get: jest.fn()
      }
    }
  }
};
const mockFilterContext = {
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
const dispatch = jest.fn();
const mockState = {
  visualisations: {},
  filters: [],
  layers: {
    layerA: { path: "/fake/path" },
  },
  currentZoom: 10,
};
let props = {
  filter: [],
  onFilterChange: jest.fn(),
  bgColor: "white",
  downloadPath: "/downloadPath"
};

describe("SelectorSection component test", () => {
  it("Does not render mapViewport filter in sidebar", async () => {
    const viewportFilter = {
      type: "mapViewport",
      id: "viewport-filter-1",
      paramName: "viewport",
      filterName: "MapViewport",
      values: { source: "local", values: [] },
    };
    const regularFilter = {
      type: "dropdown",
      id: "dropdown-1",
      paramName: "category",
      filterName: "Category",
      values: { source: "local", values: [] },
    };

    props = {
      ...props,
      filters: [viewportFilter, regularFilter],
    };

    render(
      <AppContext.Provider value={mockAppContexte}>
        <MapContext.Provider value={{ state: mockState, dispatch }}>
          <FilterContext.Provider value={mockFilterContext}>
            <SelectorSection {...props} />
          </FilterContext.Provider>
        </MapContext.Provider>
      </AppContext.Provider>
    );

    // mapViewport type filters should not be rendered in sidebar
    // Only the regular dropdown filter should be rendered
    expect(screen.getByTestId("mock-dropdown")).toBeInTheDocument();
  });

  it("Basic use of dropdown type", async () => {
    props = {
      ...props,
      filters: [{ type: "dropdown", id: "dropdown", values: "dropdown" }],
    };
    render(
      <AppContext.Provider value={mockAppContexte}>
        <MapContext.Provider value={{ state: mockState, dispatch }}>
          <FilterContext.Provider value={mockFilterContext}>
            <SelectorSection {...props} />
          </FilterContext.Provider>
        </MapContext.Provider>
      </AppContext.Provider>
    );
    // Check the title
    expect(
      screen.getByText("Filtering and data selection")
    ).toBeInTheDocument();
    // check the dropdown
    const dropdownWrapper = screen.getByTestId("mock-dropdown");
    expect(dropdownWrapper).toBeInTheDocument();
    // check the props
    const filter = screen.getByText(
      /filter: {"type":"dropdown","id":"dropdown","values":"dropdown"}/
    );
    const value = screen.getByText(/value: dropdown/);
    const buttonText = screen.getByText(/onChange/);
    expect(filter).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
    // check the onClick of the button
    const button = screen.getByText(/Download as CSV/);
    userEvent.click(button);
    // check if the function is launched
    await waitFor(() => {
      expect(props.onFilterChange).toHaveBeenCalledWith(
        { type: "dropdown", id: "dropdown", values: "dropdown" },
        "dropdown"
      );
    });
  });

  it("Basic use of slider type", async () => {
    props = {
      ...props,
      filters: [{ type: "slider", id: "slider", values: "slider" }],
    };
    render(
      <AppContext.Provider value={mockAppContexte}>
        <MapContext.Provider value={{ state: mockState, dispatch }}>
          <FilterContext.Provider value={mockFilterContext}>
            <SelectorSection {...props} />
          </FilterContext.Provider>
        </MapContext.Provider>
      </AppContext.Provider>
    );
    // Check the title
    expect(
      screen.getByText("Filtering and data selection")
    ).toBeInTheDocument();
    // check the slider
    const dropdownWrapper = screen.getByTestId("mock-slider");
    expect(dropdownWrapper).toBeInTheDocument();
    // check the props
    const filter = screen.getByText(
      /filter: {"type":"slider","id":"slider","values":"slider"}/
    );
    const value = screen.getByText(/value: slider/);
    const buttonText = screen.getByText(/onChange/);
    expect(filter).toBeInTheDocument();
    expect(value).toBeInTheDocument();
    expect(buttonText).toBeInTheDocument();
    // check the onClick of the button
    const button = screen.getByText(/Download as CSV/);
    userEvent.click(button);
    // check if the function is launched
    await waitFor(() => {
      expect(props.onFilterChange).toHaveBeenCalledWith(
        { type: "slider", id: "slider", values: "slider" },
        "slider"
      );
    });
  });
  it("Check the other types", async () => {
    props = {
      ...props,
      filters: [
        { type: "toggle", id: "toggle", values: "toggle" },
        { type: "checkbox", id: "checkbox", values: "checkbox" },
        {
          type: "mapFeatureSelect",
          id: "mapFeatureSelect",
          values: "mapFeatureSelect",
        },
        {
          type: "mapFeatureSelectWithControls",
          id: "mapFeatureSelectWithControls",
          values: "mapFeatureSelectWithControls",
        },
        {
          type: "mapFeatureSelectAndPan",
          id: "mapFeatureSelectAndPan",
          values: "mapFeatureSelectAndPan",
        },
      ],
    };
    render(
      <AppContext.Provider value={mockAppContexte}>
        <MapContext.Provider value={{ state: mockState, dispatch }}>
          <FilterContext.Provider value={mockFilterContext}>
            <SelectorSection {...props} />
          </FilterContext.Provider>
        </MapContext.Provider>
      </AppContext.Provider>
    );
    expect(screen.getByTestId("mock-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("mock-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("mock-mapFeatureSelect")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-mapFeatureSelectWithControls")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-mapFeatureSelectAndPan")
    ).toBeInTheDocument();
    // click on all button
    const toggle = screen.getByTestId("toggle");
    const checkbox = screen.getByTestId("checkbox");
    const mapFeatureSelect = screen.getByTestId("mapFeatureSelect");
    const mapFeatureSelectWithControls = screen.getByTestId(
      "mapFeatureSelectWithControls"
    );
    const mapFeatureSelectAndPan = screen.getByTestId("mapFeatureSelectAndPan");
    // click
    userEvent.click(toggle);
    userEvent.click(checkbox);
    userEvent.click(mapFeatureSelect);
    userEvent.click(mapFeatureSelectWithControls);
    userEvent.click(mapFeatureSelectAndPan);
    expect(props.onFilterChange).toHaveBeenCalledWith(
      { type: "toggle", id: "toggle", values: "toggle" },
      "toggle"
    );
    expect(props.onFilterChange).toHaveBeenCalledWith(
      { type: "checkbox", id: "checkbox", values: "checkbox" },
      "checkbox"
    );
    expect(props.onFilterChange).toHaveBeenCalledWith(
      {
        type: "mapFeatureSelect",
        id: "mapFeatureSelect",
        values: "mapFeatureSelect",
      },
      "mapFeatureSelect"
    );
    expect(props.onFilterChange).toHaveBeenCalledWith(
      {
        type: "mapFeatureSelectWithControls",
        id: "mapFeatureSelectWithControls",
        values: "mapFeatureSelectWithControls",
      },
      "mapFeatureSelectWithControls"
    );
    expect(props.onFilterChange).toHaveBeenCalledWith(
      {
        type: "mapFeatureSelectAndPan",
        id: "mapFeatureSelectAndPan",
        values: "mapFeatureSelectAndPan",
      },
      "mapFeatureSelectAndPan"
    );
  });
});
