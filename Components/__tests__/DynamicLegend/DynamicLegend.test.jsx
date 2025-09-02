import React from "react";
import { render, screen, act } from "@testing-library/react";
import {
  DynamicLegend,
  interpretWidthExpression,
  interpretColorExpression,
} from "../../DynamicLegend/DynamicLegend";
import { MapContext } from "../../../contexts/MapContext.jsx";
import { AppContext, PageContext } from "contexts";
// TODO make sure the tests work ABH 2024/05/23
// TODO fix the last test

// Mock the map object and its methods
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(() => ({
    layers: [
      {
        id: 'water',
        type: 'fill',
        source: 'mapbox',
        'source-layer': 'water',
        paint: {
          'fill-color': '#00ffff',
        },
      },
    ],
  })),
};

// Mock the getStyle method to return a style object with layers
mockMap.getStyle.mockReturnValue({
  layers: [
    {
      id: "test-line-layer",
      type: "line",
      paint: {
        "line-color": "#ff0000",
        "line-width": 5,
      },
      metadata: {
        isStylable: true,
      },
    },
  ],
});

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

describe("interpretWidthExpression", () => {
  it("interprets a simple numeric width expression", () => {
    const expression = 5;
    const result = interpretWidthExpression(expression);
    expect(result).toEqual([{ width: 5 }]);
  });

  it("There is a zoom in the proposals, the return value is a null array.", () => {
    const expression = ["interpolate", ["linear"], ["zoom"], 5, 1, 15, 3];
    const result = interpretWidthExpression(expression, 3);
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

  // TODO : Correct the test
  it.skip("renders legend items based on the map layers paint properties", () => {
    console.log('getStyle returns:', mockMap.getStyle());
    render(
      <MapContext.Provider value={{ state: mockSetState }}>
        <AppContext.Provider value={{ someValue: true }}>
          <PageContext.Provider value={{ someValue: true }}>
            <DynamicLegend map={mockMap} />
          </PageContext.Provider>
        </AppContext.Provider>
      </MapContext.Provider>
    );

    // Simulate a style change event on the map
    act(() => {
      const styleChangeHandler = mockMap.on.mock.calls.find(
        (call) => call[0] === "styledata"
      )[1];
      styleChangeHandler();
    });

    // Check that the legend items are rendered with the correct properties
    expect(screen.getByText("test-line-layer")).toBeInTheDocument();
    expect(screen.getByText("Color: #ff0000")).toBeInTheDocument();
    expect(screen.getByText("Width: 5px")).toBeInTheDocument();
  });

  // Add more tests to cover different scenarios, such as changes to the map's style,
  // different types of paint property expressions, and layers without metadata.isStylable
});
