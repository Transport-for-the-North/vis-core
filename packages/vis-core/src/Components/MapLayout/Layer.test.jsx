jest.mock("services", () => ({
  api: {
    geodataService: {
      getLayer: jest.fn().mockResolvedValue({
        type: "FeatureCollection",
        features: [],
      }),
      buildTileLayerUrl: jest
        .fn()
        .mockReturnValue("valueReturnedBy: buildTileLayerUrl"),
    },
  },
}));

import { render, screen, waitFor } from "@testing-library/react";
import { Layer } from "./Layer";
import { MapContext, FilterContext } from "contexts";
import { api } from "services";

const mockMapContext = {
  state: {
    visualisations: {
      calloutCard: {},
      calloutCard1: {},
    },
    map: {},
    maps: [
      {
        getLayer: jest.fn(),
        removeLayer: jest.fn(),
        removeSource: jest.fn(),
        getSource: jest.fn(),
        addSource: jest.fn(),
        addLayer: jest.fn(),
      },
    ],
    paramNameToUuidMap: {
      paramToReplace1: "first",
      paramToReplace2: "second",
    },
  },
  dispatch: jest.fn(),
};
const mockFilterContext = {
  state: {
    filter: {
      first: "first",
    },
    first: "ici",
    second: "la",
  },
};

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

let props = {
  layer: {
    bufferSize: 0,
    geometryType: "polygon",
    isHoverable: true,
    isStylable: true,
    name: "Accessibility",
    path: "/api/vectortiles/zones/5/{z}/{x}/{y}",
    shouldHaveLabel: false,
    shouldHaveTooltipOnHover: true,
    source: "api",
    sourceLayer: "zones",
    // type: "tile",
    uniqueId: "BsipZoneVectorTile",
    visualisationName: "Bus Accessibility",
  },
};

describe("Basic use Layer compoennt with type = 'tile'", () => {
  beforeEach(() => {
    // type = "tile"
    props = {
      ...props,
      layer: {
        ...props.layer,
        type: "tile",
      },
    };
    api.geodataService.buildTileLayerUrl.mockReturnValue("/url");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Basic use", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <Layer {...props} />
      </MapContext.Provider>
    );
    // layer.source = api and layer.type = "tile", so it should call buildTileLayerUrl
    expect(api.geodataService.buildTileLayerUrl).toHaveBeenCalledWith(
      props.layer.path
    );

    expect(mockMapContext.state.maps[0].addSource).toHaveBeenCalledWith(
      props.layer.name,
      {
        type: "vector",
        tiles: ["/url"],
        promoteId: "id",
      }
    );

    // isHoverable = true, test if this part is well throw
    expect(mockMapContext.state.maps[0].addLayer).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: "Accessibility-hover",
        source: "Accessibility",
        "source-layer": "zones",
        type: "line",
        metadata: expect.objectContaining({
          isStylable: false,
        }),
      })
    );

    // last addLayer called when type = "tile"
    expect(mockMapContext.state.maps[0].addLayer).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        id: "Accessibility-select",
        type: "line",
        paint: {
          "line-color": ["case", expect.any(Array), "#f00", "transparent"],
          "line-width": 2,
        },
        source: "Accessibility",
        "source-layer": "zones",
        metadata: { isStylable: false },
      })
    );
  });
});

describe("Basic use Layer compoennt with type = 'geojson'", () => {
  beforeEach(() => {
    // type = "geojson"
    props = {
      ...props,
      layer: {
        ...props.layer,
        type: "geojson",
      },
    };
    api.geodataService.getLayer.mockResolvedValue("getLayer returned");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Basic use", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <Layer {...props} />
      </MapContext.Provider>
    );
    await waitFor(() => {
      expect(mockMapContext.state.maps[0].addSource).toHaveBeenCalledWith(
        props.layer.name,
        { type: "geojson", data: "getLayer returned" }
      );
    });

    await waitFor(() => {
      expect(mockMapContext.state.maps[0].addLayer).toHaveBeenCalledWith({
        id: "Accessibility",
        bufferSize: 0,
        type: "fill",
        source: "Accessibility",
        paint: {
          "fill-color": "rgb(255, 255, 0, 0)",
          "fill-outline-color": "rgba(195, 195, 195, 1)",
          "fill-opacity": 1,
        },
        maxzoom: 24,
        minzoom: 0,
        layout: { visibility: "visible" },
        metadata: {
          isStylable: true,
          defaultOpacity: 0.65,
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}",
          shouldShowInLegend: true,
          shouldHaveOpacityControl: true,
          enforceNoColourSchemeSelector: false,
          enforceNoClassificationMethod: false,
          zoomToFeaturePlaceholderText: "",
        },
      });
    });

    // isHoverable = true, test if this part is well throw
    await waitFor(() => {
      expect(mockMapContext.state.maps[0].addLayer).toHaveBeenCalledWith({
        id: "Accessibility-hover",
        type: "line",
        paint: {
          "line-color": ["case", expect.any(Array), "red", "transparent"],
          "line-width": [
            "interpolate",
            expect.any(Array),
            expect.any(Array),
            5,
            1,
            10,
            2,
            15,
            4,
            20,
            8,
          ],
        },
        source: "Accessibility",
      });
    });

    await waitFor(() => {
      expect(mockMapContext.state.maps[0].addLayer).toHaveBeenCalledWith({
        id: "Accessibility-select",
        type: "line",
        paint: {
          "line-color": ["case", expect.any(Array), "#f00", "transparent"],
          "line-width": 2,
        },
        source: "Accessibility",
      });
    });
  });
});

