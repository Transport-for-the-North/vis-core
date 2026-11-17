import React, { memo, useContext, useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import {
  EyeIcon,
  EyeSlashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { getOpacityProperty, getWidthProperty } from "utils";
import { LayerSearch } from "./LayerSearch";
import { ColourSchemeDropdown } from "Components/Sidebar/Selectors/ColourSchemeDropdown";
import { BandEditor } from "Components/Sidebar/Selectors/BandEditor";
import { SelectorLabel } from "Components/Sidebar/Selectors/SelectorLabel";
import { ClassificationDropdown } from "Components/Sidebar/Selectors/ClassificationDropdown";
import { AppContext, MapContext, PageContext } from "contexts";
import { actionTypes } from "reducers";
import {
  calculateMaxWidthFactor,
  applyWidthFactor,
  updateOpacityExpression,
  getMetricDefinition,
  reclassifyData,
} from "utils/map";
import { getVisualisationDisplayMode } from "utils/displayMode";

/**
 * Styled container for the layer control entry.
 */
const LayerControlContainer = styled.div`
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

/**
 * Styled header for the layer control entry.
 */
const LayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * Container for the left section of the header.
 * Made clickable to toggle expansion.
 */
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer; /* Make cursor a pointer to indicate clickability */
`;

/**
 * Styled span for expanding/collapsing layer details.
 */
const ExpandCollapseToggle = styled.span`
  display: flex;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
    color: #555;
  }
`;

/**
 * Styled name for the layer.
 */
const LayerName = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
  font-family: var(--font-sans);
`;

/**
 * Styled button for toggling layer visibility.
 */
const VisibilityToggle = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:focus {
    outline: 2px solid #005fcc;
    outline-offset: 2px;
  }

  svg {
    width: 24px;
    height: 24px;
    color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
  }
`;

/**
 * Styled container for the opacity control.
 */
const OpacityControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

/**
 * Styled input for the slider.
 */
const Slider = styled.input`
  flex-grow: 1;
  margin-right: 0.5rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

/**
 * Styled label for form controls.
 */
const ControlLabel = styled.label`
  margin-right: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
  font-family: var(--font-sans);
`;

/**
 * Styled span for displaying the opacity value.
 */
const SliderValue = styled.span`
  font-size: 0.9rem;
  width: 36px;
  text-align: right;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
  font-family: var(--font-sans);
`;

/**
 * Styled container for collapsible content with animation.
 */
const CollapsibleContent = styled.div`
  overflow: hidden;
  max-height: ${({ isExpanded }) => (isExpanded ? "1000px" : "0")};
  opacity: ${({ isExpanded }) => (isExpanded ? "1" : "0")};
  transition: max-height 0.3s ease, opacity 0.3s ease;
`;

/**
 * Styled container for the width control.
 */
const WidthControl = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;

/**
 * Styled input for the width slider.
 */
const WidthSlider = styled.input`
  flex-grow: 1;
  margin-right: 10px;
`;

/**
 * Styled divider for separating sections in the collapsible content.
 */
const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 0.75rem 0;
  width: 100%;
`;

/**
 * Reads the classification bins a layer is currently painted with, straight from the map.
 *
 * The bins are the stop inputs of the colour ramp:
 * ["interpolate", ["linear"], ["feature-state", <field>], bin1, out1, bin2, out2, ...].
 *
 * @param {maplibregl.Map} map - The map the layer is drawn on.
 * @param {Object} layer - The layer ({ id, type }).
 * @returns {number[]|null} The bins, or null when the layer has no banded ramp.
 */
const readBinsFromMap = (map, layer) => {
  if (!map?.getLayer?.(layer.id)) return null;

  const readPaint = (prop) => {
    try {
      return map.getPaintProperty(layer.id, prop);
    } catch {
      return undefined;
    }
  };

  const colorProp = { line: "line-color", circle: "circle-color", fill: "fill-color" }[layer.type];
  const colorExpression = colorProp ? readPaint(colorProp) : undefined;
  const binExpression =
    Array.isArray(colorExpression) && colorExpression[0] === "interpolate"
      ? colorExpression
      : layer.type === "line"
        ? readPaint("line-width")
        : undefined;

  if (!Array.isArray(binExpression) || binExpression[0] !== "interpolate") return null;

  const stops = binExpression.slice(3);
  const bins = [];
  for (let i = 0; i < stops.length; i += 2) {
    bins.push(stops[i]);
  }
  return bins.length > 0 ? bins : null;
};

/**
 * Whether two bin arrays hold the same values in the same order.
 *
 * @param {number[]|null} a
 * @param {number[]|null} b
 * @returns {boolean}
 */
const binsAreEqual = (a, b) =>
  a === b ||
  (Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, i) => value === b[i]));

