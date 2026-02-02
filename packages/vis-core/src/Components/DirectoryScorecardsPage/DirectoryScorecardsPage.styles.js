import styled from "styled-components";

/**
 * Page-level layout wrapper.
 */
export const Page = styled.div`
  padding: 0.5rem 3vw;
  box-sizing: border-box;
  max-width: 100%;
`;

/**
 * Page title.
 */
export const Title = styled.h2`
  margin: 0 0 0.5rem;
  text-align: left;
`;

/**
 * Two-pane responsive layout:
 * - Mobile: 1 column
 * - Desktop: 42% / 58%
 */
export const TwoPane = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;

  @media ${(p) => p.theme.mq.desktopUp} {
    grid-template-columns: minmax(0, 42%) minmax(0, 58%);
  }
`;

/**
 * Base tile surface.
 */
export const Tile = styled.section`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: ${(p) => p.theme.borderRadius};
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05), 0 2px 5px rgba(0, 0, 0, 0.03);
`;

/**
 * Tile inner padding wrapper. `min-width: 0` prevents max-content overflow.
 */
export const TileBody = styled.div`
  padding: 10px;
  min-width: 0;
`;

/**
 * Left pane contains the table. `overflow: hidden` keeps horizontal scroll inside the table.
 */
export const LeftPane = styled(Tile)`
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  position: static;
`;

/**
 * Right pane contains scorecards.
 */
export const RightPane = styled(Tile)`
  max-width: 100%;
  overflow: hidden;
`;

/**
 * Controls row above the table.
 */
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
`;

/**
 * Small status chip.
 */
export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  border: 1px solid #94a3b8;
  background: #e2e8f0;
  color: #0f172a;
`;

/**
 * Responsive grid for selected record scorecards.
 */
export const DetailsGrid = styled.div`
  padding: 8px 10px 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;
  align-items: stretch;
  overflow: hidden;
`;