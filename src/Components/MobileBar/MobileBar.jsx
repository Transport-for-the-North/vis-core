import styled from 'styled-components';
import { AccordionHeader, AccordionIcon } from '../Sidebar/Accordion/AccordionSection';

/**
 * A unified mobile bar styled like the accordion header.
 * Renders as a <button>, shows on mobile only, and uses AccordionIcon.
 */
export const MobileBar = styled(AccordionHeader).attrs({ as: 'button' })`
  display: none;
  border-radius: 0;
  border-left: 0;
  border-right: 0;

  @media ${({ theme }) => theme?.mq?.mobile || '(max-width: 900px)' } {
    display: flex;
    position: static;
    height: 45px;
    width: 100vw;
    z-index: 1002;
    background: ${({ $bgColor }) => $bgColor || '#7317DE'};
    color: #fff;
    border: 0;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;

    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1;
  }
`;

// A side arrow for desktop toggle, derived from AccordionIcon
export const SideIcon = styled(AccordionIcon)`
  /* left/right chevron look */
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(135deg)' : 'rotate(-45deg)')};
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
`;
