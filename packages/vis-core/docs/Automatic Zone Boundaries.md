# Switchable zone boundaries

The switchable zone boundaries feature allows users to dynamically toggle the visibility of polygon zone outlines directly from the map interface. This is particularly useful when visualising dense zonal data, such as population metrics or households, where zone outlines might clutter the map at zoomed-out levels but are necessary for precise geographic context when zoomed in.

The `vis-core` map engine automatically infers the geometry of the data, meaning any layer configured with `geometryType: "polygon"` automatically inherits this capability. When a polygon layer is initialised, the engine automatically generates a companion line layer bound to the exact same data source and injects a "Show zone boundaries" checkbox into the Map layer control sidebar for that specific layer. It also manages the drawing stack so that the boundaries are rendered precisely between the base fill layer and the interactive hover or select layers.

Because this feature is automatically enabled for all polygon layers, no configuration is required for standard usage. The boundary layer is fully synchronised with its parent layer, so if a user hides the master layer using the eye icon in the sidebar, the boundary layer is automatically hidden as well. When the master layer is restored, the boundaries return to their previous user-toggled state. The boundary layer's opacity also dynamically tracks the opacity of the parent layer when adjusted using the opacity slider in the sidebar. Furthermore, the boundaries are drawn below the transparent hover and select map layers, ensuring that interactive mouse events and highlighting continue to work seamlessly without visual obstruction.

Although no setup is needed, you can customise the appearance or disable the feature by providing optional properties to your layer configuration in your page configuration file:

```javascript
{
  name: "BRONTE Zones",
  type: "tile",
  geometryType: "polygon",
  // ... other properties ...

  // Optional customisations:
  switchableBoundaries: false, // Set to false to explicitly disable the boundaries feature
  boundariesVisibleByDefault: true, // Set to true to have boundaries turned ON when the page loads (defaults to false)
  boundariesLabel: "Toggle Outlines", // Custom text for the checkbox in the sidebar (defaults to "Show zone boundaries")
  boundariesColor: "#000000", // Custom hex colour for the boundary lines in light mode (defaults to "#444444")
  boundariesDarkColor: "#ffffff", // Optional custom hex colour for the boundary lines in dark mode (defaults to inverted boundariesColor or "#ffffff")
  boundariesWidth: 2, // Custom width for the boundary lines (defaults to 1)
  boundariesOpacity: 1, // Fixed opacity value when boundariesOpacityMode is "fixed"
  boundariesOpacityMode: "inherit", // Opacity mode: "inherit" to track parent layer opacity, or "fixed" to keep boundariesOpacity fixed
  boundaryThemePaint: { // Optional explicit theme paint overrides
    light: { "line-color": "#444444" },
    dark: { "line-color": "#ffffff" },
  },
}
```

When switching between light and dark base maps, zone boundary colours use `boundaryThemePaint` if configured, or automatically invert (for example, black boundaries become white on dark mode) to preserve contrast against the background.
