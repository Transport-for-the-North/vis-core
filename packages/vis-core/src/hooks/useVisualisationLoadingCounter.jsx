import { useEffect, useRef } from "react";
import { actionTypes } from "reducers";

/**
 * Registers a visualisation component's in-flight fetch state with the shared
 * loading counter held in MapContext (via `dispatch`).
 *
 * The global counter allows the layout layer to keep the Dimmer visible until
 * every visualisation on the page has finished loading, rather than dismissing
 * it as soon as the first one completes.
 *
 * Usage:
 *   useVisualisationLoadingCounter(isLoading, dispatch);
 *
 * @param {boolean} isLoading - Whether this visualisation is currently fetching.
 * @param {Function} dispatch  - The MapContext dispatch function.
 */
export function useVisualisationLoadingCounter(isLoading, dispatch) {
  // Tracks whether this instance has incremented the counter.
  // Prevents:
  //   - spurious decrements on mount (isLoading starts false, no fetch yet)
  //   - double increments if the effect re-runs while already loading
  const hasIncrementedRef = useRef(false);

  useEffect(() => {
    if (isLoading) {
      if (!hasIncrementedRef.current) {
        hasIncrementedRef.current = true;
        dispatch({ type: actionTypes.INCREMENT_VISUALISATION_LOADING });
      }
    } else if (hasIncrementedRef.current) {
      hasIncrementedRef.current = false;
      dispatch({ type: actionTypes.DECREMENT_VISUALISATION_LOADING });
    }
  }, [isLoading, dispatch]);

  // Release the counter if this component unmounts while a fetch is in flight.
  useEffect(() => {
    return () => {
      if (hasIncrementedRef.current) {
        hasIncrementedRef.current = false;
        dispatch({ type: actionTypes.DECREMENT_VISUALISATION_LOADING });
      }
    };
  }, [dispatch]);
}
