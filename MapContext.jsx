import React, { createContext, useEffect, useContext, useReducer } from 'react';
import { actionTypes, mapReducer } from 'reducers';
import { hasRouteParameter, replaceRouteParameter } from 'utils';
import { AppContext, PageContext } from 'contexts';

// Create a context for the app configuration
export const MapContext = createContext();

const initialState = {
  layers: {},
  visualisations: {},
  leftVisualisations: {},
  rightVisualisations: {},
  metadataTables: [],
  metadataFilters: [],
  filters: [],
  map: null,
  isMapReady: false,
  isLoading: true
};

/**
 * MapProvider component to manage map-related state and context.
 * @function MapProvider
 * @property {React.ReactNode} children - Child components to be wrapped by the context provider.
 * @returns {JSX.Element} The map context provider component.
 */
export const MapProvider = ({ children }) => {
  const appContext = useContext(AppContext);
  const pageContext = useContext(PageContext);
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const contextValue = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    dispatch({ type: actionTypes.SET_IS_LOADING });
    // Initialise non-parameterised layers
    const nonParameterisedLayers = pageContext.config.layers.filter(layer => !hasRouteParameter(layer.path));
    nonParameterisedLayers.forEach(layer => {
      // Fetch and add non-parameterised layers to the map
      const bufferSize = layer.geometryType === "line" ? 7 : 0;
      dispatch({ type: actionTypes.ADD_LAYER, payload: { [layer.name]: {...layer, bufferSize: bufferSize} } });
    });

    // Initialise parameterised layers based on corresponding filters
    const parameterisedLayers = pageContext.config.layers.filter(layer => hasRouteParameter(layer.path));
    parameterisedLayers.forEach(layer => {
      const bufferSize = layer.geometryType === "line" ? 7 : 0;
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
          payload: { [layer.name]: { ...layer, path: updatedPath, pathTemplate: layer.path, bufferSize: bufferSize } } 
        });
      }
    });
    
    // Initialise visualisations
    const visualisationConfig = pageContext.config.visualisations;
    const apiSchema = appContext.apiSchema;
    visualisationConfig.forEach(visConfig => {
      const queryParams = {};
      const apiRoute = visConfig.dataPath;
      const apiParameters = apiSchema.paths[apiRoute]?.get?.parameters || [];
      apiParameters.forEach(param => {
        if (param.in === "query") {
          queryParams[param.name] = null; // To be populated by update param value action
        }
      });
      const visualisation = {
        ...visConfig,
        dataPath: apiRoute,
        queryParams: queryParams,
        data: [], // To be populated by data fetch
        paintProperty: {}
      };
      dispatch({
        type: actionTypes.ADD_VISUALISATION,
        payload: { [visConfig.name]: visualisation }
      });
    });

    return () => {
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