import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { LayerControlEntry } from "Components/Sidebar/Accordion/LayerControlEntry";
import { AppContext, MapContext, PageContext } from "contexts";

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
        name: "name1",
        containsLegendInfo: false,
      },
      {
        name: "name2",
        containsLegendInfo: true,
      },
    ],
  },
  pageName: "pageName",
};

const fakeHandleClassificationChange = jest.fn();
const fakeHandleColorChange = jest.fn();
const mockGetLayer = jest.fn().mockReturnValue(true);
const mockMap = {
  getLayer: mockGetLayer,
};
const props = {
  handleClassificationChange: fakeHandleClassificationChange,
  handleColorChange: fakeHandleColorChange,
  layer: {
    id: "id",
    type: "fill",
    layout: { visibility: false },
    metadata: { path: "/", shouldHaveOpacityControl: true, isStylable: false },
  },
  maps: [mockMap],
  state: {
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
    leftVisualisations: {
      first: {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [{ label: "Ventes", data: [100, 200, 150] }],
        },
        options: {
          responsive: true,
        },
      },
      second: {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar"],
          datasets: [{ label: "Ventes", data: [100, 200, 150] }],
        },
        options: {
          responsive: true,
        },
      },
    },
  },
};

describe("LayerControlEntry component test", () => {
  it("displays layer label, toggles chevron direction and visibility (eye icon) on user actions", async () => {
    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...props} />
        </AppContext.Provider>
      </PageContext.Provider>
    );
    expect(screen.getByText("id")).toBeInTheDocument();

    // Chevron switch
    const chevronDown = screen.getByTestId("ChevronDownIcon");
    expect(chevronDown).toBeInTheDocument();
    const buttonHeader = screen.getByTestId("HeaderLeft");
    buttonHeader.click();
    await waitFor(() => {
      const chevronRight = screen.getByTestId("ChevronRightIcon");
      expect(chevronRight).toBeInTheDocument();
    });
    // Label id
    expect(screen.getByText("id")).toBeInTheDocument();
    // Visibility, EyeIcon switch
    const eyeIcon = screen.getByLabelText("Hide layer");
    expect(eyeIcon).toBeInTheDocument();
    const buttonSwitch = screen.getByTestId("visibility-toggle");
    buttonSwitch.click();
    await waitFor(() => {
      const EyeSlashIcon = screen.getByLabelText("Show layer");
      expect(EyeSlashIcon).toBeInTheDocument();
    });
  });
  it("Displays the map if there is metadata and a path in the props layer.", () => {
    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...props} />
        </AppContext.Provider>
      </PageContext.Provider>
    );
    expect(screen.getByText("Zoom to map feature")).toBeInTheDocument();
  });
  it("Choice of opacity, therefore display of the slider", async () => {
    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...props} />
        </AppContext.Provider>
      </PageContext.Provider>
    );
    expect(screen.getByText("Opacity")).toBeInTheDocument();
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(slider).toHaveValue("0.5");

    // Change the slider value to 0.5
    fireEvent.change(slider, { target: { value: "1" } });
    expect(slider.value).toBe("1");

    // Verify that the new value is displayed
    await waitFor(() => {
      expect(screen.getByText("100%")).toBeInTheDocument();
    });
    expect(slider).toHaveValue("1");

    // Test another value
    fireEvent.change(slider, { target: { value: "0.3" } });

    await waitFor(() => {
      expect(screen.getByText("30%")).toBeInTheDocument();
    });
    expect(slider).toHaveValue("0.3");
  });
  it("Test of isFeatureStateWidthExpression's slider", async () => {
    // I don't know why, but I have to recreate the getLayer function, otherwise it doesn't recognize it.
    const mockGetLayer2 = jest.fn().mockReturnValue(true);
    const mockGetPaintProperty2 = jest
      .fn()
      .mockReturnValue(["interpolate", 100]);
    const mockSetPaintProperty2 = jest.fn();
    const mockMap2 = {
      getLayer: mockGetLayer2,
      getPaintProperty: mockGetPaintProperty2,
      setPaintProperty: mockSetPaintProperty2,
    };
    const testProps = {
      ...props,
      maps: [mockMap2],
      layer: {
        id: "id",
        type: "line",
        layout: { visibility: false },
        metadata: { path: "/", shouldHaveOpacityControl: true },
      },
    };

    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...testProps} />
        </AppContext.Provider>
      </PageContext.Provider>
    );
    expect(screen.getByText("Width factor")).toBeInTheDocument();
    const slider = screen.getByLabelText("Width factor");
    expect(slider).toBeInTheDocument();

    // initialWidth :  11.764705882352942
    expect(screen.getByText("11.8")).toBeInTheDocument(); // rounded

    fireEvent.change(slider, { target: { value: "10" } });
    await waitFor(() => {
      expect(slider.value).toBe("10"); // It's a string
    });
    expect(screen.getByText("10.0")).toBeInTheDocument(); // rounded
  });
  it("Test", () => {
    const mockMapContext = {
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
    const props2 = {
      ...props,
      layer: {
        ...props.layer,
        id: "id",
        metadata: {
          ...props.layer.metadata,
          isStylable: true,
        },
      },
      state: {
        ...props.state,
        layers: [],
      },
    };
    const mockPageContext2 = {
      ...mockPageContext,
      pageName: "Side-by-Side",
    };
    render(
      <MapContext.Provider value={mockMapContext}>
        <PageContext.Provider value={mockPageContext2}>
          <AppContext.Provider value={mockAppContexte}>
            <LayerControlEntry {...props2} />
          </AppContext.Provider>
        </PageContext.Provider>
      </MapContext.Provider>
    );
    expect(screen.getByText("Colour scheme")).toBeInTheDocument();
    expect(screen.getByText("Classification method")).toBeInTheDocument();
  });
});
