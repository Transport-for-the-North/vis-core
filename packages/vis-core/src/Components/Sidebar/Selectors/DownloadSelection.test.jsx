import { DownloadSection } from "Components/Sidebar/Selectors/DownloadSelection";
import { AppContext, FilterContext } from "contexts";
import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";
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
jest.mock("polished", () => ({
  darken: jest.fn((amount, color) => `darkened-${color}`),
}));
jest.mock("utils", () => ({
  checkSecurityRequirements: jest.fn(() => false),
}));
jest.mock("services", () => ({
  api: {
    downloadService: {
      checkGetRequestSize: jest.fn(() => ({ isValid: true, error: null })),
      downloadCsv: jest.fn(() => Promise.resolve()),
    },
  },
}));
jest.mock("Components", () => ({
  InfoBox: ({ text }) => <div data-testid="info-box">{text}</div>,
  ErrorBox: ({ text }) => <div data-testid="error-box">{text}</div>,
}));
jest.mock("Components/Sidebar/Selectors", () => ({
  MapFeatureSelect: ({ filter, value, onChange }) => (
    <div data-testid={`map-feature-${filter.id}`}>
      MapFeatureSelect: {filter.filterName}
      <button onClick={() => onChange(filter, { value: "selected" })}>
        Select Feature
      </button>
    </div>
  ),
  MapFeatureSelectWithControls: ({ filter }) => (
    <div data-testid={`map-feature-controls-${filter.id}`}>
      MapFeatureSelectWithControls: {filter.filterName}
    </div>
  ),
  MapFeatureSelectAndPan: ({ filter }) => (
    <div data-testid={`map-feature-pan-${filter.id}`}>
      MapFeatureSelectAndPan: {filter.filterName}
    </div>
  ),
  CheckboxSelector: ({ filter, value, onChange }) => (
    <div data-testid={`checkbox-${filter.id}`}>
      CheckboxSelector: {filter.filterName}
      <input
        type="checkbox"
        onChange={(e) => onChange(filter, e.target.checked)}
      />
    </div>
  ),
}));
jest.mock("Components/Sidebar/Selectors/Dropdown", () => ({
  Dropdown: ({ filter, value, onChange }) => (
    <div data-testid={`dropdown-${filter.id}`}>
      <select
        value={value || filter.values.values[0].paramValue}
        onChange={(e) => onChange(filter, e.target.value)}
      >
        {filter.values.values.map((val) => (
          <option key={val.paramValue} value={val.paramValue}>
            {val.displayValue}
          </option>
        ))}
      </select>
    </div>
  ),
}));
jest.mock("Components/Sidebar/Selectors/Slider", () => ({
  Slider: ({ filter, value, onChange }) => (
    <div data-testid={`slider-${filter.id}`}>
      <input
        type="range"
        min={filter.min}
        max={filter.max}
        value={value || filter.min}
        onChange={(e) => onChange(filter, parseInt(e.target.value))}
      />
    </div>
  ),
}));
jest.mock("Components/Sidebar/Selectors/Toggle", () => ({
  Toggle: ({ filter, value, onChange }) => {
    const currentValue = Array.isArray(value) ? value[0] : value;

    return (
      <div data-testid={`toggle-${filter.id}`}>
        <button
          onClick={() => onChange(filter, !currentValue)}
          data-testid={`toggle-button-${filter.id}`}
        >
          Toggle: {currentValue ? "ON" : "OFF"}
        </button>
      </div>
    );
  },
}));
jest.mock("Components/Sidebar/Selectors/SelectorLabel", () => ({
  SelectorLabel: ({ text, info }) => (
    <label>
      {text}
      {info && <span> ℹ️</span>}
    </label>
  ),
}));
jest.mock("../Accordion/AccordionSection.jsx", () => ({
  AccordionSection: ({ children, title }) => (
    <div data-testid="accordion">
      <div data-testid="accordion-title">{title}</div>
      <div data-testid="accordion-content">{children}</div>
    </div>
  ),
}));

