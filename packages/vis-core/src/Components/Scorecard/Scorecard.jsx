import React, { useMemo, useState } from "react";
import { getByPath } from "utils/getByPath";

import {
  BreakdownList,
  ContentWrapper,
  EmptyState,
  FocusSummaryBlock,
  FocusSummaryLabel,
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
  SplitDimension,
  SplitDimensionTitle,
  ToggleBtn,
} from "./Scorecard.styles";

/**
 * @typedef {Object} ScorecardField
 * @property {string} label
 * @property {string} path - Dot-path into the `details` object.
 * @property {string} [format] - Key into the formatter registry.
 * @property {"metric"|"focusSummary"} [type] - Defaults to "metric" when omitted.
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
 * Renders a focus/north/rogb summary object with independently collapsible
 * area (`focusItems`) and dimension (`splitBy`) breakdowns.
 *
 * Expects `value` shaped as:
 * { focusTotal, focusItems: {[area]: number}, northTotal, rogbTotal,
 *   splitBy: {[dimension]: {[label]: {focusTotal, ...}}} | null }
 *
 * @param {{ field: ScorecardField, value: any, formatterRegistry: Record<string, Intl.NumberFormatOptions> }} props
 */
function FocusSummaryField({ field, value, formatterRegistry }) {
  const [showItems, setShowItems] = useState(false);
  const [showSplit, setShowSplit] = useState(false);

  const spec = formatterRegistry?.[field.format];
  const fmt = (raw) => (spec ? formatValue(raw, spec) : raw ?? "-");

  if (value == null) {
    return (
      <FocusSummaryBlock>
        <MetricRow>
          <MetricLabelStrong>{field.label}</MetricLabelStrong>
          <MetricValue>-</MetricValue>
        </MetricRow>
      </FocusSummaryBlock>
    );
  }

  const { focusTotal, focusItems, northTotal, rogbTotal, splitBy } = value;

  const itemEntries = focusItems ? Object.entries(focusItems) : [];
  const splitEntries = splitBy ? Object.entries(splitBy) : [];

  return (
    <FocusSummaryBlock>
      <FocusSummaryLabel>{field.label}</FocusSummaryLabel>

      <MetricRow>
        <MetricLabelStrong>Focus Area</MetricLabelStrong>
        <MetricValueStrong>{fmt(focusTotal)}</MetricValueStrong>
      </MetricRow>
      <MetricRow>
        <MetricLabel>Rest of North</MetricLabel>
        <MetricValue>{fmt(northTotal)}</MetricValue>
      </MetricRow>
      <MetricRow>
        <MetricLabel>Rest of GB</MetricLabel>
        <MetricValue>{fmt(rogbTotal)}</MetricValue>
      </MetricRow>

      {itemEntries.length > 0 && (
        <>
          <ToggleBtn
            type="button"
            aria-expanded={showItems}
            onClick={() => setShowItems((v) => !v)}
          >
            {showItems ? "Hide" : "Show"} area breakdown ({itemEntries.length})
          </ToggleBtn>
          {showItems && (
            <BreakdownList>
              {itemEntries.map(([areaName, areaValue]) => (
                <MetricRow key={areaName}>
                  <MetricLabel>{areaName}</MetricLabel>
                  <MetricValue>{fmt(areaValue)}</MetricValue>
                </MetricRow>
              ))}
            </BreakdownList>
          )}
        </>
      )}

      {splitEntries.length > 0 && (
        <>
          <ToggleBtn
            type="button"
            aria-expanded={showSplit}
            onClick={() => setShowSplit((v) => !v)}
          >
            {showSplit ? "Hide" : "Show"} split by ({splitEntries.length})
          </ToggleBtn>
          {showSplit && (
            <BreakdownList>
              {splitEntries.map(([dimensionName, labels]) => (
                <SplitDimension key={dimensionName}>
                  <SplitDimensionTitle>{dimensionName}</SplitDimensionTitle>
                  {Object.entries(labels).map(([labelName, labelValue]) => (
                    <MetricRow key={labelName}>
                      <MetricLabel>{labelName}</MetricLabel>
                      <MetricValue>{fmt(labelValue?.focusTotal)}</MetricValue>
                    </MetricRow>
                  ))}
                </SplitDimension>
              ))}
            </BreakdownList>
          )}
        </>
      )}
    </FocusSummaryBlock>
  );
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

                if (f.type === "focusSummary") {
                  return (
                    <FocusSummaryField
                      key={fIdx}
                      field={f}
                      value={valueRaw}
                      formatterRegistry={formatterRegistry}
                    />
                  );
                }

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