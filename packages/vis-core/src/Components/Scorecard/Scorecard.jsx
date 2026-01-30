import React, { useMemo } from "react";
import { getByPath } from "utils/getByPath";

import {
  ContentWrapper,
  EmptyState,
  MetricLabel,
  MetricLabelStrong,
  MetricRow,
  MetricValue,
  MetricValueStrong,
  Panel,
  PanelTitle,
  RemoveBtn,
  Section,
  SectionTitle,
} from "./Scorecard.styles";

/**
 * @typedef {Object} ScorecardField
 * @property {string} label
 * @property {string} path - Dot-path into the `details` object.
 * @property {string} [format] - Key into the formatter registry.
 */

/**
 * @typedef {Object} ScorecardTotal
 * @property {string} label
 * @property {string} path
 * @property {string} [format]
 */

/**
 * @typedef {Object} ScorecardPanel
 * @property {string} title
 * @property {ScorecardField[]} [fields]
 * @property {ScorecardTotal} [total]
 */

/**
 * @typedef {Object} ScorecardProps
 * @property {any} record
 * @property {Record<string, any> | undefined} details
 * @property {(id: string|number) => void} onRemove
 * @property {string} idAccessor
 * @property {Record<string, Intl.NumberFormatOptions>} formatterRegistry
 */

/**
 * Formats a value using Intl.NumberFormat options, returning "-" for empty/invalid input.
 *
 * @param {unknown} raw
 * @param {Intl.NumberFormatOptions | undefined} spec
 * @returns {string}
 */
function formatValue(raw, spec) {
  if (raw == null) return "-";

  const num = Number(raw);
  if (Number.isNaN(num)) return "-";

  const { currency, ...opts } = spec || {};
  const fmt = new Intl.NumberFormat("en-GB", {
    ...opts,
    ...(currency ? { currency } : {}),
  });

  return fmt.format(num);
}

/**
 * Renders a single record’s scorecards based on `record.panels` and `formatterRegistry`.
 *
 * @param {ScorecardProps} props
 * @returns {JSX.Element}
 */
export function Scorecard({
  record,
  details,
  onRemove,
  idAccessor,
  titleAccessor,
  formatterRegistry,
}) {
  const recordId = record?.[idAccessor];

  const titleText = useMemo(() => {
    const name = record?.[titleAccessor] || recordId;
    return `${name}`.trim();
  }, [recordId, record?.name]);

  /** @type {ScorecardPanel[]} */
  const panels = Array.isArray(record?.panels) ? record.panels : [];

  return (
    <Panel aria-label={`Scorecards for record ${String(recordId)}`}>
      <PanelTitle>
        <span>{titleText}</span>

        <RemoveBtn
          type="button"
          onClick={() => onRemove?.(recordId)}
          aria-label={`Remove record ${String(recordId)}`}
          title="Remove"
        >
          Remove
        </RemoveBtn>
      </PanelTitle>
      <ContentWrapper>

      {!details ? (
        <EmptyState role="status" aria-live="polite">
          No detailed data available for this record
        </EmptyState>
      ) : (
        <>
          {panels.map((panel, pIdx) => (
            <Section key={pIdx} aria-label={panel.title}>
              <SectionTitle>{panel.title}</SectionTitle>

              {(panel.fields || []).map((f, fIdx) => {
                const spec = formatterRegistry?.[f.format];
                const valueRaw = getByPath(details, f.path);
                const value = spec ? formatValue(valueRaw, spec) : valueRaw ?? "-";

                return (
                  <MetricRow key={fIdx}>
                    <MetricLabel>{f.label}</MetricLabel>
                    <MetricValue>{value}</MetricValue>
                  </MetricRow>
                );
              })}

              {panel.total ? (
                <MetricRow>
                  <MetricLabelStrong>{panel.total.label}</MetricLabelStrong>
                  <MetricValueStrong>
                    {(() => {
                      const spec = formatterRegistry?.[panel.total.format];
                      const valueRaw = getByPath(details, panel.total.path);
                      return spec ? formatValue(valueRaw, spec) : valueRaw ?? "-";
                    })()}
                  </MetricValueStrong>
                </MetricRow>
              ) : null}
            </Section>
          ))}
        </>
      )}
      </ContentWrapper>
    </Panel>
  );
}