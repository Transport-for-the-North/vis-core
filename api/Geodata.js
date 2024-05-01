import { compressToUTF16, decompressFromUTF16 } from 'lz-string';

import BaseService from "./Base";

class LocalStorageMemoryCache {
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

  invalidateCache(key) {
    localStorage.removeItem(key);
  }
}

const cache = new LocalStorageMemoryCache();

class GeodataService extends BaseService {
  constructor(options = {}) {
    super({ pathPrefix: "", ...options });
  }

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
  
  buildTileLayerUrl(path) {
    /* Builds the path to a tile layer from the provided path (allow for dev and prod workloads)
    */
    return super._buildUrl(path)
  };


  _getCacheKeyForLayer(layerName) {
    return `layer_${layerName}`;
  }

  invalidateCache(layerName) {
    const cacheKey = this._getCacheKeyForLayer(layerName);
    cache.invalidateCache(cacheKey);
  }
}

export { GeodataService, LocalStorageMemoryCache };