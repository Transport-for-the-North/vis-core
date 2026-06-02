import React, { useMemo } from "react";
import { useMapContext } from "hooks";
import { mapStyles } from "defaults";
import "./MapLayout.css";

const LIGHT_STYLE = "geoapifyPositron";
const DARK_STYLE = "geoapifyDarkMatter";

/**
 * Resolves the current map style key from the active map style value.
 *
 * If no map style is provided, the light style is used as the default.
 *
 * @param {string} mapStyle - The currently active map style value.
 * @returns {string} The matching map style key.
 */
const resolveCurrentStyleKey = (mapStyle) => {
  if (!mapStyle) return LIGHT_STYLE;

  const entries = Object.entries(mapStyles);
  const matched = entries.find(([key, value]) => {
    const resolved = typeof value === "function" ? value() : value;
    return resolved === mapStyle;
  });

  return matched?.[0] || LIGHT_STYLE;
};

/**
 * MapStyleToggle component for switching between light and dark basemaps.
 *
 * Uses the current map style from context to determine which basemap is active,
 * then dispatches an action to switch to the opposite style when clicked.
 *
 * @returns {JSX.Element} A map control button for toggling map style.
 */
const MapStyleToggle = () => {
  const { state, dispatch } = useMapContext();

  const currentStyleKey = useMemo(
    () => resolveCurrentStyleKey(state.mapStyle),
    [state.mapStyle]
  );

  const isDark = currentStyleKey === DARK_STYLE;

  /**
   * Toggles the map style between light and dark basemaps.
   */
  const handleToggle = () => {
    const nextStyleKey = isDark ? LIGHT_STYLE : DARK_STYLE;
    const nextStyle =
      typeof mapStyles[nextStyleKey] === "function"
        ? mapStyles[nextStyleKey]()
        : mapStyles[nextStyleKey];

    dispatch({
      type: "UPDATE_MAP_STYLE",
      payload: nextStyle,
    });
  };

  return (
    <div className="map-style-toggle maplibregl-ctrl maplibregl-ctrl-group">
      <button
        className="maplibregl-ctrl-icon map-style-toggle__button"
        type="button"
        title={isDark ? "Switch to light basemap" : "Switch to dark basemap"}
        aria-label={isDark ? "Switch to light basemap" : "Switch to dark basemap"}
        onClick={handleToggle}
      >
        {isDark ? "☀" : "🌙"}
      </button>
    </div>
  );
};

export default React.memo(MapStyleToggle);