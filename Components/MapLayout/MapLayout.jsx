import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";

import { Dimmer, MapLayerSection, Sidebar } from "Components";
import { PageContext } from "contexts";
import { useMapContext } from "hooks";
import { api } from "services";
import { loremIpsum } from "utils";
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
  const isLoading = state.isLoading;
  const pageContext = useContext(PageContext);
  const initializedRef = useRef(false);

  useEffect(() => {
    initializedRef.current = false;
    // await fetchMetadataFilters(pageContext, dispatch);
  }, [pageContext]);

  useEffect(() => {
    const fetchMetadataFilters = async (pageContext, dispatch) => {
      const path = "/api/tame/mvdata";
      const dataPath = {
        dataPath: pageContext.config.visualisations[0].dataPath,
      };
      try {
        const metadataFilters = await api.baseService.post(path, dataPath, {
          skipAuth: false,
        });
        const apiFilterValues = Object.groupBy(
          metadataFilters,
          ({ field_name }) => field_name
        );
        pageContext.config.filters.forEach((filter) => {
          if (
            filter.type === "map" ||
            filter.type === "slider" ||
            filter.values.source === "local"
          ) {
            filter.actions.map((action) => {
              if (action.action === "UPDATE_QUERY_PARAMS") {
                let defaultValue =
                  filter.defaultValue ||
                  filter.min ||
                  filter.values?.values[0]?.paramValue;
                dispatch({
                  type: action.action,
                  payload: { filter, value: defaultValue },
                });
              } else {
                let defaultValue =
                  filter.defaultValue ||
                  filter.min ||
                  filter.values?.values[0]?.paramValue;
                var sides = "";
                if (filter.filterName.includes("Left")) sides = "left";
                else if (filter.filterName.includes("Right")) sides = "right";
                else sides = "both";
                dispatch({
                  type: action.action,
                  payload: { filter, value: defaultValue, sides: sides },
                });
              }
            });
          } else {
            filter.actions.map((action) => {
              const baseParamName = filter.paramName.includes("DoMinimum")
                ? filter.paramName.replace("DoMinimum", "")
                : filter.paramName.includes("DoSomething")
                ? filter.paramName.replace("DoSomething", "")
                  : filter.paramName;
              const defaultValue =
                apiFilterValues[baseParamName][0].distinct_values[0];
              if (action.action === "UPDATE_QUERY_PARAMS") {
                dispatch({
                  type: action.action,
                  payload: { filter, value: defaultValue },
                });
              } else {
                var sides = "";
                if (filter.filterName.includes("Left")) sides = "left";
                else if (filter.filterName.includes("Right")) sides = "right";
                else sides = "both";
                dispatch({
                  type: action.action,
                  payload: { filter, value: defaultValue, sides: sides },
                });
              }
            });
          }
        });
        initializedRef.current = true;
        dispatch({
          type: "UPDATE_METADATA_FILTER",
          payload: { metadataFilters: [apiFilterValues] },
        });
      } catch (error) {
        console.error("Error fetching metadata filters", error);
      }
    };

    // Effect to initialise the filters for the map page
    if (
      !initializedRef.current &&
      Object.keys(state.visualisations).length > 0
    ) {
      fetchMetadataFilters(pageContext, dispatch);
    }
  }, [
    pageContext.config.filters,
    dispatch,
    state.visualisations,
    state.leftVisualisations,
    state.rightVisualisations,
    state.metadataFilters,
    pageContext,
  ]);

  const handleFilterChange = (filter, value) => {
    if (!filter.visualisations[0].includes("Side")) {
      filter.actions.map((action) => {
        dispatch({
          type: action.action,
          payload: { filter, value },
        });
      });
    } else {
      filter.actions.map((action) => {
        var sides = "";
        if (filter.filterName.includes("Left")) sides = "left";
        else if (filter.filterName.includes("Right")) sides = "right";
        else sides = "both";
        var sides = "";
        if (filter.filterName.includes("Left")) sides = "left";
        else if (filter.filterName.includes("Right")) sides = "right";
        else sides = "both";
        dispatch({
          type: action.action,
          payload: { filter, value, sides },
          payload: { filter, value, sides },
        });
      });
    }
  };

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
        filters={pageContext.config.filters}
        legalText={loremIpsum}
        onFilterChange={handleFilterChange}
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
