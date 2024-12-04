import { useEffect } from "react";
import { api } from "services";
import { getHoverLayerStyle, getLayerStyle } from "utils";
import { useMapContext } from "hooks";

/**
 * Layer component that adds a layer to the map(s) and handles its lifecycle.
 * 
 * This component is responsible for adding a specified layer to one or more map instances
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
  // Access the map context to get the current map instance(s)
  const { state } = useMapContext();
  const { map, maps } = state;

  useEffect(() => {
    // Determine the maps to operate on
    const targetMaps = maps || (map ? [map] : []);

    // If no map instances are available, exit early
    if (targetMaps.length === 0) return;

    // If missingParams are present, remove the layer if it exists
    if (layer.missingParams?.length > 0) {
      targetMaps.forEach((mapInstance) => {
        if (mapInstance.getLayer(layer.name)) {
          mapInstance.removeLayer(layer.name);
        }
        if (mapInstance.getLayer(`${layer.name}-hover`)) {
          mapInstance.removeLayer(`${layer.name}-hover`);
        }
        if (mapInstance.getSource(layer.name)) {
          mapInstance.removeSource(layer.name);
        }
      });
      return; // Exit the useEffect early
    }

    // Check if the layer is already added to avoid duplicates
    targetMaps.forEach((mapInstance) => {
      if (!mapInstance.getSource(layer.name)) {
        let sourceConfig = {};
        let layerConfig = {
          ...getLayerStyle(layer.geometryType),
          id: layer.name,
          maxzoom: layer.maxZoom || 24,
          minzoom: layer.minZoom || 0,
        };
        layerConfig.paint = layer.customPaint || layerConfig.paint;

        const layerLayout = {};
        layerLayout.visibility = layer?.hiddenByDefault ? "none" : "visible";
        layerConfig.layout = layerLayout;
        layerConfig.metadata = {
          ...layerConfig.metadata,
          isStylable: layer.isStylable ?? false,
          path: layer.path ?? null,
          shouldShowInLegend: layer.shouldShowInLegend || (layer.isStylable ? true : false),
        };

        // Handle GeoJSON layer type
        if (layer.type === "geojson") {
          api.geodataService.getLayer(layer).then((geojson) => {
            sourceConfig.type = "geojson";
            sourceConfig.data = geojson;
            mapInstance.addSource(layer.name, sourceConfig);
            mapInstance.addLayer({ ...layerConfig, source: layer.name });
            if (layer.isHoverable) {
              const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
              hoverLayerConfig.id = `${layer.name}-hover`;
              mapInstance.addLayer({ ...hoverLayerConfig, source: layer.name });
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
          mapInstance.addSource(layer.name, sourceConfig);
          mapInstance.addLayer({
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
            mapInstance.addLayer(hoverLayerConfig);
          }
        }
      }
    });

    // Cleanup function to remove layers and sources when the component unmounts
    return () => {
      targetMaps.forEach((mapInstance) => {
        if (mapInstance.getLayer(layer.name)) {
          mapInstance.removeLayer(layer.name);
        }
        if (mapInstance.getLayer(`${layer.name}-hover`)) {
          mapInstance.removeLayer(`${layer.name}-hover`);
        }
        if (mapInstance.getLayer(`${layer.name}-label`)) {
          mapInstance.removeLayer(`${layer.name}-label`);
        }
        if (mapInstance.getSource(layer.name)) {
          mapInstance.removeSource(layer.name);
        }
        if (mapInstance.getLayer("selected-feature-layer")) {
          mapInstance.removeLayer("selected-feature-layer");
        }
        if (mapInstance.getSource("selected-feature-source")) {
          mapInstance.removeSource("selected-feature-source");
        }
      });
    };
  }, [map, maps, JSON.stringify(layer)]);

  // This component does not render any visible elements
  return null;
};
