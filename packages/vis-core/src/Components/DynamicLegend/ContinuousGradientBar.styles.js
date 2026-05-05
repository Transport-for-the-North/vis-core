import styled from "styled-components";

/**
 * Outer wrapper for the continuous gradient bar section of a legend group.
 *
 * @prop {number} [$sidePad] - Horizontal padding in px. Defaults to 16 (safe zone
 *   for slanted tick labels). Expanded dynamically when endpoint circles are wider
 *   than 16 px so their halves do not overflow the legend box.
 */
export const ContinuousScaleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${(p) => p.$sidePad ?? 16}px;
  box-sizing: border-box;
  margin-bottom: 12px;
`;

/** Relative-positioned wrapper around the gradient bar, used to anchor tick marks and the hover tooltip. */
export const GradientContainer = styled.div`
  position: relative;
  width: 100%;
`;

/**
 * The coloured gradient bar itself. Background is set via the `$gradient` prop.
 *
 * @prop {string} $gradient - A CSS `linear-gradient(...)` string.
 */
export const GradientBar = styled.div`
  height: 16px; /* Thicker, more prominent bar */
  width: 100%;
  border-radius: 4px;
  background: ${(props) => props.$gradient};
  border: 1px solid #bbb;
  cursor: crosshair;
`;

/**
 * Thin vertical tick mark overlaid on the gradient bar at a given position.
 * A small notch extends below the bar to point at the corresponding label.
 */
export const TickMark = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 1px;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  pointer-events: none;
  
  /* Tiny notch extending below the bar to point at the label */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 1px;
    height: 4px;
    background-color: #888;
  }
`;

/** Relative-positioned strip beneath the gradient bar that holds tick labels. */
export const LabelsContainer = styled.div`
  position: relative;
  height: 22px;
  width: 100%;
`;

/** Individually positioned, rotated label beneath a tick mark on the gradient bar. */
export const TickLabel = styled.span`
  position: absolute;
  font-size: 11px;
  color: #555;
  top: 0;
  white-space: nowrap;
  text-align: right;
  /* Anchor: left edge at the tick (via left: percent% in JSX).
     translateX(-100%) shifts the element left by its own width so the RIGHT
     edge lands on the tick, then rotate(-45deg) pivots around that top-right
     corner, sweeping the text downward-left away from the gradient bar. */
  transform-origin: top right;
  transform: translateX(-100%) rotate(-45deg);
`;

/**
 * A row rendered ABOVE the gradient bar showing scale-direction annotations
 * (e.g. "Lowest Risk" on the left, "Highest Risk" on the right). Placing it
 * above means the labels frame the scale before the user reads the numeric axis,
 * and the tick labels below have clear space without collision.
 */
export const AnnotationRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 10px;
  color: #666;
  font-style: italic;
`;

/**
 * SVG element used to render the line-width or circle-size track above the gradient bar.
 * Height is set via the `height` HTML attribute to accommodate the widest stop.
 */
export const WidthTrackSvg = styled.svg`
  display: block;
  width: 100%;
  overflow: visible;
  margin-bottom: 2px;
`;

/**
 * Mouse-hover tooltip shown above the gradient bar indicating the hovered value.
 *
 * @prop {number} $left - Horizontal position in pixels from the left edge of the bar.
 */
export const Tooltip = styled.div`
  position: absolute;
  top: -28px;
  left: ${(props) => props.$left}px;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 20;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -4px;
    border-width: 4px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;
