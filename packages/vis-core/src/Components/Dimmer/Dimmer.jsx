import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

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
  width: ${({ $progressWidth }) => $progressWidth};
  transition: width 700ms cubic-bezier(0.22, 1, 0.36, 1);
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
  dimmed = false,
  showLoader = false,
  completeOnExit = false,
  message,
  progress,
  statusHeading = "Loading map data",
  statusMessages = [
    "Preparing your map view...",
    "Almost there, thanks for waiting.",
    "Finalising layers and styles...",
  ],
}) => {
  const EXIT_COMPLETE_VISIBILITY_MS = 350;
  const PROGRESS_STEPS = [18, 30, 42, 54, 66, 76, 84, 90, 94, 97, 100];

  const safeMessages = useMemo(
    () =>
      Array.isArray(statusMessages) && statusMessages.length > 0
        ? statusMessages
        : ["Almost there, thanks for waiting."],
    [statusMessages]
  );
  const [messageIndex, setMessageIndex] = useState(0);
  const [progressStepIndex, setProgressStepIndex] = useState(0);
  const [shouldRender, setShouldRender] = useState(dimmed);
  const exitTimerRef = useRef(null);
  const prevDimmedRef = useRef(dimmed);
  const prevShowLoaderRef = useRef(showLoader);
  const prevCompleteOnExitRef = useRef(completeOnExit);

  const hasProgressOverride = Number.isFinite(progress);
  const hasMessageOverride = typeof message === "string" && message.trim().length > 0;

  const clearExitTimer = () => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
  };

  const clampProgress = (value) => {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
  };

  useEffect(() => {
    if (!dimmed || !showLoader || hasMessageOverride || safeMessages.length < 2) return undefined;

    const intervalId = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % safeMessages.length);
    }, 1800);

    return () => clearInterval(intervalId);
  }, [dimmed, showLoader, hasMessageOverride, safeMessages]);

  useEffect(() => {
    if (!dimmed) {
      setMessageIndex(0);
    }
  }, [dimmed]);

  useEffect(() => {
    if (!dimmed || !showLoader || hasProgressOverride) {
      setProgressStepIndex(0);
      return undefined;
    }

    const progressInterval = setInterval(() => {
      setProgressStepIndex((prev) =>
        Math.min(prev + 1, PROGRESS_STEPS.length - 1)
      );
    }, 900);

    return () => clearInterval(progressInterval);
  }, [dimmed, showLoader, hasProgressOverride]);

  useEffect(() => {
    const wasDimmed = prevDimmedRef.current;
    const hadLoader = prevShowLoaderRef.current;
    const hadCompleteOnExit = prevCompleteOnExitRef.current;

    if (dimmed) {
      clearExitTimer();
      setShouldRender(true);
    } else if (wasDimmed && (completeOnExit || hadCompleteOnExit) && hadLoader) {
      clearExitTimer();
      setShouldRender(true);
      setProgressStepIndex(PROGRESS_STEPS.length - 1);
      exitTimerRef.current = setTimeout(() => {
        setShouldRender(false);
        exitTimerRef.current = null;
      }, EXIT_COMPLETE_VISIBILITY_MS);
    } else {
      clearExitTimer();
      setShouldRender(false);
    }

    prevDimmedRef.current = dimmed;
    prevShowLoaderRef.current = showLoader;
    prevCompleteOnExitRef.current = completeOnExit;

    return clearExitTimer;
  }, [completeOnExit, dimmed, showLoader]);

  if (!shouldRender) {
    return null;
  }

  const currentMessage = hasMessageOverride
    ? message
    : safeMessages[Math.min(messageIndex, safeMessages.length - 1)];
  const progressPercent = hasProgressOverride
    ? clampProgress(progress)
    : PROGRESS_STEPS[Math.min(progressStepIndex, PROGRESS_STEPS.length - 1)];

  return (
    <>
      {showLoader ? (
        <CenteredLoader>
          <LoaderCard>
            <LoaderHeading>{statusHeading}</LoaderHeading>
            <LoaderMessage>{currentMessage}</LoaderMessage>
            <ProgressTrack>
              <ProgressFill
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-valuetext={currentMessage}
                $progressWidth={`${progressPercent}%`}
              />
            </ProgressTrack>
          </LoaderCard>
        </CenteredLoader>
      ) : null}
      <Dimmed />
    </>
  );
};
