import { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components';

import Map from "./Map";
import { Sidebar } from 'Components';
import { PageContext, MapContext } from 'contexts';
import { loremIpsum } from 'utils';

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 75px);
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const MapLayout = () => {
  const { state, dispatch } = useContext(MapContext);
  const pageContext = useContext(PageContext);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Effect to initialise the filters for the map page
    if (!initializedRef.current && Object.keys(state.visualisations).length > 0) {
      pageContext.config.filters.forEach((filter) => {
        if (filter.action === "UPDATE_QUERY_PARAMS") {
          let defaultValue = filter.defaultValue || filter.min || filter.values?.values[0]?.paramValue;
          dispatch({
            type: filter.action,
            payload: { filter, value: defaultValue },
          });
        }
      });
      initializedRef.current = true;
    }
  }, [pageContext.config.filters, dispatch, state.visualisations]);

  useEffect(() => {
    initializedRef.current = false;
  }, [pageContext]);

  const handleFilterChange = (filter, value) => {
    dispatch({
      type: filter.action,
      payload: { filter, value },
    });
  };
  
  return (
    <LayoutContainer>
      <Sidebar 
        pageName={pageContext.pageName}
        aboutVisualisationText={loremIpsum}
        filters={pageContext.config.filters}
        legalText={loremIpsum}
        onFilterChange={handleFilterChange}
      />
      <MapContainer>
        <Map/>
      </MapContainer>
      {/* <Dimmer dimmed={state.isloading} showLoader={true}/> */}
    </LayoutContainer>
  );
};

  