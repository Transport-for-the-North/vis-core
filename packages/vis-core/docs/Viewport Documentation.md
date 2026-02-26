# Viewport documentation (vis-core)

This document explains how viewport-aware data-side filtering works in `vis-core` and how to configure it. The frontend writes the current map bbox into `FilterContext`; data endpoints are called with bbox query parameters so the backend returns only the features intersecting the viewport.

## What it does

- Captures the current map bounds (bbox) from MapLibre.
- Stores that bbox in `FilterContext` via a `mapViewport` filter.
- Optionally pushes `west/south/east/north` (and `zoom`) into the query params for data API calls, so server-side endpoints return only viewport-intersecting features.

## When to use it

Use data-side viewport filtering when:
- Your backend data endpoints accept bbox query parameters (`west`, `south`, `east`, `north`) and can filter results server-side.
- You want to reduce the size of data responses returned to the client (e.g., large point or line datasets) and avoid client-side clipping.

Do **not** enable viewport filtering for endpoints that do not accept bbox params.

## Configuration

### 1) Add a viewport filter

Add a filter of `type: "mapViewport"` to your page config. The filter records the current bbox in `FilterContext`, and actions on the filter are used to push bbox values into the page/query params that the data hooks will send to your API.

Example (based on `src/configs/cvt/pages/osRisk.js`):

```js
{
   filterName: "Viewport",
   paramName: "viewport",
   type: "mapViewport",
   target: "api",
   visualisations: ["Road OS Risk"],
   values: { source: "local", values: [] },
   actions: [
      { action: "UPDATE_QUERY_PARAMS", payload: { paramName: "west", valueKey: "west" } },
      { action: "UPDATE_QUERY_PARAMS", payload: { paramName: "south", valueKey: "south" } },
      { action: "UPDATE_QUERY_PARAMS", payload: { paramName: "east", valueKey: "east" } },
      { action: "UPDATE_QUERY_PARAMS", payload: { paramName: "north", valueKey: "north" } },
      { action: "UPDATE_QUERY_PARAMS", payload: { paramName: "zoom", valueKey: "zoom" } },
   ],
}
```

Notes:
- `Map.jsx` updates the `mapViewport` filter on `moveend` and `zoomend`.
- If a `minZoom` is configured (on the filter or inferred from visualisations), the bbox is cleared below that zoom.
- Updates are debounced (default ~250ms) and apply a small movement threshold to avoid unnecessary API calls when the bbox hasn't meaningfully changed.

### 2) Enable data-side viewport filtering for visualisations

For visualisations that fetch data (e.g., `joinDataToMap` used by `osRisk`), enable viewport filtering on the visualization and ensure the corresponding `mapViewport` filter pushes bbox params into the API query string. The data hook will include those params when calling the backend.

Example visualization config (from `osRisk.js`):

```js
{
   name: "Road OS Risk",
   type: "joinDataToMap",
   joinLayer: "OS Road Network",
   shouldFilterDataToViewport: true,
   style: "line-continuous",
   joinField: "id",
   valueField: "value",
   dataSource: "api",
   dataPath: "/api/cvt/os-risk-results",
}
```

What this does:
- When the `mapViewport` filter updates its query params (via `UPDATE_QUERY_PARAMS` actions), the visualization's data hook includes `west/south/east/north` (and `zoom` if present) in the request to `dataPath`.
- The backend should use those bbox params to filter returned features; the frontend then joins the returned data to the `joinLayer` on the map using `joinField`.

## How it works (dataflow)

1. Map viewport changes (`moveend`, `zoomend`).
2. `Map.jsx` computes bbox (lon/lat degrees): `west`, `south`, `east`, `north` (rounded to 6dp) and `zoom` (rounded to 2dp for thresholding).
3. `Map.jsx` writes the bbox into `FilterContext` via `SET_FILTER_VALUE` for the `mapViewport` filter.
4. The `mapViewport` filter dispatches any configured `actions` (commonly `UPDATE_QUERY_PARAMS`) which write `west/south/east/north/zoom` into the page/query params for data hooks.
5. Visualisations with `shouldFilterDataToViewport: true` include those params when calling their `dataPath` on the `dataSource`.
6. The backend returns only features intersecting the bbox; the frontend joins returned data to the map (e.g., `joinDataToMap`) and updates styling/interaction.

## Backend expectations

Your data endpoints should accept and validate bbox params (lon/lat degrees): `west`, `south`, `east`, `north`.

Typical patterns:
- No bounds provided → return the full dataset or server-side default pagination.
- Bounds provided → apply spatial filter and return only features intersecting the bbox.

Server-side validations to consider:
- `west < east`
- `south < north`
- Optional: enforce a maximum area or geometry count to avoid heavy responses.

## Troubleshooting

### The data doesn't appear filtered

- Confirm the page includes a `mapViewport` filter with `actions` that update query params (see `osRisk.js`).
- Confirm the visualization has `shouldFilterDataToViewport: true` and that its data hook sends query params to the correct `dataPath`.
- Confirm the backend is reading `west/south/east/north` (and `zoom` if used).

### Data endpoints stop returning data

If the data hook treats missing/cleared params as an error (e.g., required params), make sure the backend can accept absent bbox params or adjust the filter/actions to only add params when appropriate (for example, respect `minZoom`).
