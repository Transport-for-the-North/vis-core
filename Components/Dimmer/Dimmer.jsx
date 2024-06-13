import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const Dimmed = styled.div`
  top: 0;
  left: 0;
  z-index: 999998;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 50%;
  background-color: #000;
`;

/**
 * Dimmer is a React component that renders a dimming overlay and an optional loader spinner.
 * It is typically used to indicate loading or processing states in an application.
 * 
 * @component
 * @property {boolean} dimmed - Flag indicating whether the dimming overlay should be displayed.
 * @property {boolean} showLoader - Flag indicating whether the loader spinner should be displayed.
 * @returns {JSX.Element|null} The rendered Dimmer component or null if not dimmed.
 */
export const Dimmer = ({ dimmed, showLoader }) => {
  if (!dimmed) {
    return null;
  }
  return (
    <>
      {showLoader ? (
        <Spinner
          style={{ zIndex: 999999 }}
          animation="grow"
          className="position-center"
        />
      ) : null}
      <Dimmed />
    </>
  );
};