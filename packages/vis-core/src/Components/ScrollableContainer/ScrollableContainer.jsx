import styled from "styled-components";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AccordionIcon } from "../Sidebar/Accordion/AccordionSection";
import { MobileBar } from "../MobileBar/MobileBar";

import { CARD_CONSTANTS } from "defaults";

const { PADDING } = CARD_CONSTANTS;

const MOBILE_Q = "(max-width: 900px)";
const mobileMQ = (p) => p.theme?.mq?.mobile || MOBILE_Q;

const StyledScrollableContainer = styled.div`
  position: absolute;
  right: 0;
  display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
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

  @media ${mobileMQ} {
    position: static;
    right: auto;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;

    max-height: ${({ $open }) => ($open ? "60vh" : "0")};
    overflow-y: ${({ $open }) => ($open ? "auto" : "hidden")};
    overflow-x: hidden;
    padding: ${({ $open }) => ($open ? `${PADDING}px` : "0")};
    gap: ${({ $open }) => ($open ? `${PADDING}px` : "0")};
    box-shadow: none;
    border-radius: 0;
    background: #fff;

    & > * {
      width: 100% !important;
    }
  }
`;

/**
 * Sticky wrapper keeps the pill above card content while avoiding a full-width
 * button visual. Width is only used for positioning; the pill itself remains compact.
 */
const OverflowHintWrap = styled.div`
  position: sticky;
  bottom: 10px;

  display: ${({ $visible }) => ($visible ? "flex" : "none")};
  justify-content: center;
  align-self: stretch;
  padding-top: 10px;

  z-index: 4000;
  pointer-events: none;

  @media ${mobileMQ} {
    bottom: 8px;
    margin-top: 8px;
    padding-top: 10px;
  }
`;

const OverflowHint = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  width: auto;
  min-width: 148px;
  max-width: min(260px, calc(100% - 32px));

  padding: 7px 14px;

  border: 0;
  border-radius: 999px;
  background: rgba(24, 20, 69, 0.96);
  color: #fff;

  font-family: inherit;
  font-size: 0.76rem;
  font-weight: 800;
  line-height: 1;

  cursor: pointer;
  pointer-events: auto;

  box-shadow:
    0 5px 14px rgba(13, 15, 61, 0.28),
    0 1px 3px rgba(13, 15, 61, 0.2);

  transition:
    transform 140ms ease,
    background-color 140ms ease,
    box-shadow 140ms ease,
    opacity 140ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(36, 29, 91, 0.98);
    box-shadow:
      0 8px 18px rgba(13, 15, 61, 0.34),
      0 2px 5px rgba(13, 15, 61, 0.24);
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 4px 10px rgba(13, 15, 61, 0.3),
      0 1px 3px rgba(13, 15, 61, 0.2);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

const OverflowText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OverflowDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex: 0 0 auto;

  background: ${({ $hasUpdates }) => ($hasUpdates ? "#00dec6" : "#fff")};
  box-shadow: ${({ $hasUpdates }) =>
    $hasUpdates ? "0 0 0 4px rgba(0, 222, 198, 0.22)" : "none"};
`;

const Chevron = styled.span`
  width: 6px;
  height: 6px;
  flex: 0 0 auto;

  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;

  transform: ${({ $direction }) =>
    $direction === "up" ? "rotate(225deg)" : "rotate(45deg)"};

  margin-top: ${({ $direction }) => ($direction === "up" ? "3px" : "-3px")};
