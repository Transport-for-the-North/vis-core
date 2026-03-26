# Dashboard Documentation

This document explains how `DashboardPage` in `vis-core` works and how it links configuration, data fetching, layout, and chart rendering.

The dashboard feature is configuration-driven. In practice, you define a page with `type: 'Dashboard'`, provide a data endpoint, add filters, and declare a `charts` array. `vis-core` then handles filter initialisation, data fetching, layout, and chart rendering.

Chart-specific detail now lives in `Charting_Documentation.md`.

## Main files

- `src/Components/DashboardPage/DashboardPage.jsx`
- `src/Components/DashboardPage/DashboardSidebar.jsx`
- `src/Components/Charts/ChartRenderer.jsx`
- `src/hooks/useFetchVisualisationData*`

## How DashboardPage links data and charts together

The data flow is:

1. `DashboardPage` reads the current page configuration from `PageContext`.
2. `useDashboardFilters()` loads metadata tables where needed, builds filter definitions, and initialises filter state.
3. `resolveDashboardEndpoint()` reads the configured dashboard endpoint from `config.dataEndpoint`, `pageContext.dataPath`, or `config.dataPath`.
4. `buildVisualisation()` turns the current filter state into `queryParams` and `pathParams` for the request.
5. `useFetchVisualisationData()` calls the dashboard endpoint and returns `isLoading`, `data`, and `error`.
6. `DashboardSidebar` renders the filter controls and sends user changes back into filter state.
7. `DashboardPage` normalises the grid layout and passes `config.charts`, fetched `data`, and any custom `formatters` to `ChartRenderer`.
8. `ChartRenderer` loops through the configured charts and picks the correct chart component for each item.
9. Each chart component interprets the shared dataset through its own config and renders a card, chart, or table.

## Dashboard fetch pipeline

The core dashboard path is:

1. Resolve endpoint.
2. Resolve filters.
3. Build request object.
4. Fetch data.
5. Render charts against the returned payload.

In code terms, `DashboardPage.jsx` does this through three main steps.

### 1. Resolve the dashboard endpoint

`resolveDashboardEndpoint()` works out where the data should come from. It checks, in effect:

- `config.dataEndpoint.path`
- `pageContext.dataPath`
- `config.dataPath`

It also resolves the request method, although the current dashboard fetch path only supports `GET`.

### 2. Build the visualisation request

`buildVisualisation()` converts the dashboard filter state into the request shape expected by `useFetchVisualisationData()`.

It:

- inspects the endpoint path for route parameters such as `:id` or `{id}`
- sends matching filter values into `pathParams`
- sends the rest into `queryParams`
- skips non-request filters such as `fixed`, `hidetoggle`, and `mapViewport`
- carries through whether the endpoint requires authentication

The resulting object is the bridge between the dashboard configuration layer and the shared data-fetching hook.

### 3. Fetch and render

`useFetchVisualisationData(visualisation)` performs the request and returns the data payload used by all configured charts.

`DashboardPage` then:

- shows a loading overlay while the request is in flight
- shows a warning if the endpoint is missing or unsupported
- shows a warning if charts exist but the selected filters return no data
- passes the successful payload into `ChartRenderer`

This means the charts themselves do not fetch data independently. They all receive the same already-fetched dataset from `DashboardPage` and then shape it locally according to their config.

## DashboardPage responsibilities

`DashboardPage.jsx` is the orchestration layer. It does not draw charts itself. Its job is to:

- resolve the dashboard data endpoint
- load metadata tables for filter option lists
- initialise and validate filters
- convert filter values into query params or path params
- fetch the main dataset
- normalise the CSS grid layout for desktop and mobile
- pass `config.charts` and fetched data to `ChartRenderer`

You can think of `DashboardPage` as the boundary between configuration and rendering:

- above it: page config, metadata tables, filters, endpoint definition
- below it: chart rendering, layout sections, and formatting

### Important behaviour

