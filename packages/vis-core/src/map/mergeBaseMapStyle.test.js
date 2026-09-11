import { mergeBaseMapStyle } from "./mergeBaseMapStyle";
import { BASE_MAPS } from "./baseMaps";

describe("mergeBaseMapStyle", () => {
  const previousBaseSourceIds = new Set(["old-base-source"]);

  const previousStyle = {
    sources: {
      "old-base-source": { type: "vector", tiles: ["https://old.tile.url"] },
      "app-source-1": { type: "geojson", data: { type: "FeatureCollection", features: [] } },
      "app-source-2": { type: "vector", tiles: ["https://app.tiles.url"] },
    },
    layers: [
      { id: "old-base-layer", type: "background", source: "old-base-source" },
      { id: "app-fill", type: "fill", source: "app-source-1" },
      { id: "place_markers", type: "symbol", source: "app-source-1" },
      { id: "place_boundaries", type: "line", source: "app-source-2" },
    ],
  };

  const incomingLayout = { "text-field": "{name}", "text-size": 12 };
  const incomingPaint = { "text-color": "#333333" };

  const incomingStyle = {
    version: 8,
    sources: {
      "new-base-source": { type: "vector", tiles: ["https://new.tile.url"] },
    },
    layers: [
      { id: "background", type: "background" },
      { id: "water", type: "fill", source: "new-base-source" },
      {
        id: "place_city",
        type: "symbol",
        source: "new-base-source",
        layout: incomingLayout,
        paint: incomingPaint,
      },
    ],
  };

  it("removes old base sources and preserves application sources", () => {
    const merged = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.positron,
    });

    expect(merged.sources["old-base-source"]).toBeUndefined();
    expect(merged.sources["new-base-source"]).toBeDefined();
    expect(merged.sources["app-source-1"]).toBeDefined();
    expect(merged.sources["app-source-2"]).toBeDefined();
  });

  it("preserves application layers including place_markers and place_boundaries", () => {
    const merged = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.positron,
    });

    const layerIds = merged.layers.map((l) => l.id);
    expect(layerIds).not.toContain("old-base-layer");
    expect(layerIds).toContain("app-fill");
    expect(layerIds).toContain("place_markers");
    expect(layerIds).toContain("place_boundaries");
  });

  it("interleaves labels above application layers when configured with above-application placement", () => {
    const merged = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.darkMatter,
    });

    const layerIds = merged.layers.map((l) => l.id);
    const waterIndex = layerIds.indexOf("water");
    const appFillIndex = layerIds.indexOf("app-fill");
    const placeCityIndex = layerIds.indexOf("place_city");

    expect(waterIndex).toBeLessThan(appFillIndex);
    expect(appFillIndex).toBeLessThan(placeCityIndex);
  });

  it("stacks application layers on top when placement is not above-application", () => {
    const descriptor = {
      ...BASE_MAPS.positron,
      labels: { placement: "standard" },
    };

    const merged = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor,
    });

    const layerIds = merged.layers.map((l) => l.id);
    const placeCityIndex = layerIds.indexOf("place_city");
    const appFillIndex = layerIds.indexOf("app-fill");

    expect(placeCityIndex).toBeLessThan(appFillIndex);
  });

  it("preserves incoming glyph layout by identity", () => {
    const merged = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.darkMatter,
    });

    const placeCity = merged.layers.find((l) => l.id === "place_city");
    expect(placeCity.layout).toBe(incomingLayout);
  });

  it("applies dark label paint overrides and leaves light provider paint unchanged", () => {
    const mergedDark = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.darkMatter,
    });
    const darkCity = mergedDark.layers.find((l) => l.id === "place_city");
    expect(darkCity.paint["text-color"]).toBe("#ffffff");

    const mergedLight = mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.positron,
    });
    const lightCity = mergedLight.layers.find((l) => l.id === "place_city");
    expect(lightCity.paint).toBe(incomingPaint);
  });

  it("does not mutate inputs", () => {
    const prevSourcesCount = Object.keys(previousStyle.sources).length;
    const prevLayersCount = previousStyle.layers.length;
    const inSourcesCount = Object.keys(incomingStyle.sources).length;
    const inLayersCount = incomingStyle.layers.length;

    mergeBaseMapStyle({
      previousStyle,
      incomingStyle,
      previousBaseSourceIds,
      descriptor: BASE_MAPS.darkMatter,
    });

    expect(Object.keys(previousStyle.sources).length).toBe(prevSourcesCount);
    expect(previousStyle.layers.length).toBe(prevLayersCount);
    expect(Object.keys(incomingStyle.sources).length).toBe(inSourcesCount);
    expect(incomingStyle.layers.length).toBe(inLayersCount);
  });
});
