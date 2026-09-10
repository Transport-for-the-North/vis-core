import { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";

const Dimmed = styled.div.attrs({ 'data-testid': 'dimmed-overlay' })`
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

const pulseProgress = keyframes`
  0% {
    width: 20%;
  }
  50% {
    width: 82%;
  }
  100% {
    width: 55%;
  }
`;

const CenteredLoader = styled.div`
  position: fixed; /* Fixed to ensure it stays centered */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  width: min(440px, calc(100vw - 32px));
`;

const LoaderCard = styled.div`
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  padding: 16px;
`;

const LoaderHeading = styled.h3`
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0d0f3d;
`;

const LoaderMessage = styled.p`
  margin: 0 0 10px;
  font-size: 0.94rem;
  color: #364153;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #efeff7;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #00dec6 0%, #0d0f3d 100%);
  animation: ${pulseProgress} 2s ease-in-out infinite;
`;

/**
 * Dimmer is a React component that renders a dimming overlay and an optional loader card.
 * It is typically used to indicate loading or processing states in an application.
 * 
 * @component
 * @property {boolean} dimmed - Flag indicating whether the dimming overlay should be displayed.
 * @property {boolean} showLoader - Flag indicating whether the loader spinner should be displayed.
 * @property {string} [statusHeading] - Optional heading above the progress bar.
 * @property {string[]} [statusMessages] - Optional rotating status messages.
 * @returns {JSX.Element|null} The rendered Dimmer component or null if not dimmed.
 */
export const Dimmer = ({
  dimmed,
  showLoader,
  statusHeading = "Loading map data",
  statusMessages = [
    "Preparing your map view...",
    "Almost there, thanks for waiting.",
    "Finalising layers and styles...",
  ],
}) => {
  const safeMessages = useMemo(
    () => (Array.isArray(statusMessages) && statusMessages.length > 0
      ? statusMessages
      : ["Almost there, thanks for waiting."]),
    [statusMessages]
  );
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!dimmed || !showLoader || safeMessages.length < 2) return undefined;

    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % safeMessages.length);
    }, 1800);

    return () => clearInterval(intervalId);
  }, [dimmed, showLoader, safeMessages]);

  useEffect(() => {
    if (!dimmed) {
      setMessageIndex(0);
    }
  }, [dimmed]);

  if (!dimmed) {
    return null;
  }

  const currentMessage = safeMessages[Math.min(messageIndex, safeMessages.length - 1)];

  return (
    <>
      {showLoader ? (
        <CenteredLoader>
          <LoaderCard>
            <LoaderHeading>{statusHeading}</LoaderHeading>
            <LoaderMessage>{currentMessage}</LoaderMessage>
            <ProgressTrack>
              <ProgressFill role="progressbar" aria-valuetext={currentMessage} />
            </ProgressTrack>
          </LoaderCard>
        </CenteredLoader>
      ) : null}
      <Dimmed />
    </>
  );
};
