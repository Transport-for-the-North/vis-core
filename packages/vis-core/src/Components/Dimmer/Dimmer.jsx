import { useEffect, useState } from "react";
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
  backdrop-filter: blur(2px);
`;

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const pulse = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`;

const LoaderPanel = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999999;
  width: min(420px, calc(100vw - 32px));
  background: rgba(20, 26, 42, 0.92);
  color: #f3f5fa;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 16px 44px rgba(0, 0, 0, 0.3);
  padding: 18px 18px 16px;
  box-sizing: border-box;
`;

const Heading = styled.p`
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const Subheading = styled.p`
  margin: 0 0 14px;
  font-size: 13px;
  color: rgba(243, 245, 250, 0.85);
`;

const Track = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 999px;
  width: ${props => props.percent}%;
  background: linear-gradient(90deg, #55c4ff 0%, #8fe07a 40%, #55c4ff 80%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.7s linear infinite;
  transition: width 0.25s ease;
`;

const ProgressText = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: rgba(243, 245, 250, 0.82);
`;

const ActivityText = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  color: rgba(243, 245, 250, 0.9);
  animation: ${pulse} 1.4s ease-in-out infinite;
`;

const DEFAULT_LOADING_MESSAGES = [
  "Applying your selected filters",
  "Loading the latest map data",
  "Refreshing map layers and boundaries",
  "Updating legends and visual details",
  "Almost there, final checks are running",
];

const MAX_VISIBLE_PROGRESS = 92;

const getNextProgress = (current) => {
  if (current >= MAX_VISIBLE_PROGRESS) return MAX_VISIBLE_PROGRESS;

  const remaining = MAX_VISIBLE_PROGRESS - current;
  const step = Math.max(1, Math.ceil(remaining / 9));
  return Math.min(MAX_VISIBLE_PROGRESS, current + step);
};

/**
 * Dimmer is a React component that renders a dimming overlay and an optional loader.
 * It is typically used to indicate loading or processing states in an application.
 *
 * @component
 * @property {boolean} dimmed - Flag indicating whether the dimming overlay should be displayed.
 * @property {boolean} showLoader - Flag indicating whether the loader should be displayed.
 * @returns {JSX.Element|null} The rendered Dimmer component or null if not dimmed.
 */
export const Dimmer = ({ dimmed, showLoader, statusMessages, statusHeading }) => {
  const messages = Array.isArray(statusMessages) && statusMessages.length > 0
    ? statusMessages
    : DEFAULT_LOADING_MESSAGES;
  const headingText = statusHeading || "Updating your map...";
  const [pseudoProgress, setPseudoProgress] = useState(12);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!dimmed || !showLoader) return undefined;

    setPseudoProgress(12);
    setMessageIndex(0);

    const progressInterval = setInterval(() => {
      setPseudoProgress((current) => getNextProgress(current));
    }, 230);

    const messageInterval = messages.length > 1 ? setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 1450) : null;

    return () => {
      clearInterval(progressInterval);
      if (messageInterval) clearInterval(messageInterval);
    };
  }, [dimmed, showLoader, messages]);

  if (!dimmed) {
    return null;
  }

  return (
    <>
      {showLoader ? (
        <LoaderPanel>
          <Heading>{headingText}</Heading>
          <Subheading>Please wait, this should only take a moment.</Subheading>
          <Track>
            <Fill
              percent={pseudoProgress}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pseudoProgress}
              aria-label="Map loading progress"
            />
          </Track>
          <ProgressText>{pseudoProgress}% complete</ProgressText>
          <ActivityText aria-live="polite">{messages[messageIndex]}</ActivityText>
        </LoaderPanel>
      ) : null}
      <Dimmed />
    </>
  );
};