/**
 * LayerControlEntry component represents a single layer control entry in the map layer control panel.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.layer - The layer object containing information about the map layer.
 * @param {Array} props.maps - An array of MapLibre map instances.
 * @param {Function} props.handleColorChange - The function to handle color changes for the layer.
 * @param {Function} props.handleClassificationChange - The function to handle classification changes for the layer.
 * @param {Function} props.handleCustomBandsChange - The function to handle custom band changes for the layer.
 * @param {Object} props.state - The current application state.
 * @returns {JSX.Element} The rendered LayerControlEntry component.
 */
export const LayerControlEntry = memo(
  ({
    layer,
    maps,
    handleColorChange,
    handleClassificationChange,
    handleCustomBandsChange,
    state,
  }) => {
    const [visibility, setVisibility] = useState(
      layer.layout?.visibility || "visible"
    );

    const [boundariesVisibility, setBoundariesVisibility] = useState(
      (layer.metadata?.boundariesVisibleByDefault ?? layer.boundariesVisibleByDefault)
        ? "visible"
        : "none"
    );

    // State for whether the layer details are expanded
    const [isExpanded, setIsExpanded] = useState(() => {
      // Retrieve the expanded state from localStorage during initial render
      const storedState = localStorage.getItem(
        `layer-${layer.id}-isExpanded`
      );
      return storedState !== null ? JSON.parse(storedState) : true;
    });

    /**
     * Builds a list of "linked" layer IDs that should mirror the base layer's
     * visibility and style changes (label + spider overlays).
     *
     * @param {maplibregl.Map} map - A MapLibre instance.
     * @param {string} baseId - The base layer id.
     * @returns {string[]} Array of linked layer ids present on the map.
     */
    function getLinkedLayerIds(map, baseId) {
      const candidates = [
        baseId,
        `${baseId}-label`,
        `${baseId}-spider`,
        `${baseId}-spider-links`,
      ];
      return candidates.filter((id) => map.getLayer(id));
    }

    /**
     * Sets a paint property across all linked layers if the property exists
     * for that layer type. Falls back to the given value when an expression
     * cannot be updated safely.
     *
     * @param {maplibregl.Map} map
     * @param {string[]} ids - Layer ids to update.
     * @param {string} prop - Paint property name (e.g., 'circle-opacity').
     * @param {any} value - Value or expression to set.
     */
    function setPaintAcross(map, ids, prop, value) {
      ids.forEach((id) => {
        try {
          const current = map.getPaintProperty(id, prop);
          const next =
            prop.endsWith("opacity") && current !== undefined
              ? updateOpacityExpression(current, value)
              : value;
          map.setPaintProperty(id, prop, next);
        } catch {
          // silently ignore when a layer doesn't have that paint prop
        }
      });
    }

    /**
     * Applies a width factor to any layer that has an 'interpolate' width expression.
     * If the expression is not present, it falls back to setting a numeric width.
     * Also updates line-offset when appropriate.
     *
     * @param {maplibregl.Map} map
     * @param {string[]} ids - Layer ids to update.
     * @param {string} paintProp - Width paint property (e.g., 'circle-radius'|'line-width').
     * @param {number} factor - Desired width factor.
     * @param {number|undefined} customOffset - Optional custom offset for line layers.
     */
    function setWidthAcross(map, ids, paintProp, factor, customOffset) {
      ids.forEach((id) => {
        try {
          const currentExpr = map.getPaintProperty(id, paintProp);
          if (Array.isArray(currentExpr) && currentExpr[0] === "interpolate") {
            const { widthInterpolation, lineOffsetInterpolation } =
              applyWidthFactor(currentExpr, factor, paintProp, customOffset);
            map.setPaintProperty(id, paintProp, widthInterpolation);
            if (paintProp === "line-width" && lineOffsetInterpolation) {
              map.setPaintProperty(id, "line-offset", lineOffsetInterpolation);
            }
          } else if (typeof currentExpr === "number") {
            // Simple numeric fallback: scale directly
            const baseline = typeof currentExpr === "number" ? currentExpr : 1;
            map.setPaintProperty(
              id,
              paintProp,
              Math.max(0.5, baseline * factor)
            );
          }
        } catch {
          // ignore if layer doesn't have that prop or setPaintProperty throws
        }
      });
    }

    // Update localStorage whenever isExpanded changes
    useEffect(() => {
      localStorage.setItem(
        `layer-${layer.id}-isExpanded`,
        JSON.stringify(isExpanded)
      );
    }, [isExpanded, layer.id]);

    const currentPage = useContext(PageContext);
    const appConfig = useContext(AppContext);
    const mapContext = useContext(MapContext);
    const mapDispatch = mapContext?.dispatch;
    const selectedMetricParamName = currentPage.config.filters.find(
      (filter) => filter.containsLegendInfo === true
    );
    const isSideBySidePage =
      currentPage.pageName.includes("Side-by-Side") ||
      currentPage.pageName.includes("Side by Side");
    const visualisation =
      isSideBySidePage
        ? state.leftVisualisations[Object.keys(state.leftVisualisations)[0]]
        : state.visualisations[Object.keys(state.visualisations)[0]];

    const colorStyle = useMemo(() => {
      // Use the resolved colorStyle from layer metadata if available, otherwise derive from visualization style
      return (
        layer.metadata?.colorStyle ||
        visualisation?.style?.split("-")[1] ||
        "continuous"
      );
    }, [layer.metadata?.colorStyle, visualisation?.style]);

    // Band the editor against the mode the map is actually drawn in, so the defaults it
    // offers are on the same scale as what the user is looking at.
    const displayMode = getVisualisationDisplayMode(visualisation);

    const metricDefinition = useMemo(
      () =>
        getMetricDefinition(
          appConfig.defaultBands,
          currentPage,
          visualisation?.queryParams ?? {},
          { displayMode }
        ),
      [appConfig.defaultBands, currentPage, visualisation?.queryParams, displayMode]
    );

    // Diverging layers are banded from differenceValues; every other style uses values.
    // Reading `values` for a diverging layer showed a scale the map never used.
    const defaultBandValues = useMemo(() => {
      if (colorStyle !== "diverging") return metricDefinition?.values;

      const differenceValues = metricDefinition?.differenceValues;
      if (!differenceValues?.length) return differenceValues;

      return visualisation?.style?.includes("line")
        ? differenceValues.slice(differenceValues.length / 2)
        : differenceValues;
    }, [colorStyle, metricDefinition, visualisation?.style]);

    const shouldHaveOpacityControl =
      layer.metadata?.shouldHaveOpacityControl ?? true;
    const enforceNoColourSchemeSelector =
      layer.metadata?.enforceNoColourSchemeSelector ?? false;
    const enforceNoClassificationMethod =
      layer.metadata?.enforceNoClassificationMethod ?? false;
    const enforceNoCustomBanding =
      layer.metadata?.enforceNoCustomBanding ?? false;
    const widthProp = getWidthProperty(layer.type);
    const enableZoomToFeature =
      layer.metadata?.enableZoomToFeature ?? Boolean(layer.metadata?.path);
    const layerConfigFromState = state?.layers?.[layer.id];
    const shouldFixLineWidth =
      layer.metadata?.shouldFixLineWidth ??
      false;
    const isFixedLineWidth =
      layer.type === "line" && shouldFixLineWidth === true;
    const effectiveDefaultLineOffset =
      layerConfigFromState?.defaultLineOffset ??
      layer.metadata?.defaultLineOffset ??
      layer.defaultLineOffset;

    // Track the last non-custom classification method so BandEditor reset can restore it.
    const currentClassMethod = state.layers?.[layer.id]?.class_method ?? "d";
    const prevNonCustomClassMethodRef = useRef(
      currentClassMethod !== "c" ? currentClassMethod : "d"
    );
    useEffect(() => {
      if (currentClassMethod && currentClassMethod !== "c") {
        prevNonCustomClassMethodRef.current = currentClassMethod;
      }
    }, [currentClassMethod]);

    let currentWidthFactor = null;
    let currentOpacity = null;

    if (maps.length > 0 && maps[0].getLayer(layer.id)) {
      const opacityProp = getOpacityProperty(layer.type);
      currentOpacity = maps[0].getPaintProperty(layer.id, opacityProp);
      currentWidthFactor = widthProp
        ? maps[0].getPaintProperty(layer.id, widthProp)
        : null;
    }

    const isFeatureStateExpression =
      Array.isArray(currentOpacity) && currentOpacity[0] === "case";
    const initialOpacity = isFeatureStateExpression
      ? currentOpacity?.[currentOpacity.length - 1]
      : currentOpacity;

    const isFeatureStateWidthExpression =
      Array.isArray(currentWidthFactor) &&
      currentWidthFactor[0] === "interpolate";
    const isNodeLayer = layer.type === "circle";
    const initialWidth = isFeatureStateWidthExpression
      ? calculateMaxWidthFactor(
          currentWidthFactor[currentWidthFactor.length - 1],
          widthProp
        )
      : currentWidthFactor;
    const showWidth = isFeatureStateWidthExpression && !isFixedLineWidth;

    // State for opacity of the layer
    const fallbackOpacity =
      layer.defaultOpacity ??
      layer.metadata?.defaultOpacity ??
      0.5;
    const [opacity, setOpacity] = useState(
      initialOpacity !== null && initialOpacity !== undefined
        ? initialOpacity
        : fallbackOpacity
    );
    const [widthFactor, setWidth] = useState(initialWidth ?? 1);

    const bandEditorData = useMemo(() => {
      if (
        !visualisation ||
        !visualisation.data ||
        !Array.isArray(visualisation.data)
      ) {
        return [];
      }
      return visualisation.data
        .map((row) => {
          if (typeof row === "number") return row;
          if (typeof row === "object" && row !== null) {
            if (typeof row.value === "number") return row.value;
            if (typeof row.metric === "number") return row.metric;
            const num = Object.values(row).find((v) => typeof v === "number");
            if (typeof num === "number") return num;
          }
          return null;
        })
        .filter((v) => typeof v === "number" && !isNaN(v));
    }, [visualisation]);

    const hasExistingCustomBands =
      Array.isArray(state.layers?.[layer.id]?.customBands) &&
      state.layers[layer.id].customBands.length > 0;
    const canEditBands = bandEditorData.length >= 2 || hasExistingCustomBands;

    const customBandsFromState = state.layers?.[layer.id]?.customBands;
    const bandCountFromState = state.layers?.[layer.id]?.bandCount ?? null;

    // Bins the layer is painted with right now, read from the map. `layer.paint` can't be
    // used: MapLayerSection keeps the same `layer` object while only its paint changes, so
    // it goes stale after a restyle (new method, new band count). Re-read whenever the
    // map's style changes; state only changes when the bins actually do.
    const [liveBins, setLiveBins] = useState(() => readBinsFromMap(maps[0], layer));
    useEffect(() => {
      const map = maps[0];
      const refresh = () => {
        const bins = readBinsFromMap(map, layer);
        setLiveBins((prev) => (binsAreEqual(prev, bins) ? prev : bins));
      };
      refresh();
      if (typeof map?.on !== "function") return undefined;
      map.on("styledata", refresh);
      return () => map.off?.("styledata", refresh);
    }, [maps, layer]);

    // Extract current bins for BandEditor.
    // Prefer the canonical state-driven custom bands (when in custom mode), so the editor
    // shows exactly what the user typed rather than a re-read of the paint.
    const currentBins = useMemo(() => {
      if (currentClassMethod === "c") {
        if (
          Array.isArray(customBandsFromState) &&
          customBandsFromState.length > 0
        ) {
          return customBandsFromState;
        }
      }

      return liveBins ?? defaultBandValues ?? [0, 1, 2, 3, 4];
    }, [currentClassMethod, customBandsFromState, liveBins, defaultBandValues]);

    // Diverging line layers are banded on magnitude (width by absolute value, colour by
    // sign), so the editor mirrors those bands about the first one to show the full range.
    const isLineDiverging =
      colorStyle === "diverging" && Boolean(visualisation?.style?.includes("line"));
    const editorBins = useMemo(
      () =>
        isLineDiverging
          ? [...currentBins.slice(1).reverse().map((v) => -v), ...currentBins]
          : currentBins,
      [isLineDiverging, currentBins]
    );

    /**
     * Previews the bins the current (non-custom) method will produce at a new band count,
     * by calling reclassifyData with the same inputs MapVisualisation styles the map with.
     * Dual maps classify left and right data together, as the map does.
     *
     * @param {number} bandCount - The band count being previewed, as shown in the editor.
     * @returns {number[]|null} The bins in editor form, or null when there is nothing to
     *   classify (the editor then falls back to trimming/padding).
     */
    const previewBandsForCount = (bandCount) => {
      const visualisationKey = isSideBySidePage
        ? Object.keys(state.leftVisualisations ?? {})[0]
        : null;
      const toArray = (data) => (Array.isArray(data) ? data : []);
      const data = isSideBySidePage
        ? [
            ...toArray(state.leftVisualisations?.[visualisationKey]?.data),
            ...toArray(state.rightVisualisations?.[visualisationKey]?.data),
          ]
        : toArray(visualisation?.data);
      if (!data.length || !visualisation?.style) return null;

      // Dynamically styled visualisations hold only the geometry; the map resolves the
      // colour style, which this entry already knows as `colorStyle`.
      const style = visualisation.style.includes("-")
        ? visualisation.style
        : `${visualisation.style}-${colorStyle}`;

      try {
        const bins = reclassifyData(
          data,
          style,
          currentClassMethod,
          appConfig.defaultBands,
          currentPage,
          visualisation.queryParams,
          {
            bandMetricName: state.layers?.[layer.id]?.bandMetricName,
            customBands: customBandsFromState,
            bandCount,
            defaultClassification: visualisation.defaultClassification,
            displayMode,
          }
        );
        if (!Array.isArray(bins) || bins.length === 0) return null;
        return isLineDiverging
          ? [...bins.slice(1).reverse().map((v) => -v), ...bins]
          : bins;
      } catch {
        return null;
      }
    };

    /**
     * Toggle both the layer and its label layer visibility across all maps.
     *
     * This flips the local `visibility` state and applies the same visibility to
     * the base layer and its "-label" companion (if present) so they remain in sync.
     */
    const toggleVisibility = () => {
      const newVisibility = visibility === "visible" ? "none" : "visible";

      maps.forEach((map) => {
        const ids = getLinkedLayerIds(map, layer.id);
        ids.forEach((id) => {
          map.setLayoutProperty(id, "visibility", newVisibility);
        });

        const boundariesId = `${layer.id}-boundaries`;
        if (map.getLayer(boundariesId)) {
          if (newVisibility === "none") {
            map.setLayoutProperty(boundariesId, "visibility", "none");
          } else {
            map.setLayoutProperty(boundariesId, "visibility", boundariesVisibility);
          }
        }
      });

      setVisibility(newVisibility);
    };

    /**
     * Toggles the visibility of the boundaries layer and updates the map.
     */
    const toggleBoundariesVisibility = (e) => {
      const isChecked = e.target.checked;
      const newVisibility = isChecked ? "visible" : "none";
      setBoundariesVisibility(newVisibility);

      maps.forEach((mapInstance) => {
        if (!mapInstance || !mapInstance.style) return;
        const boundariesId = mapInstance.getLayer?.(`${layer.id}-boundaries`)
          ? `${layer.id}-boundaries`
          : (layer.name && mapInstance.getLayer?.(`${layer.name}-boundaries`))
          ? `${layer.name}-boundaries`
          : null;
        if (boundariesId) {
          if (visibility !== "none" || newVisibility === "none") {
            mapInstance.setLayoutProperty(boundariesId, "visibility", newVisibility);
          }
          // Synchronise boundaries line-opacity with current layer opacity when shown (unless fixed)
          const boundariesMode =
            layer.metadata?.boundariesOpacityMode ??
            layer.boundariesOpacityMode ??
            "inherit";
          if (
            newVisibility === "visible" &&
            typeof opacity === "number" &&
            boundariesMode !== "fixed"
          ) {
            try {
              mapInstance.setPaintProperty(boundariesId, "line-opacity", opacity);
            } catch {
              // Ignore if paint property cannot be set
            }
          }
        }
      });
    };

    /**
     * Handles changes to the opacity slider.
     * Applies the new opacity to the base layer and any linked layers.
     *
     * @param {Object} e - The event object from the slider input.
     */
    const handleOpacityChange = (e) => {
      const newOpacity = parseFloat(e.target.value);
      const baseOpacityProp = getOpacityProperty(layer.type);

      maps.forEach((map) => {
        const ids = getLinkedLayerIds(map, layer.id);

        // Update base type opacity across all linked layers that share the prop
        setPaintAcross(map, ids, baseOpacityProp, newOpacity);

        // Additionally, ensure spider link layer tracks opacity even if base is circle/fill
        // (link layer uses 'line-opacity' for connector visibility)
        if (ids.includes(`${layer.id}-spider-links`)) {
          setPaintAcross(
            map,
            [`${layer.id}-spider-links`],
            "line-opacity",
            newOpacity
          );
        }

        // Zone boundaries layer tracks opacity of parent layer (unless mode is fixed)
        const boundariesId = map.getLayer?.(`${layer.id}-boundaries`)
          ? `${layer.id}-boundaries`
          : (layer.name && map.getLayer?.(`${layer.name}-boundaries`))
          ? `${layer.name}-boundaries`
          : null;
        const boundariesMode =
          layer.metadata?.boundariesOpacityMode ??
          layer.boundariesOpacityMode ??
          "inherit";
        if (boundariesId && boundariesMode !== "fixed") {
          setPaintAcross(
            map,
            [boundariesId],
            "line-opacity",
            newOpacity
          );
        }
      });

      setOpacity(newOpacity);
    };

    /**
     * Handle keypress events for accessibility.
     * @param {Object} e - The event object.
     */
    const handleKeyPress = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        setIsExpanded(!isExpanded);
        e.preventDefault();
      }
    };

    /**
     * Handles changes to the width factor slider.
     * Applies the new width factor to the base layer and any linked layers (e.g., spider links).
     *
     * @param {Object} e - The event object from the slider input.
     */
    const handleWidthFactorChange = (e) => {
      const raw = parseFloat(e.target.value);
      const min = isNodeLayer ? 0.1 : 0.5;
      const max = isNodeLayer ? 2.5 : 10;
      const nextFactor = Math.max(min, Math.min(max, raw));

      const baseWidthProp = getWidthProperty(layer.type);

      const customOffset =
        effectiveDefaultLineOffset !== undefined &&
        effectiveDefaultLineOffset !== null
          ? effectiveDefaultLineOffset
          : undefined;

      maps.forEach((map) => {
        const ids = getLinkedLayerIds(map, layer.id);

        // Apply factor to all linked layers that share the same paint prop
        setWidthAcross(map, ids, baseWidthProp, nextFactor, customOffset);

        // Ensure spider link layer’s line-width follows too (for point layers with connectors)
        const linkId = `${layer.id}-spider-links`;
        if (ids.includes(linkId)) {
          setWidthAcross(map, [linkId], "line-width", nextFactor, customOffset);
        }
      });

      setWidth(nextFactor);
      mapDispatch?.({
        type: actionTypes.UPDATE_LAYER_WIDTH_FACTOR,
        payload: {
          layerName: layer.id,
          widthFactor: nextFactor,
        },
      });
    };

    const showLayerSearch = enableZoomToFeature && layer.metadata?.path;

    const showColourSchemeDropdown =
      layer.metadata?.isStylable &&
      !enforceNoColourSchemeSelector &&
      !(
        (visualisation?.queryParams?.[selectedMetricParamName?.paramName]
          ?.value === "Excess Seating" ||
          visualisation?.queryParams?.[selectedMetricParamName?.paramName]
            ?.value === "Passengers Over Seating Capacity") &&
        (currentPage.pageName === "Link Totals" ||
          currentPage.pageName === "Link Totals Side-by-Side")
      );

    const showBandEditor =
      layer.metadata?.isStylable &&
      canEditBands &&
      !enforceNoCustomBanding &&
      (colorStyle === "continuous" || colorStyle === "diverging");

    const showClassificationDropdownStandalone =
      layer.metadata?.isStylable &&
      !enforceNoClassificationMethod &&
      !showBandEditor;

    const renderSectionList = (sections) =>
      sections
        .filter(Boolean)
        .map((section, idx) => (
          <React.Fragment key={section.key}>
            {idx > 0 && <SectionDivider />}
            {section.node}
          </React.Fragment>
        ));

    const collapsibleSections = [];

    if (showLayerSearch) {
      collapsibleSections.push({
        key: "search",
        node: <LayerSearch map={maps[0]} layer={layer} />,
      });
    }

    if (shouldHaveOpacityControl) {
      collapsibleSections.push({
        key: "opacity",
        node: (
          <OpacityControl>
            <ControlLabel htmlFor={`opacity-${layer.id}`}>Opacity</ControlLabel>
            <Slider
              id={`opacity-${layer.id}`}
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={handleOpacityChange}
            />
            <SliderValue>{(opacity * 100).toFixed(0)}%</SliderValue>
          </OpacityControl>
        ),
      });
    }

    const isSwitchableBoundaries = Boolean(
      layer.metadata?.switchableBoundaries ?? layer.switchableBoundaries
    );
    if (isSwitchableBoundaries) {
      collapsibleSections.push({
        key: "boundaries-toggle",
        node: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
            <ControlLabel htmlFor={`boundaries-toggle-${layer.id}`}>
              {layer.metadata?.boundariesLabel || layer.boundariesLabel || "Show zone boundaries"}
            </ControlLabel>
            <input 
              type="checkbox" 
              id={`boundaries-toggle-${layer.id}`} 
              checked={boundariesVisibility === "visible"}
              onChange={toggleBoundariesVisibility}
              style={{ cursor: "pointer" }}
            />
          </div>
        )
      });
    }

    if (showWidth) {
      collapsibleSections.push({
        key: "width",
        node: (
          <WidthControl>
            <ControlLabel htmlFor={`width-${layer.id}`}>Width factor</ControlLabel>
            <Slider
              id={`width-${layer.id}`}
              data-testid="slider width factor"
              type="range"
              min={isNodeLayer ? 0.1 : 0.5}
              max={isNodeLayer ? 2.5 : 10} // 2.5 for nodes, 10 for links
              step="0.1"
              value={widthFactor}
              onChange={handleWidthFactorChange}
            />
            <SliderValue>{widthFactor.toFixed(1)}</SliderValue>
          </WidthControl>
        ),
      });
    }

    if (layer.metadata?.isStylable) {
      const stylableSections = [];

      if (showColourSchemeDropdown) {
        stylableSections.push({
          key: "colour-scheme",
          node: (
            <>
              <ColourSchemeDropdown
                colorStyle={colorStyle}
                handleColorChange={handleColorChange}
                layerName={layer.id}
              />
              <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
                <input
                  id={`invert-colour-${layer.id}`}
                  type="checkbox"
                  checked={state.layers?.[layer.id]?.invertedColorScheme === true}
                  onChange={() => {
                    mapDispatch?.({
                      type: actionTypes.TOGGLE_INVERTED_COLOR_SCHEME,
                      payload: { layerName: layer.id },
                    });
                  }}
                  style={{ marginRight: "0.5rem", cursor: "pointer" }}
                />
                <ControlLabel
                  htmlFor={`invert-colour-${layer.id}`}
                  style={{ marginBottom: 0, cursor: "pointer" }}
                >
                  Invert colour scheme
                </ControlLabel>
              </div>
            </>
          ),
        });
      }

      if (showBandEditor) {
        stylableSections.push({
          key: "band-editor",
          node: (
            <>
              {!enforceNoClassificationMethod && (
                <>
                  <SelectorLabel text="Edit banding" />
                  <ClassificationDropdown
                    classType={{
                      Default: "d",
                      Custom: "c",
                      Quantile: "q",
                      Equidistant: "e",
                      Logarithmic: "l",
                      "K-Means": "k",
                      "Jenks Natural Breaks": "j",
                      "Standard Deviation": "s",
                      "Head/Tail Breaks": "h",
                    }}
                    classification={state.layers[layer.id]?.class_method ?? "d"}
                    onChange={(value) => handleClassificationChange(value, layer.id)}
                  />
                </>
              )}
              <BandEditor
                showLabel={enforceNoClassificationMethod}
                bands={editorBins}
                onChange={(newBands) => {
                  handleCustomBandsChange(
                    isLineDiverging
                      ? newBands.slice(Math.floor(newBands.length / 2))
                      : newBands,
                    layer.id
                  );
                }}
                isDiverging={colorStyle === "diverging"}
                isSymmetric={isLineDiverging}
                isCustom={currentClassMethod === "c"}
                onBandCountChange={(bandCount) => {
                  mapDispatch?.({
                    type: actionTypes.UPDATE_BAND_COUNT,
                    payload: { bandCount, layerName: layer.id },
                  });
                }}
                hasBandCount={bandCountFromState !== null}
                previewBandsForCount={previewBandsForCount}
                data={bandEditorData}
                defaultBandValues={defaultBandValues || null}
                onReset={() => {
                  const target = prevNonCustomClassMethodRef.current || "d";
                  handleCustomBandsChange([], layer.id);
                  handleClassificationChange(target, layer.id);
                }}
              />
            </>
          ),
        });
      }

      if (showClassificationDropdownStandalone) {
        stylableSections.push({
          key: "classification",
          node: (
            <ClassificationDropdown
              classType={{
                Default: "d",
                Quantile: "q",
                Equidistant: "e",
                Logarithmic: "l",
                "K-Means": "k",
                "Jenks Natural Breaks": "j",
                "Standard Deviation": "s",
                "Head/Tail Breaks": "h",
              }}
              classification={state.layers[layer.id]?.class_method ?? "d"}
              onChange={(value) => handleClassificationChange(value, layer.id)}
            />
          ),
        });
      }

      collapsibleSections.push({
        key: "stylable",
        node: <div style={{ marginTop: "1rem" }}>{renderSectionList(stylableSections)}</div>,
      });
    }

    return (
      <LayerControlContainer>
        <LayerHeader>
          {/* HeaderLeft now handles click and keypress to toggle expansion */}
          <HeaderLeft
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex="0"
            aria-expanded={isExpanded}
            onKeyDown={handleKeyPress}
            data-testid="HeaderLeft"
          >
            {/* Expand/Collapse Toggle (now a span) */}
            <ExpandCollapseToggle>
              {isExpanded ? <ChevronDownIcon data-testid="ChevronDownIcon"/> : <ChevronRightIcon data-testid="ChevronRightIcon"/>}
            </ExpandCollapseToggle>
            {/* Layer Name */}
            <LayerName>{layer.id}</LayerName>
          </HeaderLeft>
          {/* Visibility Toggle */}
          <VisibilityToggle onClick={toggleVisibility} data-testid="visibility-toggle">
            {visibility === "visible" ? (
              <EyeIcon aria-label="Hide layer" title="Hide layer" />
            ) : (
              <EyeSlashIcon aria-label="Show layer" title="Show layer" />
            )}
          </VisibilityToggle>
        </LayerHeader>
        {/* Collapsible Content with Animation */}
        <CollapsibleContent isExpanded={isExpanded}>
          {renderSectionList(collapsibleSections)}
        </CollapsibleContent>
      </LayerControlContainer>
    );
  }
);