import { replaceRouteParameter } from "utils";

// TODO delineate actionTypes into separate namespaces
export const actionTypes = {
    INITIALISE_SIDEBAR: 'INITIALISE_SIDEBAR',
    SET_PAGE_INFO: 'SET_PAGE_INFO',
    ADD_LAYER: 'ADD_LAYER',
    ADD_PARAMETERISED_LAYER: 'ADD_PARAMETERISED_LAYER',
    UPDATE_PARAMETERISED_LAYER: 'UPDATE_PARAMETERISED_LAYER',
    SET_FILTERS: 'SET_FILTERS',
    FETCH_DATA: 'FETCH_DATA',
    JOIN_DATA: 'JOIN_DATA',
    SET_IS_LOADING: 'SET_IS_LOADING'
};

export const mapReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.RESET_CONTEXT:
            return { ...state, layers: [] };
        case actionTypes.SET_PAGE_INFO:
            return { ...state, pageInfo: action.payload} 
        case actionTypes.INITIALISE_SIDEBAR:
            return { ...state, filters: action.payload };
        case actionTypes.ADD_LAYER:
            // Logic to add a non-parameterised layer
            return { ...state, layers: { ...state.layers, ...action.payload } };
        case actionTypes.UPDATE_PARAMETERISED_LAYER:
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
        case actionTypes.SET_FILTERS:
            // Logic to set filters
            break;
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


// const addLayerFromGeoJson = async (map, layers) => {
//     const fetchLayer = async (layer) => {
//       const geojson = await api.geodataService.getLayer(layer)
//       return { id: layer.name, geojson: geojson, geometryType: layer.geometryType };
//     };
  
//     Promise.all(layers.map(fetchLayer))
//       .then((geojsonLayers) => {
//         geojsonLayers.forEach(({ id, geojson, geometryType }) => {
//           if (map.getSource(id)) {
//             return;
//           }
  
//           map.addSource(id, { type: 'geojson', data: geojson });
//           switch (geometryType) {
//             case 'line':
//               map.addLayer({
//                 'id': id,
//                 'type': 'line',
//                 'source': id,
//                 'paint': {
//                   'line-color': 'black',
//                   'line-opacity': 0.8
//                 }
//               });
//               break;
//             case 'polygon':
//               map.addLayer({
//                 'id': id,
//                 'type': 'fill',
//                 'source': id,
//                 'paint': {
//                   'fill-color': 'black',
//                   'fill-opacity': 0.8
//                 }
//               });
//               break;
//             default:
//               break;
//           }
//         });
//       })
//       .catch((error) => console.error('Error fetching GeoJSON:', error));
//   };