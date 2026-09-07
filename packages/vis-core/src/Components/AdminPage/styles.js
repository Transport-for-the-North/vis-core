// Presentational styled-components shared by the AdminPage section components.
import styled from "styled-components";
import { ROW_HEIGHT_PX, HEADER_HEIGHT_PX } from "utils";

export const Page = styled.div`
  padding: 16px 32px 32px;
  background: #edf0f5;
  font-family: ${({ theme }) => theme?.navFontFamily || 'var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif)'};
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  min-height: calc(100vh - 75px);
  box-sizing: border-box;
`;

// A vertical divider line sits between columns; align-items: stretch makes it span the
// full height of the taller column.
export const LayoutContainer = styled.div`
  display: flex;
  align-items: stretch;

  & > *:not(:last-child) {
    border-right: 1px solid #cbd5e1;
    padding-right: 18px;
  }
  & > *:not(:first-child) {
    padding-left: 18px;
  }
`;

// A horizontal divider line sits between vertically stacked cells.
export const Column = styled.div`
  flex: ${({ $flex }) => $flex ?? 1};
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 16px;
  }
  & > *:not(:first-child) {
    padding-top: 16px;
  }
`;

// A horizontal divider line sits between tables rendered within the same cell.
export const CellStack = styled.div`
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 16px;
  }
  & > *:not(:first-child) {
    padding-top: 16px;
  }
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) =>
    theme?.standardFontFamily || 'var(--font-family-base, "Korto", "Open Sans", sans-serif)'};
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  margin: 0 0 12px 0;
  text-align: left;
`;

// Heading row carrying the section title plus a right-aligned inline status. Transient
// feedback ("Added 2 rows.", "Updating…") lives here rather than in a block above the table
// so that showing or hiding it never changes the section's height — the page keeps its
// scroll position and nothing below appears to move.
export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`;

const STATUS_TONE_COLOURS = {
  success: "#059669",
  error: "#dc2626",
  muted: "#64748b",
};

export const InlineStatus = styled.span`
  flex-shrink: 0;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.8rem;
  line-height: 1;
  white-space: nowrap;
  color: ${({ $tone }) => STATUS_TONE_COLOURS[$tone] ?? STATUS_TONE_COLOURS.muted};
`;

// Audit cards stack one per row.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

export const Card = styled.div`
  background: ${({ $stale }) => ($stale ? "#fffbeb" : "#ffffff")};
  border-radius: ${({ theme }) => theme?.borderRadius || "8px"};
  border: 1px solid ${({ $stale }) => ($stale ? "#fde68a" : "#cbd5e1")};
  padding: 16px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid
    ${({ $stale, $hasData, theme }) =>
      $stale
        ? "#d97706"
        : $hasData
        ? theme?.colors?.primary || theme?.primary || "var(--palette-navy, #0d0f3d)"
        : "#94a3b8"};
`;

// Amber "Stale" pill shown on a card whose data is older than its staleAfterDays.
export const StaleBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 1px 7px;
  border-radius: 999px;
  background: #d97706;
  color: #fff;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  vertical-align: middle;
`;

// Muted inline text, e.g. the "· 3 days ago" suffix after a date.
export const Muted = styled.span`
  color: #4b5563;
  font-weight: 400;
`;

// Placeholder shown on an audit card for an empty table.
export const CardEmpty = styled.p`
  margin: 4px 0 0;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  color: #4b5563;
  font-style: italic;
  font-size: 0.85rem;
`;

// A row of equally-split metrics (Records / Uploads / Modifications) within a card.
export const MetricRow = styled.div`
  display: flex;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #cbd5e1;
`;

export const Metric = styled.div`
  flex: 1;
  min-width: 0;
  text-align: center;

  & + & {
    border-left: 1px solid #cbd5e1;
  }
`;

export const MetricLabel = styled.div`
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.7rem;
  font-weight: 700;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

export const MetricValue = styled.div`
  font-family: ${({ theme }) =>
    theme?.standardFontFamily || 'var(--font-family-base, "Korto", "Open Sans", sans-serif)'};
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
`;

// Small uppercase heading separating a group of rows within a card.
export const CardSubheading = styled.div`
  margin: 12px 0 4px;
  padding-top: 10px;
  border-top: 1px solid #cbd5e1;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

