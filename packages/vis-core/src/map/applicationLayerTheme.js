import { getLayerStyle } from "../utils/map";

/** Converts sRGB (0-255 each) to HSL (degrees, %, %). @private */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  switch (max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    default: h = (r - g) / d + 4;
  }
  return [h / 6 * 360, s * 100, l * 100];
}

/** Converts HSL (degrees, %, %) back to a CSS hex string. @private */
function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    r = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Well-known CSS named colours used in default layer styles. @private */
const NAMED_COLOURS = {
  black: "#000000", white: "#ffffff", red: "#ff0000",
  blue: "#0000ff", green: "#008000", transparent: null,
};

/**
 * Inverts a CSS colour string for dark-mode contrast.
 *
 * @param {*} color - A CSS colour string.
 * @returns {*} Inverted colour or original value.
 */
export function invertColorForDarkMode(color) {
  if (typeof color !== "string") return color;
  const trimmed = color.trim().toLowerCase();
  if (trimmed === "transparent" || trimmed === "none") return color;

  let r, g, b, a = 1;

  const namedHex = NAMED_COLOURS[trimmed];
  if (namedHex === null) return color;
  const colorStr = namedHex ?? color.trim();

  const hexMatch = colorStr.match(/^#([0-9a-f]{3,8})$/i);
  if (hexMatch) {
    const h = hexMatch[1];
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
      if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
    }
  }

  const rgbaMatch = colorStr.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgbaMatch) {
    r = parseInt(rgbaMatch[1]);
    g = parseInt(rgbaMatch[2]);
    b = parseInt(rgbaMatch[3]);
    a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
  }

  if (r === undefined) return color;

  const [hDeg, s, l] = rgbToHsl(r, g, b);
  const lNew = l < 50 ? Math.max(80, 100 - l) : l;
  const hex = hslToHex(hDeg, s, lNew);
  if (a < 1) {
    return hex + Math.round(a * 255).toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Inverts colour properties in a paint object for dark mode.
 *
 * @param {Object} paint
 * @returns {Object}
 */
export function invertPaintForDarkMode(paint) {
  if (!paint || typeof paint !== "object") return paint;
  const result = {};
  for (const [key, value] of Object.entries(paint)) {
    result[key] =
      typeof value === "string" && key.endsWith("-color")
        ? invertColorForDarkMode(value)
        : value;
  }
  return result;
}

/**
 * Returns default dark-mode paint styles by geometry type.
 *
 * @param {string} geometryType
 * @returns {Object}
 */
export function getDarkLayerStyle(geometryType) {
  switch (geometryType) {
    case "polygon":
      return {
        id: "", type: "fill", source: "",
        paint: {
          "fill-color": "rgba(255, 255, 0, 0)",
          "fill-outline-color": "rgba(210, 210, 210, 1)",
          "fill-opacity": 0,
        },
      };
    case "line":
      return {
        id: "", type: "line", source: "",
        paint: {
          "line-color": "rgba(240, 240, 240, 1)",
          "line-opacity": 0.8,
        },
      };
    case "point":
      return {
        id: "", type: "circle", source: "",
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            0, 2, 12, 8, 22, 15,
          ],
          "circle-color": "#5CB8FF",
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-opacity": 0.85,
        },
      };
    case "symbol":
      return getLayerStyle("symbol");
    default:
      return {};
  }
}

/**
 * Resolves the MapLibre paint object for an application layer according to the theme.
 *
 * @param {Object} params
 * @param {Object} params.layer - The layer specification object.
 * @param {'light'|'dark'} params.theme - The colour theme.
 * @returns {Object} A MapLibre paint object.
 */
export function resolveLayerPaint({ layer, theme }) {
  if (theme === "dark") {
    return (
      layer.customDarkPaint ||
      (layer.customPaint
        ? invertPaintForDarkMode(layer.customPaint)
        : getDarkLayerStyle(layer.geometryType).paint)
    );
  }
  return layer.customPaint || getLayerStyle(layer.geometryType).paint;
}

/**
 * Resolves the boundary line colour for an application layer according to the theme.
 *
 * @param {Object} params
 * @param {Object} params.layer - The layer specification object.
 * @param {'light'|'dark'} params.theme - The colour theme.
 * @returns {string} The boundary line colour.
 */
