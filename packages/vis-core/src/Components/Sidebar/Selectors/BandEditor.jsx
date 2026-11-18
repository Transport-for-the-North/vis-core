import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SelectorLabel } from "./SelectorLabel";
import { AppButton } from "Components/AppButton";
import { defaultBgColour } from "defaults";
import { fitBandsToCount } from "utils/map";

const BandEditorContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const BandHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const BandMetaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 10px;
  margin-top: 8px;
`;

const BandActionRow = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const BandActionLeft = styled.div`
  flex: 2;
`;

const BandActionRight = styled.div`
  flex: 1;
`;

const ResetButton = styled(AppButton)`
  background-color: transparent;
  color: ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? defaultBgColour};
  border: 1px solid ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? defaultBgColour};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? defaultBgColour};
    color: white;
  }

  &:disabled {
    opacity: 1;
    background-color: transparent;
    color: #666;
    border-color: #d1d1e0;
  }
`;

const BandCountSelect = styled.select`
  font-family: var(--font-sans);
  font-size: 0.9em;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #d1d1e0;
  background: #fff;
  cursor: pointer;
`;

const BandInputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
`;

const BandInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const BandInputLabel = styled.label`
  font-family: var(--font-sans);
  font-size: 0.85rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
`;

const BandInput = styled.input`
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  border: ${props => props.$hasError ? '2px solid #d32f2f' : '1px solid #d1d1e0'};
  background: #fff;
  text-align: right;
  font-family: var(--font-sans);
  font-size: 0.9rem;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#d32f2f' : defaultBgColour};
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.8rem;
  font-family: var(--font-sans);
  margin-bottom: 8px;
  padding: 6px 8px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 3px solid #d32f2f;
`;

const BandCountLabel = styled.span`
  font-family: var(--font-sans);
  font-size: 1rem;
  color: ${({ theme }) => theme?.colors?.text || "var(--text-icon)"};
  font-weight: 500;
`;

const BandCountHint = styled.div`
  font-family: var(--font-sans);
  font-size: 0.8rem;
  color: #666;
`;

/**
 * BandEditor component allows users to customize classification band values for map layers.
 * Provides an interface to edit the number of bands and their individual threshold values.
 * Only shown for continuous and diverging color schemes.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number[]} props.bands - Array of current band threshold values.
 * @param {Function} props.onChange - Callback function invoked when user updates band values.
 * @param {boolean} props.isDiverging - Whether the color scheme is diverging (affects min band count).
 * @param {boolean} [props.isSymmetric] - Whether editing a band mirrors the change onto the opposite band.
 * @param {boolean} [props.isCustom] - Whether the current classification method is custom.
 * @param {Function} [props.onBandCountChange] - Count-change callback; null restores natural count.
 * @param {boolean} [props.hasBandCount] - Whether a band count is chosen.
 * @param {Function} [props.previewBandsForCount] - Count → bands the method will produce, or null.
 * @param {number} [props.maxBandCount] - Most bands the method can give; higher counts are disabled.
 * @param {number} [props.naturalBandCount] - The method's count with none chosen; always offered.
 * @param {number[]} [props.data] - Optional: raw data array for quantile binning.
 * @returns {JSX.Element} The rendered BandEditor component.
 *
 * @example
 * <BandEditor
 *   bands={[0, 10, 20, 30, 40]}
 *   onChange={(newBands) => handleBandChange(newBands)}
 *   isDiverging={false}
 *   data={[1,2,3,4,5,6,7,8,9,10]}
 * />
 */
