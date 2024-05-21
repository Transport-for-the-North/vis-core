import { useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'


const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const InfoButton = styled.button`
  background: #e6e6e6;
  border: none;
  padding: 0 5px 0 5px;
  margin-left: 5px;
  cursor: pointer;
  position: relative;
  border-radius: 2px;

  &:hover {
    background: #cccccc; // Change color on hover
  }

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 9999;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  transition: opacity 0.3s;
  overflow: visible;
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;


export const SelectorLabel = ({ text, info }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const renderTooltip = (info) => {
    return createPortal(
      <TooltipText isVisible={isTooltipVisible}>{info}</TooltipText>,
      document.getElementById('portal-root')
    );
  };

  return (
    <StyledLabel>
      <span>{text}</span>
      {info && (
        <InfoButton onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          ℹ
          {renderTooltip(info)}
        </InfoButton>
      )}
    </StyledLabel>
  );
};