/**
 * Picks the features the pointer is hovering.
 *
 * Lines and points are thin targets, so hover uses a tolerance around the pointer. Querying the
 * whole tolerance box in one go returns everything inside it in render order, which makes the
 * top-most feature win even when the pointer is directly on a neighbour - e.g. the two directions
 * of a rail link drawn side by side, where one direction could only be reached from its far edge.
 *
 * Instead the search starts at the pointer itself and widens in steps, stopping at the first step
 * that finds something. What is under the pointer always wins; the tolerance only decides what
 * happens in the gaps between features.
 *
 * The feature already hovered is sticky: it keeps the hover while the pointer stays within a
 * couple of pixels of it. Without that, pointer jitter over two hairline-thin neighbours flips the
 * hover back and forth. The distance is small enough that crossing onto a neighbour still switches
 * well before the pointer has left it.
 */

/** How far, in pixels, the pointer can drift off the hovered feature before it lets go. */
export const HOVER_STICKY_RADIUS = 2;

/** Fractions of the tolerance to search at, nearest first. */
const SEARCH_STEPS = [0, 1 / 3, 2 / 3, 1];

const isFillLayer = (map, layerId) => map.getLayer?.(layerId)?.type === "fill";

/**
 * @param {maplibregl.Map} map
 * @param {{x: number, y: number}} point - Pointer position in screen pixels.
 * @param {string[]} layers - Layer ids to search.
 * @param {number} tolerance - How far from the pointer, in pixels, a feature can be and still count.
 * @param {(feature: Object) => boolean} [isCandidate] - Features failing this are ignored when
 *   deciding where to stop (e.g. features the caller will not show a hover for).
 * @param {(feature: Object) => boolean} [isCurrent] - Identifies the feature already hovered.
 * @returns {Object[]} Rendered features of the nearest step that found a candidate, top-most first.
 */
export function queryNearestRenderedFeatures(
  map,
  point,
  layers,
  tolerance,
  isCandidate = () => true,
  isCurrent = null
) {
  const query = (radius) =>
    map.queryRenderedFeatures(
      radius > 0
        ? [
            [point.x - radius, point.y - radius],
            [point.x + radius, point.y + radius],
          ]
        : [point.x, point.y],
      { layers }
    ) || [];

  // Polygons tile the map, so the one under the pointer is the answer: no tolerance needed.
  const hasThinTargets = layers.some((layerId) => !isFillLayer(map, layerId));
  const maxRadius = Number.isFinite(tolerance) && tolerance > 0 ? tolerance : 0;
  if (!hasThinTargets || maxRadius === 0) return query(0);

  if (isCurrent) {
    const current = query(Math.min(HOVER_STICKY_RADIUS, maxRadius)).find(
      (feature) => feature && feature.layer?.type !== "fill" && isCurrent(feature) && isCandidate(feature)
    );
    if (current) return [current];
  }

  // A polygon is always under the pointer, so on its own it must not end the search: a line or
  // point within tolerance is the more specific target. Keep the polygons as the fallback.
  let fallback = [];
  for (const step of SEARCH_STEPS) {
    const features = query(maxRadius * step);
    const candidates = features.filter((feature) => feature && isCandidate(feature));
    if (candidates.some((feature) => feature.layer?.type !== "fill")) return features;
    if (fallback.length === 0 && candidates.length > 0) fallback = features;
  }
  return fallback;
}
