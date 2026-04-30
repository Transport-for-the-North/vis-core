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
    return { ...entry, val, percent };
  });

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
    for (let i = 0; i < stopsWithPercentages.length - 1; i++) {
      const curr = stopsWithPercentages[i];
      const next = stopsWithPercentages[i + 1];
      if (mousePercent >= curr.percent && mousePercent <= next.percent) {
        const segmentRange = next.percent - curr.percent;
        const localPercent = segmentRange === 0 ? 0 : (mousePercent - curr.percent) / segmentRange;
        hoveredValue = curr.val + localPercent * (next.val - curr.val);
        break;
      }
    }
    setHoverInfo({ x, value: formatNumber(parseFloat(hoveredValue.toFixed(maxPrecision))) });
  };

  const handleMouseLeave = () => setHoverInfo(null);

  // --- Smart Collision Detection ---
  const MIN_DISTANCE_PERCENT = 12; // Increased distance for a cleaner look
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
    <ContinuousScaleContainer>
      <GradientContainer>
        <GradientBar
          ref={barRef}
          $gradient={gradientString}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Loop over ALL stops to render every tick mark */}
          {stopsWithPercentages.map((stop, i) => (
            stop.percent > 0 && stop.percent < 100 && (
              <TickMark key={`tick-${i}`} style={{ left: `${stop.percent}%` }} />
            )
          ))}
        </GradientBar>
        {hoverInfo && <Tooltip $left={hoverInfo.x}>{hoverInfo.value}</Tooltip>}
      </GradientContainer>
      
      <LabelsContainer>
        {/* Loop over the FILTERED list to only render non-overlapping text labels */}
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
