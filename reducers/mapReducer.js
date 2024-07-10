import { replaceRouteParameter } from "utils";

// TODO delineate actionTypes into separate namespaces
export const actionTypes = {
    INITIALISE_SIDEBAR: 'INITIALISE_SIDEBAR',
    SET_PAGE_INFO: 'SET_PAGE_INFO',
    SET_MAP: 'SET_MAP',
    ADD_LAYER: 'ADD_LAYER',
    ADD_PARAMETERISED_LAYER: 'ADD_PARAMETERISED_LAYER',
    UPDATE_PARAMETERISED_LAYER: 'UPDATE_PARAMETERISED_LAYER',
    UPDATE_LAYER_PAINT: 'UPDATE_LAYER_PAINT',
    ADD_VISUALISATION: 'ADD_VISUALISATION',
    UPDATE_QUERY_PARAMS: 'UPDATE_QUERY_PARAMS',
    UPDATE_DUAL_QUERY_PARAMS: 'UPDATE_DUAL_QUERY_PARAMS',
    UPDATE_ALL_DATA: 'UPDATE_ALL_DATA',
    UPDATE_COLOR_SCHEME: 'UPDATE_COLOR_SCHEME',
    JOIN_DATA: 'JOIN_DATA',
    SET_IS_LOADING: 'SET_IS_LOADING',
    SET_LOADING_FINISHED: 'SET_LOADING_FINISHED',
    UPDATE_CLASSIFICATION_METHOD: 'UPDATE_CLASSIFICATION_METHOD'
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
        case actionTypes.RESET_CONTEXT:
            return { ...state, layers: {}, visualisations: {}, leftVisualisations: {}, rightVisualisations: {}, isLoading: true };
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
            // Update the path of the layer with the new parameters
            const updatedPath = replaceRouteParameter(state.layers[layerName].pathTemplate, paramName, newParamValue);
            // Update the layer in the state
            return {
                ...state,
                layers: {
                    ...state.layers,
                    [layerName]: {
                        ...state.layers[layerName],
                        path: updatedPath
                    }
                }
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
                class_method: class_method
            };
        }

        case actionTypes.ADD_VISUALISATION: {
            // Logic to add a visualisation
            const visualisationContent = { ...state.visualisations, ...action.payload };
            return { ...state, visualisations: visualisationContent, leftVisualisations: visualisationContent, rightVisualisations: visualisationContent };
        }

        case actionTypes.UPDATE_QUERY_PARAMS: {
            const visualisationNames = action.payload.filter.visualisations;
            const paramName = action.payload.filter.paramName;
            const newParamValue = action.payload.value;

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

        case actionTypes.UPDATE_DUAL_QUERY_PARAMS: {
            const visualisationNames = action.payload.filter.visualisations;
            const paramName = action.payload.filter.paramName;
            const newParamValue = action.payload.value;
            const updatedVisualisations = (() => {
                switch (action.payload.sides) {
                    case "left": return [{ ...state.leftVisualisations }];
                    case "right": return [{ ...state.rightVisualisations }];
                    case "both": return [{ ...state.leftVisualisations }, { ...state.rightVisualisations }];
                    default: return [{ ...state.leftVisualisations }];
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
            })
            switch (action.payload.sides) {
                case "left": return { ...state, leftVisualisations: updatedVisualisations[0] };
                case "right": return { ...state, rightVisualisations: updatedVisualisations[0] };
                case "both": return { ...state, leftVisualisations: updatedVisualisations[0], rightVisualisations: updatedVisualisations[1] };
                default: return { ...state, leftVisualisations: updatedVisualisations[0] };
            }
            // return { ...state, leftVisualisations: updatedVisualisations };
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
                default: return {
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
                map: map,// Store the map instance directly in the state
                color_scheme: { value: "Reds", label: 'Reds' } //Set up the default color scheme on startup only
            };
        }
        case actionTypes.SET_IS_LOADING: {
            console.log('Loading started');
            return { ...state, isLoading: true };
        }
        case actionTypes.SET_LOADING_FINISHED: {
            console.log('Loading finished');
            return { ...state, isLoading: false };
        }
        default:
            return state;
    }
};