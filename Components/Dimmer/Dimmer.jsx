import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const Dimmed = styled.div`
  top: 0;
  left: 0;
  z-index: 1000;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 50%;
  background-color: #000;
`;

export const Dimmer = ({ dimmed, showLoader }) => {
  if (!dimmed) {
    return null;
  }
  return (
    <>
      {showLoader ? (
        <Spinner
          style={{ zIndex: 1000 }}
          animation="grow"
          className="position-center"
        />
      ) : null}
      <Dimmed />
    </>
  );
};