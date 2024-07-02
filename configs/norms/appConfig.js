const scenarioCodeValues = {
    source: "local",
    values: [
        {
            displayValue: "IGX 2018",
            paramValue: "IGX_2018",
        },
        {
            displayValue: "JPI 2042",
            paramValue: "JPI_2042",
        },
        {
            displayValue: "JRT 2042",
            paramValue: "JRT_2042",
        },
        {
            displayValue: "JRU 2052",
            paramValue: "JRU_2052",
        },
        {
            displayValue: "JRV 2042",
            paramValue: "JRV_2042",
        },
        {
            displayValue: "JRW 2052",
            paramValue: "JRW_2052",
        },
        {
            displayValue: "JRX 2042",
            paramValue: "JRX_2042",
        },
        {
            displayValue: "JRY 2052",
            paramValue: "JRY_2052",
        },
        {
            displayValue: "JRZ 2042",
            paramValue: "JRZ_2042",
        },
        {
            displayValue: "JSA 2052",
            paramValue: "JSA_2052",
        },
        {
            displayValue: "K9N 2042",
            paramValue: "K9N_2042",
        },
        {
            displayValue: "K9O 2052",
            paramValue: "K9O_2052",
        },
        {
            displayValue: "KZI 2042",
            paramValue: "KZI_2042",
        },
        {
            displayValue: "UAA 2042",
            paramValue: "UAA_2042",
        },
        {
            displayValue: "UAB 2052",
            paramValue: "UAB_2052",
        },
        {
            displayValue: "UAC 2042",
            paramValue: "UAC_2042",
        },
        {
            displayValue: "UAD 2052",
            paramValue: "UAD_2052",
        },
        {
            displayValue: "UAE 2042",
            paramValue: "UAE_2042",
        },
        {
            displayValue: "UAF 2052",
            paramValue: "UAF_2052",
        },
    ],
};

const timePeriodCodeValues = {
    source: "local",
    values: [
        {
            displayValue: "All",
            paramValue: "all",
        },
        {
            displayValue: "AM",
            paramValue: "am",
        },
        {
            displayValue: "IP",
            paramValue: "ip",
        },
        {
            displayValue: "OP",
            paramValue: "op",
        },
        {
            displayValue: "PM",
            paramValue: "pm",
        },
    ]
}

const userClassIdValues = {
    source: "local",
    values: [
        {
            displayValue: "All",
            paramValue: "0",
        },
        {
            displayValue: "Business, all car availabilities",
            paramValue: "123",
        },
        {
            displayValue: "Commuting, all car availability",
            paramValue: "456",
        },
        {
            displayValue: "Other, all car availabilities",
            paramValue: "789",
        },
    ]
}

const originOrDestinationValues = {
    source: "local",
    values: [
        {
            displayValue: "Origin",
            paramValue: "origin",
        },
        {
            displayValue: "Destination",
            paramValue: "destination",
        },
    ],
}

const directionIdValues = {
    source: "local",
    values: [
        {
            displayValue: "Access",
            paramValue: "0",
        },
        {
            displayValue: "Egress",
            paramValue: "1",
        },
    ],
}

