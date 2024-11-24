import { replaceRouteParameter } from "utils";

// TODO delineate actionTypes into separate namespaces
export const actionTypes = {
  UPDATE_MAP_CENTRE: "UPDATE_MAP_CENTRE",
  UPDATE_MAP_ZOOM: "UPDATE_MAP_ZOOM",
  UPDATE_MAP_STYLE: "UPDATE_MAP_STYLE",
  INITIALISE_SIDEBAR: "INITIALISE_SIDEBAR",
  SET_PAGE_INFO: "SET_PAGE_INFO",
  SET_MAP: "SET_MAP",
  SET_DUAL_MAPS: "SET_DUAL_MAPS",
  ADD_LAYER: "ADD_LAYER",
  ADD_PARAMETERISED_LAYER: "ADD_PARAMETERISED_LAYER",
  UPDATE_PARAMETERISED_LAYER: "UPDATE_PARAMETERISED_LAYER",
  UPDATE_LAYER_PAINT: "UPDATE_LAYER_PAINT",
  ADD_VISUALISATION: "ADD_VISUALISATION",
  UPDATE_QUERY_PARAMS: "UPDATE_QUERY_PARAMS",
  UPDATE_DUAL_QUERY_PARAMS: "UPDATE_DUAL_QUERY_PARAMS",
  UPDATE_ALL_DATA: "UPDATE_ALL_DATA",
  UPDATE_COLOR_SCHEME: "UPDATE_COLOR_SCHEME",
  JOIN_DATA: "JOIN_DATA",
  SET_IS_LOADING: "SET_IS_LOADING",
  SET_LOADING_FINISHED: "SET_LOADING_FINISHED",
  UPDATE_LEGEND_TEXT: "UPDATE_LEGEND_TEXT",
  UPDATE_CLASSIFICATION_METHOD: "UPDATE_CLASSIFICATION_METHOD",
  UPDATE_METADATA_FILTER: "UPDATE_METADATA_FILTER",
  SET_METADATA_TABLES: "SET_METADATA_TABLES",
  SET_FILTERS: "SET_FILTERS",
  RESET_CONTEXT: "RESET_CONTEXT",
  UPDATE_FILTER_VALUES: "UPDATE_FILTER_VALUES",
  SET_SELECTION_MODE: "SET_SELECTION_MODE",
  SET_SELECTED_FEATURES: "SET_SELECTED_FEATURES",
  SET_IS_FEATURE_SELECT_ACTIVE: "SET_IS_FEATURE_SELECT_ACTIVE",
  UPDATE_VISUALISED_FEATURES: "UPDATE_VISUALISED_FEATURES",
  SET_BOUNDS_AND_CENTROID: 'SET_BOUNDS_AND_CENTROID',
  CLEAR_BOUNDS_AND_CENTROID: 'CLEAR_BOUNDS_AND_CENTROID',
  UPDATE_DOWNLOAD_QUERY_PARAMS: "UPDATE_DOWNLOAD_QUERY_PARAMS",
  SET_DRAW_INSTANCE: "SET_DRAW_INSTANCE"
};

/**
 * Reducer function for managing map state.
 * @function mapReducer
 * @param {Object} state - The current state.
 * @param {Object} action - The action to be performed.
 * @property {string} action.type - The type of action.
 * @property {Object} action.payload - The payload of the action.
 * @returns {Object} The new state.
 */
