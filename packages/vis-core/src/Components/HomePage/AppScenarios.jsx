import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { AppContext } from "contexts";
import { api } from "services";
import { formatDate } from "utils";

const Wrap = styled.div`
  overflow-x: auto;
  margin-top: 12px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 0.9rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 10px 14px;
  color: #111;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
`;

const Muted = styled.div`
  color: #6b7280;
  font-size: 0.8rem;
  margin-top: 2px;
`;

const Message = styled.p`
  color: #6b7280;
`;

/**
 * Homepage element listing the NoRMS scenarios registered to the current app. Fetches from
 * the public (authenticated) pipeline endpoint scoped to `appContext.appName`, so ordinary
 * app users — not just admins — can see which scenarios the dashboard covers.
 *
 * Enabled via `appContext.appScenarios` (truthy). When that value is an object it may carry
 * `{ title, description }` to customise the heading and intro line.
 *
 * @returns {JSX.Element|null} The section, or null when disabled / no app name is available.
 */
export function AppScenarios() {
  const appContext = useContext(AppContext);
  const config = appContext?.appScenarios;
  const appName = appContext?.appName;

  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!config || !appName) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    api.baseService
      .get("api/pipeline/app-scenarios", { queryParams: { app: appName } })
      .then((data) => setScenarios(Array.isArray(data) ? data : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [config, appName]);

  if (!config || !appName) return null;

  const title = (typeof config === "object" && config.title) || "Scenarios in this dashboard";
  const description = typeof config === "object" ? config.description : null;

  return (
    <section className="app-scenarios even-section container-content">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {loading && <Message>Loading scenarios…</Message>}
      {!loading && error && <Message>Unable to load scenarios at this time.</Message>}
      {!loading && !error && scenarios.length === 0 && (
        <Message>No scenarios are currently registered to this dashboard.</Message>
      )}
      {!loading && !error && scenarios.length > 0 && (
        <Wrap>
          <Table>
            <thead>
              <tr>
                <Th>Scenario</Th>
                <Th>Description</Th>
                <Th>Registered</Th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.scenarioId}>
                  <Td>{s.scenarioCode}</Td>
                  <Td>
                    {s.visDescription || s.networkDesc || <span style={{ color: "#9ca3af" }}>—</span>}
                    {s.visDescription && s.networkDesc && <Muted>{s.networkDesc}</Muted>}
                  </Td>
                  <Td>{formatDate(s.registeredAt) ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Wrap>
      )}
    </section>
  );
}
