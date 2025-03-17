import styled from 'styled-components'

import { CARD_CONSTANTS } from 'defaults';
const { PADDING } = CARD_CONSTANTS

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
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  width: fit-content;
  transition: transform 0.3s ease-in-out;
`;

/**
 * ScrollableContainer component to wrap visualization cards.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to render inside the container.
 * @returns {JSX.Element} The rendered ScrollableContainer component.
 */
export const ScrollableContainer = ({ children }) => {
  return (
    <div style={{ position: 'relative' }}>
      <StyledScrollableContainer>
        {children}
      </StyledScrollableContainer>
    </div>
  );
};
