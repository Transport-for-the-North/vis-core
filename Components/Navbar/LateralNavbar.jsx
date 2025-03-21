import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { buildDropdownTree, createNavItemClickHandler } from "utils/nav";
import { LateralRecursiveDropdown } from "./LateralRecursiveDropdown";
import { AppContext } from "contexts";
import { FixedExternalIcon } from "./FixedExternalIcon";

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
 * Common styles shared between internal and external side navigation links.
 */
const baseSideNavLinkStyles = css`
  padding: 12px 10px;
  text-decoration: none;
  background-color: ${({ $isActive, theme, $bgColor }) =>
    $isActive ? ($bgColor || theme.activeBg) : theme.navbarBg};
  color: ${({ $isActive, theme }) => ($isActive ? "#f9f9f9" : theme.navText)};
  transition: background-color 0.2s;
  white-space: normal;
  overflow-wrap: break-word;
  text-align: left;
  font-size: 16px;

  &:hover {
    background-color: ${({ $bgColor, theme }) =>
      $bgColor || theme.activeBg};
    color: #f9f9f9;
  }
`;

/**
 * Styled navigation link for internal side menu navigation.
 */
export const StyledSideNavLink = styled(Link)`
  ${baseSideNavLinkStyles}
  display: block;
`;

/**
 * Styled navigation link for external side menu navigation.
 */
export const StyledExternalSideNavLink = styled.a`
  ${baseSideNavLinkStyles}
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/**
 * The side navigation bar component (for mobile view).
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.className - Determines whether the side nav should be visible.
 * @param {Function} props.onClick - Callback function when a link is clicked.
 * @param {string} props.$bgColor - The default active background colour.
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
  noCategoryPages.push(...(appContext.externalLinks || []).filter((p) => !p.category));


  // Group pages by category.
  const pagesByCategory = {};
  appContext.appPages
    .filter((p) => p.category)
    .forEach((p) => {
      if (!pagesByCategory[p.category]) pagesByCategory[p.category] = [];
      pagesByCategory[p.category].push(p);
    });
  
  appContext.externalLinks && appContext.externalLinks
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
          $isActive={activeLink === "/"}
          $bgColor="#7317de"
          onClick={createNavItemClickHandler({ url: "/" }, props.onClick, props.$bgColor)}
        >
          Home
        </StyledSideNavLink>
      )}
      {props.className === "sideNavbar-shown" &&
        noCategoryPages.map((page) =>
          page.external ? (
            <StyledExternalSideNavLink
              key={page.pageName || page.label}
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              $isActive={activeLink === page.url}
              $bgColor={page.navbarLinkBgColour || props.$bgColor}
            >
              {page.pageName || page.label}
              <FixedExternalIcon />
            </StyledExternalSideNavLink>
          ) : (
            <StyledSideNavLink
              key={page.pageName}
              to={page.url}
              $isActive={activeLink === page.url}
              $bgColor={page.navbarLinkBgColour || props.$bgColor}
              onClick={createNavItemClickHandler(
                page,
                props.onClick,
                page.navbarLinkBgColour || props.$bgColor
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
              $bgColor={props.$bgColor}
            />
          );
        })}
    </LateralNavbarContainerStyled>
  );
}