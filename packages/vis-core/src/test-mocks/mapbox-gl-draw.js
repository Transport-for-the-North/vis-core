class MapboxDrawMock {
  static modes = {};

  constructor(_opts = {}) {
    this._opts = _opts;
  }

  // Mapbox GL expects controls to expose onAdd/onRemove
  onAdd() {
    return document.createElement('div');
  }

  onRemove() {}

  // Methods used by our code paths
  deleteAll() {}
  changeMode() {}
  getAll() {
    return { type: 'FeatureCollection', features: [] };
  }
}

module.exports = {
  __esModule: true,
  default: MapboxDrawMock,
};
