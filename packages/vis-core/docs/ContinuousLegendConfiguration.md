# Continuous gradient legend — layer configuration reference

This document covers the layer-config properties that control how the
`DynamicLegend` > `ContinuousGradientBar` pipeline renders a continuous
(gradient) scale for a stylable map layer.

---

## When is the continuous bar shown?

`LegendLayerGroup` switches to the gradient bar automatically when:

- The layer is **not** categorical (`colorStyle !== 'categorical'` and all stop values are numeric).
- There are **at least two** finite numeric stop values after paint-expression interpretation.
- The user has not overridden to discrete-swatch mode via the cog menu.

---

## Layer config properties

All properties below are set directly on the layer object inside `config.layers[]`
in a page config file (e.g. `combinedAuthority.js`).

### `invertedColorScheme` · `boolean`

Reverses the colour-stop array so that **high values map to the "dark" end** of
the colour palette and **low values map to the "light" end**, which is the
standard convention for risk maps.

This affects both:

- the paint expression applied to the map (via `reclassifyData`)
- the legend — `ContinuousGradientBar` detects the resulting descending-value
  order and flips the horizontal position formula so the gradient remains valid
  and the axis labels appear at the correct visual positions.

```js
invertedColorScheme: true,
```

> **Note:** When `invertedColorScheme` is `true`, the stop values in
> `legendEntriesNumeric` will be in descending order (e.g. `[100, 90, … 0]`).
> `ContinuousGradientBar` detects this via `finiteVals[0] > finiteVals[finiteVals.length - 1]`
> and uses the formula `((max - val) / range) * 100` instead of the standard
> ascending formula.

---

### `legendAnnotations` · `{ start?: string, end?: string }`

Optional strings rendered in a small italic row above the gradient bar,
left-aligned (`start`) and right-aligned (`end`).

These are **visual-position** labels:

| Key     | Appears at            | Meaning                             |
| ------- | --------------------- | ----------------------------------- |
| `start` | Left edge of the bar  | Describes the low end of the scale  |
| `end`   | Right edge of the bar | Describes the high end of the scale |

This distinction is critical: use `start`/`end`, not "first"/"last" (which
would be ambiguous when `invertedColorScheme` reverses the stop array order).

```js
legendAnnotations: { start: 'Lowest Risk of TRSE', end: 'Highest Risk of TRSE' },
```

Either key is optional; omit the object entirely to show no annotation row.

---

### `legendNumberFormat` · `{ decimals: number }`

Overrides the automatic decimal-precision detection for **both** the continuous
bar axis tick labels and the discrete swatch labels. Both views apply the same
formatting so they are always consistent with each other.

Without this, precision is inferred from the stop values (e.g. stops with integer
values produce integer labels). The default `formatLegendLabelValue` utility always
renders 2dp for values < 1000 (e.g. `"100.00"`), which is why this override is
needed for integer scales.

```js
legendNumberFormat: { decimals: 0 },  // forces integer labels: 0, 10, 20 …
legendNumberFormat: { decimals: 2 },  // forces 2dp labels: 0.00, 0.25 …
```

Omit entirely to use auto-detected precision.

---

### `bandMetricName` · `string`

Tells `MapVisualisation` which metric definition to look up in `defaultBands`
when classifying data for this layer. This is a **data classification** concern
and is independent of how the legend is rendered.

```js
bandMetricName: 'trse',
```

Without this, the metric is resolved from the filter that has
`containsLegendInfo: true`.

---

## Complete example (TRSE risk layer)

```js
{
  name: "Output Areas",
  type: "tile",
  source: "api",
  path: "/api/vectortiles/zones/28/{z}/{x}/{y}",
  sourceLayer: "zones",
  geometryType: "polygon",
  visualisationName: "TRSE Rank",
  isHoverable: true,
  isStylable: true,
  shouldHaveTooltipOnHover: true,

  // --- Legend configuration ---
  // The palette is applied in reverse so high TRSE rank (highest risk)
  // maps to the dark end of PuRd.
  invertedColorScheme: true,
  // Axis annotation text. "start" = left = low-risk end of the bar;
  // "end" = right = high-risk end. These are visual-position labels.
  legendAnnotations: { start: 'Lowest Risk of TRSE', end: 'Highest Risk of TRSE' },
  // TRSE ranks are 0–100 integers; suppress unnecessary decimal places.
  legendNumberFormat: { decimals: 0 },
  // Pin the data classification to the 'trse' metric definition.
  bandMetricName: 'trse',
}
```

---

## How the properties flow through the stack

```txt
Layer config (page JS)
  └─ state.layers[layerId]        < populated by LayerManager on page load
       └─ DynamicLegend.jsx
            reads: invertedColorScheme, legendAnnotations, legendNumberFormat
            produces item: { legendAnnotations, legendNumberFormat, ... }
            └─ LegendLayerGroup.jsx
                 └─ ContinuousGradientBar.jsx
                      uses: legendAnnotations (AnnotationRow below axis)
                            legendNumberFormat (tick precision)
                            isDescending detection (gradient orientation fix)
```

`invertedColorScheme` is also read by `MapVisualisation.jsx` when calling
`reclassifyData`, so the same flag governs both the map colours and the legend
orientation.
