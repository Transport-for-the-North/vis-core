import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MapStyleToggle from "./MapStyleToggle";
import { MapContext } from "contexts";
import { mapStyles } from "defaults";
import { actionTypes } from "reducers";

describe("MapStyleToggle", () => {
  let mapContainer;
  let ctrlGroup;
  let mockMap;
  let mockDispatch;

  beforeEach(() => {
    // Set up DOM mimicking MapLibre control container
    mapContainer = document.createElement("div");
    const ctrlBottomLeft = document.createElement("div");
    ctrlBottomLeft.className = "maplibregl-ctrl-bottom-left";
    ctrlGroup = document.createElement("div");
    ctrlGroup.className = "maplibregl-ctrl maplibregl-ctrl-group";

    // Mock existing navigation controls inside group
    const zoomInBtn = document.createElement("button");
    zoomInBtn.className = "maplibregl-ctrl-zoom-in";
    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.className = "maplibregl-ctrl-zoom-out";
    const compassBtn = document.createElement("button");
    compassBtn.className = "maplibregl-ctrl-compass";

    ctrlGroup.appendChild(zoomInBtn);
    ctrlGroup.appendChild(zoomOutBtn);
    ctrlGroup.appendChild(compassBtn);
    ctrlBottomLeft.appendChild(ctrlGroup);
    mapContainer.appendChild(ctrlBottomLeft);
    document.body.appendChild(mapContainer);

    mockMap = {
      getContainer: jest.fn(() => mapContainer),
    };

    mockDispatch = jest.fn();
    localStorage.clear();
  });

  afterEach(() => {
    mapContainer.remove();
    jest.clearAllMocks();
  });

  it("renders into the existing navigation control group container", () => {
    const mockContext = {
      state: { baseMapId: "positron", mapStyle: mapStyles.geoapifyPositron },
      dispatch: mockDispatch,
    };

    render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    const toggleBtn = screen.getByTestId("map-style-toggle-btn");
    expect(toggleBtn).toBeInTheDocument();
    // Verify it is a child of the existing MapLibre control group
    expect(ctrlGroup.contains(toggleBtn)).toBe(true);
    // Verify it is placed alongside the other buttons
    expect(ctrlGroup.children.length).toBe(4);
    expect(ctrlGroup.lastElementChild).toBe(toggleBtn);
  });

  it("displays switch to dark map title and aria-label in light mode", () => {
    const mockContext = {
      state: { baseMapId: "positron" },
      dispatch: mockDispatch,
    };

    render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    const toggleBtn = screen.getByTestId("map-style-toggle-btn");
    expect(toggleBtn).toHaveAttribute("title", "Switch to Dark map");
    expect(toggleBtn).toHaveAttribute("aria-label", "Switch to Dark map");
  });

  it("displays switch to light map title and aria-label in dark mode", () => {
    const mockContext = {
      state: { baseMapId: "darkMatter" },
      dispatch: mockDispatch,
    };

    render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    const toggleBtn = screen.getByTestId("map-style-toggle-btn");
    expect(toggleBtn).toHaveAttribute("title", "Switch to Light map");
    expect(toggleBtn).toHaveAttribute("aria-label", "Switch to Light map");
  });

  it("dispatches SET_BASE_MAP with dark map id when clicked in light mode", () => {
    const mockContext = {
      state: { baseMapId: "positron" },
      dispatch: mockDispatch,
    };

    render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    const toggleBtn = screen.getByTestId("map-style-toggle-btn");
    fireEvent.click(toggleBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_BASE_MAP,
      payload: "darkMatter",
    });
  });

  it("dispatches SET_BASE_MAP with light map id when clicked in dark mode", () => {
    const mockContext = {
      state: { baseMapId: "darkMatter" },
      dispatch: mockDispatch,
    };

    render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    const toggleBtn = screen.getByTestId("map-style-toggle-btn");
    fireEvent.click(toggleBtn);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: actionTypes.SET_BASE_MAP,
      payload: "positron",
    });
  });

  it("returns null when map is not provided or lacks getContainer", () => {
    const mockContext = {
      state: { baseMapId: "positron", mapStyle: mapStyles.geoapifyPositron },
      dispatch: mockDispatch,
    };

    const { container } = render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={null} />
      </MapContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });

  it("returns null when baseMapId is null (custom unmanaged map style)", () => {
    const mockContext = {
      state: { baseMapId: null, mapStyle: "https://example.com/custom.json" },
      dispatch: mockDispatch,
    };

    const { container } = render(
      <MapContext.Provider value={mockContext}>
        <MapStyleToggle map={mockMap} />
      </MapContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});
