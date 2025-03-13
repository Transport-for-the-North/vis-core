import { useEffect, useContext  } from "react";
import { api } from "services";
import { getHoverLayerStyle, getLayerStyle, getSelectedLayerStyle } from "utils";
import { useMapContext} from "hooks";
import { FilterContext } from "contexts";

/**
 * Layer component that adds a layer to the map(s) and handles its lifecycle.
 *
 * This component is responsible for adding a specified layer to one or more map instances
 * and managing its lifecycle, including cleanup when the component is unmounted.
 * It supports both GeoJSON and tile-based layers and can optionally add hover
 * and select effects to the layers.
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

  // Access filters from FilterContext
  const filterContext = useContext(FilterContext);
  const filters = filterContext?.state || {};

  useEffect(() => {
    // Determine the maps to operate on
    const targetMaps = maps || (map ? [map] : []);

    // If no map instances are available, exit early
    if (targetMaps.length === 0) return;

    // Check for missing customTooltip parameters
    if (layer.customTooltip) {
      let { url, htmlTemplate } = layer.customTooltip;
      if (!url || !htmlTemplate) {
        console.error("Both url and htmlTemplate must be provided for customTooltip.");
        return;
      }

      // Replace filter placeholders if FilterContext is available
      // key needs to be fixed with identifier generated using FilterContext
      if (filterContext) {
        url = url.replace(/\{(\w+)\}/g, (_, key) => {
          return filters[key] !== undefined ? filters[key] : `{${key}}`;  // Replace with filter value or empty string
        });
      }
      console.log(filters)
      layer.customTooltip.url = url;
    }

    // If missingParams are present, remove the layer if it exists
    if (layer.missingParams?.length > 0) {
      targetMaps.forEach((mapInstance) => {
        if (mapInstance.getLayer(layer.name)) {
          mapInstance.removeLayer(layer.name);
        }
        if (mapInstance.getLayer(`${layer.name}-hover`)) {
          mapInstance.removeLayer(`${layer.name}-hover`);
        }
        if (mapInstance.getLayer(`${layer.name}-select`)) {
          mapInstance.removeLayer(`${layer.name}-select`);
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
          shouldHaveOpacityControl: layer.shouldHaveOpacityControl ?? true, // opacity control should appear by default
          enforceNoColourSchemeSelector: layer.enforceNoColourSchemeSelector ?? false, // colour scheme selector should appear if stylable, unless this is enforced
          enforceNoClassificationMethod: layer.enforceNoClassificationMethod ?? false, // classification method selector should appear if stylable, unless this is enforced
          zoomToFeaturePlaceholderText: layer.zoomToFeaturePlaceholderText || "",
        };

        // Handle GeoJSON layer type
        if (layer.type === "geojson") {
          api.geodataService.getLayer(layer).then((geojson) => {
            sourceConfig.type = "geojson";
            sourceConfig.data = geojson;
            mapInstance.addSource(layer.name, sourceConfig);
            mapInstance.addLayer({ ...layerConfig, source: layer.name });

            // Add the hover layer if the layer is hoverable
            if (layer.isHoverable) {
              const hoverLayerConfig = getHoverLayerStyle(layer.geometryType);
              hoverLayerConfig.id = `${layer.name}-hover`;
              mapInstance.addLayer({ ...hoverLayerConfig, source: layer.name });
            }

            // Add the select layer
            const selectLayerConfig = getSelectedLayerStyle(layer.geometryType);
            selectLayerConfig.id = `${layer.name}-select`;
            mapInstance.addLayer({ ...selectLayerConfig, source: layer.name });
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

          // Add the hover layer if the layer is hoverable
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

          // Add the select layer
          const selectLayerConfig = getSelectedLayerStyle(layer.geometryType);
          selectLayerConfig.id = `${layer.name}-select`;
          selectLayerConfig.source = layer.name;
          selectLayerConfig["source-layer"] = layer.sourceLayer;
          selectLayerConfig.metadata = {
            ...selectLayerConfig.metadata,
            isStylable: false,
          };
          mapInstance.addLayer(selectLayerConfig);
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
        if (mapInstance.getLayer(`${layer.name}-select`)) {
          mapInstance.removeLayer(`${layer.name}-select`);
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
  }, [map, maps, layer.name, layer.path, layer.type, layer.geometryType, filters]);

  // This component does not render any visible elements
  return null;
};