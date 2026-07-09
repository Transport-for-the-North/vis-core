// Presentational styled-components shared by the AdminPage section components.
import styled from "styled-components";
import { ROW_HEIGHT_PX, HEADER_HEIGHT_PX } from "utils";

export const Page = styled.div`
  padding: 16px 32px 32px;
  background: #f5f5f5;
  min-height: calc(100vh - 75px);
  box-sizing: border-box;
`;

// A vertical divider line sits between columns; align-items: stretch makes it span the
// full height of the taller column.
export const LayoutContainer = styled.div`
  display: flex;
  align-items: stretch;

  & > *:not(:last-child) {
    border-right: 1px solid #d1d5db;
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
    border-bottom: 1px solid #d1d5db;
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
    border-bottom: 1px solid #d1d5db;
    padding-bottom: 16px;
  }
  & > *:not(:first-child) {
    padding-top: 16px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
  text-align: left;
`;

// Audit cards stack one per row.
export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

export const Card = styled.div`
  background: ${({ $stale }) => ($stale ? "#fffbeb" : "#fff")};
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  border-left: 4px solid
    ${({ $stale, $hasData }) => ($stale ? "#f59e0b" : $hasData ? "#7317de" : "#d1d5db")};
`;

// Amber "Stale" pill shown on a card whose data is older than its staleAfterDays.
export const StaleBadge = styled.span`
  display: inline-block;
  margin-left: 8px;
  padding: 1px 7px;
  border-radius: 999px;
  background: #f59e0b;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  vertical-align: middle;
`;

// Muted inline text, e.g. the "· 3 days ago" suffix after a date.
export const Muted = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

// Placeholder shown on an audit card for an empty table.
export const CardEmpty = styled.p`
  margin: 4px 0 0;
  color: #9ca3af;
  font-style: italic;
  font-size: 0.85rem;
`;

// A row of equally-split metrics (Records / Uploads / Modifications) within a card.
export const MetricRow = styled.div`
  display: flex;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
`;

export const Metric = styled.div`
  flex: 1;
  min-width: 0;
  text-align: center;

  & + & {
    border-left: 1px solid #f3f4f6;
  }
`;

export const MetricLabel = styled.div`
  font-size: 0.62rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

export const MetricValue = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111;
`;

// Small uppercase heading separating a group of rows within a card.
export const CardSubheading = styled.div`
  margin: 12px 0 4px;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;
  font-size: 0.68rem;
  font-weight: 600;
  color: #9ca3af;
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
  border-top: 1px solid #f3f4f6;
  background: none;
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  &:hover { color: #374151; }

  .chevron {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition: transform 0.15s ease;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  }
`;

export const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.span`
  color: #9ca3af;
  flex-shrink: 0;
  margin-right: 12px;
`;

export const Value = styled.span`
  color: #111;
  font-weight: 500;
  text-align: right;
  word-break: break-word;
`;

export const NoData = styled.span`
  color: #d1d5db;
  font-style: italic;
`;

// Placeholder shown in a table cell when its value is empty.
export const EmptyValue = styled.span`
  color: #b6bcc4;
  font-style: italic;
`;

export const StatusMessage = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
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
    background: #cbd5e1;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 5px;
  }
  scrollbar-color: #cbd5e1 #f1f5f9;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  overflow: hidden;
`;

export const Th = styled.th`
  text-align: left;
  padding: 10px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const Td = styled.td`
  padding: 10px 14px;
  font-size: 0.85rem;
  color: #111;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;
`;

// Action (Remove) column pinned to the left so it stays visible while the table
// scrolls horizontally.
export const ActionTh = styled(Th)`
  left: 0;
  z-index: 2;
`;

export const ActionTd = styled(Td)`
  position: sticky;
  left: 0;
  background: #fff;
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
  padding: 7px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #fff;
  color: #111;
  &:disabled { opacity: 0.5; }
`;

export const SelectWrap = styled.div`
  flex: 1;
  min-width: 180px;
`;
