import React from "react";
import { render, screen, act } from "@testing-library/react";
import {
  DynamicLegend,
  interpretWidthExpression,
  interpretColorExpression
} from ".";
import { MapContext } from "../../contexts/MapContext";
import { AppContext, PageContext } from "contexts";

// Mock the map object and its methods
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(() => ({
    layers: [
      {
        id: "water",
        type: "fill",
        source: "mapbox",
        "source-layer": "water",
        paint: {
          "fill-color": "#00ffff",
        },
      },
    ],
  })),
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

beforeEach(() => {
  mockMap.on.mockClear();
  mockMap.off.mockClear();
  mockMap.getStyle.mockClear();
});

describe("interpretWidthExpression", () => {
  it("interprets a simple numeric width expression", () => {
    const expression = 5;
    const result = interpretWidthExpression(expression);
    expect(result.toString()).toEqual([{ width: 5 }].toString());
  });

  it("There is a zoom in the proposals, the return value is a null array.", () => {
    const expression = ["interpolate", ["linear"], ["zoom"], 5, 1, 15, 3];
    const result = interpretWidthExpression(expression);
    expect(result).toEqual([]);
  });

  it("interprets a complex width expression with multiple stops", () => {
    const expression = ["interpolate", ["linear"], ["value"], 5, 1, 15, 3];
    const result = interpretWidthExpression(expression);
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { value: "5", width: 1 },
      { value: "15", width: 3 },
    ]);
  });

  // Add more test cases for different types of width expressions
});

describe("interpretColorExpression", () => {
  it("interprets a simple color string expression", () => {
    const expression = "#ff0000";
    const result = interpretColorExpression(expression);
    expect(result).toEqual([{ color: "#ff0000" }]);
  });

  it("interprets a complex color expression with match", () => {
    const expression = [
      "match",
      ["get", "property"],
      "value1",
      "#ff0000",
      "value2",
      "#00ff00",
      "#000000",
    ];
    const result = interpretColorExpression(expression);
    expect(result).toEqual([
      { value: "value1", color: "#ff0000" },
      { value: "value2", color: "#00ff00" },
    ]);
  });

  // Add more test cases for different types of color expressions
});

