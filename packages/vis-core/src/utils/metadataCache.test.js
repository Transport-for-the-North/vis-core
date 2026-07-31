import {
  METADATA_CACHE_KEY_PREFIX,
  DEFAULT_CACHE_TTL_MS,
  metadataPromiseCache,
  buildCacheKey,
  fetchWithCache,
  clearMetadataCache,
} from "./metadataCache";

const ENDPOINT = { path: "/api/metadata/scenarios", requestMethod: "GET" };
const ENDPOINT_POST = { path: "/api/metadata/modes", requestMethod: "POST", body: { region: "north" } };
const MOCK_DATA = [{ id: 1, name: "Scenario A" }, { id: 2, name: "Scenario B" }];

beforeEach(() => {
  clearMetadataCache();
  sessionStorage.clear();
});

// ─── buildCacheKey ───────────────────────────────────────────────

describe("buildCacheKey", () => {
  it("produces a deterministic key from endpoint config", () => {
    const key = buildCacheKey(ENDPOINT);
    expect(typeof key).toBe("string");
    expect(key).toBe(buildCacheKey({ ...ENDPOINT }));
  });

  it("defaults method to GET when omitted", () => {
    const withoutMethod = buildCacheKey({ path: "/api/test" });
    const withGet = buildCacheKey({ path: "/api/test", requestMethod: "GET" });
    expect(withoutMethod).toBe(withGet);
  });

  it("produces different keys for different endpoints", () => {
    expect(buildCacheKey(ENDPOINT)).not.toBe(buildCacheKey(ENDPOINT_POST));
  });

  it("produces different keys when body differs", () => {
    const a = buildCacheKey({ path: "/api/test", requestMethod: "POST", body: { x: 1 } });
    const b = buildCacheKey({ path: "/api/test", requestMethod: "POST", body: { x: 2 } });
    expect(a).not.toBe(b);
  });
});

// ─── fetchWithCache — basic behaviour ────────────────────────────

describe("fetchWithCache", () => {
  it("calls the fetch function and returns the data", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn).toHaveBeenCalledWith(ENDPOINT);
  });

  it("returns cached data on the second call without re-fetching", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    await fetchWithCache(ENDPOINT, fetchFn);
    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("caches independently per endpoint", async () => {
    const fetchA = jest.fn().mockResolvedValue([1]);
    const fetchB = jest.fn().mockResolvedValue([2]);
    const a = await fetchWithCache(ENDPOINT, fetchA);
    const b = await fetchWithCache(ENDPOINT_POST, fetchB);
    expect(a).toEqual([1]);
    expect(b).toEqual([2]);
    expect(fetchA).toHaveBeenCalledTimes(1);
    expect(fetchB).toHaveBeenCalledTimes(1);
  });

  it("deduplicates concurrent requests for the same endpoint", async () => {
    let resolvePromise;
    const fetchFn = jest.fn().mockImplementation(
      () => new Promise((resolve) => { resolvePromise = resolve; })
    );

    const p1 = fetchWithCache(ENDPOINT, fetchFn);
    const p2 = fetchWithCache(ENDPOINT, fetchFn);

    resolvePromise(MOCK_DATA);

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toEqual(MOCK_DATA);
    expect(r2).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});

// ─── fetchWithCache — TTL expiry ─────────────────────────────────

describe("fetchWithCache — TTL expiry", () => {
  it("re-fetches after the TTL expires (in-memory)", async () => {
    const fetchFn = jest.fn()
      .mockResolvedValueOnce([1])
      .mockResolvedValueOnce([2]);

    await fetchWithCache(ENDPOINT, fetchFn, 100);

    // Advance past TTL
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 200);

    const result = await fetchWithCache(ENDPOINT, fetchFn, 100);
    expect(result).toEqual([2]);
    expect(fetchFn).toHaveBeenCalledTimes(2);

    Date.now.mockRestore();
  });

  it("serves from cache when within TTL", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    const now = Date.now();
    jest.spyOn(Date, "now").mockReturnValue(now);

    await fetchWithCache(ENDPOINT, fetchFn, 10000);

    // Advance but stay within TTL
    Date.now.mockReturnValue(now + 5000);
    const result = await fetchWithCache(ENDPOINT, fetchFn, 10000);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    Date.now.mockRestore();
  });
});

// ─── fetchWithCache — sessionStorage layer ───────────────────────

