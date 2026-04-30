import React, { useState, useRef } from "react";
import { formatNumber } from "utils";
import {
  ContinuousScaleContainer,
  GradientContainer,
  GradientBar,
  TickMark,
  Tooltip,
  LabelsContainer,
  TickLabel,
} from "./ContinuousGradientBar.styles";
import { LineWidthTrack, CircleTrack } from "./WidthTrack";

/**
 * ContinuousGradientBar
 *
 * Renders an interactive continuous gradient bar for sequential and diverging
 * legend data. The bar maps each colour stop to a horizontal position that is
 * either proportional to its numeric value (`scaleMode === 'value'`) or evenly
 * spaced across the bar (`scaleMode === 'color'`).
 *
 * Features:
 * - Hover tooltip showing the interpolated numeric value at the cursor position.
 * - Tick marks at every colour stop position.
 * - Smart collision-detection to suppress overlapping axis labels, always
 *   preserving the first, last, and (for diverging scales) zero labels.
 *
 * @param {Object} props
 * @param {Object} props.item - The legend item configuration object. Must contain
 *   `legendEntries` (array of `{ color, val, ... }`) and `legendEntriesNumeric`
 *   (sorted array of the corresponding numeric values). Also uses `item.style`
 *   to detect diverging scales.
 * @param {string} props.scaleMode - `'value'` positions stops proportionally to
 *   their numeric value; `'color'` spaces them evenly.
 * @returns {JSX.Element|null} The rendered gradient bar, or `null` when there is
 *   insufficient data to display.
 */