const mockAppContext = {
  apiSchema: {
    paths: {
      "/api/download": {
        get: {
          security: [],
        },
      },
    },
  },
};
const createMockFilterContext = (initialState = {}) => ({
  state: initialState,
  dispatch: jest.fn(),
});
const createTestProps = (overrides = {}) => ({
  filters: [
    {
      id: "dropdown1",
      paramName: "dropdown1",
      filterName: "Dropdown Filter",
      type: "dropdown",
      info: "Info for dropdown",
      values: {
        values: [
          { paramValue: "all", displayValue: "All" },
          { paramValue: "option1", displayValue: "Option 1" },
          { paramValue: "option2", displayValue: "Option 2" },
        ],
      },
    },
    {
      id: "fixed1",
      paramName: "fixed1",
      filterName: "Fixed Filter",
      type: "fixed",
      values: {
        values: [{ paramValue: "fixed" }],
      },
    },
    {
      id: "slider1",
      paramName: "slider1",
      filterName: "Slider Filter",
      type: "slider",
      min: 0,
      max: 100,
      values: { values: [{ paramValue: 50 }] },
    },
    {
      id: "toggle1",
      paramName: "toggle1",
      filterName: "Toggle Filter",
      type: "toggle",
      values: {
        values: [{ paramValue: true }, { paramValue: false }],
      },
    },
    {
      id: "checkbox1",
      paramName: "checkbox1",
      filterName: "Checkbox Filter",
      type: "checkbox",
      values: {
        values: [{ paramValue: "check1" }, { paramValue: "check2" }],
      },
    },
    {
      id: "mapFeature1",
      paramName: "mapFeature1",
      filterName: "Map Feature",
      type: "mapFeatureSelect",
      values: { values: [] },
    },
  ],
  downloadPath: "/api/download",
  bgColor: "#3498db",
  requestMethod: "GET",
  ...overrides,
});

