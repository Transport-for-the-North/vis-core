import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { NavBarDropdown } from "./NavBarDropdown";
import { createNavItemClickHandler } from "utils/nav";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

const NAV_ITEM_WIDTH = "250px";

/**
 * Styled container for the responsive navigation links.
 */
const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;

  > * {
    flex: 0 0 ${NAV_ITEM_WIDTH};
    width: ${NAV_ITEM_WIDTH};
    max-width: ${NAV_ITEM_WIDTH};
    min-width: 0;
  }
`;

/**
 * Common styles shared between internal and external navigation links.
 */
const baseNavLinkStyles = css`
  text-decoration: none;
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  height: auto;
  background-color: ${({ $active, theme }) =>
    $active ? (theme?.colors?.text || "#0d0f3d") : "transparent"};
  color: ${({ $active, theme }) => ($active ? "#ffffff" : (theme?.colors?.text || "#0d0f3d"))};
  border-radius: 10px;
  transition:
    color 260ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1);
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  font-family: "Korto", ${({ theme }) => theme.navFontFamily || theme.standardFontFamily};
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    color: #ffffff;
    background-color: ${({ theme }) => theme?.colors?.text || "#0d0f3d"};
    box-shadow: 0 8px 20px rgba(13, 15, 61, 0.24);
    transform: translateY(-1px);
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