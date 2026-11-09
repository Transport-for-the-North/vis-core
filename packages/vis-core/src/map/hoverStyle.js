/**
 * Map feature highlights: one definition of how a hovered or selected feature is drawn, for every
 * geometry type, theme and map (single, dual, spider overlays).
 *
 * Hover and selection share the same shape and differ only in colour (navy for hover, red for
 * selected) and in the feature state that switches them on. Selection is drawn above hover.
 *
 * The highlight is a two-tone outline: a strong "core" band paired with a contrasting "halo" band.
 * Whatever is underneath - any choropleth colour, a light or dark base map - at least one of the
 * two bands contrasts with it, so the highlight never relies on a single hue (WCAG 1.4.1) and
 * always clears the 3:1 non-text contrast threshold (WCAG 1.4.11). It is deliberately not red:
 * red is the selection colour and the negative end of the diverging palettes.
 *
 * The highlight wraps the feature instead of covering it, so the data colour stays readable:
 * - polygons: an outline along the boundary
 * - lines: a casing either side of the line, following its live width and offset. A line drawn
 *   offset from its centreline usually has a twin on the other side (the two directions of a
 *   link), so its casing only extends on the outer side and never covers the twin.
 * - points: a ring around the circle, following its live radius
 */

export const HOVER_HALO_SUFFIX = "-hover-halo";
export const HOVER_CORE_SUFFIX = "-hover";

/** Suffixes of every hover companion layer, in the order they are added (bottom first). */
export const HOVER_LAYER_SUFFIXES = [HOVER_HALO_SUFFIX, HOVER_CORE_SUFFIX];

/**
 * Hover colours per base-map theme. `core` contrasts with the base map, `halo` with the core.
 * Navy on white is 17.9:1.
 */
export const HOVER_COLOURS = {
  light: { core: "#0d0f3d", halo: "#ffffff" },
  dark: { core: "#ffffff", halo: "#0d0f3d" },
};

export const SELECT_HALO_SUFFIX = "-select-halo";
export const SELECT_CORE_SUFFIX = "-select";

/**
 * Selection colours per base-map theme. Red stays the selection colour; the halo keeps it legible
 * on red data colours. Both pairs are above 4.5:1.
 */
export const SELECTED_COLOURS = {
  light: { core: "#e3002b", halo: "#ffffff" },
  dark: { core: "#ff4d5e", halo: "#0d0f3d" },
};

/** The two kinds of highlight: the feature state that shows each, its layer suffixes and colours. */
const HIGHLIGHTS = {
  hover: { state: "hover", halo: HOVER_HALO_SUFFIX, core: HOVER_CORE_SUFFIX, colours: HOVER_COLOURS },
  selected: {
    state: "selected",
    halo: SELECT_HALO_SUFFIX,
    core: SELECT_CORE_SUFFIX,
    colours: SELECTED_COLOURS,
  },
};
const resolveHighlight = (kind) => HIGHLIGHTS[kind] ?? HIGHLIGHTS.hover;

/** Band widths in pixels. */
const POLYGON_CORE_WIDTH = ["interpolate", ["linear"], ["zoom"], 5, 2.5, 10, 3, 15, 4];
const POLYGON_HALO_WIDTH = ["interpolate", ["linear"], ["zoom"], 5, 5.5, 10, 6, 15, 8];
const BAND_HALO_WIDTH = 1.5;
const BAND_CORE_WIDTH = 2.5;
/** Offset lines: a hairline that fits in the gap between twins, and the band on the outer side. */
const SIDED_HAIRLINE_WIDTH = 1;
const SIDED_CORE_WIDTH = 3;

/** MapLibre's defaults for the base-layer properties the highlight follows. */
const DEFAULT_LINE_WIDTH = 1;
const DEFAULT_CIRCLE_RADIUS = 5;

const whenState = (state) => ["case", ["boolean", ["feature-state", state], false], 1, 0];

export const resolveHoverColours = (theme) => HOVER_COLOURS[theme] ?? HOVER_COLOURS.light;

const isZoomInput = (input) => Array.isArray(input) && input[0] === "zoom";

/** Whether an expression reads ["zoom"] anywhere, which stops it being nested in arithmetic. */
const usesZoom = (value) =>
  Array.isArray(value) && (value[0] === "zoom" || value.some((item) => usesZoom(item)));

