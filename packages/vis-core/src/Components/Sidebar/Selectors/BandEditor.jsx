import React, { useState, useEffect } from "react";
import chroma from 'chroma-js';
import styled from "styled-components";
import { roundToSignificantFigures } from "utils/math";
import { SelectorLabel } from "./SelectorLabel";

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

const UpdateButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  background-color: #4b3e91;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3d3278;
  }
  
  &:focus {
    outline: 2px solid #4b3e91;
    outline-offset: 2px;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
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
export const BandEditor = ({ bands, onChange, isDiverging, data = [], defaultBandValues = null, onReset = null }) => {
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

  // Helper to recalculate default bands (quantile binning using chroma-js)
  // This function now requires `chroma` and `data` to be present and will
  // return the quantile thresholds rounded to two significant figures.
  // If chroma or sufficient data is not available, it returns the current local bands.
  const recalculateDefaultBands = () => {
    const count = localBands.length;
    // If the app provides default band values (from config), prefer those
    if (defaultBandValues && Array.isArray(defaultBandValues) && defaultBandValues.length > 0) {
      const rounded = defaultBandValues.map(v => roundToSignificantFigures(Number(v), 2));
      return rounded.length >= count ? rounded.slice(0, count) : rounded;
    }

    if (!chroma || !data || !Array.isArray(data)) return localBands;

    // Extract numeric values from data (support objects or raw numbers)
    const numericValues = data.map((row) => {
      if (row == null) return NaN;
      if (typeof row === 'number') return row;
      if (typeof row === 'string') return Number(row.replace(/,/g, ''));
      if (typeof row === 'object') {
        // try common fields
        if (typeof row.value === 'number') return row.value;
        if (typeof row.metric === 'number') return row.metric;
        // try to find first numeric property
        for (const k in row) {
          if (typeof row[k] === 'number') return row[k];
          if (typeof row[k] === 'string' && !Number.isNaN(Number(row[k].replace(/,/g, '')))) return Number(row[k].replace(/,/g, ''));
        }
      }
      return NaN;
    }).filter(v => Number.isFinite(v));

    if (numericValues.length < count) return localBands;

    try {
      const limits = chroma.limits(numericValues, 'q', count);
      const thresholds = limits.slice(1).map(v => roundToSignificantFigures(Number(v), 2));
      return thresholds;
    } catch (e) {
      return localBands;
    }
  };

  const handleResetBands = () => {
    const defaults = recalculateDefaultBands();
    setLocalBands(defaults);
    // Apply immediately (don't require separate Update click)
    const validDefaults = defaults.filter(v => v !== "" && !isNaN(v)).map(Number);
    onChange(validDefaults);
    if (typeof onReset === 'function') {
      try { onReset(); } catch (e) { /* ignore */ }
    }
    setHasChanges(false);
  };

  return (
    <BandEditorContainer>
      <SelectorLabel text="Edit banding" />
      <BandHeader>
        <span style={{ fontSize: "0.9rem", color: "#555", fontWeight: 500 }}>Number of bands:</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <BandCountSelect
            value={localBands.length}
            onChange={handleBandCountChange}
          >
            {Array.from({ length: maxBands - minBands + 1 }, (_, i) => minBands + i).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </BandCountSelect>
          <UpdateButton
            type="button"
            style={{ padding: '4px 10px', fontSize: '0.85em', width: 'auto', background: '#eee', color: '#4b3e91', border: '1px solid #d1d1e0', fontWeight: 500 }}
            onClick={handleResetBands}
            disabled={localBands.length < 2}
          >
            Reset bands
          </UpdateButton>
        </div>
      </BandHeader>
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
      <UpdateButton onClick={handleUpdate} disabled={!hasChanges || !validation.valid}>
        Update banding
      </UpdateButton>
    </BandEditorContainer>
  );
};
