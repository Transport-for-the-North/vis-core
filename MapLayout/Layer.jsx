import { useEffect } from "react";
import { api } from "services";
import { getHoverLayerStyle, getLayerStyle } from "utils";
import { useMapContext } from "hooks";

/**
 * Layer component that adds a layer to the map and handles its lifecycle.
 * 
 * This component is responsible for adding a specified layer to a map instance
 * and managing its lifecycle, including cleanup when the component is unmounted.
 * It supports both GeoJSON and tile-based layers and can optionally add hover
 * effects to the layers.
 * 
 * @param {Object} props - The properties of the layer.
 * @param {Object} props.layer - The layer configuration object.
 * @param {string} props.layer.name - The unique name of the layer.
 * @param {string} props.layer.type - The type of the layer, either "geojson" or "tile".
 * @param {string} props.layer.geometryType - The geometry type of the layer (e.g., "line", "point").
 * @param {boolean} [props.layer.hiddenByDefault] - Whether the layer should be hidden by default.
 * @param {boolean} [props.layer.isStylable] - Whether the layer is stylable.
 * @param {boolean} [props.layer.isHoverable] - Whether the layer should have a hover effect.
 * @param {string} [props.layer.path] - The path or URL to the layer data.
 * @param {string} [props.layer.source] - The source of the layer data, e.g., "api".
 * @param {string} [props.layer.sourceLayer] - The source layer name for tile layers.
 */
export const Layer = ({ layer }) => {
  // Access the map context to get the current map instance
  const { state } = useMapContext();
  const { map } = state;

  useEffect(() => {
    // If no map instance is available, exit early
    if (!map) return;

    // Check if the layer source is already added to the map
    if (!map.getSource(layer.name)) {
      let sourceConfig = {};
      let layerConfig = getLayerStyle(layer.geometryType);
      layerConfig.paint = layer.customPaint || layerConfig.paint;
      const layerLayout = {};
      layerConfig.id = layer.name;
      layerLayout.visibility = layer?.hiddenByDefault ? "none" : "visible";
      layerConfig.layout = layerLayout;
      layerConfig.metadata = {
        ...layerConfig.metadata,
        isStylable: layer.isStylable ?? false,
        path: layer.path ?? null,
        shouldShowInLegend: layer.shouldShowInLegend || (layer.isStylable ? true : false)
      };

      // Handle GeoJSON layer type
      if (layer.type === "geojson") {
        api.geodataService.getLayer(layer).then((geojson) => {
          sourceConfig.type = "geojson";
          sourceConfig.data = geojson;
          map.addSource(layer.name, sourceConfig);
          map.addLayer({ ...layerConfig, source: layer.name });
          if (layer.isHoverable) {
            const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
            hoverLayerConfig.id = `${layer.name}-hover`;
            map.addLayer({ ...hoverLayerConfig, source: layer.name });
          }
        });
      } 
      // Handle tile layer type
      else if (layer.type === "tile") {
        const url =
          layer.source === "api"
            ? api.geodataService.buildTileLayerUrl(layer.path)
            : layer.path;
        sourceConfig.type = "vector";
        sourceConfig.tiles = [url];
        sourceConfig.promoteId = "id";
        map.addSource(layer.name, sourceConfig);
        map.addLayer({
          ...layerConfig,
          source: layer.name,
          "source-layer": layer.sourceLayer,
          metadata: {
            ...layerConfig.metadata,
            isStylable: layer.isStylable ?? false,
            bufferSize: layer.geometryType === "line" ? 7 : null,
          },
        });
        if (layer.isHoverable) {
          const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
          hoverLayerConfig.id = `${layer.name}-hover`;
          hoverLayerConfig.source = layer.name;
          hoverLayerConfig["source-layer"] = layer.sourceLayer;
          hoverLayerConfig.metadata = {
            ...hoverLayerConfig.metadata,
            isStylable: false,
          };
          map.addLayer(hoverLayerConfig);
        }
      }
    }

    // Cleanup function to remove layers and sources when the component unmounts
    return () => {
      if (map.getLayer(layer.name)) {
        map.removeLayer(layer.name);
      }
      if (map.getLayer(`${layer.name}-hover`)) {
        map.removeLayer(`${layer.name}-hover`);
      }
      if (map.getSource(layer.name)) {
        map.removeSource(layer.name);
      }
      if (map.getLayer("selected-feature-layer")) {
        map.removeLayer("selected-feature-layer");
      }
      if (map.getSource("selected-feature-source")) {
        map.removeSource("selected-feature-source");
      }
    };
  }, [map, JSON.stringify(layer)]);

  // This component does not render any visible elements
  return null;
};