const isNumberOrExpression = (value) =>
  (typeof value === "number" && Number.isFinite(value)) || (Array.isArray(value) && value.length > 0);

/** Arithmetic that folds constants and otherwise builds a MapLibre expression. */
const bothNumbers = (a, b) => typeof a === "number" && typeof b === "number";
const add = (a, b) => (bothNumbers(a, b) ? a + b : ["+", a, b]);
const multiply = (a, b) => (bothNumbers(a, b) ? a * b : ["*", a, b]);

/**
 * Adds a constant to a numeric paint value or expression.
 *
 * MapLibre only allows ["zoom"] as the input of a top-level interpolate/step, so a zoom expression
 * cannot be wrapped in ["+", ...]; the constant is added to each of its outputs instead.
 *
 * @param {number|Array} value - A number or a MapLibre expression that evaluates to one.
 * @param {number} delta - The amount to add.
 * @returns {number|Array|null} The offset value, or null when `value` is not something we can offset.
 */
export function offsetNumericExpression(value, delta) {
  if (typeof value === "number") return Number.isFinite(value) ? value + delta : null;
  if (!Array.isArray(value) || value.length === 0) return null;

  const [operator] = value;
  if (operator.startsWith?.("interpolate") && isZoomInput(value[2])) {
    const result = value.slice(0, 3);
    for (let i = 3; i + 1 < value.length; i += 2) {
      const output = offsetNumericExpression(value[i + 1], delta);
      if (output === null) return null;
      result.push(value[i], output);
    }
    return result;
  }
  if (operator === "step" && isZoomInput(value[1])) {
    const base = offsetNumericExpression(value[2], delta);
    if (base === null) return null;
    const result = ["step", value[1], base];
    for (let i = 3; i + 1 < value.length; i += 2) {
      const output = offsetNumericExpression(value[i + 1], delta);
      if (output === null) return null;
      result.push(value[i], output);
    }
    return result;
  }
  return ["+", value, delta];
}

/**
 * Paint that makes the highlight follow the base layer's geometry.
 *
 * @param {'line'|'point'} geometryType
 * @param {Object} [basePaint] - The base layer's paint (live or configured).
 * @returns {{halo: Object, core: Object}} Paint overrides for the two hover layers.
 */
export function buildHoverGeometryPaint(geometryType, basePaint = {}) {
  if (geometryType === "line") {
    const width = isNumberOrExpression(basePaint["line-width"])
      ? basePaint["line-width"]
      : DEFAULT_LINE_WIDTH;
    const offset = isNumberOrExpression(basePaint["line-offset"]) ? basePaint["line-offset"] : 0;

    if (offset !== 0 && !usesZoom(width) && !usesZoom(offset)) {
      // Offset line: hairline on both edges, core band on the outer side only (the side the line
      // is offset towards), so a twin on the inner side stays fully visible.
      const side = typeof offset === "number" ? Math.sign(offset) : ["case", ["<", offset, 0], -1, 1];
      const outerEdge = add(multiply(width, 0.5), SIDED_HAIRLINE_WIDTH + SIDED_CORE_WIDTH / 2);
      return {
        halo: {
          "line-gap-width": width,
          "line-width": SIDED_HAIRLINE_WIDTH,
          "line-offset": offset,
        },
        core: {
          "line-gap-width": 0,
          "line-width": SIDED_CORE_WIDTH,
          "line-offset": add(offset, multiply(side, outerEdge)),
        },
      };
    }

    // Centred line: the casing starts at the edge of the line, halo band first, then the core
    // band outside it, on both sides.
    return {
      halo: {
        "line-gap-width": width,
        "line-width": BAND_HALO_WIDTH,
        "line-offset": offset,
      },
      core: {
        "line-gap-width":
          offsetNumericExpression(width, BAND_HALO_WIDTH * 2) ?? DEFAULT_LINE_WIDTH + BAND_HALO_WIDTH * 2,
        "line-width": BAND_CORE_WIDTH,
        "line-offset": offset,
      },
    };
  }
  if (geometryType === "point") {
    const radius = basePaint["circle-radius"] ?? DEFAULT_CIRCLE_RADIUS;
    const strokeWidth =
      typeof basePaint["circle-stroke-width"] === "number" ? basePaint["circle-stroke-width"] : 1;
    // The ring starts just outside the circle's own stroke.
    const haloRadius =
      offsetNumericExpression(radius, strokeWidth) ?? DEFAULT_CIRCLE_RADIUS + strokeWidth;
    const coreRadius =
      offsetNumericExpression(radius, strokeWidth + BAND_HALO_WIDTH) ??
      DEFAULT_CIRCLE_RADIUS + strokeWidth + BAND_HALO_WIDTH;
    return {
      halo: { "circle-radius": haloRadius },
      core: { "circle-radius": coreRadius },
    };
  }
  return { halo: {}, core: {} };
}