`;

const normaliseUpdatedNames = (updatedCardNames) => {
  if (!updatedCardNames) return [];
  if (updatedCardNames instanceof Set) return [...updatedCardNames];
  if (Array.isArray(updatedCardNames)) return updatedCardNames;
  return [];
};

/**
 * ScrollableContainer component to wrap visualisation cards.
 *
 * Behaviour:
 * - Owns the only scroll surface for callout cards.
 * - Shows a compact centred pill when:
 *   - cards have updated;
 *   - a card is fully above the visible scroll area;
 *   - a card is fully below the visible scroll area.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.mobileTitle='Summary']
 * @param {string} [props.mobileBarColor]
 * @param {boolean} [props.hideCardHandleOnMobile=true]
 * @param {boolean} [props.showOnMobile=true]
 * @param {string[]|Set<string>} [props.updatedCardNames=[]]
 * @param {Function} [props.onUpdatedCardSeen]
 * @param {Function} [props.onUpdatedCardsClicked]
 * @param {Function} [props.onOverflowHintClick]
 * @returns {JSX.Element|null}
 */
export const ScrollableContainer = ({
  children,
  mobileTitle = "Summary",
  mobileBarColor,
  hideCardHandleOnMobile = true,
  showOnMobile = true,
  updatedCardNames = [],
  onUpdatedCardSeen,
  onUpdatedCardsClicked,
  onOverflowHintClick,
}) => {
  const initialIsMobile =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(MOBILE_Q).matches;

  const [isMobile, setIsMobile] = useState(initialIsMobile);
  const [open, setOpen] = useState(!initialIsMobile);

  const scrollRef = useRef(null);
  const updatedSeenTimerRef = useRef(null);

  const updatedNames = useMemo(
    () => normaliseUpdatedNames(updatedCardNames).filter(Boolean),
    [updatedCardNames]
  );

  const [overflowState, setOverflowState] = useState({
    canScroll: false,
    canScrollUp: false,
    canScrollDown: false,
  });

  const [firstUpdatedCardName, setFirstUpdatedCardName] = useState(null);

  const clearUpdatedSeenTimer = useCallback(() => {
    if (updatedSeenTimerRef.current) {
      clearTimeout(updatedSeenTimerRef.current);
      updatedSeenTimerRef.current = null;
    }
  }, []);

  const getCardElementByName = useCallback((name) => {
    const container = scrollRef.current;
    if (!container || !name) return null;

    const cards = container.querySelectorAll("[data-callout-card-name]");

    return [...cards].find(
      (card) => card.getAttribute("data-callout-card-name") === name
    );
  }, []);

  const getFirstUpdatedCardElement = useCallback(() => {
    for (const name of updatedNames) {
      const element = getCardElementByName(name);
      if (element) return { name, element };
    }

    return {
      name: updatedNames[0] ?? null,
      element: null,
    };
  }, [updatedNames, getCardElementByName]);

  const isElementInScrollView = useCallback((element) => {
    const container = scrollRef.current;
    if (!container || !element) return false;

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    return (
      elementRect.bottom > containerRect.top &&
      elementRect.top < containerRect.bottom
    );
  }, []);

  /**
   * Only report overflow when another callout card is completely outside the
   * visible area. A merely clipped/partially visible card no longer counts.
   */
  const getCardOverflowState = useCallback(() => {
    const container = scrollRef.current;

    if (!container) {
      return {
        canScroll: false,
        canScrollUp: false,
        canScrollDown: false,
      };
    }

    const threshold = 2;
    const canScroll = container.scrollHeight > container.clientHeight + threshold;

    if (!canScroll) {
      return {
        canScroll: false,
        canScrollUp: false,
        canScrollDown: false,
      };
    }

    const containerRect = container.getBoundingClientRect();

    const cards = Array.from(
      container.querySelectorAll("[data-callout-card-name]")
    );

    const hasFullyHiddenCardAbove = cards.some((card) => {
      const rect = card.getBoundingClientRect();
      return rect.bottom <= containerRect.top + threshold;
    });

    const hasFullyHiddenCardBelow = cards.some((card) => {
      const rect = card.getBoundingClientRect();
      return rect.top >= containerRect.bottom - threshold;
    });

    return {
      canScroll,
      canScrollUp: hasFullyHiddenCardAbove,
      canScrollDown: hasFullyHiddenCardBelow,
    };
  }, []);

  /**
   * Scrolls within the callout stack only. Avoids browser scrollIntoView()
   * bubbling up and scrolling the page/map layout.
   */
  const scrollCardIntoView = useCallback((cardElement) => {
    const container = scrollRef.current;
    if (!container || !cardElement) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = cardElement.getBoundingClientRect();

    const cardTopWithinContainer =
      cardRect.top - containerRect.top + container.scrollTop;

    const targetTop =
      cardTopWithinContainer -
      container.clientHeight / 2 +
      cardElement.offsetHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  }, []);

  const openCardIfClosed = useCallback((cardElement) => {
    if (!cardElement) return;

    const isOpen = cardElement.getAttribute("data-callout-card-open") === "true";
    if (isOpen) return;

    const toggleButton = cardElement.querySelector("[data-callout-card-toggle]");
    if (toggleButton instanceof HTMLElement) {
      toggleButton.click();
    }
  }, []);

  const evaluateUpdatedCardVisibility = useCallback(() => {
    clearUpdatedSeenTimer();

    if (updatedNames.length === 0) {
      setFirstUpdatedCardName(null);
      return;
    }

    const { name, element } = getFirstUpdatedCardElement();
    setFirstUpdatedCardName(name);

    if (!name || !element) return;

    const isOpen = element.getAttribute("data-callout-card-open") === "true";
    const isInView = isElementInScrollView(element);

    /**
     * Keep the marker if the updated card is out of view or collapsed.
     * If it is open and visible, clear after a short timeout.
     */
    if (isOpen && isInView) {
      updatedSeenTimerRef.current = setTimeout(() => {
        onUpdatedCardSeen?.(name);
      }, 2800);
    }
  }, [
    clearUpdatedSeenTimer,
    getFirstUpdatedCardElement,
    isElementInScrollView,
    onUpdatedCardSeen,
    updatedNames,
  ]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return undefined;
    }

    const mql = window.matchMedia(MOBILE_Q);

    const onChange = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) setOpen(true);
    };

    onChange(mql);
    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (isMobile && showOnMobile) setOpen(true);
  }, [isMobile, showOnMobile]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;

    const updateOverflowState = () => {
      setOverflowState(getCardOverflowState());
      evaluateUpdatedCardVisibility();
    };

    updateOverflowState();

    element.addEventListener("scroll", updateOverflowState, { passive: true });

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateOverflowState);
      resizeObserver.observe(element);
    }

    window.addEventListener("resize", updateOverflowState);

    return () => {
      element.removeEventListener("scroll", updateOverflowState);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateOverflowState);
    };
  }, [
    children,
    open,
    isMobile,
    showOnMobile,
    evaluateUpdatedCardVisibility,
    getCardOverflowState,
  ]);

  useEffect(() => {
    evaluateUpdatedCardVisibility();

    return () => {
      clearUpdatedSeenTimer();
    };
  }, [evaluateUpdatedCardVisibility, clearUpdatedSeenTimer]);

  const hasChildren = React.Children.toArray(children).some(Boolean);
  if (!hasChildren) return null;

  const hidden = isMobile && !showOnMobile;
  const hasUpdatedCards = updatedNames.length > 0;

  const overflowDirection = overflowState.canScrollDown
    ? "down"
    : overflowState.canScrollUp
    ? "up"
    : null;

  const overflowHintText = (() => {
    if (hasUpdatedCards) {
      return `${updatedNames.length} card${
        updatedNames.length === 1 ? "" : "s"
      } updated`;
    }

    if (overflowState.canScrollDown) return "More cards below";
    if (overflowState.canScrollUp) return "More cards above";
    return "";
  })();

  const shouldShowOverflowHint =
    hasUpdatedCards ||
    (overflowState.canScroll &&
      (overflowState.canScrollDown || overflowState.canScrollUp));

  const handleOverflowHintClick = () => {
    const container = scrollRef.current;
    if (!container) return;

    if (hasUpdatedCards) {
      const { name, element: cardElement } = getFirstUpdatedCardElement();

      if (cardElement) {
        openCardIfClosed(cardElement);

        /*
        * Wait a tick so the card can begin opening before we centre it.
        * This avoids scrolling to the collapsed shell and then expanding off-position.
        */
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            scrollCardIntoView(cardElement);
          });
        });
      }

      /*
      * Requirement:
      * As soon as "card(s) updated" is clicked, reset the stack-level marker.
      */
      if (typeof onUpdatedCardsClicked === "function") {
        onUpdatedCardsClicked(name);
      } else if (name) {
        onUpdatedCardSeen?.(name);
      }

      return;
    }

    if (overflowState.canScrollDown) {
      container.scrollBy({
        top: Math.round(container.clientHeight * 0.8),
        behavior: "smooth",
      });
    } else if (overflowState.canScrollUp) {
      container.scrollBy({
        top: -Math.round(container.clientHeight * 0.8),
        behavior: "smooth",
      });
    }

    onOverflowHintClick?.();
  };

  const renderChildren = (forMobile) =>
    React.Children.map(children, (child) =>
      hideCardHandleOnMobile && forMobile && React.isValidElement(child)
        ? React.cloneElement(child, { hideHandleOnMobile: true })
        : child
    );

  const renderLeadingIcon = () => {
    if (hasUpdatedCards) {
      return <OverflowDot $hasUpdates aria-hidden="true" />;
    }

    if (!overflowDirection) {
      return <OverflowDot aria-hidden="true" />;
    }

    return <Chevron $direction={overflowDirection} aria-hidden="true" />;
  };

  const renderOverflowHint = () => (
    <OverflowHintWrap $visible={shouldShowOverflowHint}>
      <OverflowHint
        type="button"
        onClick={handleOverflowHintClick}
        aria-label={
          hasUpdatedCards && firstUpdatedCardName
            ? `${overflowHintText}. Scroll to ${firstUpdatedCardName}`
            : overflowHintText || "Callout card status"
        }
        title={
          hasUpdatedCards && firstUpdatedCardName
            ? `Scroll to ${firstUpdatedCardName}`
            : overflowHintText || undefined
        }
      >
        {renderLeadingIcon()}
        <OverflowText>{overflowHintText}</OverflowText>
      </OverflowHint>
    </OverflowHintWrap>
  );

  if (isMobile) {
    const slot =
      typeof document !== "undefined" &&
      document.getElementById("mobile-cards-slot");

    if (slot) {
      return createPortal(
        <>
          {showOnMobile && (
            <MobileBar
              $bgColor={mobileBarColor}
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
            >
              <span>{mobileTitle}</span>
              <AccordionIcon className="chev" $isOpen={open} />
            </MobileBar>
          )}

          <StyledScrollableContainer
            ref={scrollRef}
            $open={open}
            $hidden={hidden}
            data-testid="container"
            className="selectable-text"
          >
            {renderChildren(true)}
            {renderOverflowHint()}
          </StyledScrollableContainer>
        </>,
        slot
      );
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {isMobile && showOnMobile && (
        <MobileBar
          $bgColor={mobileBarColor}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          <span>{mobileTitle}</span>
          <AccordionIcon className="chev" $isOpen={open} />
        </MobileBar>
      )}

      <StyledScrollableContainer
        ref={scrollRef}
        $open={isMobile ? open : true}
        $hidden={hidden}
        data-testid="container"
        className="selectable-text"
      >
        {renderChildren(isMobile)}
        {renderOverflowHint()}
      </StyledScrollableContainer>
    </div>
  );
};