import { useEffect, useState } from "react";

/**
 * usePersistentState
 * Persists a value in localStorage under a key.
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Fallback value
 * @returns {[any, React.Dispatch<any>]} Tuple of [value, setValue]
 */
export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (err) {
      console.warn('Failed to read persistent state:', err);
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('Failed to write persistent state:', err);
    }
  }, [key, value]);
  return [value, setValue];
}