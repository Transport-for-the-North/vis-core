import React, { useState } from "react";
import styled from "styled-components";
import { SelectorLabel } from "./SelectorLabel";

const BandInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
`;

const BandInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BandInput = styled.input`
  width: 80px;
  padding: 4px;
`;

const AddRemoveButton = styled.button`
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 1em;
`;

/**
 * BandEditor allows editing of banding values for continuous/diverging color schemes.
 * @param {number[]} bands - Current band values.
 * @param {function} onChange - Callback with updated band values.
 * @param {boolean} isDiverging - If true, diverging scheme (show center).
 */
export const BandEditor = ({ bands, onChange, isDiverging }) => {
  const [localBands, setLocalBands] = useState(bands);

  const handleBandChange = (idx, value) => {
    const newBands = [...localBands];
    newBands[idx] = value === "" ? "" : Number(value);
    setLocalBands(newBands);
    onChange(newBands.filter(v => v !== "" && !isNaN(v)).map(Number));
  };

  const handleAddBand = () => {
    setLocalBands([...localBands, localBands[localBands.length - 1] + 1]);
  };

  const handleRemoveBand = (idx) => {
    if (localBands.length <= (isDiverging ? 3 : 2)) return;
    const newBands = localBands.filter((_, i) => i !== idx);
    setLocalBands(newBands);
    onChange(newBands);
  };

  return (
    <BandInputContainer>
      <SelectorLabel text={isDiverging ? "Diverging Bands" : "Bands"} />
      {localBands.map((band, idx) => (
        <BandInputRow key={idx}>
          <BandInput
            type="number"
            value={band}
            onChange={e => handleBandChange(idx, e.target.value)}
            min={idx === 0 ? undefined : localBands[idx - 1]}
            max={idx === localBands.length - 1 ? undefined : localBands[idx + 1]}
          />
          {localBands.length > (isDiverging ? 3 : 2) && (
            <AddRemoveButton onClick={() => handleRemoveBand(idx)} title="Remove band">-</AddRemoveButton>
          )}
          {idx === localBands.length - 1 && (
            <AddRemoveButton onClick={handleAddBand} title="Add band">+</AddRemoveButton>
          )}
        </BandInputRow>
      ))}
    </BandInputContainer>
  );
};
