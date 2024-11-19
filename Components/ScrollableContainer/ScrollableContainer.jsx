import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import { CARD_CONSTANTS } from 'defaults';
const { CARD_WIDTH, PADDING } = CARD_CONSTANTS

const StyledScrollableContainer = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: ${PADDING}px;
  gap: ${PADDING}px;
  scrollbar-width: thin;
  z-index: 1000;
  max-height: 60vh;
  overflow-y: auto;
  overflow-x: show;
  width: ${CARD_WIDTH + PADDING * 2}px;
  transition: transform 0.3s ease-in-out;
  transform: translateX(
    ${({ $isVisible }) => ($isVisible ? '0' : '100%')}
  );
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: 0;
  background-color: #7317de;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * ScrollableContainer component to wrap visualization cards.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to render inside the container.
 * @returns {JSX.Element} The rendered ScrollableContainer component.
 */
export const ScrollableContainer = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div style={{ position: 'relative' }}>
      <StyledScrollableContainer $isVisible={isVisible}>
        {children}
      </StyledScrollableContainer>
      <ToggleButton onClick={toggleVisibility}>
        {isVisible ? (
          <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
        ) : (
          <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
        )}
      </ToggleButton>
    </div>
  );
};
