# SVGGalleryManager Configuration Guide

This guide explains how to configure and use the **SVGGalleryManager** component for displaying dynamic SVG galleries with legends and caveats.

## Overview

The SVGGalleryManager is a fully configuration-driven component that renders:
- Dynamic SVG schematic galleries
- Conditional legends (based on filter selections)
- Conditional caveats (warning/info sections based on filter selections)
- Cascading filter dropdowns
- Responsive grid layout

All behaviour is driven by a page configuration object—no code changes needed to add new schematics, legends, or filters.

## Component Location

```
src/Components/SvgGalleryManager/SvgGalleryManager.jsx
```

## Configuration Structure

The component accepts a `config` object with the following structure:

```javascript
{
  pageTitle: "Railway Network Schematic Diagrams",
  pageSubtitle: "View and compare route options...",
  apiQuery: "/api/getgenericdataset?dataset_id=avp_data.network_schematics",
  
  legends: [
    {
      name: "Full Network Legend",
      filter: "View",
      match: "=== Full Network",
      path: "public/img/avp/networkSchematicLegends/Legend_FullNetwork.svg"
    },
    {
      name: "Corridor Legend",
      filter: "View",
      match: "!= Full Network",
      path: "public/img/avp/networkSchematicLegends/Legend_Corridors.svg"
    }
  ],
  
  caveats: [
    {
      name: "Full Network",
      filter: "View",
      match: "=== Full Network",
      text: "<p>Each line represents an hourly service...</p>"
    }
  ],
  
  metadataTables: [
    {
      name: "network_schematics_metadata",
      path: "/api/getgenericdataset?dataset_id=avp_data.network_schematics"
    }
  ],
  
  filters: [
    {
      filterName: "Network Scenario",
      paramName: "networkId",
      target: "api",
      actions: [{ action: "UPDATE_QUERY_PARAMS" }],
      type: "dropdown",
      values: {
        source: "metadataTable",
        metadataTableName: "network_schematics_metadata",
        displayColumn: "network",
        paramColumn: "network_id",
        sort: "descending",
        where: [{ column: "id", operator: "notNull" }]
      },
      shouldFilterOthers: true
    }
  ]
}
```

## Configuration Properties

### Top-Level

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `pageTitle` | string | Yes | Main heading displayed at the top |
| `pageSubtitle` | string | No | Descriptive text below the title |
| `apiQuery` | string | Yes | Base API endpoint for fetching schematic data |
| `legends` | array | No | Array of legend definitions |
| `caveats` | array | No | Array of caveat/warning definitions |
| `metadataTables` | array | Yes | Metadata sources for filter dropdowns |
| `filters` | array | Yes | Filter dropdown definitions |

### Legends

**Purpose:** Display reference images alongside schematics, conditionally shown based on selected filters.

```javascript
{
  name: "Full Network Legend",        // Displayed as title above legend image
  filter: "View",                     // Filter name to match against
  match: "=== Full Network",          // Matching rule (see Matching Syntax)
  path: "public/img/...svg"           // Path to legend image; normalised automatically
}
```

**Matching Syntax:**
- `"=== value"` – Show when filter equals "value" (case-insensitive)
- `"!= value"` – Show when filter does NOT equal "value" (case-insensitive)
- Plain value (backward compat) – Show when filter equals value
- Omit `filter` property – Always show regardless of filter selection

### Caveats

**Purpose:** Display context-specific information (warnings, notes) based on selected filters.

```javascript
{
  name: "Full Network",               // Caveat title
  filter: "View",                     // Filter name to match against
  match: "=== Full Network",          // Matching rule (same syntax as legends)
  text: "<p>Each line represents...</p>" // HTML content; supports dangerouslySetInnerHTML
}
```

**Key Behaviours:**
- Caveats only display after the user adds at least one schematic
- Multiple matching caveats display side-by-side
- De-duplication prevents identical text from appearing twice
- HTML content is rendered as markup (not escaped)

### Metadata Tables

**Purpose:** Define data sources for populating filter dropdowns.

```javascript
{
  name: "network_schematics_metadata",     // Reference name used by filters
  path: "/api/getgenericdataset?dataset_id=..." // API endpoint returning row data
}
```

