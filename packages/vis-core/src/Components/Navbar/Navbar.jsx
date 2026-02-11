import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "contexts";
import { useAuth } from "contexts/AuthProvider";
import { useWindowWidth } from "hooks";
import { buildNavbarLinks, validateAppConfigAgainstOpenApi } from "utils";
import { Button } from "./Button";
import { Logo } from "./Logo";
import { LateralNavbar } from "./LateralNavbar";
import { ResponsiveNavbarLinks } from "./ResponsiveNavbarLinks";

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px;
  background-color: ${({ theme }) => theme.navbarBg};
  width: 100%;
  box-sizing: border-box;
  height: 75px;
  z-index: 10005;
  border-bottom: 1px solid #e0e0e0;
  position: fixed;
  top: 0;
  font-family: ${({ theme }) => theme.standardFontFamily};
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-grow: 1;
  justify-content: space-between;
`;

const NavbarMobileButton = styled(Button)`
  cursor: pointer;
  margin-left: 10px;
  margin-right: 10px;
  @media only screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

const LogoutSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
`;

const StyledLogout = styled.img`
  cursor: pointer;
  width: 50%;
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
  const [$bgColor, setBgColor] = useState("#7317de");
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
        <NavbarContent>
          {isMobile && <NavbarMobileButton
              src={appContext.logoutButtonImage}
              alt="Burger Button Navbar"
              onClick={updateSideNav}
          />}
          {(!isMobile && logoPosition === "left") && (
            <Logo
              logoImage={logoImage}
              onClick={() => onClick(null, logoImage)}
              position="left"
            />
          )}
          {!isMobile && (
            <ResponsiveNavbarLinks
              links={links}
              activeLink={activeLink}
              onClick={onClick}
              $bgColor={$bgColor}
            />
          )}
          {(!isMobile && logoPosition === "right") && (
            <Logo
              logoImage={logoImage}
              onClick={() => onClick(null, logoImage)}
              position="right"
            />
          )}
          {isMobile && (
            <Logo
              logoImage={logoImage}
              onClick={() => onClick(null, logoImage)}
              position="left"
            />
          )}
        </NavbarContent>
        {appContext.authenticationRequired && (
          <LogoutSection>
            <StyledLogout src="/img/logout.png" onClick={handleLogout} />
          </LogoutSection>
        )}
      </StyledNavbar>
      {isMobile && (
        <LateralNavbar
          className={isSideNavOpen ? "sideNavbar-shown" : "sideNavbar-notShown"}
          onClick={onClick}
          $bgColor={$bgColor}
        />
      )}
      <div style={{ height: "75px" }}></div>
    </>
  );
}