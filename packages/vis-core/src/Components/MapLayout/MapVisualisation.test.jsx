import { MapContext, AppContext } from "contexts";
import { MapVisualisation } from "./MapVisualisation";
import { render, screen } from "@testing-library/react";
import { actionTypes } from "reducers";

jest.mock("hooks", () => ({
  ...jest.requireActual("hooks"),
  useFetchVisualisationData: jest.fn(),
}));
jest.mock("utils", () => ({
  ...jest.requireActual("utils"),
  hasAnyGeometryNotNull: jest.fn(),
  createPaintProperty: jest.fn(),
  reclassifyGeoJSONData: jest.fn(),
  reclassifyData: jest.fn(),
}));
import { useFetchVisualisationData } from "hooks";
import {
  hasAnyGeometryNotNull,
  createPaintProperty,
  reclassifyGeoJSONData,
  reclassifyData,
} from "utils";

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
let mockAppContext = {
  appPages: [
    {
      url: "/",
    },
  ],
};
let mockMapContext = {
  state: {
    visualisations: {
      visualisationName: {
        shouldFilterDataToViewport: true,
        type: "geojson",
        style: "line-continuous",
      },
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
    layers: {
      visualisationName: {},
    },
    colorSchemesByLayer: {
      visualisationName: {},
    },
    leftVisualisations: {
      visualisationName: {},
    },
    rightVisualisations: {
      visualisationName: {},
    },
  },
  dispatch: jest.fn(),
};

let props = {
  visualisationName: "visualisationName",
  map: {
    getLayer: jest.fn(),
    getSource: jest.fn(),
    addSource: jest.fn(),
    getStyle: jest.fn(),
    addLayer: jest.fn(),
    on: jest.fn(),
  },
};

describe("useFetchVisualisationData is called with the good params", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      data: {},
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("useFetchVisualisationData", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );

    expect(useFetchVisualisationData).toHaveBeenCalledWith(
      {
        shouldFilterDataToViewport: true,
        style: "line-continuous",
        type: "geojson",
      },
      {
        getLayer: expect.any(Function),
        getSource: expect.any(Function),
        addSource: expect.any(Function),
        getStyle: expect.any(Function),
        addLayer: expect.any(Function),
        on: expect.any(Function),
      },
      "visualisationName",
      true
    );
  });
});

describe("Check dispatch function is well throw", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      data: null,
      isLoading: true,
      error: false,
      dataWasReturnedButFiltered: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("SET_IS_LOADING", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );

    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_IS_LOADING,
    });
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_DATA_REQUESTED,
      payload: true,
    });
  });

  it("SET_LOADING_FINISHED", () => {
    useFetchVisualisationData.mockReturnValue({
      data: {},
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );

    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_LOADING_FINISHED,
    });
  });
});

describe("Case of no data", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      data: [],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("visualisationData && visualisationData.length === 0) && !dataWasReturnedButFiltered", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_NO_DATA_RETURNED,
      payload: true,
    });
  });

  it("visualisationData || dataWasReturnedButFiltered", () => {
    useFetchVisualisationData.mockReturnValue({
      data: [],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: true,
    });
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_NO_DATA_RETURNED,
      payload: false,
    });
  });

  it("error", () => {
    useFetchVisualisationData.mockReturnValue({
      isLoading: false,
      error: true,
      dataWasReturnedButFiltered: false,
    });
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_NO_DATA_RETURNED,
      payload: true,
    });
  });
});

describe("Updating data with UPDATE_ALL_DATA", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      data: ["firstELement"],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("UPDATE_ALL_DATA", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );
    expect(mockMapContext.dispatch).toHaveBeenCalledWith({
      type: actionTypes.UPDATE_ALL_DATA,
      payload: {
        visualisationName: "visualisationName",
        data: ["firstELement"],
        left: null,
      },
    });
  });
});

describe("Tests of reclassifyAndStyleGeoJSONMap function", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      data: [
        {
          feature_collection: JSON.stringify({
            element: "first",
          }),
        },
      ],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });

    hasAnyGeometryNotNull.mockReturnValue(true);

    reclassifyGeoJSONData.mockReturnValue("#More9Caracters");

    props.map.getStyle.mockReturnValue({ layers: [{ id: "firstLayersID" }] });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Test", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <MapVisualisation {...props} />
      </MapContext.Provider>
    );
    // check the "featureCollection" param of hasAnyGeometryNotNull function
    expect(hasAnyGeometryNotNull).toHaveBeenCalledWith({ element: "first" });
    // check the "style" param of hasAnyGeometryNotNull function
    expect(createPaintProperty).toHaveBeenCalledWith(
      expect.anything(),
      "line-continuous",
      expect.anything(),
      expect.anything(),
      undefined
    );
  });
});

describe("reclassifyAndStyleMap is called", () => {
  beforeEach(() => {
    mockMapContext = {
      ...mockMapContext,
      state: {
        ...mockMapContext.state,
        visualisations: {
          ...mockMapContext.state.visualisations,
          visualisationName: {
            ...mockMapContext.state.visualisations.visualisationName,
            type: "joinDataToMap",
          },
        },
      },
    };
    useFetchVisualisationData.mockReturnValue({
      data: [
        {
          feature_collection: JSON.stringify({
            element: "first",
          }),
        },
      ],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });

    hasAnyGeometryNotNull.mockReturnValue(true);

    reclassifyGeoJSONData.mockReturnValue("#More9Caracters");

    reclassifyData.mockReturnValue("#More9Caracters");

    props.map.getStyle.mockReturnValue({ layers: [{ id: "firstLayersID" }] });
    props.map.getLayer.mockReturnValue(true);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("Test", () => {
    render(
      <AppContext.Provider value={mockAppContext}>
        <MapContext.Provider value={mockMapContext}>
          <MapVisualisation {...props} />
        </MapContext.Provider>
      </AppContext.Provider>
    );
    expect(reclassifyData).toHaveBeenCalledWith(
      [{ feature_collection: '{"element":"first"}' }],
      "line-continuous",
      "d",
      undefined,
      { url: "/" },
      undefined,
      { trseLabel: false }
    );
  });
});

describe("the props left is equal to true", () => {
  beforeEach(() => {
    props = {
      ...props,
      left: true,
    };

    useFetchVisualisationData.mockReturnValue({
      data: [
        {
          feature_collection: JSON.stringify({
            element: "first",
          }),
        },
      ],
      isLoading: false,
      error: false,
      dataWasReturnedButFiltered: false,
    });
  });

  it("Test", () => {
    render(
      <AppContext.Provider value={mockAppContext}>
        <MapContext.Provider value={mockMapContext}>
          <MapVisualisation {...props} />
        </MapContext.Provider>
      </AppContext.Provider>
    );
  });
});
