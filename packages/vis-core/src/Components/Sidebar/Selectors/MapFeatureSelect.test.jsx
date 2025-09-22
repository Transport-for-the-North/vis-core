import { render, screen, waitFor } from "@testing-library/react";
import { BaseMapFeatureSelect } from ".";
import { MapContext } from "contexts";
import userEvent from "@testing-library/user-event";

jest.mock("./FeatureSelect.jsx", () => ({
  FeatureSelect: ({
    layerPath,
    value,
    onChange,
    isMulti,
    placeholder,
    isClearable,
  }) => {
    return (
      <>
        <button
          data-testid="featureSelect-button"
          onClick={() => {
            const mockOptions = ["option1", "option2"];
            onChange(onChange(mockOptions));
          }}
        ></button>
      </>
    );
  },
}));
jest.mock("polished", () => ({
  darken: jest.fn((amount, color) => {
    if (!color) return "#cccccc";
    return color;
  }),
}));
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
const mockState = {
  visualisations: {},
  filters: [],
  layers: {},
  currentZoom: 10,
};

const fakeOnChange = jest.fn();
let props = {
  key: "key",
  filter: {
    layer: { layer: "layer" },
    multiSelect: { multiSelect: "multiSelect" },
  },
  value: "value",
  onChange: fakeOnChange,
  showControls: true,
};

describe("BaseMapFeatureSelect component test", () => {
  beforeEach(() => {
    props = {
      key: "key",
      filter: {
        layer: { layer: "layer" },
        multiSelect: { multiSelect: "multiSelect" },
      },
      value: "value",
      onChange: fakeOnChange,
      showControls: true,
    };
  });

  it("Click on the select, FeatureSelect", async () => {
    render(
      <MapContext.Provider value={{ state: mockState }}>
        <BaseMapFeatureSelect {...props} />
      </MapContext.Provider>
    );
    screen.debug();
    const button = screen.getByTestId("featureSelect-button");
    expect(button).toBeInTheDocument();
    userEvent.click(button);
    expect(fakeOnChange).toHaveBeenCalled();
  });
  it("showControls at false", async () => {
    props = {
      ...props,
      showControls: false,
    };
    render(
      <MapContext.Provider value={{ state: mockState }}>
        <BaseMapFeatureSelect {...props} />
      </MapContext.Provider>
    );
    expect(screen.queryByText("Rectangle Select")).not.toBeInTheDocument();
    expect(screen.queryByText("Pointer Select")).not.toBeInTheDocument();
    expect(screen.queryByText("Enable Selector")).not.toBeInTheDocument();
    expect(screen.queryByText("Enable Selector")).not.toBeInTheDocument();
  });
  it("Click on Pointer Select and Rectangle Select", async () => {
    const propsWithColor = {
      ...props,
      bgColor: "#FF0000",
    };

    render(
      <MapContext.Provider value={{ state: mockState }}>
        <BaseMapFeatureSelect {...propsWithColor} />
      </MapContext.Provider>
    );
    const pointerSelect = screen.getByText("Pointer Select");
    const rectangleSelect = screen.getByText("Rectangle Select");
    const enableButton = screen.getByText("Enable Selector");

    expect(pointerSelect).toBeDisabled();
    expect(rectangleSelect).toBeDisabled();

    await userEvent.click(enableButton);

    expect(screen.getByText("Disable Selector")).toBeInTheDocument();
    expect(pointerSelect).not.toBeDisabled();
    expect(rectangleSelect).not.toBeDisabled();

    expect(pointerSelect).toHaveStyle({
      backgroundColor: "#FF0000",
      color: "white",
    });
    expect(rectangleSelect).toHaveStyle({
      backgroundColor: "white",
      color: "black",
    });

    await userEvent.click(rectangleSelect);

    await waitFor(() => {
      expect(rectangleSelect).toHaveStyle({
        backgroundColor: "#FF0000",
        color: "white",
      });
      expect(pointerSelect).toHaveStyle({
        backgroundColor: "white",
        color: "black",
      });
    });

    await userEvent.click(pointerSelect);

    await waitFor(() => {
      expect(pointerSelect).toHaveStyle({
        backgroundColor: "#FF0000",
        color: "white",
      });
      expect(rectangleSelect).toHaveStyle({
        backgroundColor: "white",
        color: "black",
      });
    });
  });
});