describe("fetchWithCache — sessionStorage", () => {
  it("persists data to sessionStorage on successful fetch", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    await fetchWithCache(ENDPOINT, fetchFn);

    const storageKey = METADATA_CACHE_KEY_PREFIX + buildCacheKey(ENDPOINT);
    const stored = JSON.parse(sessionStorage.getItem(storageKey));
    expect(stored.data).toEqual(MOCK_DATA);
    expect(typeof stored.timestamp).toBe("number");
  });

  it("serves from sessionStorage when in-memory cache is empty but sessionStorage is valid", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);

    // Populate both caches
    await fetchWithCache(ENDPOINT, fetchFn);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Clear only the in-memory cache (simulates module re-eval scenario
    // where sessionStorage was pre-populated from a prior call within TTL)
    metadataPromiseCache.clear();

    // Manually re-set sessionStorage with a fresh timestamp so TTL passes
    const storageKey = METADATA_CACHE_KEY_PREFIX + buildCacheKey(ENDPOINT);
    sessionStorage.setItem(storageKey, JSON.stringify({ data: MOCK_DATA, timestamp: Date.now() }));

    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    // Should NOT have re-fetched — sessionStorage served the data
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("ignores expired sessionStorage entries and re-fetches", async () => {
    const storageKey = METADATA_CACHE_KEY_PREFIX + buildCacheKey(ENDPOINT);
    // Pre-seed sessionStorage with an expired entry
    sessionStorage.setItem(storageKey, JSON.stringify({
      data: [{ stale: true }],
      timestamp: Date.now() - DEFAULT_CACHE_TTL_MS - 1000,
    }));

    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);

    // Expired entry should have been replaced
    const stored = JSON.parse(sessionStorage.getItem(storageKey));
    expect(stored.data).toEqual(MOCK_DATA);
  });

  it("removes corrupt sessionStorage entries and re-fetches", async () => {
    const storageKey = METADATA_CACHE_KEY_PREFIX + buildCacheKey(ENDPOINT);
    sessionStorage.setItem(storageKey, "not-valid-json{{{");

    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});

// ─── fetchWithCache — error handling ─────────────────────────────

describe("fetchWithCache — error handling", () => {
  it("clears both cache layers on fetch error", async () => {
    const error = new Error("Network failure");
    const fetchFn = jest.fn().mockRejectedValue(error);

    await expect(fetchWithCache(ENDPOINT, fetchFn)).rejects.toThrow("Network failure");

    // In-memory cache should be empty
    const cacheKey = buildCacheKey(ENDPOINT);
    expect(metadataPromiseCache.has(cacheKey)).toBe(false);

    // sessionStorage should be empty
    const storageKey = METADATA_CACHE_KEY_PREFIX + cacheKey;
    expect(sessionStorage.getItem(storageKey)).toBeNull();
  });

  it("allows retry after a failed fetch", async () => {
    const error = new Error("Temporary failure");
    const fetchFn = jest.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(MOCK_DATA);

    await expect(fetchWithCache(ENDPOINT, fetchFn)).rejects.toThrow("Temporary failure");

    // Second call should succeed
    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual(MOCK_DATA);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});

// ─── clearMetadataCache ──────────────────────────────────────────

describe("clearMetadataCache", () => {
  it("clears the in-memory cache", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    await fetchWithCache(ENDPOINT, fetchFn);
    expect(metadataPromiseCache.size).toBeGreaterThan(0);

    clearMetadataCache();
    expect(metadataPromiseCache.size).toBe(0);
  });

  it("clears metadata entries from sessionStorage without affecting other keys", async () => {
    const fetchFn = jest.fn().mockResolvedValue(MOCK_DATA);
    await fetchWithCache(ENDPOINT, fetchFn);

    // Add a non-metadata key
    sessionStorage.setItem("unrelated_key", "keep me");

    clearMetadataCache();

    const storageKey = METADATA_CACHE_KEY_PREFIX + buildCacheKey(ENDPOINT);
    expect(sessionStorage.getItem(storageKey)).toBeNull();
    expect(sessionStorage.getItem("unrelated_key")).toBe("keep me");
  });

  it("forces a re-fetch on the next call", async () => {
    const fetchFn = jest.fn()
      .mockResolvedValueOnce([1])
      .mockResolvedValueOnce([2]);

    await fetchWithCache(ENDPOINT, fetchFn);
    clearMetadataCache();

    const result = await fetchWithCache(ENDPOINT, fetchFn);
    expect(result).toEqual([2]);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
