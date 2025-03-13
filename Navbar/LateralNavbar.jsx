import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import styled from "styled-components";

import { buildDropdownTree, createNavItemClickHandler } from "utils/nav";
import { LateralRecursiveDropdown } from "./LateralRecursiveDropdown";
import { AppContext } from "contexts";

/**
 * Container for the lateral (side) navigation bar.
 */
const LateralNavbarContainerStyled = styled.div`
  position: fixed;
  top: 75px;
  left: ${(props) =>
    props.className === "sideNavbar-shown" ? "0" : "-100%"};
  height: calc(100vh - 75px);
  width: 250px;
  background: ${({ theme }) => theme.navbarBg || "#f8f9fa"};
  border-right: 1px solid #e0e0e0;
  transition: left 0.3s ease;
  z-index: 1001;
  overflow-y: auto;
`;

/**
 * Styled navigation link for the side menu.
 */
const StyledSideNavLink = styled(Link)`
  display: block;
  padding: 12px 10px;
  text-decoration: none;
  background-color: ${({ active, theme, bgColor }) =>
    active ? bgColor || theme.activeBg : theme.navbarBg};
  color: ${({ active, theme }) => (active ? "#f9f9f9" : theme.navText)};
  transition: background-color 0.2s;
  white-space: normal;
  overflow-wrap: break-word;
  text-align: left;
  font-size: 16px;
  &:hover {
    background-color: ${({ bgColor, theme }) =>
      bgColor || theme.activeBg};
    color: #f9f9f9;
  }
`;

/**
 * The side navigation bar component (for mobile view).
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.className - Determines whether the side nav should be visible.
 * @param {Function} props.onClick - Callback function when a link is clicked.
 * @param {string} props.bgColor - The default active background colour.
 * @returns {JSX.Element} The rendered side navigation.
 */
export function LateralNavbar(props) {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const appContext = useContext(AppContext);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // Get pages that do not belong to a category.
  const noCategoryPages = appContext.appPages.filter((p) => !p.category);
  // Group pages by category.
  const pagesByCategory = {};
  appContext.appPages
    .filter((p) => p.category)
    .forEach((p) => {
      if (!pagesByCategory[p.category]) pagesByCategory[p.category] = [];
      pagesByCategory[p.category].push(p);
    });

  return (
    <LateralNavbarContainerStyled className={props.className}>
      {props.className === "sideNavbar-shown" && (
        <StyledSideNavLink
          to="/"
          active={activeLink === "/"}
          bgColor="#7317de"
          onClick={createNavItemClickHandler({ url: "/" }, props.onClick, props.bgColor)}
        >
          Home
        </StyledSideNavLink>
      )}
      {props.className === "sideNavbar-shown" &&
        noCategoryPages.map((page) => (
          <StyledSideNavLink
            key={page.pageName}
            to={page.url}
            active={activeLink === page.url}
            bgColor={page.navbarLinkBgColour || props.bgColor}
            onClick={createNavItemClickHandler(
              page,
              props.onClick,
              page.navbarLinkBgColour || props.bgColor
            )}
          >
            {page.pageName}
          </StyledSideNavLink>
        ))}
      {props.className === "sideNavbar-shown" &&
        Object.keys(pagesByCategory).map((category) => {
          const tree = buildDropdownTree(pagesByCategory[category]);
          return (
            <LateralRecursiveDropdown
              key={category}
              label={category}
              items={tree}
              activeLink={activeLink}
              onClick={props.onClick}
              bgColor={props.bgColor}
            />
          );
        })}
    </LateralNavbarContainerStyled>
  );
}
