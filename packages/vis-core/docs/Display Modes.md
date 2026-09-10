# Display modes

A **display mode** describes what a visualisation's numbers *mean*: the metric's own
value, an absolute change between two scenarios, or a change expressed as a percentage.
Because the mode changes what is being measured, it also changes the units — which is why
the legend subtitle and the hovertip both derive their unit from the active mode rather
than from the metric alone.

> **Not to be confused with `defaultLegendDisplayMode`** (`continuous` / `discrete`),
> which selects how the legend *renders* a scale. That setting is always spelled with the
> `legend` prefix and is documented in *Legend display mode configuration.md*. This
> document is about the meaning of the data itself.

## The enum

`DisplayMode` is exported from the library's `enums` entry point:

```javascript
import { enums } from "vis-core";
// or: import { DisplayMode } from "vis-core/enums";

enums.DisplayMode.ABSOLUTE;        // "absolute"
enums.DisplayMode.DIFFERENCE;      // "difference"
enums.DisplayMode.PCT_DIFFERENCE;  // "pct_difference"
```

The values are the tokens sent to the API as the `displayMode` query parameter, so they
must match the API contract exactly. Use the enum rather than string literals in app
config and app code so a typo fails loudly at import rather than silently selecting the
default.

Each mode has one entry in `displayModeDefinitions`, which is the only place the library
records per-mode behaviour:

```javascript
export const displayModeDefinitions = {
  [DisplayMode.ABSOLUTE]:       { unit: null },
  [DisplayMode.DIFFERENCE]:     { unit: null },
  [DisplayMode.PCT_DIFFERENCE]: { unit: "%" },
};
```

`unit: null` means "keep the metric's own unit"; a string replaces it.

## Where the mode lives

The active mode is **tracked on the visualisation in map state**, at
`state.visualisations[name].displayMode`. It is never re-derived from filter
configuration at the point of use.

```
display-mode selector
        │  dispatches UPDATE_DISPLAY_MODE  (via filter.actions, like UPDATE_LEGEND_TEXT)
        ▼
state.visualisations[name].displayMode
        │
        ├──► getVisualisationDisplayMode(visualisation)
        │            │
        │            ├──► resolveDisplayUnit(mode, baseUnit) ──► legend subtitle
        │            ├──► resolveDisplayUnit(mode, baseUnit) ──► hovertip unit
        │            └──► getMetricDefinition(..., { displayMode }) ──► band values
```

Every visualisation has a mode from the moment it is added: `ADD_VISUALISATION`
normalises whatever page config supplied, defaulting to `absolute`. Nothing downstream
has to cope with the mode being absent.

Because the legend and the hovertip call the same `resolveDisplayUnit` with the same
tracked mode, they cannot disagree about units.

## Configuring a page

Add a display-mode selector to the page's filters and give it the `UPDATE_DISPLAY_MODE`
action. This is the same pattern a metric selector uses to declare itself with
`UPDATE_LEGEND_TEXT` — the filter declares its role through the action it dispatches,
not through a marker property.

```javascript
import { enums } from "vis-core";

const displayModeFilter = {
  filterName: "Display Mode",
  paramName: "displayMode",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },   // sends displayMode to the API
    { action: "UPDATE_DISPLAY_MODE" },   // tracks it in visualisation state
  ],
  visualisations: null,                  // null = every visualisation on the page
  type: "toggle",
  values: {
    source: "local",
    values: [
      { displayValue: "Absolute", paramValue: enums.DisplayMode.ABSOLUTE },
      { displayValue: "% Difference", paramValue: enums.DisplayMode.PCT_DIFFERENCE },
    ],
  },
};
```

`visualisations: null` applies the mode to every visualisation on the page, which is
usually right: the mode describes the data the page is drawn from, not one layer's
styling. Name visualisations explicitly to scope it.

To pin a mode on a page with no selector, set `displayMode` on the visualisation in page
config; `ADD_VISUALISATION` will carry it through.

## Units

`resolveDisplayUnit(displayMode, baseUnit)` is the single unit rule:

| Mode             | Unit shown                                        |
| ---------------- | ------------------------------------------------- |
| `absolute`       | the metric's `legendSubtitleText` (e.g. Passengers) |
| `difference`     | the metric's `legendSubtitleText`                  |
| `pct_difference` | `%`                                                 |

The base unit is resolved exactly as before — from the metric selector marked
`containsLegendInfo`, or from a layer's `defaultTooltipUnitName` for the hovertip. The
mode is applied on top of it, and wins when it defines a unit, because in that mode the
number genuinely measures something else.

Units come from the enum, not from configuration: **a display mode needs no `bands.js`
entry to show correct units.**

## Optional per-mode bands

Band *values* legitimately remain app configuration. If a category's `bands.js` contains
an entry named after a mode, `getMetricDefinition` prefers it:

```javascript
{
  name: "linkTotals",
  metric: [
    { name: "Boardings", values: [...], differenceValues: [...] },
    { name: "pct_difference", differenceValues: [-100, -50, 0, 50, 100] },
  ],
}
```

A mode entry **replaces** the metric's definition rather than merging into it, so it must
be self-contained. One entry serves every metric in the category, which suits percentages
because a percentage change is unitless.

If no such entry exists, `reclassifyData` falls back to the page's
`defaultClassification`, or quantile — the map is banded from the data rather than
against the wrong scale. Configuring per-mode bands is therefore an optimisation, not a
requirement.

Switching mode clears hand-edited (custom) bands for the layer, because bands typed in
absolute terms are meaningless once the map switches to percentages. Data-driven methods
(quantile, logarithmic, Jenks) recompute themselves and are left as the user set them.

## Adding a new display mode

1. Add the token to `DisplayMode` in `src/enums/display-mode.js`.
2. Add one entry to `displayModeDefinitions`, giving `unit: null` to keep the metric's
   unit or a string to override it.
3. Offer it as a value on the page's display-mode selector.

Nothing else in the library needs to change: units, state tracking and band fallback all
key off the registry. Optionally add a matching `bands.js` entry if the mode wants its own
band values.

## Backwards compatibility

- Visualisations with no display mode default to `absolute`, whose `unit` is `null`, so
  the base unit passes through untouched. Pages that predate display modes behave exactly
  as they did.
- Existing `containsLegendInfo` metric selectors are unchanged; they still resolve the
  base unit through `UPDATE_LEGEND_TEXT`.
- `getMetricDefinition` skips the mode lookup entirely when no `displayMode` option is
  passed, so existing callers keep their previous resolution order.
- An unrecognised mode token normalises to the default rather than throwing: an app
  configured for a mode a given library version does not know about still draws its map
  in the metric's own units.
