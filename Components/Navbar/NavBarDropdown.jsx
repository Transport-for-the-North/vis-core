import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { createNavItemClickHandler } from "utils/nav";
import { FixedExternalIcon } from "./FixedExternalIcon";

/* ----------------------------------
   Styled Components Definitions
-------------------------------------*/

/**
 * Outer wrapper for a dropdown menu.
 */
const DropdownMenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 74px; // Accounting for nav border to prevent inactivation
  z-index: 1001;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: visible;
`;

/**
 * Scrollable area inside the main dropdown.
 * Displays the list of items and applies a custom scrollbar for webkit.
 */
const DropdownMenuScroll = styled.div`
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  position: relative;

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
    transition: background-color 0.05s ease-in-out;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: darkgrey;
  }
`;

/**
 * Container for the top–navbar dropdown.
 * Highlights when either it or any nested submenu items are hovered.
 */
const DropdownContainer = styled.div`
  position: relative;
  display: inline-flex;
  max-width: 200px;
  align-items: center;
  font-family: ${({ theme }) => theme.standardFontFamily};
  font-size: clamp(12px, 1.2vw, 18px);
  background-color: ${({ $isActive, $hovered, $bgColor }) =>
    $isActive || $hovered ? $bgColor : "#f9f9f9"};
  color: ${({ $isActive, $hovered }) =>
    $isActive || $hovered ? "#ffffff" : "#4b3e91"};
  padding: 0 10px;
  height: 100%;
  cursor: default;
  justify-content: space-between;
  text-decoration: none;
  border-bottom-right-radius: 20px;
  transition: background-color 0.05s;
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
 * Title inside the dropdown header.
 */
const DropdownTitle = styled.span`
  flex-grow: 1;
  text-align: center;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Indicator (arrow) rendered in the dropdown header.
 */
const DropdownIndicator = styled.span`
  margin-left: 5px;
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
 * Common styles for dropdown items.
 *
 * This css helper includes the shared styles for both internal (Link)
 * and external (a) dropdown items, such as layout, typography, colors, and
 * hover effects. It leverages props ($active, $hovered, $bgColor) to decide 
 * the background and text colours.
 */
const dropdownItemStyles = css`
  display: flex;
  align-items: center; /* Ensure vertical centering */
  justify-content: space-between;
  padding: 12px 10px;
  text-decoration: none;
  font-size: smaller;
  text-align: left;
  box-sizing: border-box;
  background-color: ${({ $active, $hovered, $bgColor }) =>
    $active || $hovered ? $bgColor : "#f9f9f9"};
  color: ${({ $active, $hovered }) =>
    $active || $hovered ? "#f9f9f9" : "#4b3e91"};
  transition: background-color 0.05s ease, color 0.05s ease;
  white-space: normal;
  &:hover {
    background-color: ${({ $bgColor }) => $bgColor};
    color: #ffffff;
  }
`;

/**
 * Styled link used for dropdown items.
 * Accepts custom props to determine the active and hover styles.
 */
const DropdownItemLink = styled(Link)`
  ${dropdownItemStyles}
`;

/**
 * Styled anchor for dropdown items that are external.
 */
const DropdownItemAnchor = styled.a`
  ${dropdownItemStyles}
`;

/**
 * Indicator for dropdown items that have nested submenus.
 */
const SubIndicator = styled.span`
  margin-left: auto;
  white-space: normal;
  overflow-wrap: break-word;
`;

/**
 * Container for nested dropdown menus rendered as portals.
 * Renders at specific coordinates and ensures proper border rounding.
 */
const NestedDropdownMenu = styled.div`
  position: absolute;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  min-width: 160px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  overflow: hidden;
  z-index: 1000;
  white-space: normal;
  overflow-wrap: break-word;
  font-size: clamp(12px, 1.2vw, 18px);
`;

/* ----------------------------------
   Component Definitions
-------------------------------------*/

/**
 * NestedDropdownPortal renders a nested submenu via a portal so that
 * it can “escape” the clipping of the main dropdown scroll area.
 *
 * @param {Object} props
 * @param {boolean} props.open - Whether the nested submenu should be visible.
 * @param {DOMRect} props.parentRect - Bounding rectangle of the parent item.
 * @param {Function} props.onPortalMouseEnter - Function called when mouse enters the nested submenu.
 * @param {Function} props.onPortalMouseLeave - Function called when mouse leaves the nested submenu.
 * @param {React.ReactNode} props.children - Nested submenu items.
 * @returns {JSX.Element|null} The portal content or null if not open.
 */
function NestedDropdownPortal({
  open,
  parentRect,
  onPortalMouseEnter,
  onPortalMouseLeave,
  children,
}) {
  if (!open || !parentRect) return null;

  return ReactDOM.createPortal(
    <NestedDropdownMenu
      left={parentRect.right}
      top={parentRect.top}
      onMouseEnter={onPortalMouseEnter}
      onMouseLeave={onPortalMouseLeave}
    >
      {children}
    </NestedDropdownMenu>,
    document.body
  );
}

/**
 * RecursiveDropdownItem is responsible for rendering a single dropdown item.
 * If the item contains child items, it renders a nested submenu (via a portal)
 * that appears on hover.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.item - Navigation item. It may include a "children" array.
 * @param {string} props.activeLink - The current active URL.
 * @param {Function} props.onClick - Callback fired when an item is clicked.
 * @param {string} props.$bgColor - Background color to use when the item is active or hovered.
 * @param {Function} [props.onChildHoverChange] - Optional callback to notify the parent of nested hover state changes.
 * @returns {JSX.Element} The rendered dropdown item.
 */