export const mapReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_BOUNDS_AND_CENTROID: {
      const { centroid, bounds } = action.payload;
      return { ...state, mapBoundsAndCentroid: { centroid, bounds } };
    }

    case actionTypes.CLEAR_BOUNDS_AND_CENTROID:
      return { ...state, mapBoundsAndCentroid: null };

    case actionTypes.SET_DRAW_INSTANCE:
      return {
        ...state,
        drawInstance: action.payload,
      };
      
    case actionTypes.UPDATE_VISUALISED_FEATURES: {
      const { filter, value } = action.payload;
      const { layer } = filter;
      const newVisualisedFeatureIds = {
        ...state.visualisedFeatureIds,
        [layer]: value,
      };
      return { ...state, visualisedFeatureIds: newVisualisedFeatureIds };
    }
    case actionTypes.SET_SELECTION_MODE:
      return { ...state, selectionMode: action.payload };
    case actionTypes.SET_SELECTED_FEATURES:
      return { ...state, selectedFeatures: action.payload };
    case actionTypes.SET_IS_FEATURE_SELECT_ACTIVE:
      return { ...state, isFeatureSelectActive: action.payload };
    case actionTypes.UPDATE_MAP_CENTRE:
      return { ...state, mapCentre: action.payload };
    case actionTypes.UPDATE_MAP_ZOOM:
      return { ...state, mapZoom: action.payload };
    case actionTypes.UPDATE_MAP_STYLE:
      return { ...state, mapStyle: action.payload };
    case actionTypes.RESET_CONTEXT:
      return {
        ...state,
        layers: {},
        visualisations: {},
        filters: {},
        leftVisualisations: {},
        rightVisualisations: {},
        isLoading: true,
        pageIsReady: false,
        selectionMode: null,
        selectionLayer: null,
        selectedFeatures: [],
        isFeatureSelectActive: false,
        visualisedFeatureIds: {},
      };
    case actionTypes.SET_PAGE_INFO:
      return { ...state, pageInfo: action.payload };
    case actionTypes.INITIALISE_SIDEBAR:
      return { ...state, filters: action.payload };
    case actionTypes.ADD_LAYER:
      // Logic to add a non-parameterised layer
      return { ...state, layers: { ...state.layers, ...action.payload } };
    case actionTypes.UPDATE_PARAMETERISED_LAYER: {
      // Get the layer name and new parameters from the payload
      const layerName = action.payload.filter.layer;
      const paramName = action.payload.filter.paramName;
      const newParamValue = action.payload.value;

      if (newParamValue == null) {
        // Do not update the layer if value is null
        return state; // Return the current state unmodified
      }

      // Update the path of the layer with the new parameters
      const updatedPath = replaceRouteParameter(
        state.layers[layerName].pathTemplate,
        paramName,
        newParamValue
      );
      // Update the layer in the state
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerName]: {
            ...state.layers[layerName],
            path: updatedPath,
          },
        },
      };
    }
    case actionTypes.UPDATE_LAYER_PAINT: {
      const { layerName, paintProperty } = action.payload;
      return {
        ...state,
        layers: {
          ...state.layers,
          [layerName]: {
            ...state.layers[layerName],
            paint: {
              ...state.layers[layerName].paint,
              ...paintProperty,
            },
          },
        },
      };
    }

    case actionTypes.UPDATE_COLOR_SCHEME: {
      const { color_scheme } = action.payload;
      return {
        ...state,
        color_scheme: color_scheme,
      };
    }

    case actionTypes.UPDATE_CLASSIFICATION_METHOD: {
      const { class_method } = action.payload;
      return {
        ...state,
        class_method: class_method,
      };
    }

    case actionTypes.ADD_VISUALISATION: {
      // Logic to add a visualisation
      const visualisationContent = {
        ...state.visualisations,
        ...action.payload,
      };
      return {
        ...state,
        visualisations: visualisationContent,
        leftVisualisations: visualisationContent,
        rightVisualisations: visualisationContent,
      };
    }

    case actionTypes.UPDATE_QUERY_PARAMS: {
      const visualisationNames = action.payload.filter.visualisations;
      const paramName = action.payload.filter.paramName;
      let newParamValue = action.payload.value;

      // If newParamValue is an array, convert it to a comma-delimited string
      if (Array.isArray(newParamValue)) {
        newParamValue = newParamValue.join(",");
      }

      // Create a new visualisations object with updated query params for each visualisation
      const updatedVisualisations = { ...state.visualisations };
      visualisationNames.forEach((visName) => {
        if (updatedVisualisations[visName]) {
          updatedVisualisations[visName] = {
            ...updatedVisualisations[visName],
            queryParams: {
              ...updatedVisualisations[visName].queryParams,
              [paramName]: newParamValue,
            },
          };
        }
      });

      // Return the new state with updated visualisations
      return {
        ...state,
        visualisations: updatedVisualisations,
      };
    }

    // case actionTypes.UPDATE_DOWNLOAD_QUERY_PARAMS : {
    //   const paramName = action.payload.filter.paramName;
    //   let newParamValue = action.payload.value;

    //   // If newParamValue is an array, convert it to a comma-delimited string
    //   if (Array.isArray(newParamValue)) {
    //     newParamValue = newParamValue.join(",");
    //   }

    //   const downloadParams = {
    //     ...state.downloadParams, [paramName]: newParamValue,
    //   };

    //   console.log(downloadParams);
      
    //   return {
    //     ...state,
    //     downloadParams: downloadParams,
    //   };
    // }

    case actionTypes.UPDATE_DUAL_QUERY_PARAMS: {
      const visualisationNames = action.payload.filter.visualisations;
      const paramName = action.payload.filter.paramName;
      const newParamValue = action.payload.value;
      const updatedVisualisations = (() => {
        switch (action.payload.sides) {
          case "left":
            return [{ ...state.leftVisualisations }];
          case "right":
            return [{ ...state.rightVisualisations }];
          case "both":
            return [
              { ...state.leftVisualisations },
              { ...state.rightVisualisations },
            ];
          default:
            return [{ ...state.leftVisualisations }];
        }
      })();
      updatedVisualisations.forEach((updatedVisualisation) => {
        visualisationNames.forEach((visName) => {
          if (updatedVisualisation[visName]) {
            updatedVisualisation[visName] = {
              ...updatedVisualisation[visName],
              queryParams: {
                ...updatedVisualisation[visName].queryParams,
                [paramName]: newParamValue,
              },
            };
          }
        });
      });
      switch (action.payload.sides) {
        case "left":
          return { ...state, leftVisualisations: updatedVisualisations[0] };
        case "right":
          return { ...state, rightVisualisations: updatedVisualisations[0] };
        case "both":
          return {
            ...state,
            leftVisualisations: updatedVisualisations[0],
            rightVisualisations: updatedVisualisations[1],
          };
        default:
          return { ...state, leftVisualisations: updatedVisualisations[0] };
      }
    }

    case actionTypes.UPDATE_ALL_DATA: {
      const side = action.payload.left;
      switch (side) {
        case true: {
          return {
            ...state,
            leftVisualisations: {
              ...state.leftVisualisations,
              [action.payload.visualisationName]: {
                ...state.leftVisualisations[action.payload.visualisationName],
                data: action.payload.data,
              },
            },
          };
        }
        case false: {
          return {
            ...state,
            rightVisualisations: {
              ...state.rightVisualisations,
              [action.payload.visualisationName]: {
                ...state.rightVisualisations[action.payload.visualisationName],
                data: action.payload.data,
              },
            },
          };
        }
        default:
          return {
            ...state,
            visualisations: {
              ...state.visualisations,
              [action.payload.visualisationName]: {
                ...state.visualisations[action.payload.visualisationName],
                data: action.payload.data,
              },
            },
          };
      }
    }

    case actionTypes.SET_MAP: {
      const { map } = action.payload;
      return {
        ...state,
        map: map, // Store the map instance directly in the state
        color_scheme: { value: "YlGnBu", label: "YLGnBu" }, // Set up the default color scheme on startup only
        class_method: "d",
      };
    }
    case actionTypes.SET_DUAL_MAPS: {
      const { maps } = action.payload;
      return {
        ...state,
        maps: maps, // Store the map instance directly in the state
        color_scheme: { value: "YlGnBu", label: "YlGnBu" }, // Set up the default color scheme on startup only
        class_method: "d",
      };
    }
    case actionTypes.SET_IS_LOADING: {
      return { ...state, isLoading: true };
    }
    case actionTypes.SET_LOADING_FINISHED: {
      return { ...state, isLoading: false };
    }
    case actionTypes.UPDATE_LEGEND_TEXT: {
      const visualisationNames = action.payload.filter.visualisations;
      const newParamValue = action.payload.value;
      const values = action.payload.filter.values.values;
      const position = values.findIndex(
        (value) => value.paramValue === newParamValue
      );
      const required_values = values[position];

      // Create a new visualisations object with updated legend text for the specified visualisation
      const updatedVisualisations = { ...state.visualisations };

      visualisationNames.forEach((visName) => {
        if (updatedVisualisations[visName]) {
          const newLegendText = {
            displayValue: required_values.displayValue,
            legendSubtitleText: required_values.legendSubtitleText,
          };

          updatedVisualisations[visName] = {
            ...updatedVisualisations[visName],
            legendText: [newLegendText], // Replace the existing legendText array with the new one
          };
        }
      });

      // Return the new state with updated visualisations
      return {
        ...state,
        visualisations: updatedVisualisations,
      };
    }
    case actionTypes.UPDATE_METADATA_FILTER: {
      return { ...state, metadataFilters: action.payload.metadataFilters };
    }
    case actionTypes.SET_METADATA_TABLES: {
      return { ...state, metadataTables: action.payload };
    }
    case actionTypes.SET_FILTERS: {
      return { ...state, filters: action.payload };
    }
    case actionTypes.UPDATE_FILTER_VALUES: {
      return { ...state, filters: action.payload.updatedFilters };
    }
    case actionTypes.SET_PAGE_IS_READY: {
      return {
        ...state,
        pageIsReady: action.payload,
      };
    }
    default:
      return state;
  }
};
