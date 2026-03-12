const notImplemented = (name) => () => {
  throw new Error(`@turf/turf mock: ${name} not implemented for this test`);
};

const point = (coordinates) => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates },
  properties: {},
});

const lineString = (coordinates) => ({
  type: 'Feature',
  geometry: { type: 'LineString', coordinates },
  properties: {},
});

// Very lightweight default implementations.
// These are intended for unit tests that don't validate geospatial math.
const distance = () => 0;
const booleanPointInPolygon = () => true;
const nearestPointOnLine = (_line, pt) => pt;
const pointOnFeature = (geometry) => ({
  type: 'Feature',
  geometry: geometry?.type ? geometry : { type: 'Point', coordinates: [0, 0] },
  properties: {},
});

const bbox = () => [0, 0, 0, 0];
const bboxPolygon = () => ({
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [],
  },
  properties: {},
});

const booleanDisjoint = () => false;

module.exports = {
  __esModule: true,
  default: {},
  point,
  lineString,
  distance,
  booleanPointInPolygon,
  nearestPointOnLine,
  pointOnFeature,
  bbox,
  bboxPolygon,
  booleanDisjoint,

  // Keep obvious failures readable if a new turf fn gets used.
  along: notImplemented('along'),
  centroid: notImplemented('centroid'),
};
