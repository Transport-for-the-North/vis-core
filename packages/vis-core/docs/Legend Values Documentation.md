# Legend Values Documentation (vis-core)

This document explains how legend text can be controlled from filter configuration using `legendValues`.

## Overview

`legendValues` lets you update legend text when a filter value changes.

It supports updating:
- `displayValue` (legend title text)
- `legendSubtitleText` (legend subtitle text)

The behaviour is handled by the `UPDATE_LEGEND_TEXT` action in the map reducer.

## Where to Configure It

Add `legendValues` on a filter that dispatches:

```js
actions: [
  { action: "UPDATE_QUERY_PARAMS" },
  { action: "UPDATE_LEGEND_TEXT" },
]
```

Typical place:
- A dropdown filter used to select metrics/hazards.

## Config Shape

```js
legendValues: [
  {
    // Optional visualisation targeting
    visualisationName: "Road NoHAM Risk",

    legendDisplayValueRules: {
      byDisplayValue: {
        "Impact Score": "Impact on NoHAM Network",
      },
      byParamValue: {
        "3": "Impact on NoHAM Network",
      },
      default: "Risk on NoHAM Network",
    },

    legendSubtitleTextValueRules: {
      byDisplayValue: {
        "Impact Score": "Impact Score (0-100)",
      },
      byParamValue: {
        "3": "Impact Score (0-100)",
      },
      default: "Score (0-100)",
    },
  },
]
```

## Rule Matching Behaviour

Rules are evaluated case-insensitively and with trimmed whitespace.

For both `legendDisplayValueRules` and `legendSubtitleTextValueRules`, the matching order is:
1. `byDisplayValue` (matches the selected option `displayValue`)
2. `byParamValue` (matches the selected option `paramValue`)
3. `default`
4. Existing visualisation legend text (fallback)

## Visualisation Targeting

Each `legendValues` entry can optionally target a specific visualisation:
- `visualisationName`
- `visualisation` (legacy alias)

Selection order for an entry:
1. First entry where `visualisationName === currentVisualisationName`
2. First entry where `visualisation === currentVisualisationName`
3. First entry in the array

If no `legendValues` entry is found, reducer falls back to legacy top-level filter keys.

## Backwards Compatibility

The reducer still supports older filter-level keys:
- `legendDisplayValueRules`
- `legendSubtitleTextRules`
- `legendSubtitleTextValueRules`

If both are present, `legendValues` takes precedence.

## Practical Example (NoHAM)

```js
const nrMainHazardRiskSelector = {
  filterName: "Main Hazard",
  paramName: "mainHazardId",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" },
  ],
  legendValues: [
    {
      legendDisplayValueRules: {
        byDisplayValue: {
          "Impact Score": "Impact on NoHAM Network",
        },
        default: "Risk on NoHAM Network",
      },
      legendSubtitleTextValueRules: {
        default: "Score (0-100)",
      },
    },
  ],
  // ...
};
```

Result:
- If selected display value is `Impact Score`, the legend title becomes `Impact on NoHAM Network`.
- Otherwise, legend title becomes `Risk on NoHAM Network`.
- Subtitle stays `Score (0-100)` for all values (from default rule).

## Troubleshooting

### Legend text not updating

Check all of the following:
- Filter dispatches `UPDATE_LEGEND_TEXT`.
- Filter has `visualisations` populated (the reducer updates those names).
- Selected value exists in `filter.values.values`.
- Rule keys are spelt correctly:
  - `legendDisplayValueRules`
  - `legendSubtitleTextValueRules`

### Subtitle disappears unexpectedly

Add a `default` under `legendSubtitleTextValueRules`.

If you do not provide subtitle rules, the reducer falls back to:
- selected option subtitle when available, then
- existing visualisation subtitle.

### Rules do not match expected value

Remember matching uses selected filter option fields:
- `byDisplayValue` compares against option `displayValue`
- `byParamValue` compares against option `paramValue`

Make sure values in metadata map to the expected option fields.
