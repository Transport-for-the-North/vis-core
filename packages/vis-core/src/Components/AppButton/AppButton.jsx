import styled from "styled-components";
import { darken } from "polished";

/**
 * Generic reusable button with accessibility features.
 *
 * Key points:
 * - Uses the app font via `font: inherit` (so it won't fall back to browser default).
 * - Supports a configurable background color via `$bgColor`.
 * - Provides hover, active (indented + scaled), focus, and disabled states.
 * - Follows accessibility best practices with focus indicators and semantic markup.
 *
 * @param {Object} props - Styled-component props.
 * @param {string} [props.$bgColor] - Background color for the button (defaults to theme primary if present).
 * @param {string} [props.$width="auto"] - Optional width override.
 * @param {string} [props.$height="32px"] - Optional height override.
 * @returns {JSX.Element} A styled button component.
 */
export const AppButton = styled.button`
  cursor: pointer;
  padding: 10px 12px;
  background-color: ${(props) => props.$bgColor ?? props.theme?.primary ?? "#7317de"};
  color: white;
  border-radius: 8px;
  border: 0.25px solid;
  width: ${(props) => props.$width ?? "auto"};
  height: ${(props) => props.$height ?? "32px"};

  /* Important: inherit the app's font instead of using browser default */
  font: inherit;
  font-size: 0.9em;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  /* Hover state */
  &:hover:not(:disabled) {
    background-color: ${(props) =>
      darken(0.1, props.$bgColor ?? props.theme?.primary ?? "#7317de")};
  }

  /* Active state - indented effect and slight shrink when clicked */
  &:active:not(:disabled) {
    /* Added scale for a clearer tactile "press" feel */
    transform: scale(0.98);
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.3);
    background-color: ${(props) =>
      darken(0.15, props.$bgColor ?? props.theme?.primary ?? "#7317de")};
  }

  /* Focus state - accessibility for keyboard navigation */
  &:focus-visible {
    outline: 2px solid ${(props) => props.$bgColor ?? props.theme?.primary ?? "#7317de"};
    outline-offset: 2px;
    /* Remove default browser outline */
    outline-style: solid;
  }

  /* Remove default focus outline for mouse users while keeping it for keyboard users */
  &:focus:not(:focus-visible) {
    outline: none;
  }

  /* Disabled state */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
    background-color: ${(props) =>
      darken(0.2, props.$bgColor ?? props.theme?.primary ?? "#7317de")};
  }
`;