export const BandEditor = ({
  bands,
  onChange,
  isDiverging,
  isSymmetric = false,
  isCustom = false,
  onReset = null,
  onBandCountChange = null,
  hasBandCount = false,
  previewBandsForCount = null,
  maxBandCount = null,
  naturalBandCount = null,
  showLabel = true,
  ..._unusedProps
}) => {
  void _unusedProps;
  const [localBands, setLocalBands] = useState(bands);
  const [hasChanges, setHasChanges] = useState(false);
  // Whether a band value was typed since sync.
  const [valuesEdited, setValuesEdited] = useState(false);
  const [pendingCount, setPendingCount] = useState(null);
  const [hasRealPreview, setHasRealPreview] = useState(false);

  /**
   * Synchronize local band state with incoming bands prop.
   * Resets changes flag when parent updates the bands.
   */
  useEffect(() => {
    setLocalBands(bands);
    setHasChanges(false);
    setValuesEdited(false);
    setPendingCount(null);
    setHasRealPreview(false);
  }, [bands]);

  /**
   * Validates band values to ensure they are in ascending order.
   * Each band value must be strictly greater than the previous one.
   *
   * @returns {Object} Validation result containing:
   *   - valid: {boolean} Whether the bands are valid
   *   - error: {string|null} Error message if validation fails
   *   - errorIndex: {number|null} Index of the problematic band
   */
  const validateBands = () => {
    const numericBands = localBands.filter(v => v !== "" && !isNaN(v)).map(Number);
    
    if (numericBands.length < localBands.length) {
      return { valid: false, error: "All band values must be valid numbers" };
    }

    // Bands are treated as *lower bounds* for each class.
    // That means each band's lower bound must be strictly less than the next band's lower bound.
    // If band i is >= band i+1, then band i is the one that must be adjusted.
    for (let i = 0; i < numericBands.length - 1; i++) {
      if (numericBands[i] >= numericBands[i + 1]) {
        return {
          valid: false,
          error: `Band ${i + 1} (${numericBands[i]}) must be less than Band ${i + 2} (${numericBands[i + 1]})`,
          errorIndex: i,
        };
      }
    }
    
    return { valid: true, error: null, errorIndex: null };
  };

  const validation = validateBands();

  /**
   * Handles changes to individual band values.
   *
   * @param {number} idx - Index of the band being modified.
   * @param {string} value - New value for the band.
   */
  const handleBandChange = (idx, value) => {
    const newBands = [...localBands];
    newBands[idx] = value === "" ? "" : Number(value);
    const mirrorIdx = newBands.length - 1 - idx;
    if (isSymmetric && mirrorIdx !== idx) {
      newBands[mirrorIdx] = value === "" ? "" : -Number(value);
    }
    setLocalBands(newBands);
    setHasChanges(true);
    setValuesEdited(true);
    setPendingCount(null);
    setHasRealPreview(false);
  };

  /**
   * Handles changes to the number of bands.
   * Adds new bands with incremental values or truncates existing bands.
   * Diverging bands are added to, or removed from, both ends so the scale stays centred.
   *
   * @param {Event} e - Change event from the select dropdown.
   */
  const handleBandCountChange = (e) => {
    const count = Number(e.target.value);
    // Under a non-custom method, show what the method will really produce at this count.
    const preview =
      shouldReclassify && typeof previewBandsForCount === "function"
        ? previewBandsForCount(count)
        : null;
    const hasPreview = Array.isArray(preview) && preview.length > 0;
    setLocalBands(
      hasPreview ? preview : fitBandsToCount(localBands, count, { diverging: isDiverging })
    );
    setPendingCount(shouldReclassify ? count : null);
    setHasRealPreview(hasPreview);
    setHasChanges(true);
  };

  // Count-only change on a non-custom method reclassifies.
  const shouldReclassify =
    !isCustom && !valuesEdited && typeof onBandCountChange === "function";

  /**
   * Handles the update button click.
   * Filters out invalid values and invokes the onChange callback with valid bands.
   * A count-only change reclassifies instead.
   */
  const handleUpdate = () => {
    if (shouldReclassify) {
      onBandCountChange(pendingCount ?? localBands.length);
      // Keep a real preview until the new bins arrive; drop a trim/pad fallback in case
      // bands never change.
      if (!hasRealPreview) {
        setLocalBands(bands);
        setPendingCount(null);
      }
      setHasChanges(false);
      return;
    }
    const validBands = localBands.filter(v => v !== "" && !isNaN(v)).map(Number);
    onChange(validBands);
    setHasChanges(false);
  };

  // Range min/max for the band count
  const minBands = isDiverging ? 3 : 2;
  // Natural count kept in range, so it can be picked again after choosing fewer.
  const maxBands = Math.max(
    9,
    bands.length,
    Number.isInteger(naturalBandCount) ? naturalBandCount : 0
  );
  const bandStep = isDiverging ? 2 : 1;
  const bandCounts = [];
  for (let n = minBands; n <= maxBands; n += bandStep) bandCounts.push(n);
  // The picked count, which a method may not fully produce.
  const selectedCount = pendingCount ?? localBands.length;
  if (!bandCounts.includes(selectedCount)) {
    bandCounts.push(selectedCount);
    bandCounts.sort((a, b) => a - b);
  }
  // Only for reclassifying methods that cap the count (Head/Tail Breaks).
  const countLimit =
    shouldReclassify && Number.isInteger(maxBandCount) && maxBandCount >= minBands
      ? maxBandCount
      : null;

  const handleResetBands = () => {
    // If the current classification is custom, delegate to parent so it can restore
    // the pre-custom classification method (default/equidistant/etc) and clear custom bands.
    if (isCustom) {
      if (typeof onReset === "function") {
        try {
          onReset();
        } catch (e) {
          /* ignore */
        }
      }
      setHasChanges(false);
      return;
    }

    // Otherwise, just revert any unsaved local edits back to the current non-custom bands.
    // Also drops a chosen band count.
    setLocalBands(bands);
    setHasChanges(false);
    setValuesEdited(false);
    setPendingCount(null);
    setHasRealPreview(false);
    if (hasBandCount && typeof onBandCountChange === "function") {
      onBandCountChange(null);
    }
  };

  return (
    <BandEditorContainer>
      {showLabel && <SelectorLabel text="Edit banding" />}
      <BandMetaContainer>
        <BandHeader>
          <BandCountLabel>Number of bands:</BandCountLabel>
          <BandCountSelect
            value={selectedCount}
            onChange={handleBandCountChange}
          >
            {bandCounts.map((n) => (
              <option
                key={n}
                value={n}
                disabled={countLimit !== null && n > countLimit && n !== selectedCount}
              >
                {n}
              </option>
            ))}
          </BandCountSelect>
        </BandHeader>
        {countLimit !== null && countLimit < bandCounts[bandCounts.length - 1] && (
          <BandCountHint>This method gives at most {countLimit} bands for this data.</BandCountHint>
        )}
      </BandMetaContainer>
      {validation.error && (
        <ErrorMessage>{validation.error}</ErrorMessage>
      )}
      <BandInputsGrid>
        {localBands.map((band, idx) => (
          <BandInputWrapper key={idx}>
            <BandInputLabel>Band {idx + 1}</BandInputLabel>
            <BandInput
              type="number"
              step="any"
              value={band}
              onChange={e => handleBandChange(idx, e.target.value)}
              $hasError={validation.errorIndex === idx}
            />
          </BandInputWrapper>
        ))}
      </BandInputsGrid>
      <BandActionRow>
        <BandActionLeft>
          <AppButton
            $width="100%"
            $fontSize="0.8rem"
            $fontWeight="500"
            type="button"
            onClick={handleUpdate}
            disabled={!hasChanges || !validation.valid}
          >
            Update
          </AppButton>
        </BandActionLeft>
        <BandActionRight>
          <ResetButton
            $width="100%"
            $fontSize="0.8rem"
            $fontWeight="500"
            type="button"
            onClick={handleResetBands}
            disabled={localBands.length < 2 || (!hasChanges && !isCustom && !hasBandCount)}
          >
            Reset
          </ResetButton>
        </BandActionRight>
      </BandActionRow>
    </BandEditorContainer>
  );
};
