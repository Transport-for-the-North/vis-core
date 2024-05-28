import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { AppContext } from "contexts";

import { Button } from "./Button";
import { LateralNavbar } from "./LateralNavbar";
import { Logo } from "./Logo";
import "./Navbar.styles.css"

const StyledNavbar = styled.nav`
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0px;
  background-color: #f8f9fa; // Example background color, adjust as needed
`;

export function Navbar() {
  const location = useLocation()
  const [isClicked, setIsClicked] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [sideNavOpen, setSideNavOpen] = useState("sideNavbar-notShown");
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  const onClick = (url) => { 
    navigate(url);
  }

  const updateMenu = () => {
    if (!isClicked) {
      setSideNavOpen("sideNavbar-shown");
    } else {
      setSideNavOpen("sideNavbar-notShown");
    }
    setIsClicked(!isClicked);
  };

  const handleClick = () => {
    setSideNavOpen("sideNavbar-notShown");
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    setActiveLink(location.pathname)
    if (sideNavOpen === "sideNavbar-shown") updateMenu();
  }, [location]);

  return (
    <>
      <StyledNavbar className="navbar">
        <Logo className="logoNav" onClick={() => onClick("/")}/>
        <LateralNavbar className={sideNavOpen} handleClick={handleClick} />
        {appContext.appPages.map((page) => (
            <Link key={page.pageName} className={activeLink===page.url ? "ActiveNavButton" : "NavButton"} to={page.url} >
              {page.pageName}
            </Link>
        ))}
        
        <Button
          className="navbarMobile"
          src="/img/burgerIcon.png"
          alt="Burger Button Navbar"
          onClick={updateMenu}
        />
      </StyledNavbar>
      <div className="empty-blank-nav"></div>
    </>
  );
}
