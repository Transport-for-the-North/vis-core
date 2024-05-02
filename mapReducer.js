import { replaceRouteParameter } from "utils";

// TODO delineate actionTypes into separate namespaces
export const actionTypes = {
    INITIALISE_SIDEBAR: 'INITIALISE_SIDEBAR',
    SET_PAGE_INFO: 'SET_PAGE_INFO',
    ADD_LAYER: 'ADD_LAYER',
    ADD_PARAMETERISED_LAYER: 'ADD_PARAMETERISED_LAYER',
    UPDATE_PARAMETERISED_LAYER: 'UPDATE_PARAMETERISED_LAYER',
    ADD_VISUALISATION: 'ADD_VISUALISATION',
    UPDATE_QUERY_PARAMS: 'UPDATE_QUERY_PARAMS',
    FETCH_DATA: 'FETCH_DATA',
    JOIN_DATA: 'JOIN_DATA',
    SET_IS_LOADING: 'SET_IS_LOADING'
};

export const mapReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.RESET_CONTEXT:
            return { ...state, layers: {}, visualisations: {} };
        case actionTypes.SET_PAGE_INFO:
            return { ...state, pageInfo: action.payload} 
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
        case actionTypes.ADD_VISUALISATION: {
            // Logic to add a visualisation
            return { ...state, visualisations: { ...state.visualisations, ...action.payload } };
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
        case actionTypes.FETCH_DATA:
            // Logic to fetch data
            break;
        case actionTypes.JOIN_DATA:
            // Logic to join data
            break;
        case actionTypes.SET_IS_LOADING:
            return { ...state, isLoading: true };
        case actionTypes.SET_LOADING_FINISHED:
            return { ...state, isLoading: false };
        default:
            return state;
    }
};