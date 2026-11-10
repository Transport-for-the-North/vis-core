import { queryNearestRenderedFeatures } from "./hoverPicking";

const line = (id) => ({ id, layer: { id: "links", type: "line" } });
const zone = (id) => ({ id, layer: { id: "zones", type: "fill" } });

/**
 * A map whose features each sit a given distance from the pointer: a query returns those within
 * the queried radius, in the order given (top-most first), like MapLibre.
 */
const createMap = (placed, layerTypes = { links: "line", zones: "fill" }) => ({
  getLayer: jest.fn((id) => (layerTypes[id] ? { type: layerTypes[id] } : undefined)),
  queryRenderedFeatures: jest.fn((geometry) => {
    const radius = Array.isArray(geometry[0]) ? (geometry[1][0] - geometry[0][0]) / 2 : 0;
    return placed.filter(({ distance }) => distance <= radius).map(({ feature }) => feature);
  }),
});

const point = { x: 100, y: 50 };

describe("queryNearestRenderedFeatures", () => {
  it("picks the line under the pointer over a twin drawn on top of it within tolerance", () => {
    // The twin is top-most, so a single query of the whole tolerance box would return it first.
    const map = createMap([
      { feature: line("twin"), distance: 2 },
      { feature: line("under-pointer"), distance: 0 },
    ]);

    const features = queryNearestRenderedFeatures(map, point, ["links"], 6);

    expect(features.map((f) => f.id)).toEqual(["under-pointer"]);
    expect(map.queryRenderedFeatures).toHaveBeenCalledTimes(1);
    expect(map.queryRenderedFeatures).toHaveBeenCalledWith([100, 50], { layers: ["links"] });
  });

  it("widens the search step by step until it reaches a line", () => {
    const map = createMap([
      { feature: line("far"), distance: 5.5 },
      { feature: line("near"), distance: 3 },
    ]);

    const features = queryNearestRenderedFeatures(map, point, ["links"], 6);

    expect(features.map((f) => f.id)).toEqual(["near"]);
    expect(map.queryRenderedFeatures).toHaveBeenLastCalledWith(
      [
        [96, 46],
        [104, 54],
      ],
      { layers: ["links"] }
    );
  });

  it("returns nothing when no feature is within tolerance", () => {
    const map = createMap([{ feature: line("far"), distance: 9 }]);
    expect(queryNearestRenderedFeatures(map, point, ["links"], 6)).toEqual([]);
  });

  it("prefers a line within tolerance to the polygon under the pointer", () => {
    const map = createMap([
      { feature: line("link"), distance: 3 },
      { feature: zone("zone"), distance: 0 },
    ]);

    const features = queryNearestRenderedFeatures(map, point, ["links", "zones"], 6);

    expect(features[0].id).toBe("link");
  });

  it("falls back to the polygon under the pointer when no line is within tolerance", () => {
    const map = createMap([{ feature: zone("zone"), distance: 0 }]);

    const features = queryNearestRenderedFeatures(map, point, ["links", "zones"], 6);

    expect(features.map((f) => f.id)).toEqual(["zone"]);
  });

  it("queries polygons only at the pointer", () => {
    const map = createMap([{ feature: zone("neighbour"), distance: 2 }]);

    expect(queryNearestRenderedFeatures(map, point, ["zones"], 6)).toEqual([]);
    expect(map.queryRenderedFeatures).toHaveBeenCalledTimes(1);
    expect(map.queryRenderedFeatures).toHaveBeenCalledWith([100, 50], { layers: ["zones"] });
  });

  it("searches past features the caller will not hover", () => {
    const map = createMap([
      { feature: line("no-data"), distance: 0 },
      { feature: line("with-data"), distance: 3 },
    ]);

    const features = queryNearestRenderedFeatures(
      map,
      point,
      ["links"],
      6,
      (feature) => feature.id !== "no-data"
    );

    expect(features.map((f) => f.id)).toContain("with-data");
  });

  it("keeps the hovered line while the pointer is within the sticky radius, then lets go", () => {
    const isCurrent = (feature) => feature.id === "hovered";

    // Pointer has drifted onto the twin, 1.5px off the hovered line: no flicker.
    const drifted = createMap([
      { feature: line("twin"), distance: 0 },
      { feature: line("hovered"), distance: 1.5 },
    ]);
    expect(
      queryNearestRenderedFeatures(drifted, point, ["links"], 6, undefined, isCurrent).map((f) => f.id)
    ).toEqual(["hovered"]);

    // Pointer is properly on the twin now: the hover moves.
    const moved = createMap([
      { feature: line("twin"), distance: 0 },
      { feature: line("hovered"), distance: 3 },
    ]);
    expect(
      queryNearestRenderedFeatures(moved, point, ["links"], 6, undefined, isCurrent).map((f) => f.id)
    ).toEqual(["twin"]);
  });

  it("queries only the pointer when there is no tolerance", () => {
    const map = createMap([{ feature: line("near"), distance: 1 }]);

    expect(queryNearestRenderedFeatures(map, point, ["links"], 0)).toEqual([]);
    expect(queryNearestRenderedFeatures(map, point, ["links"], NaN)).toEqual([]);
    expect(map.queryRenderedFeatures).toHaveBeenCalledTimes(2);
  });

  it("copes with a map that returns no array", () => {
    const map = { getLayer: () => ({ type: "line" }), queryRenderedFeatures: () => undefined };
    expect(queryNearestRenderedFeatures(map, point, ["links"], 6)).toEqual([]);
  });
});
