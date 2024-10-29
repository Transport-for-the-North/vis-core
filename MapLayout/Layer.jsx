import { useEffect } from "react";
import { api } from "services";
import { getHoverLayerStyle, getLayerStyle } from "utils";
import { useMapContext } from "hooks";

/**
 * Layer component that adds a layer to the map and handles its lifecycle.
 * @param {Object} props - The properties of the layer.
 * @param {Object} props.layer - The layer configuration object.
 */
export const Layer = ({ layer }) => {
  const { state } = useMapContext();
  const { map } = state;

  useEffect(() => {
    if (!map) return;

    if (!map.getSource(layer.name)) {
      let sourceConfig = {};
      let layerConfig = getLayerStyle(layer.geometryType);
      const layerLayout = {};
      layerConfig.id = layer.name;
      layerLayout.visibility = layer?.hiddenByDefault ? "none" : "visible";
      layerConfig.layout = layerLayout;
      layerConfig.metadata = {
        ...layerConfig.metadata,
        isStylable: layer.isStylable ?? false,
        path: layer.path ?? null,
      };

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
      } else if (layer.type === "tile") {
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

  return null;
};
