# Categorical Colour State Documentation

This note explains how categorical colour state works in `vis-core`.

## Overview

Categorical colours are saved in map state and reused whenever the map or legend is rebuilt.

This helps keep colour use consistent across filter changes, legend rebuilds, and other state updates.

## What Was Added

### Stable cache keys

`buildCategoricalLegendKey` was added in `src/utils/map.js`.

It creates a key like this:

```text
fieldname::value
```

The field name and value are trimmed and changed to lower case so the same category always maps to the same key.

### A categorical colour cache

`categoricalLegendCache` was added to `MapContext` state and is handled in `mapReducer`.

The reducer supports these actions:

- `REGISTER_CATEGORICAL_LEGEND_ITEMS`
- `MERGE_CATEGORICAL_LEGEND_CACHE`
- `CLEAR_CATEGORICAL_LEGEND_CACHE`

`RESET_CONTEXT` keeps the cache so colour assignments are not lost during page reset.

### Cache seeding from filters

`MapContext` now seeds the cache from filter values that already have a `colourValue`.

This means configured colours can be used straight away by both the map and the legend.

### Cache-aware colour assignment

`resolveCategoricalColours` was added in `src/utils/map.js`.

This helper:

- sorts categorical bins into a stable order
- reuses cached colours where they already exist
- reserves cached colours before assigning new ones
- gives new categories the next free palette colour
- returns new cache entries so they can be stored

The reservation step matters because it stops two visible categories being given the same colour.

### Cache-aware map styling

`MapVisualisation.jsx` now uses the cache for categorical styling in:

- join-data-to-map visualisations
- GeoJSON visualisations

For categorical layers it now:

1. works out which cache field to use
2. resolves colours through `resolveCategoricalColours`
3. applies selected filter colour overrides where needed
4. stores any new cache entries
5. saves `legendCacheField` in layer metadata for the legend

### Cache-aware legend rebuilds

`DynamicLegend.jsx` now prefers cached categorical colours when it rebuilds legend entries.

This keeps the legend in step with the map.

## Runtime Flow

1. `MapContext` starts the cache and seeds it from filter `colourValue` entries.
2. `MapVisualisation` reclassifies the data and resolves colours through the cache.
3. Existing cached colours are reused first.
4. New categories get the next unused palette colour.
5. New entries are saved in reducer state.
6. `DynamicLegend` uses the same cache when it rebuilds the legend.

## Main Files

- `src/utils/map.js`
- `src/contexts/MapContext.jsx`
- `src/reducers/mapReducer.js`
- `src/Components/MapLayout/MapVisualisation.jsx`
- `src/Components/MapLayout/Layer.jsx`
- `src/hooks/useFeatureStateUpdater.jsx`
- `src/Components/DynamicLegend/DynamicLegend.jsx`

## Tests Added

The change was covered with focused tests in:

- `src/utils/map.test.js`
- `src/reducers/mapReducer.test.js`
- `src/Components/DynamicLegend/DynamicLegend.test.jsx`

These tests cover key creation, cache reuse, colour stability, duplicate-colour prevention, reducer behaviour, and legend rebuild behaviour.

## Rules To Keep

1. A category should keep the same colour for the same cache field once it has been assigned.
2. Visible categories should not share the same colour unless the palette has run out.
3. Filter `colourValue` should win where it is defined.
4. The legend should use the same cache as the map.
5. Page reset should not clear saved categorical colour assignments.

## Future Notes

- `legendCacheField` is the important layer metadata used by the legend.
- New categorical visualisations should use `resolveCategoricalColours` instead of assigning palette values directly.
- If category labels are reformatted for display, the cache key should still be based on the stable source value.
