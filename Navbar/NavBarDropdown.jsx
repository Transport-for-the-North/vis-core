import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "./Navbar.styles.css";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  font-family: var(--standardFontFamily);
  font-size: larger;
  text-decoration: 0;
  width: 12%;
  max-width: 270px;
  text-align: center;
  cursor: pointer;

  @media only screen and (max-width: 1165px) {
    font-size: large;
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
  background-color: #f9f9f9;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 2px;
`;

const DropdownItem = styled(Link)`
  width: 100%;
  padding: 12px 0px;
  text-decoration: none;
  display: block;
  font-size: large;
  border-radius: 2px;
  text-align: left;
  &:hover {
    background-color: ${(props) => (props.$activeLink ? "none" : "#f1f1f1")};
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
            $activeLink={props.activeLink === page.url}
          >
            {page.pageName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
