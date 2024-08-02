import React, { createContext, useEffect, useContext, useReducer } from 'react';
import { actionTypes, mapReducer } from 'reducers';
import { hasRouteParameter, replaceRouteParameter } from 'utils';
import { AppContext, PageContext } from 'contexts';
import { api }  from 'services'; // Adjust the import path accordingly

// Create a context for the app configuration
export const MapContext = createContext();

const initialState = {
  layers: {},
  visualisations: {},
  leftVisualisations: {},
  rightVisualisations: {},
  metadataTables: {},
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
  
    // Fetch and store metadata tables
    const fetchMetadataTables = async () => {
      const metadataTables = {};
      for (const table of pageContext.config.metadataTables) {
        try {
          const response = await api.baseService.get(table.path);
          console.log(`Fetched metadata table ${table.name}:`, response); // Add logging
          metadataTables[table.name] = response;
        } catch (error) {
          console.error(`Failed to fetch metadata table ${table.name}:`, error);
        }
      }
      dispatch({ type: actionTypes.SET_METADATA_TABLES, payload: metadataTables });
    };
  
    fetchMetadataTables();
  
    // Initialise non-parameterised layers
    const nonParameterisedLayers = pageContext.config.layers.filter(layer => !hasRouteParameter(layer.path));
    nonParameterisedLayers.forEach(layer => {
      const bufferSize = layer.geometryType === "line" ? 7 : 0;
      dispatch({ type: actionTypes.ADD_LAYER, payload: { [layer.name]: {...layer, bufferSize: bufferSize} } });
    });
  
    // Initialise parameterised layers based on corresponding filters
    const parameterisedLayers = pageContext.config.layers.filter(layer => hasRouteParameter(layer.path));
    parameterisedLayers.forEach(layer => {
      const bufferSize = layer.geometryType === "line" ? 7 : 0;
      const paramName = layer.path.match(/\{(.+?)\}/)[1];
      const filter = pageContext.config.filters.find(f => f.paramName === paramName);
      if (filter) {
        const updatedPath = replaceRouteParameter(layer.path, paramName, filter.values.values[0].paramValue);
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
          queryParams[param.name] = null;
        }
      });
      const visualisation = {
        ...visConfig,
        dataPath: apiRoute,
        queryParams: queryParams,
        data: [],
        paintProperty: {}
      };
      dispatch({
        type: actionTypes.ADD_VISUALISATION,
        payload: { [visConfig.name]: visualisation }
      });
    });
  
    // Initialise filters
    const initializeFilters = async () => {
      const filters = [];
      for (const filter of pageContext.config.filters) {
        switch (filter.type) {
          case "map":
          case "slider":
            filters.push(filter);
            break;
          default:
            switch (filter.values.source) {
              case "local":
                filters.push(filter);
                break;
              case "api":
                const path = "/api/tame/mvdata";
                const dataPath = {
                  dataPath: pageContext.config.visualisations[0].dataPath,
                };
                try {
                  const metadataFilters = await api.baseService.post(path, dataPath, {
                    skipAuth: false,
                  });
                  console.log('Fetched metadata filters:', metadataFilters); // Add logging
                  const apiFilterValues = Object.groupBy(
                    metadataFilters,
                    ({ field_name }) => field_name
                  );
                  const baseParamName = filter.paramName.includes("DoMinimum")
                    ? filter.paramName.replace("DoMinimum", "")
                    : filter.paramName.includes("DoSomething")
                    ? filter.paramName.replace("DoSomething", "")
                    : filter.paramName;
                  filter.values.values = apiFilterValues[baseParamName][0].distinct_values.map(v => ({
                    displayValue: v,
                    paramValue: v
                  }));
                  console.log(`Updated filter values for ${filter.filterName}:`, filter.values.values); // Add logging
                  filters.push(filter);
                } catch (error) {
                  console.error("Error fetching metadata filters", error);
                }
                break;
              case "metadataTable":
                const metadataTable = state.metadataTables[filter.metadataTableName];
                filter.values.values = metadataTable.map(option => ({
                  displayValue: option[filter.displayColumn],
                  paramValue: option[filter.paramColumn]
                }));
                filters.push(filter);
                break;
              default:
                console.error("Unknown filter source:", filter.values.source);
            }
        }
      }
    
      // Incorporate 'sides' logic
      const updatedFilters = filters.map(filter => {
        if (filter.visualisations[0].includes("Side")) {
          const sides = filter.filterName.includes("Left") ? "left" :
                        filter.filterName.includes("Right") ? "right" : "both";
          return { ...filter, sides };
        }
        return filter;
      });
    
      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      console.log('Updated filters:', updatedFilters); // Add logging
    };
  
    initializeFilters();
  
    return () => {
      dispatch({
        type: actionTypes.RESET_CONTEXT
      });
    };
  }, [pageContext]);

  return (
    <MapContext.Provider value={contextValue}>
      {children}
    </MapContext.Provider>
  );
};