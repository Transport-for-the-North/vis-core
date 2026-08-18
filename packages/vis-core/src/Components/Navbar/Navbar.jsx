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
  padding: 14px 20px;
`;

const HeaderGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 20px;
`;

const HeaderNavSearch = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  width: 100%;
`;

const MobileLogoSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const MobileMenuButton = styled.button`
  display: flex;
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

  span {
    font-size: 24px;
    line-height: 1;
    color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  }
`;

const MobileMenuIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;

const LogoutSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: auto;
  min-width: max-content;
  padding-right: 22px;
`;

const StyledLogoutButton = styled.button`
  border: 1px solid ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  background: transparent;
  color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.navFontFamily || "var(--font-sans)"};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background-color 220ms ease, color 220ms ease;

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
    color: #ffffff;
  }
`;

const LogoutIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const AuthActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  background: transparent;
  color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.navFontFamily || "var(--font-sans)"};
  cursor: pointer;
  transition: background-color 220ms ease, color 220ms ease;

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
    color: #ffffff;
  }
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
  const [navbarSpacerHeight, setNavbarSpacerHeight] = useState(0);
  const appContext = useContext(AppContext);
  const { logOut, token, user } = useAuth();
  const didValidateOpenApiRef = useRef(false);
  const navbarRef = useRef(null);
  const [logoImage, setLogoImage] = useState(appContext.logoImage);
  const [$bgColor, setBgColor] = useState(defaultBgColour);
  const [showMobileMenuIcon, setShowMobileMenuIcon] = useState(true);
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  // Build unified links array from shared function.
  const links = buildNavbarLinks(appContext);

  // Determine mobile view using one shared breakpoint for all apps.
  const MOBILE_BREAKPOINT = 1560;
  const isMobile = windowWidth < MOBILE_BREAKPOINT;

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

  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    setActiveLink(location.pathname);
    setSideNavOpen(false);
  }, [location]);

  useEffect(() => {
    const updateSpacerHeight = () => {
      const currentHeight = Math.ceil(navbarRef.current?.getBoundingClientRect()?.height || 0);
      setNavbarSpacerHeight(currentHeight);
    };

    updateSpacerHeight();

    let resizeObserver;
    if ("ResizeObserver" in window && navbarRef.current) {
      resizeObserver = new ResizeObserver(updateSpacerHeight);
      resizeObserver.observe(navbarRef.current);
    }

    window.addEventListener("resize", updateSpacerHeight);
    window.addEventListener("orientationchange", updateSpacerHeight);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateSpacerHeight);
      window.removeEventListener("orientationchange", updateSpacerHeight);
    };
  }, [isMobile]);

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
  const hasLogo = typeof logoImage === "string" ? Boolean(logoImage.trim()) : Boolean(logoImage);
  const isAuthenticated = Boolean(token || user);
  const logoutImage = appContext.logoutImage || "img/logout.png";
  const logoutImageSrc = `${import.meta.env.VITE_PUBLIC_URL || ""}${logoutImage}`;
  const mobileMenuIconPath = appContext.mobileMenuIcon || appContext.logoutButtonImage || "img/burgerIcon.png";
  const mobileMenuIconSrc = `${import.meta.env.VITE_PUBLIC_URL || ""}${mobileMenuIconPath}`;

  return (
    <>
      <StyledNavbar ref={navbarRef}>
        <HeaderOuter>
          <HeaderInner>
            <HeaderGrid>
              {isMobile ? (
                <MobileMenuButton
                  aria-label="Open main menu"
                  aria-expanded={isSideNavOpen}
                  onClick={updateSideNav}
                  data-testid="mobile-menu-toggle"
                >
                  {showMobileMenuIcon ? (
                    <MobileMenuIcon
                      src={mobileMenuIconSrc}
                      alt=""
                      aria-hidden="true"
                      onError={() => setShowMobileMenuIcon(false)}
                    />
                  ) : (
                    <span aria-hidden="true">☰</span>
                  )}
                </MobileMenuButton>
              ) : (
                logoPosition === "left" && (
                  <Logo
                    logoImage={logoImage}
                    onClick={handleLogoClick}
                    position="left"
                  />
                )
              )}

              <HeaderNavSearch>
                {isMobile ? (
                  <MobileLogoSlot>
                    <Logo
                      logoImage={logoImage}
                      onClick={() => onClick(null, logoImage)}
                      position="left"
                    />
                  </MobileLogoSlot>
                ) : (
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
                {appContext.authenticationRequired && (
                  isAuthenticated ? (
                    <StyledLogoutButton onClick={handleLogout} aria-label="Logout">
                      <span>Logout</span>
                      <LogoutIcon src={logoutImageSrc} alt="Logout" />
                    </StyledLogoutButton>
                  ) : (
                    <AuthActionButton onClick={handleLogin}>Login</AuthActionButton>
                  )
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
      <div style={{ height: `${navbarSpacerHeight}px` }}></div>
    </>
  );
}