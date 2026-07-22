import React, { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { formatDate, relativeTimeFromNow, isStale, numberWithCommas } from "utils";
import { useAdminApi, useAdminRefresh } from "hooks";
import {
  Card, CardTitle, Row, Label, Value, NoData, Muted, StaleBadge, ExpandToggle,
  CardEmpty, MetricRow, Metric, MetricLabel, MetricValue,
  SectionTitle, Grid, StatusMessage, ErrorMessage,
} from "./styles";

/**
 * A combined activity row: a date (with a muted "· time ago") and its user on one line,
 * or an em dash when there's no date.
 *
 * @param {Object} props
 * @param {string} props.label - The row label (e.g. "Last modified").
 * @param {string} [props.date] - ISO timestamp.
 * @param {string} [props.by] - The associated user.
 * @returns {JSX.Element} The rendered row.
 */
function ActivityRow({ label, date, by }) {
  const formatted = formatDate(date);
  const ago = relativeTimeFromNow(date);
  return (
    <Row>
      <Label>{label}</Label>
      <Value>
        {formatted ? (
          <>
            {formatted}
            {ago && <Muted> · {ago}</Muted>}
            {by && <> · {by}</>}
          </>
        ) : (
          <NoData>—</NoData>
        )}
      </Value>
    </Row>
  );
}

/**
 * A single audit summary card: last modified/created dates and users, plus record/upload/
 * modification counts and a "changes by user" breakdown. Tinted amber when the data is
 * older than the table's `staleAfterDays`.
 *
 * @param {Object} props
 * @param {Object} props.entry - The audit result for one table.
 * @param {number} [props.staleAfterDays] - Age threshold (days) for the stale highlight.
 * @returns {JSX.Element} The rendered audit card.
 */
function AuditCard({ entry, staleAfterDays }) {
  const [expanded, setExpanded] = useState(false);
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const hasData = !!(entry.modifiedDate || entry.createdDate);
  // An empty table (no rows) shows a single placeholder instead of empty fields.
  const isEmpty = entry.rowCount === 0 || (entry.rowCount == null && !hasData);
  const stale = !isEmpty && isStale(entry.modifiedDate, staleAfterDays);
  const contributors = entry.contributors ?? [];
  const uploads = entry.uploads ?? [];
  // Scenarios registered to this app with no rows in this table (null for tables not
  // keyed by scenario, so the section is omitted rather than shown as "none missing").
  const missingScenarios = entry.missingScenarios ?? null;

  const metrics = [
    { label: "Records", value: entry.rowCount },
    { label: "Uploads", value: entry.uploadCount },
    { label: "Modifications", value: entry.modificationCount },
  ];
  const hasMetrics = metrics.some((m) => m.value != null);

  return (
    <Card $hasData={hasData} $stale={stale}>
      <CardTitle>
        {entry.displayName}
        {stale && <StaleBadge>Stale</StaleBadge>}
      </CardTitle>

      {isEmpty ? (
        <CardEmpty>No data in table.</CardEmpty>
      ) : (
        <>
          <ActivityRow label="Last modified" date={entry.modifiedDate} by={entry.modifiedBy} />
          <ActivityRow label="Created" date={entry.createdDate} by={entry.createdBy} />

          {hasMetrics && (
            <MetricRow>
              {metrics.map((m) => (
                <Metric key={m.label}>
                  <MetricLabel>{m.label}</MetricLabel>
                  <MetricValue>
                    {m.value == null ? "—" : numberWithCommas(m.value)}
                  </MetricValue>
                </Metric>
              ))}
            </MetricRow>
          )}

          {contributors.length > 0 && (
            <>
              <ExpandToggle
                type="button"
                $open={expanded}
                onClick={() => setExpanded((e) => !e)}
                aria-expanded={expanded}
              >
                <span>Changes by user ({contributors.length})</span>
                <ChevronDownIcon className="chevron" />
              </ExpandToggle>
              {expanded &&
                contributors.map((c) => (
                  <Row key={c.user}>
                    <Label>{c.user}</Label>
                    <Value>{numberWithCommas(c.count)}</Value>
                  </Row>
                ))}
            </>
          )}

          {uploads.length > 0 && (
            <>
              <ExpandToggle
                type="button"
                $open={uploadsOpen}
                onClick={() => setUploadsOpen((o) => !o)}
                aria-expanded={uploadsOpen}
              >
                <span>Uploads ({uploads.length})</span>
                <ChevronDownIcon className="chevron" />
              </ExpandToggle>
              {uploadsOpen &&
                uploads.map((u, i) => {
                  const formatted = formatDate(u.date);
                  const ago = relativeTimeFromNow(u.date);
                  return (
                    <Row key={`${u.date ?? i}-${u.user ?? ""}`}>
                      <Label>
                        {formatted ?? <NoData>—</NoData>}
                        {ago && <Muted> · {ago}</Muted>}
                        {u.user && <Muted> · {u.user}</Muted>}
                      </Label>
                      <Value>{numberWithCommas(u.count)}</Value>
                    </Row>
                  );
                })}
            </>
          )}

          {missingScenarios && (
            <>
              <ExpandToggle
                type="button"
                $open={missingOpen}
                onClick={() => setMissingOpen((o) => !o)}
                aria-expanded={missingOpen}
              >
                <span>Scenarios missing ({missingScenarios.length})</span>
                <ChevronDownIcon className="chevron" />
              </ExpandToggle>
              {missingOpen &&
                (missingScenarios.length === 0 ? (
                  <Row>
                    <Muted>All registered scenarios have data in this table.</Muted>
                  </Row>
                ) : (
                  missingScenarios.map((code) => (
                    <Row key={code}>
                      <Label>{code}</Label>
                      <Value>
                        <NoData>No data</NoData>
                      </Value>
                    </Row>
                  ))
                ))}
            </>
          )}
        </>
      )}
    </Card>
  );
}

/**
 * Fetches and renders a grid of read-only audit cards for the configured tables.
 *
 * @param {Object} props
 * @param {Array<Object>} props.tables - Audit table configs (may include `staleAfterDays`).
 * @param {string} [props.title="Table Audit"] - Section heading.
 * @returns {JSX.Element} The audit section.
 */
export function AuditSection({ tables, title = "Table Audit" }) {
  const adminApi = useAdminApi();
  const { signals } = useAdminRefresh();
  // The per-card "scenarios missing" list is scoped to this app's registrations, so reload
  // the cards when a registration is added/removed/sent elsewhere on the page.
  const refreshSignal = signals?.["scenario_app_registrations"] ?? 0;
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Staleness threshold is presentational config (not returned by the API), so map it per
  // table name to apply to the matching result.
  const staleByTable = useMemo(
    () => Object.fromEntries((tables ?? []).map((t) => [t.tableName, t.staleAfterDays])),
    [tables]
  );

  useEffect(() => {
    if (!tables?.length) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminApi
      .getTableAudit(tables)
      .then((data) => setAuditData(data ?? []))
      .catch(() => setError("Failed to load table audit data."))
      .finally(() => setLoading(false));
  }, [tables, adminApi, refreshSignal]);

  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      {loading && <StatusMessage>Loading…</StatusMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {!loading && !error && (
        <Grid>
          {auditData.map((entry) => (
            <AuditCard
              key={entry.tableName}
              entry={entry}
              staleAfterDays={staleByTable[entry.tableName]}
            />
          ))}
        </Grid>
      )}
    </div>
  );
}
