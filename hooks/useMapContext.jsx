import { useContext } from 'react';

import { MapContext } from 'contexts';

/**
 * Custom hook to access the MapContext.
 * @function useMapContext
 * @returns {Object} The current context value of MapContext.
 */
export const useMapContext = () => {
    return useContext(MapContext);
};
