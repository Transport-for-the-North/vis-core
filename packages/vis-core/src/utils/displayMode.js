import {
  DisplayMode,
  DEFAULT_DISPLAY_MODE,
  displayModeDefinitions,
} from "enums/display-mode";

/**
 * Whether a value is a display mode the library knows about.
 *
 * @param {*} value - Candidate mode token.
 * @returns {boolean} True when the token is a recognised display mode.
 */
export const isDisplayMode = (value) =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(displayModeDefinitions, value);

/**
 * Coerce an arbitrary value to a usable display mode.
 *
 * Unknown or missing tokens fall back to the default rather than throwing: a page may
 * be configured with a mode this version of the library has not learned about yet, and
 * the map is more useful drawn in the metric's own units than not drawn at all.
 *
 * @param {*} value - Candidate mode token.
 * @returns {string} A recognised display mode token.
 */
export const normaliseDisplayMode = (value) =>
  isDisplayMode(value) ? value : DEFAULT_DISPLAY_MODE;

/**
 * Read the display mode a visualisation is currently drawn in.
 *
 * This is the single accessor for display mode across the library. It reads the mode
 * tracked on the visualisation itself (see the UPDATE_DISPLAY_MODE reducer action)
 * rather than re-deriving it from filter configuration at each call site, so the
 * legend, the hovertip and the band resolution cannot disagree about the active mode.
 *
 * @param {Object} [visualisation] - A visualisation record from map state.
 * @returns {string} The active display mode, defaulting to absolute.
 */
export const getVisualisationDisplayMode = (visualisation) =>
  normaliseDisplayMode(visualisation?.displayMode);

/**
 * Resolve the unit to show for a value drawn in a given display mode.
 *
 * The mode wins over the base unit when it defines one, because in that mode the number
 * genuinely measures something else: a percentage change of "Passengers" is a
 * percentage, not passengers. Modes that leave the units alone return the base unit
 * untouched, which is what keeps absolute and difference views reading as they always
 * have.
 *
 * @param {string} displayMode - The active display mode.
 * @param {string} [baseUnit] - The metric's own unit, from its `legendSubtitleText`.
 * @returns {string} The unit to display, or "" when there is none.
 */
export const resolveDisplayUnit = (displayMode, baseUnit) => {
  const definition = displayModeDefinitions[normaliseDisplayMode(displayMode)];

  return definition?.unit ?? baseUnit ?? "";
};

/**
 * Resolve the unit for a visualisation, given the base unit already worked out by the
 * caller. A convenience over `resolveDisplayUnit` for the common case where the caller
 * holds the visualisation record.
 *
 * @param {Object} [visualisation] - A visualisation record from map state.
 * @param {string} [baseUnit] - The metric's own unit.
 * @returns {string} The unit to display.
 */
export const resolveVisualisationUnit = (visualisation, baseUnit) =>
  resolveDisplayUnit(getVisualisationDisplayMode(visualisation), baseUnit);

export { DisplayMode, DEFAULT_DISPLAY_MODE, displayModeDefinitions };
