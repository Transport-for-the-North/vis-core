import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./Navbar.styles.css";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: var(--standardFontFamily);
  font-size: larger;
  text-decoration: none;
  width: 12%;
  max-width: 270px;
  text-align: center;
  cursor: pointer;
  padding: 0 5px 0 5px;
  height: 100%; /* Full height of navbar */
  display: flex;
  align-items: center; /* Vertically centre text */
  justify-content: center; /* Centre text horizontally */
  border-bottom-right-radius: 40px;

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
  &:hover {
    background-color: ${(props) => (props.$activeLink ? "none" : "#7317de")};
  }
`;

export function NavBarDropdown(props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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
    >
      {props.dropdownName} ▾
      <DropdownMenu onMouseLeave={handleToggle} open={open}>
        {props.dropdownItems.map((page) => (
          <DropdownItem
            key={page.pageName}
            className={
              props.activeLink === page.url ? "ActiveNavButton" : "NavButton"
            }
            to={page.url}
            onClick={handleClose}
            $activeLink={props.activeLink === page.url}
          >
            {page.pageName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
