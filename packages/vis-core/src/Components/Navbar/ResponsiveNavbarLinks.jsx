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
  align-items: center;
  justify-content: flex-start;
  gap: 24px;
  width: auto;
`;

/**
 * Common styles shared between internal and external navigation links.
 */
const baseNavLinkStyles = css`
  text-decoration: none;
  display: inline-flex;
  max-width: 280px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  height: auto;
  background-color: transparent;
  color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
  border-radius: 8px;
  transition: color 0.2s ease, text-decoration-color 0.2s ease;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  font-family: "Korto", ${({ theme }) => theme.navFontFamily || theme.standardFontFamily};
  white-space: nowrap;
  text-decoration-line: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.16em;
  text-decoration-thickness: 0.08em;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
    text-decoration-color: ${({ theme }) => theme?.colors?.accent || "#00dec6"};
  }
`;

/**
 * Styled link for internal (top-level) navigation items.
 */
export const StyledNavLink = styled(Link)`
  ${baseNavLinkStyles}
`;

/**
 * StyledExternalNavLink mirrors the styling of internal links,
 * but adjusts text wrapping and adds an inner span for the external label.
 */
export const StyledExternalNavLink = styled.a`
  ${baseNavLinkStyles}
  gap: 6px;
  
  /* The span holding the external label takes full available width */
  span.external-label {
    white-space: nowrap;
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