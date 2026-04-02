/**
 * @file mapSpiders.test.js
 * @description Comprehensive unit tests for the mapSpiders utility functions.
 */

import {
  collectSourcePoints,
  computeRingOffsets,
  spacingPxFromZoom,
  buildSpiderDataOffsetOne,
  getSpiderOverlayLayerIds,
  ensureSpiderHoverSelectLayers,
} from "./mapSpiders";

// Import the module as a namespace to avoid destructuring issues
import * as mapUtils from "./map";

// Mock the module and explicitly declare it as an ES Module
jest.mock("./map", () => ({
  __esModule: true,
  getSelectedLayerStyle: jest.fn(() => ({ type: "circle", paint: {} })),
  getHoverLayerStyle: jest.fn(() => ({ type: "circle", paint: {} })),
  getSourceLayer: jest.fn(),
}));

describe("mapSpiders utilities", () => {
  let mockMap;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Access the mocked functions via the namespace and return valid objects
    mapUtils.getSourceLayer.mockReturnValue("mock-source-layer");
    mapUtils.getHoverLayerStyle.mockReturnValue({ type: "circle", paint: {} });
    mapUtils.getSelectedLayerStyle.mockReturnValue({ type: "circle", paint: {} });

    mockMap = {
      querySourceFeatures: jest.fn(),
      getZoom: jest.fn().mockReturnValue(10),
      project: jest.fn((coord) => ({ x: coord[0] * 10, y: coord[1] * 10 })),
      unproject: jest.fn((point) => ({ lng: point.x / 10, lat: point.y / 10 })),
      getLayer: jest.fn(),
      getSource: jest.fn(),
      addLayer: jest.fn(),
    };
  });

  describe("collectSourcePoints", () => {
    it("should collect and deduplicate point features only", () => {
      mockMap.querySourceFeatures.mockReturnValue([
        { id: 1, geometry: { type: "Point" } },
        { id: 2, geometry: { type: "LineString" } },
        { id: 1, geometry: { type: "Point" } },
        { id: 3, geometry: { type: "Point" } },
      ]);

      const result = collectSourcePoints(mockMap, "base-layer");
      
      expect(result).toHaveLength(2);
      expect(result.map((f) => f.id)).toEqual([1, 3]);
      expect(mockMap.querySourceFeatures).toHaveBeenCalledWith("base-layer", {
        sourceLayer: "mock-source-layer",
      });
    });

    it("should return empty array if sourceLayer is not found", () => {
      // Override the mock for this specific test using the namespace
      mapUtils.getSourceLayer.mockReturnValueOnce(null);
      
      const result = collectSourcePoints(mockMap, "base-layer");
      expect(result).toEqual([]);
    });
  });

  describe("computeRingOffsets", () => {
    /**
     * Tests the mathematical offset generation for spider legs.
     */
    it("should return a single north offset for count === 1", () => {
      const offsets = computeRingOffsets(1, 10);
      expect(offsets).toEqual([[0, -10]]);
    });

    it("should return concentric ring offsets for count > 1", () => {
      const offsets = computeRingOffsets(5, 10, -90, 4);
      expect(offsets).toHaveLength(5);
      // First point of the first ring (startAngle = -90) should be North (0, -10)
      expect(offsets[0][0]).toBeCloseTo(0);
      expect(offsets[0][1]).toBeCloseTo(-10);
    });

    it("should return empty array for count <= 0", () => {
      expect(computeRingOffsets(0)).toEqual([]);
      expect(computeRingOffsets(-5)).toEqual([]);
    });
  });

  describe("spacingPxFromZoom", () => {
    /**
     * Tests the linear interpolation of pixel spacing based on zoom levels.
     */
    it("should clamp to minZoom and return minScale spacing", () => {
      // zoom 4 is below minZoom 6
      const spacing = spacingPxFromZoom(4, 16, 0, 6, 18, 0.1, 5.0);
      expect(spacing).toBe(Math.round(16 * 0.1));
    });

    it("should clamp to maxZoom and return maxScale spacing", () => {
      // zoom 20 is above maxZoom 18
      const spacing = spacingPxFromZoom(20, 16, 0, 6, 18, 0.1, 5.0);
      expect(spacing).toBe(Math.round(16 * 5.0));
    });

    it("should interpolate correctly for mid zoom", () => {
      // zoom 12 is exactly halfway between 6 and 18
      const spacing = spacingPxFromZoom(12, 16, 0, 6, 18, 0.1, 5.0);
      const expectedScale = 0.1 + 0.5 * (5.0 - 0.1); // 2.55
      expect(spacing).toBe(Math.round(16 * expectedScale));
    });
  });

  describe("buildSpiderDataOffsetOne", () => {
    /**
     * Tests the core spiderfication logic: grouping coincident points,
     * keeping one anchor, and offsetting the rest.
     */
    it("should group coincident points, offset duplicates, and return excludeIds", () => {
      const features = [
        { id: 1, properties: { name: "A" }, geometry: { type: "Point", coordinates: [10, 20] } },
        { id: 2, properties: { name: "B" }, geometry: { type: "Point", coordinates: [10, 20] } }, // Coincident
        { id: 3, properties: { name: "C" }, geometry: { type: "Point", coordinates: [30, 40] } }, // Separate
      ];

      const result = buildSpiderDataOffsetOne(mockMap, "test-layer", { features, spacingPx: 10 });

      // Only feature 2 should be excluded (feature 1 is the anchor because 1 < 2)
      expect(result.excludeIds).toEqual([2]);
      
      // One point and one link should be generated for the duplicate
      expect(result.pointsFc.features).toHaveLength(1);
      expect(result.linksFc.features).toHaveLength(1);
      
      // Check index generation
      expect(result.index[2]).toBeDefined();
      expect(result.index[2].overlayIds[0]).toBe("test-layer:overlay:2:0");
      expect(result.index[2].linkIds[0]).toBe("test-layer:link:2:0");
    });
  });

  describe("getSpiderOverlayLayerIds", () => {
    /**
     * Tests retrieval of overlay layer IDs if they exist on the map.
     */
    it("should return layer IDs that exist on the map", () => {
      mockMap.getLayer.mockImplementation((id) => id === "base-spider");
      
      const ids = getSpiderOverlayLayerIds(mockMap, "base");
      expect(ids).toEqual(["base-spider"]); // links layer doesn't exist in mock
    });
  });

  describe("ensureSpiderHoverSelectLayers", () => {
    /**
     * Tests that hover and select layers are added if the source exists
     * and the layers do not already exist.
     */
    it("should add hover and select layers if they do not exist", () => {
      mockMap.getLayer.mockReturnValue(false); // Layers don't exist
      mockMap.getSource.mockReturnValue(true); // Source exists

      ensureSpiderHoverSelectLayers(mockMap, "base");

      expect(mockMap.addLayer).toHaveBeenCalledTimes(2);
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: "base-spider-hover", source: "base-spider-src" })
      );
      expect(mockMap.addLayer).toHaveBeenCalledWith(
        expect.objectContaining({ id: "base-spider-select", source: "base-spider-src" })
      );
    });

    it("should not add layers if source does not exist", () => {
      mockMap.getLayer.mockReturnValue(false);
      mockMap.getSource.mockReturnValue(false); // Source missing

      ensureSpiderHoverSelectLayers(mockMap, "base");

      expect(mockMap.addLayer).not.toHaveBeenCalled();
    });
  });
});
