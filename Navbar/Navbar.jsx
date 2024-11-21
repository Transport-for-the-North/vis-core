import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { AppContext } from "contexts";
import { useAuth } from "contexts/AuthProvider";
import { Button } from "./Button";
import { LateralNavbar } from "./LateralNavbar";
import { Logo } from "./Logo";
import { NavBarDropdown } from "./NavBarDropdown";
import "./Navbar.styles.css";

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space between logo, navbar content, and logout section */
  padding: 0px;
  background-color: #f8f9fa;
  width: 100%;
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-grow: 1; /* Allow the navbar content to grow within its limited space */
  justify-content: flex-start; /* Align the items to the left */
`;

const LogoutSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Fixed width for the logout section */
`;

const StyledLogout = styled.img`
  cursor: pointer;
  width: 75%; /* Make sure the logout image fills the container */
  height: auto;
`;

/**
 * Navbar component represents the navigation bar of the application.
 * It includes the logo, navigation links, and a button for opening/closing the side navigation menu.
 * @function Navbar
 * @returns {JSX.Element} The rendered Navbar component.
 */
export function Navbar() {
  const location = useLocation();
  const [isClicked, setIsClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [sideNavOpen, setSideNavOpen] = useState("sideNavbar-notShown");
  const listCategories = [];
  const appContext = useContext(AppContext);
  const { logOut } = useAuth();
  const [logoImage, setLogoImage] = useState(appContext.logoImage);
  const [bgColor, setBgColor] = useState("#7317de");

  const navigate = useNavigate();

  const onClick = (url, newLogo, navColor) => {
    setLogoImage(newLogo || appContext.logoImage); // Default to appContext.logoImage if newLogo is not provided
    navigate(url);
    if (navColor !== bgColor) {
      setBgColor(navColor);
    }
  };

  const updateMenu = () => {
    if (!isClicked) {
      setSideNavOpen("sideNavbar-shown");
    } else {
      setSideNavOpen("sideNavbar-notShown");
    }
    setIsClicked(!isClicked);
  };

  const handleLogout = () => {
    logOut(); // Call logout function from AuthContext
  };

  useEffect(() => {
    setActiveLink(location.pathname);
    if (sideNavOpen === "sideNavbar-shown") updateMenu();
  }, [location]);

  // Check if the current path is "/login"
  if (location.pathname === "/login" || location.pathname === "/unauthorized") {
    return null; // Do not render the navbar
  }

  const isLogoLeft = appContext.logoPosition !== "right"; // Default to left if not provided

  return (
    <>
      <StyledNavbar className="navbar">
        {isLogoLeft && (
          <Logo className="logoNav" logoImage={logoImage} onClick={() => onClick(null, logoImage)} />
        )}
        <NavbarContent>
          <LateralNavbar className={sideNavOpen} onClick={() => handleLogout()} />
          <Link
            key="Home"
            className={activeLink === "/" ? "ActiveNavButton" : "NavButton"}
            to="/"
            onClick={() => onClick("/", appContext.logoImage)}
          >
            Home
          </Link>
          {appContext.appPages.map((page) => {
            if (page.category === null) {
              return (
                <Link
                  key={page.pageName}
                  className={activeLink === page.url ? "ActiveNavButton" : "NavButton"}
                  to={page.url}
                  onClick={() => onClick(page.url, page.logoImage)}
                >
                  {page.pageName}
                </Link>
              );
            } else if (!listCategories.includes(page.category)) {
              listCategories.push(page.category);
              const dropdownItems = appContext.appPages.filter(
                (pageToTest) => pageToTest.category === page.category
              );
              return (
                <NavBarDropdown
                  key={page.category}
                  dropdownItems={dropdownItems}
                  activeLink={activeLink}
                  dropdownName={page.category}
                  onClick={onClick}
                  bgColor={bgColor}
                />
              );
            } else {
              return null;
            }
          })}
          <Button
            className="navbarMobile"
            src={appContext.logoutButtonImage}
            alt="Burger Button Navbar"
            onClick={updateMenu}
          />
        </NavbarContent>
        {!isLogoLeft && (
          <Logo className="logoNav" logoImage={logoImage} onClick={() => onClick(null, logoImage)} />
        )}
        {appContext.authenticationRequired && (
          <LogoutSection>
            <StyledLogout src="/img/logout.png" onClick={handleLogout} />
          </LogoutSection>
        )}
      </StyledNavbar>
      <div className="empty-blank-nav"></div>
    </>
  );
}
