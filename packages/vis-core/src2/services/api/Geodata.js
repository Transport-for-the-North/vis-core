import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

import BaseService from "./Base";

/**
 * Parses a vector tile path and extracts tableName, zoneTypeId, and any additional query parameters.
 * @param {string} path - The path to be parsed.
 * @returns {Object} An object containing the tableName, optionally the zoneTypeId, and any query parameters.
 */
function parseVectorTilePath(path) {
  if (!path.startsWith('/')) {
    throw new Error('Path must start with a slash.');
  }

  // Create a URL object to easily parse the path and query parameters
  const url = new URL(`http://example.com${path}`);
  const pathParts = url.pathname.split('/');

  if (pathParts[2] !== 'vectortiles') {
    throw new Error('Path must be for vectortiles.');
  }

  const isZonePath = pathParts.includes('zones');
  const tableName = isZonePath ? 'zones' : pathParts[3];

  const result = { tableName };

  if (isZonePath) {
    const zoneTypeId = pathParts[4];
    result.zoneTypeId = zoneTypeId;
  }

  // Extract query parameters
  const queryParams = {};
  for (const [key, value] of url.searchParams.entries()) {
    queryParams[key] = value;
  }

  if (Object.keys(queryParams).length > 0) {
    result.queryParams = queryParams;
  }

  return result;
}

/**
 * Class for handling local storage with memory cache functionality.
 */
class LocalStorageMemoryCache {
  /**
   * Retrieves a cached layer from local storage.
   * 
   * @param {string} key - The key for the cached layer.
   * @returns {any|null} The cached layer data or null if not found or expired.
   */
  getLayer(key) {
    try {
      const compressed = localStorage.getItem(key);
      if (compressed) {
        const decompressed = decompressFromUTF16(compressed);
        const { expires, data } = JSON.parse(decompressed);
        if (Date.now() < expires) {
          return data; // Cache is still valid
        }
        this.invalidateCache(key); // Cache has expired, invalidate it
      }
      return null;
    } catch (e) {
      console.error('Error getting item from cache:', e);
      return null;
    }
  }

  /**
   * Sets a layer in the cache with a time-to-live (TTL) value.
   * 
   * @param {string} key - The key for the layer.
   * @param {any} value - The value to be cached.
   * @param {number} ttl - The time-to-live in seconds. Default is 3600 seconds.
   */
  setLayer(key, value, ttl = 3600) { // ttl is time to live in seconds
    try {
      const expires = Date.now() + ttl * 1000; // Calculate expiration time
      const dataToStore = { expires, data: value };
      const compressed = compressToUTF16(JSON.stringify(dataToStore));
      localStorage.setItem(key, compressed);
    } catch (e) {
      console.error('Error setting item in cache:', e);
    }
  }

  /**
   * Invalidates the cache for a specific key.
   * 
   * @param {string} key - The key for the cache to be invalidated.
   */
  invalidateCache(key) {
    localStorage.removeItem(key);
  }
}

const cache = new LocalStorageMemoryCache();

/**
 * Service class for handling geodata requests.
 */
class GeodataService extends BaseService {
  /**
   * Constructs a new GeodataService instance.
   * @constructor
   * @param {Object} options - Optional configuration options.
   */
  constructor(options = {}) {
    super({ pathPrefix: "", ...options });
  }

  /**
   * Fetches metadata for all features in the specified table.
   * @param {string} tableName - The name of the table.
   * @param {Object} [options] - Additional options for the request.
   * @returns {Promise<Array>} The metadata of the features.
   */
  async getFeaturesMetadata(tableName, options = {}) {
    const url = new URL(`/api/spatialdatafeatures/features/${tableName}`, this._apiBaseUrl);

    // Append each option as a query parameter
    Object.entries(options).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    // Extract the path and query string from the URL
    const pathWithQuery = `${url.pathname}${url.search}`;

    return await this.get(pathWithQuery);
  }

  /**
   * Fetches metadata based on the parsed path.
   * @param {string} path - The path to be parsed.
   * @returns {Promise<Array>} The metadata of the features.
   */
  async fetchMetadataFromPath(path) {
    const parsedParams = parseVectorTilePath(path);
    const { tableName, zoneTypeId, queryParams } = parsedParams;
    const options = {
      ...(zoneTypeId !== undefined && { zoneTypeId }),
      ...queryParams
    };

    return await this.getFeaturesMetadata(tableName, options);
  }

