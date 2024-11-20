import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Generic Hovertip component.
 * @param {Object} props - The component props.
 * @param {boolean} props.isVisible - Whether the hovertip should be visible.
 * @param {string} props.displayText - The text to display inside the hovertip.
 * @param {string} props.side - The side to display the hovertip ('left' or 'right').
 * @param {Object} props.refElement - The reference element to position the hovertip relative to.
 * @param {number} props.offset - The offset distance from the reference element.
 * @param {boolean} props.alignVertical - Whether to align the hovertip vertically with the middle of the refElement.
 * @returns {JSX.Element|null} The rendered Hovertip component.
 */
export const Hovertip = ({ isVisible, displayText, side, refElement, offset = 0, alignVertical = true }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const hovertipRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (refElement.current && hovertipRef.current) {
        const rect = refElement.current.getBoundingClientRect();
        const hovertipRect = hovertipRef.current.getBoundingClientRect();
        const hovertipWidth = hovertipRect.width;
        const hovertipHeight = hovertipRect.height;

        setPosition({
          top: alignVertical
            ? rect.top + window.scrollY + (rect.height / 2) - (hovertipHeight / 2)
            : rect.top + window.scrollY,
          left: side === 'left'
            ? rect.left + window.scrollX - offset - hovertipWidth
            : rect.right + window.scrollX + offset,
        });
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [refElement, side, offset, isVisible, alignVertical]);

  if (!isVisible) return null;

  const style = {
    position: 'absolute',
    top: `${position.top}px`,
    left: `${position.left}px`,
    backgroundColor: 'black',
    color: 'white',
    padding: '5px',
    borderRadius: '6px',
    fontSize: '0.8em',
    whiteSpace: 'nowrap',
    zIndex: 1002,
  };

  return createPortal(
    <div ref={hovertipRef} style={style}>
      {displayText}
    </div>,
    document.body
  );
};
