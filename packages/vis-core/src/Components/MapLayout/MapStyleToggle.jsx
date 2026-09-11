import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { useMapContext } from "hooks";
import { actionTypes } from "reducers";
import { getBaseMap, BASE_MAPS } from "../../map/baseMaps";

/**
 * MapLibre-style formatting for button. Wraps the sun/moon icon.
 */
const MapStyleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 29px;
  height: 29px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;

  &:hover {
    background-color: rgb(0 0 0 / 5%);
  }

  &:focus-visible {
    outline: 2px solid #3887be;
    outline-offset: -2px;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/**
 * SVG icon representing a sun (light mode).
 */
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.592-1.591ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.592Z" />
  </svg>
);

/**
 * SVG icon representing a moon (dark mode).
 */
const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * A map control button that toggles between the available base map styles.
 * It renders directly inside MapLibre's navigation control group container
 * so that it sits alongside the zoom and compass controls.
 *
 * Theme is derived from the explicit base-map descriptor, never from URL
 * inspection or style-name heuristics.
 *
 * @param {Object} props
 * @param {Object} props.map - The MapLibre map instance.
 * @param {string} [props.position="bottom-left"] - The position of the control group.
 * @returns {JSX.Element|null} The rendered toggle button portalled into the control container.
 */
const MapStyleToggle = ({ map, position = "bottom-left" }) => {
  const { state, dispatch } = useMapContext();
  const [controlElement, setControlElement] = useState(null);

  const currentBaseMap = state.baseMapId ? getBaseMap(state.baseMapId) : null;
  const isDarkMode = currentBaseMap?.theme === "dark";

  // Pick the next map from the catalogue (the one that is not currently active).
  const options = Object.values(BASE_MAPS);
  const next = options.find((opt) => opt.id !== state.baseMapId) ?? options[0];

  const handleToggle = useCallback(() => {
    // Persistence is handled by MapContext's writeBaseMapPreference effect.
    if (next) {
      dispatch({ type: actionTypes.SET_BASE_MAP, payload: next.id });
    }
  }, [next, dispatch]);

  useEffect(() => {
    if (!currentBaseMap || !map || typeof map.getContainer !== "function") {
      setControlElement(null);
      return undefined;
    }

    const findGroup = () => {
      const container = map.getContainer();
      if (!container) return null;
      return (
        container.querySelector(`.maplibregl-ctrl-${position} .maplibregl-ctrl-group`) ||
        container.querySelector(".maplibregl-ctrl-group")
      );
    };

    const existing = findGroup();
    if (existing) {
      setControlElement(existing);
      return undefined;
    }

    const mapContainer = map.getContainer();
    if (!mapContainer || typeof MutationObserver === "undefined") {
      return undefined;
    }

    const observer = new MutationObserver(() => {
      const found = findGroup();
      if (found) {
        setControlElement(found);
        observer.disconnect();
      }
    });

    observer.observe(mapContainer, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      setControlElement(null);
    };
  }, [currentBaseMap, map, position]);

  if (!currentBaseMap || !controlElement) return null;

  return createPortal(
    <MapStyleButton
      type="button"
      className="maplibregl-ctrl-map-style"
      data-testid="map-style-toggle-btn"
      title={`Switch to ${next.label}`}
      aria-label={`Switch to ${next.label}`}
      onClick={handleToggle}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </MapStyleButton>,
    controlElement,
  );
};

export default MapStyleToggle;