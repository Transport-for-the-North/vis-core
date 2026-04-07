# Metadata Filtering

## Overview

This document describes the client-side metadata-filtering flow introduced for apps that need to restrict the values available from a metadata table.

The current use case is NoRMS, where the app should:

- expose a runtime `visualiserAppName`
- request the list of valid filter values for that app
- intersect that list with the full metadata table
- pass the filtered scenario rows down to the existing visualisation state

## Runtime Flow

### 1. App configuration resolves `visualiserAppName`

Both app bootstraps now ensure that `visualiserAppName` is available in `AppContext`:

- `src/App.jsx`
- `packages/vis-core/src/Components/BaseApp/BaseApp.jsx`

The runtime value is resolved as:

1. `initialAppConfig.visualiserAppName`
2. otherwise `null`

This allows an app to explicitly set a value such as `Sandbox` without changing the folder name used by the app loader.

If `visualiserAppName` is not provided, `AppContext.visualiserAppName` remains `null` and the client-side metadata-filtering request is skipped.

### 2. App opts into metadata filtering

Apps enable this behaviour by adding a `metadataFiltering` block to their app config.

Example:

```javascript
export const appConfig = {
  visualiserAppName: "Sandbox",
  metadataFiltering: {
    path: "/api/norms-app-scenario",
    queryParamName: "appName",
    metadataTableName: "input_norms_scenario",
    metadataColumn: "id",
  },
};
```

Config fields:

- `path`: endpoint that returns valid filter values
- `queryParamName`: query-string parameter used to send the current app name
- `metadataTableName`: metadata table to filter
- `metadataColumn`: metadata-table column used for the intersection

### 3. `MapContext` filters the metadata table

`packages/vis-core/src/contexts/MapContext.jsx` performs the filtering during metadata-table initialisation.

The flow is:

1. Read `appContext.metadataFiltering`
2. Call the configured endpoint with the current `appContext.visualiserAppName`
3. Read the response as a flat array of valid filter values
4. Convert the values into a `Set`
5. Fetch each metadata table as normal
6. When the configured metadata table is reached, filter its rows by the configured metadata column and value set

Only the configured metadata table is filtered. Other metadata tables are left unchanged.

## Expected API Shape

The current implementation assumes the endpoint returns a flat JSON array of primitive values.

Example responses:

```json
[2, 3, 11, 15, 24, 30, 37, 45, 0]
```

```json
["QGK_2042", "QGN_2042"]
```

This is intentionally simple. The code does not try to support nested objects or alternative response shapes.

## How Filtered Scenarios Reach Visualisations

`packages/vis-core/src/reducers/mapReducer.js` stores the filtered rows in state and attaches them to visualisation configs.

This happens in two places:

- `SET_FILTERED_SCENARIOS` stores the rows and reapplies them to existing visualisations
- `ADD_VISUALISATION` attaches the current `filteredScenarios` list to newly added visualisations

As a result, the existing visualisation pipeline can continue to use the same state structure, while also receiving:

```javascript
visualisation.filteredScenarios
```

This avoids adding custom metadata-filter plumbing to individual map or card components.

## Current NoRMS Usage

The NoRMS app config currently uses:

- `visualiserAppName: "Sandbox"`
- `path: "/api/norms-app-scenario"`
- `queryParamName: "appName"`
- `metadataTableName: "input_norms_scenario"`
- `metadataColumn: "id"`

With this configuration, the full `input_norms_scenario` metadata table is intersected with the values returned for `Sandbox`.

## Assumptions

This implementation assumes:

- the metadata-filter endpoint returns a flat array of primitive values
- the relevant metadata lives in one known metadata table
- the metadata column used for comparison is stable

If another app uses a different metadata table name or metadata column, only the config should need to change.

If the endpoint response shape changes away from a flat array, `MapContext` will need to be updated.

## Summary

This feature keeps metadata filtering at the client boundary:

- app config declares the app name and metadata-filter settings
- `MapContext` performs the intersection once
- reducer state exposes the filtered rows to existing visualisation configs

That keeps the behaviour centralised and avoids special-case logic in individual components.