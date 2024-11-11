import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { Dimmer, MapLayerSection, Sidebar } from "Components";
import { PageContext } from "contexts";
import { useMapContext, useFilterContext } from "hooks";
import { loremIpsum, updateFilterValidity } from "utils";
import DualMaps from "./DualMaps";
import Map from "./Map";

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 75px);
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
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
  const pageContext = useContext(PageContext);
  const initializedRef = useRef(false);
  const pageRef = useRef(pageContext);

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
      type: "SET_FILTER_VALUE",
      payload: { filterId: filter.id, value },
    });
  };

  useEffect(() => {
    const validatedFilters = updateFilterValidity(state, filterState);

    dispatch({
      type: "UPDATE_FILTER_VALUES",
      payload: { updatedFilters: validatedFilters },
    });

    state.filters.forEach((filter) => {
      if (!filter.visualisations[0].includes("Side")) {
        filter.actions.forEach((action) => {
          dispatch({
            type: action.action,
            payload: { filter, value: filterState[filter.id], ...action.payload },
          });
        });
      } else {
        filter.actions.forEach((action) => {
          let sides = "";
          if (filter.filterName.includes("Left")) sides = "left";
          else if (filter.filterName.includes("Right")) sides = "right";
          else sides = "both";
          dispatch({
            type: action.action,
            payload: { filter, value: filterState[filter.id], sides, ...action.payload },
          });
        });
      }
    });
  }, [filterState, state.metadataTables, dispatch]);

  const handleColorChange = (color) => {
    dispatch({
      type: "UPDATE_COLOR_SCHEME",
      payload: { color_scheme: color },
    });
  };

  const handleClassificationChange = (classType) => {
    dispatch({
      type: "UPDATE_CLASSIFICATION_METHOD",
      payload: { class_method: classType },
    });
  };

  return (
    <LayoutContainer>
      <Dimmer dimmed={isLoading} showLoader={true} />
      <Sidebar
        pageName={pageContext.pageName}
        aboutVisualisationText={pageContext.about ?? loremIpsum}
        filters={state.filters}
        legalText={loremIpsum}
        onFilterChange={handleFilterChange}
        additionalFeatures={pageContext.config.additionalFeatures} // Pass additionalFeatures prop
      >
        <MapLayerSection
          handleColorChange={handleColorChange}
          handleClassificationChange={handleClassificationChange}
        />
      </Sidebar>
      {pageContext.type === "MapLayout" && (
        <MapContainer>
          <Map />
        </MapContainer>
      )}
      {pageContext.type === "DualMapLayout" && (
        <MapContainer>
          <DualMaps />
        </MapContainer>
      )}
    </LayoutContainer>
  );
};