The endpoint response should be one of:
- Direct array: `[{...}, {...}]`
- `.data` property: `{ data: [{...}, ...] }`
- `.rows` property: `{ rows: [{...}, ...] }`
- `.result` property: `{ result: [{...}, ...] }`

### Filters

**Purpose:** Define dropdown filters for querying schematics.

```javascript
{
  filterName: "Network Scenario",          // User-facing dropdown label
  paramName: "networkId",                 // Query parameter name when submitting
  target: "api",                          // Where to send the filter (usually "api")
  actions: [{ action: "UPDATE_QUERY_PARAMS" }], // Update API query params
  type: "dropdown",                       // Dropdown input type
  
  values: {
    source: "metadataTable",              // Populate from metadata table
    metadataTableName: "...",             // Which metadata table to use
    displayColumn: "network",             // Column to show in dropdown
    paramColumn: "network_id",            // Column to send as param value
    sort: "descending",                   // Sort order: "ascending" or "descending"
    where: [                              // Optional: filter rows before populating
      { column: "id", operator: "notNull" }
    ]
  },
  
  shouldFilterOthers: true,   // If true, dependent filters re-populate when this changes
  shouldBeFiltered: false     // If true, this filter is dependent on others
}
```

### Filter Dependencies

Use `shouldFilterOthers` and `shouldBeFiltered` to create cascading filters:
- **Filter A** with `shouldFilterOthers: true` → When A changes, recalculate Filter B's options
- **Filter B** with `shouldBeFiltered: true` → B's options depend on A's selection

Example: Select "Network Scenario" → "View" dropdown updates to only show views for that network.

## Helper Functions

All helper functions for SVG gallery operations are in:

```
src/utils/svgGalleryManagerHelpers.js
```

### Exported Functions

| Function | Purpose |
|----------|---------|
| `normaliseText(value)` | Normalise text for case-insensitive comparison |
| `normaliseAssetPath(path)` | Convert relative asset paths (e.g., "public/..." → "/...") |
| `normaliseRows(response)` | Detect and extract row array from various API response shapes |
| `ruleMatchesSelectedValue(rule, value)` | Check if a legend/caveat rule matches a selected value |
| `resolveSvgUrl(row)` | Detect SVG source from multiple column names or raw markup |
| `sortOptions(options, sortConfig)` | Sort option objects by displayValue |
| `applyWhereConditions(rows, where)` | Filter rows based on where conditions |

## SVG Data Format

The API endpoint should return rows with one of these SVG fields:

**Raw SVG Markup (preferred for complex diagrams):**
```javascript
{
  network: "Lower Cost",
  // SVG can be in any of these columns:
  svg: "<?xml version=\"1.0\"?><svg>...</svg>",
  svg_text: "<svg>...</svg>",
  svgText: "<svg>...</svg>",
  svg_markup: "<svg>...</svg>",
  svgContent: "<svg>...</svg>"
  // ... other fields
}
```

**SVG URL:**
```javascript
{
  network: "Lower Cost",
  svg_url: "/images/diagram.svg",       // or
  svgUrl: "/images/diagram.svg",        // or
  url: "/images/diagram.svg"
}
```

The component automatically:
1. Scans for SVG text in 8 candidate column names
2. Falls back to scanning all row values for any `<svg` substring
3. Encodes raw SVG markup as `data:image/svg+xml;utf8,...` data URI
4. Falls back to URL fields if no markup is found

## Example Page Configuration

