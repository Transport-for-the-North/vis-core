import styled from "styled-components";

/**
 * Card container for a single record scorecard.
 */
export const Panel = styled.section`
  border: 1px solid #cbd5e1;
  border-radius: ${(p) => p.theme.borderRadius};
  background: #fff;
  padding: 8px;
  font-size: 0.85rem;
`;

/**
 * Card header row: title + actions.
 */
export const PanelTitle = styled.header`
  margin: 0 0 6px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: left;
`;

/**
 * Remove action button.
 */
export const RemoveBtn = styled.button`
  border: none;
  background: #eee;
  color: #333;
  border-radius: 4px;
  padding: 3px 7px;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: ${(p) => p.theme.standardFontFamily};

  &:hover {
    background: #e0e0e0;
  }

  &:focus-visible {
    outline: 2px solid rgba(76, 29, 149, 0.9);
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

/**
 * Panel section container (title + metrics).
 */
export const Section = styled.section`
  margin-bottom: 8px;
`;

/**
 * Panel section title.
 */
export const SectionTitle = styled.h4`
  margin: 4px 0;
  font-size: 0.95rem;
`;

/**
 * Metric row: label on left, value on right.
 */
export const MetricRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px dashed #e2e8f0;
`;

export const MetricLabel = styled.span`
  text-align: left;
`;

export const MetricValue = styled.span`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const MetricLabelStrong = styled(MetricLabel)`
  font-weight: 700;
`;

export const MetricValueStrong = styled(MetricValue)`
  font-weight: 700;
`;

/**
 * Inline notice used when detailed data is unavailable.
 */
export const EmptyState = styled.p`
  margin: 0;
  display: inline-flex;
  padding: 2px 8px;
  border: 1px solid #94a3b8;
  border-radius: 999px;
`;