import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Cookies from 'js-cookie';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  z-index: 999999; /* Very high z-index */
  pointer-events: auto; /* Allow interaction */
`;

const StyledBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(900px, calc(100vw - 32px));
  max-height: calc(100vh - 32px);
  background-color: ${({ theme }) => theme?.colors?.surface || '#ffffff'};
  color: ${({ theme }) => theme?.colors?.text || 'rgb(13, 15, 61)'};
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000000; /* Very high z-index */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  pointer-events: auto; /* Ensure this component captures pointer events */

  .tou-header {
    font-size: 24px; /* Larger font size for the header */
    font-weight: bold;
    margin-bottom: 20px;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #ccc;
    margin: 20px 0;
  }

  .tou-content {
    width: 100%;
    text-align: left; /* Align text to the left */
    margin-bottom: 20px;
    max-height: calc(100vh - 220px);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .tou-content p,
  .tou-content li {
    font-family: var(--font-sans);
    font-size: 16px !important;
    line-height: 24px;
    margin: 0 0 12px;
    color: inherit;
  }

  .tou-content ol,
  .tou-content ul {
    margin: 0 0 12px;
    padding-left: 24px;
  }

  .tou-content table {
    display: block;
    width: max-content;
    max-width: 100%;
    overflow-x: auto;
    border-collapse: collapse;
  }

  .tou-content th,
  .tou-content td {
    white-space: nowrap;
  }

  .accept-button {
    background-color: ${({ theme }) => theme?.primary || '#0d0f3d'};
    border: none;
    color: white; /* Button text color */
    padding: 10px 20px; /* Button padding */
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px; /* Rounded corners */
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme?.activeBg || '#0d0f3d'};
    }
  }

  @media (max-width: 768px) {
    width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
    padding: 12px;

    .tou-header {
      margin-bottom: 12px;
      font-size: 20px;
    }

    .divider {
      margin: 12px 0;
    }

    .tou-content {
      max-height: calc(100vh - 180px);
      margin-bottom: 12px;
    }
  }
`;

// If the Clarity snippet loaded, this will either invoke immediately
// or queue the command (the snippet defines a queueing function).
function setClarityConsent(granted) {
  if (typeof window !== "undefined" && window.clarity) {
    window.clarity("consentv2", {
      ad_Storage: granted ? "granted" : "denied",
      analytics_Storage: granted ? "granted" : "denied",
    });
  }
}

export const TermsOfUse = ({ htmlText }) => {
  const [isVisible, setIsVisible] = useState(true);

  // On first render, read the cookie and set both the modal and Clarity’s consent state
  useEffect(() => {
    const consent = Cookies.get("toc") === "true";
    setIsVisible(!consent);
    setClarityConsent(consent);   // keep Clarity in sync on load
  }, []);

  useEffect(() => {
    if (!isVisible || typeof window === "undefined" || typeof document === "undefined") {
      return undefined;
    }

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // Lock background scroll while the modal is visible.
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isVisible]);

  const handleAccept = () => {
    Cookies.set('toc', true, { expires: 3, secure: true, sameSite: 'Lax', path: "/" }); // Set the cookie to true when accepted
    setClarityConsent(true);   // Tell Clarity immediately
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <>
          <Overlay />
          <StyledBox>
            <div className="tou-header">Terms of Use</div>
            <div className="divider"></div>
            <div className="tou-content" dangerouslySetInnerHTML={{ __html: htmlText }} />
            <button className="accept-button" onClick={handleAccept}>
              Accept
            </button>
          </StyledBox>
        </>
      )}
    </>
  );
}