describe("DownloadSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial rendering", () => {
    it("returns null if filterState is empty", () => {
      const mockFilterContext = createMockFilterContext({});
      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      expect(screen.queryByText("Download data")).not.toBeInTheDocument();
      expect(screen.queryByTestId("accordion")).not.toBeInTheDocument();
    });

    it("displays the component if filterState is not empty", () => {
      const mockFilterContext = createMockFilterContext({
        dropdown1: "all",
        slider1: 50,
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      expect(screen.getByTestId("accordion")).toBeInTheDocument();
      expect(screen.getByText("Download data")).toBeInTheDocument();
    });
  });

  describe("Initialising filters", () => {
    it("initialises all filter types correctly", () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      // Check that dispatch has been called
      expect(mockFilterContext.dispatch).toHaveBeenCalledTimes(1);

      // Retrieve the call and verify the structure
      const dispatchCall = mockFilterContext.dispatch.mock.calls[0][0];
      expect(dispatchCall.type).toBe("INITIALIZE_FILTERS");

      // Check the values individually
      const { payload } = dispatchCall;
      expect(payload.dropdown1).toEqual(["all", "option1", "option2"]);
      expect(payload.fixed1).toBe("fixed");
      expect(payload.slider1).toBe(50);
      expect(payload.toggle1).toEqual([false, false]);
      expect(payload.checkbox1).toEqual(["check1", "check2"]);
      expect(payload.mapFeature1).toBeNull();
    });

    it("initialises the filters with a single value when there is only one", () => {
      const singleValueProps = createTestProps({
        filters: [
          {
            id: "single1",
            paramName: "single1",
            filterName: "Single Value",
            type: "dropdown",
            values: {
              values: [{ paramValue: "only", displayValue: "Only Option" }],
            },
          },
        ],
      });

      const mockFilterContext = createMockFilterContext({ initialized: true });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...singleValueProps} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      expect(mockFilterContext.dispatch).toHaveBeenCalledWith({
        type: "INITIALIZE_FILTERS",
        payload: {
          single1: "only", // Single value, no table
        },
      });
    });
  });

  describe("Displaying filters", () => {
    it("displays all filters except those of type 'fixed'", () => {
      const mockFilterContext = createMockFilterContext({
        dropdown1: "all",
        slider1: 50,
        toggle1: false,
        checkbox1: "check1",
        mapFeature1: null,
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      // Check that all filters are displayed except 'fixed'.
      expect(screen.getByText("Dropdown Filter")).toBeInTheDocument();
      expect(screen.getByText("Slider Filter")).toBeInTheDocument();
      expect(screen.getByText("Toggle Filter")).toBeInTheDocument();
      expect(screen.getByText("Checkbox Filter")).toBeInTheDocument();
      expect(screen.getByText("Map Feature")).toBeInTheDocument();

      // Check that the 'fixed' filter is not displayed.
      expect(screen.queryByText("Fixed Filter")).not.toBeInTheDocument();
    });

    it("displays the InfoBox with the correct text", () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const infoBox = screen.getByTestId("info-box");
      expect(infoBox).toHaveTextContent(
        "Use the selections to toggle items on and off"
      );
    });
  });

  describe("Interactions with filters", () => {
    it("manages the change in value of the dropdown", async () => {
      const mockFilterContext = createMockFilterContext({
        dropdown1: "all",
        initialized: true,
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const dropdownContainer = screen.getByTestId("dropdown-dropdown1");
      const select = within(dropdownContainer).getByRole("combobox");

      await userEvent.selectOptions(select, "option1");

      expect(mockFilterContext.dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: {
          filterId: "dropdown1",
          value: "option1",
        },
      });
    });

    it("manages the change in value of the slider", async () => {
      const mockFilterContext = createMockFilterContext({
        slider1: 50,
        initialized: true,
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const slider = screen.getByRole("slider");
      fireEvent.change(slider, { target: { value: "75" } });

      expect(mockFilterContext.dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: {
          filterId: "slider1",
          value: 75,
        },
      });
    });

    it("manages the change in value of the toggle", async () => {
      const mockFilterContext = createMockFilterContext({
        toggle1: [false, false],
        initialized: true,
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      // Reset calls after initial rendering
      mockFilterContext.dispatch.mockClear();

      // Click on the toggle
      const toggleButton = screen.getByTestId("toggle-button-toggle1");
      await userEvent.click(toggleButton);

      // Check only the last call
      expect(mockFilterContext.dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: {
          filterId: "toggle1",
          value: true,
        },
      });
    });
  });

  describe("Download button", () => {
    it("displays the Download button with the correct colours", () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps({ bgColor: "#ff0000" })} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const downloadButton = screen.getByRole("button", { name: /Download/i });
      expect(downloadButton).toBeInTheDocument();
      expect(downloadButton).toHaveStyle({ backgroundColor: "#ff0000" });
    });

    it("manages the download correctly", async () => {
      const mockFilterContext = createMockFilterContext({
        dropdown1: "option1",
        slider1: 75,
      });

      const { api } = require("services");

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const downloadButton = screen.getByRole("button", { name: /Download/i });
      await userEvent.click(downloadButton);

      expect(api.downloadService.downloadCsv).toHaveBeenCalledWith(
        "/api/download",
        {
          queryParams: { dropdown1: "option1", slider1: 75 },
          skipAuth: true,
          method: "GET",
        }
      );
    });

    it("displays the spinner during download", async () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      const { api } = require("services");
      api.downloadService.downloadCsv.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const downloadButton = screen.getByRole("button", { name: /Download/i });
      userEvent.click(downloadButton);

      await waitFor(() => {
        expect(screen.getByText(/Downloading/i)).toBeInTheDocument();
      });
    });

    it("disable the button if the request is too large", () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      const { api } = require("services");
      api.downloadService.checkGetRequestSize.mockReturnValue({
        isValid: false,
        error: "Request too large",
      });

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const downloadButton = screen.getByRole("button", {
        name: /Request Too Large/i,
      });
      expect(downloadButton).toBeDisabled();
      expect(screen.getByTestId("error-box")).toHaveTextContent(
        "Request too large"
      );
    });
  });

  describe("Error Management", () => {
    it("displays an error if the download fails", async () => {
      const mockFilterContext = createMockFilterContext({ initialized: true });

      const { api } = require("services");
      api.downloadService.downloadCsv.mockRejectedValue(
        new Error("Network error")
      );

      render(
        <FilterContext.Provider value={mockFilterContext}>
          <AppContext.Provider value={mockAppContext}>
            <DownloadSection {...createTestProps()} />
          </AppContext.Provider>
        </FilterContext.Provider>
      );

      const downloadButton = screen.getByRole("button", { name: /Download/i });
      await userEvent.click(downloadButton);

      await waitFor(() => {
        expect(screen.getByTestId("error-box")).toHaveTextContent(
          "Network error"
        );
      });
    });
  });
});
