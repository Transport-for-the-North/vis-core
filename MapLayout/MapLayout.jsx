import { useContext } from "react";

import Map from "./Map";
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { PageConfigContext } from 'contexts';
import { FilterProvider } from "./FilterContext";

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 75px);
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const MapLayout = () => {
  const pageConfig = useContext(PageConfigContext)
  const { layers, filters } = pageConfig.config
  return (
      <FilterProvider>
      <LayoutContainer>
        <Sidebar filters={filters} />
        <MapContainer>
          <Map layers={layers} />
        </MapContainer>
      </LayoutContainer>
      </FilterProvider>
    );
  };
  