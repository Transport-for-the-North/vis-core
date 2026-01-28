import styled from "styled-components";

export const TablePane = styled.div`
  border: 1px solid #ddd;
  border-radius: ${(p) => p.theme.borderRadius};
  overflow: hidden;
  background: #fff;
  min-width: 0;
  max-width: 100%;
`;

export const StickyControls = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ScrollX = styled.div`
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0;
`;

export const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 0.9rem;
  table-layout: fixed;
  width: 100%;
  min-width: max-content;
`;

export const Th = styled.th`
  position: sticky;
  top: 0;
  z-index: 1;
  text-align: left;
  padding: 10px 8px;
  background: ${(p) => p.theme.activeBg};
  color: #fff;
  font-weight: 800;
  border-bottom: 1px solid #5b0fb5;
  user-select: none;
  min-width: 0;
  overflow: hidden;
`;

export const ThInner = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 6px;
  min-width: 0;
`;

export const HeaderLabel = styled.span`
  min-width: 0;
  max-width: 100%;

  /* Clamp headers to 2 lines without breaking words. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  overflow: hidden;
  white-space: normal;

  overflow-wrap: normal;
  word-break: keep-all;
  hyphens: none;

  line-height: 1.2;
`;

export const ResizerButton = styled.button`
  margin-left: auto;
  align-self: center;
  flex: 0 0 auto;
  width: 10px;
  height: 22px;
  cursor: col-resize;
  border: none;
  background: transparent;
  border-right: 2px solid rgba(255, 255, 255, 0.6);
  opacity: 0.85;
  padding: 0;

  &:hover {
    opacity: 1;
    border-right-color: #fff;
  }

  &:focus-visible {
    opacity: 1;
    border-right-color: #fff;
    outline: 2px solid rgba(255, 255, 255, 0.95);
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

export const FilterRowCell = styled.td`
  padding: 6px 8px;
  border-bottom: 1px solid #e5e7eb;
  text-align: ${(p) => (p.$numeric ? "right" : "left")};
  overflow: hidden;
  vertical-align: middle;
  box-sizing: border-box;
  min-width: 0;
`;

export const Tr = styled.tr`
  background: ${(p) => (p.$index % 2 === 0 ? "#f7f7fb" : "#ffffff")};
`;

export const Td = styled.td`
  padding: 6px 8px;
  border-bottom: 1px solid #e5e7eb;
  color: #0f172a;
  text-align: ${(p) => (p.$numeric ? "right" : "left")};
  font-variant-numeric: tabular-nums;
  min-width: 0;
  vertical-align: top;
  overflow: hidden;
`;

export const CellInner = styled.div`
  min-width: 0;

  /* Clamp body cells to 4 lines without breaking words. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;

  overflow: hidden;
  white-space: normal;

  overflow-wrap: normal;
  word-break: keep-all;
  hyphens: none;

  line-height: 1.25;
`;

export const FilterInputWrap = styled.div`
  position: relative;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

export const ClearBtn = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;

  &:focus-visible {
    outline: 2px solid #4c1d95;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

/**
 * Offscreen measurement host used for deterministic text sizing with DOM layout.
 * Kept out of flow and hidden to avoid reflow/paint impacts on the page.
 */
export const MeasureHost = styled.div`
  position: fixed;
  left: -10000px;
  top: 0;
  visibility: hidden;
  pointer-events: none;
  contain: layout style paint;
`;