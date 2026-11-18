import { render, screen, waitFor, fireEvent, act, cleanup } from "@testing-library/react";
import { LayerControlEntry } from "Components/Sidebar/Accordion/LayerControlEntry";
import { AppContext, MapContext, PageContext } from "contexts";
import { reclassifyData } from "utils/map";

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
const mockGetPaintProperty = jest.fn((layerId, propertyName) => {
  if (propertyName?.includes("opacity")) return 0.5;
  if (propertyName?.includes("width") || propertyName === "circle-radius") return 1;
  return 0.5;
});
const mockMap = {
  getLayer: mockGetLayer,
  getPaintProperty: mockGetPaintProperty,
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
    expect(slider).toHaveValue("10");
  });

  it("Does not render width factor slider when shouldFixLineWidth is enabled", () => {
    const mockGetLayer2 = jest.fn().mockReturnValue(true);
    const mockGetPaintProperty2 = jest.fn().mockReturnValue(["interpolate", 100]);
    const mockMap2 = {
      getLayer: mockGetLayer2,
      getPaintProperty: mockGetPaintProperty2,
      setPaintProperty: jest.fn(),
    };

    const testProps = {
      ...props,
      maps: [mockMap2],
      layer: {
        id: "id",
        type: "line",
        layout: { visibility: false },
        metadata: {
          path: "/",
          shouldHaveOpacityControl: true,
          shouldFixLineWidth: true,
          fixedLineWidth: 3,
        },
      },
      state: {
        ...props.state,
        layers: {
          id: {
            shouldFixLineWidth: true,
            fixedLineWidth: 3,
          },
        },
      },
    };

    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...testProps} />
        </AppContext.Provider>
      </PageContext.Provider>
    );

    expect(screen.queryByText("Width factor")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Width factor")).not.toBeInTheDocument();
  });

  it("uses a layer defaultWidthFactor on initialisation", async () => {
    const mockMap2 = {
      getLayer: jest.fn().mockReturnValue(true),
      getPaintProperty: jest.fn((layerId, propertyName) => {
        if (propertyName?.includes("opacity")) return 0.5;
        if (propertyName === "circle-radius") {
          // Simulate useFeatureStateUpdater having already applied defaultWidthFactor: 0.3
          // calculateMaxWidthFactor(7.5, 'circle-radius') = 7.5 / 25 = 0.3
          return ["interpolate", ["linear"], ["feature-state", "value"], 0, 2, 10, 7.5];
        }
        return 0.5;
      }),
      setPaintProperty: jest.fn(),
    };

    const testProps = {
      ...props,
      maps: [mockMap2],
      layer: {
        id: "id",
        type: "circle",
        layout: { visibility: false },
        metadata: {
          path: "/",
          shouldHaveOpacityControl: true,
          defaultWidthFactor: 0.3,
        },
      },
      state: {
        ...props.state,
      },
    };

    render(
      <MapContext.Provider value={{ state: testProps.state, dispatch: jest.fn() }}>
        <PageContext.Provider value={mockPageContext}>
          <AppContext.Provider value={mockAppContexte}>
            <LayerControlEntry {...testProps} />
          </AppContext.Provider>
        </PageContext.Provider>
      </MapContext.Provider>
    );

    const slider = screen.getByLabelText("Width factor");
    expect(slider).toHaveValue("0.3");
    expect(screen.getByText("0.3")).toBeInTheDocument();
  });

  it("dispatches width factor updates when the slider changes", async () => {
    const dispatch = jest.fn();
    const mockMap2 = {
      getLayer: jest.fn().mockReturnValue(true),
      getPaintProperty: jest.fn((layerId, propertyName) => {
        if (propertyName?.includes("opacity")) return 0.5;
        if (propertyName === "line-width") return ["interpolate", ["linear"], ["feature-state", "value"], 0, 1, 10, 8.5];
        return 0.5;
      }),
      setPaintProperty: jest.fn(),
    };

    const testProps = {
      ...props,
      maps: [mockMap2],
      layer: {
        id: "id",
        type: "line",
        layout: { visibility: false },
        metadata: {
          path: "/",
          shouldHaveOpacityControl: true,
          defaultWidthFactor: 0.3,
        },
      },
      state: {
        ...props.state,
      },
    };

    render(
      <MapContext.Provider value={{ state: testProps.state, dispatch }}>
        <PageContext.Provider value={mockPageContext}>
          <AppContext.Provider value={mockAppContexte}>
            <LayerControlEntry {...testProps} />
          </AppContext.Provider>
        </PageContext.Provider>
      </MapContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Width factor"), {
      target: { value: "0.6" },
    });

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith({
        type: "UPDATE_LAYER_WIDTH_FACTOR",
        payload: {
          layerName: "id",
          widthFactor: 0.6,
        },
      });
    });
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

  it("does not render edit banding when enforceNoCustomBanding is enabled", () => {
    const props2 = {
      ...props,
      layer: {
        ...props.layer,
        metadata: {
          ...props.layer.metadata,
          isStylable: true,
          enforceNoCustomBanding: true,
        },
      },
      state: {
        ...props.state,
        visualisations: {
          id: {
            id: "id",
            name: "Test Visualisation",
            style: "line-continuous",
            queryParams: {},
            data: [{ value: 10 }, { value: 20 }, { value: 30 }],
          },
        },
        layers: {
          id: {
            class_method: "d",
          },
        },
      },
    };

    render(
      <MapContext.Provider
        value={{
          state: props2.state,
          dispatch: jest.fn(),
        }}
      >
        <PageContext.Provider value={mockPageContext}>
          <AppContext.Provider value={mockAppContexte}>
            <LayerControlEntry {...props2} />
          </AppContext.Provider>
        </PageContext.Provider>
      </MapContext.Provider>
    );

    expect(screen.getByText("Colour scheme")).toBeInTheDocument();
    expect(screen.getByText("Classification method")).toBeInTheDocument();
    expect(screen.queryByText("Edit banding")).not.toBeInTheDocument();
  });

  it("updates zone boundaries line-opacity when the opacity slider changes", async () => {
    const mockSetPaintProperty = jest.fn();
    const mockGetLayer = jest.fn((id) => id === "id" || id === "id-boundaries");
    const mockGetPaintProperty = jest.fn((id, prop) => (prop === "fill-opacity" ? 0.5 : undefined));
    const testMap = {
      getLayer: mockGetLayer,
      getPaintProperty: mockGetPaintProperty,
      setPaintProperty: mockSetPaintProperty,
    };

    const testProps = {
      ...props,
      maps: [testMap],
      layer: {
        id: "id",
        type: "fill",
        layout: { visibility: true },
        metadata: { path: "/", shouldHaveOpacityControl: true },
        switchableBoundaries: true,
      },
    };

    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...testProps} />
        </AppContext.Provider>
      </PageContext.Provider>
    );

    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: "0.3" } });

    expect(mockSetPaintProperty).toHaveBeenCalledWith(
      "id",
      "fill-opacity",
      0.3
    );
    expect(mockSetPaintProperty).toHaveBeenCalledWith(
      "id-boundaries",
      "line-opacity",
      0.3
    );
  });

  it("synchronises zone boundaries line-opacity when toggling boundaries visible", () => {
    const mockSetLayoutProperty = jest.fn();
    const mockSetPaintProperty = jest.fn();
    const mockGetLayer = jest.fn((id) => id === "id" || id === "id-boundaries");
    const mockGetPaintProperty = jest.fn((id, prop) => (prop === "fill-opacity" ? 0.7 : undefined));
    const testMap = {
      style: {},
      getLayer: mockGetLayer,
      getPaintProperty: mockGetPaintProperty,
      setLayoutProperty: mockSetLayoutProperty,
      setPaintProperty: mockSetPaintProperty,
    };

    const testProps = {
      ...props,
      maps: [testMap],
      layer: {
        id: "id",
        type: "fill",
        layout: { visibility: true },
        metadata: { path: "/", shouldHaveOpacityControl: true },
        switchableBoundaries: true,
        boundariesVisibleByDefault: false,
      },
    };

    render(
      <PageContext.Provider value={mockPageContext}>
        <AppContext.Provider value={mockAppContexte}>
          <LayerControlEntry {...testProps} />
        </AppContext.Provider>
      </PageContext.Provider>
    );

    const checkbox = screen.getByRole("checkbox", { name: /show zone boundaries/i });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    expect(mockSetLayoutProperty).toHaveBeenCalledWith(
      "id-boundaries",
      "visibility",
      "visible"
    );
    expect(mockSetPaintProperty).toHaveBeenCalledWith(
      "id-boundaries",
      "line-opacity",
      0.7
    );
  });
});

