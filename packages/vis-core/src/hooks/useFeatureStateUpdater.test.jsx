import { act, renderHook } from "@testing-library/react";

import { useFeatureStateUpdater } from "./useFeatureStateUpdater";

const makeMap = () => ({
  isStyleLoaded: jest.fn(() => true),
  getLayer: jest.fn(() => ({ id: "layer-a", type: "fill", metadata: {} })),
  setFeatureState: jest.fn(),
  removeFeatureState: jest.fn(),
  setPaintProperty: jest.fn(),
  getPaintProperty: jest.fn(),
  setFilter: jest.fn(),
  triggerRepaint: jest.fn(),
});

const layers = {
  layerKey: {
    id: "layer-id",
    name: "layer-a",
    sourceLayer: "source-layer-a",
    isStylable: true,
    preserveBaseStyle: true,
  },
};

describe("useFeatureStateUpdater replayLayerState", () => {
  it("replays cached values, reconstructs valueAbs, and restores filters without redundant repaint", () => {
    const map = makeMap();
    const { result } = renderHook(() => useFeatureStateUpdater());

    act(() => {
      result.current.addFeaturesToMap(
        map,
        null,
        layers,
        [
          { id: 1, value: -3 },
          { id: 2, value: 4 },
        ],
        "continuous",
        "layerKey"
      );
    });

    map.setFeatureState.mockClear();
    map.setFilter.mockClear();
    map.setPaintProperty.mockClear();
    map.triggerRepaint.mockClear();

    const replayed = result.current.replayLayerState(map, layers, "layerKey");

    expect(replayed).toBe(true);
    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: "layer-a", sourceLayer: "source-layer-a", id: 1 },
      { value: -3, valueAbs: 3 }
    );
    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: "layer-a", sourceLayer: "source-layer-a", id: 2 },
      { value: 4, valueAbs: 4 }
    );
    expect(map.setFilter).toHaveBeenCalledWith("layer-a", [
      "in",
      ["get", "id"],
      ["literal", [1, 2]],
    ]);
    expect(map.setPaintProperty).not.toHaveBeenCalled();
    expect(map.triggerRepaint).not.toHaveBeenCalled();
  });

  it("fails safely when the layer is missing or no cached state exists", () => {
    const map = makeMap();
    const { result } = renderHook(() => useFeatureStateUpdater());

    expect(result.current.replayLayerState(map, layers, "layerKey")).toBe(false);

    act(() => {
      result.current.addFeaturesToMap(
        map,
        null,
        layers,
        [{ id: 1, value: 3 }],
        "continuous",
        "layerKey"
      );
    });

    map.getLayer.mockReturnValueOnce(null);

    expect(result.current.replayLayerState(map, layers, "layerKey")).toBe(false);
  });

  it("resolves canonical sourceId or mapSourceId when available", () => {
    const map = makeMap();
    const { result } = renderHook(() => useFeatureStateUpdater());

    const layersWithSourceId = {
      layerKey: {
        id: "layer-id",
        name: "layer-a",
        sourceId: "custom-source-id",
        sourceLayer: "source-layer-a",
        isStylable: true,
      },
    };

    act(() => {
      result.current.addFeaturesToMap(
        map,
        null,
        layersWithSourceId,
        [{ id: 10, value: 5 }],
        "continuous",
        "layerKey"
      );
    });

    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: "custom-source-id", sourceLayer: "source-layer-a", id: 10 },
      { value: 5, valueAbs: 5 }
    );

    map.setFeatureState.mockClear();

    const replayed = result.current.replayLayerState(map, layersWithSourceId, "layerKey");
    expect(replayed).toBe(true);
    expect(map.setFeatureState).toHaveBeenCalledWith(
      { source: "custom-source-id", sourceLayer: "source-layer-a", id: 10 },
      { value: 5, valueAbs: 5 }
    );
  });
});
