import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { AppContext} from "contexts";
import { useAuth } from "contexts/AuthProvider";
import { Button } from "./Button";
import { LateralNavbar } from "./LateralNavbar";
import { Logo } from "./Logo";
import { NavBarDropdown } from "./NavBarDropdown";
import "./Navbar.styles.css";

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0px;
  background-color: #f8f9fa; // Example background color, adjust as needed
`;

const StyledLogout = styled.img`
  cursor: pointer;

  @media only screen and (min-width: 766px) {
    position: absolute;
    right: 1%;
  }

  @media only screen and (max-width: 765px) {
    display: none;
  }
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
  
  const navigate = useNavigate();

  const onClick = (url) => {
    navigate(url);
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

  //Check if the current path is "/login"
  if (location.pathname === "/login" || location.pathname === "/unauthorized") {
    return null; // Do not render the navbar
  }

  return (
    <>
      <StyledNavbar className="navbar">
        <Logo className="logoNav" onClick={() => onClick("/")} 
              logoImage={appContext.logoImage} />
        <LateralNavbar className={sideNavOpen} onClick={() => handleLogout()} />
        <Link
          key='Home'
          className={
            activeLink === "/" ? "ActiveNavButton" : "NavButton"
          }
          to="/"
        >
          Home
        </Link>
        {appContext.appPages.map((page) => {
          if (page.category === null) {
            return (
              <Link
                key={page.pageName}
                className={
                  activeLink === page.url ? "ActiveNavButton" : "NavButton"
                }
                to={page.url}
              >
                {page.pageName}
              </Link>
            );
          }else if (!listCategories.includes(page.category)) {
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
              <StyledLogout src="/img/logout.png" onClick={ handleLogout} />
      </StyledNavbar>
      <div className="empty-blank-nav"></div>
    </>
  );
}
