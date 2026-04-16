/**
 * Loads bands for an app using an import map (e.g. from Vite's import.meta.glob).
 *
 * This is intentionally tolerant:
 * - If the module does not exist, returns []
 * - If the module loads but exports no `bands` array, returns []
 * - If the module throws while loading, returns []
 *
 * @param {Object} params
 * @param {Record<string, () => Promise<any>>} params.bandModules - Map of module loaders.
 * @param {string} params.bandsPath - Key within bandModules to load.
 * @param {string} [params.appName] - Optional app name for logging.
 * @param {{ warn?: Function }} [params.logger=console] - Optional logger.
 * @returns {Promise<Array>} The bands array or [].
 */
export async function loadBands({ bandModules, bandsPath, appName, logger = console }) {
  try {
    if (!bandModules || typeof bandModules !== "object") {
      logger?.warn?.(
        `Bands not loaded${appName ? ` for app: ${appName}` : ""} (invalid bandModules). Returning [].`
      );
      return [];
    }

    const loader = bandModules[bandsPath];
    if (typeof loader !== "function") {
      logger?.warn?.(
        `Bands not loaded${appName ? ` for app: ${appName}` : ""} (module not found: ${bandsPath}). Returning [].`
      );
      return [];
    }

    const module = await loader();
    const bands = module?.bands;
    if (!Array.isArray(bands)) {
      logger?.warn?.(
        `Bands not loaded${appName ? ` for app: ${appName}` : ""} (no exported 'bands' array). Returning [].`
      );
      return [];
    }

    return bands;
  } catch (error) {
    logger?.warn?.(
      `Bands not loaded${appName ? ` for app: ${appName}` : ""} (exception while loading). Returning [].`,
      error
    );
    return [];
  }
}