/**
 * Builds the hover layers for a geometry type, bottom layer first.
 *
 * @param {'polygon'|'line'|'point'|'symbol'} geometryType
 * @param {Object} [options]
 * @param {'light'|'dark'} [options.theme='light'] - The base-map theme.
 * @param {Object} [options.basePaint] - The base layer's paint, so the highlight matches its size.
 * @param {'hover'|'selected'} [options.kind='hover'] - Which highlight to build.
 * @returns {Array<{suffix: string, layer: Object}>} Layer specs without id/source, with the id suffix to use.
 */
export function getHoverLayerSpecs(geometryType, { theme = "light", basePaint, kind = "hover" } = {}) {
  const highlight = resolveHighlight(kind);
  const colours = highlight.colours[theme] ?? highlight.colours.light;
  const WHEN_HOVERED = whenState(highlight.state);
  const geometryPaint = buildHoverGeometryPaint(geometryType, basePaint);

  switch (geometryType) {
    case "polygon":
      return [
        {
          suffix: highlight.halo,
          layer: {
            type: "line",
            layout: { "line-join": "round" },
            paint: {
              "line-color": colours.halo,
              "line-opacity": WHEN_HOVERED,
              "line-width": POLYGON_HALO_WIDTH,
            },
          },
        },
        {
          suffix: highlight.core,
          layer: {
            type: "line",
            layout: { "line-join": "round" },
            paint: {
              "line-color": colours.core,
              "line-opacity": WHEN_HOVERED,
              "line-width": POLYGON_CORE_WIDTH,
            },
          },
        },
      ];
    case "line":
      return [
        {
          suffix: highlight.halo,
          layer: {
            type: "line",
            layout: { "line-join": "round" },
            paint: {
              "line-color": colours.halo,
              "line-opacity": WHEN_HOVERED,
              ...geometryPaint.halo,
            },
          },
        },
        {
          suffix: highlight.core,
          layer: {
            type: "line",
            layout: { "line-join": "round" },
            paint: {
              "line-color": colours.core,
              "line-opacity": WHEN_HOVERED,
              ...geometryPaint.core,
            },
          },
        },
      ];
    case "point":
      return [
        {
          suffix: highlight.halo,
          layer: {
            type: "circle",
            paint: {
              "circle-opacity": 0,
              "circle-stroke-color": colours.halo,
              "circle-stroke-opacity": WHEN_HOVERED,
              "circle-stroke-width": BAND_HALO_WIDTH,
              ...geometryPaint.halo,
            },
          },
        },
        {
          suffix: highlight.core,
          layer: {
            type: "circle",
            paint: {
              "circle-opacity": 0,
              "circle-stroke-color": colours.core,
              "circle-stroke-opacity": WHEN_HOVERED,
              "circle-stroke-width": BAND_CORE_WIDTH,
              ...geometryPaint.core,
            },
          },
        },
      ];
    case "symbol":
      // Image markers swap to a pre-drawn "<icon>-hover" / "<icon>-select" image (see utils/imageLoader).
      return [
        {
          suffix: highlight.core,
          layer: {
            type: "symbol",
            layout: {
              "icon-image": ["concat", ["get", "icon_name"], highlight.core],
              "icon-size": 1.2,
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
            },
            paint: { "icon-opacity": WHEN_HOVERED },
          },
        },
      ];
    default:
      return [];
  }
}

/** The geometry type a hover layer set was built for, from a rendered layer's type. */
const geometryTypeOfLayer = (layer) =>
  ({ line: "line", circle: "point", fill: "polygon", symbol: "symbol" })[layer?.type] ?? null;

const readPaint = (map, layerId, props) => {
  const paint = {};
  props.forEach((prop) => {
    try {
      const value = map.getPaintProperty?.(layerId, prop);
      if (value !== undefined && value !== null) paint[prop] = value;
    } catch {
      // The layer has no such property.
    }
  });
  return paint;
};