describe("DynamicLegend", () => {
  // Mocks
  const mockSetState = {
    filters: [],
    visualisations: [],
    currentZoom: [],
  };

  it("renders legend items based on the map layers paint properties", () => {
    const mockMapWithGetStyle = {
      ...mockMap,
      getStyle: jest.fn(() => ({
        layers: [
          {
            id: "water-layer",
            type: "fill",
            source: "mapbox",
            "source-layer": "water",
            metadata: {
              isStylable: true,
            },
            paint: {
              "fill-color": "#00ffff",
              "line-width": 15
            },
          },
        ],
      })),
    };

    const mockState = {
      ...mockSetState,
      visualisations: {},
      filters: [],
      layers: {},
      currentZoom: 10,
    };

    render(
      <MapContext.Provider value={{ state: mockState }}>
        <AppContext.Provider value={{ defaultBands: [] }}>
          <PageContext.Provider value={{ pageName: "test" }}>
            <DynamicLegend map={mockMapWithGetStyle} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    // Simulate the styledata event
    act(() => {
      const styleChangeHandler = mockMapWithGetStyle.on.mock.calls.find(
        (call) => call[0] === "styledata"
      )[1];
      styleChangeHandler();
    });

    // Check that the caption is displayed with the correct title.
    expect(screen.getByText("water-layer")).toBeInTheDocument();

    // Check that the legend container exists
    const legendContainer = screen.getByText("water-layer").closest("div");
    expect(legendContainer).toBeInTheDocument();
  });

  it("does not render layers with shouldShowInLegend = false", () => {
    const mockMapWithGetStyle = {
      ...mockMap,
      getStyle: jest.fn(() => ({
        layers: [
          {
            id: "network",
            type: "line",
            metadata: {
              isStylable: true,
              shouldShowInLegend: false,
            },
            paint: {
              "line-color": "#00ffff",
              "line-width": 2,
            },
          },
        ],
      })),
    };

    const mockState = {
      ...mockSetState,
      visualisations: {},
      filters: [],
      layers: {},
      currentZoom: 10,
    };

    render(
      <MapContext.Provider value={{ state: mockState }}>
        <AppContext.Provider value={{ defaultBands: [] }}>
          <PageContext.Provider value={{ pageName: "test" }}>
            <DynamicLegend map={mockMapWithGetStyle} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    act(() => {
      const styleChangeHandler = mockMapWithGetStyle.on.mock.calls.find(
        (call) => call[0] === "styledata"
      )[1];
      styleChangeHandler();
    });

    expect(screen.queryByText("network")).not.toBeInTheDocument();
  });

  it("prefers cached categorical colours over the current paint expression", () => {
    const mockMapWithGetStyle = {
      ...mockMap,
      getStyle: jest.fn(() => ({
        layers: [
          {
            id: "zones",
            type: "fill",
            metadata: {
              isStylable: true,
              colorStyle: "categorical",
              legendCacheField: "value",
            },
            paint: {
              "fill-color": [
                "match",
                ["get", "category"],
                "A",
                "#111111",
                "B",
                "#222222",
                "#333333",
              ],
            },
          },
        ],
      })),
    };

    const mockState = {
      ...mockSetState,
      visualisations: {},
      filters: [],
      layers: {},
      currentZoom: 10,
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#ff0000",
          fieldName: "value",
          schemeName: "test",
        },
        "value::b": {
          label: "B",
          colour: "#00ff00",
          fieldName: "value",
          schemeName: "test",
        },
      },
    };

    render(
      <MapContext.Provider value={{ state: mockState }}>
        <AppContext.Provider value={{ defaultBands: [] }}>
          <PageContext.Provider value={{ pageName: "test" }}>
            <DynamicLegend map={mockMapWithGetStyle} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    act(() => {
      const styleChangeHandler = mockMapWithGetStyle.on.mock.calls.find(
        (call) => call[0] === "styledata"
      )[1];
      styleChangeHandler();
    });

    const labelA = screen.getByText("A");
    const labelB = screen.getByText("B");

    expect(window.getComputedStyle(labelA.previousSibling).backgroundColor).toBe("rgb(255, 0, 0)");
    expect(window.getComputedStyle(labelB.previousSibling).backgroundColor).toBe("rgb(0, 255, 0)");
  });

  it("rebuilds categorical legend entries on page-like changes while reusing cached colours", () => {
    const mockMapWithMutableStyle = {
      ...mockMap,
      getStyle: jest.fn(),
    };

    mockMapWithMutableStyle.getStyle.mockReturnValue({
      layers: [
        {
          id: "level-crossings",
          type: "fill",
          metadata: {
            isStylable: true,
            colorStyle: "categorical",
            legendCacheField: "value",
          },
          paint: {
            "fill-color": [
              "match",
              ["get", "category"],
              "A",
              "#abcdef",
              "#333333",
            ],
          },
        },
      ],
    });

    const mockState = {
      ...mockSetState,
      visualisations: {},
      filters: [],
      layers: {},
      currentZoom: 10,
      categoricalLegendCache: {
        "value::a": {
          label: "A",
          colour: "#ff8800",
          fieldName: "value",
          schemeName: "test",
        },
      },
    };

    const { rerender } = render(
      <MapContext.Provider value={{ state: mockState }}>
        <AppContext.Provider value={{ defaultBands: [] }}>
          <PageContext.Provider value={{ pageName: "first-page" }}>
            <DynamicLegend map={mockMapWithMutableStyle} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    act(() => {
      const styleChangeHandler = mockMapWithMutableStyle.on.mock.calls.find(
        (call) => call[0] === "styledata"
      )[1];
      styleChangeHandler();
    });

    mockMapWithMutableStyle.getStyle.mockReturnValue({
      layers: [
        {
          id: "page-two-layer",
          type: "fill",
          metadata: {
            isStylable: true,
            colorStyle: "categorical",
            legendCacheField: "value",
          },
          paint: {
            "fill-color": [
              "match",
              ["get", "category"],
              "A",
              "#123456",
              "#333333",
            ],
          },
        },
      ],
    });

    rerender(
      <MapContext.Provider value={{ state: mockState }}>
        <AppContext.Provider value={{ defaultBands: [] }}>
          <PageContext.Provider value={{ pageName: "second-page" }}>
            <DynamicLegend map={mockMapWithMutableStyle} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    act(() => {
      const styleDataCalls = mockMapWithMutableStyle.on.mock.calls.filter(
        (call) => call[0] === "styledata"
      );
      const styleChangeHandler = styleDataCalls[styleDataCalls.length - 1][1];
      styleChangeHandler();
    });

    expect(screen.getByText("page-two-layer")).toBeInTheDocument();
    expect(window.getComputedStyle(screen.getByText("A").previousSibling).backgroundColor).toBe("rgb(255, 136, 0)");
  });
});
