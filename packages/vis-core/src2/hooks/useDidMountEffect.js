import { useEffect, useRef } from 'react';

/**
 * Custom hook to execute a callback function only on component updates, not on initial mount.
 * @function useDidMountEffect
 * @param {Function} callback - The callback function to execute.
 * @param {Array} dependencies - The dependency array for useEffect.
 */
export const useDidMountEffect = (callback, dependencies) => {
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      callback();
    } else {
      didMount.current = true;
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};
