import { VisualisationManager } from "./VisualisationManager";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MapContext } from "contexts";

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

jest.mock("./CalloutCardVisualisation", () => ({
  CalloutCardVisualisation: ({ visualisationName, cardName, onUpdate }) => {
    return (
      <div data-testid="callout-card-visualisation">
        Mock CalloutCardVisualisation - {visualisationName} - {cardName}
        <button onClick={onUpdate}>button: {cardName}</button>
      </div>
    );
  },
}));

jest.mock("./MapVisualisation", () => ({
  MapVisualisation: ({ visualisationName, map, maps, left }) => {
    return (
      <div data-testid="callout-card-visualisation">
        Mock CalloutCardVisualisation - {visualisationName} -{" "}
        {JSON.stringify(map)} - {JSON.stringify(maps)} - {left}
      </div>
    );
  },
}));

const mockMapContext = {
  state: {
    visualisations: {
      calloutCard: {},
      calloutCard1: {}
    },
  },
};

describe("Test to render a CalloutVisualisationCard", () => {
  const props = {
    visualisationConfigs: {
      calloutCard: {
        type: "calloutCard",
        cardName: "Test Card",
        queryParams: {},
      },
      calloutCard1: {
        type: "calloutCard",
        cardName: "Test Card1",
        queryParams: {},
      },
    },
    map: {},
    maps: {},
  };
  it("classic use", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <VisualisationManager {...props} />
      </MapContext.Provider>
    );
    const cardName = screen.getByText(/calloutCard - Test Card/i);
    const cardName1 = screen.getByText(/calloutCard1 - Test Card1/i);
    expect(cardName).toBeInTheDocument();
    expect(cardName1).toBeInTheDocument();
  });
  it("Clique on the onUpdate button", async () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <VisualisationManager {...props} />
      </MapContext.Provider>
    );
    const onUpdateButton = screen.getByText(/button: Test Card1/);
    userEvent.click(onUpdateButton);
  });
});

describe("Test to render a Map", () => {
  const propsType1 = {
    visualisationConfigs: {
      map: {
        type: "geojson",
        queryParams: {},
      },
    },
    map: {},
    maps: {},
  };
  const propsType2 = {
    visualisationConfigs: {
      map: {
        type: "geojson",
        queryParams: {},
      },
    },
    map: {},
    maps: {},
  };
  it("render a map with the geojson type", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <VisualisationManager {...propsType1} />
      </MapContext.Provider>
    );
    expect(
      screen.getByText(/Mock CalloutCardVisualisation/)
    ).toBeInTheDocument();
  });
  it("render a map with the joinDataToMap type", () => {
    render(
      <MapContext.Provider value={mockMapContext}>
        <VisualisationManager {...propsType2} />
      </MapContext.Provider>
    );
    expect(
      screen.getByText(/Mock CalloutCardVisualisation/)
    ).toBeInTheDocument();
  });
});
