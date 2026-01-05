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
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}