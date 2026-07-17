import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "contexts/AppContext";
import { useAuth } from "contexts/AuthProvider";
import { useWindowWidth } from "hooks/useWindowWidth";
import { buildNavbarLinks, validateAppConfigAgainstOpenApi } from "utils";
import { defaultBgColour } from "defaults";
import { Logo } from "./Logo";
import { LateralNavbar } from "./LateralNavbar";
import { ResponsiveNavbarLinks } from "./ResponsiveNavbarLinks";

const DEFAULT_TFN_WEBSITE_URL = "https://www.transportforthenorth.com/";

const StyledNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10005;
  width: 100%;
  background-color: ${({ theme }) => theme.navbarBg};
  font-family: ${({ theme }) => theme.navFontFamily || theme.standardFontFamily};
`;

const HeaderOuter = styled.div`
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.navBorder || "#e5e7eb"};
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 2rem 10vw;
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  column-gap: 32px;
`;

const HeaderNavSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }

  @media only screen and (max-width: 767px) {
    display: flex;
  }
`;

const LogoutSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

const StyledLogout = styled.img`
  cursor: pointer;
  width: 20px;
  height: auto;
`;

/**
 * The main top navigation bar.
 *
 * @component
 * @returns {JSX.Element|null} The rendered navbar, or null on routes like "/login".
 */
export function Navbar() {
  const location = useLocation();
  const [isSideNavOpen, setSideNavOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const appContext = useContext(AppContext);
  const { logOut } = useAuth();
  const didValidateOpenApiRef = useRef(false);
  const [logoImage, setLogoImage] = useState(appContext.logoImage);
  const [$bgColor, setBgColor] = useState(defaultBgColour);
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  // Build unified links array from shared function.
  const links = buildNavbarLinks(appContext);

  // Determine mobile view based on links length and window width.
  const MOBILE_BREAKPOINT = 768;
  const MIN_NAV_ITEM_WIDTH = 120;
  const isMobile =
    windowWidth < MOBILE_BREAKPOINT ||
    links.length * MIN_NAV_ITEM_WIDTH > windowWidth;

  // When a link is clicked, update the logo and active bg colour appropriately.
  const onClick = (url, newLogo, navLinkBgColour) => {
    setLogoImage(newLogo || appContext.logoImage);
    if (url) navigate(url);
    if (navLinkBgColour && navLinkBgColour !== $bgColor)
      setBgColor(navLinkBgColour);
  };

  const handleLogoClick = () => {
    const logoClickUrl = appContext.logoClickUrl || DEFAULT_TFN_WEBSITE_URL;
    window.open(logoClickUrl, "_blank", "noopener,noreferrer");
  }

  const updateSideNav = () => {
    setSideNavOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logOut();
  };

  useEffect(() => {
    setActiveLink(location.pathname);
    setSideNavOpen(false);
  }, [location]);

  // Validate config vs OpenAPI exactly once per app load.
  // This is always-on for this vis-core version, but only logs when issues exist.
  useEffect(() => {
    if (didValidateOpenApiRef.current) return;
    const apiSchema = appContext?.apiSchema;
    const appPages = appContext?.appPages;
    if (!apiSchema || !Array.isArray(appPages) || appPages.length === 0) return;

    const { errors, warnings } = validateAppConfigAgainstOpenApi(appContext, apiSchema);
    if (errors.length || warnings.length) {
      console.groupCollapsed(
        `[vis-core] OpenAPI validation: ${errors.length} error(s), ${warnings.length} warning(s)`
      );
      if (warnings.length) console.warn("[vis-core] OpenAPI validation warnings", warnings);
      if (errors.length) console.error("[vis-core] OpenAPI validation errors", errors);
      console.groupEnd();
    } else {
      console.info("[vis-core] OpenAPI validation complete (no issues)");
    }

    didValidateOpenApiRef.current = true;
  }, [appContext]);

  if (
    location.pathname === "/login" ||
    location.pathname === "/unauthorized"
  )
    return null;

  // Simplified logo logic: on mobile the logo is always left, on non-mobile
  // display the logo on the side indicated by appContext.logoPosition.
  const logoPosition = isMobile ? "left" : appContext.logoPosition || "left";

  return (
    <>
      <StyledNavbar>
        <HeaderOuter>
          <HeaderInner>
            <HeaderGrid>
              {(logoPosition === "left" || isMobile) && (
                <Logo
                  logoImage={logoImage}
                  onClick={handleLogoClick}
                  position="left"
                />
              )}

              <HeaderNavSearch>
                {!isMobile && (
                  <ResponsiveNavbarLinks
                    links={links}
                    activeLink={activeLink}
                    onClick={onClick}
                    $bgColor={$bgColor}
                  />
                )}
              </HeaderNavSearch>

              <LogoutSection>
                {!isMobile && logoPosition === "right" && (
                  <Logo
                    logoImage={logoImage}
                    onClick={handleLogoClick}
                    position="right"
                  />
                )}
                {isMobile && (
                  <MobileMenuButton
                    aria-label="Open main menu"
                    aria-expanded={isSideNavOpen}
                    onClick={updateSideNav}
                    data-testid="mobile-menu-toggle"
                  >
                    <span aria-hidden="true">☰</span>
                  </MobileMenuButton>
                )}
                {appContext.authenticationRequired && (
                  <StyledLogout src="/img/logout.png" onClick={handleLogout} />
                )}
              </LogoutSection>
            </HeaderGrid>
          </HeaderInner>
        </HeaderOuter>
      </StyledNavbar>
      {isMobile && (
        <LateralNavbar
          className={isSideNavOpen ? "sideNavbar-shown" : "sideNavbar-notShown"}
          onClick={onClick}
          $bgColor={$bgColor}
        />
      )}
      <div style={{ height: "114px" }}></div>
    </>
  );
}