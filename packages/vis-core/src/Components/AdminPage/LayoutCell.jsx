import React from "react";
import { AuditSection } from "./AuditSection";
import { EditTable } from "./EditTable";
import { ViewTable } from "./ViewTable";
import { SendScenarios } from "./SendScenarios";

/**
 * Renders one layout cell. `type` selects the section; `table` (optional) narrows it
 * to a single configured table, otherwise every table in that section renders.
 *
 * @param {Object} props
 * @param {Object} props.cell - The cell config ({ type, table? }).
 * @param {Array<Object>} props.auditTables - All configured audit tables.
 * @param {Array<Object>} props.editTables - All configured edit tables.
 * @param {Array<Object>} props.viewTables - All configured view tables.
 * @param {Object} [props.sendScenarios] - The `sendScenarios` config (for the "send" cell).
 * @returns {JSX.Element|Array<JSX.Element>|null} The rendered section(s) for the cell.
 */
export function LayoutCell({ cell, auditTables, editTables, viewTables, sendScenarios }) {
  /**
   * Narrows a section's table list to the cell's configured table, if any.
   * @param {Array<Object>} list - The section's full table list.
   * @returns {Array<Object>} The (possibly filtered) list.
   */
  const pick = (list) =>
    cell.table ? list.filter((t) => t.tableName === cell.table) : list;

  switch (cell.type) {
    case "audit":
      return <AuditSection tables={pick(auditTables)} title={cell.title} />;
    case "edit":
      return pick(editTables).map((t) => <EditTable key={t.tableName} table={t} />);
    case "view":
      return pick(viewTables).map((t) => <ViewTable key={t.tableName} table={t} />);
    case "send":
      return sendScenarios ? <SendScenarios config={sendScenarios} /> : null;
    default:
      return null;
  }
}
