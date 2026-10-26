/**
 * Registry of per-map runtime restorers.
 *
 * Each restorer is a zero-argument async function registered by a component
 * (e.g. MapVisualisation) that knows how to replay its own feature state after
 * a style reload. The transition coordinator calls restoreMapRuntimeState() once
 * after setStyle completes for a map.
 *
 * Maps remain independent — left and right dual-map restorers never interfere.
 */

const restorersByMap = new WeakMap();

/**
 * Registers a restorer for a map + key pair.
 * If a restorer already exists for that key on the map, it is replaced.
 *
 * Returns a cleanup function that unregisters the restorer.
 *
 * @param {maplibregl.Map} map
 * @param {string} key - Unique key for this restorer (e.g. "feature-state:layerName").
 * @param {() => boolean} restore - Returns true if restoration succeeded.
 * @returns {() => void}
 */
export function registerMapRestorer(map, key, restore) {
  if (!restorersByMap.has(map)) {
    restorersByMap.set(map, new Map());
  }
  restorersByMap.get(map).set(key, restore);

  return () => {
    unregisterMapRestorer(map, key);
  };
}

/**
 * Removes a restorer for a map + key pair.
 *
 * @param {maplibregl.Map} map
 * @param {string} key
 */
export function unregisterMapRestorer(map, key) {
  restorersByMap.get(map)?.delete(key);
}

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 200;

/**
 * Runs all restorers registered for a map, retrying failed ones up to MAX_ATTEMPTS
 * times with RETRY_DELAY_MS between retries.
 *
 * Restorers that succeed are not retried. Stops immediately if cancelled.
 *
 * @param {Object} params
 * @param {maplibregl.Map} params.map
 * @param {() => boolean} params.isCancelled - Returns true if the operation should abort.
 * @returns {Promise<void>}
 */
export async function restoreMapRuntimeState({ map, isCancelled }) {
  const restorers = restorersByMap.get(map);
  if (!restorers || restorers.size === 0) return;

  const pending = new Set(restorers.keys());

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (isCancelled()) return;
    if (pending.size === 0) return;

    const failed = new Set();

    for (const key of pending) {
      if (isCancelled()) return;
      const restore = restorers.get(key);
      if (!restore) continue;
      try {
        const ok = await restore();
        if (!ok) failed.add(key);
      } catch {
        failed.add(key);
      }
    }

    if (failed.size === 0) return;

    // Replace pending with only the ones that failed.
    pending.clear();
    failed.forEach((k) => pending.add(k));

    if (attempt < MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}
