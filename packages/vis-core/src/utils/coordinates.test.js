import {
  bngToWgs84,
  wgs84ToBng,
  isValidBng,
  isValidWgs84,
  isWithinUK,
} from './coordinates';

describe('coordinates', () => {
  describe('isValidBng', () => {
    it('accepts coordinates within UK grid bounds', () => {
      expect(isValidBng(336500, 394000)).toBe(true);
    });

    it('rejects out-of-range values', () => {
      expect(isValidBng(-1, 394000)).toBe(false);
      expect(isValidBng(336500, 2000000)).toBe(false);
      expect(isValidBng('abc', 394000)).toBe(false);
    });
  });

  describe('isValidWgs84', () => {
    it('accepts valid lat/lng', () => {
      expect(isValidWgs84(53.43, -2.96)).toBe(true);
    });

    it('rejects invalid lat/lng', () => {
      expect(isValidWgs84(100, 0)).toBe(false);
      expect(isValidWgs84(0, 200)).toBe(false);
    });
  });

  describe('bngToWgs84', () => {
    it('converts valid BNG coordinates to WGS84 within the UK', () => {
      const result = bngToWgs84(336500, 394000);
      expect(result).not.toBeNull();
      expect(isValidWgs84(result.lat, result.lng)).toBe(true);
      expect(isWithinUK(result.lat, result.lng)).toBe(true);
    });

    it('returns null for invalid BNG input', () => {
      expect(bngToWgs84('', 394000)).toBeNull();
      expect(bngToWgs84(900000, 394000)).toBeNull();
    });
  });

  describe('wgs84ToBng', () => {
    it('round-trips with bngToWgs84 for a UK location', () => {
      const wgs = bngToWgs84(336500, 394000);
      const bng = wgs84ToBng(wgs.lat, wgs.lng);
      expect(bng).not.toBeNull();
      expect(bng.easting).toBeCloseTo(336500, -1);
      expect(bng.northing).toBeCloseTo(394000, -1);
    });

    it('returns null for coordinates outside UK BNG bounds', () => {
      expect(wgs84ToBng(40.7, -74.0)).toBeNull();
    });
  });

  describe('isWithinUK', () => {
    it('returns true for mainland UK coordinates', () => {
      expect(isWithinUK(53.43, -2.96)).toBe(true);
    });

    it('returns false for coordinates outside UK bounding box', () => {
      expect(isWithinUK(40.7, -74.0)).toBe(false);
    });
  });
});
