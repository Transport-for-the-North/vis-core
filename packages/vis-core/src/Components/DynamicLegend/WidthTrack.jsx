import React, { useId } from "react";
import { WidthTrackSvg } from "./ContinuousGradientBar.styles";

// Vertical padding (px) added above and below track content to prevent clipping.
const TRACK_PAD = 2;

/**
 * LineWidthTrack
 *
 * Renders a filled SVG polygon whose top edge traces the interpolated line width at each
 * colour stop. The polygon fill is a `<linearGradient>` that mirrors the colour stops of
 * the gradient bar, so both colour and thickness are encoded in a single visual object.
 *
 * Only rendered when width actually varies across the stops.
 *
 * @param {Object} props
 * @param {Array}  props.stops - `stopsWithPercentages` from `ContinuousGradientBar`:
 *   each element has `{ color, width, percent }`.
 */
export const LineWidthTrack = ({ stops }) => {
  const gradId = useId();

  const rawWidths = stops.map(s => (Number.isFinite(s.width) && s.width > 0 ? s.width : 1));
  const maxWidth = Math.max(...rawWidths);
  const totalHeight = maxWidth + TRACK_PAD;
  const bottomY = totalHeight - TRACK_PAD / 2;

  // Build a closed polygon: top edge traces the width profile, bottom edge is flat.
  // Points run left-to-right along the top, then right-to-left along the bottom.
  const topPoints = stops.map((s, i) => `${s.percent},${bottomY - rawWidths[i]}`);
  const bottomPoints = [...stops].reverse().map(s => `${s.percent},${bottomY}`);
  const points = [...topPoints, ...bottomPoints].join(" ");

  return (
    <WidthTrackSvg
      viewBox={`0 0 100 ${totalHeight}`}
      preserveAspectRatio="none"
      height={totalHeight}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          {stops.map((s, i) => (
            <stop key={i} offset={`${s.percent}%`} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <polygon
        points={points}
        fill={`url(#${gradId})`}
        stroke="none"
        opacity="0.85"
      />
    </WidthTrackSvg>
  );
};

/**
 * CircleTrack
 *
 * Renders a row of CSS circles (div + border-radius), one per colour stop, positioned
 * horizontally by each stop's `percent` and sized by its `width` (circle diameter in px).
 * Each circle is filled with its stop's colour.
 *
 * CSS divs are used rather than SVG `<circle>` elements because SVG's non-uniform viewBox
 * scaling (needed to stretch stops across the bar width) distorts circles into ellipses.
 *
 * Only rendered when width actually varies across the stops.
 *
 * @param {Object} props
 * @param {Array}  props.stops - `stopsWithPercentages` from `ContinuousGradientBar`:
 *   each element has `{ color, width, percent }`.
 */
export const CircleTrack = ({ stops }) => {
  const diameters = stops.map(s => (Number.isFinite(s.width) && s.width > 0 ? s.width : 2));
  const maxDiameter = Math.max(...diameters);

  // Inset the container's content area by each endpoint circle's radius so that
  // left: 0% and left: 100% resolve to positions where the circle sits fully inside
  // the box. box-sizing: border-box keeps the outer width at 100%.
  const leftPad = diameters[0] / 2;
  const rightPad = diameters[diameters.length - 1] / 2;

  // The container must be tall enough to hold the largest circle without clipping.
  // Use actual pixel diameters — no scaling — so circles match their on-map sizes.
  const trackHeight = maxDiameter + TRACK_PAD * 2;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: `${trackHeight}px`,
      marginBottom: '2px',
      paddingLeft: `${leftPad}px`,
      paddingRight: `${rightPad}px`,
      boxSizing: 'border-box',
    }}>
      {stops.map((s, i) => {
        const d = diameters[i];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${s.percent}%`,
              bottom: `${TRACK_PAD}px`,
              transform: 'translateX(-50%)',
              width: `${d}px`,
              height: `${d}px`,
              borderRadius: '50%',
              background: s.color,
              border: '1px solid rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
          />
        );
      })}
    </div>
  );
};
