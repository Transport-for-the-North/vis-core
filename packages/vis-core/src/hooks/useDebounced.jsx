import { useEffect, useState } from 'react';

/**
 * useDebounced
 * Debounces any value and returns the debounced value after a delay.
 *
 * @template T
 * @param {T} value - Current value
 * @param {number} delayMs - Delay in milliseconds
 * @returns {T} Debounced value
 */
export function useDebounced(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}