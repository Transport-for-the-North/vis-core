import chroma from "chroma-js";
import {
  HOVER_COLOURS,
  SELECTED_COLOURS,
  addHoverLayers,
  applyHoverTheme,
  buildHoverGeometryPaint,
  getHoverLayerSpecs,
  offsetNumericExpression,
  removeHoverLayers,
  syncHoverLayers,
} from "./hoverStyle";
import { getHoverLayerStyle, getSelectedLayerStyle } from "../utils/map";

const WHEN_HOVERED = ["case", ["boolean", ["feature-state", "hover"], false], 1, 0];

/** A minimal stand-in for a MapLibre map that stores layers and their paint. */
const createMap = (layers = {}) => {
  const store = { ...layers };
  return {
    store,
    getLayer: jest.fn((id) => store[id]),
    addLayer: jest.fn((layer) => {
      store[layer.id] = layer;
    }),
    removeLayer: jest.fn((id) => {
      delete store[id];
    }),
    getPaintProperty: jest.fn((id, prop) => store[id]?.paint?.[prop]),
    setPaintProperty: jest.fn((id, prop, value) => {
      store[id].paint = { ...store[id].paint, [prop]: value };
    }),
  };
};

describe("hover colours", () => {
  it.each(["light", "dark"])("pairs two strongly contrasting tones on the %s theme", (theme) => {
    const { core, halo } = HOVER_COLOURS[theme];
    expect(chroma.contrast(core, halo)).toBeGreaterThanOrEqual(7);
  });

  it("puts the tone that contrasts with the base map on the outside", () => {
    expect(chroma(HOVER_COLOURS.light.core).luminance()).toBeLessThan(0.1);
    expect(chroma(HOVER_COLOURS.dark.core).luminance()).toBeGreaterThan(0.9);
  });

  it("does not reuse the red that marks a selected feature", () => {
    ["light", "dark"].forEach((theme) => {
      const selectedColour = SELECTED_COLOURS[theme].core;
      expect(chroma.deltaE(HOVER_COLOURS[theme].core, selectedColour)).toBeGreaterThan(25);
    });
  });
});

