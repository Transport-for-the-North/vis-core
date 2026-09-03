import React from "react";
import { EmptyValue } from "./styles";

/**
 * Renders a table cell's value, showing a greyed "Empty" placeholder when the value is
 * empty (null/undefined/empty string) so blank cells read clearly.
 *
 * @param {Object} props
 * @param {*} props.value - The pre-rendered cell value (a string, or null/"" when empty).
 * @returns {JSX.Element|*} The cell content.
 */
export function CellValue({ value }) {
  if (value === null || value === undefined || value === "") {
    return <EmptyValue>Empty</EmptyValue>;
  }
  return value;
}
