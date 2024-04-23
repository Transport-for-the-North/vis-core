const config = {
    appPages: [
        {
            pageName: "Reliability",
            url: "/reliability",
            config: {
                type: "MatrixSelectionMap",
                layers: [
                    {
                        name: "BSIP Zone",
                        type: "geojson",
                        source: "api",
                        path: "/api/zones/2", // matches the path in swagger.json
                        geojsonField: "geojson",
                        geometryType: "polygon"
                    },
                    {
                        name: "NoHAM Links",
                        type: "geojson",
                        source: "api",
                        path: "/api/noham/links",
                        geometryType: "line"
                    },
                ],
                visualisations: [
                    {
                        name: "Reliability",
                        type: "geojson",
                        style: "categorical",
                        valueField: "id",
                        source: "api",
                        path: "/api/bsip/reliability"
                    }
                ],
                metadataLayers: [
                    {
                        name: "reliabilityOptions",
                        source: "api",
                        path: "/bsip/reliabilityoptions"
                        
                    }
                ],
                filters: [
                    {
                        filterName: "Region",
                        paramName: "zoneTypeId",
                        target: "api",
                        action: "GET_GEOMETRY",
                        layer: "BSIP Zone",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "North East MSOA",
                                    id: 1
                                
                                },
                                { 
                                    friendly: "North West MSOA",
                                    id: 2
                                
                                },
                                { 
                                    friendly: "Yorkshire and Humber MSOA",
                                    id: 3
                                
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Base timetable ID",
                        paramName: "baseTimetableId",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "Reliability",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "2024-04-09",
                                    id: 2
                                
                                }                                
                            ]
                        }
                    },
                    {
                        filterName: "Adjusted timetable ID",
                        paramName: "adjustedTimetableId",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "Reliability",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "2024-04-09 Dummy",
                                    id: 7
                                
                                }                                
                            ]
                        }
                    },
                    {
                        filterName: "Median duration (secs)",
                        paramName: "medianDurationSecs",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "Reliability",
                        type: "slider",
                        min: 0,
                        max: 12000,
                        interval: 300
                    },
                    {
                        filterName: "Origin Zone ID",
                        paramName: "originZoneId",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "Reliability",
                        type: "map",
                        layer: "BSIP Zone",
                        field: "zone_id"
                    }
                ]
            }
        }
    ] 
}

export default config