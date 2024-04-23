import Map from "./Map";
import styled from 'styled-components';
import Sidebar from './Sidebar';
import config from './config';
import { FilterProvider } from "./FilterContext";

const pageConfig = config.appPages[0].config;
const { layers, filters } = pageConfig

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarContainer = styled.div`
  width: 300px; /* Adjust width as needed */
  background-color: #fff; /* Example background color */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Example shadow */
  z-index: 2; /* Ensure sidebar overlays the map */
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

const MapLayout = () => {
  
    return (
      <FilterProvider>
      <LayoutContainer>
          <Sidebar filters={filters} />
        <MapContainer>
          <Map layers={layers}></Map>
        </MapContainer>
      </LayoutContainer>
      </FilterProvider>
    );
  };
  
export default MapLayout;