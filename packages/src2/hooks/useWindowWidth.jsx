import { useEffect, useState } from "react";

/**
 * useWindowWidth
 *
 * A custom React hook to track the current browser window width.
 * It attaches an event listener to window resize and updates the width.
 *
 * @returns {number} The current window width.
 */
export const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};