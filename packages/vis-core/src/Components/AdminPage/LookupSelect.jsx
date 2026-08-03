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
 * With `multi`, several options can be selected at once: the value is an array and the menu
 * stays open between picks, so a whole set can be chosen in one go.
 *
 * @param {Object} props
 * @param {Array<{value: *, label: string, descriptions?: Object}>} props.options - Available options.
 * @param {*} props.value - The selected option value; an array of values when `multi` (compared by string).
 * @param {Function} props.onChange - Called with the selected value — an array when `multi`,
 *   otherwise the value (or "" when cleared).
 * @param {string} props.placeholder - Placeholder shown when nothing is selected.
 * @param {boolean} [props.disabled] - Whether the control is disabled.
 * @param {boolean} [props.multi] - Whether several options may be selected at once.
 * @returns {JSX.Element} The lookup dropdown.
 */
export function LookupSelect({ options, value, onChange, placeholder, disabled, multi }) {
  const theme = useTheme();
  const selectStyles = useMemo(
    () => makeSelectStyles(theme, { minHeight: 36, fontSize: "0.85rem", borderColor: "#d1d5db" }),
    [theme]
  );
  const optionFor = (v) => options.find((o) => String(o.value) === String(v)) ?? null;
  const selected = multi
    ? (Array.isArray(value) ? value : []).map(optionFor).filter(Boolean)
    : optionFor(value);

  /**
   * Normalises react-select's selection back to the caller's value shape.
   * @param {Object|Array<Object>|null} selection - The option(s) react-select reports.
   * @returns {void}
   */
  const handleChange = (selection) => {
    if (multi) onChange((selection ?? []).map((o) => o.value));
    else onChange(selection ? selection.value : "");
  };

  return (
    <SelectWrap>
      <Select
        styles={selectStyles}
        options={options}
        value={selected}
        onChange={handleChange}
        formatOptionLabel={formatOptionLabel}
        isMulti={!!multi}
        // Keep the menu open while picking a set, so each pick isn't a fresh reopen.
        closeMenuOnSelect={!multi}
        isClearable
        isDisabled={disabled}
        placeholder={placeholder}
        menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      />
    </SelectWrap>
  );
}
