import React, { useState, useRef } from "react";
import { formatNumber } from "utils";
import { formatLegendNumber, decorateLegendLabel } from "./DynamicLegend.utils";
import {
  ContinuousScaleContainer,
  GradientContainer,
  GradientBar,
  TickMark,
  Tooltip,
  LabelsContainer,
  TickLabel,
  AnnotationRow,
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
 * - Descending value support: when `invertedColorScheme` is active the colour
 *   stops arrive in descending value order (highest first). The bar detects this
 *   and flips the position formula so the CSS gradient remains valid and labels
 *   appear at their correct visual positions.
 * - Optional annotation row (`item.legendAnnotations`) rendered below the axis
 *   showing scale-direction text at the left (`start`) and right (`end`) edges.
 *
 * @param {Object} props
 * @param {Object} props.item - The legend item produced by `DynamicLegend`.
 *   - `legendEntries`        {Array}  colour/width entries for each stop.
 *   - `legendEntriesNumeric` {Array}  numeric value for each entry.
 *   - `style`                {string} `'diverging'` enables the zero-tick guarantee.
 *   - `legendNumberFormat`   {LegendNumberFormat} optional precision / prefix / suffix override.
 *   - `legendAnnotations`    {Object} optional `{ start: string, end: string }` — text
 *     shown left-aligned (`start`) and right-aligned (`end`) below the axis. These are
 *     visual-position labels: `start` is always the left edge, `end` always the right,
 *     regardless of whether the colour scheme is inverted.
 * @param {string} props.scaleMode - `'value'` positions stops proportionally to
 *   their numeric value; `'color'` spaces them evenly.
 * @returns {JSX.Element|null} The rendered gradient bar, or `null` when there is
 *   insufficient data to display.
 */
const ContinuousGradientBar = ({ item, scaleMode, belowMin = false, aboveMax = false }) => {
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

  // Detect whether the stops are ordered from highest to lowest value.
  // This happens when `invertedColorScheme: true` is set on the layer, which
  // reverses the colourStops array in DynamicLegend so that the highest data
  // value maps to the darkest colour. Without correction the CSS gradient string
  // would have stops in descending percentage order, which browsers clamp to
  // produce a flat, single-colour bar.
  const isDescending = finiteVals[0] > finiteVals[finiteVals.length - 1];

  // Formats a numeric value for axis tick labels and hover tooltips.
  // Delegates to formatLegendNumber — the single extension point for all
  // label formatting. maxPrecision (auto-detected from the data) is passed
  // as the fallback so the hover tooltip stays consistent with tick labels
  // when no explicit legendNumberFormat.decimals override is configured.
  const formatAxisValue = (val) => formatLegendNumber(val, item.legendNumberFormat ?? {});

  const stopsWithPercentages = entries.map((entry, i) => {
    const val = numericEntries[i];
    let percent;
    if (scaleMode === 'color' || !Number.isFinite(val)) {
      // Even spacing: ignore numeric values and distribute stops uniformly.
      percent = (i / (entries.length - 1)) * 100;
    } else if (range === 0) {
      percent = 0;
    } else if (isDescending) {
      // Inverted scheme: values run high → low across the stops array.
      // Flip the formula so the HIGHEST value sits at 0 % (left) and the
      // LOWEST at 100 % (right), keeping CSS gradient stops in ascending order.
      percent = ((max - val) / range) * 100;
    } else {
      // Standard ascending scheme.
      percent = ((val - min) / range) * 100;
    }
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

  // --- Dynamic side padding for first label ---
  // Ensure the first label doesn't overflow the left edge when rotated.
  // We use the same trigonometry (sin 45) as the height calculation below.
  const isFirstLabelLong = (belowMin || (isDescending && aboveMax));
  const firstBaseLabel = formatAxisValue(stopsWithPercentages[0].val);
  const firstLabelText = isFirstLabelLong ? `\u2264${firstBaseLabel}` : firstBaseLabel;
  const requiredLeftPad = Math.ceil(firstLabelText.length * 2.3 + 2); // 2.3 px per char at 45 degrees, +2 px for padding
  
  sidePad = Math.max(sidePad, requiredLeftPad);

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
      value: formatAxisValue(hoveredValue),
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
  // --- Dynamic Label Height Calculation ---
  // Find the longest string length among the labels we are about to render
  const maxLabelLength = Math.max(
    ...labelsToShow.map((stop) => {
      const baseLabel = formatAxisValue(stop.val);
      return baseLabel.length + 1; // +1 to account for potential '+' or '≤' symbols
    })
  );
  
  // Font size is 11px (approx 6.5px width per char). Rotated at 45 degrees (sin 45 ≈ 0.707).
  // Vertical height = (charCount * 6.5 * 0.707) + (11 * 0.707) ≈ (charCount * 4.6) + 8
  const dynamicLabelHeight = Math.max(22, Math.ceil(maxLabelLength * 4.6));

  return (
    <ContinuousScaleContainer $sidePad={sidePad}>
      {item.legendAnnotations?.start || item.legendAnnotations?.end ? (
        <AnnotationRow>
          <span>{item.legendAnnotations.start ?? ''}</span>
          <span>{item.legendAnnotations.end ?? ''}</span>
        </AnnotationRow>
      ) : null}
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
      
      <LabelsContainer $height={dynamicLabelHeight}>
        {labelsToShow.map((stop) => {
          const isFirstStop = stop.index === 0;
          const isLastStop = stop.index === stopsWithPercentages.length - 1;
          const baseLabel = formatAxisValue(stop.val);
          
          const tickLabel = decorateLegendLabel({
            label: baseLabel,
            isFirst: isFirstStop,
            isLast: isLastStop,
            belowMin,
            aboveMax,
            isDescending,
            hasCustomLabels: item.hasCustomLabels
          });

          return (
            <TickLabel
              key={`label-${stop.index}`}
              style={{ left: `${stop.percent}%` }}
            >
              {tickLabel}
            </TickLabel>
          );
        })}
      </LabelsContainer>
    </ContinuousScaleContainer>
  );
};

export default ContinuousGradientBar;
