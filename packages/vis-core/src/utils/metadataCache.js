/**
 * metadataCache
 *
 * A two-layer caching utility for metadata table API responses:
 * 1. In-memory Map (fast, deduplicates concurrent requests within the SPA)
 * 2. sessionStorage (persists across SPA page transitions)
 *
 * Both layers are TTL-bounded. All sessionStorage entries are cleared on module
 * initialisation (i.e. any full page reload) so users can recover from stale
 * data with a simple refresh.
 */

const METADATA_CACHE_KEY_PREFIX = "metadata_cache_";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** @type {Map<string, { promise: Promise<any>, timestamp: number }>} */
const metadataPromiseCache = new Map();

// Clear all sessionStorage metadata entries on module initialisation.
// This runs on every full page reload (F5, Ctrl+Shift+R, or fresh navigation),
// ensuring users always get fresh data after a refresh without needing to
// open the console. The in-memory Map is naturally empty at this point since
// the module is being freshly evaluated.
try {
  const keysToRemove = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(METADATA_CACHE_KEY_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => sessionStorage.removeItem(key));
} catch (e) {
  // sessionStorage may be unavailable in some environments (e.g. SSR, sandboxed iframes)
}

/**
 * Build a deterministic cache key from an endpoint configuration.
 *
 * @param {Object} endpoint
 * @returns {string}
 */
function buildCacheKey(endpoint) {
  return JSON.stringify({
    path: endpoint.path,
    method: (endpoint.requestMethod || "GET").toUpperCase(),
    body: endpoint.body || {},
  });
}

/**
 * Fetch data through the two-layer cache (in-memory → sessionStorage → network).
 *
 * @param {Object} endpoint - Endpoint configuration.
 * @param {Function} fetchFn - The actual network fetch function: (endpoint) => Promise<data>.
 * @param {number} [ttlMs] - TTL in milliseconds. Defaults to DEFAULT_CACHE_TTL_MS.
 * @returns {Promise<any>}
 */
async function fetchWithCache(endpoint, fetchFn, ttlMs = DEFAULT_CACHE_TTL_MS) {
  const cacheKey = buildCacheKey(endpoint);
  const now = Date.now();

  // 1. Check in-memory promise cache with TTL (prevents duplicate simultaneous requests)
  const cached = metadataPromiseCache.get(cacheKey);
  if (cached && (now - cached.timestamp < ttlMs)) {
    return cached.promise;
  }
  // Expired — remove stale entry so it doesn't block a fresh fetch
  if (cached) {
    metadataPromiseCache.delete(cacheKey);
  }

  // 2. Check sessionStorage with TTL
  const storageKey = METADATA_CACHE_KEY_PREFIX + cacheKey;
  const storedRaw = sessionStorage.getItem(storageKey);
  if (storedRaw) {
    try {
      const stored = JSON.parse(storedRaw);
      if (stored.timestamp && (now - stored.timestamp < ttlMs)) {
        // Populate in-memory cache to avoid repeated JSON.parse on subsequent calls
        const resolvedPromise = Promise.resolve(stored.data);
        metadataPromiseCache.set(cacheKey, { promise: resolvedPromise, timestamp: stored.timestamp });
        return resolvedPromise;
      }
      // Expired — remove stale entry
      sessionStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Failed to parse cached metadata from sessionStorage, removing entry", e);
      sessionStorage.removeItem(storageKey);
    }
  }

  // 3. Fetch from network and cache with timestamp
  const promise = fetchFn(endpoint)
    .then((data) => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({ data, timestamp: now }));
      } catch (e) {
        console.warn("Failed to persist metadata to sessionStorage. Quota exceeded?", e);
      }
      return data;
    })
    .catch((err) => {
      metadataPromiseCache.delete(cacheKey);
      sessionStorage.removeItem(storageKey);
      throw err;
    });

  metadataPromiseCache.set(cacheKey, { promise, timestamp: now });
  return promise;
}

/**
 * Clear both cache layers. Useful for testing or manual invalidation.
 */
function clearMetadataCache() {
  metadataPromiseCache.clear();
  try {
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith(METADATA_CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => sessionStorage.removeItem(key));
  } catch (e) {
    // sessionStorage may be unavailable
  }
}

export {
  METADATA_CACHE_KEY_PREFIX,
  DEFAULT_CACHE_TTL_MS,
  metadataPromiseCache,
  buildCacheKey,
  fetchWithCache,
  clearMetadataCache,
};
