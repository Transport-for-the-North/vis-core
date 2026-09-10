/**
 * Enum for the display mode a visualisation's values are expressed in.
 *
 * A display mode describes *what the numbers mean*, not how they are drawn: the same
 * metric can be shown as its own absolute value, as an absolute change between two
 * scenarios, or as a percentage change. Because the numbers change meaning, so do their
 * units — which is why the legend subtitle and the hovertip both derive their unit from
 * the active mode rather than from the metric alone.
 *
 * NOTE: This is unrelated to `defaultLegendDisplayMode` (`continuous` / `discrete`),
 * which selects how the legend *renders* a scale. That one is always spelled with the
 * `legend` prefix; this one is the value semantics of the data itself.
 *
 * The values are the tokens sent to the API as the `displayMode` query parameter, so
 * they must match the API contract exactly.
 */
export const DisplayMode = {
  /** The metric's own value, in the metric's own units. */
  ABSOLUTE: "absolute",
  /** An absolute change between two scenarios, still in the metric's own units. */
  DIFFERENCE: "difference",
  /** A change expressed as a percentage of the base scenario, so unitless bar the sign. */
  PCT_DIFFERENCE: "pct_difference",
};

/**
 * The mode assumed when a visualisation does not declare one.
 *
 * Absolute is the historical behaviour: units come from the metric and nothing is
 * rewritten, so visualisations predating display modes keep working untouched.
 */
export const DEFAULT_DISPLAY_MODE = DisplayMode.ABSOLUTE;

/**
 * Per-mode behaviour, keyed by mode token.
 *
 * `unit` is the unit the mode forces on the legend subtitle and the hovertip:
 *   - `null` means "keep the metric's own unit" (from its `legendSubtitleText`).
 *   - a string replaces it, because the mode has changed what the number measures.
 *
 * To add a display mode: add its token to `DisplayMode`, add one entry here, and offer
 * it as a value on the page's display-mode selector. Nothing else in the library needs
 * to change — band values remain optional per-mode config in the app's `bands.js`.
 */
export const displayModeDefinitions = {
  [DisplayMode.ABSOLUTE]: { unit: null },
  [DisplayMode.DIFFERENCE]: { unit: null },
  [DisplayMode.PCT_DIFFERENCE]: { unit: "%" },
};
