import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { AppContext} from "contexts";
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
  const [ logoImage, setLogoImage ] = useState("img/tfn-logo-fullsize.png");
  const [ bgColor, setBgColor] = useState("#7317de")
  
  const navigate = useNavigate();

  const onClick = (url, newLogo, navColor) => {
    setLogoImage(newLogo);
    navigate(url);
    setBgColor(navColor);
  };

  const updateMenu = () => {
    if (!isClicked) {
      setSideNavOpen("sideNavbar-shown");
    } else {
      setSideNavOpen("sideNavbar-notShown");
    }
    setIsClicked(!isClicked);
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
        <Logo className="logoNav" logoImage={logoImage} onClick={() => onClick(null,logoImage)} />
        <Link
          key='Home'
          className={
            activeLink === "/" ? "ActiveNavButton" : "NavButton"
          }
          to="/"
          onClick={() => onClick("/","img/tfn-logo-fullsize.png")} 
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
                onClick={onClick}
                bgColor={bgColor}
              />
            );
          } else {
            return null;
          }
         })}

      </StyledNavbar>
      <div className="empty-blank-nav"></div>
    </>
  );
}
