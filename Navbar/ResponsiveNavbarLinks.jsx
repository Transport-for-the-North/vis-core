import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { NavBarDropdown } from "./NavBarDropdown";
import { createNavItemClickHandler } from "utils/nav";

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
 * Styled link for top-level navigation items.
 */
const StyledNavLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  height: 100%;
  background-color: ${({ active, bgColor, theme }) =>
    active ? (bgColor || theme.activeNavColour) : "transparent"};
  color: ${({ active, theme }) => (active ? "#f9f9f9" : theme.navText)};
  border-bottom-right-radius: 20px;
  transition: background-color 0.2s;
  white-space: nowrap;
  overflow-wrap: break-word;
  font-size: clamp(12px, 1.2vw, 18px);
  &:hover {
    background-color: ${({ bgColor, theme }) =>
      bgColor || theme.activeNavColour};
    color: #f9f9f9;
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
 * @param {string} props.bgColor - Default background colour for active items.
 * @returns {JSX.Element} The rendered responsive navigation links.
 */
export function ResponsiveNavbarLinks({ links, activeLink, onClick, bgColor }) {
  return (
    <NavLinksContainer>
      {links.map((link) => {
        if (link.dropdownItems) {
          return (
            <NavBarDropdown
              key={link.label}
              dropdownName={link.label}
              dropdownItems={link.dropdownItems}
              activeLink={activeLink}
              onClick={onClick}
              bgColor={link.navbarLinkBgColour || bgColor}
            />
          );
        } else {
          return (
            <StyledNavLink
              key={link.label}
              to={link.url}
              bgColor={link.navbarLinkBgColour || bgColor}
              active={activeLink === link.url}
              onClick={createNavItemClickHandler(link, onClick, bgColor)}
            >
              {link.label}
            </StyledNavLink>
          );
        }
      })}
    </NavLinksContainer>
  );
}