// Clickable header that expands/collapses a detail group within a card. The chevron
// rotates when open.
export const ExpandToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 12px 0 4px;
  padding: 10px 0 0;
  border: none;
  border-top: 1px solid #cbd5e1;
  background: none;
  cursor: pointer;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover {
    color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  }

  .chevron {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition: transform 0.15s ease;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  }
`;

export const CardTitle = styled.h3`
  font-family: ${({ theme }) =>
    theme?.standardFontFamily || 'var(--font-family-base, "Korto", "Open Sans", sans-serif)'};
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.85rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.span`
  color: #4b5563;
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 12px;
`;

export const Value = styled.span`
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  font-weight: 600;
  text-align: right;
  word-break: break-word;
`;

export const NoData = styled.span`
  color: #64748b;
  font-style: italic;
`;

// Placeholder shown in a table cell when its value is empty.
export const EmptyValue = styled.span`
  color: #64748b;
  font-style: italic;
`;

export const StatusMessage = styled.p`
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  color: #334155;
  font-size: 0.85rem;
  margin: 0;
`;

export const ErrorMessage = styled(StatusMessage)`
  color: #dc2626;
`;

// Amber advisory message, e.g. highlighting scenarios skipped because they were already
// registered — a non-error outcome that still warrants the user's attention.
export const WarnMessage = styled(StatusMessage)`
  color: #b45309;
`;

// Green confirmation message for a successful action.
export const SuccessMessage = styled(StatusMessage)`
  color: #059669;
`;

// Caps the table at $maxRows rows; taller content scrolls vertically with the header
// kept in view via sticky <Th>. $maxHeight is the measured cap (header + maxRows rows);
// it falls back to the px approximation until measured.
export const TableWrap = styled.div`
  overflow-x: auto;
  ${({ $scroll, $maxRows, $maxHeight }) =>
    $scroll &&
    `
    max-height: ${$maxHeight ?? ROW_HEIGHT_PX * $maxRows + HEADER_HEIGHT_PX}px;
    /* Always render the scrollbar (not overlay/auto-hidden) so it's clear the table
       continues beyond what's visible, and reserve its gutter to avoid a layout shift. */
    overflow-y: scroll;
    scrollbar-gutter: stable;
  `}

  /* Make the scrollbar clearly visible across browsers. */
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #94a3b8;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }
  &::-webkit-scrollbar-track {
    background: #e2e8f0;
    border-radius: 5px;
  }
  scrollbar-color: #94a3b8 #e2e8f0;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: ${({ theme }) => theme?.borderRadius || "8px"};
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
`;

export const Th = styled.th`
  text-align: left;
  padding: 11px 14px;
  font-family: ${({ theme }) =>
    theme?.standardFontFamily || 'var(--font-family-base, "Korto", "Open Sans", sans-serif)'};
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ theme }) => theme?.colors?.primary || theme?.primary || "var(--palette-navy, #0d0f3d)"};
  border-bottom: 2px solid ${({ theme }) => theme?.colors?.accent || "var(--palette-teal, #00dec6)"};
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 2;

  &:last-child {
    border-right: none;
  }
`;

export const Td = styled.td`
  padding: 10px 14px;
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.85rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
`;

// Action (Remove) column pinned to the left so it stays visible while the table
// scrolls horizontally.
export const ActionTh = styled(Th)`
  left: 0;
  z-index: 3;
  background: ${({ theme }) => theme?.colors?.primary || theme?.primary || "var(--palette-navy, #0d0f3d)"};
  border-right: 1px solid rgba(255, 255, 255, 0.3);
`;

export const ActionTd = styled(Td)`
  position: sticky;
  left: 0;
  background: #ffffff;
  border-right: 1px solid #cbd5e1;
  z-index: 1;
`;

export const AddRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

export const FieldInput = styled.input`
  flex: 1;
  min-width: 140px;
  height: 36px;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1px solid #94a3b8;
  border-radius: ${({ theme }) => theme?.borderRadius || "6px"};
  font-family: var(--font-sans, "Open Sans", "Segoe UI", Arial, sans-serif);
  font-size: 0.85rem;
  background: #ffffff;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon, #0d0f3d)"};

  &::placeholder {
    color: #64748b;
  }

  &:disabled { opacity: 0.5; }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || theme?.primary || "var(--palette-navy, #0d0f3d)"};
    box-shadow: 0 0 0 1px ${({ theme }) => theme?.colors?.primary || theme?.primary || "var(--palette-navy, #0d0f3d)"};
  }
`;

export const SelectWrap = styled.div`
  flex: 1;
  min-width: 180px;
`;
