import { useEffect, useState } from "react";

/**
 * useIsMobile
 *
 * Returns a boolean that tracks whether the viewport is currently at or below
 * a mobile breakpoint (≤ 900px). It reads the width on mount and updates on
 * window resize.
 *
 * - Guards all direct `window` access.
 * - Cleans up the resize listener on unmount.
 * - Keep the 900px value in sync with your theme's `mq.mobile` if you change it.
 *
 * @returns {boolean} isMobile - `true` when `window.innerWidth <= 900`, else `false`.
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth <= 900 : false));
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};
