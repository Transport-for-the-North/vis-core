import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AppContext } from "contexts";
import "./Navbar.styles.css";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: var(--standardFontFamily);
  font-size: large;
  background-color: ${(props) => (props.$isActive ? props.$bgColor : "#f9f9f9")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? props.$bgColor : "#7317de")};
    cursor: default;
  }
  color: ${(props) => (props.$isActive ? "#f9f9f9" : "#4b3e91")};
  text-decoration: none;
  width: 15%;
  max-width: 300px;
  text-align: center;
  cursor: pointer;
  padding: 0 5px 0 5px;
  height: 100%; /* Full height of navbar */
  display: flex;
  align-items: center; /* Vertically centre text */
  justify-content: space-between; /* Space between title and icon */
  border-bottom-right-radius: 20px;
  transition: background-color 0.3s ease;

  @media only screen and (max-width: 1165px) {
    font-size: large;
    border-bottom-right-radius: 30px;
  }

  @media only screen and (max-width: 930px) {
    width: 10%;
  }

  @media only screen and (max-width: 765px) {
    display: none;
  }
`;


const DropdownMenu = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  left: 0; /* Align to the right of the dropdown item */
  top: 75px; /* Position dropdown at the bottom of the navbar */
  background-color: #f9f9f9;
  color: #ff0000;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  width: 100%;
  padding: 12px 10px 12px 10px; /* Adjusted padding */
  text-decoration: none;
  display: block;
  font-size: smaller;
  border-radius: 0px;
  text-align: left;
  box-sizing: border-box; /* Ensure padding is inside the container */
  background-color: ${(props) => (props.$activeLink ? props.$bgColor : "#f9f9f9")};
  color: ${(props) => (props.$activeLink ? "#f9f9f9" : "#4b3e91")};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.$activeLink ? props.$bgColor : "#7317de")};
    color: #f9f9f9;
  }
`;

const Title = styled.span`
  flex-grow: 1; /* Take up remaining space */
  text-align: center; /* Center the title */
`;

const Icon = styled.span`
  margin-left: 5px; /* Add some space between title and icon */
`;

export function NavBarDropdown(props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const appContext = useContext(AppContext);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    setOpen(false);
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (anchorRef.current && !anchorRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <DropdownContainer
      ref={anchorRef}
      className="NavButton"
      onMouseOver={() => setOpen(true)}
      onMouseLeave={handleClose}
      $bgColor={props.dropdownItems.find(item => item.url === props.activeLink)?.navbarLinkBgColour || "#7317de"}
      $isActive={props.dropdownItems.find(item => item.url === props.activeLink) ? true : false}
    >
      <Title>{props.dropdownName}</Title>
      <Icon>▾</Icon>
      <DropdownMenu onMouseLeave={handleToggle} open={open}>
        {props.dropdownItems.map((page) => (
          <DropdownItem
            key={page.pageName}
            className={
              props.activeLink === page.url ? "ActiveNavButton" : "NavButton"
            }
            to={page.url}
            onClick={(e) => {
              props.onClick(
                page.url, 
                page.customLogoPath || appContext.logoImage, 
                page.navbarLinkBgColour || "#7317de"
              );
              handleClose(e);
            }}
            $activeLink={props.activeLink === page.url}
            $bgColor={props.bgColor}
          >
            {page.pageName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
