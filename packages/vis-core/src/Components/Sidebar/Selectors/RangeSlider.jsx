import React, { useMemo } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-top: 0.5rem;
`;

const SliderRow = styled.div`
  position: relative;
  height: 28px;
`;

const Track = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 6px;
  border-radius: 999px;
  background: #efeff7;
  transform: translateY(-50%);
`;

const ActiveTrack = styled.div`
  position: absolute;
  top: 50%;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, #00dec6 0%, #0d0f3d 100%);
  transform: translateY(-50%);
  left: ${(props) => props.$left}%;
  right: ${(props) => props.$right}%;
`;

const Handle = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  margin: 0;
  pointer-events: none;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    pointer-events: auto;
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #0d0f3d;
    background: #ffffff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    pointer-events: auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #0d0f3d;
    background: #ffffff;
    cursor: pointer;
  }

  &::-webkit-slider-runnable-track {
    background: transparent;
    height: 6px;
  }

  &::-moz-range-track {
    background: transparent;
    height: 6px;
  }
`;

const ValueRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.35rem;
  font-size: 0.85rem;
  color: var(--text-icon, #364153);
`;

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 100 || Number.isInteger(value)) return `${Math.round(value)}`;
  return `${value.toFixed(1)}`;
};

export const RangeSlider = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  disabled = false,
  ariaLabel = "Value range filter",
}) => {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : 100;
  const [currentMin, currentMax] = Array.isArray(value) ? value : [safeMin, safeMax];
  const range = Math.max(safeMax - safeMin, Number.EPSILON);

  const leftPercent = useMemo(
    () => ((currentMin - safeMin) / range) * 100,
    [currentMin, safeMin, range]
  );

  const rightPercent = useMemo(
    () => 100 - ((currentMax - safeMin) / range) * 100,
    [currentMax, safeMin, range]
  );

  const emitChange = (nextMin, nextMax) => {
    if (typeof onChange !== "function") return;
    const clampedMin = Math.max(safeMin, Math.min(nextMin, safeMax));
    const clampedMax = Math.max(safeMin, Math.min(nextMax, safeMax));
    onChange([Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)]);
  };

  const handleMinChange = (e) => {
    const nextMin = Number(e.target.value);
    emitChange(nextMin, currentMax);
  };

  const handleMaxChange = (e) => {
    const nextMax = Number(e.target.value);
    emitChange(currentMin, nextMax);
  };

  return (
    <Container
      style={{
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      <SliderRow>
        <Track />
        <ActiveTrack $left={leftPercent} $right={rightPercent} />
        <Handle
          type="range"
          min={safeMin}
          max={safeMax}
          step={step}
          value={Math.min(currentMin, currentMax)}
          onChange={handleMinChange}
          aria-label={`${ariaLabel} minimum`}
          disabled={disabled}
        />
        <Handle
          type="range"
          min={safeMin}
          max={safeMax}
          step={step}
          value={Math.max(currentMin, currentMax)}
          onChange={handleMaxChange}
          aria-label={`${ariaLabel} maximum`}
          disabled={disabled}
        />
      </SliderRow>
      <ValueRow>
        <span>{formatNumber(currentMin)}</span>
        <span>{formatNumber(currentMax)}</span>
      </ValueRow>
    </Container>
  );
};
