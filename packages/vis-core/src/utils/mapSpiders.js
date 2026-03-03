import { getSelectedLayerStyle, getHoverLayerStyle, getSourceLayer } from "./map";

/**
 * Collects all currently loaded point features for a vector-tile source,
 * bypassing the parent layer’s filter. Dedupes by feature id.
 *
 * @param {maplibregl.Map} map
 * @param {string} baseLayerId
 * @returns {Array<maplibregl.MapboxGeoJSONFeature>}
 */
export function collectSourcePoints(map, baseLayerId) {
  const sourceLayer = getSourceLayer(map, baseLayerId);
  if (!sourceLayer) return [];
  const perTile = map.querySourceFeatures(baseLayerId, { sourceLayer });
  const seen = new Set();
  return perTile.filter(f => {
    if (!f.geometry || f.geometry.type !== 'Point') return false;
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
}


/**
 * Computes screen-pixel offsets for N coincident points arranged on rings.
 *
 * - If count === 1, return a single offset straight "north" (0, -spacingPx) so the lone
 *   item visibly separates from its anchor.
 * - For count > 1, place points in concentric rings, starting from a configurable
 *   start angle (default -90° = north), cascading around the circle.
 *
 * @param {number} count - Number of points to offset.
 * @param {number} spacingPx - Pixel spacing between items on the ring (per ring radius).
 * @param {number} startAngleDeg - Angle in degrees for the first offset; -90 means "north".
 * @param {number} ringSlots0 - Number of slots on the first ring (subsequent rings add +4 each).
 * @returns {Array<[number, number]>} Offsets in screen pixels [dx, dy] for each item.
 */
export function computeRingOffsets(count, spacingPx = 8, startAngleDeg = -90, ringSlots0 = 8) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  if (count <= 0) return [];

  // Single item: offset straight north so it’s visibly separated.
  if (count === 1) {
    return [[0, -Math.round(spacingPx)]];
  }

  const offsets = [];
  let placed = 0;
  let ring = 1;
  const start = toRad(startAngleDeg);

  while (placed < count) {
    const slots = Math.floor(ringSlots0 + (ring - 1) * 4);
    const radius = ring * spacingPx;

    for (let s = 0; s < slots && placed < count; s += 1, placed += 1) {
      const t = start + (2 * Math.PI * s) / slots;
      const dx = Math.round(radius * Math.cos(t));
      const dy = Math.round(radius * Math.sin(t)); // with start=-90°, first point goes north (negative y)
      offsets.push([dx, dy]);
    }

    ring += 1;
  }

  return offsets;
}

/**
 * Compute spider leg spacing in px.
 *
 * @param {number} gapPx     – a hard-coded buffer (e.g. 2× your circle radius)
 * @param {number} basePx    – the "soft" spacing that is scaled by zoom
 * @param {number} zoom      – current map zoom level
 * @param {number} minZoom   – below this, spacing = minScale
 * @param {number} maxZoom   – above this, spacing = maxScale
 * @param {number} minScale  – scale factor at minZoom
 * @param {number} maxScale  – scale factor at maxZoom
 * 
 * @returns {number}
 *
 * As zoom increases, the scale factor increases linearly, so points move further apart.
 */
export function spacingPxFromZoom(
  zoom,
  basePx = 16,
  gapPx = 0,
  minZoom = 6,
  maxZoom = 18,
  minScale = 0.1,
  maxScale = 5.0
) {
  // clamp zoom into [minZoom…maxZoom]
  const z = Math.max(minZoom, Math.min(maxZoom, zoom));

  // t tells us how far between minZoom and maxZoom we are
  const t = (z - minZoom) / (maxZoom - minZoom);

  // linearly interpolate scale between minScale and maxScale
  const scale = minScale + t * (maxScale - minScale);

  // final spacing = fixed gap + zoom-scaled basePx
  return Math.round(gapPx + basePx * scale);
}

/**
 * Builds spider overlay data in "offsetOne" mode:
 * - For each coincident group, select a single anchor to keep visible in the parent (min id),
 * - Offset all other members into the overlay (with connectors),
 * - Return a flat list of ids to hide in the parent (excludeIds).
 *
 * @param {maplibregl.Map} map
 * @param {string} layerId
 * @param {{ spacingPx?: number }} [options]
 * @returns {{
 *   pointsFc: GeoJSON.FeatureCollection,
 *   linksFc: GeoJSON.FeatureCollection,
 *   index: Record<string, { overlayIds: string[], linkIds: string[] }>,
 *   excludeIds: (number|string)[]
 * }}
 */
export function buildSpiderDataOffsetOne(map, layerId, options = {}) {
  const features = Array.isArray(options.features)
    ? options.features
    : (() => {
        // Unfiltered, per-tile features (bypasses layer filter)
        const sourceLayer = getSourceLayer(map, layerId);
        const perTile = sourceLayer ? map.querySourceFeatures(layerId, { sourceLayer }) : [];
        // Deduplicate by id and keep points only
        const seen = new Set();
        return perTile.filter(f => {
          if (!f.geometry || f.geometry.type !== 'Point') return false;
          if (seen.has(f.id)) return false;
          seen.add(f.id);
          return true;
        });
      })();

  // Group by identical coordinates
  const byCoord = new Map();
  const keyOf = (c) => `${c[0].toFixed(7)}|${c[1].toFixed(7)}`;
  for (const f of features) {
    if (!f.geometry || f.geometry.type !== 'Point') continue;
    const key = keyOf(f.geometry.coordinates);
    if (!byCoord.has(key)) byCoord.set(key, []);
    byCoord.get(key).push(f);
  }

  const points = [];
  const links = [];
  const index = {};
  const excludeIds = [];
  const spacingPx = spacingPxFromZoom(map.getZoom(), options.spacingPx ?? 8);

  for (const group of byCoord.values()) {
    if (group.length <= 1) continue;

    // Pick a deterministic anchor to keep in the parent (min id)
    const sorted = [...group].sort((a, b) => (a.id > b.id ? 1 : -1));
    const anchor = sorted[0];
    const anchorCoord = anchor.geometry.coordinates;
    const basePx = map.project(anchorCoord);

    // Everyone but the anchor is offset into the overlay
    const duplicates = sorted.slice(1);
    excludeIds.push(...duplicates.map((f) => f.id));

    // Build ring offsets for duplicates only
    const count = duplicates.length;
    const offsets = computeRingOffsets(count, spacingPx);
    duplicates.forEach((f, idx) => {
      const [dx, dy] = offsets[idx];
      const p2 = { x: basePx.x + dx, y: basePx.y + dy };
      const lngLat2 = map.unproject(p2);
      const overlayId = `${layerId}:overlay:${String(f.id)}:${idx}`;
      const linkId = `${layerId}:link:${String(f.id)}:${idx}`;

      points.push({
        type: 'Feature',
        id: f.id,
        properties: { ...f.properties, __origId: f.id },
        geometry: { type: 'Point', coordinates: [lngLat2.lng, lngLat2.lat] }
      });
      links.push({
        type: 'Feature',
        id: f.id,
        properties: { __origId: f.id },
        geometry: { type: 'LineString', coordinates: [anchorCoord, [lngLat2.lng, lngLat2.lat]] }
      });

      if (!index[f.id]) index[f.id] = { overlayIds: [], linkIds: [] };
      index[f.id].overlayIds.push(overlayId);
      index[f.id].linkIds.push(linkId);
    });
  }

  return {
    pointsFc: { type: 'FeatureCollection', features: points },
    linksFc:  { type: 'FeatureCollection', features: links },
    index,
    excludeIds
  };
}

/**
 * Returns overlay layer ids (points and links) for a given base layer if present.
 * Use this to include spider overlays in centralised hover/select queries.
 *
 * @param {maplibregl.Map} map
 * @param {string} layerId
 * @returns {string[]} Array of overlay layer ids.
 */
export function getSpiderOverlayLayerIds(map, layerId) {
  const ids = [];
  const pointsId = `${layerId}-spider`;
  const linksId = `${layerId}-spider-links`;
  if (map.getLayer(pointsId)) ids.push(pointsId);
  if (map.getLayer(linksId)) ids.push(linksId);
  return ids;
}

/**
 * Adds hover and select layers for the spider overlay points.
 *
 * @param {maplibregl.Map} map - MapLibre instance
 * @param {string} baseLayerId - Parent layer id (e.g., "Stations")
 */
export function ensureSpiderHoverSelectLayers(map, baseLayerId) {
  const pointSrcId = `${baseLayerId}-spider-src`;
  const pointHoverId  = `${baseLayerId}-spider-hover`;
  const pointSelectId = `${baseLayerId}-spider-select`;

  // Points hover
  if (!map.getLayer(pointHoverId) && map.getSource(pointSrcId)) {
    const hoverLayer = getHoverLayerStyle('point');
    hoverLayer.id = pointHoverId;
    hoverLayer.source = pointSrcId;
    hoverLayer.metadata = { isStylable: false };
    map.addLayer(hoverLayer);
  }

  // Points select
  if (!map.getLayer(pointSelectId) && map.getSource(pointSrcId)) {
    const selectLayer = getSelectedLayerStyle('point');
    selectLayer.id = pointSelectId;
    selectLayer.source = pointSrcId;
    selectLayer.metadata = { isStylable: false };
    map.addLayer(selectLayer);
  }
}