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
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 9999; // Ensures it appears above all interface components
  bottom: 125%; // Positions the tooltip above the button
  left: 50%;
  margin-left: -60px; // Centers the tooltip
  opacity: 0;
  transition: opacity 0.3s;
  overflow: visible;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
`;

export const SelectorLabel = ({ text, info }) => (
  <StyledLabel>
    <span>{text}</span>
    {/* <InfoButton>
      ℹ
      <TooltipText>{info}</TooltipText>
    </InfoButton> */}
  </StyledLabel>
);