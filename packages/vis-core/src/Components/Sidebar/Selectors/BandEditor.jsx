
import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  text-align: center;
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


export const BandEditor = ({ bands, onChange, isDiverging }) => {
  const [localBands, setLocalBands] = useState(bands);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync localBands with bands prop (from parent/classification changes)
  useEffect(() => {
    setLocalBands(bands);
    setHasChanges(false);
  }, [bands]);

  // Validate bands: each band must be greater than the previous one
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

  // Handle band value change
  const handleBandChange = (idx, value) => {
    const newBands = [...localBands];
    newBands[idx] = value === "" ? "" : Number(value);
    setLocalBands(newBands);
    setHasChanges(true);
  };

  // Handle band count change
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

  // Handle update button click
  const handleUpdate = () => {
    const validBands = localBands.filter(v => v !== "" && !isNaN(v)).map(Number);
    onChange(validBands);
    setHasChanges(false);
  };

  // Range min/max for the band count
  const minBands = isDiverging ? 3 : 2;
  const maxBands = 9;

  return (
    <BandEditorContainer>
      <SelectorLabel text="Edit banding" />
      
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
