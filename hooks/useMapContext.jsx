import { useContext } from 'react';

import { MapContext } from 'contexts';

export const useMapContext = () => {
    return useContext(MapContext);
};
