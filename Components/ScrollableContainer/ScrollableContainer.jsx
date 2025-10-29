import styled from 'styled-components'
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AccordionIcon } from '../Sidebar/Accordion/AccordionSection';
import { MobileBar } from '../MobileBar/MobileBar';

import { CARD_CONSTANTS } from 'defaults';
const { PADDING } = CARD_CONSTANTS

const MOBILE_Q = '(max-width: 900px)';
const mobileMQ = (p) => (p.theme?.mq?.mobile || MOBILE_Q);

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
  
  /* MOBILE: sit under Filters and collapse */
  @media ${mobileMQ} {
    position: static;
    right: auto;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;

    /* simple open/close */
    max-height: ${({ $open }) => ($open ? '60vh' : '0')};
    overflow-y: ${({ $open }) => ($open ? 'auto' : 'hidden')};
    overflow-x: hidden;
    padding: ${({ $open }) => ($open ? `${PADDING}px` : '0')};
    gap: ${({ $open }) => ($open ? `${PADDING}px` : '0')};
    box-shadow: none;
    border-radius: 0;
    background: #fff;

    /* make children full width */
    & > * { width: 100% !important; }
  }
`;

/**
 * ScrollableContainer component to wrap visualization cards.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The children to render inside the container.
 * @returns {JSX.Element} The rendered ScrollableContainer component.
 */
  export const ScrollableContainer = ({
    children,
    mobileTitle = 'Summary',
    mobileBarColor,
    hideCardHandleOnMobile = true,
    showOnMobile  = true,
  }) => {
    // read current breakpoint
    const initialIsMobile =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(MOBILE_Q).matches;

    // open on desktop, closed by default on mobile
    const [isMobile, setIsMobile] = useState(initialIsMobile);
    const [open, setOpen] = useState(!initialIsMobile);

    useEffect(() => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
      const mql = window.matchMedia(MOBILE_Q);
      const onChange = (e) => {
        setIsMobile(e.matches);
        if (!e.matches) setOpen(true); // always open on desktop
      };
      onChange(mql);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
      if (isMobile && showOnMobile) setOpen(true);
    }, [isMobile, showOnMobile]);

      // If there’s nothing to show, render nothing
    const hasChildren = React.Children.toArray(children).some(Boolean);
    if (!hasChildren) return null;

    const hidden = isMobile && !showOnMobile;

    // MOBILE: mount outside the map into a slot under the Filters bar
    if (isMobile) {
      const slot = typeof document !== 'undefined' && document.getElementById('mobile-cards-slot');
      if (slot) return createPortal(
        <>
          {showOnMobile && (
            <MobileBar $bgColor={mobileBarColor} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
              <span>{mobileTitle}</span>
              <AccordionIcon className="chev" $isOpen={open} />
            </MobileBar>
          )}

          <StyledScrollableContainer $open={open} $hidden={hidden} data-testid="container" className="selectable-text">
            {React.Children.map(children, (child) =>
              hideCardHandleOnMobile && React.isValidElement(child)
                ? React.cloneElement(child, { hideHandleOnMobile: true })
                : child
            )}
          </StyledScrollableContainer>
        </>, slot);
    }

    // DESKTOP: keep the current overlay behavior
    return (
      <div style={{ position: 'relative' }}>
        <>
          {isMobile && showOnMobile && (
            <MobileBar $bgColor={mobileBarColor} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
              <span>{mobileTitle}</span>
              <AccordionIcon className="chev" $isOpen={open} />
            </MobileBar>
          )}

          <StyledScrollableContainer $open={isMobile ? open : true} $hidden={hidden} data-testid="container" className="selectable-text">
            {React.Children.map(children, child =>
              hideCardHandleOnMobile && isMobile && React.isValidElement(child)
                ? React.cloneElement(child, { hideHandleOnMobile: true })
                : child
            )}
          </StyledScrollableContainer>
        </>
      </div>
    );
  };
