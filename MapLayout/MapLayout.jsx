import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Dimmer, MapLayerSection, Sidebar, DynamicStylingStatus } from "Components";
import { PageContext } from "contexts";
import { useMapContext, useFilterContext, useLayerZoomMessage } from "hooks";
import { loremIpsum, updateFilterValidity } from "utils";
import { defaultBgColour } from "defaults";
import DualMaps from "./DualMaps";
import Map from "./Map";
import { actionTypes } from "reducers";

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 75px);
  @media ${props => props.theme.mq.mobile} {
   flex-direction: column;   /* stack Sidebar above Map */
   height: auto;             /* let content dictate height */
  }
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  @media ${props => props.theme.mq.mobile} {
   flex: 0 0 auto;
   min-height: 60vh; /* ensure minimum height on mobile */}
`;

const MobileCardsSlot = styled.div`
  display: none;  
  @media ${props => props.theme.mq.mobile} {
    display: block;
    width: 100%;
    }
`;

const MobileLegendSlot = styled.section`
  display: none;

  @media ${props => props.theme.mq.mobile} {
    display: block;
    width: 100%;
    box-sizing: border-box
  }
`;

/**
 * MapLayout component is the main layout component that composes the Map,
 * Sidebar, and MapLayerSection components. It serves as the container for
 * the map visualisation and its associated controls.
 * The component uses the MapContext to manage the state of the map and its
 * layers, and it provides the necessary props to the Sidebar and MapLayerSection
 * components.
 *
 * @component
 * @returns {JSX.Element} The rendered MapLayout component.
 */
export const MapLayout = () => {
  const { state, dispatch } = useMapContext();
  const { state: filterState, dispatch: filterDispatch } = useFilterContext();
  const isLoading = state.isLoading;
  const isDynamicStylingLoading = state.isDynamicStylingLoading;
  const pageContext = useContext(PageContext);
  const initializedRef = useRef(false);
  const pageRef = useRef(pageContext);
  const layerZoomMessage = useLayerZoomMessage();
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  useEffect(() => {
    if (!initializedRef.current && state.pageIsReady) {
      state.filters.forEach((filter) => {
        filter.actions.forEach((actionObj) => {
          let defaultValue =
            filter.defaultValue ||
            filter.min ||
            filter.values?.values[0]?.paramValue;

          let sides = "";
          if (filter.filterName.includes("Left")) sides = "left";
          else if (filter.filterName.includes("Right")) sides = "right";
          else sides = "both";
          dispatch({
            type: actionObj.action,
            payload: { filter, value: defaultValue, sides: sides, ...actionObj.payload },
          });
        });
      });
      initializedRef.current = true;
    }
  }, [dispatch, state.pageIsReady, state.filters, state.visualisations]);

  useEffect(() => {
    if (pageRef.current !== pageContext) {
      initializedRef.current = false;
      pageRef.current = pageContext;
      filterDispatch({ type: "RESET_FILTERS" });
    }
  }, [pageContext, filterDispatch]);

  const handleFilterChange = (filter, value) => {
    filterDispatch({
      type: 'SET_FILTER_VALUE',
      payload: { filterId: filter.id, value },
    });
  };

  /**
   * Keep derived filters in sync with their source selection and metadata.
   * For every filter that declares `deriveFromFilter`, we:
   * - read the current value of its source filter (`sourceParamName`)
   * - optionally apply override rules driven by other controller filters
   * - otherwise look up a preferred/fallback value from the source metadata (`metadataColumn`)
   * - sync the derived filter to the resolved value, or clear it if no match
   */
  useEffect(() => {
    const derivedFilters = state.filters.filter((filter) => filter.deriveFromFilter);

    for (const derivedFilter of derivedFilters) {
      const {
        sourceParamName,
        metadataColumn,
        preferredValues = [],
      } = derivedFilter.deriveFromFilter ?? {};

      if (!sourceParamName) {
        continue;
      }

      const sourceFilter = state.filters.find((f) => f.paramName === sourceParamName);
      if (!sourceFilter) {
        continue;
      }

      const selectedSourceValue = filterState[sourceFilter.id];
      const sourceMetadataName = sourceFilter.values?.metadataTableName;
      const sourceMetadata = sourceMetadataName ? state.metadataTables[sourceMetadataName] : null;

      let derivedValue = null;

      if (Array.isArray(derivedFilter.overrideRules)) {
        for (const rule of derivedFilter.overrideRules) {
          const controllerFilter = state.filters.find(
            (f) => f.paramName === rule.controllerParamName
          );
          if (!controllerFilter) continue;

          const controllerValue =
            filterState[controllerFilter.id] ?? controllerFilter.defaultValue ?? null;

          if (controllerValue === rule.controllerValue) {
            derivedValue = rule.derivedValue;
            break;
          }
        }
      }

      if (
        derivedValue == null &&
        selectedSourceValue != null &&
        metadataColumn &&
        Array.isArray(sourceMetadata)
      ) {
        const matchingRows = sourceMetadata.filter(
          (row) => row?.[sourceFilter.values.paramColumn] === selectedSourceValue
        );

        if (matchingRows.length > 0) {
          let preferredRow = null;
          if (preferredValues.length > 0) {
            preferredRow = preferredValues
              .map((value) => matchingRows.find((row) => row?.[metadataColumn] === value))
              .find((row) => row);
          }

          const fallbackRow = preferredRow ?? matchingRows[0];
          derivedValue = fallbackRow?.[metadataColumn] ?? null;
        }
      }

      const currentDerivedValue = filterState[derivedFilter.id];

      if (
        derivedValue !== null &&
        derivedValue !== currentDerivedValue
      ) {
        filterDispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: derivedFilter.id, value: derivedValue },
        });
        return;
      }

      if (
        derivedValue === null &&
        currentDerivedValue != null
      ) {
        filterDispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: derivedFilter.id, value: null },
        });
        return;
      }
    }

    const validatedFilters = updateFilterValidity(state, filterState);

    dispatch({
      type: "UPDATE_FILTER_VALUES",
      payload: { updatedFilters: validatedFilters },
    });

    state.filters.forEach((filter) => {
      let selectedValue
      if (filter.values?.values && Array.isArray(filter.values.values)) {
        selectedValue = filter.values?.values.find(
          (value) => value.paramValue === filterState[filter.id]
        );
      }
      if (!filter.visualisations[0].includes("Side")) {
        filter.actions.forEach((action) => {
          // Add the colour scheme to the payload
          let additionalPayload
          if (action.action === "UPDATE_COLOR_SCHEME") {
            additionalPayload = { ...additionalPayload, color_scheme: selectedValue.colourValue }
          }
          dispatch({
            type: action.action,
            payload: { filter, value: filterState[filter.id], ...action.payload, ...additionalPayload },
          });
        });
      } else {
        filter.actions.forEach((action) => {
          let sides = "";
          
          // Add the colour scheme to the payload
          let additionalPayload
          if (action.action === "UPDATE_COLOR_SCHEME") {
            additionalPayload = { ...additionalPayload, color_scheme: selectedValue.colourValue }
          }
          if (filter.filterName.includes("Left")) sides = "left";
          else if (filter.filterName.includes("Right")) sides = "right";
          else sides = "both";
          dispatch({
            type: action.action,
            payload: { filter, value: filterState[filter.id], sides, ...action.payload, ...additionalPayload },
          });
        });
      }
    });
  }, [filterState, state.metadataTables, state.filters, dispatch, filterDispatch]);

  const handleColorChange = (color, layerName) => {
    dispatch({
      type: actionTypes.UPDATE_COLOR_SCHEME,
      payload: { layerName: layerName, color_scheme: color },
    });
  };  

  const handleClassificationChange = (classType, layerName) => {
    dispatch({
      type: "UPDATE_CLASSIFICATION_METHOD",
      payload: { class_method: classType, layerName },
    });
  };

  return (
    <LayoutContainer>
      <Dimmer dimmed={isLoading} showLoader={true} />
      <DynamicStylingStatus isResolving={isDynamicStylingLoading} />
      <Sidebar
        pageName={pageContext.pageName}
        aboutVisualisationText={pageContext.about ?? loremIpsum}
        filters={state.filters}
        legalText={pageContext.legalText ?? loremIpsum}
        onFilterChange={handleFilterChange}
        bgColor={pageContext.navbarLinkBgColour || defaultBgColour}
        additionalFeatures={pageContext.config.additionalFeatures}
        infoBoxText={layerZoomMessage}
        downloadPath={pageContext.config.downloadPath}
        requestMethod={pageContext.config.requestMethod}
        setIsOpen={setSidebarIsOpen}
      >
        <MapLayerSection
          handleColorChange={handleColorChange}
          handleClassificationChange={handleClassificationChange}
        />
      </Sidebar>

      {pageContext.type === "MapLayout" && (
        <MapContainer>
          <Map extraCopyrightText={pageContext.extraCopyrightText ?? ""} sidebarIsOpen={sidebarIsOpen}/>
        </MapContainer>
      )}
      {pageContext.type === "DualMapLayout" && (
        <MapContainer>
          <DualMaps extraCopyrightText={pageContext.extraCopyrightText ?? ""}/>
        </MapContainer>
      )}

      {/* Mobile-only: where summary cards will be portaled into */}
      <MobileCardsSlot id="mobile-cards-slot" className="mobile-cards-slot"/>
      
      <MobileLegendSlot id="mobile-legend-slot" aria-label="Legend" />
    </LayoutContainer>
  );
};