- Dashboard pages currently expect a `GET` endpoint when using `useFetchVisualisationData()`.
- If `config.charts` is empty, the page shows a warning state.
- If the endpoint returns no data for the current filters, the page shows an empty-data warning.
- Table charts using `tableLayout: 'rows'` are adjusted so they work cleanly inside the dashboard grid.
- `config.layout` controls the overall page grid, while each chart can also declare its own `layout` block.

## DashboardSidebar responsibilities

`DashboardSidebar.jsx` is the left-hand filter and utility panel. It renders:

- filter controls such as dropdowns, sliders, toggles, and checkboxes
- glossary content when `additionalFeatures.glossary.dataDictionary` is present
- download controls when `additionalFeatures.download.downloadPath` is present
- legal text

The sidebar does not fetch dashboard data itself. It emits filter changes back to `DashboardPage`, which then rebuilds the request and refreshes the dataset.

## Minimal dashboard config example

This is the general shape expected by `DashboardPage`:

```js
export const exampleDashboardPage = {
  pageName: 'Example dashboard',
  url: '/example-dashboard',
  type: 'Dashboard',
  about: '<p>Example dashboard description.</p>',
  dataPath: '/api/example/dashboard',
  config: {
    layout: {
      desktopColumns: 3,
      minCardWidth: 320,
      desktopAreas: [
        'summary summary donut',
        'bars bars table',
      ],
    },
    charts: [
      {
        type: 'card',
        title: 'Total responses',
        calc: 'count',
        layout: { area: 'summary' },
      },
      {
        type: 'barV2',
        title: 'Responses by category',
        yAxisKey: 'category',
        xAxisCalc: 'count',
        xLabel: 'Responses',
        yLabel: 'Category',
        layout: { area: 'bars' },
      },
      {
        type: 'donut',
        title: 'Mode share',
        categoryKey: 'mode',
        calc: 'count',
        layout: { area: 'donut' },
      },
      {
        type: 'table',
        title: 'Detail rows',
        tableLayout: 'rows',
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'category', label: 'Category' },
          { key: 'score', label: 'Score' },
        ],
        layout: { area: 'table' },
      },
    ],
    filters: [],
    metadataTables: [],
  },
};
```

## How charting plugs into DashboardPage

The dashboard page does not know how to draw individual chart types. Its chart-related responsibilities are narrower:

- pass `config.charts` into `ChartRenderer`
- pass the fetched dataset into `ChartRenderer`
- pass any dashboard-level `formatters`
- provide the grid container that places each rendered chart section on the page

`ChartRenderer` then selects the relevant chart component for each entry in `config.charts`.

For chart-specific configuration, supported chart types, and examples, see `Charting_Documentation.md`.

## Real project example

The page config at `src/configs/_templates/rail-portal/pages/respondentSurvey.js` in the Rail Offer/Strategic Rail application repo is a good end-to-end example of a dashboard page.

It demonstrates:

- dashboard grid areas
- KPI cards
- `barV2` charts using row-level survey data
- a donut chart using `categoryKey`
- a row-style table
- metadata-driven filters
- download and glossary features in the sidebar

## Choosing the right chart component

For new dashboard work, the practical guidance is:

- use `BarChartV2` for bar-chart work in dashboards
- keep chart implementation detail in `Charting_Documentation.md`

## Limitations and implementation notes

- `ChartRenderer` only exports the renderer publicly from the folder index; the per-chart files are internal implementation details.
- `DashboardPage` currently only supports `GET` dashboard endpoints through its main fetch path.
- The dashboard grid is driven by CSS grid, not by a charting library layout engine.
- Chart-specific data-shape rules and `hasChartData()` behaviour are covered in `Charting_Documentation.md`.

## Summary

The dashboard system is split cleanly into three layers:

- `DashboardPage` handles page orchestration, filters, data fetching, and layout
- `ChartRenderer` selects chart implementations from config
- the `Charts` folder provides the individual visual components and shared chart utilities

The important link is that `DashboardPage` fetches one shared dataset and `ChartRenderer` distributes that dataset across the configured chart components. Most new dashboard work can therefore be delivered by configuration alone: define the endpoint, define the filters, choose chart types, and provide the chart-specific config objects.