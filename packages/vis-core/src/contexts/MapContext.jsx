import React, { createContext, useEffect, useContext, useReducer } from "react";
import { actionTypes, mapReducer, errorActionTypes } from "reducers";
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
  buildDeterministicFilterId,
  getInitialFilterValue,
  buildCategoricalLegendKey
} from "utils";
import { defaultMapStyle, defaultMapZoom, defaultMapCentre } from "defaults";
import { AppContext, PageContext, FilterContext } from "contexts";
import { ErrorContext } from "./ErrorContext";
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
 * Builds initial categorical cache entries from filter values that define explicit colours.
 *
 * @param {Array} filters - The configured filters for the page.
 * @returns {Object} A cache seed keyed by categorical legend key.
 */
const buildCacheSeedFromFilters = (filters = []) => {
  return filters.reduce((cacheSeed, filter) => {
    const filterValues = filter?.values?.values;
    if (!Array.isArray(filterValues)) {
      return cacheSeed;
    }

    const fieldName = filter.legendCacheField || filter.valueField || filter.paramName;

    filterValues.forEach((valueItem) => {
      if (typeof valueItem?.colourValue !== "string" || valueItem.colourValue.trim() === "") {
        return;
      }

      const value = valueItem.paramValue ?? valueItem.value ?? valueItem.displayValue;
      const legendCacheKey = buildCategoricalLegendKey({ fieldName, value });
      if (!legendCacheKey) {
        return;
      }

      cacheSeed[legendCacheKey] = {
        label: valueItem.displayValue ?? String(value ?? "").trim(),
        colour: valueItem.colourValue,
        fieldName: String(fieldName ?? "").trim() || "value",
        schemeName: filter.schemeName ?? null,
      };
    });

    return cacheSeed;
  }, {});
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
  const errorContext = useContext(ErrorContext);
  const errorDispatch = errorContext?.dispatch ?? (() => {}); // no-op if provider missing

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
    categoricalLegendCache: {},
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
      const emptyMetadataFilters = [];
      const usedFilterIds = new Set();

      for (const filter of pageContext.config.filters) {
        // Build deterministic ID for each filter
        const deterministicId = buildDeterministicFilterId(filter, usedFilterIds);
        const filterWithId = { ...filter, id: deterministicId };
        paramNameToUuidMap[filter.paramName] = filterWithId.id; // Add mapping from paramName to UUID

        switch (filterWithId.type) {
          case 'map':
          case 'slider':
          case 'mapFeatureSelect':
          case 'mapFeatureSelectWithControls':
          case 'mapFeatureSelectAndPan':
          case 'mapViewport':
            filters.push(filterWithId);
            break;

          default:
            // Some filter types don't define `values` (or configs may be incomplete).
            // Don't hard-crash the page; log and treat as a value-less filter.
            if (!filterWithId.values || !filterWithId.values.source) {
              console.error(
                "[MapContext] Filter is missing `values.source`. This filter will be initialised without selectable values:",
                filterWithId
              );
              filters.push(filterWithId);
              break;
            }

            switch (filterWithId.values.source) {
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
                  const baseParamName = filterWithId.paramName.includes('DoMinimum')
                    ? filterWithId.paramName.replace('DoMinimum', '')
                    : filterWithId.paramName.includes('DoSomething')
                    ? filterWithId.paramName.replace('DoSomething', '')
                    : filterWithId.paramName;
                  filterWithId.values.values = apiFilterValues[baseParamName][0].distinct_values.map((v) => ({
                    displayValue: v,
                    paramValue: v,
                  }));
                  filters.push(filterWithId);
                } catch (error) {
                  console.error('Error fetching metadata filters', error);
                }
                break;

              case 'metadataTable':
                const metadataTable = metadataTables[filterWithId.values.metadataTableName];
                if (metadataTable && Array.isArray(metadataTable) && metadataTable.length > 0) {
                  // NEW: apply "where" clause to restrict rows before building values
                  let rows = metadataTable;
                  if (filterWithId.values.where) {
                    rows = applyWhereConditions(metadataTable, filterWithId.values.where);
                  }

                  let uniqueValues = [];
                  rows.forEach(option => {
                    const value = {
                      displayValue: option[filterWithId.values.displayColumn],
                      paramValue: option[filterWithId.values.paramColumn],
                      legendSubtitleText: option[filterWithId.values?.legendSubtitleTextColumn] || null,
                      infoOnHover: option[filterWithId.values?.infoOnHoverColumn] ?? null,
                      infoBelowOnChange: option[filterWithId.values?.infoBelowOnChangeColumn] ?? null,
                    };
                    if (!isDuplicateValue(uniqueValues, value)) {
                      uniqueValues.push(value);
                    }
                  });

                  // Apply sorting if specified
                  if (filterWithId.values.sort) {
                    uniqueValues = sortValues(uniqueValues, filterWithId.values.sort);
                  }

                  // Apply exclusion if specified
                  if (filterWithId.values.exclude) {
                    uniqueValues = uniqueValues.filter(value => !filterWithId.values.exclude.includes(value.paramValue));
                  }

                  filterWithId.values.values = uniqueValues;

                  if (uniqueValues.length === 0) {
                    emptyMetadataFilters.push({
                      filterName: filterWithId.filterName,
                      paramName: filterWithId.paramName,
                      metadataTableName: filterWithId.values.metadataTableName,
                    });
                  }

                  filters.push(filterWithId);
                } else {
                  console.error(`Metadata table ${filterWithId.values.metadataTableName} not found or empty`);
                }
                break;

              default:
                console.error('Unknown filter source:', filterWithId.values.source);
            }
        }

        // Initialize filter value using getInitialFilterValue utility
        // This will check for persisted state first, then fall back to defaults
        filterState[filterWithId.id] = getInitialFilterValue(filterWithId);
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

      if (emptyMetadataFilters.length > 0) {
        console.warn('[MapContext] empty metadata filters detected', {
          pageName: pageContext.pageName,
          emptyMetadataFilters,
          filterStateKeys: Object.keys(filterState),
        });
        console.log('[MapContext] ErrorContext availability before SET_ERROR', {
          hasErrorContext: !!errorContext,
          hasErrorDispatch: typeof errorContext?.dispatch === 'function',
        });

        const technicalDetails = emptyMetadataFilters
          .map(
            ({ filterName, paramName, metadataTableName }) =>
              `Filter: ${filterName || paramName}\nParameter: ${paramName}\nMetadata table: ${metadataTableName}`
          )
          .join('\n\n');

        errorDispatch({
          type: errorActionTypes.SET_ERROR,
          payload: {
            title: 'No Filter Values Available',
            subtitle: 'A metadata filter returned no values',
            message:
              emptyMetadataFilters.length === 1
                ? `The filter "${emptyMetadataFilters[0].filterName || emptyMetadataFilters[0].paramName}" has no available values from the API for the current metadata query.`
                : 'One or more filters have no available values from the API for the current metadata query.',
            supportMessage: 'Please contact support if the issue persists.',
            supportDetails: 'The filters listed below were built from metadata, but the filtered API result returned no options.',
            technicalDetails,
          },
        });

        console.warn('[MapContext] continuing initialization so the page can render behind the error overlay', {
          pageName: pageContext.pageName,
        });
      }

      dispatch({ type: actionTypes.SET_FILTERS, payload: updatedFilters });
      const categoricalLegendSeed = buildCacheSeedFromFilters(updatedFilters);
      if (Object.keys(categoricalLegendSeed).length > 0) {
        dispatch({
          type: actionTypes.MERGE_CATEGORICAL_LEGEND_CACHE,
          payload: categoricalLegendSeed,
        });
      }
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
        console.warn('[MapContext] aborting due to empty metadata tables', {
          pageName: pageContext.pageName,
          emptyTables,
        });

        const message =
          emptyTables.length === 1
            ? `The metadata table is empty or contains no valid data. This page requires valid metadata to function properly.`
            : `${emptyTables.length} metadata tables are empty or contain no valid data. This page requires valid metadata to function properly.`;

          const technicalDetails =
            emptyTables.length === 1
              ? `Metadata table: ${emptyTables[0]}\nError: Table "${emptyTables[0]}" returned no data from the API.`
              : `Empty metadata tables (${emptyTables.length}):\n${emptyTables.map((t) => `- ${t}`).join('\n')}`;

          // Dispatch into ErrorContext reducer so MapContext sets SET_ERROR
          errorDispatch({
            type: errorActionTypes.SET_ERROR,
            payload: {
              title: 'Configuration Error',
              subtitle: 'Unable to Load Page',
              message,
              supportMessage: 'Please contact support for assistance',
              supportDetails: 'This issue typically indicates a data configuration problem that requires administrative attention.',
              technicalDetails,
            },
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
      {state.pageIsReady ? children : <div>Loading...</div>}
    </MapContext.Provider>
  );
};
