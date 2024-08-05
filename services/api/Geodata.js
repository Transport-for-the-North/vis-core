import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

import BaseService from "./Base";

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
   * @returns {Promise<Array>} The metadata of the features.
   */
  async getFeaturesMetadata(tableName) {
    return await this.get(`/api/spatialdatafeatures/features/${tableName}`);
  }

  /**
   * Fetches the geometry (centroid) for a specific feature.
   * @param {string} tableName - The name of the table.
   * @param {string} featureId - The ID of the feature.
   * @returns {Promise<Object>} The geometry of the feature.
   */
  async getFeatureGeometry(tableName, featureId) {
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