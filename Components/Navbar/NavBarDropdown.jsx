import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { createNavItemClickHandler } from "utils/nav";

/* ----------------------------------
   Styled Components Definitions
-------------------------------------*/

/**
 * Outer wrapper for a dropdown menu.
 * Maintains the border radius so that the bottom–corner rounding is visible.
 */
const DropdownMenuWrapper = styled.div`
  position: absolute;
  width: 100%;
  left: 0;
  top: 75px;
  z-index: 1001;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: visible; /* Allow portal content not to be clipped */
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

  /* Custom Webkit scrollbar */
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
  align-items: center;
  font-family: ${({ theme }) => theme.standardFontFamily};
  font-size: clamp(12px, 1.2vw, 18px);
  background-color: ${({ $isActive, $hovered, $bgColor }) =>
    $isActive || $hovered ? $bgColor : "#f9f9f9"};
  color: ${({ $isActive, $hovered }) =>
    $isActive || $hovered ? "#ffffff" : "#4b3e91"};
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
 * Styled link used for dropdown items.
 * Accepts custom props to determine the active and hover styles.
 */
const DropdownItemLink = styled(Link)`
  display: flex;
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
  transition: background-color 0.3s ease, color 0.3s ease;
  white-space: normal;

  &:hover {
    background-color: ${({ $bgColor }) => $bgColor};
    color: #ffffff;
  }
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
      <DropdownItemLink
        ref={itemRef}
        to={item.url}
        onClick={createNavItemClickHandler(item, onClick, $bgColor)}
        $active={activeLink === item.url}
        $bgColor={$bgColor}
        $hovered={hovered}
      >
        <span>{item.pageName}</span>
        {hasChildren && <SubIndicator>▸</SubIndicator>}
      </DropdownItemLink>

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
 * It passes down hover state to its recursive dropdown items so that the label remains highlighted.
 *
 * @param {Object} props - Component props.
 * @param {string} props.dropdownName - The label displayed on the navbar.
 * @param {Array} props.dropdownItems - Array of navigation items (each may include nested children).
 * @param {string} props.activeLink - The currently active URL.
 * @param {Function} props.onClick - Callback triggered when a dropdown item is clicked.
 * @param {string} props.$bgColor - Background color used for active or hovered states.
 * @returns {JSX.Element} The rendered dropdown component.
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
  const anchorRef = useRef(null);

  // isActive flag indicates if any item (or one of its children) matches the active URL.
  const isActive = dropdownItems.some(
    (item) =>
      item.url === activeLink ||
      (item.children &&
        item.children.some((child) => child.url === activeLink))
  );

  /**
   * Open the dropdown when the container is hovered.
   */
  const handleContainerMouseEnter = () => {
    setOpen(true);
  };

  /**
   * Close the dropdown only when there is no nested hover activity.
   */
  const handleContainerMouseLeave = () => {
    if (!navChildHovered) {
      setOpen(false);
    }
  };

  return (
    <DropdownContainer
      ref={anchorRef}
      onMouseEnter={handleContainerMouseEnter}
      onMouseLeave={handleContainerMouseLeave}
      $bgColor={$bgColor}
      $isActive={isActive}
      $hovered={navChildHovered}
    >
      <DropdownTitle>{dropdownName}</DropdownTitle>
      <DropdownIndicator>▾</DropdownIndicator>
      {open && (
        <DropdownMenuWrapper>
          <DropdownMenuScroll
            onMouseEnter={handleContainerMouseEnter}
            onMouseLeave={handleContainerMouseLeave}
          >
            {dropdownItems.map((item) => (
              <RecursiveDropdownItem
                key={item.pageName}
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
