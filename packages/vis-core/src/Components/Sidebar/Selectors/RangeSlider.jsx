
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 0.5rem;
  font-family: var(--font-family-base, inherit);
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const HistogramContainer = styled.div`
  position: relative;
  padding-left: 48px;
  padding-bottom: 30px;
`;

const PlotArea = styled.div`
  position: relative;
  height: 82px;
  border: 1px solid var(--palette-grey, #94a3b8);
  border-radius: 4px;
  background: var(--palette-white, #fff);
  touch-action: none;
  user-select: none;
`;

const HistogramGrid = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(
    ${({ $count }) => $count},
    minmax(0, 1fr)
  );
  gap: 1px;
  align-items: end;
  pointer-events: none;
  overflow: hidden;
`;

const HistogramBar = styled.div`
  height: ${({ $height }) => $height}%;
  background: rgba(13, 15, 61, 0.7);
`;

const VerticalGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to right,
    transparent,
    transparent
      calc(100% / ${({ $count }) => $count} - 1px),
    #d1d5db
      calc(100% / ${({ $count }) => $count} - 1px),
    #d1d5db
      calc(100% / ${({ $count }) => $count})
  );
  pointer-events: none;
`;

const Selection = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $left }) => $left}%;
  width: ${({ $width }) => $width}%;
  background: rgba(0, 222, 198, 0.25);
  border-left: 1px solid #00b7a8;
  border-right: 1px solid #00b7a8;
  box-sizing: border-box;
  cursor: grab;
  touch-action: none;
  z-index: 2;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    background: rgba(0, 222, 198, 0.34);
  }
`;

const Handle = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ $left }) => $left}%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 36px;
  box-sizing: border-box;
  border: 1px solid #94a3b8;
  border-radius: 6px;
  background: linear-gradient(
    180deg,
    #fff 0%,
    #e9eef4 100%
  );
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
  cursor: ew-resize;
  touch-action: none;
  z-index: ${({ $active }) => ($active ? 5 : 4)};
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    width: 5px;
    height: 15px;
    border-left: 1px solid #64748b;
    border-right: 1px solid #64748b;
  }

  &:hover {
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(0, 222, 198, 0.18);
  }

  &:focus-visible {
    outline: 3px solid #0d9488;
    outline-offset: 3px;
  }
`;

const AxisCaptionRow = styled.div`
  position: absolute;
  left: 0;
  top: 31px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const AxisCaption = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--palette-navy, #0d0f3d);
`;

const AxisHint = styled.span`
  width: 13px;
  height: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 9px;
  cursor: help;
`;

const LeftScaleLabel = styled.span`
  position: absolute;
  left: 0;
  width: 34px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: var(--palette-navy, #0d0f3d);
`;

const ValueLabel = styled.span`
  position: absolute;
  bottom: -25px;
  left: ${({ $left }) => $left}%;
  transform: translateX(
    ${({ $align }) =>
      $align === "left"
        ? "0%"
        : $align === "right"
          ? "-100%"
          : "-50%"}
  );
  font-size: 12px;
  font-weight: 600;
  color: var(--palette-navy, #0d0f3d);
  white-space: nowrap;
`;

const SimpleTrack = styled.div`
  position: relative;
  height: 8px;
  margin-top: 18px;
  border-radius: 999px;
  background: #e2e8f0;
  touch-action: none;
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 22px;
  font-size: 12px;
  color: var(--palette-navy, #0d0f3d);
`;

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return "0";
  return Number(value.toFixed(2)).toString();
};

