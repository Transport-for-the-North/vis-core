/**
 * Coordinate conversion utilities
 * 
 * Uses proj4 library for accurate coordinate transformations between
 * British National Grid (BNG/OSGB36) and WGS84 (GPS coordinates).
 */

import proj4 from 'proj4';

// Define the British National Grid projection (EPSG:27700)
// This includes the full OSGB36 datum with Helmert transformation to WGS84
proj4.defs('EPSG:27700', '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs');

// WGS84 is already defined in proj4 as EPSG:4326

/**
 * Convert British National Grid (BNG) Easting/Northing to WGS84 Latitude/Longitude
 * 
 * @param {number|string} easting - BNG Easting coordinate (0-700000)
 * @param {number|string} northing - BNG Northing coordinate (0-1300000)
 * @returns {{ lat: string, lng: string } | null} - WGS84 coordinates (6 decimal places) or null if invalid
 * 
 * @example
 * const coords = bngToWgs84(336500, 394000);
 * // Returns: { lat: "53.430819", lng: "-2.960828" } (Anfield Stadium, Liverpool)
 */
export const bngToWgs84 = (easting, northing) => {
  // Validate inputs
  const e = parseFloat(easting);
  const n = parseFloat(northing);
  
  if (!isValidBng(e, n)) {
    return null;
  }

  try {
    // Transform from BNG (EPSG:27700) to WGS84 (EPSG:4326)
    const [lng, lat] = proj4('EPSG:27700', 'EPSG:4326', [e, n]);
    
    return {
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    };
  } catch (error) {
    console.error('BNG to WGS84 conversion error:', error);
    return null;
  }
};

/**
 * Convert WGS84 Latitude/Longitude to British National Grid Easting/Northing
 * 
 * @param {number|string} lat - WGS84 Latitude
 * @param {number|string} lng - WGS84 Longitude
 * @returns {{ easting: number, northing: number } | null} - BNG coordinates or null if invalid/outside UK
 * 
 * @example
 * const coords = wgs84ToBng(53.430819, -2.960828);
 * // Returns: { easting: 336500, northing: 394000 } (Anfield Stadium, Liverpool)
 */
export const wgs84ToBng = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  
  if (!isValidWgs84(latitude, longitude)) {
    return null;
  }

  try {
    // Transform from WGS84 (EPSG:4326) to BNG (EPSG:27700)
    const [easting, northing] = proj4('EPSG:4326', 'EPSG:27700', [longitude, latitude]);
    
    // Check if result is within valid BNG bounds (i.e., within UK)
    if (!isValidBng(easting, northing)) {
      return null; // Location is outside UK
    }
    
    return {
      easting: Math.round(easting),
      northing: Math.round(northing),
    };
  } catch (error) {
    console.error('WGS84 to BNG conversion error:', error);
    return null;
  }
};

/**
 * Validate if coordinates are within valid BNG bounds
 * 
 * @param {number|string} easting - BNG Easting coordinate
 * @param {number|string} northing - BNG Northing coordinate
 * @returns {boolean} - True if coordinates are valid BNG
 */
export const isValidBng = (easting, northing) => {
  const e = parseFloat(easting);
  const n = parseFloat(northing);
  return !isNaN(e) && !isNaN(n) && e >= 0 && e <= 700000 && n >= 0 && n <= 1300000;
};

/**
 * Validate if coordinates are within valid WGS84 bounds
 * 
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {boolean} - True if coordinates are valid WGS84
 */
export const isValidWgs84 = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  return !isNaN(latitude) && !isNaN(longitude) && 
         latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180;
};

/**
 * Check if WGS84 coordinates are within the UK (approximate bounds)
 * 
 * @param {number|string} lat - Latitude
 * @param {number|string} lng - Longitude
 * @returns {boolean} - True if coordinates are roughly within UK
 */
export const isWithinUK = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  // Approximate bounding box for UK
  return latitude >= 49.9 && latitude <= 60.9 && 
         longitude >= -8.2 && longitude <= 1.8;
};
