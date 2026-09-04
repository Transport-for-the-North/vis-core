import React from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { NavBarDropdown } from "./NavBarDropdown";
import { createNavItemClickHandler } from "utils/nav";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { defaultBgColour } from "defaults";

const NAV_ITEM_MAX_WIDTH = "250px";
const NAV_ITEM_MIN_WIDTH = "150px";

/**
 * Styled container for the responsive navigation links.
 */
const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  min-width: 0;
  height: 100%;

  > * {
    flex: 1 1 0;
    min-width: ${NAV_ITEM_MIN_WIDTH};
    max-width: ${NAV_ITEM_MAX_WIDTH};
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
  padding: 8px 12px;
  height: auto;
  background-color: ${({ $active, $bgColor, theme }) =>
    $active
      ? $bgColor || theme?.primary || defaultBgColour
      : "transparent"};
  color: ${({ $active, theme }) =>
    $active
      ? (theme?.activeNavText || "#ffffff")
      : (theme?.colors?.text || "var(--text-icon)")};
  border-radius: 10px;
  transition:
    color 260ms cubic-bezier(0.22, 1, 0.36, 1),
    background-color 260ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 260ms cubic-bezier(0.22, 1, 0.36, 1);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
  font-family: ${({ theme }) => theme.navFontFamily || "var(--font-sans)"};
  white-space: normal;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;

  .nav-label {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    width: 100%;
  }

  &:hover {
    color: ${({ theme }) => theme?.activeNavText || "#ffffff"};
    background-color: ${({ $bgColor, theme }) => $bgColor || theme?.primary || defaultBgColour};
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
  align-items: center;
  
  /* The span holding the external label takes full available width */
  span.external-label {
    flex: 1 1 auto;
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
  const [hoveredTopLevelKey, setHoveredTopLevelKey] = React.useState(null);
  const [pendingActiveLink, setPendingActiveLink] = React.useState(null);

  const effectiveActiveLink = pendingActiveLink || activeLink;

  React.useEffect(() => {
    if (pendingActiveLink && activeLink === pendingActiveLink) {
      setPendingActiveLink(null);
    }
  }, [activeLink, pendingActiveLink]);

  const handleTopLevelHoverChange = (itemKey, isHovered) => {
    setHoveredTopLevelKey((previousKey) => {
      if (isHovered) return itemKey;
      return previousKey === itemKey ? null : previousKey;
    });
  };

  const handleInternalNavigate = (url, customLogo, navBg) => {
    if (typeof url === "string" && url.startsWith("/")) {
      setPendingActiveLink(url);
    }
    onClick(url, customLogo, navBg);
  };

  return (
    <NavLinksContainer>
      {links.map((link, index) => {
        const itemKey = `${link.label}-${index}`;
        const suppressActive = Boolean(hoveredTopLevelKey && hoveredTopLevelKey !== itemKey);

        if (link.dropdownItems) {
          return (
            <NavBarDropdown
              key={`dropdown-${link.label}-${index}`}
              dropdownName={link.label}
              dropdownItems={link.dropdownItems}
              activeLink={effectiveActiveLink}
              onClick={handleInternalNavigate}
              $bgColor={link.navbarLinkBgColour || $bgColor}
              isActiveSuppressed={suppressActive}
              onTopLevelHoverChange={(isHovered) => handleTopLevelHoverChange(itemKey, isHovered)}
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
              onMouseEnter={() => handleTopLevelHoverChange(itemKey, true)}
              onMouseLeave={() => handleTopLevelHoverChange(itemKey, false)}
            >
              <span className="external-label nav-label">{link.label}</span>
              <ArrowTopRightOnSquareIcon style={{ width: "1rem", marginLeft: "4px" }} />
            </StyledExternalNavLink>
          );
        } else {
          return (
            <StyledNavLink
              key={`internal-${link.label}-${index}`}
              to={link.url}
              $bgColor={link.navbarLinkBgColour || $bgColor}
              $active={effectiveActiveLink === link.url && !suppressActive}
              onClick={createNavItemClickHandler(link, handleInternalNavigate, $bgColor)}
              onMouseEnter={() => handleTopLevelHoverChange(itemKey, true)}
              onMouseLeave={() => handleTopLevelHoverChange(itemKey, false)}
            >
              <span className="nav-label">{link.label}</span>
            </StyledNavLink>
          );
        }
      })}
    </NavLinksContainer>
  );
}