export function RecursiveDropdownItem({
  item,
  activeLink,
  onClick,
  $bgColor,
  onChildHoverChange = () => {},
}) {
  // Local state for header hover and nested submenu hover.
  const [headerHovered, setHeaderHovered] = useState(false);
  const [childHovered, setChildHovered] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [parentRect, setParentRect] = useState(null);
  const itemRef = useRef(null);
  const hasChildren = item.children && item.children.length > 0;
  // Combine header and child hover to determine overall hover styling.
  const hovered = headerHovered || childHovered;

  /**
   * Called when the mouse enters the item region.
   * If the item has children, the submenu is prepared and shown.
   */
  const handleMouseEnter = () => {
    setHeaderHovered(true);
    onChildHoverChange(true); // Notify parent that this item is hovered
    if (hasChildren && itemRef.current) {
      setParentRect(itemRef.current.getBoundingClientRect());
      setSubOpen(true);
    }
  };

  /**
   * Called when the mouse leaves the item region.
   * Does not immediately close submenu if the nested portal remains hovered.
   */
  const handleMouseLeave = () => {
    setHeaderHovered(false);
    onChildHoverChange(false); // Notify parent that this item is no longer hovered
  };

  /**
   * Close the submenu only when both header and nested submenu are not hovered.
   */
  useEffect(() => {
    if (!headerHovered && !childHovered && hasChildren) {
      setSubOpen(false);
    }
  }, [headerHovered, childHovered, hasChildren]);

  return (
    <DropdownItemWrapper
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.external ? (
        <DropdownItemAnchor
          ref={itemRef}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          $active={false}
          $bgColor={$bgColor}
          $hovered={hovered}
        >
          <span>{item.pageName || item.label}</span>
          <FixedExternalIcon />
          {hasChildren && <SubIndicator>▸</SubIndicator>}
        </DropdownItemAnchor>
      ) : (
        <DropdownItemLink
          ref={itemRef}
          to={item.url}
          onClick={createNavItemClickHandler(item, onClick, $bgColor)}
          $active={activeLink === item.url}
          $bgColor={$bgColor}
          $hovered={hovered}
        >
          <span>{item.pageName || item.label}</span>
          {hasChildren && <SubIndicator>▸</SubIndicator>}
        </DropdownItemLink>
      )}

      {hasChildren && (
        <NestedDropdownPortal
          open={subOpen}
          parentRect={parentRect}
          onPortalMouseEnter={() => {
            setChildHovered(true);
            onChildHoverChange(true);
          }}
          onPortalMouseLeave={() => {
            setChildHovered(false);
            onChildHoverChange(false);
          }}
        >
          {item.children.map((child) => (
            <RecursiveDropdownItem
              key={child.pageName}
              item={child}
              activeLink={activeLink}
              onClick={onClick}
              $bgColor={$bgColor}
              onChildHoverChange={onChildHoverChange}
            />
          ))}
        </NestedDropdownPortal>
      )}
    </DropdownItemWrapper>
  );
}

/**
 * NavBarDropdown renders a top–navbar dropdown menu that opens on hover.
 * It supports both internal and external links.
 *
 * @param {Object} props - Component props.
 * @param {string} props.dropdownName - Label displayed on the navbar.
 * @param {Array} props.dropdownItems - Array of links (may include nested children).
 * @param {string} props.activeLink - Currently active URL.
 * @param {Function} props.onClick - Callback when an item is clicked.
 * @param {string} props.$bgColor - Background color for active/hovered states.
 * @returns {JSX.Element}
 */
export function NavBarDropdown({
  dropdownName,
  dropdownItems,
  activeLink,
  onClick,
  $bgColor,
}) {
  // Local state to determine if the main dropdown is open
  // or if any nested submenu item is hovered.
  const [open, setOpen] = useState(false);
  const [navChildHovered, setNavChildHovered] = useState(false);
  const [containerHovered, setContainerHovered] = useState(false);
  const anchorRef = useRef(null);

  // whenever both are false, close
  useEffect(() => {
    if (!containerHovered && !navChildHovered) {
      setOpen(false);
    }
  }, [containerHovered, navChildHovered]);

  // isActive flag indicates if any item (or one of its children) matches the active URL.
  const isActive = dropdownItems.some(
    (item) =>
      item.url === activeLink ||
      (item.children &&
        item.children.some((child) => child.url === activeLink))
  );

  /**
   * Unified hover handler for the main dropdown container/children.
   * It sets the container hover state as requested.
   */
  const handleHoverChange = (isHovered) => {
    setContainerHovered(isHovered);
    if (isHovered) {
      // as soon as you enter either area, force it open
      setOpen(true);
    }
  };

  return (
    <DropdownContainer
      ref={anchorRef}
      onMouseOver={() => handleHoverChange(true)}
      onMouseOut={() => handleHoverChange(false)}
      $bgColor={$bgColor}
      $isActive={isActive}
      $hovered={navChildHovered}
    >
      <DropdownTitle>{dropdownName}</DropdownTitle>
      <DropdownIndicator>▾</DropdownIndicator>
      {open && (
        <DropdownMenuWrapper>
          <DropdownMenuScroll
            onMouseOver={() => handleHoverChange(true)}
            onMouseOut={() => handleHoverChange(false)}
          >
            {dropdownItems.map((item) => (
              <RecursiveDropdownItem
                key={item.pageName || item.label}
                item={item}
                activeLink={activeLink}
                onClick={(url, customLogo, navBg) => {
                  onClick(url, customLogo, navBg);
                  setOpen(false);
                }}
                $bgColor={$bgColor}
                onChildHoverChange={setNavChildHovered}
              />
            ))}
          </DropdownMenuScroll>
        </DropdownMenuWrapper>
      )}
    </DropdownContainer>
  );
}