describe("LayerControlEntry band editor", () => {
  /** A fill-color ramp over the given bins, as MapVisualisation paints it. */
  const colourRamp = (bins) => [
    "interpolate",
    ["linear"],
    ["feature-state", "value"],
    ...bins.flatMap((bin, i) => [bin, `#00000${i}`]),
  ];

  /** A map whose fill-color can be repainted and whose styledata listeners can be fired. */
  const makeLiveMap = (bins) => {
    let fillColour = colourRamp(bins);
    const listeners = new Set();
    return {
      getLayer: jest.fn(() => true),
      getPaintProperty: jest.fn((_id, prop) => (prop === "fill-color" ? fillColour : 0.5)),
      on: jest.fn((event, fn) => event === "styledata" && listeners.add(fn)),
      off: jest.fn((event, fn) => event === "styledata" && listeners.delete(fn)),
      repaint: (newBins) => {
        fillColour = colourRamp(newBins);
        listeners.forEach((fn) => fn());
      },
    };
  };

  const renderEntry = ({
    map,
    layerState = { class_method: "q" },
    data = [{ value: 10 }, { value: 20 }, { value: 30 }],
    style = "polygon-continuous",
    appContext = mockAppContexte,
  }) => {
    const dispatch = jest.fn();
    const state = {
      visualisations: {
        id: {
          id: "id",
          style,
          queryParams: {},
          data,
        },
      },
      layers: { id: layerState },
    };
    render(
      <MapContext.Provider value={{ state, dispatch }}>
        <PageContext.Provider value={mockPageContext}>
          <AppContext.Provider value={appContext}>
            <LayerControlEntry
              {...props}
              handleCustomBandsChange={jest.fn()}
              layer={{
                id: "id",
                type: "fill",
                layout: { visibility: "visible" },
                metadata: { isStylable: true },
              }}
              maps={[map]}
              state={state}
            />
          </AppContext.Provider>
        </PageContext.Provider>
      </MapContext.Provider>
    );
    return { dispatch };
  };

  const bandValues = () =>
    screen.getAllByRole("spinbutton").map((input) => Number(input.value));

  it("shows the bins the map is painted with, and follows a restyle", async () => {
    const map = makeLiveMap([0, 10, 20, 30, 40]);
    renderEntry({ map });

    expect(bandValues()).toEqual([0, 10, 20, 30, 40]);

    act(() => map.repaint([0, 15, 30]));

    await waitFor(() => expect(bandValues()).toEqual([0, 15, 30]));
  });

  it("stops listening for restyles when unmounted", () => {
    const map = makeLiveMap([0, 10, 20]);
    renderEntry({ map });
    cleanup();

    expect(map.off).toHaveBeenCalledWith("styledata", expect.any(Function));
  });

  it("dispatches the new band count, not custom bands, for a non-custom method", () => {
    const map = makeLiveMap([0, 10, 20, 30, 40]);
    const { dispatch } = renderEntry({ map });

    // Two comboboxes: the classification method, then the number of bands.
    const countSelect = screen.getAllByRole("combobox").at(-1);
    fireEvent.change(countSelect, { target: { value: "3" } });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_BAND_COUNT",
      payload: { bandCount: 3, layerName: "id" },
    });
  });

  it("previews the values the method will produce at the new count", () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ value: (i + 1) * 10 }));
    const map = makeLiveMap([0, 10, 20, 30, 40]);
    renderEntry({ map, data });

    fireEvent.change(screen.getAllByRole("combobox").at(-1), { target: { value: "3" } });

    const expected = reclassifyData(
      data,
      "polygon-continuous",
      "q",
      mockAppContexte.defaultBands,
      mockPageContext,
      {},
      { bandCount: 3 }
    );
    expect(expected).toHaveLength(3);
    expect(bandValues()).toEqual(expected);
  });

  it("clears a chosen band count on Reset", () => {
    const map = makeLiveMap([0, 10, 20]);
    const { dispatch } = renderEntry({ map, layerState: { class_method: "q", bandCount: 3 } });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(dispatch).toHaveBeenCalledWith({
      type: "UPDATE_BAND_COUNT",
      payload: { bandCount: null, layerName: "id" },
    });
  });

  const disabledCounts = () =>
    [...screen.getAllByRole("combobox").at(-1).options]
      .filter((option) => option.disabled)
      .map((option) => Number(option.value));

  it("disables counts above what Head/Tail Breaks can give for the data", () => {
    const data = [0, 2, 5, 10, 20, 40, 80, 900, 1000, 1005, 1010].map((value) => ({ value }));
    const natural = reclassifyData(
      data,
      "polygon-continuous",
      "h",
      mockAppContexte.defaultBands,
      mockPageContext,
      {},
      {}
    );
    const map = makeLiveMap(natural);
    renderEntry({ map, data, layerState: { class_method: "h" } });

    expect(natural.length).toBeLessThan(9);
    expect(disabledCounts()).toEqual(
      Array.from({ length: 9 - natural.length }, (_, i) => natural.length + 1 + i)
    );
    expect(screen.getByText(`This method gives at most ${natural.length} bands for this data.`))
      .toBeInTheDocument();
  });

  it("keeps offering all 11 configured Default bands after showing fewer", () => {
    const eleven = [-500, -250, -50, -10, -1, 0, 1, 10, 50, 250, 500];
    const appContext = {
      ...mockAppContexte,
      defaultBands: [
        { name: "pageName", metric: [{ name: "demand", differenceValues: eleven }] },
      ],
    };
    // The map is painted with 7 after choosing 7; the dropdown must still reach 11.
    const map = makeLiveMap([-250, -50, -10, 0, 10, 50, 250]);
    renderEntry({
      map,
      style: "polygon-diverging",
      appContext,
      layerState: { class_method: "d", bandCount: 7, bandMetricName: "demand" },
    });

    const counts = [...screen.getAllByRole("combobox").at(-1).options].map((o) =>
      Number(o.value)
    );
    expect(counts.at(-1)).toBe(11);
  });

  it("disables no counts for methods that can give any count", () => {
    const data = Array.from({ length: 20 }, (_, i) => ({ value: (i + 1) * 10 }));
    renderEntry({ map: makeLiveMap([0, 10, 20, 30, 40]), data });

    expect(disabledCounts()).toEqual([]);
  });
});

