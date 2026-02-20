# Viewport documentation (vis-core)

This document explains how **viewport-aware vector tile filtering** works in `vis-core` and how to configure it.

## What it does

- Captures the current map bounds (bbox) from MapLibre.
- Stores that bbox in `FilterContext` via a `mapViewport` filter.
- For configured **vector tile layers**, appends `west/south/east/north` to each tile request **without recreating the MapLibre source/layers**.

This avoids the “layer flicker / clearing on zoom” issue that can occur when a tile source is removed and re-added on every viewport update.

## When to use it

Use viewport filtering when:
- Your backend vector tile endpoint supports `west`, `south`, `east`, `north` query parameters.
- You want to reduce the amount of data returned for a tile request (e.g., dense line networks).

Do **not** use it for non-tile API calls unless your data endpoint actually accepts these params.

## Configuration

### 1) Add a viewport filter

Add a filter of `type: "mapViewport"` to your page config. The filter stores bbox in `FilterContext`.

Example:

```js
{
  filterName: "Viewport",
  paramName: "viewport",
  type: "mapViewport",
  target: "api",
  values: { source: "local", values: [] },

  // Optional: if you also want to push bbox into query params for a data endpoint,
  // you can add actions. For viewport-filtered tiles, actions are not required.
  actions: [],
}
```

Notes:
- `Map.jsx` is responsible for updating this filter on `moveend` and `zoomend`.
- If a `minZoom` is configured (directly on the filter, or inferred from join layers), the bbox is cleared below that zoom.
- Updates are debounced (default 250ms) and also apply a small “movement threshold” to avoid excessive updates when the bbox hasn’t meaningfully changed.

### 2) Enable viewport bounds on a vector tile layer

In your layer config:

```js
{
  name: "OS Road Network",
  type: "tile",
  source: "api",
  path: "/api/vectortiles/cvt_os_roads/{z}/{x}/{y}",

  appendViewportParamsToTiles: true,
  viewportFilterParamName: "viewport", // optional, defaults to "viewport"
}
```

What this does:
- `Layer.jsx` keeps the tile template URL **stable** but adds a marker query param `__viewport=1`.
- `Layer.jsx` also stores the latest bbox on the MapLibre instance (`map.__viscoreViewportBbox`).
- `useMap.jsx` uses MapLibre’s `transformRequest` hook to append `west/south/east/north` to every tile request when it sees `__viewport=1`.

## How it works (dataflow)

1. **MapLibre viewport changes** (`moveend`, `zoomend`).
2. `Map.jsx` computes bbox (lon/lat degrees):
   - `west`, `south`, `east`, `north` (rounded to 6dp)
   - `zoom` (rounded to 2dp; used for change detection/thresholding, not sent to the backend)
3. `Map.jsx` writes bbox into `FilterContext` via `SET_FILTER_VALUE` for the `mapViewport` filter.
4. `Layer.jsx` reads bbox from `FilterContext` and stores it on each map instance:
   - `map.__viscoreViewportBbox = { west, south, east, north, zoom }`
5. Tile layers with `appendViewportParamsToTiles: true` get a stable tiles URL with `__viewport=1`.
6. `useMap.jsx` `transformRequest` intercepts tile requests and appends:
   - `west`, `south`, `east`, `north`

## Backend expectations

Your vector tile endpoint should accept and validate:
- `west < east`
- `south < north`

The bbox values sent from the frontend are in lon/lat degrees (from MapLibre bounds).

The typical pattern is:
- No bounds provided → return normal tile content.
- Bounds provided → apply a spatial constraint and return only intersecting features.

## Troubleshooting

### The map clears or flickers

This usually happens when the tile **source is removed/re-added** during viewport updates.

With the current approach, viewport bounds are appended per-request using `transformRequest`, so the source/layers should remain mounted.

### The layer doesn’t seem filtered

- Confirm the layer has `appendViewportParamsToTiles: true`.
- Confirm the backend is reading `west/south/east/north` query params.
- Confirm the viewport filter exists and is of type `mapViewport`.

### Data endpoints stop returning data

If you previously pushed viewport bounds into **visualisation query params**, the data hook may treat missing/cleared params as “required params missing”.

Fix: keep viewport bounds for **tiles only** (use `appendViewportParamsToTiles`) unless the data endpoint explicitly supports bbox params.
