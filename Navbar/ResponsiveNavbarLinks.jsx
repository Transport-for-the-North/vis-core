import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { NavBarDropdown } from "./NavBarDropdown";
import { createNavItemClickHandler } from "utils/nav";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

/**
 * Styled container for the responsive navigation links.
 */
const NavLinksContainer = styled.div`
  display: flex;
  align-items: stretch;
  flex-grow: 1;
  height: 100%;
  /* Each direct child takes equal space */
  & > * {
    flex: 1 1 auto;
    text-align: center;
  }
`;

/**
 * Common styles shared between internal and external navigation links.
 */
const baseNavLinkStyles = css`
  text-decoration: none;
  display: flex;
  max-width: 200px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 100%;
  background-color: ${({ $active, $bgColor, theme }) =>
    $active ? ($bgColor || theme.activeNavColour) : "transparent"};
  color: ${({ $active, theme }) => ($active ? "#f9f9f9" : theme.navText)};
  border-bottom-right-radius: 20px;
  transition: background-color 0.2s;
  font-size: clamp(12px, 1.2vw, 18px);

  &:hover {
    background-color: ${({ $bgColor, theme }) =>
      $bgColor || theme.activeNavColour};
    color: #f9f9f9;
  }
`;

/**
 * Styled link for internal (top-level) navigation items.
 */
export const StyledNavLink = styled(Link)`
  ${baseNavLinkStyles}
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * StyledExternalNavLink mirrors the styling of internal links,
 * but adjusts text wrapping and adds an inner span for the external label.
 */
export const StyledExternalNavLink = styled.a`
  ${baseNavLinkStyles}
  white-space: normal;
  overflow-wrap: break-word;
  
  /* The span holding the external label takes full available width */
  span.external-label {
    flex: 1;
    white-space: inherit;
  }
`;

/**
 * Renders the responsive horizontal navigation links.
 *
 * It shows either plain links or dropdowns depending on the data provided.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.links - Array of navigation link objects.
 * @param {string} props.activeLink - The currently active URL.
 * @param {Function} props.onClick - Callback when a link is clicked.
 * @param {string} props.$bgColor - Default background colour for active items.
 * @returns {JSX.Element} The rendered responsive navigation links.
 */
export function ResponsiveNavbarLinks({ links, activeLink, onClick, $bgColor }) {
  // console.log('Links', links);
  return (
    <NavLinksContainer>
      {links.map((link, index) => {
        if (link.dropdownItems) {
          return (
            <NavBarDropdown
              key={`dropdown-${link.label}-${index}`}
              dropdownName={link.label}
              dropdownItems={link.dropdownItems}
              activeLink={activeLink}
              onClick={onClick}
              $bgColor={link.navbarLinkBgColour || $bgColor}
            />
          );
        } else if (link.external) {
          return (
            <StyledExternalNavLink
              key={`external-${link.label}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              $bgColor={link.navbarLinkBgColour || $bgColor}
              $active={false}
            >
              <span className="external-label">{link.label}</span>
              <ArrowTopRightOnSquareIcon style={{ width: "1rem", marginLeft: "4px" }} />
            </StyledExternalNavLink>
          );
        } else {
          return (
            <StyledNavLink
              key={`internal-${link.label}-${index}`}
              to={link.url}
              $bgColor={link.navbarLinkBgColour || $bgColor}
              $active={activeLink === link.url}
              onClick={createNavItemClickHandler(link, onClick, $bgColor)}
            >
              {link.label}
            </StyledNavLink>
          );
        }
      })}
    </NavLinksContainer>
  );
}