import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./Navbar.styles.css";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: var(--standardFontFamily);
  font-size: larger;
  color: #4b3e91;
  text-decoration: 0;
  width: 18%;
  max-width: 270px;
  text-align: center;
  cursor: pointer;
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const DropdownItem = styled(Link)`
  width: 100%;
  padding: 12px 0px;
  text-decoration: none;
  display: block;
  font-size: large;
  border-radius:2px;
  &:hover {
    background-color:${(props) => (props.activeLink ? "none" : "#f1f1f1")} ;
  }
`;

export function NavBarDropdown(props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
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
      onClick={handleToggle}
      onMouseEnter={() => setOpen(true)}
    >
      {props.dropdownName}
      <DropdownMenu onMouseLeave={handleToggle} open={open}>
        {props.dropdownItems.map((page) => (
          <DropdownItem
            key={page.pageName}
            className={
              props.activeLink === page.url ? "ActiveNavButton" : "NavButton"
            }
            to={page.url}
            onClick={handleClose}
            activeLink={props.activeLink===page.url}
          >
            {page.pageName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
