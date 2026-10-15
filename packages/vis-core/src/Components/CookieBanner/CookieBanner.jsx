import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ANALYTICS_CONSENT_ACCEPTED,
  ANALYTICS_CONSENT_REJECTED,
  applyClarityConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "utils";

const COOKIE_POLICY_FALLBACK = "https://www.transportforthenorth.com/cookies-policy";

const BannerBackdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999998;
  background: rgba(10, 19, 35, 0.55);
  backdrop-filter: blur(1px);
`;

const BannerContainer = styled.section`
  width: 100%;
  background: var(--palette-navy);
  color: var(--palette-white);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.35);
  border-top: 1px solid var(--palette-teal);

  @media (max-width: 1024px) {
    width: 100%;
    border-radius: 0;
  }
`;

const BannerInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;

  p {
    margin: 0;
    color: var(--palette-white);
  }

  a {
    color: var(--palette-white);
    text-decoration-color: var(--palette-pale-teal);
  }

  a:hover,
  a:focus-visible {
    color: var(--palette-pale-teal);
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 14px 16px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  border-radius: var(--radius-pill-sm);
  border: 1px solid var(--palette-white);
  padding: 10px 18px;
  cursor: pointer;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1;

  &:focus-visible {
    outline: 2px solid var(--palette-pale-teal);
    outline-offset: 2px;
  }
`;

const RejectButton = styled(ActionButton)`
  background: transparent;
  color: var(--palette-white);
`;

const AcceptButton = styled(ActionButton)`
  background: var(--palette-teal);
  color: var(--palette-navy);
  border-color: var(--palette-teal);
`;

export const CookieBanner = () => {
  const [consent, setConsent] = useState(() => getAnalyticsConsent());
  const [isOpen, setIsOpen] = useState(() => getAnalyticsConsent() === null);

  useEffect(() => {
    const granted = consent === ANALYTICS_CONSENT_ACCEPTED;

    if (typeof window !== "undefined") {
      window.__VIS_ANALYTICS_CONSENT__ = consent;
      window.dispatchEvent(
        new CustomEvent("vis:analytics-consent-changed", {
          detail: { consent },
        })
      );
    }

    applyClarityConsent(granted);
  }, [consent]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleAccept = () => {
    setAnalyticsConsent(ANALYTICS_CONSENT_ACCEPTED);
    setConsent(ANALYTICS_CONSENT_ACCEPTED);
    setIsOpen(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(ANALYTICS_CONSENT_REJECTED);
    setConsent(ANALYTICS_CONSENT_REJECTED);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <BannerBackdrop>
          <BannerContainer
            role="dialog"
            aria-modal="true"
            aria-label="Cookie consent"
            aria-live="polite"
          >
            <BannerInner>
              <p>
                We use essential cookies to make this tool work. If you choose 'accept', we'll also use analytics cookies
                to understand how you use the tool and improve it. See our{" "}
                <a href={COOKIE_POLICY_FALLBACK} target="_blank" rel="noreferrer">
                  cookie policy
                </a>{" "}
                for more information.
              </p>
              <ButtonGroup>
                <RejectButton type="button" onClick={handleReject} aria-label="Reject analytics cookies">
                  Reject
                </RejectButton>
                <AcceptButton type="button" onClick={handleAccept} aria-label="Accept analytics cookies">
                  Accept
                </AcceptButton>
              </ButtonGroup>
            </BannerInner>
          </BannerContainer>
        </BannerBackdrop>
      )}
    </>
  );
};