describe("selection highlight", () => {
  it.each(["light", "dark"])("pairs the selection red with a contrasting halo on the %s theme", (theme) => {
    const { core, halo } = SELECTED_COLOURS[theme];
    expect(chroma.contrast(core, halo)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(["polygon", "line", "point"])("draws a selected %s exactly like a hovered one, bar colour and state", (type) => {
    const basePaint = { "line-width": 4, "line-offset": -3, "circle-radius": 6 };
    const hover = getHoverLayerSpecs(type, { basePaint });
    const selected = getHoverLayerSpecs(type, { basePaint, kind: "selected" });
    const shape = ({ layer }) => {
      const { "line-color": a, "circle-stroke-color": b, "line-opacity": c, "circle-stroke-opacity": d, ...rest } = layer.paint;
      return { type: layer.type, layout: layer.layout, paint: rest };
    };

    expect(selected.map((spec) => spec.suffix)).toEqual(["-select-halo", "-select"]);
    expect(selected.map(shape)).toEqual(hover.map(shape));
    const opacityProp = type === "point" ? "circle-stroke-opacity" : "line-opacity";
    selected.forEach(({ layer }) => {
      expect(layer.paint[opacityProp]).toEqual([
        "case", ["boolean", ["feature-state", "selected"], false], 1, 0,
      ]);
    });
  });

  it("is what getSelectedLayerStyle returns, for layer and geometry type names alike", () => {
    expect(getSelectedLayerStyle("fill").paint["line-color"]).toBe(SELECTED_COLOURS.light.core);
    expect(getSelectedLayerStyle("polygon").paint["line-color"]).toBe(SELECTED_COLOURS.light.core);
    expect(getSelectedLayerStyle("circle").paint["circle-stroke-color"]).toBe(SELECTED_COLOURS.light.core);
    expect(getSelectedLayerStyle("symbol").layout["icon-image"]).toEqual([
      "concat", ["get", "icon_name"], "-select",
    ]);
  });

  it("keeps the selection sized and themed alongside the hover", () => {
    const map = createMap({
      stations: { type: "circle", paint: { "circle-radius": 6, "circle-stroke-width": 2 } },
      "stations-hover": { type: "circle", paint: {} },
      "stations-select-halo": { type: "circle", paint: {} },
      "stations-select": { type: "circle", paint: {} },
    });

    syncHoverLayers(map, "stations");
    applyHoverTheme(map, "stations", "dark");

    expect(map.store["stations-select-halo"].paint).toEqual({
      "circle-radius": 8,
      "circle-stroke-color": SELECTED_COLOURS.dark.halo,
    });
    expect(map.store["stations-select"].paint).toEqual({
      "circle-radius": 9.5,
      "circle-stroke-color": SELECTED_COLOURS.dark.core,
    });
  });

  it("is removed with the hover layers", () => {
    const map = createMap({ "zones-hover": {}, "zones-select-halo": {}, "zones-select": {} });
    removeHoverLayers(map, "zones");
    expect(Object.keys(map.store)).toEqual([]);
  });
});

describe("offsetNumericExpression", () => {
  it("adds to a constant", () => {
    expect(offsetNumericExpression(3, 2)).toBe(5);
  });

  it("adds to each output of a zoom interpolation, which cannot be nested", () => {
    expect(
      offsetNumericExpression(["interpolate", ["linear"], ["zoom"], 0, 2, 12, 8], 1.5)
    ).toEqual(["interpolate", ["linear"], ["zoom"], 0, 3.5, 12, 9.5]);
  });

  it("adds to each output of a zoom step", () => {
    expect(offsetNumericExpression(["step", ["zoom"], 1, 10, 4], 2)).toEqual([
      "step",
      ["zoom"],
      3,
      10,
      6,
    ]);
  });

  it("wraps a data-driven expression", () => {
    const width = ["interpolate", ["linear"], ["feature-state", "value"], 0, 1, 100, 8];
    expect(offsetNumericExpression(width, 3)).toEqual(["+", width, 3]);
  });

  it("returns null for values it cannot offset", () => {
    expect(offsetNumericExpression(undefined, 1)).toBeNull();
    expect(offsetNumericExpression({ stops: [[0, 1]] }, 1)).toBeNull();
    expect(offsetNumericExpression(NaN, 1)).toBeNull();
  });
});

describe("getHoverLayerSpecs", () => {
  it.each(["polygon", "line", "point"])("draws %s highlights as a halo under a core", (type) => {
    const specs = getHoverLayerSpecs(type);
    expect(specs.map((spec) => spec.suffix)).toEqual(["-hover-halo", "-hover"]);
  });

  it.each([
    ["polygon", "line-opacity"],
    ["line", "line-opacity"],
    ["point", "circle-stroke-opacity"],
  ])("only shows the %s highlight on the hovered feature", (type, opacityProp) => {
    getHoverLayerSpecs(type).forEach(({ layer }) => {
      expect(layer.paint[opacityProp]).toEqual(WHEN_HOVERED);
    });
  });

  it("uses the theme's colours", () => {
    const [halo, core] = getHoverLayerSpecs("polygon", { theme: "dark" });
    expect(halo.layer.paint["line-color"]).toBe(HOVER_COLOURS.dark.halo);
    expect(core.layer.paint["line-color"]).toBe(HOVER_COLOURS.dark.core);
  });

  it("leaves the inside of a point visible", () => {
    getHoverLayerSpecs("point").forEach(({ layer }) => {
      expect(layer.paint["circle-opacity"]).toBe(0);
    });
  });

  it("cases a centred line either side instead of covering it", () => {
    const [halo, core] = getHoverLayerSpecs("line", { basePaint: { "line-width": 4 } });
    expect(halo.layer.paint).toMatchObject({ "line-gap-width": 4, "line-width": 1.5, "line-offset": 0 });
    expect(core.layer.paint).toMatchObject({ "line-gap-width": 7, "line-width": 2.5, "line-offset": 0 });
  });

  it.each([
    [-3, -7.5],
    [3, 7.5],
  ])("keeps the band on the outer side of a line offset by %d, clear of its twin", (offset, coreOffset) => {
    const [halo, core] = getHoverLayerSpecs("line", {
      basePaint: { "line-width": 4, "line-offset": offset },
    });
    // A hairline on both edges: narrow enough to sit in the gap between the twins.
    expect(halo.layer.paint).toMatchObject({
      "line-gap-width": 4,
      "line-width": 1,
      "line-offset": offset,
    });
    // The band runs beyond the outer edge only: 2 (half width) + 1 (hairline) + 1.5 (half band).
    expect(core.layer.paint).toMatchObject({
      "line-gap-width": 0,
      "line-width": 3,
      "line-offset": coreOffset,
    });
  });

  it("falls back to a two-sided casing when a zoom expression rules out offset arithmetic", () => {
    const offset = ["interpolate", ["linear"], ["zoom"], 5, -2, 15, -8];
    const [halo, core] = getHoverLayerSpecs("line", {
      basePaint: { "line-width": 4, "line-offset": offset },
    });
    expect(halo.layer.paint["line-offset"]).toEqual(offset);
    expect(core.layer.paint).toMatchObject({ "line-gap-width": 7, "line-offset": offset });
  });

  it("swaps image markers to their hover image", () => {
    const [symbol] = getHoverLayerSpecs("symbol");
    expect(symbol.suffix).toBe("-hover");
    expect(symbol.layer.layout["icon-image"]).toEqual(["concat", ["get", "icon_name"], "-hover"]);
  });

  it("returns nothing for an unknown geometry type", () => {
    expect(getHoverLayerSpecs("raster")).toEqual([]);
  });
});

describe("buildHoverGeometryPaint", () => {
  it("rings a point outside its own radius and stroke", () => {
    const { halo, core } = buildHoverGeometryPaint("point", {
      "circle-radius": 6,
      "circle-stroke-width": 2,
    });
    expect(halo["circle-radius"]).toBe(8);
    expect(core["circle-radius"]).toBe(9.5);
  });

  it("falls back to MapLibre's defaults when the base layer sets nothing", () => {
    expect(buildHoverGeometryPaint("line").halo).toEqual({
      "line-gap-width": 1,
      "line-width": 1.5,
      "line-offset": 0,
    });
    expect(buildHoverGeometryPaint("point").halo).toEqual({ "circle-radius": 6 });
  });
});

describe("getHoverLayerStyle (legacy single-layer accessor)", () => {
  it("returns the core hover layer", () => {
    const style = getHoverLayerStyle("polygon");
    expect(style.type).toBe("line");
    expect(style.paint["line-color"]).toBe(HOVER_COLOURS.light.core);
  });

  it("returns an empty object for an unknown geometry type", () => {
    expect(getHoverLayerStyle("raster")).toEqual({});
  });
});

describe("addHoverLayers / removeHoverLayers", () => {
  it("adds both layers on the base layer's source", () => {
    const map = createMap();
    addHoverLayers(map, {
      baseLayerId: "links",
      geometryType: "line",
      source: "links",
      sourceLayer: "geometry",
      theme: "dark",
    });

    expect(map.addLayer.mock.calls.map(([layer]) => layer.id)).toEqual([
      "links-hover-halo",
      "links-hover",
    ]);
    map.addLayer.mock.calls.forEach(([layer]) => {
      expect(layer).toMatchObject({
        source: "links",
        "source-layer": "geometry",
        metadata: { isStylable: false },
      });
    });
  });

  it("omits source-layer for GeoJSON sources", () => {
    const map = createMap();
    addHoverLayers(map, { baseLayerId: "zones", geometryType: "polygon", source: "zones" });
    map.addLayer.mock.calls.forEach(([layer]) => {
      expect(layer).not.toHaveProperty("source-layer");
    });
  });

  it("does not add a layer twice", () => {
    const map = createMap({ "zones-hover-halo": {}, "zones-hover": {} });
    addHoverLayers(map, { baseLayerId: "zones", geometryType: "polygon", source: "zones" });
    expect(map.addLayer).not.toHaveBeenCalled();
  });

  it("removes whichever highlight layers exist", () => {
    const map = createMap({ "zones-hover": {} });
    removeHoverLayers(map, "zones");
    expect(map.removeLayer).toHaveBeenCalledTimes(1);
    expect(map.removeLayer).toHaveBeenCalledWith("zones-hover");
  });
});

describe("syncHoverLayers", () => {
  it("follows a line's live, data-driven width and offset", () => {
    const width = ["interpolate", ["linear"], ["feature-state", "value"], 0, 1, 100, 17];
    const offset = ["interpolate", ["linear"], ["feature-state", "valueAbs"], 0, -1.25, 100, -9.25];
    const map = createMap({
      links: { type: "line", paint: { "line-width": width, "line-offset": offset } },
      "links-hover-halo": { type: "line", paint: {} },
      "links-hover": { type: "line", paint: {} },
    });

    syncHoverLayers(map, "links");

    expect(map.store["links-hover-halo"].paint).toEqual({
      "line-gap-width": width,
      "line-width": 1,
      "line-offset": offset,
    });
    expect(map.store["links-hover"].paint).toEqual({
      "line-gap-width": 0,
      "line-width": 3,
      "line-offset": [
        "+",
        offset,
        ["*", ["case", ["<", offset, 0], -1, 1], ["+", ["*", width, 0.5], 2.5]],
      ],
    });
  });

  it("follows a point's live radius, including spider overlays", () => {
    const radius = ["interpolate", ["linear"], ["zoom"], 0, 2, 12, 8];
    const map = createMap({
      "stations-spider": {
        type: "circle",
        paint: { "circle-radius": radius, "circle-stroke-width": 1 },
      },
      "stations-spider-hover-halo": { type: "circle", paint: {} },
      "stations-spider-hover": { type: "circle", paint: {} },
    });

    syncHoverLayers(map, "stations-spider");

    expect(map.store["stations-spider-hover-halo"].paint["circle-radius"]).toEqual([
      "interpolate", ["linear"], ["zoom"], 0, 3, 12, 9,
    ]);
    expect(map.store["stations-spider-hover"].paint["circle-radius"]).toEqual([
      "interpolate", ["linear"], ["zoom"], 0, 4.5, 12, 10.5,
    ]);
  });

  it("leaves polygon outlines alone", () => {
    const map = createMap({
      zones: { type: "fill", paint: {} },
      "zones-hover-halo": { type: "line", paint: {} },
      "zones-hover": { type: "line", paint: {} },
    });
    syncHoverLayers(map, "zones");
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });

  it("does nothing for a layer without a highlight", () => {
    const map = createMap({ links: { type: "line", paint: {} } });
    expect(() => syncHoverLayers(map, "links")).not.toThrow();
    expect(() => syncHoverLayers(null, "links")).not.toThrow();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });
});

describe("applyHoverTheme", () => {
  it("recolours line and circle highlights", () => {
    const map = createMap({
      "zones-hover-halo": { type: "line", paint: {} },
      "zones-hover": { type: "line", paint: {} },
      "stations-hover-halo": { type: "circle", paint: {} },
      "stations-hover": { type: "circle", paint: {} },
    });

    applyHoverTheme(map, "zones", "dark");
    applyHoverTheme(map, "stations", "dark");

    expect(map.store["zones-hover-halo"].paint["line-color"]).toBe(HOVER_COLOURS.dark.halo);
    expect(map.store["zones-hover"].paint["line-color"]).toBe(HOVER_COLOURS.dark.core);
    expect(map.store["stations-hover-halo"].paint["circle-stroke-color"]).toBe(
      HOVER_COLOURS.dark.halo
    );
    expect(map.store["stations-hover"].paint["circle-stroke-color"]).toBe(HOVER_COLOURS.dark.core);
  });

  it("ignores layers that are not on the map", () => {
    const map = createMap();
    expect(() => applyHoverTheme(map, "missing", "dark")).not.toThrow();
    expect(map.setPaintProperty).not.toHaveBeenCalled();
  });
});
