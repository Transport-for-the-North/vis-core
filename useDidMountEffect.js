import { useEffect, useRef } from 'react';

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
