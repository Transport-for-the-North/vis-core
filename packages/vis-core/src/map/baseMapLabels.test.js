import {
  POSITRON_BASE_MAP,
  applyLabelPolicyToMap,
  applyLightBaseLabels,
  getLabelPaintOverride,
  isPositronStyleUrl,
} from "./baseMapLabels";
import { getInitialBaseSources } from "./baseSources";

const createMap = (layers, sources = { openmaptiles: { type: "vector" } }) => {
  const paint = {};
  const map = {
    getStyle: () => ({ layers, sources }),
    getLayer: (id) => layers.find((layer) => layer.id === id),
    setPaintProperty: (id, property, value) => {
      paint[id] = { ...paint[id], [property]: value };
    },
    paint,
  };
  return map;
};

describe("light base-map labels", () => {
  describe("isPositronStyleUrl", () => {
    it("matches the Geoapify Positron style URL", () => {
      expect(
        isPositronStyleUrl(
          "https://maps.geoapify.com/v1/styles/positron/style.json?apiKey=token"
        )
      ).toBe(true);
    });

    it("does not match other style URLs or style objects", () => {
      expect(isPositronStyleUrl("https://tiles.openfreemap.org/styles/dark")).toBe(false);
      expect(isPositronStyleUrl({ version: 8, layers: [] })).toBe(false);
      expect(isPositronStyleUrl(undefined)).toBe(false);
    });
  });

  describe("getLabelPaintOverride", () => {
    it("returns dark text and a white halo for Positron place labels", () => {
      expect(getLabelPaintOverride(POSITRON_BASE_MAP, "place_village")).toEqual({
        "text-color": "#1f1f1f",
        "text-halo-color": "rgba(255, 255, 255, 0.9)",
        "text-halo-width": 1.25,
        "text-halo-blur": 0.5,
      });
      expect(getLabelPaintOverride(POSITRON_BASE_MAP, "place_city")["text-halo-width"]).toBe(1.5);
      expect(getLabelPaintOverride(POSITRON_BASE_MAP, "place_city_large")["text-halo-width"]).toBe(1.5);
      expect(getLabelPaintOverride(POSITRON_BASE_MAP, "place_capital")["text-halo-width"]).toBe(1.5);
    });

    it("returns null when paint policy is provider", () => {
      expect(
        getLabelPaintOverride(
          { labels: { paint: "provider" } },
          "place_city"
        )
      ).toBeNull();
    });
  });

  describe("applyLabelPolicyToMap", () => {
    it("paints basemap place labels and leaves application layers unchanged", () => {
      const map = createMap([
        { id: "background", type: "background" },
        { id: "place_town", type: "symbol", source: "openmaptiles" },
        { id: "place_city", type: "symbol", source: "openmaptiles" },
        { id: "place_markers", type: "symbol", source: "app-source" },
      ]);

      applyLabelPolicyToMap({
        map,
        descriptor: POSITRON_BASE_MAP,
        baseSourceIds: new Set(["openmaptiles"]),
      });

      expect(map.paint.place_town).toEqual({
        "text-color": "#1f1f1f",
        "text-halo-color": "rgba(255, 255, 255, 0.9)",
        "text-halo-width": 1.25,
        "text-halo-blur": 0.5,
      });
      expect(map.paint.place_city["text-halo-width"]).toBe(1.5);
      expect(map.paint.place_city["text-color"]).toBe("#1f1f1f");
      expect(map.paint.background).toBeUndefined();
      expect(map.paint.place_markers).toBeUndefined();
    });
  });

  describe("applyLightBaseLabels", () => {
    it("snapshots base sources before application sources exist and paints place labels", () => {
      const layers = [
        { id: "place_town", type: "symbol", source: "openmaptiles" },
      ];
      const map = createMap(layers, { openmaptiles: { type: "vector" } });

      applyLightBaseLabels(map);

      expect(getInitialBaseSources(map)).toEqual(new Set(["openmaptiles"]));
      expect(map.paint.place_town["text-color"]).toBe("#1f1f1f");

      map.getStyle = () => ({
        layers: [
          ...layers,
          { id: "place_custom", type: "symbol", source: "app-source" },
        ],
        sources: {
          openmaptiles: { type: "vector" },
          "app-source": { type: "geojson" },
        },
      });

      applyLightBaseLabels(map);

      expect(getInitialBaseSources(map)).toEqual(new Set(["openmaptiles"]));
      expect(map.paint.place_custom).toBeUndefined();
    });
  });
});
