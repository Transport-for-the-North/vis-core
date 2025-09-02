import styled from "styled-components";

const Dimmed = styled.div`
  top: 0;
  left: 0;
  z-index: 999998;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: fixed; /* Covers the entire viewport */
  opacity: 0.5; /* Translucent background */
  background-color: #000;
`;

const CenteredSpinner = styled.div`
  position: fixed; /* Fixed to ensure it stays centered */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  .spinner {
    border: 8px solid rgba(0, 0, 0, 0.1);
    border-top: 8px solid #fff;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
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
        <CenteredSpinner>
          <div className="spinner" role="progressbar"></div>
        </CenteredSpinner>
      ) : null}
      <Dimmed />
    </>
  );
};
