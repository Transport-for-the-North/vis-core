import {
  isBaseLabelLayer,
  getLabelPaintOverride,
  applyLabelPolicyToStyle,
  applyLabelPolicyToMap,
} from "./baseMapLabels";
import { BASE_MAPS } from "./baseMaps";

describe("baseMapLabels", () => {
  const baseSourceIds = new Set(["openmaptiles", "default"]);

  describe("isBaseLabelLayer", () => {
    it("returns false if layer is not a symbol layer", () => {
      const layer = { id: "place_city", type: "fill", source: "openmaptiles" };
      expect(isBaseLabelLayer({ layer, descriptor: BASE_MAPS.darkMatter, baseSourceIds })).toBe(false);
    });

    it("returns false if layer does not belong to a base source", () => {
      const layer = { id: "place_city", type: "symbol", source: "app-custom-source" };
      expect(isBaseLabelLayer({ layer, descriptor: BASE_MAPS.darkMatter, baseSourceIds })).toBe(false);
    });

    it("does not target application place_* layers on application sources", () => {
      const appLayer = { id: "place_town_boundary", type: "symbol", source: "app-data" };
      expect(isBaseLabelLayer({ layer: appLayer, descriptor: BASE_MAPS.darkMatter, baseSourceIds })).toBe(false);
    });

    it("matches layers using descriptor layerIds and layerPrefixes", () => {
      const descriptorWithIds = {
        labels: {
          layerIds: ["city_label"],
          layerPrefixes: ["place_"],
        },
      };
      const matchedById = { id: "city_label", type: "symbol", source: "openmaptiles" };
      expect(isBaseLabelLayer({ layer: matchedById, descriptor: descriptorWithIds, baseSourceIds })).toBe(true);

      const matchedByPrefix = { id: "place_hamlet", type: "symbol", source: "openmaptiles" };
      expect(isBaseLabelLayer({ layer: matchedByPrefix, descriptor: BASE_MAPS.darkMatter, baseSourceIds })).toBe(true);
    });

    it("supports custom matcher function", () => {
      const descriptor = {
        labels: {
          matches: (layer) => layer.id === "custom_poi",
        },
      };
      const layer = { id: "custom_poi", type: "symbol", source: "openmaptiles" };
      expect(isBaseLabelLayer({ layer, descriptor, baseSourceIds })).toBe(true);
    });

    it("does not match unknown layer names", () => {
      const unknownLayer = { id: "water_pattern", type: "symbol", source: "openmaptiles" };
      expect(isBaseLabelLayer({ layer: unknownLayer, descriptor: BASE_MAPS.darkMatter, baseSourceIds })).toBe(false);
    });
  });

  describe("getLabelPaintOverride", () => {
    it("returns null when paint policy is 'provider'", () => {
      expect(getLabelPaintOverride(BASE_MAPS.positron, "place_city")).toBeNull();
    });

    it("returns paint overrides including byLayerId specifics for darkMatter", () => {
      const defaultOverride = getLabelPaintOverride(BASE_MAPS.darkMatter, "place_village");
      expect(defaultOverride).toEqual(
        expect.objectContaining({
          "text-color": "#ffffff",
          "text-halo-color": "rgba(0, 0, 0, 0.85)",
          "text-halo-width": 1.25,
          "text-halo-blur": 0.5,
        })
      );

      const cityOverride = getLabelPaintOverride(BASE_MAPS.darkMatter, "place_city");
      expect(cityOverride["text-halo-width"]).toBe(1.5);
    });
  });

  describe("applyLabelPolicyToStyle", () => {
    it("preserves layout object identity and leaves paint unchanged for provider policy", () => {
      const layoutObj = { "text-field": "{name}", "text-size": 12 };
      const originalPaint = { "text-color": "#333333" };
      const incomingStyle = {
        layers: [
          {
            id: "place_city",
            type: "symbol",
            source: "openmaptiles",
            layout: layoutObj,
            paint: originalPaint,
          },
        ],
      };

      const result = applyLabelPolicyToStyle({
        style: incomingStyle,
        descriptor: BASE_MAPS.positron,
        baseSourceIds,
      });

      expect(result[0].layout).toBe(layoutObj);
      expect(result[0].paint).toBe(originalPaint);
    });

    it("applies dark paint overrides while preserving layout object identity", () => {
      const layoutObj = { "text-field": "{name}", "text-size": 14 };
      const incomingStyle = {
        layers: [
          {
            id: "place_city",
            type: "symbol",
            source: "openmaptiles",
            layout: layoutObj,
            paint: { "text-color": "#000000" },
          },
        ],
      };

      const result = applyLabelPolicyToStyle({
        style: incomingStyle,
        descriptor: BASE_MAPS.darkMatter,
        baseSourceIds,
      });

      expect(result[0].layout).toBe(layoutObj);
      expect(result[0].paint["text-color"]).toBe("#ffffff");
      expect(result[0].paint["text-halo-width"]).toBe(1.5);
    });
  });

  describe("applyLabelPolicyToMap", () => {
    it("applies paint overrides to map instance", () => {
      const setPaintProperty = jest.fn();
      const map = {
        getStyle: () => ({
          layers: [
            {
              id: "place_city",
              type: "symbol",
              source: "openmaptiles",
            },
          ],
        }),
        getLayer: (id) => (id === "place_city" ? { id } : null),
        setPaintProperty,
      };

      applyLabelPolicyToMap({
        map,
        descriptor: BASE_MAPS.darkMatter,
        baseSourceIds,
      });

      expect(setPaintProperty).toHaveBeenCalledWith("place_city", "text-color", "#ffffff");
      expect(setPaintProperty).toHaveBeenCalledWith("place_city", "text-halo-width", 1.5);
    });
  });
});
