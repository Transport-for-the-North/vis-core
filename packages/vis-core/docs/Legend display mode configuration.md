# Configuring the dynamic legend display mode

The dynamic legend supports two display modes for numeric data: continuous gradients and discrete swatches. By default, the system applies the continuous gradient bar where possible. You can override this default behaviour to present discrete swatches initially. 

Users can manually toggle between continuous and discrete modes using the settings icon on the legend. User selections are saved to local storage and take precedence over default application or layer configurations.

## App level configuration

You can set a default display mode for all map layers within an application. This is defined in the `appConfig.js` file for the specific application.

Provide the `defaultLegendDisplayMode` property at the root of the configuration object. The accepted values are `continuous` and `discrete`.

```javascript
export const appConfig = {
  // Other app configurations...
  defaultLegendDisplayMode: 'discrete', 
};
```

If omitted, the fallback behaviour is `continuous`.

## Layer level configuration

You can override the app level default for individual map layers. This is useful when most layers should display as discrete swatches, but a specific layer requires a continuous gradient.

Add the `defaultLegendDisplayMode` property to the `metadata` object within the layer's definition in your map configuration. 

```json
{
  "id": "example-heatmap-layer",
  "type": "fill",
  "source": "example-source",
  "metadata": {
    "isStylable": true,
    "defaultLegendDisplayMode": "continuous"
  },
  "paint": {
    // Paint properties...
  }
}
```

## Configuration precedence

The legend display mode is determined using the following hierarchy, from highest to lowest priority:

1. User preference (saved to local storage via the legend settings interface)
2. Layer level configuration (`layer.metadata.defaultLegendDisplayMode`)
3. App level configuration (`appConfig.defaultLegendDisplayMode`)
4. System default (`continuous`)
