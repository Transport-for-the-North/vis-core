export const appConfig = {
    title: "TAME React Template",
    introduction: 
        "This is a sample React app created using TAME React Components.",
    background:
        "",
    contactText:
        "Contact us",
    contactEmail:
        "abrereton-halls@systra.com",
    appPages: [
        {
            pageName: "Reliability",
            url: "/reliability",
            type: "MapLayout",
            config: {
                layers: [
                    {
                        name: "BSIP Zone NE",
                        type: "geojson",
                        source: "api",
                        path: "/api/zones/2", // matches the path in swagger.json
                        geojsonField: "geojson",
                        geometryType: "polygon"
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
                        filterName: "Base timetable",
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
                        filterName: "Adjusted timetable",
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
        },
        {
            pageName: "NoHAM Links",
            url: "/noham-links",
            type: "MapLayout",
            config: {
                layers: [
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
                        name: "Links",
                        type: "geojson",
                        style: "categorical",
                        valueField: "id",
                        source: "api",
                        path: "/api/noham/link-results"
                    }
                ],
                metadataLayers: [
                ],
                filters: [
                    {
                        filterName: "Network scenario",
                        paramName: "networkScenarioName",
                        target: "api",
                        action: "GET_VIS_DATA",
                        layer: "NoHAM Links",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "Base",
                                    id: "base"
                                
                                },
                                { 
                                    friendly: "Do minimum",
                                    id: "dm"
                                
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Demand scenario",
                        paramName: "demandScenarioName",
                        target: "api",
                        action: "GET_VIS_DATA",
                        layer: "NoHAM Links",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "Base",
                                    id: "base"
                                
                                },
                                { 
                                    friendly: "Core",
                                    id: "core"
                                
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Year",
                        paramName: "year",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "NoHAM Links",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "2018",
                                    id: 2018
                                
                                },
                                { 
                                    friendly: "2033",
                                    id: 2033
                                
                                }                                
                            ]
                        }
                    },
                    {
                        filterName: "Time period",
                        paramName: "timePeriodCode",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisation: "NoHAM Links",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    friendly: "AM",
                                    id: "am"
                                
                                },
                                { 
                                    friendly: "IP",
                                    id: "ip"
                                
                                },
                                { 
                                    friendly: "PM",
                                    id: "pm"
                                
                                }                              
                            ]
                        }
                    }
                ]
            }
        }
    ] 
}