const ContinuousGradientBar = ({ item, scaleMode }) => {
  const [hoverInfo, setHoverInfo] = useState(null);
  const barRef = useRef(null);

  const entries = item.legendEntries;
  const numericEntries = item.legendEntriesNumeric;

  if (!entries || entries.length === 0 || !numericEntries || numericEntries.length < 2) {
    return null;
  }

  // Use Math.min/max over finite values so that ordering assumptions about
  // numericEntries cannot produce a collapsed or inverted range.
  const finiteVals = numericEntries.filter(Number.isFinite);
  if (finiteVals.length < 2) return null;
  const min = Math.min(...finiteVals);
  const max = Math.max(...finiteVals);
  const range = max - min;

  // Determine the maximum number of decimal places present across all stops.
  // Hover interpolation is then rounded to this precision rather than a fixed value,
  // so integer datasets display as integers and decimal datasets remain accurate.
  const maxPrecision = finiteVals.reduce((maxPrec, num) => {
    const str = num.toString();
    const decimalIndex = str.indexOf('.');
    return decimalIndex === -1 ? maxPrec : Math.max(maxPrec, str.length - decimalIndex - 1);
  }, 0);

  const stopsWithPercentages = entries.map((entry, i) => {
    const val = numericEntries[i];
    const percent = scaleMode === 'color' || !Number.isFinite(val)
      ? (i / (entries.length - 1)) * 100
      : (range === 0 ? 0 : ((val - min) / range) * 100);
    return { ...entry, val, percent, width: entry.width ?? null };
  });

  // Gate: only show a width track when width is data-driven (varies across stops).
  const finiteWidths = stopsWithPercentages
    .map(s => s.width)
    .filter(w => Number.isFinite(w) && w > 0);
  const widthVaries = finiteWidths.length >= 2 &&
    finiteWidths.some(w => w !== finiteWidths[0]);
  const layerType = entries[0]?.type;

  // Compute horizontal padding: at least 16 px (safe zone for slanted labels),
  // extended to cover the radius of the largest endpoint circle so its half does
  // not overflow the legend box at the 0 % and 100 % positions.
  let sidePad = 16;
  if (widthVaries && layerType === 'circle') {
    const firstW = stopsWithPercentages[0]?.width;
    const lastW = stopsWithPercentages[stopsWithPercentages.length - 1]?.width;
    const maxEndpointRadius = Math.max(
      Number.isFinite(firstW) && firstW > 0 ? firstW / 2 : 0,
      Number.isFinite(lastW) && lastW > 0 ? lastW / 2 : 0,
    );
    sidePad = Math.max(16, Math.ceil(maxEndpointRadius));
  }

  const gradientColors = stopsWithPercentages
    .map((stop) => `${stop.color} ${stop.percent}%`)
    .join(", ");
  const gradientString = `linear-gradient(to right, ${gradientColors})`;

  const handleMouseMove = (e) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const mousePercent = (x / rect.width) * 100;

    let hoveredValue = min;
    let hoveredWidth = null;
    for (let i = 0; i < stopsWithPercentages.length - 1; i++) {
      const curr = stopsWithPercentages[i];
      const next = stopsWithPercentages[i + 1];
      if (mousePercent >= curr.percent && mousePercent <= next.percent) {
        const segmentRange = next.percent - curr.percent;
        const localPercent = segmentRange === 0 ? 0 : (mousePercent - curr.percent) / segmentRange;
        hoveredValue = curr.val + localPercent * (next.val - curr.val);
        if (widthVaries && Number.isFinite(curr.width) && Number.isFinite(next.width)) {
          hoveredWidth = curr.width + localPercent * (next.width - curr.width);
        }
        break;
      }
    }
    setHoverInfo({
      x,
      value: formatNumber(parseFloat(hoveredValue.toFixed(maxPrecision))),
      width: hoveredWidth !== null ? formatNumber(parseFloat(hoveredWidth.toFixed(1))) : null,
    });
  };

  const handleMouseLeave = () => setHoverInfo(null);

  // --- Smart Collision Detection ---
  // Minimum % distance between adjacent axis labels before the inner one is suppressed.
  // Prevents labels from overlapping when stops are clustered close together.
  const MIN_DISTANCE_PERCENT = 12;
  const labelsToShow = [];
  
  const mustHaveIndices = new Set([0, stopsWithPercentages.length - 1]);
  if (item.style === "diverging") {
    const zeroIndex = stopsWithPercentages.findIndex(s => s.val === 0);
    if (zeroIndex !== -1) mustHaveIndices.add(zeroIndex);
  }

  labelsToShow.push({ ...stopsWithPercentages[0], index: 0 });
  let lastAddedPercent = stopsWithPercentages[0].percent;

  for (let i = 1; i < stopsWithPercentages.length - 1; i++) {
    const stop = stopsWithPercentages[i];
    const isMustHave = mustHaveIndices.has(i);
    const distFromLast = stop.percent - lastAddedPercent;
    const distFromEnd = 100 - stop.percent;

    if (isMustHave) {
      if (distFromLast < MIN_DISTANCE_PERCENT && !mustHaveIndices.has(labelsToShow[labelsToShow.length - 1].index)) {
        labelsToShow.pop();
      }
      labelsToShow.push({ ...stop, index: i });
      lastAddedPercent = stop.percent;
    } else if (distFromLast >= MIN_DISTANCE_PERCENT && distFromEnd >= MIN_DISTANCE_PERCENT) {
      labelsToShow.push({ ...stop, index: i });
      lastAddedPercent = stop.percent;
    }
  }
  
  if (labelsToShow[labelsToShow.length - 1].index !== stopsWithPercentages.length - 1) {
    labelsToShow.push({ ...stopsWithPercentages[stopsWithPercentages.length - 1], index: stopsWithPercentages.length - 1 });
  }

  return (
    <ContinuousScaleContainer $sidePad={sidePad}>
      {widthVaries && layerType === 'line' && (
        <LineWidthTrack stops={stopsWithPercentages} />
      )}
      {widthVaries && layerType === 'circle' && (
        <CircleTrack stops={stopsWithPercentages} />
      )}
      <GradientContainer>
        <GradientBar
          ref={barRef}
          $gradient={gradientString}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Render tick marks at every stop, including the start (0 %) and end (100 %) */}
          {stopsWithPercentages.map((stop, i) => (
            <TickMark key={`tick-${i}`} style={{ left: `${stop.percent}%` }} />
          ))}
        </GradientBar>
        {hoverInfo && (
          <Tooltip $left={hoverInfo.x}>
            {hoverInfo.value}
            {hoverInfo.width !== null && (
              <span style={{ opacity: 0.75, marginLeft: '4px', fontSize: '10px' }}>
                ({hoverInfo.width}px)
              </span>
            )}
          </Tooltip>
        )}
      </GradientContainer>
      
      <LabelsContainer>
        {/* Loop over the FILTERED list to only render non-overlapping text labels.
             Each label is anchored by its LEFT edge at the tick (left: percent%),
             then shifted left by its own width so the RIGHT edge lands on the tick. */}
        {labelsToShow.map((stop) => (
          <TickLabel 
            key={`label-${stop.index}`} 
            style={{ left: `${stop.percent}%` }}
          >
            {formatNumber(stop.val)}
          </TickLabel>
        ))}
      </LabelsContainer>
    </ContinuousScaleContainer>
  );
};

export default ContinuousGradientBar;
