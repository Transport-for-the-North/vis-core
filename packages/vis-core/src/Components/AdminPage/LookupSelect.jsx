import React, { useMemo } from "react";
import { useTheme } from "styled-components";
import Select from "react-select";
import { makeSelectStyles } from "utils/selectStyles";
import { SelectWrap } from "./styles";

/**
 * Renders an option's label with any `descriptions` (extra source columns) shown as muted
 * secondary lines in the menu, to give more context per option. The selected value stays
 * compact (label only).
 *
 * @param {{label: string, descriptions?: Object}} option - The option data.
 * @param {{context: "menu"|"value"|"input"}} meta - react-select render context.
 * @returns {JSX.Element|string} The rendered option.
 */
function formatOptionLabel(option, meta) {
  const descriptions = option.descriptions
    ? Object.values(option.descriptions).filter((d) => d != null && d !== "")
    : [];
  if (meta.context === "value" || descriptions.length === 0) {
    return option.label;
  }
  return (
    <div>
      <div>{option.label}</div>
      {descriptions.map((d, i) => (
        <div key={i} style={{ fontSize: "0.72rem", color: "#6b7280", lineHeight: 1.3 }}>
          {d}
        </div>
      ))}
    </div>
  );
}

/**
 * A searchable lookup dropdown built on react-select, styled to match the app's
 * dropdowns via the shared {@link makeSelectStyles}. When options carry `descriptions`,
 * they are shown as muted secondary lines in the menu.
 *
 * @param {Object} props
 * @param {Array<{value: *, label: string, descriptions?: Object}>} props.options - Available options.
 * @param {*} props.value - The currently selected option value (compared by string).
 * @param {Function} props.onChange - Called with the selected value (or "" when cleared).
 * @param {string} props.placeholder - Placeholder shown when nothing is selected.
 * @param {boolean} [props.disabled] - Whether the control is disabled.
 * @returns {JSX.Element} The lookup dropdown.
 */
export function LookupSelect({ options, value, onChange, placeholder, disabled }) {
  const theme = useTheme();
  const selectStyles = useMemo(
    () => makeSelectStyles(theme, { minHeight: 36, fontSize: "0.85rem", borderColor: "#d1d5db" }),
    [theme]
  );
  const selected = options.find((o) => String(o.value) === String(value)) ?? null;

  return (
    <SelectWrap>
      <Select
        styles={selectStyles}
        options={options}
        value={selected}
        onChange={(opt) => onChange(opt ? opt.value : "")}
        formatOptionLabel={formatOptionLabel}
        isClearable
        isDisabled={disabled}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      />
    </SelectWrap>
  );
}