  /**
   * Fetches the geometry (centroid) for a specific feature.
   * @param {string} path - The vector tile path for the given table.
   * @param {string} featureId - The ID of the feature.
   * @returns {Promise<Object>} The geometry of the feature.
   */
  async getFeatureGeometryCentroid(path, featureId) {
    const parsedParams = parseVectorTilePath(path);
    const { tableName } = parsedParams;

    try {
      const responseObj = await this.get(`/api/spatialdatafeaturegeometry/centroid/${tableName}/${featureId}`);
      // Read the geojson from the responseData - note janky handling as a result of mapping of sql result to api model
      const data = JSON.parse(responseObj.centroid)
      return data
    } catch (error) {
      console.error('Error fetching layer data:', error);
      throw error;
    }
  }

  /**
   * Fetches the geometry (bounds, centroid, and feature) for a specific feature.
   * @param {string} path - The vector tile path for the given table.
   * @param {string} featureId - The ID of the feature.
   * @returns {Promise<Object>} The geometry of the feature.
   */
  async getFeatureGeometry(path, featureId) {
    const parsedParams = parseVectorTilePath(path);
    const { tableName } = parsedParams;

    try {
      const responseObj = await this.get(`/api/spatialdatafeaturegeometry/feature/${tableName}/${featureId}`);
      // Parse the response object to extract and parse the geojson strings
      const { centroid, bounds, geometry } = responseObj;

      // Parse the JSON strings into objects
      const parsedCentroid = JSON.parse(centroid);
      const parsedBounds = JSON.parse(bounds);
      const parsedGeometry = JSON.parse(geometry);

      return { centroid: parsedCentroid, bounds: parsedBounds, geometry: parsedGeometry };
    } catch (error) {
      console.error('Error fetching layer data:', error);
      throw error;
    }
  }

  /**
   * Fetches the geometry (bounds) for a specific feature.
   * @param {string} path - The vector tile path for the given table.
   * @param {string} featureId - The ID of the feature.
   * @returns {Promise<Object>} The geometry of the feature.
   */
  async getFeatureGeometryBounds(path, featureId) {
    const parsedParams = parseVectorTilePath(path);
    const { tableName } = parsedParams;

    try {
      const responseObj = await this.get(`/api/spatialdatafeaturegeometry/bounds/${tableName}/${featureId}`);
      // Read the geojson from the responseData - note janky handling as a result of mapping of sql result to api model
      const data = JSON.parse(responseObj.bounds)
      return data
    } catch (error) {
      console.error('Error fetching layer data:', error);
      throw error;
    }
  }
  
  /**
   * Retrieves a layer based on the given configuration, with caching.
   * 
   * @param {Object} layerConfig - The configuration for the layer.
   * @returns {Promise<any>} The layer data.
   */
  async getLayer(layerConfig) {
    const cacheKey = this._getCacheKeyForLayer(layerConfig.path);
    let cachedLayer = cache.getLayer(cacheKey);

    if (!cachedLayer) {
      try {
        const response = await fetch(this._buildUrl(layerConfig.path));
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();

        // Read the geojson from the responseData - note janky handling as a result of mapping of sql result to api model
        const data = JSON.parse(responseData[0].json_build_object)
        cache.setLayer(cacheKey, data);
        cachedLayer = data;
      } catch (error) {
        console.error('Error fetching layer data:', error);
        throw error; // Rethrow the error for further handling if necessary
      }
    }

    return cachedLayer;
  }
  
  /**
   * Builds the URL for a tile layer.
   * 
   * @param {string} path - The path to the tile layer.
   * @returns {string} The complete URL for the tile layer.
   */
  buildTileLayerUrl(path) {
    /* Builds the path to a tile layer from the provided path (allow for dev and prod workloads)
    */
    return super._buildUrl(path)
  };

  /**
   * Generates a cache key for a layer based on its name.
   * 
   * @param {string} layerName - The name of the layer.
   * @returns {string} The cache key for the layer.
   */
  _getCacheKeyForLayer(layerName) {
    return `layer_${layerName}`;
  }

  /**
   * Invalidates the cache for a specific layer.
   * 
   * @param {string} layerName - The name of the layer.
   */
  invalidateCache(layerName) {
    const cacheKey = this._getCacheKeyForLayer(layerName);
    cache.invalidateCache(cacheKey);
  }
}

export { GeodataService, LocalStorageMemoryCache };