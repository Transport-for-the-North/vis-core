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
import { ColourSchemeDropdown, BandEditor } from "../Selectors";  
import { ClassificationDropdown } from "../Selectors/ClassificationDropdown";  
import { AppContext, PageContext } from "contexts";  
import { calculateMaxWidthFactor, applyWidthFactor, updateOpacityExpression } from "utils/map"  
  
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
* LayerControlEntry component represents a single layer control entry in the map layer control panel.  
*  
* @component  
* @param {Object} props - The component props.  
* @param {Object} props.layer - The layer object containing information about the map layer.  
* @param {Array} props.maps - An array of MapLibre map instances.  
* @param {Function} props.handleColorChange - The function to handle color changes for the layer.  
* @param {Function} props.handleClassificationChange - The function to handle classification changes for the layer.  
* @param {Object} props.state - The current application state.
* @returns {JSX.Element} The rendered LayerControlEntry component.  
*/  
export const LayerControlEntry = memo(  
  ({  
    layer,  
    maps,  
    handleColorChange,  
    handleClassificationChange,  
    state,  
  }) => {  
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
            prop.endsWith('opacity') && current !== undefined  
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
      return layer.metadata?.colorStyle || visualisation?.style?.split("-")[1] || "continuous";  
    }, [layer.metadata?.colorStyle, visualisation?.style]);  
  
    const hasDefaultBands = selectedPageBands?.metric.find(  
      (metric) =>  
        metric.name ===  
        visualisation.queryParams[selectedMetricParamName.paramName]?.value  
    );  
  
    const shouldHaveOpacityControl = layer.metadata?.shouldHaveOpacityControl ?? true;  
    const enforceNoColourSchemeSelector = layer.metadata?.enforceNoColourSchemeSelector ?? false;  
    const enforceNoClassificationMethod = layer.metadata?.enforceNoClassificationMethod ?? false;  
    const widthProp = getWidthProperty(layer.type);  
    const enableZoomToFeature = layer.metadata?.enableZoomToFeature ?? Boolean(layer.metadata?.path);  
    const layerConfigFromState = state?.layers?.[layer.id];  
    const effectiveDefaultLineOffset =  
      layerConfigFromState?.defaultLineOffset ??  
      layer.metadata?.defaultLineOffset ??  
      layer.defaultLineOffset;  
  
    let currentWidthFactor = null;  
    let currentOpacity = null;  
  
    if (maps.length > 0 && maps[0].getLayer(layer.id)) {  
      const opacityProp = getOpacityProperty(layer.type);  
      currentOpacity = maps[0].getPaintProperty(layer.id, opacityProp);  
      currentWidthFactor = widthProp ? maps[0].getPaintProperty(layer.id, widthProp) : null;  
    }  
  
    const isFeatureStateExpression =  
      Array.isArray(currentOpacity) && currentOpacity[0] === "case";  
    const initialOpacity = isFeatureStateExpression  
      ? currentOpacity[currentOpacity.length - 1]  
      : currentOpacity;  
  
  
    const isFeatureStateWidthExpression =  
      Array.isArray(currentWidthFactor) && currentWidthFactor[0] === "interpolate";  
      const isNodeLayer = layer.type === "circle";  //station nodes are circle layers  
      const showWidth = isFeatureStateWidthExpression || isNodeLayer;  
    const initialWidth = isFeatureStateWidthExpression  
      ? calculateMaxWidthFactor(currentWidthFactor[currentWidthFactor.length - 1], widthProp)  
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
        : (initialWidth || 1);  
  
    const [widthFactor, setWidth] = useState(initialWidthForUI);  
  
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
          setPaintAcross(map, [`${layer.id}-spider-links`], 'line-opacity', newOpacity);  
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
      
      // Use the robust effectiveDefaultLineOffset from the current branch
      const customOffset = effectiveDefaultLineOffset !== undefined && effectiveDefaultLineOffset !== null 
        ? effectiveDefaultLineOffset 
        : undefined;
  
      maps.forEach((map) => {  
        const ids = getLinkedLayerIds(map, layer.id);  
  
        // Apply factor to all linked layers that share the same paint prop  
        setWidthAcross(map, ids, baseWidthProp, nextFactor, customOffset);  
  
        // Ensure spider link layer’s line-width follows too (for point layers with connectors)  
        const linkId = `${layer.id}-spider-links`;  
        if (ids.includes(linkId)) {  
          setWidthAcross(map, [linkId], 'line-width', nextFactor, customOffset);  
        }  
      });  
  
      setWidth(nextFactor);  
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
          {/* Layer Search (if applicable) */}  
          {enableZoomToFeature && layer.metadata?.path && (  
            <LayerSearch map={maps[0]} layer={layer} />  
          )}  
          {/* Opacity Control */}  
          {shouldHaveOpacityControl && (<OpacityControl>  
            <ControlLabel htmlFor={`opacity-${layer.id}`}>  
              Opacity  
            </ControlLabel>  
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
          </OpacityControl>)}  
          {/* Width Control (if applicable) */}  
          {showWidth && (  
            <WidthControl>  
              <ControlLabel htmlFor={`width-${layer.id}`}>Width factor</ControlLabel>  
              <Slider  
                id={`width-${layer.id}`}  
                data-testid="slider width factor"  
                type="range"  
                min={isNodeLayer ? 0.1 : 0.5}  
                max={isNodeLayer ? 2.5 : 10}   // 2.5 for nodes, 10 for links  
                step="0.1"  
                value={widthFactor}  
                onChange={handleWidthFactorChange}  
              />  
              <SliderValue>{widthFactor.toFixed(1)}</SliderValue>  
            </WidthControl>  
          )}  
          {/* Color Scheme, Band Editor, and Classification (if stylable) */}  
          {layer.metadata?.isStylable && (  
            <div style={{ marginTop: "1rem" }}>  
              {!enforceNoColourSchemeSelector &&  
                !((visualisation?.queryParams?.[selectedMetricParamName?.paramName]?.value === "Excess Seating" ||  
                  visualisation?.queryParams?.[selectedMetricParamName?.paramName]?.value === "Passengers Over Seating Capacity") &&  
                  (currentPage.pageName === "Link Totals" || currentPage.pageName === "Link Totals Side-by-Side")) &&  
                <ColourSchemeDropdown  
                  colorStyle={colorStyle}  
                  handleColorChange={handleColorChange}  
                  layerName={layer.id}  
                />}  
  
              {/* BandEditor for continuous/diverging only  
              {(colorStyle === "continuous" || colorStyle === "diverging") && hasDefaultBands && (  
                <BandEditor  
                  bands={hasDefaultBands.values}  
                  onChange={(newBands) => {  
                    // TODO: Implement update logic for bands in state and map/legend  
                    // Example: dispatch({ type: 'UPDATE_BANDS', layerId: layer.id, bands: newBands })  
                  }}  
                  isDiverging={colorStyle === "diverging"}  
                />  
              )} */}  
  
              {!enforceNoClassificationMethod && <ClassificationDropdown  
                classType={{  
                  ...(hasDefaultBands?.values && {Default: "d"}),  
                  Quantile: "q",  
                  Equidistant: "e",  
                  Logarithmic: "l",  
                  "K-Means": "k",  
                  "Jenks Natural Breaks": "j",  
                  "Standard Deviation": "s",  
                  "Head/Tail Breaks": "h",  
                }}  
                classification={  
                  state.layers[layer.id]?.class_method ?? "d"  
                }  
                onChange={(value) =>  
                  handleClassificationChange(value, layer.id)  
                }  
              />}  
            </div>  
          )}  
        </CollapsibleContent>  
      </LayerControlContainer>  
    );  
  }  
);  