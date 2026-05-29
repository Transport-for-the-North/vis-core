# Charting Documentation

This document explains the charting layer in `vis-core`.

It covers:

- how `ChartRenderer` works
- the shared chart utilities and styles
- the data shapes expected by the chart components
- the supported chart types
- the recommended use of `BarChartV2`

## Main files

- `src/Components/Charts/ChartRenderer.jsx`
- `src/Components/Charts/ChartRenderer.utils.jsx`
- `src/Components/Charts/ChartRenderer.styles.js`
- `src/Components/Charts/Card.jsx`
- `src/Components/Charts/BarChartV2.jsx`
- `src/Components/Charts/LineSeriesChart.jsx`
- `src/Components/Charts/AreaSeriesChart.jsx`
- `src/Components/Charts/ScatterSeriesChart.jsx`
- `src/Components/Charts/DonutPieChart.jsx`
- `src/Components/Charts/TableChart.jsx`
- `src/Components/Charts/RankingChart.jsx`

## How the charting layer works

Any parent component using `ChartRenderer` passes three main things into it:

- `charts`: the array of chart config objects
- `data`: the shared dataset to be visualised
- `formatters`: optional custom formatter functions

`ChartRenderer` then:

1. checks whether any configured chart has usable data
2. loops through the `charts` array
3. lower-cases each `type`
4. picks the matching chart component
5. passes the chart config and shared dataset into that component

That means each chart component is responsible for interpreting the dataset it receives. The renderer does the routing, not the data transformation.

## Supported chart types

The renderer supports these `type` values:

- `card`
- `bar`
- `bar_vertical`
- `multiple_bar`
- `multiple_bar_vertical`
- `barv2`
- `line`
- `area`
- `scatter`
- `pie`
- `donut`
- `table`
- `ranking`

Notes:

- `type` is lower-cased before matching, so `barV2` and `barv2` both work.
- `bar`, `bar_vertical`, `multiple_bar`, and `multiple_bar_vertical` are legacy routes retained for other apps.
- `BarChartV2` is the recommended bar chart implementation.
- Unsupported types render a warning box.

## Shared chart concepts

Most charts follow the same broad pattern:

- `type` decides which component `ChartRenderer` selects
- `title` is shown above the chart or card
- `layout` controls placement inside the parent grid layout
- `height` controls rendered height where relevant
- `formatters` can be supplied by the parent and are merged with package defaults

### Shared layout options

Charts can use a `layout` object such as:

```js
layout: {
  area: 'ticket',
  columnSpan: 2,
  rowSpan: 3,
}
```

Supported behaviour:

- `area`: places the chart into a named `grid-template-area`
- `columnSpan`: spans multiple grid columns
- `rowSpan`: spans multiple grid rows
- `fullWidth`: some components support this as a top-level chart option rather than inside `layout`

### Shared formatter behaviour

`ChartRenderer` merges custom formatters with package defaults.

Built-in defaults include:

- `commify(value)`: formats numbers with `en-GB` separators
- `percent(value, data, keys)`: calculates percentage share for summary-style datasets

Charts may also look for custom formatters such as:

- `tooltipFormatter`
- `axisFormatter`
- `valueFormatter`

## Data shape conventions

There are two main data shapes in use.

### 1. Object-style summary data

```js
{
  rail: 120,
  bus: 80,
  walk: 40,
}
```

This shape is mainly used by:

- `Card`
- `LineSeriesChart`
- `AreaSeriesChart`
- `ScatterSeriesChart`
- `RankingChart`
- percentage-style `TableChart`
- `DonutPieChart` when using `columns`

### 2. Array-of-rows data

```js
[
  { category: 'Anytime', score: 4, region: 'North' },
  { category: 'Advance', score: 5, region: 'North' },
  { category: 'Anytime', score: 3, region: 'South' },
]
```

This shape is mainly used by:

- `Card` with aggregation
- `BarChartV2`
- row-style `TableChart`
- `DonutPieChart` with `categoryKey`

## Shared infrastructure files

### `ChartRenderer.jsx`

This is the dispatcher that selects the correct chart component.

It also:

- resolves bar chart height overrides
- merges formatters with defaults
- blocks rendering when no configured chart has usable data

### `ChartRenderer.utils.jsx`

This file provides shared helpers, including:

- default colours
- default numeric formatters
- grid layout helpers
- X-axis height estimation for rotated labels
- summary-to-series conversion via `toSeries()`
- `hasChartData()` checks used before rendering

`hasChartData()` is important because it determines whether a chart should render at all. Different chart types expect different shapes:

