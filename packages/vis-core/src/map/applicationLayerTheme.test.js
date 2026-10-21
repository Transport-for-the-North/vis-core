import {
  invertColorForDarkMode,
  resolveLayerPaint,
  resolveBoundaryColor,
  resolveBoundaryPaint,
  applyApplicationTheme,
} from "./applicationLayerTheme";

describe("applicationLayerTheme", () => {
  describe("invertColorForDarkMode", () => {
    it("inverts saturated colours without producing NaN", () => {
      const saturatedColors = ["#1E90FF", "#0000FF", "rgb(30, 144, 255)"];
      saturatedColors.forEach((color) => {
        const inverted = invertColorForDarkMode(color);
        expect(inverted).toBeDefined();
        expect(inverted).not.toContain("NaN");
        expect(inverted).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });
  describe("resolveLayerPaint", () => {
    it("returns customPaint when provided for light theme", () => {
      const layer = {
        name: "test",
        geometryType: "polygon",
        customPaint: { "fill-color": "#ff0000" },
      };
      expect(resolveLayerPaint({ layer, theme: "light" })).toEqual({
        "fill-color": "#ff0000",
      });
    });

    it("returns customDarkPaint when provided for dark theme", () => {
      const layer = {
        name: "test",
        geometryType: "polygon",
        customPaint: { "fill-color": "#ff0000" },
        customDarkPaint: { "fill-color": "#00ffff" },
      };
      expect(resolveLayerPaint({ layer, theme: "dark" })).toEqual({
        "fill-color": "#00ffff",
      });
    });

    it("inverts customPaint for dark theme when customDarkPaint is absent", () => {
      const layer = {
        name: "test",
        geometryType: "polygon",
        customPaint: { "fill-color": "#000000" },
      };
      const paint = resolveLayerPaint({ layer, theme: "dark" });
      expect(paint["fill-color"]).toBe("#ffffff");
    });

    it("yields valid hex colors for a point layer in dark theme without NaN", () => {
      const layer = {
        name: "NoRMS Nodes",
        geometryType: "point",
        customPaint: {
          "circle-color": "#1E90FF",
          "circle-stroke-color": "#0000FF",
        },
      };
      const paint = resolveLayerPaint({ layer, theme: "dark" });
      expect(paint["circle-color"]).not.toContain("NaN");
      expect(paint["circle-color"]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(paint["circle-stroke-color"]).not.toContain("NaN");
      expect(paint["circle-stroke-color"]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  describe("resolveBoundaryColor", () => {
    it("defaults to #444444 in light mode", () => {
      const layer = { name: "test" };
      expect(resolveBoundaryColor({ layer, theme: "light" })).toBe("#444444");
    });

    it("defaults to #ffffff in dark mode", () => {
      const layer = { name: "test" };
      expect(resolveBoundaryColor({ layer, theme: "dark" })).toBe("#ffffff");
    });

    it("uses explicit boundariesDarkColor when provided", () => {
      const layer = {
        name: "test",
        boundariesColor: "#ff0000",
        boundariesDarkColor: "#ffff00",
      };
      expect(resolveBoundaryColor({ layer, theme: "dark" })).toBe("#ffff00");
    });

    it("inverts custom boundariesColor for dark mode when boundariesDarkColor is absent", () => {
      const layer = {
        name: "test",
        boundariesColor: "#000000",
      };
      expect(resolveBoundaryColor({ layer, theme: "dark" })).toBe("#ffffff");
    });
  });

  describe("resolveBoundaryPaint", () => {
    it("inherits parent opacity by default", () => {
      const layer = {
        name: "test",
        defaultOpacity: 0.7,
      };
      const paint = resolveBoundaryPaint({
        layer,
        theme: "light",
        parentOpacity: 0.5,
      });

      expect(paint["line-opacity"]).toBe(0.5);
      expect(paint["line-width"]).toBe(1);
      expect(paint["line-color"]).toBe("#444444");
    });

    it("uses fixed boundariesOpacity when mode is fixed", () => {
      const layer = {
        name: "test",
        boundariesOpacityMode: "fixed",
        boundariesOpacity: 0.9,
        defaultOpacity: 0.5,
      };
      const paint = resolveBoundaryPaint({
        layer,
        theme: "light",
        parentOpacity: 0.2,
      });

      expect(paint["line-opacity"]).toBe(0.9);
    });

    it("supports boundaryThemePaint configuration", () => {
      const layer = {
        name: "test",
        boundaryThemePaint: {
          light: {
            "line-color": "#222222",
            "line-dasharray": [2, 2],
          },
          dark: {
            "line-color": "#eeeeee",
            "line-dasharray": [4, 4],
          },
        },
      };

      const lightPaint = resolveBoundaryPaint({ layer, theme: "light" });
      expect(lightPaint["line-color"]).toBe("#222222");
      expect(lightPaint["line-dasharray"]).toEqual([2, 2]);

      const darkPaint = resolveBoundaryPaint({ layer, theme: "dark" });
      expect(darkPaint["line-color"]).toBe("#eeeeee");
      expect(darkPaint["line-dasharray"]).toEqual([4, 4]);
    });

    it("respects custom boundariesWidth", () => {
      const layer = {
        name: "test",
        boundariesWidth: 3,
      };
      const paint = resolveBoundaryPaint({ layer });
      expect(paint["line-width"]).toBe(3);
    });
  });

  describe("applyApplicationTheme", () => {
    it("updates layer paint and boundary paint on map", () => {
      const setPaintProperty = jest.fn();
      const getLayer = jest.fn((id) => {
        if (id === "zones" || id === "zones-boundaries") return { id };
        return null;
      });
      const map = { getLayer, setPaintProperty };

      const layers = {
        zones: {
          name: "zones",
          geometryType: "polygon",
          isStylable: false,
          switchableBoundaries: true,
          boundariesOpacityMode: "fixed",
          boundariesOpacity: 0.8,
          customPaint: { "fill-color": "#000000" },
        },
      };

      applyApplicationTheme({ map, layers, theme: "dark" });

      expect(setPaintProperty).toHaveBeenCalledWith(
        "zones",
        "fill-color",
        "#ffffff"
      );
      expect(setPaintProperty).toHaveBeenCalledWith(
        "zones-boundaries",
        "line-color",
        "#ffffff"
      );
    });
  });
});
