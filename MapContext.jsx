import React, { createContext, useEffect, useContext, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { actionTypes, mapReducer } from "reducers";
import {
  hasRouteParameterOrQuery,
  updateUrlParameters,
  extractParamsWithValues,
  processParameters,
  checkSecurityRequirements,
  sortValues,
  isValidCondition,
  applyCondition,
  parseStringToArray,
  isParamNameForceRequired
} from "utils";
import { defaultMapStyle, defaultMapZoom, defaultMapCentre } from "defaults";
import { AppContext, PageContext, FilterContext } from "contexts";
import { api } from "services";

// Create a context for the app configuration
export const MapContext = createContext();

/**
 * Helper function to check for duplicate values in an array.
 * @function isDuplicateValue
 * @param {Array} values - The array of values.
 * @param {Object} value - The value to check for duplicates.
 * @returns {boolean} True if the value is a duplicate, false otherwise.
 */
const isDuplicateValue = (values, value) => {
  return values.some(existingValue => 
    existingValue.paramValue === value.paramValue &&
    existingValue.displayValue === value.displayValue
  );
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
  const { dispatch: filterDispatch } = useContext(FilterContext);

  console.log('pageContext : ', pageContext)
  console.log('appContext : ', appContext);

  // Initialize state within the provider function
  const initialState = {
    mapStyle: appContext.mapStyle || defaultMapStyle,
    mapCentre: pageContext.customMapCentre
      ? parseStringToArray(pageContext.customMapCentre)
      : defaultMapCentre,
    mapZoom: pageContext.customMapZoom
      ? parseFloat(pageContext.customMapZoom)
      : defaultMapZoom,
    layers: {},
    visualisations: {},
    leftVisualisations: {},
    rightVisualisations: {},
    metadataTables: {},
    metadataFilters: [],
    filters: [],
    map: null,
    isMapReady: false,
    isLoading: true,
    pageIsReady: false,
    selectionMode: null,
    selectionLayer: null,
    selectedFeatures: [],
    isFeatureSelectActive: false,
    visualisedFeatureIds: null,
    currentZoom: pageContext.customMapZoom
      ? parseFloat(pageContext.customMapZoom)
      : defaultMapZoom,
  };


  const [state, dispatch] = useReducer(mapReducer, initialState);

  const contextValue = React.useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  useEffect(() => {
    dispatch({ type: actionTypes.SET_IS_LOADING });

    /**
     * Fetch and store metadata tables.
     * @function fetchMetadataTables
     * @returns {Object} Metadata tables.
     */
    const fetchMetadataTables = async () => {
      const metadataTables = {};
      
      for (const table of pageContext.config.metadataTables) {
        try {
          const response = await api.baseService.get(table.path);
          let filteredData = response;

          if (table.where && Array.isArray(table.where)) {
            for (const condition of table.where) {
              if (isValidCondition(condition)) {
                filteredData = applyCondition(filteredData, condition);
              } else {
                console.error(`Invalid condition in metadata table ${table.name}:`, condition);
              }
            }
          }

          metadataTables[table.name] = filteredData;
        } catch (error) {
          console.error(`Failed to fetch metadata table ${table.name}:`, error);
        }
      }

      return metadataTables;
    };

    /**
     * Initialise filters once metadata tables are fetched.
     * @function initializeFilters
     * @param {Object} metadataTables - Fetched metadata tables.
     */
    const initializeFilters = async (metadataTables) => {
      const filters = [];
      const filterState = {};
      const paramNameToUuidMap = {};
      for (const filter of pageContext.config.filters) {
        const filterWithId = { ...filter, id: uuidv4() }; // Add unique ID to each filter
        paramNameToUuidMap[filter.paramName] = filterWithId.id; // Add mapping from paramName to UUID
        switch (filter.type) {
          case 'map':
          case 'slider':
          case 'mapFeatureSelect':
          case 'mapFeatureSelectWithControls':
          case 'mapFeatureSelectAndPan':
            filters.push(filterWithId);
            break;
          default:
            switch (filter.values.source) {
              case 'local':
                filters.push(filterWithId);
                break;
              case 'api':
                const path = '/api/tame/mvdata';
                const dataPath = {
                  dataPath: pageContext.config.visualisations[0].dataPath,
                };
                try {
                  const metadataFilters = await api.baseService.post(path, dataPath, { skipAuth: false });
                  const apiFilterValues = Object.groupBy(
                    metadataFilters,
                    ({ field_name }) => field_name
                  );
                  const baseParamName = filter.paramName.includes('DoMinimum')
                    ? filter.paramName.replace('DoMinimum', '')
                    : filter.paramName.includes('DoSomething')
                    ? filter.paramName.replace('DoSomething', '')
                    : filter.paramName;
                  filter.values.values = apiFilterValues[baseParamName][0].distinct_values.map((v) => ({
                    displayValue: v,
                    paramValue: v,
                  }));
                  filters.push(filterWithId);
                } catch (error) {
                  console.error('Error fetching metadata filters', error);
                }
                break;
              case 'metadataTable':
                const metadataTable = metadataTables[filter.values.metadataTableName];
                if (metadataTable) {
                  let uniqueValues = [];
                  metadataTable.forEach(option => {
                    const value = {
                      displayValue: option[filter.values.displayColumn],
                      paramValue: option[filter.values.paramColumn],
                      legendSubtitleText: option[filter.values?.legendSubtitleTextColumn] || null
                    };
                    if (!isDuplicateValue(uniqueValues, value)) {
                      uniqueValues.push(value);
                    }
                  });

                  // Apply sorting if specified
                  if (filter.values.sort) {
                    uniqueValues = sortValues(uniqueValues, filter.values.sort);
                  }

                  // Apply exclusion if specified
                  if (filter.values.exclude) {
                    uniqueValues = uniqueValues.filter(value => !filter.values.exclude.includes(value.paramValue));
                  }

                  filter.values.values = uniqueValues;
                  filters.push(filterWithId);    
                } else {
                  console.error(`Metadata table ${filter.values.metadataTableName} not found`);
                }
                break;
              default:
                console.error('Unknown filter source:', filter.values.source);
            }
        }

        // Initialize filter value if shouldBeBlankOnInit is not true
        if (!filterWithId.shouldBeBlankOnInit) {
          if (filterWithId.multiSelect && filterWithId.shouldInitialSelectAllInMultiSelect){
            filterState[filterWithId.id] =
              filterWithId.defaultValue ||
              filterWithId.min ||
              filterWithId.values?.values?.map(item => item?.paramValue);}
          else {
            filterState[filterWithId.id] =
              filterWithId.defaultValue ||
              filterWithId.min ||
              filterWithId.values?.values[0]?.paramValue;
          }
        } else {
          filterState[filterWithId.id] = null; // Set to null or undefined to represent no initial selection
        }
      }
      // Incorporate 'sides' logic
      const updatedFilters = filters.map((filter) => {
        if (filter.visualisations[0].includes('Side')) {
          const sides =
            filter.filterName.includes('Left')
              ? 'left'
              : filter.filterName.includes('Right')
              ? 'right'
              : 'both';
          return { ...filter, sides };
        }
        return filter;
      });

      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      filterDispatch({ type: 'INITIALIZE_FILTERS', payload: filterState });
      dispatch({ type: actionTypes.SET_PARAM_NAME_TO_UUID_MAP, payload: paramNameToUuidMap });

      // Set pageIsReady to true once all filters are initialized
      dispatch({ type: actionTypes.SET_PAGE_IS_READY, payload: true });
    };

    /**
     * Main async function to manage the workflow.
     * @function initializeContext
     */
    const initializeContext = async () => {
      // Initialise non-parameterised layers
      const nonParameterisedLayers = pageContext.config.layers.filter(
        (layer) => !hasRouteParameterOrQuery(layer.path)
      );
      nonParameterisedLayers.forEach((layer) => {
        const bufferSize = layer.geometryType === 'line' ? 7 : 0;
        dispatch({ type: actionTypes.ADD_LAYER, payload: { [layer.name]: { ...layer, bufferSize } } });
      });

      // Initialise parameterised layers based on corresponding filters
      const parameterisedLayers = pageContext.config.layers.filter((layer) =>
        hasRouteParameterOrQuery(layer.path)
      );
      
      parameterisedLayers.forEach((layer) => {
        const bufferSize = layer.geometryType === 'line' ? 7 : 0;
      
        // Extract parameters and their values from the layer path
        const allParamsWithValues = extractParamsWithValues(layer.path);
      
        const excludedParams = ['x', 'y', 'z'];
      
        // Process parameters to fill values and find missing ones
        const { params, missingParams } = processParameters(
          allParamsWithValues,
          pageContext.config.filters,
          excludedParams
        );
      
        // Update the path using the extracted and found parameters.
        const updatedPath = updateUrlParameters(layer.path, layer.path, params);
        
        // Dispatch the layer with the updated path and any missing parameters
        dispatch({
          type: actionTypes.ADD_LAYER,
          payload: {
            [layer.name]: {
              ...layer,
              path: updatedPath,
              pathTemplate: layer.path,
              bufferSize,
              missingParams, // Include missing parameters for later use
            },
          },
        });
      });
      

      // Initialise visualisations
      const visualisationConfig = pageContext.config.visualisations;
      const apiSchema = appContext.apiSchema;
      visualisationConfig.forEach((visConfig) => {
        const queryParams = {};
        const apiRoute = visConfig.dataPath;
        const apiParameters = apiSchema.paths[apiRoute]?.get?.parameters || [];
        const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);
      
        apiParameters.forEach((param) => {
          if (param.in === 'query') {
            queryParams[param.name] = {
              value: null,
              required: param.required || isParamNameForceRequired(pageContext.config.filters, param.name) || false, // Use the 'required' property from the schema, default to false
            };
          }
        });
      
        // If no parameters are marked as required, set all to required
        const hasRequiredParams = apiParameters.some(param => param.required);
        if (!hasRequiredParams) {
          Object.keys(queryParams).forEach((key) => {
            queryParams[key].required = true;
          });
        }
      
        const visualisation = {
          ...visConfig,
          dataPath: apiRoute,
          queryParams,
          data: [],
          paintProperty: {},
          requiresAuth,
        };
      
        dispatch({
          type: actionTypes.ADD_VISUALISATION,
          payload: { [visConfig.name]: visualisation },
        });
      });

      // Initialise filters
      const metadataTables = await fetchMetadataTables();
      dispatch({ type: actionTypes.SET_METADATA_TABLES, payload: metadataTables });
      await initializeFilters(metadataTables);

      dispatch({ type: actionTypes.SET_LOADING_FINISHED });
    };

    initializeContext();

    return () => {
      dispatch({
        type: actionTypes.RESET_CONTEXT,
      });
    };
  }, [pageContext]);

  return (
    <MapContext.Provider value={contextValue}>
      {state.pageIsReady ? children : <div>Loading...</div>}
    </MapContext.Provider>
  );
};
