import React, { createContext, useEffect, useContext, useReducer } from 'react';

import { actionTypes, mapReducer } from 'reducers';
import { hasRouteParameter, replaceRouteParameter } from 'utils';
import { PageContext } from 'contexts';

// Create a context for the app configuration
export const MapContext = createContext();

const initialState = {
  layers: {}, // Changed from an array to an object
  visualisations: [],
  metadataLayers: [],
  filters: [],
  map: null,
  isMapReady: false
};

// Create a custom hook to use the app config context
export const MapProvider = ({ children }) => {
  const pageContext = useContext(PageContext);
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const contextValue = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    // Initialise non-parameterised layers
    const nonParameterisedLayers = pageContext.config.layers.filter(layer => !hasRouteParameter(layer.path));
    nonParameterisedLayers.forEach(layer => {
      // Fetch and add non-parameterized layers to the map
      dispatch({ type: actionTypes.ADD_LAYER, payload: { [layer.name]: layer } });
    });

    // Initialise parameterised layers based on corresponding filters
    const parameterisedLayers = pageContext.config.layers.filter(layer => hasRouteParameter(layer.path));
    parameterisedLayers.forEach(layer => {
      // Extract the route parameter name from the layer path
      const paramName = layer.path.match(/\{(.+?)\}/)[1];
      // Find the corresponding filter in the sidebar
      const filter = pageContext.config.filters.find(f => f.paramName === paramName);
      if (filter) {
        // Replace parameter in the layer path with filter value
        const updatedPath = replaceRouteParameter(layer.path, paramName, filter.values.values[0].paramValue); // Assuming filter.values contains the parameter value
        // Dispatch action to add the parameterised layer to the map with updated path
        dispatch({ 
          type: actionTypes.ADD_LAYER, 
          payload: { [layer.name]: { ...layer, path: updatedPath, pathTemplate: layer.path } } 
        });
      }
    });
    return () => {
      console.log("Map context unmount")
      dispatch({
        type: actionTypes.RESET_CONTEXT
      })
    }
  }, [pageContext]);

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};