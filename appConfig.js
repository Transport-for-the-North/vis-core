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
                        uniqueId: "BsipZone",
                        name: "BSIP Zone",
                        type: "geojson",
                        source: "api",
                        path: "/api/zones/{zoneTypeId}", // matches the path in swagger.json
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
                        action: "UPDATE_PARAMETERISED_LAYER",
                        layer: "BSIP Zone",
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    displayValue: "North East MSOA",
                                    paramValue: 2
                                
                                },
                                { 
                                    displayValue: "North West MSOA",
                                    paramValue: 3
                                
                                },
                                { 
                                    displayValue: "Yorkshire and Humber MSOA",
                                    paramValue: 4
                                
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
                                    displayValue: "2024-04-09",
                                    paramValue: 2
                                
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
                                    displayValue: "2024-04-09 Dummy",
                                    paramValue: 7
                                
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
                        type: "joinDataToMap",
                        joinLayer: "NoHAM Links",
                        style: "line-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/noham/link-results"
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
                        visualisations: ["NoHAM Links"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    displayValue: "Base",
                                    paramValue: "base"
                                
                                },
                                { 
                                    displayValue: "Do minimum",
                                    paramValue: "dm"
                                
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Demand scenario",
                        paramName: "demandScenarioName",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisations: ["NoHAM Links"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    displayValue: "Base",
                                    paramValue: "base"
                                
                                },
                                { 
                                    displayValue: "Core",
                                    paramValue: "core"
                                
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Year",
                        paramName: "year",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisations: ["NoHAM Links"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    displayValue: "2018",
                                    paramValue: 2018
                                
                                },
                                { 
                                    displayValue: "2033",
                                    paramValue: 2033
                                
                                }                                
                            ]
                        }
                    },
                    {
                        filterName: "Time period",
                        paramName: "timePeriodCode",
                        target: "api",
                        action: "GET_VIS_DATA",
                        visualisations: ["NoHAM Links"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { 
                                    displayValue: "AM",
                                    paramValue: "am"
                                
                                },
                                { 
                                    displayValue: "IP",
                                    paramValue: "ip"
                                
                                },
                                { 
                                    displayValue: "PM",
                                    paramValue: "pm"
                                
                                }                              
                            ]
                        }
                    }
                ]
            }
        }
    ] 
}