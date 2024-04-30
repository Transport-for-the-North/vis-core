import Map from "./Map";
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { Dimmer } from "Components/Dimmer";
import { useMapContext } from "hooks";

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 75px);
`;

const MapContainer = styled.div`
  flex: 1;
  position: relative;
`;

export const MapLayout = () => {
  return (
    <LayoutContainer>
      <Sidebar />
      <MapContainer>
        <Map />
      </MapContainer>
      {/* <Dimmer dimmed={state.isloading} showLoader={true}/> */}
    </LayoutContainer>
  );
};
  