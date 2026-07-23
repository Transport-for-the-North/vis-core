import { useMemo } from "react";
import { useTheme } from "styled-components";

/**
 * makeSelectStyles
 * Returns a react-select styles object using the app theme (ThemeProvider).
 * Intended for regular dropdowns (e.g., top filter bar).
 *
 * @param {object} theme - Theme object from styled-components (ThemeProvider).
 * @param {object} [opts] - Optional overrides.
 * @param {number} [opts.minHeight=28] - Control min height of the select.
 * @param {string} [opts.fontSize='0.85rem'] - Base font size.
 * @param {string} [opts.borderColor='#ddd'] - Default control border color.
 * @param {number} [opts.zIndex=9999] - z-index for menuPortal.
 * @returns {Record<string, Function>} react-select styles object.
 */
export function makeSelectStyles(theme, opts = {}) {
  const {
    minHeight = 28,
    fontSize = "0.85rem",
    borderColor = "#ddd",
    zIndex = 9999,
  } = opts;
  const fontFamily = '"Open Sans", "Segoe UI", Arial, sans-serif';
  const textColor = theme?.colors?.text || "var(--text-icon)";

  return {
    menuPortal: (base) => ({ ...base, zIndex }),
    control: (base, state) => ({
      ...base,
      fontFamily,
      color: textColor,
      minHeight,
      borderRadius: theme.borderRadius,
      borderColor: state.isFocused ? theme.activeBg : borderColor,
      boxShadow: state.isFocused ? `0 0 0 1px ${theme.activeBg}` : "none",
      "&:hover": { borderColor: theme.activeBg },
      textAlign: "left",
    }),
    valueContainer: (base) => ({
      ...base,
      fontFamily,
      color: textColor,
      padding: "2px 6px",
      fontSize,
      textAlign: "left",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: "2px 4px",
    }),
    input: (base) => ({
      ...base,
      fontFamily,
      color: textColor,
      fontSize,
      margin: 0,
      padding: 0,
    }),
    singleValue: (base) => ({
      ...base,
      fontFamily,
      color: textColor,
      fontSize,
    }),
    placeholder: (base) => ({
      ...base,
      fontFamily,
      color: textColor,
      fontSize,
    }),
    menu: (base) => ({
      ...base,
      fontFamily,
    }),
    menuList: (base) => ({
      ...base,
      fontFamily,
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      fontFamily,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      fontSize,
      backgroundColor: isSelected
        ? theme.activeBg
        : isFocused
        ? (theme.colors?.muted || "#efeff7")
        : (theme.colors?.surface || "#fff"),
      color: isSelected ? "#fff" : textColor,
      cursor: "pointer",
      ":active": {
        ...styles[":active"],
        backgroundColor: theme.activeBg,
        color: "#fff",
      },
    }),
  };
}

/**
 * useCompactSelectStyles
 * Hook returning compact styles for react-select (ideal for table-head filters).
 * Uses ThemeProvider’s theme via useTheme().
 *
 * @param {object} [opts] - Optional overrides.
 * @param {number} [opts.minHeight=24] - Compact control height.
 * @param {string} [opts.fontSize='0.8rem'] - Compact font size.
 * @param {string} [opts.borderColor='#ddd'] - Control border color.
 * @param {number} [opts.zIndex=9999] - z-index for menuPortal.
 * @returns {Record<string, Function>} react-select styles object.
 */
export function useCompactSelectStyles(opts = {}) {
  const theme = useTheme();

  return useMemo(() => {
    const base = makeSelectStyles(theme, {
      minHeight: opts.minHeight ?? 24,
      fontSize: opts.fontSize ?? "0.8rem",
      borderColor: opts.borderColor ?? "#ddd",
      zIndex: opts.zIndex ?? 9999,
    });

    return {
      ...base,
      control: (controlBase, state) => ({
        ...base.control(controlBase, state),
        paddingLeft: 0,
      }),
      valueContainer: (vcBase) => ({
        ...base.valueContainer(vcBase),
        padding: 0,
        overflow: "hidden",
        minWidth: 0,
      }),
      indicatorsContainer: (indBase) => ({
        ...base.indicatorsContainer(indBase),
        padding: "0 2px",
        gap: 2,
      }),
      input: (inBase) => ({
        ...base.input(inBase),
        margin: 0,
        padding: 0,
      }),
    };
  }, [theme, opts.minHeight, opts.fontSize, opts.borderColor, opts.zIndex]);
}