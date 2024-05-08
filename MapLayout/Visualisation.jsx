import chroma from 'chroma-js';
import colorbrewer from 'colorbrewer';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useMapContext } from 'hooks';
import { actionTypes } from 'reducers';
import { api } from 'services';

// Debounced fetchDataForVisualisation function
const fetchDataForVisualisation = debounce(async (visualisation, dispatch, setLoading) => {
    console.log("sucess")
    if (visualisation && visualisation.queryParams) {
        setLoading(true); // Set loading to true
        const path = visualisation.dataPath;
        const queryParams = visualisation.queryParams;
        const visualisationName = visualisation.name
        try {
            const data = await api.baseService.get(path, { queryParams });
            dispatch({
                type: actionTypes.UPDATE_VIS_DATA,
                payload: { visualisationName, data },
            });
            setLoading(false); // Set loading to false when finished
        } catch (error) {
            console.error('Error fetching data for visualisation:', error);
            setLoading(false); // Set loading to false in case of error
        }
    }
}, 1500);

export const Visualisation = ({ visualisationName }) => {
    const { state, dispatch } = useMapContext();
    const [isLoading, setLoading] = useState(false); // State to track loading
    const prevDataRef = useRef();
    const prevQueryParamsRef = useRef();
    const visualisation = state.visualisations[visualisationName];

    // Function to reclassify data and update the map style
    const reclassifyAndStyleMap = useCallback((data) => {
        // Reclassify data if needed
        const reclassifiedData = reclassifyData(data);

        const colourPalette = calculateColours("rgb", reclassifiedData);

        // Update the map style based on the type of map, reclassified data, and color palette
        const paintProperty = createPaintProperty(reclassifiedData, visualisation.style, colourPalette);
        dispatch({
            type: 'UPDATE_MAP_STYLE',
            payload: { visualisationName, paintProperty },
        });
    }, [visualisation.style, dispatch, visualisationName]);

    // Function to recalculate bins if needed
    const reclassifyData = ((data) => {
        let values = []
        data.map((value) => {
            values.push(value.value)
            return values
        })
        console.log("Bins recalculated")
        return chroma.limits(values, 'q', 4);
    });

    // Function to create a paint property for Maplibre based on the visualisation type and bins
    const createPaintProperty = ((bins, style, colours) => {
        let colors = []
        for (var i = 0; i < bins.length; i++){
            colors.push(bins[i])
            colors.push(colours[i])
        }
            
        switch (style) {
            case 'polygon-continuous':
                return {
                    'fill-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'value'],
                        ...colors,
                    ],
                    'fill-opacity': [
                        "case",
                        ["in", ["feature-state", "value"], ["literal", [0, null]]],
                        0,
                        1.0
                    ],
                };
            case 'line':
                return {
                    'line-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'value'],
                        ...colors,
                    ]
                };
            case 'circle': {
                return {
                    'circle-color': [
                        [
                            'interpolate',
                            ['linear'],
                            ['get', 'value'],
                            ...colors
                        ],
                    ],
                    'circle-stroke-width': [
                        "case",
                        ["in", ["feature-state", "value"], ["literal", [0, null]]],
                        0.0,
                        1.0
                    ],
                    'circle-opacity': [
                        "case",
                        ["in", ["feature-state", "value"], ["literal", [0, null]]],
                        0.0,
                        1.0
                    ],
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['to-number', ['feature-state', 'valueAbs']],
                        ...colors
                    ],
                    'circle-stroke-color': [
                        '#000000'
                    ]
                }
            }
            default:
                return {};
        }
    });

    // Function to calculate the colour palette based on the filters
    const calculateColours = ((colourScheme, bins) => {
        return colorbrewer["Reds"][bins.length]
    })

    useEffect(() => {
        // Stringify the current queryParams for comparison
        const currentQueryParamsStr = JSON.stringify(visualisation.queryParams);

        // Check if all required query parameters are present
        const allParamsPresent = Object.values(visualisation.queryParams).every((param) => param !== null && param !== undefined);
        const queryParamsChanged = prevQueryParamsRef.current !== currentQueryParamsStr;

        if (allParamsPresent && queryParamsChanged) {
            // Fetch data for the visualisation
            fetchDataForVisualisation(visualisation, dispatch, setLoading);

            // Update the ref to the current queryParams
            prevQueryParamsRef.current = currentQueryParamsStr;
        }
    }, [visualisation.queryParams, visualisationName, dispatch]);

    useEffect(() => {
        // Check if the data has changed
        if (visualisation.data.length !== 0 && visualisation.data !== prevDataRef.current) {
            // Reclassify and update the map style
            reclassifyAndStyleMap(visualisation.data);
            // Update the ref to the current data
            prevDataRef.current = visualisation.data;
        }
    }, [visualisation.data, reclassifyAndStyleMap, dispatch]);

    // Log loading status to console
    useEffect(() => {
        if (isLoading) {
            console.log('Visualisation data is loading...');
        } else {
            console.log('Visualisation data finished loading.');
        }
    }, [isLoading]);

    // Data component, renders nothing
    return null;
};
