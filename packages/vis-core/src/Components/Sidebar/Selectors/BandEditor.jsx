import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SelectorLabel } from "./SelectorLabel";
import { AppButton } from "Components/AppButton";

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
  color: ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? "#7317de"};
  border: 1px solid ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? "#7317de"};

  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme?.primary ?? props.theme?.activeBg ?? "#7317de"};
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
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
`;

const BandInput = styled.input`
  width: 100%;
  padding: 6px;
  border-radius: 4px;
  border: ${props => props.$hasError ? '2px solid #d32f2f' : '1px solid #d1d1e0'};
  background: #fff;
  text-align: right;
  font-size: 0.9rem;
  box-sizing: border-box;
  min-width: 0;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#d32f2f' : '#4b3e91'};
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.8rem;
  margin-bottom: 8px;
  padding: 6px 8px;
  background-color: #ffebee;
  border-radius: 4px;
  border-left: 3px solid #d32f2f;
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
 * @param {boolean} [props.isCustom] - Whether the current classification method is custom.
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
  isCustom = false,
  onReset = null,
  showLabel = true,
  ..._unusedProps
}) => {
  void _unusedProps;
  const [localBands, setLocalBands] = useState(bands);
  const [hasChanges, setHasChanges] = useState(false);

  /**
   * Synchronize local band state with incoming bands prop.
   * Resets changes flag when parent updates the bands.
   */
  useEffect(() => {
    setLocalBands(bands);
    setHasChanges(false);
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
    
    for (let i = 1; i < numericBands.length; i++) {
      if (numericBands[i] <= numericBands[i - 1]) {
        return { 
          valid: false, 
          error: `Band ${i + 1} (${numericBands[i]}) must be greater than Band ${i} (${numericBands[i - 1]})`,
          errorIndex: i
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
    setLocalBands(newBands);
    setHasChanges(true);
  };

  /**
   * Handles changes to the number of bands.
   * Adds new bands with incremental values or truncates existing bands.
   *
   * @param {Event} e - Change event from the select dropdown.
   */
  const handleBandCountChange = (e) => {
    const count = Number(e.target.value);
    let newBands = [...localBands];
    if (count > newBands.length) {
      // Add new bands spaced by 1
      const last = newBands.length ? newBands[newBands.length - 1] : 0;
      for (let i = newBands.length; i < count; i++) {
        newBands.push(last + (i - newBands.length + 1));
      }
    } else {
      newBands = newBands.slice(0, count);
    }
    setLocalBands(newBands);
    setHasChanges(true);
  };

  /**
   * Handles the update button click.
   * Filters out invalid values and invokes the onChange callback with valid bands.
   */
  const handleUpdate = () => {
    const validBands = localBands.filter(v => v !== "" && !isNaN(v)).map(Number);
    onChange(validBands);
    setHasChanges(false);
  };

  // Range min/max for the band count
  const minBands = isDiverging ? 3 : 2;
  const maxBands = 9;

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
    setLocalBands(bands);
    setHasChanges(false);
  };

  return (
    <BandEditorContainer>
      {showLabel && <SelectorLabel text="Edit banding" />}
      <BandMetaContainer>
        <BandHeader>
          <span style={{ fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>Number of bands:</span>
          <BandCountSelect
            value={localBands.length}
            onChange={handleBandCountChange}
          >
            {Array.from({ length: maxBands - minBands + 1 }, (_, i) => minBands + i).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </BandCountSelect>
        </BandHeader>
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
              $hasError={validation.errorIndex === idx || (validation.errorIndex === idx + 1)}
            />
          </BandInputWrapper>
        ))}
      </BandInputsGrid>
      <BandActionRow>
        <BandActionLeft>
          <AppButton $width="100%" type="button" onClick={handleUpdate} disabled={!hasChanges || !validation.valid}>
            Update
          </AppButton>
        </BandActionLeft>
        <BandActionRight>
          <ResetButton
            $width="100%"
            type="button"
            onClick={handleResetBands}
            disabled={localBands.length < 2 || (!hasChanges && !isCustom)}
          >
            Reset
          </ResetButton>
        </BandActionRight>
      </BandActionRow>
    </BandEditorContainer>
  );
};