export const appConfig = {
    title: "TAME React Vis Template",
    introduction: `<p>HTML, or HyperText Markup Language, is the standard markup language used to create web pages. It provides the structure of a webpage, allowing for the insertion of text, images, and other multimedia elements. HTML is not a programming language; it is a markup language that defines the content of web pages.</p>
      <p>HTML documents are made up of elements. These elements are represented by tags, which label pieces of content such as "heading", "paragraph", "list", and so on. Browsers do not display the HTML tags but use them to render the content of the page.</p>
      <h2>Basic HTML Page Structure</h2>
      <p>An HTML document has a defined structure that includes the following main elements:</p>
      <ul>
          <li><strong>DOCTYPE declaration:</strong> Defines the document type and version of HTML.</li>
          <li><strong>html element:</strong> This is the root element that encloses all the content of an HTML document.</li>
          <li><strong>head element:</strong> Contains meta-information about the document, such as its title and links to scripts and stylesheets.</li>
          <li><strong>body element:</strong> Contains the content of the document, such as text, images, and other media.</li>
      </ul>
      <p>Learning HTML is the first step in creating web content and is essential for web developers. It is easy to learn and can be combined with CSS (Cascading Style Sheets) and JavaScript to create interactive and styled web pages.</p>`,
    background: "",
    legalText:
        '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
    contactText: "Please contact [Name] for any questions on this data tool.",
    contactEmail: "firstname.lastname@transportforthenorth.com",
    logoImage: "img/tfn-logo-fullsize.png",
    backgroundImage: "img/hero-image.jpg",
    logoutButtonImage: "img/burgerIcon.png",
    logoutImage: "img/logout.png",
    appPages: [
        {
            pageName: "Station Totals",
            url: "/norms-station-totals",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSNodeVectorTile",
                        name: "NoRMS Nodes",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: false,
                        isStylable: true,
                        shouldHaveTooltipOnClick: true,
                    },
                ],
                visualisations: [
                    {
                        name: "NoRMS Station Totals",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Nodes",
                        style: "circle-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/node-results",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario",
                        paramName: "scenarioCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "Time Period",
                        paramName: "timePeriodCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "propertyName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { paramValue: "Boardings", displayValue: "Boardings" },
                                { paramValue: "Interchanges", displayValue: "Interchanges" },
                                { paramValue: "Egress", displayValue: "Egress" },
                                { paramValue: "Access", displayValue: "Access" },
                                { paramValue: "Alightings", displayValue: "Alightings" }
                            ]
                        },
                    },
                ],
            },
        },
        {
            pageName: "Station Totals Difference",
            url: "/norms-station-totals-difference",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSNodeVectorTile",
                        name: "NoRMS Nodes",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: false,
                        isStylable: true,
                        shouldHaveTooltipOnClick: true,
                    },
                ],
                visualisations: [
                    {
                        name: "NoRMS Station Totals",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Nodes",
                        style: "circle-diverging",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/node-results/difference",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario DS",
                        paramName: "scenarioCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "Time Period DS",
                        paramName: "timePeriodCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Scenario DM",
                        paramName: "scenarioCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "Time Period DM",
                        paramName: "timePeriodCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "propertyName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Totals"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                { paramValue: "Boardings", displayValue: "Boardings" },
                                { paramValue: "Interchanges", displayValue: "Interchanges" },
                                { paramValue: "Egress", displayValue: "Egress" },
                                { paramValue: "Access", displayValue: "Access" },
                                { paramValue: "Alightings", displayValue: "Alightings" }
                            ]
                        },
                    },
                ],
            },
        },
        {
            pageName: "Station Pairs",
            url: "/norms-station-pair",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSStationPairVectorTile",
                        name: "NoRMS Station Pair Result",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "StationPair",
                        isHoverable: true,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "StationPair",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Station Pair Result",
                        style: "circle-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/station-pair-results",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario",
                        paramName: "scenarioCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "Time Period",
                        paramName: "timePeriodCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "User",
                        paramName: "userClassId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Direction",
                        paramName: "originOrDestination",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "toggle",
                        values: originOrDestinationValues,
                    },
                    {
                        filterName: "Column Name",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                {
                                    displayValue: "Demand",
                                    paramValue: "demand",
                                },
                                {
                                    displayValue: "Generalised Cost",
                                    paramValue: "gen_cost",
                                },
                                {
                                    displayValue: "Generalised Journey Time",
                                    paramValue: "gen_jt",
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Please select a station in the map",
                        paramName: "nodeId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPair"],
                        type: "map",
                        layer: "NoRMS Station Pair Result",
                        field: "id",
                    }
                ],
            },
        },
        {
            pageName: "Station Pairs Difference",
            url: "/norms-station-pair-difference",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSStationPairDifferenceVectorTile",
                        name: "NoRMS Station Pair Result Difference",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "StationPairDifference",
                        isHoverable: true,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "StationPairDifference",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Station Pair Result Difference",
                        style: "circle-diverging",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/station-pair-results/difference",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Direction",
                        paramName: "originOrDestination",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "toggle",
                        values: originOrDestinationValues,
                    },
                    {
                        filterName: "Column Name",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                {
                                    displayValue: "Demand",
                                    paramValue: "demand",
                                },
                                {
                                    displayValue: "Generalised Cost",
                                    paramValue: "gen_cost",
                                },
                                {
                                    displayValue: "Generalised Journey Time",
                                    paramValue: "gen_jt",
                                }
                            ]
                        }
                    },
                    {
                        filterName: "First Scenario",
                        paramName: "scenarioCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "First User Class",
                        paramName: "userClassIdDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "First Time Period",
                        paramName: "timePeriodCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Second Scenario",
                        paramName: "scenarioCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "Second User Class",
                        paramName: "userClassIdDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Second Time Period",
                        paramName: "timePeriodCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Please select a station in the map",
                        paramName: "nodeId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["StationPairDifference"],
                        type: "map",
                        layer: "NoRMS Station Pair Result Difference",
                        field: "id",
                    }

                ]
            },
        },
        {
            pageName: "Station Catchment",
            url: "/norms-station-catchment",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSZoneVectorTile",
                        name: "NoRMS Zones",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "zones",
                        geometryType: "polygon",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: false,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                    {
                        uniqueId: "NoRMSNodeVectorTile",
                        name: "NoRMS Nodes",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: true,
                        isStylable: false,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "NoRMS Station Catchment",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Zones",
                        style: "polygon-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/node-catchment-results",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario",
                        paramName: "scenarioCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "Time Period",
                        paramName: "timePeriodCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "User Class",
                        paramName: "userClassId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Direction",
                        paramName: "directionId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "toggle",
                        values: directionIdValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                              { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car" },  
                              { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk" },
                              { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus" },
                              { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT" },
                              { paramValue: "demand_walk", displayValue: "Demand Walk" },
                              { paramValue: "demand_car", displayValue: "Demand Car" },
                              { paramValue: "demand_bus", displayValue: "Demand Bus" },
                              { paramValue: "demand_lrt", displayValue: "Demand LRT" },
                              { paramValue: "demand_total", displayValue: "Demand Total" }
                            ]
                        },
                    },
                    {
                        filterName: "Select station in map",
                        paramName: "nodeId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment"],
                        type: "map",
                        layer: "NoRMS Nodes",
                        field: "id"
                    },
                ],
            },
        },
        {
            pageName: "Station Catchment Difference",
            url: "/norms-station-catchment/difference",
            type: "MapLayout",
            category: "Station",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSZoneVectorTile",
                        name: "NoRMS Zones",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "zones",
                        geometryType: "polygon",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: false,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                    {
                        uniqueId: "NoRMSNodeVectorTile",
                        name: "NoRMS Nodes",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "point",
                        visualisationName: "NoRMS Station Catchment",
                        isHoverable: true,
                        isStylable: false,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "NoRMS Station Catchment Difference",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Zones",
                        style: "polygon-diverging",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/node-catchment-results/difference",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "First Scenario",
                        paramName: "scenarioCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "First Time Period",
                        paramName: "timePeriodCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "First User Class",
                        paramName: "userClassIdDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Second Scenario",
                        paramName: "scenarioCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "dropdown",
                        values: scenarioCodeValues,
                    },
                    {
                        filterName: "Second Time Period",
                        paramName: "timePeriodCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Second User Class",
                        paramName: "userClassIdDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Direction",
                        paramName: "directionId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "toggle",
                        values: directionIdValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                              { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car" },  
                              { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk" },
                              { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus" },
                              { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT" },
                              { paramValue: "demand_walk", displayValue: "Demand Walk" },
                              { paramValue: "demand_car", displayValue: "Demand Car" },
                              { paramValue: "demand_bus", displayValue: "Demand Bus" },
                              { paramValue: "demand_lrt", displayValue: "Demand LRT" },
                              { paramValue: "demand_total", displayValue: "Demand Total" }
                            ]
                        },
                    },
                    {
                        filterName: "Select station in map",
                        paramName: "nodeId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["NoRMS Station Catchment Difference"],
                        type: "map",
                        layer: "NoRMS Nodes",
                        field: "id"
                    },
                ],
            },
        },
        {
            pageName: "Link Totals",
            url: "/norms-link",
            type: "MapLayout",
            category: "Link",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSLinksVectorTile",
                        name: "NoRMS Links Result",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "geometry",
                        geometryType: "line",
                        visualisationName: "Links",
                        isHoverable: false,
                        isStylable: true,
                        shouldHaveTooltipOnClick: true,
                    },
                ],
                visualisations: [
                    {
                        name: "Links",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Links Result",
                        style: "line-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/link-results",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario",
                        paramName: "scenarioCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["Links"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "Time Period",
                        paramName: "timePeriodCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["Links"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "propertyName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["Links"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                {
                                    displayValue: "No. Passengers",
                                    paramValue: "No. Passengers",
                                },
                                {
                                    displayValue: "Total Crush Capacity",
                                    paramValue: "Total Crush Capacity",
                                },
                                {
                                    displayValue: "Total Crush Load Factor",
                                    paramValue: "Total Crush Load Factor",
                                },
                                {
                                    displayValue: "Total Seat Capacity",
                                    paramValue: "Total Seat Capacity",
                                },
                                {
                                    displayValue: "Total Seat Load Factor",
                                    paramValue: "Total Seat Load Factor",
                                },
                                {
                                    displayValue: "Trains per hour",
                                    paramValue: "Trains per hour",
                                },
                            ]
                        },
                    },
                ],
            },
        },
        {
          pageName: "Link Totals Difference",
          url: "/norms-link-result-difference",
          type: "MapLayout",
          about: "", //to be added
          category: "Link",
          config: {
              layers: [
                  {
                      uniqueId: "NoRMSLinksResultDifference",
                      name: "NoRMS Links Result Difference",
                      type: "tile",
                      source: "api",
                      path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
                      sourceLayer: "geometry",
                      geometryType: "line",
                      visualisationName: "LinksResultDifference",
                      isHoverable: false,
                      isStylable: true,
                      shouldHaveTooltipOnClick: true,
                  },
              ],
              visualisations: [
                  {
                      name: "LinksResultDifference",
                      type: "joinDataToMap",
                      joinLayer: "NoRMS Links Result Difference",
                      style: "line-diverging",
                      joinField: "id",
                      valueField: "value",
                      dataSource: "api",
                      dataPath: "/api/norms/link-results/difference",
                  }
              ],
              metadataLayers: [],
              filters: [
                  {
                      filterName: "First Scenario",
                      paramName: "scenarioCodeDoSomething",
                      target: "api",
                      actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                      visualisations: ["LinksResultDifference"],
                      type: "dropdown",
                      values: scenarioCodeValues
                  },
                  {
                    filterName: "Second Scenario",
                    paramName: "scenarioCodeDoMinimum",
                    target: "api",
                    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                    visualisations: ["LinksResultDifference"],
                    type: "dropdown",
                    values: scenarioCodeValues
                  },
                  {
                      filterName: "First Time Period",
                      paramName: "timePeriodCodeDoSomething",
                      target: "api",
                      actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                      visualisations: ["LinksResultDifference"],
                      type: "toggle",
                      values: timePeriodCodeValues,
                  },
                  {
                    filterName: "Second Time Period",
                    paramName: "timePeriodCodeDoMinimum",
                    target: "api",
                    actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                    visualisations: ["LinksResultDifference"],
                    type: "toggle",
                    values: timePeriodCodeValues,
                  },
                  {
                      filterName: "Metric",
                      paramName: "propertyName",
                      target: "api",
                      actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                      visualisations: ["LinksResultDifference"],
                      type: "dropdown",
                      values: {
                          source: "local",
                          values: [
                              {
                                  displayValue: "No. Passengers",
                                  paramValue: "No. Passengers",
                              },
                              {
                                  displayValue: "Total Crush Capacity",
                                  paramValue: "Total Crush Capacity",
                              },
                              {
                                  displayValue: "Total Crush Load Factor",
                                  paramValue: "Total Crush Load Factor",
                              },
                              {
                                  displayValue: "Total Seat Capacity",
                                  paramValue: "Total Seat Capacity",
                              },
                              {
                                  displayValue: "Total Seat Load Factor",
                                  paramValue: "Total Seat Load Factor",
                              },
                              {
                                  displayValue: "Trains per hour",
                                  paramValue: "Trains per hour",
                              },
                          ]
                      },
                  },
              ],
          },
        },


        {
          pageName: "Zone Totals",
          url: "/zone-totals",
          type: "MapLayout",
          category: "Zone",
          about: "", //To be added.
          config: {
            layers: [
              {
                uniqueId: "NoRMSZoneTotals",
                name: "NoRMS Zone Totals",
                type: "tile",
                source: "api",
                path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                sourceLayer: "zones",
                geometryType: "polygon",
                visualisationName: "ZoneTotals",
                isHoverable: false,
                isStylable: true,
                shouldHaveTooltipOnClick: false,
              },
            ],
            visualisations: [
              {
                name: "ZoneTotals",
                type: "joinDataToMap",
                joinLayer: "NoRMS Zone Totals",
                style: "polygon-continuous",
                joinField: "id",
                valueField: "value",
                dataSource: "api",
                dataPath: "/api/norms/zone-total-results",
              },
            ],
            metadataLayers: [],
            filters: [
              {
                filterName: "Metric",
                paramName: "columnName",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotals"],
                type: "dropdown",
                values: {
                  source: "local",
                  values: [
                    {
                      displayValue: 'Revenue',
                      paramValue: 'revenue'
                    },
                    {
                      displayValue: 'Demand',
                      paramValue: 'demand'
                    },
                    {
                      displayValue: 'Total Generalised Cost',
                      paramValue: 'total_gen_cost'
                    },
                    {
                      displayValue: 'IVT',
                      paramValue: 'ivt'
                    },
                    {
                      displayValue: 'Crowding',
                      paramValue: 'crowding'
                    },
                    {
                      displayValue: 'Wait Time',
                      paramValue: 'wait_time'
                    },
                    {
                      displayValue: 'Walk Time',
                      paramValue: 'walk_time'
                    },
                    {
                      displayValue: 'Penalty',
                      paramValue: 'penalty'
                    },
                    {
                      displayValue: 'Access Egress',
                      paramValue: 'access_egress'
                    },
                    {
                      displayValue: 'Value of choice',
                      paramValue: 'value_of_choice'
                    },
                  ],
                },
              },
              {
                filterName: "Origin Or Destination",
                paramName: "originOrDestination",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotals"],
                type: "toggle", 
                values: originOrDestinationValues
              },
              {
                filterName: "Time Period",
                paramName: "timePeriodCode",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotals"],
                type: "toggle",
                values: timePeriodCodeValues
              },
              {
                filterName: "User Class",
                paramName: "userClassId",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotals"],
                type: "dropdown",
                values: userClassIdValues
              },
              {
                filterName: "Scenario",
                paramName: "scenarioCode",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotals"],
                type: "dropdown",
                values: scenarioCodeValues
              },
            ]
          }
        },
        {
          pageName: "Zone Totals Difference",
          url: "/zone-totals-difference",
          type: "MapLayout",
          category: "Zone",
          about: "", //To be added.
          config: {
            layers: [
              {
                uniqueId: "NoRMSZoneTotalsDifference",
                name: "NoRMS Zone Totals Difference",
                type: "tile",
                source: "api",
                path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                sourceLayer: "zones",
                geometryType: "polygon",
                visualisationName: "ZoneTotalsDifference",
                isHoverable: false,
                isStylable: true,
                shouldHaveTooltipOnClick: false,
              },
            ],
            visualisations: [
              {
                name: "ZoneTotalsDifference",
                type: "joinDataToMap",
                joinLayer: "NoRMS Zone Totals Difference",
                style: "polygon-diverging",
                joinField: "id",
                valueField: "value",
                dataSource: "api",
                dataPath: "/api/norms/zone-total-results/difference",
              },
            ],
            metadataLayers: [],
            filters: [
              {
                filterName: "Metric",
                paramName: "columnName",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown",
                values: {
                  source: "local",
                  values: [
                    {
                      displayValue: 'Revenue',
                      paramValue: 'revenue'
                    },
                    {
                      displayValue: 'Demand',
                      paramValue: 'demand'
                    },
                    {
                      displayValue: 'Total Generalised Cost',
                      paramValue: 'total_gen_cost'
                    },
                    {
                      displayValue: 'IVT',
                      paramValue: 'ivt'
                    },
                    {
                      displayValue: 'Crowding',
                      paramValue: 'crowding'
                    },
                    {
                      displayValue: 'Wait Time',
                      paramValue: 'wait_time'
                    },
                    {
                      displayValue: 'Walk Time',
                      paramValue: 'walk_time'
                    },
                    {
                      displayValue: 'Penalty',
                      paramValue: 'penalty'
                    },
                    {
                      displayValue: 'Access Egress',
                      paramValue: 'access_egress'
                    },
                    {
                      displayValue: 'Value of choice',
                      paramValue: 'value_of_choice'
                    },
                  ],
                },
              },
              {
                filterName: "Origin Or Destination",
                paramName: "originOrDestination",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown", 
                values: originOrDestinationValues
              },
              {
                filterName: "First Time Period",
                paramName: "timePeriodCodeDoSomething",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "toggle",
                values: timePeriodCodeValues
              },
              {
                filterName: "Second Time Period",
                paramName: "timePeriodCodeDoMinimum",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "toggle",
                values: timePeriodCodeValues
              },
              {
                filterName: "First User Class",
                paramName: "userClassIdDoSomething",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown",
                values: userClassIdValues
              },
              {
                filterName: "Second User Class",
                paramName: "userClassIdDoMinimum",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown",
                values: userClassIdValues
              },
              {
                filterName: "First Scenario",
                paramName: "scenarioCodeDoSomething",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown",
                values: scenarioCodeValues
              },
              {
                filterName: "Second Scenario",
                paramName: "scenarioCodeDoMinimum",
                target: "api",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                visualisations: ["ZoneTotalsDifference"],
                type: "dropdown",
                values: scenarioCodeValues
              },
            ]
          }
        },
        {
            pageName: "Zone Pairs",
            url: "/norms-zones-pair",
            type: "MapLayout",
            category: "Zone",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSZonesPairVectorTile",
                        name: "NoRMS Zones Pair Result",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "zones",
                        geometryType: "polygon",
                        visualisationName: "ZonesPair",
                        isHoverable: true,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "ZonesPair",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Zones Pair Result",
                        style: "polygon-continuous",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/zone-pair-results",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Scenario",
                        paramName: "scenarioCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "Time Period",
                        paramName: "timePeriodCode",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "User",
                        paramName: "userClassId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Zone as Origin or Destination",
                        paramName: "originOrDestination",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "toggle",
                        values: originOrDestinationValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                {
                                    displayValue: "Demand",
                                    paramValue: "demand",
                                },
                                {
                                    displayValue: "Generalised Cost",
                                    paramValue: "gen_cost",
                                },
                                {
                                    displayValue: "Generalised Journey Time",
                                    paramValue: "gen_jt",
                                }
                            ]
                        }
                    },
                    {
                        filterName: "Select a zone in the map",
                        paramName: "zoneId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPair"],
                        type: "map",
                        layer: "NoRMS Zones Pair Result",
                        field: "id",
                    }
                ]
            },
        },
        {
            pageName: "Zone Pairs Difference",
            url: "/norms-zones-pair-difference",
            type: "MapLayout",
            category: "Zone",
            config: {
                layers: [
                    {
                        uniqueId: "NoRMSZonesPairDifferenceVectorTile",
                        name: "NoRMS Zones Pair Result Difference",
                        type: "tile",
                        source: "api",
                        path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
                        sourceLayer: "zones",
                        geometryType: "polygon",
                        visualisationName: "ZonesPairDifference",
                        isHoverable: true,
                        isStylable: true,
                        shouldHaveTooltipOnClick: false,
                    },
                ],
                visualisations: [
                    {
                        name: "ZonesPairDifference",
                        type: "joinDataToMap",
                        joinLayer: "NoRMS Zones Pair Result Difference",
                        style: "polygon-diverging",
                        joinField: "id",
                        valueField: "value",
                        dataSource: "api",
                        dataPath: "/api/norms/zone-pair-results/difference",
                    }
                ],
                metadataLayers: [],
                filters: [
                    {
                        filterName: "Zone as Origin or Destination",
                        paramName: "originOrDestination",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "toggle",
                        values: originOrDestinationValues,
                    },
                    {
                        filterName: "Metric",
                        paramName: "columnName",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "dropdown",
                        values: {
                            source: "local",
                            values: [
                                {
                                    displayValue: "Demand",
                                    paramValue: "demand",
                                },
                                {
                                    displayValue: "Generalised Cost",
                                    paramValue: "gen_cost",
                                },
                                {
                                    displayValue: "Generalised Journey Time",
                                    paramValue: "gen_jt",
                                }
                            ]
                        }
                    },
                    {
                        filterName: "First Scenario",
                        paramName: "scenarioCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "First Time Period",
                        paramName: "timePeriodCodeDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "First User",
                        paramName: "userClassIdDoSomething",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Second Scenario",
                        paramName: "scenarioCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "dropdown",
                        values: scenarioCodeValues
                    },
                    {
                        filterName: "Second Time Period",
                        paramName: "timePeriodCodeDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "toggle",
                        values: timePeriodCodeValues,
                    },
                    {
                        filterName: "Second User",
                        paramName: "userClassIdDoMinimum",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "dropdown",
                        values: userClassIdValues,
                    },
                    {
                        filterName: "Select a zone in the map",
                        paramName: "zoneId",
                        target: "api",
                        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                        visualisations: ["ZonesPairDifference"],
                        type: "map",
                        layer: "NoRMS Zones Pair Result Difference",
                        field: "id",
                    }
                ]
            },
        }
    ],
};

