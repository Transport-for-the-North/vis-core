import React, { createContext, useEffect, useContext, useReducer } from "react";
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
  getGetParameters,
  buildParamsMap,
  getDefaultLayerBufferSize,
  applyWhereConditions,
  buildDeterministicFilterId
} from "utils";
import { defaultMapStyle, defaultMapZoom, defaultMapCentre } from "defaults";
import { AppContext, PageContext, FilterContext } from "contexts";
import { api } from "services";
import { ErrorOverlay } from "Components";

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
    isDynamicStylingLoading: false,
    pageIsReady: false,
    metadataError: null,
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
      const emptyTables = [];
      
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
          
          // Check if table is empty
          if (!Array.isArray(filteredData) || filteredData.length === 0) {
            emptyTables.push(table.name);
          }
        } catch (error) {
          console.error(`Failed to fetch metadata table ${table.name}:`, error);
          emptyTables.push(table.name);
        }
      }

      return { metadataTables, emptyTables };
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
      const usedFilterIds = new Set();

      for (const filter of pageContext.config.filters) {
        // Build deterministic ID for each filter
        const deterministicId = buildDeterministicFilterId(filter, usedFilterIds);
        const filterWithId = { ...filter, id: deterministicId };
        paramNameToUuidMap[filter.paramName] = filterWithId.id; // Add mapping from paramName to UUID

        
      // Keep the existing action naming for compatibility; value is no longer a UUID
      paramNameToUuidMap[filter.paramName] = filterWithId.id;
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
                if (metadataTable && Array.isArray(metadataTable) && metadataTable.length > 0) {
                  // NEW: apply "where" clause to restrict rows before building values
                  let rows = metadataTable;
                  if (filter.values.where) {
                    rows = applyWhereConditions(metadataTable, filter.values.where);
                  }

                  let uniqueValues = [];
                  rows.forEach(option => {
                    const value = {
                      displayValue: option[filter.values.displayColumn],
                      paramValue: option[filter.values.paramColumn],
                      legendSubtitleText: option[filter.values?.legendSubtitleTextColumn] || null,
                      infoOnHover: option[filter.values?.infoOnHoverColumn] ?? null,
                      infoBelowOnChange: option[filter.values?.infoBelowOnChangeColumn] ?? null,
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
                  console.error(`Metadata table ${filter.values.metadataTableName} not found or empty`);
                }
                break;

              default:
                console.error('Unknown filter source:', filter.values.source);
            }
        }

        // Initialize filter value if shouldBeBlankOnInit is not true
        if (!filterWithId.shouldBeBlankOnInit) {
          if (filterWithId.multiSelect && filterWithId.shouldInitialSelectAllInMultiSelect) {
            filterState[filterWithId.id] =
              filterWithId.defaultValue ||
              filterWithId.min ||
              filterWithId.values?.values?.map(item => item?.paramValue);
          } else {
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
        const bufferSize = getDefaultLayerBufferSize(layer.geometryType, layer?.bufferSize);
        dispatch({ type: actionTypes.ADD_LAYER, payload: { [layer.name]: { ...layer, bufferSize } } });
      });

      // Initialise parameterised layers based on corresponding filters
      const parameterisedLayers = pageContext.config.layers.filter((layer) =>
        hasRouteParameterOrQuery(layer.path)
      );
      
      parameterisedLayers.forEach((layer) => {
        const bufferSize = getDefaultLayerBufferSize(layer.geometryType, layer?.bufferSize);
      
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
        const apiRoute = visConfig.dataPath;

        // Collect all GET parameters (path-level + operation-level)
        const apiParameters = getGetParameters(apiSchema, apiRoute);

        // Build query and path params maps
        const queryParams = buildParamsMap(apiParameters, 'query', pageContext.config.filters);
        const pathParams = buildParamsMap(apiParameters, 'path', pageContext.config.filters);

        const requiresAuth = checkSecurityRequirements(apiSchema, apiRoute);

        // If no parameters are marked as required in the schema, set all to required
        const hasRequiredParams = apiParameters.some((param) => param.required);
        if (!hasRequiredParams) {
          Object.keys(queryParams).forEach((key) => {
            queryParams[key].required = true;
          });
          Object.keys(pathParams).forEach((key) => {
            pathParams[key].required = true;
          });
        }
      
        const visualisation = {
          ...visConfig,
          dataPath: apiRoute,
          queryParams,
          pathParams,
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
      const { metadataTables, emptyTables } = await fetchMetadataTables();
      
      // Check if any required metadata tables are empty
      if (emptyTables.length > 0) {
        dispatch({ 
          type: actionTypes.SET_METADATA_ERROR, 
          payload: emptyTables 
        });
        dispatch({ type: actionTypes.SET_LOADING_FINISHED });
        return;
      }
      
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
      {state.metadataError ? (
        <ErrorOverlay
          title="Configuration Error"
          subtitle="Unable to Load Page"
          message={
            state.metadataError.length === 1
              ? `The metadata table is empty or contains no valid data. This page requires valid metadata to function properly.`
              : `${state.metadataError.length} metadata tables are empty or contain no valid data. This page requires valid metadata to function properly.`
          }
          supportMessage="Please contact support for assistance"
          supportDetails="This issue typically indicates a data configuration problem that requires administrative attention."
          technicalDetails={
            state.metadataError.length === 1 ? (
              <>
                <div style={{ marginBottom: '8px' }}>
                  Metadata table: <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '3px', fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#1976d2' }}>{state.metadataError[0]}</code>
                </div>
                <div>Error: Table "{state.metadataError[0]}" returned no data from the API.</div>
              </>
            ) : (
              <>
                <div style={{ marginBottom: '8px' }}>
                  Empty metadata tables ({state.metadataError.length}):
                </div>
                {state.metadataError.map((table, index) => (
                  <div key={index} style={{ marginBottom: '4px' }}>
                    • <code style={{ background: '#e3f2fd', padding: '2px 6px', borderRadius: '3px', fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#1976d2' }}>{table}</code>
                  </div>
                ))}
              </>
            )
          }
        />
      ) : state.pageIsReady ? (
        children
      ) : (
        <div>Loading...</div>
      )}
    </MapContext.Provider>
  );
};