describe("One missing param in the layer param", () => {
  beforeEach(() => {
    props = {
      ...props,
      layer: {
        ...props.layer,
        missingParams: ["firstMissingParam"],
      },
    };

    mockMapContext.state.maps[0].getLayer.mockReturnValue(true);
    mockMapContext.state.maps[0].getSource.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Basic use", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <Layer {...props} />
      </MapContext.Provider>
    );

    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      props.layer.name
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      `${props.layer.name}-hover`
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      `${props.layer.name}-select`
    );
    expect(mockMapContext.state.maps[0].removeSource).toHaveBeenCalledWith(
      props.layer.name
    );
  });
});

describe("One customTooltip in the layer param", () => {
  beforeEach(() => {
    props = {
      ...props,
      layer: {
        ...props.layer,
        customTooltip: {
          url: "/url",
          htmlTemplate: "<p>ImAParagraph</p>",
        },
      },
    };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Basic use", () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Layer {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_LAYER_TOOLTIP_URL",
      payload: { layerName: "Accessibility", requestUrl: "/url" },
    });
  });

  it("Test without url inside the part layer.customTooltip", () => {
    props = {
      ...props,
      layer: {
        ...props.layer,
        customTooltip: {
          // url: "/url", // <= url is missing
          htmlTemplate: "<p>ImAParagraph</p>",
        },
      },
    };

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Layer {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    expect(mockMapContext.dispatch).not.toHaveBeenCalled();
  });

  it("Param inside the url to replace", () => {
    props = {
      ...props,
      layer: {
        ...props.layer,
        customTooltip: {
          url: "/url-{paramToReplace1}-{paramToReplace2}",
          htmlTemplate: "<p>ImAParagraph</p>",
        },
      },
    };
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <MapContext.Provider value={mockMapContext}>
          <Layer {...props} />
        </MapContext.Provider>
      </FilterContext.Provider>
    );

    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: "UPDATE_LAYER_TOOLTIP_URL",
      payload: { layerName: "Accessibility", requestUrl: "/url-ici-la" }, // first and second replaced
    });
  });
});

describe("Cleanup function to remove layers and sources when the component unmounts", () => {
  beforeEach(() => {
    props = {
      layer: {
        bufferSize: 0,
        geometryType: "polygon",
        isHoverable: true,
        isStylable: true,
        name: "Accessibility",
        path: "/api/vectortiles/zones/5/{z}/{x}/{y}",
        shouldHaveLabel: false,
        shouldHaveTooltipOnHover: true,
        source: "api",
        sourceLayer: "zones",
        type: "tile", // ✅ Définir le type ici
        uniqueId: "BsipZoneVectorTile",
        visualisationName: "Bus Accessibility",
      },
    };
    mockMapContext.state.maps[0].getLayer.mockReturnValue(true);
    mockMapContext.state.maps[0].getSource.mockReturnValue(true);
  });
  it("functions to remove", () => {
    const { unmount } = render(
      <MapContext.Provider value={mockMapContext}>
        <Layer {...props} />
      </MapContext.Provider>
    );

        expect(mockMapContext.state.maps[0].removeSource).not.toHaveBeenCalledWith(
      "selected-feature-source"
    );

    unmount();

    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      props.layer.name
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      `${props.layer.name}-hover`
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      `${props.layer.name}-select`
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      `${props.layer.name}-label`
    );

    expect(mockMapContext.state.maps[0].removeSource).toHaveBeenCalledWith(
      props.layer.name
    );
    expect(mockMapContext.state.maps[0].removeLayer).toHaveBeenCalledWith(
      "selected-feature-layer"
    );
    expect(mockMapContext.state.maps[0].removeSource).toHaveBeenCalledWith(
      "selected-feature-source"
    );
  });
});