```javascript
// config file example from your application

export const createNetworkSchematicsPage = () => ({
  pageName: "Network Schematics",
  url: "/network-schematics",
  type: "SVGGalleryManager",
  
  config: {
    pageTitle: "Railway Network Schematic Diagrams",
    pageSubtitle: "View and compare route options across different network corridors.",
    apiQuery: "/api/getgenericdataset?dataset_id=avp_data.network_schematics",
    
    legends: [
      {
        name: "Full Network Legend",
        filter: "View",
        match: "=== Full Network",
        path: "public/img/avp/networkSchematicLegends/Legend_FullNetwork.svg"
      },
      {
        name: "Corridor Legend",
        filter: "View",
        match: "!= Full Network",
        path: "public/img/avp/networkSchematicLegends/Legend_Corridors.svg"
      }
    ],
    
    caveats: [
      {
        name: "Full Network",
        filter: "View",
        match: "=== Full Network",
        text: `<p>Each line represents an hourly service.</p>
               <p>Journey times reflect current assumptions and are still under review.</p>`
      },
      {
        name: "Corridor",
        filter: "View",
        match: "!= Full Network",
        text: `<p>Corridor views show only the selected corridor.</p>`
      }
    ],
    
    metadataTables: [
      {
        name: "network_schematics_metadata",
        path: "/api/getgenericdataset?dataset_id=avp_data.network_schematics"
      }
    ],
    
    filters: [
      {
        filterName: "Network Scenario",
        paramName: "networkId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "network_schematics_metadata",
          displayColumn: "network",
          paramColumn: "network_id",
          sort: "descending",
          where: [{ column: "id", operator: "notNull" }]
        },
        shouldFilterOthers: true
      },
      {
        filterName: "View",
        paramName: "viewId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "network_schematics_metadata",
          displayColumn: "view",
          paramColumn: "view_id",
          sort: "descending",
          where: [{ column: "id", operator: "notNull" }]
        },
        shouldBeFiltered: true
      }
    ]
  }
});
```

## Styling

The component uses `styled-components` and includes:
- Fully responsive grid layout (adapts to mobile with 1 column)
- Card-based schematic display with full-width SVG rendering
- Caveat warning cards displayed side-by-side
- Legend images with responsive sizing
- Optimised SVG scaling with `object-fit: contain`

All styling is encapsulated within the component file; override by using CSS specificity or styled-component composition.

## Data Flow

1. **Page load** → Load metadata tables for all filters
2. **Filter dropdown change** → Dependent filters recalculate based on selection
3. **User selects filters** → "Add" button becomes active when all required filters selected
4. **User clicks "Add"** → Query API with selected param values
5. **API returns rows** → Filter rows to only those matching selected param values
6. **Cards display** → Activate conditional legends & caveats based on filter selections
7. **User clicks "Remove"** → Delete schematic card from gallery

## Responsive Layout

The component is fully responsive:
- **Desktop (> 768px):** Multi-column grid with width-adaptive card sizing
- **Mobile (≤ 768px):** Single column layout
- **SVG scaling:** Images scale to fill container using `width: 100%; height: 100%` with `object-fit: contain`
- **Legend sizing:** Responsive legend grid with `minmax(280px, 1fr)` columns

## Troubleshooting

### SVG not displaying
- Ensure API returns response with `svg_text`/`svg`/`svgText` columns containing HTML markup
- Check browser console for data URI encoding errors
- Verify SVG markup is valid XML/HTML
- Confirm component `ImageWrapper` CSS allows SVG to scale (`width: 100%; height: 100%`)

### Caveats not showing
- Confirm caveats only display after adding a schematic (expected behaviour)
- Check that filter names in caveat config match filter names in filter definitions (case-insensitive)
- Verify match syntax: `"=== Value"` (with spaces and exact case after operator)
- Ensure caveat text is not empty

### Legends not showing
- Same match syntax and filter name requirements as caveats
- Verify legend image paths exist and are accessible
- Check that paths start with `public/` for relative URLs or are absolute URLs

### Filters not populating
- Verify metadata table exists and has been loaded (check Network tab in DevTools)
- Check `metadataTableName` spelling matches metadata table definition exactly
- Ensure `displayColumn` and `paramColumn` names exist in the API response
- Verify `where` conditions are properly formatted: `{ column: "fieldName", operator: "notNull" }`

### Type mismatch in filter matching
- HTML select values are always strings; ensure API data coerces to strings when comparing
- Use `applyWhereConditions` which automatically converts values to strings for comparison
- Filter matching logic (`ruleMatchesSelectedValue`) uses case-insensitive comparison

## Performance Considerations

- Legends only render when matched (filtered by useMemo hook)
- Caveats de-duplicated to prevent rendering identical content twice
- API calls include query parameters to reduce result set size
- Dependent filter options recalculated only when parent filter changes
