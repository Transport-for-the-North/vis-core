import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { darken } from "polished";
import { createNavItemClickHandler } from "utils/nav";

/**
 * Styled icon for the lateral accordion. It rotates on open/close and its border colors update based on state.
 */
const SideAccordionIcon = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 4px;
  border-right: 2px solid
    ${({ theme, $active }) => ($active ? theme.activeNavText : theme.navText)};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.activeNavText : theme.navText)};
  transform: ${({ $isOpen }) =>
    $isOpen ? "rotate(45deg)" : "rotate(-45deg)"};
  transition: transform 0.3s ease, border-color 0.2s ease;
`;

/**
 * Header for the lateral dropdown that also controls the nested menu.
 */
const LateralDropdownHeader = styled.div`
  padding: 12px 10px;
  padding-left: ${({ depth }) => `calc(10px + ${depth * 10}px)`};
  background-color: ${({ active, theme, depth }) =>
    active ? theme.activeBg : darken(depth / 10, theme.navbarBg)};
  color: ${({ active, theme }) => (active ? theme.activeNavText : theme.navText)};
  font-weight: normal;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: normal;
  overflow-wrap: break-word;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.activeBg};
    color: #f9f9f9;
  }
  &:hover ${SideAccordionIcon} {
    border-right-color: ${({ theme }) => theme.activeNavText};
    border-bottom-color: ${({ theme }) => theme.activeNavText};
  }
`;

const TextContainer = styled.div`
  flex-grow: 1;
  text-align: left;
`;

/**
 * Animated container for nested lateral menu items.
 */
const LateralNestedMenu = styled.div`
  max-height: ${(props) => (props.open ? "100vh" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background-color: ${({ theme, depth }) =>
    darken(depth / 10, theme.navbarBg)};
`;

/**
 * Styled lateral menu link that accepts a depth prop for indentation.
 */
const LateralMenuItem = styled(Link)`
  padding: 0.5rem 1.5rem;
  padding-left: ${({ depth }) => `calc(1.5rem + ${depth * 10}px)`};
  text-decoration: none;
  display: block;
  background-color: ${({ active, theme, bgColor, depth }) =>
    active ? (bgColor || theme.activeNavColour) : darken(depth / 10, theme.navbarBg)};
  color: ${({ active, theme }) => (active ? "#f9f9f9" : theme.navText)};
  white-space: normal;
  overflow-wrap: break-word;
  text-align: left;
  transition: background-color 0.2s;
  font-size: smaller;
  &:hover {
    background-color: ${({ bgColor, theme }) =>
      bgColor || theme.activeNavColour};
    color: #f9f9f9;
  }
`;

/**
 * Recursively renders a lateral dropdown for side navigation menus.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.label - The header label of the dropdown.
 * @param {Array} props.items - An array of navigation items (each item may have nested children).
 * @param {string} props.activeLink - The URL of the currently active navigation item.
 * @param {number} [props.depth=0] - Current nesting depth for proper indentation.
 * @param {Function} props.onClick - Callback function when a navigation item is clicked.
 * @param {string} props.bgColor - Background colour to use for active states.
 * @returns {JSX.Element} The rendered lateral recursive dropdown.
 */
export function LateralRecursiveDropdown({
  label,
  items,
  activeLink,
  depth = 0,
  onClick,
  bgColor,
}) {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prev) => !prev);

  /**
   * Determines recursively if any item (or its children) is active.
   *
   * @param {Array} items - Array of navigation items.
   * @returns {boolean} Returns true if an active item is found.
   */
  const isActiveRecursive = (items) =>
    items.some(
      (item) =>
        item.url === activeLink ||
        (item.children && isActiveRecursive(item.children))
    );

  const active = isActiveRecursive(items);

  return (
    <div>
      <LateralDropdownHeader onClick={toggle} depth={depth} active={active}>
        <TextContainer>{label}</TextContainer>
        <SideAccordionIcon $isOpen={open} $active={active} />
      </LateralDropdownHeader>
      <LateralNestedMenu open={open} depth={depth + 1}>
        {items.map((item) =>
          item.children ? (
            <LateralRecursiveDropdown
              key={item.pageName}
              label={item.pageName}
              items={item.children}
              activeLink={activeLink}
              depth={depth + 1}
              onClick={onClick}
              bgColor={bgColor}
            />
          ) : (
            <LateralMenuItem
              key={item.pageName}
              to={item.url}
              active={activeLink === item.url}
              depth={depth + 1}
              bgColor={item.navbarLinkBgColour || bgColor}
              onClick={createNavItemClickHandler(
                item,
                onClick,
                item.navbarLinkBgColour || bgColor
              )}
            >
              {item.pageName}
            </LateralMenuItem>
          )
        )}
      </LateralNestedMenu>
    </div>
  );
}
