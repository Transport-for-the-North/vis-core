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
import { ColourSchemeDropdown, BandEditor, SelectorLabel } from "../Selectors";
import { ClassificationDropdown } from "../Selectors/ClassificationDropdown";
import { AppContext, PageContext } from "contexts";
import { calculateMaxWidthFactor, applyWidthFactor, updateOpacityExpression } from "utils/map";
import { useMapContext } from "hooks";
import { actionTypes } from "reducers";

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
  color: #333;
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
    color: #555;
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
  color: #333;
`;

/**
 * Styled span for displaying the opacity value.
 */
const SliderValue = styled.span`
  font-size: 0.9rem;
  width: 36px;
  text-align: right;
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
    const mapContext = useMapContext();
    const dispatch = mapContext?.dispatch;

    const [visibility, setVisibility] = useState(
      layer.layout?.visibility || "visible"
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
    const mapConfig = currentPage?.config?.map;
    const defaultNodeWidthFactorFromPage = mapConfig?.defaultNodeWidthFactor;
    const appConfig = useContext(AppContext);
    const selectedMetricParamName = currentPage.config.filters.find(
      (filter) => filter.containsLegendInfo === true
    );
    const selectedPageBands = appConfig.defaultBands.find((band) => {
      if (!currentPage) return false;
      const categoryOrName = currentPage.category || currentPage.pageName;
      return band.name === categoryOrName;
    });
    const visualisation =
      currentPage.pageName.includes("Side-by-Side") ||
      currentPage.pageName.includes("Side by Side")
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

    const hasDefaultBands = selectedPageBands?.metric.find(
      (metric) =>
        metric.name ===
        visualisation.queryParams[selectedMetricParamName.paramName]?.value
    );

    const shouldHaveOpacityControl =
      layer.metadata?.shouldHaveOpacityControl ?? true;
    const enforceNoColourSchemeSelector =
      layer.metadata?.enforceNoColourSchemeSelector ?? false;
    const enforceNoClassificationMethod =
      layer.metadata?.enforceNoClassificationMethod ?? false;
    const widthProp = getWidthProperty(layer.type);
    const enableZoomToFeature =
      layer.metadata?.enableZoomToFeature ?? Boolean(layer.metadata?.path);
    const layerConfigFromState = state?.layers?.[layer.id];
    const isLineLayer = layer.type === "line";
    const isFixedLineWidth =
      isLineLayer &&
      (layerConfigFromState?.fixLineWidth ?? layer.metadata?.fixLineWidth) ===
        true;
    const fixedLineWidthFromState = layerConfigFromState?.fixedLineWidth;
    const effectiveFixedLineWidth = Number.isFinite(fixedLineWidthFromState)
      ? fixedLineWidthFromState
      : 3;

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
    const isNodeLayer = layer.type === "circle"; // station nodes are circle layers
    const showWidth =
      (isFeatureStateWidthExpression || isNodeLayer) && !isFixedLineWidth;
    const initialWidth = isFeatureStateWidthExpression
      ? calculateMaxWidthFactor(
          currentWidthFactor[currentWidthFactor.length - 1],
          widthProp
        )
      : currentWidthFactor;

    // State for opacity of the layer
    const [opacity, setOpacity] = useState(initialOpacity || 0.5);
    const desiredDefaultNodeWidth =
      typeof defaultNodeWidthFactorFromPage === "number"
        ? defaultNodeWidthFactorFromPage
        : null;

    const initialWidthForUI =
      isNodeLayer && desiredDefaultNodeWidth != null
        ? desiredDefaultNodeWidth
        : initialWidth || 1;

    const [widthFactor, setWidth] = useState(initialWidthForUI);

    // Stores per-map original line-width paint so we can restore when toggling off.
    const originalLineWidthByMapRef = useRef(new WeakMap());

    const captureOriginalLineWidths = (map, ids) => {
      if (!map) return;
      const existing = originalLineWidthByMapRef.current.get(map) || {};
      const next = { ...existing };
      ids.forEach((id) => {
        try {
          next[id] = map.getPaintProperty(id, "line-width");
        } catch {
          // ignore
        }
      });
      originalLineWidthByMapRef.current.set(map, next);
    };

    const restoreOriginalLineWidths = (map, ids) => {
      if (!map) return;
      const stored = originalLineWidthByMapRef.current.get(map);
      if (!stored) return;
      ids.forEach((id) => {
        if (!(id in stored)) return;
        try {
          map.setPaintProperty(id, "line-width", stored[id]);
        } catch {
          // ignore
        }
      });
    };

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

    // Extract current bins for BandEditor.
    // Prefer the canonical state-driven custom bands (when in custom mode), because
    // the `layer.paint` object often doesn't update in lockstep with runtime map
    // paint changes and can lead to the editor snapping back after the first update.
    const currentBins = useMemo(() => {
      if (currentClassMethod === "c") {
        if (
          Array.isArray(customBandsFromState) &&
          customBandsFromState.length > 0
        ) {
          return customBandsFromState;
        }
      }

      if (!maps.length || !maps[0].getLayer(layer.id)) {
        return hasDefaultBands?.values || [0, 1, 2, 3, 4];
      }

      const paintProps = layer.paint;
      const colorExpression =
        paintProps?.["line-color"] ||
        paintProps?.["circle-color"] ||
        paintProps?.["fill-color"];

      if (!colorExpression || !Array.isArray(colorExpression)) {
        return hasDefaultBands?.values || [0, 1, 2, 3, 4];
      }

      // Extract bins from interpolate expression: ["interpolate", ["linear"], ["feature-state", "value"], bin1, color1, bin2, color2, ...]
      if (colorExpression[0] === "interpolate") {
        const stops = colorExpression.slice(3); // Skip ["interpolate", ["linear"], ["feature-state", "value"]]
        const bins = [];
        for (let i = 0; i < stops.length; i += 2) {
          bins.push(stops[i]);
        }
        return bins.length > 0
          ? bins
          : hasDefaultBands?.values || [0, 1, 2, 3, 4];
      }

      return hasDefaultBands?.values || [0, 1, 2, 3, 4];
    }, [
      currentClassMethod,
      customBandsFromState,
      maps,
      layer.id,
      layer.paint,
      hasDefaultBands,
    ]);

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
      });

      setVisibility(newVisibility);
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
    };

    const handleFixLineWidthToggle = (e) => {
      const nextEnabled = Boolean(e.target.checked);

      if (dispatch) {
        dispatch({
          type: actionTypes.UPDATE_LAYER_FIXED_LINE_WIDTH,
          payload: {
            layerName: layer.id,
            fixLineWidth: nextEnabled,
            fixedLineWidth: effectiveFixedLineWidth,
          },
        });
      }

      maps.forEach((map) => {
        const ids = getLinkedLayerIds(map, layer.id);

        if (nextEnabled) {
          captureOriginalLineWidths(map, ids);
          setPaintAcross(map, ids, "line-width", effectiveFixedLineWidth);
        } else {
          restoreOriginalLineWidths(map, ids);
        }
      });
    };

    const handleFixedLineWidthChange = (e) => {
      const raw = parseFloat(e.target.value);
      const nextWidth = Math.max(2, Math.min(12, Math.round(raw)));

      if (dispatch) {
        dispatch({
          type: actionTypes.UPDATE_LAYER_FIXED_LINE_WIDTH,
          payload: {
            layerName: layer.id,
            fixedLineWidth: nextWidth,
          },
        });
      }

      maps.forEach((map) => {
        const ids = getLinkedLayerIds(map, layer.id);
        setPaintAcross(map, ids, "line-width", nextWidth);
      });
    };

    const appliedNodeDefaultRef = useRef(false);

    useEffect(() => {
      if (appliedNodeDefaultRef.current) return;
      if (!maps?.length) return;
      if (!isNodeLayer) return;
      if (!widthProp) return;
      if (isFeatureStateWidthExpression) return;

      if (typeof desiredDefaultNodeWidth !== "number") return;

      maps.forEach((map) => {
        if (map?.getLayer?.(layer.id)) {
          map.setPaintProperty(layer.id, widthProp, desiredDefaultNodeWidth);
        }
      });

      setWidth(desiredDefaultNodeWidth);
      appliedNodeDefaultRef.current = true;
    }, [
      maps,
      layer.id,
      isNodeLayer,
      widthProp,
      isFeatureStateWidthExpression,
      desiredDefaultNodeWidth,
    ]);

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

    if (isLineLayer) {
      collapsibleSections.push({
        key: "fixed-line-width",
        node: (
          <div>
            <OpacityControl>
              <input
                id={`fix-line-width-${layer.id}`}
                data-testid="checkbox fix line width"
                type="checkbox"
                checked={isFixedLineWidth}
                onChange={handleFixLineWidthToggle}
              />
              <ControlLabel htmlFor={`fix-line-width-${layer.id}`}>
                Fix line width
              </ControlLabel>
            </OpacityControl>

            {isFixedLineWidth && (
              <WidthControl>
                <ControlLabel htmlFor={`fixed-width-${layer.id}`}>
                  Fixed width
                </ControlLabel>
                <Slider
                  id={`fixed-width-${layer.id}`}
                  data-testid="slider fixed line width"
                  type="range"
                  min={2}
                  max={12}
                  step={1}
                  value={effectiveFixedLineWidth}
                  onChange={handleFixedLineWidthChange}
                />
                <SliderValue>{effectiveFixedLineWidth.toFixed(0)}</SliderValue>
              </WidthControl>
            )}
          </div>
        ),
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
            <ColourSchemeDropdown
              colorStyle={colorStyle}
              handleColorChange={handleColorChange}
              layerName={layer.id}
            />
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
                bands={currentBins}
                onChange={(newBands) => {
                  handleCustomBandsChange(newBands, layer.id);
                }}
                isDiverging={colorStyle === "diverging"}
                isCustom={currentClassMethod === "c"}
                data={bandEditorData}
                defaultBandValues={hasDefaultBands?.values || null}
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