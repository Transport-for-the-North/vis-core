import { renderHook, act } from "@testing-library/react";
import { useBaseMapTransition } from "./useBaseMapTransition";
import { BASE_MAPS } from "../map/baseMaps";

describe("useBaseMapTransition", () => {
  const createMockMap = (initialStyleLoaded = true) => {
    const listeners = {};
    return {
      setStyle: jest.fn(),
      getStyle: jest.fn(() => ({
        version: 8,
        sources: { openmaptiles: {} },
        layers: [{ id: "place_city", type: "symbol", source: "openmaptiles" }],
      })),
      isStyleLoaded: jest.fn(() => initialStyleLoaded),
      once: jest.fn((event, cb) => {
        listeners[event] = cb;
      }),
      on: jest.fn((event, cb) => {
        listeners[event] = cb;
      }),
      off: jest.fn((event) => {
        delete listeners[event];
      }),
      getLayer: jest.fn((id) => (id === "place_city" ? { id } : null)),
      setPaintProperty: jest.fn(),
      triggerRepaint: jest.fn(),
      __listeners: listeners,
      __fire: (event) => listeners[event]?.(),
    };
  };

  it("does not call setStyle on first render with initial descriptor", () => {
    const map = createMockMap();
    renderHook(() =>
      useBaseMapTransition({
        maps: [map],
        descriptor: BASE_MAPS.positron,
      })
    );

    expect(map.setStyle).not.toHaveBeenCalled();
  });

  it("triggers setStyle on descriptor change for a single map", () => {
    const map = createMockMap();
    let currentDescriptor = BASE_MAPS.positron;

    const { rerender } = renderHook(() =>
      useBaseMapTransition({
        maps: [map],
        descriptor: currentDescriptor,
      })
    );

    expect(map.setStyle).not.toHaveBeenCalled();

    currentDescriptor = BASE_MAPS.darkMatter;
    rerender();

    expect(map.setStyle).toHaveBeenCalledTimes(1);
    expect(map.setStyle).toHaveBeenCalledWith(
      BASE_MAPS.darkMatter.resolveStyle(),
      expect.objectContaining({
        transformStyle: expect.any(Function),
      })
    );
  });

  it("triggers setStyle on both maps in a dual-map setup", () => {
    const leftMap = createMockMap();
    const rightMap = createMockMap();
    let currentDescriptor = BASE_MAPS.positron;

    const { rerender } = renderHook(() =>
      useBaseMapTransition({
        maps: [leftMap, rightMap],
        descriptor: currentDescriptor,
      })
    );

    currentDescriptor = BASE_MAPS.darkMatter;
    rerender();

    expect(leftMap.setStyle).toHaveBeenCalledTimes(1);
    expect(rightMap.setStyle).toHaveBeenCalledTimes(1);
  });

  it("never registers an idle event listener", () => {
    const map = createMockMap();
    let currentDescriptor = BASE_MAPS.positron;

    const { rerender } = renderHook(() =>
      useBaseMapTransition({
        maps: [map],
        descriptor: currentDescriptor,
      })
    );

    currentDescriptor = BASE_MAPS.darkMatter;
    rerender();

    expect(map.once).not.toHaveBeenCalledWith("idle", expect.any(Function));
    expect(map.on).not.toHaveBeenCalledWith("idle", expect.any(Function));
  });

  it("cleans up event handlers on unmount", () => {
    const map = createMockMap();
    let currentDescriptor = BASE_MAPS.positron;

    const { rerender, unmount } = renderHook(() =>
      useBaseMapTransition({
        maps: [map],
        descriptor: currentDescriptor,
      })
    );

    currentDescriptor = BASE_MAPS.darkMatter;
    rerender();

    expect(map.once).toHaveBeenCalledWith("style.load", expect.any(Function));

    unmount();
    expect(map.off).toHaveBeenCalledWith("style.load", expect.any(Function));
  });

  it("ignores stale callbacks during rapid toggles", async () => {
    const map = createMockMap();
    let currentDescriptor = BASE_MAPS.positron;

    const { rerender } = renderHook(() =>
      useBaseMapTransition({
        maps: [map],
        descriptor: currentDescriptor,
      })
    );

    // Rapid toggle 1: dark
    currentDescriptor = BASE_MAPS.darkMatter;
    rerender();
    const staleLoadListener = map.__listeners["style.load"];

    // Rapid toggle 2: light
    currentDescriptor = BASE_MAPS.positron;
    rerender();

    map.triggerRepaint.mockClear();

    // Fire the stale listener from the intermediate toggle
    await act(async () => {
      staleLoadListener?.();
    });

    // The stale listener should not trigger repaints or overrides
    expect(map.triggerRepaint).not.toHaveBeenCalled();
  });
});
