import React, { useContext, useMemo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { useTheme, createGlobalStyle } from "styled-components";
import { AppContext } from "contexts";

const NAVBAR_HEIGHT = 75;

const ScrollLock = createGlobalStyle`
  html, body {
    overflow: hidden !important;
  }
`;

const Wrapper = styled.main`
  position: fixed;
  top: ${NAVBAR_HEIGHT}px;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;       /* center by default */
  padding: 1.5rem 1rem;
  overflow: hidden;

  /* On short viewports, align to top to avoid cramped feel */
  @media (max-height: 700px) {
    place-items: start center;
  }
`;

const Card = styled.section`
  text-align: center;
  max-width: 720px;
  width: 100%;
`;

const Logo = styled.img`
  height: 64px;
  margin-bottom: 1rem;
  user-select: none;
`;

const Title = styled.h1`
  margin: 0.25rem 0;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.textPrimary || "#111"};
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 1.75rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || "#666"};
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 0.75rem;
`;

const PrimaryLink = styled(Link)`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  background: ${({ theme }) => theme?.colors?.primary || "#7317de"};
  color: #fff;
  text-decoration: none;
  font-weight: 600;
`;

const SecondaryButton = styled.button`
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || "#ddd"};
  background: transparent;
  color: ${({ theme }) => theme?.colors?.textPrimary || "#111"};
  font-weight: 600;
  cursor: pointer;
`;

/**
 * Page Not Found component.
 * @function NotFound
 * @returns {JSX.Element} The rendered page not found component.
 */
export function NotFound() {
  const appConfig = useContext(AppContext);
  const theme = useTheme();
  const navigate = useNavigate();

  // Live countdown and "Redirecting..." state
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    let redirectTimeoutId;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setRedirecting(true);
          // Show "Redirecting..." for 1 second, then navigate
          redirectTimeoutId = setTimeout(
            () => navigate("/", { replace: true }),
            1000
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      if (redirectTimeoutId) clearTimeout(redirectTimeoutId);
    };
  }, [navigate]);

  const logoSrc = useMemo(() => {
    const candidates = [
      appConfig?.logo,
      appConfig?.branding?.logo,
      theme?.logo,
      theme?.branding?.logo,
      "/img/tfn-logo-fullsize.png",
    ].filter(Boolean);
    return candidates[0];
  }, [appConfig, theme]);

  return (
    <>
      <ScrollLock />
      <Wrapper>
        <Card>
          {logoSrc ? (
            <Logo
              src={logoSrc}
              alt="Logo"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : null}
          <Title>404 - Page Not Found</Title>
          <Subtitle role="status" aria-live="polite">
            {redirecting
              ? "Redirecting..."
              : `We could not find the page you're looking for. You will be redirected home in ${secondsLeft} ${
                  secondsLeft === 1 ? "second" : "seconds"
                }.`}
          </Subtitle>
          <Actions>
            <PrimaryLink to="/">Go to Home</PrimaryLink>
            <SecondaryButton onClick={() => window.history.back()}>
              Go Back
            </SecondaryButton>
          </Actions>
        </Card>
      </Wrapper>
    </>
  );
}