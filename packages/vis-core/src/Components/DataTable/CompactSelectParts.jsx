import React from "react";
import { components as selectComponents } from "react-select";

/**
 * Compact multi-select value container that shows a simple count summary.
 *
 * @param {import('react-select').ValueContainerProps<any, true>} props
 * @returns {JSX.Element}
 */
export function CompactValueContainer(props) {
  const { children, getValue, selectProps } = props;
  const values = getValue ? getValue() : [];
  const count = Array.isArray(values) ? values.length : 0;
  const inputChild = Array.isArray(children)
    ? children[children.length - 1]
    : children;

  return (
    <selectComponents.ValueContainer {...props}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "2px 6px",
          gap: 6,
          overflow: "hidden",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontSize: "0.8rem",
            color: count ? "#0d0f3d" : "#64748b",
            flex: "0 0 auto",
          }}
        >
          {count ? `${count} selected` : selectProps.placeholder || "Filter"}
        </span>
        {inputChild}
      </div>
    </selectComponents.ValueContainer>
  );
}

/**
 * Compact clear indicator for react-select.
 *
 * @param {import('react-select').ClearIndicatorProps<any, true>} indicatorProps
 * @returns {JSX.Element}
 */
export function CompactClearIndicator(indicatorProps) {
  const { innerProps } = indicatorProps;
  return (
    <div
      {...innerProps}
      aria-label="Clear filter selections"
      title="Clear filter selections"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        cursor: "pointer",
        color: "#64748b",
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      ×
    </div>
  );
}

/**
 * Compact dropdown indicator for react-select.
 *
 * @param {import('react-select').DropdownIndicatorProps<any, true>} indicatorProps
 * @returns {JSX.Element}
 */
export function CompactDropdownIndicator(indicatorProps) {
  const { innerProps } = indicatorProps;
  return (
    <div
      {...innerProps}
      aria-label="Open filter menu"
      title="Open filter menu"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        cursor: "pointer",
        color: "#64748b",
        fontSize: 12,
        lineHeight: 1,
      }}
    >
      ▾
    </div>
  );
}