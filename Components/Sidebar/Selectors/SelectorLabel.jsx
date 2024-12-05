import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Hovertip } from 'Components';
const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const InfoButton = styled.button`
  background: #e6e6e6;
  border: none;
  padding: 0 5px;
  margin-left: 5px;
  cursor: pointer;
  position: relative;
  border-radius: 2px;

  &:hover {
    background: #cccccc;
  }
`;

/**
 * Component for rendering a label with optional information tooltip.
 * @property {string} text - The text content of the label.
 * @property {string} [info] - Optional information to be displayed in the tooltip.
 * @returns {JSX.Element} The SelectorLabel component.
 */
export const SelectorLabel = ({ text, info }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const infoButtonRef = useRef(null);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <StyledLabel>
      <span>{text}</span>
      {info && (
        <InfoButton
          ref={infoButtonRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          ℹ
          <Hovertip
            isVisible={isTooltipVisible}
            displayText={info}
            side="right"
            refElement={infoButtonRef}
            offset={5}
          />
        </InfoButton>
      )}
    </StyledLabel>
  );
};