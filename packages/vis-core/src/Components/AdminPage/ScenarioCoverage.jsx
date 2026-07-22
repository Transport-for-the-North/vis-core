import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useAdminApi, useAdminRefresh } from "hooks";
import {
  SectionTitle, StatusMessage, ErrorMessage, Card, CardEmpty,
  TableWrap, Table, Th, Td,
} from "./styles";

// A small pill naming an output table a scenario is missing data in.
const MissingPill = styled.span`
  display: inline-block;
  margin: 2px 4px 2px 0;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-size: 0.72rem;
  white-space: nowrap;
`;

/**
 * Normalises a configured table entry (a plain table name, or a { tableName, displayName }
 * object) into a consistent shape.
 *
 * @param {string|Object} t - The configured table.
 * @returns {{tableName: string, displayName: string}} The normalised entry.
 */
function normaliseTable(t) {
  if (typeof t === "string") return { tableName: t, displayName: t };
  return { tableName: t.tableName, displayName: t.displayName ?? t.tableName };
}

/**
 * "Scenarios missing output data" section. For the current app, lists each scenario
 * registered to it that has no rows in one or more of the configured output tables — i.e.
 * scenarios registered but whose output data has not (fully) been loaded. When every
 * registered scenario has data in every checked table, an "all loaded" message is shown.
 *
 * Read-only: shown to any admin-page viewer (app admins and superusers). Refetches when a
 * refresh is requested for `scenario_app_registrations` (e.g. after a registration changes).
 *
 * @param {Object} props
 * @param {Object} props.config - The `scenarioCoverage` config ({ title?, tables }).
 *   `tables` is a list of output table names or { tableName, displayName } objects.
 * @returns {JSX.Element|null} The section, or null when no tables are configured.
 */
export function ScenarioCoverage({ config }) {
  const adminApi = useAdminApi();
  const { signals } = useAdminRefresh();
  const title = config?.title ?? "Scenarios Missing Output Data";

  const tables = useMemo(
    () => (config?.tables ?? []).map(normaliseTable).filter((t) => t.tableName),
    [config]
  );
  // Friendly label per output table name, for naming which tables a scenario is missing.
  const labelByTable = useMemo(
    () => Object.fromEntries(tables.map((t) => [t.tableName, t.displayName])),
    [tables]
  );

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registrations drive coverage, so refetch when they change elsewhere on the page.
  const refreshSignal = signals?.["scenario_app_registrations"] ?? 0;

  useEffect(() => {
    if (tables.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    adminApi
      .getScenarioCoverage({ tables: tables.map((t) => t.tableName) })
      .then((data) => setRows(data ?? []))
      .catch(() => setError("Failed to load scenario coverage."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminApi, tables, refreshSignal]);

  if (tables.length === 0) return null;

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {loading && <StatusMessage>Loading…</StatusMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && rows.length === 0 && (
        <Card $hasData>
          <CardEmpty>All registered scenarios have output data loaded.</CardEmpty>
        </Card>
      )}
      {!loading && !error && rows.length > 0 && (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>Scenario</Th>
                <Th>Missing output data in</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.scenarioId}>
                  <Td>{r.scenarioCode}</Td>
                  <Td style={{ whiteSpace: "normal" }}>
                    {(r.missingTables ?? []).map((name) => (
                      <MissingPill key={name}>{labelByTable[name] ?? name}</MissingPill>
                    ))}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </div>
  );
}