export const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
  ariaLabel = "Value range filter",
  histogramBins = null,
}) => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 100;

  const range = Math.max(safeMax - safeMin, Number.EPSILON);

  const [rawMin, rawMax] = Array.isArray(value)
    ? value
    : [safeMin, safeMax];

  const currentMin = clamp(rawMin, safeMin, safeMax);
  const currentMax = clamp(rawMax, currentMin, safeMax);

  const trackRef = useRef(null);
  const dragRef = useRef(null);

  const [activeHandle, setActiveHandle] = useState(null);

  const toPercent = useCallback(
    (number) => ((number - safeMin) / range) * 100,
    [safeMin, range]
  );

  const leftPercent = toPercent(currentMin);
  const rightPercent = toPercent(currentMax);
  const selectionWidth = rightPercent - leftPercent;

  const renderedBins = useMemo(() => {
    if (!Array.isArray(histogramBins) || !histogramBins.length) {
      return [];
    }

    const maxBin = Math.max(
      0,
      ...histogramBins.map((n) => Number(n) || 0)
    );

    return histogramBins.map((n) =>
      maxBin > 0
        ? clamp(((Number(n) || 0) / maxBin) * 100, 0, 100)
        : 0
    );
  }, [histogramBins]);

  const maxBinCount = useMemo(
    () =>
      Array.isArray(histogramBins)
        ? Math.max(0, ...histogramBins.map((n) => Number(n) || 0))
        : 0,
    [histogramBins]
  );

  const snapToStep = useCallback(
    (number) => {
      const numericStep = Number(step);

      if (!Number.isFinite(numericStep) || numericStep <= 0) {
        return clamp(number, safeMin, safeMax);
      }

      const snapped =
        safeMin +
        Math.round((number - safeMin) / numericStep) *
          numericStep;

      return Number(
        clamp(snapped, safeMin, safeMax).toFixed(10)
      );
    },
    [safeMin, safeMax, step]
  );

  const emitChange = useCallback(
    (nextMin, nextMax) => {
      if (typeof onChange !== "function") return;

      const minimum = clamp(nextMin, safeMin, safeMax);
      const maximum = clamp(nextMax, minimum, safeMax);

      onChange([minimum, maximum]);
    },
    [onChange, safeMin, safeMax]
  );

  const startDrag = useCallback(
    (event, mode) => {
      if (disabled || !trackRef.current) return;

      event.preventDefault();
      event.stopPropagation();

      dragRef.current = {
        mode,
        startX: event.clientX,
        startMin: currentMin,
        startMax: currentMax,
      };

      setActiveHandle(mode);

      // Capture pointer movement even outside the plot.
      trackRef.current.setPointerCapture(event.pointerId);
    },
    [disabled, currentMin, currentMax]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (!dragRef.current || !trackRef.current) return;

      const rect = trackRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 1);

      const {
        mode,
        startX,
        startMin,
        startMax,
      } = dragRef.current;

      const deltaX = event.clientX - startX;
      const deltaValue = (deltaX / width) * range;

      if (mode === "min") {
        const nextMin = clamp(
          snapToStep(startMin + deltaValue),
          safeMin,
          currentMax
        );

        emitChange(nextMin, currentMax);
      }

      if (mode === "max") {
        const nextMax = clamp(
          snapToStep(startMax + deltaValue),
          currentMin,
          safeMax
        );

        emitChange(currentMin, nextMax);
      }

      if (mode === "range") {
        const selectedWidth = startMax - startMin;

        const nextMin = clamp(
          snapToStep(startMin + deltaValue),
          safeMin,
          safeMax - selectedWidth
        );

        const nextMax = nextMin + selectedWidth;

        emitChange(nextMin, nextMax);
      }
    },
    [
      range,
      safeMin,
      safeMax,
      currentMin,
      currentMax,
      snapToStep,
      emitChange,
    ]
  );

  const stopDrag = useCallback(() => {
    dragRef.current = null;
    setActiveHandle(null);
  }, []);

  const handleKeyboard = useCallback(
    (event, mode) => {
      if (disabled) return;

      const increment =
        event.key === "PageUp"
          ? 10
          : event.key === "PageDown"
            ? -10
            : event.key === "ArrowRight" ||
                event.key === "ArrowUp"
              ? 1
              : event.key === "ArrowLeft" ||
                  event.key === "ArrowDown"
                ? -1
                : null;

      if (increment === null &&
          event.key !== "Home" &&
          event.key !== "End") {
        return;
      }

      event.preventDefault();

      const stepSize =
        Number.isFinite(Number(step)) && Number(step) > 0
          ? Number(step)
          : 1;

      const current = mode === "min" ? currentMin : currentMax;

      const next =
        event.key === "Home"
          ? safeMin
          : event.key === "End"
            ? safeMax
            : snapToStep(current + increment * stepSize);

      if (mode === "min") {
        emitChange(clamp(next, safeMin, currentMax), currentMax);
      } else {
        emitChange(currentMin, clamp(next, currentMin, safeMax));
      }
    },
    [
      disabled,
      step,
      currentMin,
      currentMax,
      safeMin,
      safeMax,
      snapToStep,
      emitChange,
    ]
  );

  const renderHandles = () => (
    <>
      <Handle
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${ariaLabel} minimum`}
        aria-valuemin={safeMin}
        aria-valuemax={currentMax}
        aria-valuenow={currentMin}
        aria-disabled={disabled}
        $left={leftPercent}
        $active={activeHandle === "min"}
        onPointerDown={(e) => startDrag(e, "min")}
        onKeyDown={(e) => handleKeyboard(e, "min")}
      />

      <Handle
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={`${ariaLabel} maximum`}
        aria-valuemin={currentMin}
        aria-valuemax={safeMax}
        aria-valuenow={currentMax}
        aria-disabled={disabled}
        $left={rightPercent}
        $active={activeHandle === "max"}
        onPointerDown={(e) => startDrag(e, "max")}
        onKeyDown={(e) => handleKeyboard(e, "max")}
      />
    </>
  );

  return (
    <Container $disabled={disabled}>
      {renderedBins.length > 0 ? (
        <HistogramContainer>
          <AxisCaptionRow>
            <AxisCaption>Bins</AxisCaption>
            <AxisHint
              title="Number of records in each value bucket"
              aria-label="Histogram bin information"
            >
              i
            </AxisHint>
          </AxisCaptionRow>

          <LeftScaleLabel style={{ top: 0 }}>
            {formatNumber(maxBinCount)}
          </LeftScaleLabel>

          <LeftScaleLabel style={{ top: 70 }}>
            0
          </LeftScaleLabel>

          <PlotArea
            ref={trackRef}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          >
            <HistogramGrid $count={renderedBins.length}>
              {renderedBins.map((height, index) => (
                <HistogramBar
                  key={index}
                  $height={height}
                  data-testid="histogram-bar"
                />
              ))}
            </HistogramGrid>

            <VerticalGrid $count={renderedBins.length} />

            <Selection
              $left={leftPercent}
              $width={selectionWidth}
              onPointerDown={(e) => startDrag(e, "range")}
              title="Drag to move selected range"
            />

            {renderHandles()}

            <ValueLabel
              $left={leftPercent}
              $align={
                leftPercent < 5 ? "left" : "center"
              }
            >
              {formatNumber(currentMin)}
            </ValueLabel>

            <ValueLabel
              $left={rightPercent}
              $align={
                rightPercent > 95 ? "right" : "center"
              }
            >
              {formatNumber(currentMax)}
            </ValueLabel>
          </PlotArea>
        </HistogramContainer>
      ) : (
        <>
          <SimpleTrack
            ref={trackRef}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
          >
            <Selection
              $left={leftPercent}
              $width={selectionWidth}
              onPointerDown={(e) => startDrag(e, "range")}
            />

            {renderHandles()}
          </SimpleTrack>

          <ValueRow>
            <span>{formatNumber(currentMin)}</span>
            <span>{formatNumber(currentMax)}</span>
          </ValueRow>
        </>
      )}
    </Container>
  );
};