const setPaint = (map, layerId, paint) => {
  if (!map.getLayer?.(layerId)) return;
  Object.entries(paint).forEach(([prop, value]) => {
    try {
      map.setPaintProperty(layerId, prop, value);
    } catch {
      // Leave the previous value in place.
    }
  });
};

/**
 * Adds the hover layers for a base layer, if they are not already on the map.
 *
 * @param {maplibregl.Map} map
 * @param {Object} params
 * @param {string} params.baseLayerId - The layer the highlight belongs to; hover layer ids derive from it.
 * @param {'polygon'|'line'|'point'|'symbol'} params.geometryType
 * @param {string} params.source - The source the hover layers read (the one holding the hover feature state).
 * @param {string} [params.sourceLayer] - Source layer, for vector tile sources.
 * @param {'light'|'dark'} [params.theme='light']
 * @param {Object} [params.basePaint] - Paint of the base layer, when it is not on the map yet to read from.
 * @param {'hover'|'selected'} [params.kind='hover'] - Which highlight to add.
 */
export function addHoverLayers(
  map,
  { baseLayerId, geometryType, source, sourceLayer, theme = "light", basePaint, kind = "hover" }
) {
  if (!map?.addLayer) return;
  getHoverLayerSpecs(geometryType, { theme, basePaint, kind }).forEach(({ suffix, layer }) => {
    const id = `${baseLayerId}${suffix}`;
    if (map.getLayer?.(id)) return;
    map.addLayer({
      ...layer,
      id,
      source,
      ...(sourceLayer ? { "source-layer": sourceLayer } : {}),
      metadata: { isStylable: false },
    });
  });
}

/**
 * Removes the hover and selection layers of a base layer.
 *
 * @param {maplibregl.Map} map
 * @param {string} baseLayerId
 */
export function removeHoverLayers(map, baseLayerId) {
  Object.values(HIGHLIGHTS).forEach(({ halo, core }) => {
    [halo, core].forEach((suffix) => {
      const id = `${baseLayerId}${suffix}`;
      if (map?.getLayer?.(id)) map.removeLayer(id);
    });
  });
}

/**
 * Makes a base layer's hover and selection highlights match its live width, offset or radius.
 *
 * Data loads, the width slider and width factors all restyle the base layer at runtime. Rather than
 * hooking each of those, callers run this when a feature becomes hovered or selected, so the
 * highlight is always right at the moment it is shown. Unchanged values are a no-op inside MapLibre.
 *
 * @param {maplibregl.Map} map
 * @param {string} baseLayerId - The feature's layer id (a base layer or a spider overlay).
 */
export function syncHoverLayers(map, baseLayerId) {
  const geometryType = geometryTypeOfLayer(map?.getLayer?.(baseLayerId));
  if (geometryType !== "line" && geometryType !== "point") return;
  const present = Object.values(HIGHLIGHTS).filter(({ core }) =>
    map.getLayer(`${baseLayerId}${core}`)
  );
  if (present.length === 0) return;

  const basePaint = readPaint(
    map,
    baseLayerId,
    geometryType === "line"
      ? ["line-width", "line-offset"]
      : ["circle-radius", "circle-stroke-width"]
  );
  const paint = buildHoverGeometryPaint(geometryType, basePaint);
  present.forEach(({ halo, core }) => {
    setPaint(map, `${baseLayerId}${halo}`, paint.halo);
    setPaint(map, `${baseLayerId}${core}`, paint.core);
  });
}

/**
 * Recolours a base layer's hover and selection highlights for a base-map theme.
 *
 * @param {maplibregl.Map} map
 * @param {string} baseLayerId
 * @param {'light'|'dark'} theme
 */
export function applyHoverTheme(map, baseLayerId, theme) {
  Object.values(HIGHLIGHTS).forEach((highlight) => {
    const colours = highlight.colours[theme] ?? highlight.colours.light;
    [
      [highlight.halo, colours.halo],
      [highlight.core, colours.core],
    ].forEach(([suffix, colour]) => {
      const id = `${baseLayerId}${suffix}`;
      const layer = map?.getLayer?.(id);
      if (!layer) return;
      const prop = { line: "line-color", circle: "circle-stroke-color" }[layer.type];
      if (prop) setPaint(map, id, { [prop]: colour });
    });
  });
}
