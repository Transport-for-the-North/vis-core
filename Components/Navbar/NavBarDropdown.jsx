import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { createNavItemClickHandler } from "utils/nav";

/**
 * Container for the top navbar dropdown.
 */
const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: ${({ theme }) => theme.standardFontFamily};
  font-size: clamp(12px, 1.2vw, 18px);
  background-color: ${({ $isActive, $bgColor }) =>
    $isActive ? $bgColor : "#f9f9f9"};
  color: ${({ $isActive }) => ($isActive ? "#f9f9f9" : "#4b3e91")};
  padding: 0 5px;
  height: 100%;
  cursor: default;
  justify-content: space-between;
  text-decoration: none;
  border-bottom-right-radius: 20px;
  transition: background-color 0.2s;
  white-space: normal;
  overflow-wrap: break-word;
  z-index: 1000;
  &:hover {
    background-color: ${({ $bgColor }) => $bgColor};
    color: #ffffff;
  }
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;

/**
 * Title for the dropdown.
 */
const DropdownTitle = styled.span`
  flex-grow: 1;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Indicator (arrow) for the dropdown.
 */
const DropdownIndicator = styled.span`
  margin-left: 5px;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Container for the dropdown menu. It appears as an absolute element below the top bar.
 * This container is scrollable when the items height overflows.
 */
const DropdownMenu = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  left: 0;
  top: 75px;
  background-color: #f9f9f9;
  min-width: 160px;
  width: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-bottom-right-radius: 20px;
  transition: background-color 0.2s;
  z-index: 1001;
  border-radius: 0 0 5px 5px;
  overflow: visible;
  max-height: calc(100vh - 80px); /* Set a maximum height for the dropdown */

  /* Custom Scrollbar Styles for non-Firefox browsers */
  /* Webkit-based browsers (Chrome, Safari, Edge) */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 10px;
    background-clip: padding-box;
    transition: background-color 0.3s ease-in-out;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: darkgrey; /* Color when hovered */
  }
`;

/**
 * Styled container for nested dropdown menus.
 *
 * The nested menu will slide out to the side of its parent.
 */
const NestedDropdownMenu = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 160px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Wrapper for each dropdown item.
 */
const DropdownItemWrapper = styled.div`
  position: relative;
`;

/**
 * Styled link for a dropdown item.
 */
const DropdownItemLink = styled(Link)`
  display: block;
  padding: 12px 10px;
  text-decoration: none;
  font-size: smaller;
  text-align: left;
  box-sizing: border-box;
  background-color: ${({ $active, $bgColor }) =>
    $active ? $bgColor : "#f9f9f9"};
  color: ${({ $active }) => ($active ? "#f9f9f9" : "#4b3e91")};
  transition: background-color 0.3s ease, color 0.3s ease;
  white-space: normal;
  &:hover {
    background-color: ${({ $bgColor }) => $bgColor};
    color: #ffffff;
  }
`;

/**
 * Sub-indicator for dropdown items with nested children.
 */
const SubIndicator = styled.span`
  margin-left: auto;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Recursively renders a dropdown item that may contain nested children.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.item - A navigation item (may include a 'children' array).
 * @param {string} props.activeLink - The currently active navigation URL.
 * @param {Function} props.onClick - Callback function when an item is clicked.
 * @param {string} props.bgColor - Background colour for active items.
 * @returns {JSX.Element} The rendered recursive dropdown item.
 */
export function RecursiveDropdownItem({ item, activeLink, onClick, bgColor }) {
  const [subOpen, setSubOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  /**
   * Handle mouse entering this dropdown item.
   */
  const handleMouseEnter = () => {
    if (hasChildren) setSubOpen(true);
  };

  /**
   * Handle mouse leaving this dropdown item.
   */
  const handleMouseLeave = () => {
    if (hasChildren) setSubOpen(false);
  };

  return (
    <DropdownItemWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownItemLink
        to={item.url}
        onClick={createNavItemClickHandler(item, onClick, bgColor)}
        $active={activeLink === item.url}
        $bgColor={bgColor}
      >
        {item.pageName}
        {hasChildren && <SubIndicator>▸</SubIndicator>}
      </DropdownItemLink>
      {hasChildren && (
        <NestedDropdownMenu
          open={subOpen}
          onMouseEnter={() => setSubOpen(true)}
          onMouseLeave={() => setSubOpen(false)}
        >
          {item.children.map((child) => (
            <RecursiveDropdownItem
              key={child.pageName}
              item={child}
              activeLink={activeLink}
              onClick={onClick}
              bgColor={bgColor}
            />
          ))}
        </NestedDropdownMenu>
      )}
    </DropdownItemWrapper>
  );
}

/**
 * Renders a top–navbar dropdown menu.
 *
 * The dropdown opens on mouse enter and closes on mouse leave.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.dropdownName - The label of the dropdown.
 * @param {Array} props.dropdownItems - Array of navigation items (some may contain children).
 * @param {string} props.activeLink - The active URL.
 * @param {Function} props.onClick - Callback when a dropdown item is clicked.
 * @param {string} props.bgColor - Active background colour.
 * @returns {JSX.Element} The rendered dropdown.
 */
export function NavBarDropdown(props) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const isActive = props.dropdownItems.some(
    (item) =>
      item.url === props.activeLink ||
      (item.children &&
        item.children.some((child) => child.url === props.activeLink))
  );

  return (
    <DropdownContainer
      ref={anchorRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      $bgColor={props.bgColor}
      $isActive={isActive}
    >
      <DropdownTitle>{props.dropdownName}</DropdownTitle>
      <DropdownIndicator>▾</DropdownIndicator>
      <DropdownMenu
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {props.dropdownItems.map((item) => (
          <RecursiveDropdownItem
            key={item.pageName}
            item={item}
            activeLink={props.activeLink}
            onClick={(url, customLogo, navBg) => {
              props.onClick(url, customLogo, navBg);
              setOpen(false);
            }}
            bgColor={props.bgColor}
          />
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
}