- `card` accepts object data or row arrays
- row-style `table` accepts object data or row arrays
- `barv2` expects an array of rows
- donut or pie with `categoryKey` expects an array of rows
- most summary-style charts expect object-like keyed values

### `ChartRenderer.styles.js`

This file contains shared styled components, such as:

- the card or chart section container
- chart titles
- ranking table styles
- ranking expand or collapse button styles

## Chart components

### `Card.jsx`

What it makes:

- KPI cards
- total counts
- averages, sums, minima, and maxima
- best or worst group summaries

Typical use cases:

- total response count
- average satisfaction score
- best-performing category

Key config options:

- `calc`: `count`, `mean`, `avg`, `average`, `sum`, `min`, `max`
- `column` or `valueKey`: numeric source field for non-count metrics
- `groupBy`: group rows before calculating
- `show`: `best` or `worst` when using `groupBy`
- `summaryLabel`, `description`, `valuePrefix`, `valueSuffix`, `emptyText`

Example:

```js
{
  type: 'card',
  title: 'Average recommendation score',
  calc: 'mean',
  column: 'rate_recommend',
}
```

Grouped example:

```js
{
  type: 'card',
  title: 'Best period by average recommendation',
  groupBy: 'rail_period',
  calc: 'mean',
  column: 'rate_recommend',
  show: 'best',
  summaryLabel: 'Average score',
}
```

### Legacy bar components

`BarChart.jsx` and `BarChartMultiple.jsx` are legacy components that remain in `vis-core` for compatibility with other apps.

They still sit behind these `type` values:

- `bar`
- `bar_vertical`
- `multiple_bar`
- `multiple_bar_vertical`

They are not the recommended path for current charting work, so they are intentionally not documented in detail here.

For current development, use `BarChartV2`.

### `BarChartV2.jsx`

What it makes:

- aggregated bar charts from row-level datasets
- grouped bar charts
- stacked bar charts
- horizontal or vertical orientation depending on axis config

This is the most flexible bar chart component in the folder and is the recommended option for current work.

It works by deciding:

- which axis holds categories
- which axis holds calculated values
- how rows should be grouped
- whether to count rows or aggregate a numeric field

Supported calculations include:

- `count`
- `sum`
- `avg`
- `min`
- `max`
- `distinctCount`

Key config options:

- `xAxisKey`, `yAxisKey`
- `xAxisCalc`, `yAxisCalc`
- `calc`
- `groupBy`
- `sourceColumns`
- `stacked`
- `sortBy`, `sortDirection`
- `allowDecimals`
- `barSize`
- `colors`

Count rows by category example:

```js
{
  type: 'barV2',
  title: 'Ticket type distribution',
  yAxisKey: 'ticket_type',
  xAxisCalc: 'count',
  xLabel: 'Responses',
  yLabel: 'Ticket type',
}
```

Grouped example:

```js
{
  type: 'barV2',
  title: 'Responses by period and operator',
  yAxisKey: 'rail_period',
  xAxisCalc: 'count',
  groupBy: 'toc_name',
  stacked: true,
  xLabel: 'Responses',
  yLabel: 'Rail period',
}
```

Derived source-columns example:

```js
{
  type: 'barV2',
  title: 'Satisfaction distribution by measure',
  xAxisKey: '__source_category',
  yAxisCalc: 'count',
  groupBy: '__source_group',
  sourceColumns: [
    { key: 'sat_delay', label: 'Delay' },
    { key: 'sat_overall', label: 'Overall' },
    { key: 'sat_frequency', label: 'Frequency' },
  ],
  sortBy: 'label',
  sortDirection: 'asc',
}
```

### `LineSeriesChart.jsx`

What it makes:

- a single-series line chart from object-style summary data

Key config options:

- `columns`
- `height`
- `lineColor`

Example:

```js
{
  type: 'line',
  title: 'Monthly totals',
  columns: [
    { key: 'jan', label: 'Jan' },
    { key: 'feb', label: 'Feb' },
    { key: 'mar', label: 'Mar' },
  ],
  lineColor: '#005ea5',
}
```

### `AreaSeriesChart.jsx`

What it makes:

- a single-series area chart from object-style summary data

Key config options:

- `columns`
- `height`
- `lineColor` or `areaStrokeColor`
- `areaFillColor`

Example:

```js
{
  type: 'area',
  title: 'Passenger trend',
  columns: [
    { key: 'q1', label: 'Q1' },
    { key: 'q2', label: 'Q2' },
    { key: 'q3', label: 'Q3' },
    { key: 'q4', label: 'Q4' },
  ],
  areaStrokeColor: '#1d70b8',
  areaFillColor: 'rgba(29,112,184,0.2)',
}
```

