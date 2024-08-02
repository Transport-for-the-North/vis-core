import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 5px;
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

const TooltipText = styled.span`
  visibility: hidden; // Always hidden by default, visibility controlled by state
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 9999;
  font-size: 0.8em; // Smaller text size
  transition: opacity 0.3s;
  opacity: 0; // Initially transparent, opacity controlled by state
`;

/**
 * Component for rendering a label with optional information tooltip.
 * @property {string} text - The text content of the label.
 * @property {string} [info] - Optional information to be displayed in the tooltip.
 * @returns {JSX.Element} The SelectorLabel component.
 */
export const SelectorLabel = ({ text, info }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const infoButtonRef = useRef(null);

  const handleMouseEnter = () => {
    if (infoButtonRef.current) {
      const rect = infoButtonRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - rect.height - 5, // Position above the button
        left: rect.left + rect.width // Position to the right of the button
      });
    }
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const renderTooltip = (info) => {
    return createPortal(
      <TooltipText
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          visibility: isTooltipVisible ? 'visible' : 'hidden',
          opacity: isTooltipVisible ? 1 : 0
        }}
      >
        {info}
      </TooltipText>,
      document.getElementById('portal-root')
    );
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
          {renderTooltip(info)}
        </InfoButton>
      )}
    </StyledLabel>
  );
};