export function resolveBoundaryColor({ layer, theme }) {
  if (theme === "dark") {
    if (layer.boundariesDarkColor) return layer.boundariesDarkColor;
    if (layer.boundariesColor && layer.boundariesColor !== "#444444") {
      return invertColorForDarkMode(layer.boundariesColor);
    }
    return "#ffffff";
  }
  return layer.boundariesColor || "#444444";
}

/**
 * Resolves boundary layer paint properties according to the theme and opacity mode.
 *
 * @param {Object} params
 * @param {Object} params.layer - The layer specification object.
 * @param {'light'|'dark'} [params.theme='light'] - The current colour theme.
 * @param {number} [params.parentOpacity] - The current parent layer opacity.
 * @returns {Object} A MapLibre paint object for the line boundaries layer.
 */
export function resolveBoundaryPaint({
  layer,
  theme = "light",
  parentOpacity,
}) {
  const mode =
    layer.boundariesOpacityMode ??
    (layer.metadata?.boundariesOpacityMode ??
      (layer.boundariesOpacity != null || layer.metadata?.boundariesOpacity != null
        ? "fixed"
        : "inherit"));

  let opacity;
  if (mode === "fixed") {
    opacity =
      layer.boundariesOpacity != null
        ? Number(layer.boundariesOpacity)
        : (layer.metadata?.boundariesOpacity != null
          ? Number(layer.metadata.boundariesOpacity)
          : 1);
  } else {
    opacity =
      parentOpacity != null
        ? Number(parentOpacity)
        : (layer.defaultOpacity != null
          ? Number(layer.defaultOpacity)
          : (layer.metadata?.defaultOpacity != null
            ? Number(layer.metadata.defaultOpacity)
            : 0.8));
  }

  const themeConfig =
    layer.boundaryThemePaint || layer.metadata?.boundaryThemePaint;

  let lineColor;
  if (themeConfig?.[theme]?.["line-color"]) {
    lineColor = themeConfig[theme]["line-color"];
  } else {
    lineColor = resolveBoundaryColor({ layer, theme });
  }

  const additionalThemePaint = themeConfig?.[theme] || {};

  return {
    "line-width":
      layer.boundariesWidth ?? (layer.metadata?.boundariesWidth ?? 1),
    ...additionalThemePaint,
    "line-color": lineColor,
    "line-opacity": opacity,
  };
}

/**
 * Applies the application theme to all layers currently mounted on a map instance.
 *
 * @param {Object} params
 * @param {Object} params.map - A MapLibre map instance.
 * @param {Object} params.layers - The dictionary of application layers from state.layers.
 * @param {'light'|'dark'} params.theme - The target colour theme.
 */
export function applyApplicationTheme({ map, layers, theme }) {
  if (!map?.getLayer || !map?.setPaintProperty || !layers) return;

  Object.values(layers).forEach((layer) => {
    const isStylable = Boolean(layer.isStylable ?? layer.metadata?.isStylable);
    if (!isStylable) {
      const paint = resolveLayerPaint({ layer, theme });
      if (paint && map.getLayer(layer.name)) {
        Object.entries(paint).forEach(([prop, value]) => {
          try {
            map.setPaintProperty(layer.name, prop, value);
          } catch {
            // Ignore unsupported properties.
          }
        });
      }
    }

    if (layer.switchableBoundaries !== false && layer.geometryType === "polygon") {
      const boundaryLayerId = `${layer.name}-boundaries`;
      if (map.getLayer(boundaryLayerId)) {
        const boundaryPaint = resolveBoundaryPaint({ layer, theme });
        Object.entries(boundaryPaint).forEach(([prop, value]) => {
          if (
            prop === "line-opacity" &&
            (layer.boundariesOpacityMode ?? layer.metadata?.boundariesOpacityMode ?? "inherit") !== "fixed"
          ) {
            return;
          }
          try {
            map.setPaintProperty(boundaryLayerId, prop, value);
          } catch {
            // Ignore missing properties.
          }
        });
      }
    }
  });
}