### `ScatterSeriesChart.jsx`

What it makes:

- a single-series scatter plot from object-style summary data

Key config options:

- `columns`
- `height`
- `scatterColor`

Example:

```js
{
  type: 'scatter',
  title: 'Scores by category',
  columns: [
    { key: 'group_a', label: 'Group A' },
    { key: 'group_b', label: 'Group B' },
    { key: 'group_c', label: 'Group C' },
  ],
  scatterColor: '#0b0c0c',
}
```

### `DonutPieChart.jsx`

What it makes:

- donut charts
- pie-style segment summaries
- grouped category counts from row data
- grouped sums from row data

Both `type: 'pie'` and `type: 'donut'` route to this component.

It supports two patterns:

1. Object summary data via `columns`
2. Row data via `categoryKey` or `dimensionKey`

Key config options:

- `columns`
- `categoryKey` or `dimensionKey`
- `calc`: `count` or `sum`
- `valueKey`: required when `calc: 'sum'`
- `colors`
- `size`

Count example:

```js
{
  type: 'donut',
  title: 'Travel to station',
  categoryKey: 'station_travel',
  calc: 'count',
}
```

Sum example:

```js
{
  type: 'pie',
  title: 'Revenue by ticket type',
  categoryKey: 'ticket_type',
  calc: 'sum',
  valueKey: 'revenue',
}
```

### `TableChart.jsx`

What it makes:

- detailed row tables
- percentage summary tables

Supported layouts are:

- `rows`: render one row per data record
- `perc` or `perc-table`: render a count-and-percentage summary from object data

Key config options for row tables:

- `columns`
- `visibleRows`
- `maxHeight`
- `minWidth`
- `stickyHeader`
- `fixedTableLayout`
- `cellMaxWidth`

Row table example:

```js
{
  type: 'table',
  title: 'Survey responses',
  tableLayout: 'rows',
  visibleRows: 12,
  maxHeight: '360px',
  columns: [
    { key: 'toc_name', label: 'TOC' },
    { key: 'departure_station_name', label: 'Departure station' },
    { key: 'arrival_station_name', label: 'Arrival station' },
    { key: 'rate_recommend', label: 'Recommendation rate' },
  ],
}
```

Percentage table example:

```js
{
  type: 'table',
  title: 'Mode share table',
  tableLayout: 'perc',
  tableMetricName: 'Mode',
  columns: [
    { key: 'rail', label: 'Rail' },
    { key: 'bus', label: 'Bus' },
    { key: 'walk', label: 'Walk' },
  ],
}
```

### `RankingChart.jsx`

What it makes:

- ranked summary tables
- top-five previews with expand or collapse behaviour
- fixed or custom rank ordering

This component expects object-style summary data and a `columns` list describing which values to display.

Key config options:

- `columns`
- `ranks`: optional map of key to ranking position

Example:

```js
{
  type: 'ranking',
  title: 'Top modes',
  columns: [
    { key: 'rail', label: 'Rail' },
    { key: 'bus', label: 'Bus' },
    { key: 'walk', label: 'Walk' },
    { key: 'cycle', label: 'Cycle' },
    { key: 'taxi', label: 'Taxi' },
    { key: 'other', label: 'Other' },
  ],
  ranks: {
    rail: 1,
    bus: 2,
    walk: 3,
    cycle: 4,
    taxi: 5,
    other: 6,
  },
}
```

## Choosing the right chart component

The practical guidance is:

- use `Card` for headline metrics
- use `BarChartV2` for most row-level categorical analysis
- use `DonutPieChart` for composition or share-of-total views
- use `TableChart` for record-level detail or percentage summaries
- use `LineSeriesChart`, `AreaSeriesChart`, or `ScatterSeriesChart` when you genuinely need those visual forms and already have summary-style keyed data

## Limitations and implementation notes

- `ChartRenderer` only exports the renderer publicly from the folder index; the per-chart files are internal implementation details.
- `BarChart` and `BarChartMultiple` are legacy components retained for compatibility with other apps.
- `BarChartV2` is the bar chart component to use for current work.
- `hasChartData()` can suppress rendering if the incoming data shape does not match what the chart type expects.

## Summary

The charting layer takes a shared dataset plus a list of chart config objects and applies those configs through `ChartRenderer`.

The responsibilities are split cleanly:

- `ChartRenderer` routes chart definitions to components
- shared utilities handle layout, formatting, and data checks
- individual chart components decide how to interpret and display the data they receive