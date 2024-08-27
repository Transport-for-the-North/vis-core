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

const scenarioYearValues = {
  source: "local",
  values: [
    {
      displayValue: "0",
      paramValue: "0",
    },
    {
      displayValue: "2018",
      paramValue: "2018",
    },
    {
      displayValue: "2042",
      paramValue: "2042",
    },
    {
      displayValue: "2052",
      paramValue: "2052",
    },
  ],
}

const networkSpecValues = {
  source: "local",
  values: [
    {
      displayValue: "Base",
      paramValue: "Base",
    },
    {
      displayValue: "DM6_09",
      paramValue: "DM6_09",
    },
    {
      displayValue: "DM8_02",
      paramValue: "DM8_02",
    },
    {
      displayValue: "NA",
      paramValue: "NA",
    },
    {
      displayValue: "NPR10_03",
      paramValue: "NPR10_03",
    },
    {
      displayValue: "NPR6_04",
      paramValue: "NPR6_04",
    },
  ],
}

const demandCodeValues = {
  source: "local",
  values: [
    {
      displayValue: "d058_17",
      paramValue: "d058_17",
    },
    {
      displayValue: "d058_42",
      paramValue: "d058_42",
    },
    {
      displayValue: "d083",
      paramValue: "d083",
    },
    {
      displayValue: "d084",
      paramValue: "d084",
    },
    {
      displayValue: "d088",
      paramValue: "d088",
    },
    {
      displayValue: "d089",
      paramValue: "d089",
    },
    {
      displayValue: "NA",
      paramValue: "NA",
    },
  ],
}

const userClassIdsValues = {
  source: "local",
  values: [
    {
      displayValue: "1",
      paramValue: "1",
    },
    {
      displayValue: "2",
      paramValue: "2",
    },
    {
      displayValue: "3",
      paramValue: "3",
    },
    {
      displayValue: "4",
      paramValue: "4",
    },
    {
      displayValue: "5",
      paramValue: "5",
    },
    {
      displayValue: "6",
      paramValue: "6",
    },
    {
      displayValue: "7",
      paramValue: "7",
    },
    {
      displayValue: "8",
      paramValue: "8",
    },
    {
      displayValue: "9",
      paramValue: "9",
    },
  ],
}

const inputNormsScenarioMetadataTable = {
  name: "input_norms_scenario",
  path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario"
}

const keyLocationTypeMetadataTable = {
  name: "key_location_type_list",
  path: "/api/getgenericdataset?dataset_id=foreign_keys.key_location_type_list"
}

const userClassMetadataTable = {
  name: "norms_userclass_list",
  path: "/api/getgenericdataset?dataset_id=foreign_keys.norms_userclass_list"
}

const scenarioYearValues = {
  source: "local",
  values: [
    {
      displayValue: "0",
      paramValue: "0",
    },
    {
      displayValue: "2018",
      paramValue: "2018",
    },
    {
      displayValue: "2042",
      paramValue: "2042",
    },
    {
      displayValue: "2052",
      paramValue: "2052",
    },
  ],
}

const networkSpecValues = {
  source: "local",
  values: [
    {
      displayValue: "Base",
      paramValue: "Base",
    },
    {
      displayValue: "DM6_09",
      paramValue: "DM6_09",
    },
    {
      displayValue: "DM8_02",
      paramValue: "DM8_02",
    },
    {
      displayValue: "NA",
      paramValue: "NA",
    },
    {
      displayValue: "NPR10_03",
      paramValue: "NPR10_03",
    },
    {
      displayValue: "NPR6_04",
      paramValue: "NPR6_04",
    },
  ],
}

const demandCodeValues = {
  source: "local",
  values: [
    {
      displayValue: "d058_17",
      paramValue: "d058_17",
    },
    {
      displayValue: "d058_42",
      paramValue: "d058_42",
    },
    {
      displayValue: "d083",
      paramValue: "d083",
    },
    {
      displayValue: "d084",
      paramValue: "d084",
    },
    {
      displayValue: "d088",
      paramValue: "d088",
    },
    {
      displayValue: "d089",
      paramValue: "d089",
    },
    {
      displayValue: "NA",
      paramValue: "NA",
    },
  ],
}

const timePeriodCodesValues = {
  source: "local",
  values: [
    {
      displayValue: "AM",
      paramValue: "am",
    },
    {
      displayValue: "IP",
      paramValue: "ip",
    },
    {
      displayValue: "PM",
      paramValue: "pm",
    },
  ]
}

const userClassIdsValues = {
  source: "local",
  values: [
    {
      displayValue: "1",
      paramValue: "1",
    },
    {
      displayValue: "2",
      paramValue: "2",
    },
    {
      displayValue: "3",
      paramValue: "3",
    },
    {
      displayValue: "4",
      paramValue: "4",
    },
    {
      displayValue: "5",
      paramValue: "5",
    },
    {
      displayValue: "6",
      paramValue: "6",
    },
    {
      displayValue: "7",
      paramValue: "7",
    },
    {
      displayValue: "8",
      paramValue: "8",
    },
    {
      displayValue: "9",
      paramValue: "9",
    },
  ],
}


export const appConfig = {
  title: "TAME React Vis Template",
  introduction: `<p>HTML, or HyperText Markup Language, is the standard markup language used to create web pages. It provides the structure of a webpage, allowing for the insertion of text, images, and other multimedia elements. HTML is not a programming language; it is a markup language that defines the content of web pages.</p>`,
  background: "",
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  contactText: "Please contact [Name] for any questions on this data tool.",
  contactEmail: "firstname.lastname@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/norms/hero.jpg",
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: true,
            hoverNulls: true
          },
        ],
        visualisations: [
          {
            name: "Station Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Nodes",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-results"
          }
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Totals"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "Boardings", displayValue: "Boardings", legendSubtitleText: "Passengers" },
                { paramValue: "Interchanges", displayValue: "Interchanges", legendSubtitleText: "Passengers" },
                { paramValue: "Egress", displayValue: "Egress", legendSubtitleText: "Egress" },
                { paramValue: "Access", displayValue: "Access", legendSubtitleText: "Access" },
                { paramValue: "Alightings", displayValue: "Alightings", legendSubtitleText: "Alightings" }
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Station Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Nodes",
            style: "circle-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-results/difference",
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario DS by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario DS by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario DS by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario DS",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter Scenario DM by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario DM by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario DM by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario DM",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Totals Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "Boardings", displayValue: "Boardings", legendSubtitleText: "Passengers" },
                { paramValue: "Interchanges", displayValue: "Interchanges", legendSubtitleText: "Passengers" },
                { paramValue: "Egress", displayValue: "Egress", legendSubtitleText: "Egress" },
                { paramValue: "Access", displayValue: "Access", legendSubtitleText: "Access" },
                { paramValue: "Alightings", displayValue: "Alightings", legendSubtitleText: "Alightings" }
              ]
            },
          },
        ],
      },
    },
    {
      pageName: "Station Totals Side-by-Side",
      url: "/norms-station-totals-difference-dual",
      type: "DualMapLayout",
      category: "Station",
      config: {
        layers: [
          {
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Totals Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Station Totals Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Nodes",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-results",
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario Left by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario Left by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario Left by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter Scenario Right by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario Right by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario Right by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Totals Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "Boardings", displayValue: "Boardings", legendSubtitleText: "Passengers" },
                { paramValue: "Interchanges", displayValue: "Interchanges", legendSubtitleText: "Passengers" },
                { paramValue: "Egress", displayValue: "Egress", legendSubtitleText: "Egress" },
                { paramValue: "Access", displayValue: "Access", legendSubtitleText: "Access" },
                { paramValue: "Alightings", displayValue: "Alightings", legendSubtitleText: "Alightings" }
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSStationPairVectorTile",
            name: "NoRMS Station Pair Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Pairs",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Station Pairs",
            type: "joinDataToMap",
            joinLayer: "NoRMS Station Pair Result",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/station-pair-results",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Pairs"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Please select a station in the map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSStationPairDifferenceVectorTile",
            name: "NoRMS Station Pair Result Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Pairs Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Station Pairs Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Station Pair Result Difference",
            style: "circle-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/station-pair-results/difference",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Filter DM Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DM Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter DS Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DS Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Please select a station in the map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "map",
            layer: "NoRMS Station Pair Result Difference",
            field: "id",
          }

        ]
      },
    },
    {
      pageName: "Station Pairs Side-by-Side",
      url: "/norms-station-pair-dual",
      type: "DualMapLayout",
      category: "Station",
      config: {
        layers: [
          {
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSStationPairVectorTile",
            name: "NoRMS Station Pair Result Side-by-Side",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Pairs Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Station Pairs Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Station Pair Result Side-by-Side",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/station-pair-results",
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand unit",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost unit",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Please select a station in the map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            type: "map",
            layer: "NoRMS Station Pair Result Side-by-Side",
            field: "id",
          }
        ],
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSZoneVectorTile",
            name: "NoRMS Zones",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Station Catchment",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Catchment",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelNulls: true,
            labelZoomLevel: 10,
            hoverNulls: true
          },
        ],
        visualisations: [
          {
            name: "Station Catchment",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-catchment-results",
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Catchment"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "demand_walk", displayValue: "Demand Walk", legendSubtitleText: "Demand" },
                { paramValue: "demand_car", displayValue: "Demand Car", legendSubtitleText: "Demand" },
                { paramValue: "demand_bus", displayValue: "Demand Bus", legendSubtitleText: "Demand" },
                { paramValue: "demand_lrt", displayValue: "Demand LRT", legendSubtitleText: "Demand" },
                { paramValue: "demand_total", displayValue: "Demand Total", legendSubtitleText: "Demand" }
              ]
            },
          },
          {
            filterName: "Select station in map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
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
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSZoneVectorTile",
            name: "NoRMS Zones",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Station Catchment Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            hoverNulls: false
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Catchment Difference",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 10,
            labelNulls: true
          },
        ],
        visualisations: [
          {
            name: "Station Catchment Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-catchment-results/difference",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter DM Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DM Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter DS Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DS Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Catchment Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "demand_walk", displayValue: "Demand Walk", legendSubtitleText: "Demand" },
                { paramValue: "demand_car", displayValue: "Demand Car", legendSubtitleText: "Demand" },
                { paramValue: "demand_bus", displayValue: "Demand Bus", legendSubtitleText: "Demand" },
                { paramValue: "demand_lrt", displayValue: "Demand LRT", legendSubtitleText: "Demand" },
                { paramValue: "demand_total", displayValue: "Demand Total", legendSubtitleText: "Demand" }
              ]
            },
          },
          {
            filterName: "Select station in map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "map",
            layer: "NoRMS Nodes",
            field: "id"
          },
        ],
      },
    },
    {
      pageName: "Station Catchment Side-by-Side",
      url: "/norms-station-catchment-dual",
      type: "DualMapLayout",
      category: "Station",
      config: {
        layers: [
          {
            uniqueId: "NoRMSLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Network",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSZoneVectorTile",
            name: "NoRMS Zones Side-by-Side",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Station Catchment Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            hoverNulls: false
          },
          {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Catchment Side-by-Side",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 10,
            labelNulls: true
          },
        ],
        visualisations: [
          {
            name: "Station Catchment Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Side-by-Side",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-catchment-results",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Origin or Destination",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "demand_walk", displayValue: "Demand Walk", legendSubtitleText: "Demand" },
                { paramValue: "demand_car", displayValue: "Demand Car", legendSubtitleText: "Demand" },
                { paramValue: "demand_bus", displayValue: "Demand Bus", legendSubtitleText: "Demand" },
                { paramValue: "demand_lrt", displayValue: "Demand LRT", legendSubtitleText: "Demand" },
                { paramValue: "demand_total", displayValue: "Demand Total", legendSubtitleText: "Demand" }
              ]
            },
          },
          {
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Select station in map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Nodes",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSLinksVectorTile",
            name: "NoRMS Links Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Link Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Links Result",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/link-results",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Totals"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "No. Passengers",
                  paramValue: "No. Passengers",
                  legendSubtitleText: "Passengers",
                },
                {
                  displayValue: "Total Crush Capacity",
                  paramValue: "Total Crush Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Crush Load Factor",
                  paramValue: "Total Crush Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Total Seat Capacity",
                  paramValue: "Total Seat Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Seat Load Factor",
                  paramValue: "Total Seat Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Trains per hour",
                  paramValue: "Trains per hour",
                  legendSubtitleText: "units",
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
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Nodes",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSLinksResultDifference",
            name: "NoRMS Links Result Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Link Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Links Result Difference",
            style: "line-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/link-results/difference",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter DS Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DS Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DM Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric DS",
            paramName: "propertyNameDoSomething",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "No. Passengers",
                  paramValue: "No. Passengers",
                  legendSubtitleText: "Passengers",
                },
                {
                  displayValue: "Total Crush Capacity",
                  paramValue: "Total Crush Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Crush Load Factor",
                  paramValue: "Total Crush Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Total Seat Capacity",
                  paramValue: "Total Seat Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Seat Load Factor",
                  paramValue: "Total Seat Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Trains per hour",
                  paramValue: "Trains per hour",
                  legendSubtitleText: "units",
                },
              ]
            },
          },
          {
            filterName: "Metric DM",
            paramName: "propertyNameDoMinimum",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Totals Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "No. Passengers",
                  paramValue: "No. Passengers",
                  legendSubtitleText: "Passengers",
                },
                {
                  displayValue: "Total Crush Capacity",
                  paramValue: "Total Crush Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Crush Load Factor",
                  paramValue: "Total Crush Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Total Seat Capacity",
                  paramValue: "Total Seat Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Seat Load Factor",
                  paramValue: "Total Seat Load Factor",
                  legendSubtitleText: "Factor",
                },
                {
                  displayValue: "Trains per hour",
                  paramValue: "Trains per hour",
                  legendSubtitleText: "units",
                },
              ]
            },
          },
        ],
      },
    },
    {
      pageName: "Link Totals Side-by-Side",
      url: "/norms-link-result-dual",
      type: "DualMapLayout",
      about: "", //to be added
      category: "Link",
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
            visualisationName: "Station Nodes",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
          },
          {
            uniqueId: "NoRMSLinksResultDual",
            name: "NoRMS Links Result Dual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Totals Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
          },
        ],
        visualisations: [
          {
            name: "Link Totals Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Links Result Dual",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/link-results",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Totals Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "No. Passengers",
                  paramValue: "No. Passengers",
                  legendSubtitleText: "Passengers",
                },
                {
                  displayValue: "Total Crush Capacity",
                  paramValue: "Total Crush Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Crush Load Factor",
                  paramValue: "Total Crush Load Factor",
                  legendSubtitleText: "Load Factor",
                },
                {
                  displayValue: "Total Seat Capacity",
                  paramValue: "Total Seat Capacity",
                  legendSubtitleText: "Capacity",
                },
                {
                  displayValue: "Total Seat Load Factor",
                  paramValue: "Total Seat Load Factor",
                  legendSubtitleText: "Load Factor",
                },
                {
                  displayValue: "Trains per hour",
                  paramValue: "Trains per hour",
                  legendSubtitleText: "Trains",
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
            visualisationName: "Zone Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results",
            
          },
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "Revenue",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: 'Total Generalised Cost',
                  paramValue: 'total_gen_cost',
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: 'IVT',
                  paramValue: 'ivt',
                  legendSubtitleText: "IVT",
                },
                {
                  displayValue: 'Crowding',
                  paramValue: 'crowding',
                  legendSubtitleText: "Crowding",
                },
                {
                  displayValue: 'Wait Time',
                  paramValue: 'wait_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Walk Time',
                  paramValue: 'walk_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Penalty',
                  paramValue: 'penalty',
                  legendSubtitleText: "Penalty",
                },
                {
                  displayValue: 'Access Egress',
                  paramValue: 'access_egress',
                  legendSubtitleText: "Access Egress",
                },
                {
                  displayValue: 'Value of choice',
                  paramValue: 'value_of_choice',
                  legendSubtitleText: "Value",
                },
              ],
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            values: userClassIdValues
          },
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
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
            visualisationName: "Zone Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Totals Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results/difference",
            
          },
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "Revenue",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: 'Total Generalised Cost',
                  paramValue: 'total_gen_cost',
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: 'IVT',
                  paramValue: 'ivt',
                  legendSubtitleText: "IVT",
                },
                {
                  displayValue: 'Crowding',
                  paramValue: 'crowding',
                  legendSubtitleText: "Crowding",
                },
                {
                  displayValue: 'Wait Time',
                  paramValue: 'wait_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Walk Time',
                  paramValue: 'walk_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Penalty',
                  paramValue: 'penalty',
                  legendSubtitleText: "Penalty",
                },
                {
                  displayValue: 'Access Egress',
                  paramValue: 'access_egress',
                  legendSubtitleText: "Access Egress",
                },
                {
                  displayValue: 'Value of choice',
                  paramValue: 'value_of_choice',
                  legendSubtitleText: "Value",
                },
              ],
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            values: originOrDestinationValues
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            values: userClassIdValues
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            values: userClassIdValues
          },
          {
            filterName: "Filter DS Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DS Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DM Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Totals Side-by-Side",
      url: "/zone-totals-dual",
      type: "DualMapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneTotalsDual",
            name: "NoRMS Zone Totals Dual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Totals Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Totals Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results",
            
          },
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "Revenue",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: 'Total Generalised Cost',
                  paramValue: 'total_gen_cost',
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: 'IVT',
                  paramValue: 'ivt',
                  legendSubtitleText: "IVT",
                },
                {
                  displayValue: 'Crowding',
                  paramValue: 'crowding',
                  legendSubtitleText: "Crowding",
                },
                {
                  displayValue: 'Wait Time',
                  paramValue: 'wait_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Walk Time',
                  paramValue: 'walk_time',
                  legendSubtitleText: "Seconds",
                },
                {
                  displayValue: 'Penalty',
                  paramValue: 'penalty',
                  legendSubtitleText: "Penalty",
                },
                {
                  displayValue: 'Access Egress',
                  paramValue: 'access_egress',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: 'Value of choice',
                  paramValue: 'value_of_choice',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            values: userClassIdValues
          },
          {
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            values: userClassIdValues
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
        ]
      }
    },

    {
      pageName: "Key Location Accessibility (Zone Totals)",
      url: "/accessibility-key-location-totals",
      type: "MapLayout",
      category: "Accessibility",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityTotals",
            name: "NoRMS Zone Accessibility Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-total",
          },
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Network",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: true,
            multiSelect: true,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "user_segment",
              paramColumn: "user_segment",
              sort: "ascending",
              exclude: ['All']
            },
          },
          {
            filterName: "Filter User Class by Car Availability",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: true,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "car_availability",
              paramColumn: "car_availability",
              sort: "ascending",
              exclude: ['All']
            },
          },
          {
            filterName: "User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: true,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "ascending",
              exclude: [0, 123, 456, 789]
            },
          },
          {
            filterName: "Key Location Type",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Totals"],
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "key_location_type_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "ascending",
              legendSubtitleTextColumn: "name"
            },
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 15,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Accessibility Totals Difference",
      url: "/zone-accessibility-totals-difference",
      type: "MapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityTotalsDifference",
            name: "NoRMS Zone Accessibility Totals Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Totals Difference",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-total/difference",
          },
        ],
        metadataTables: [],
        filters: [
          {
            filterName: "Key Location Type Id",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: '1',
                  paramValue: '1',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '2',
                  paramValue: '2',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '3',
                  paramValue: '3',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '4',
                  paramValue: '4',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '5',
                  paramValue: '5',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '6',
                  paramValue: '6',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '7',
                  paramValue: '7',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '8',
                  paramValue: '8',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '9',
                  paramValue: '9',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '10',
                  paramValue: '10',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: scenarioYearValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Network Specification - DS",
            paramName: "networkSpecDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Network Specification - DM",
            paramName: "networkSpecDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Demand Code - DS",
            paramName: "demandCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Demand Code - DM",
            paramName: "demandCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodesDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodesDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "User Class - DS",
            paramName: "userClassIdsDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "User Class - DM",
            paramName: "userClassIdsDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 5,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Accessibility Totals Side-by-Side",
      url: "/zone-accessibility-totals-dual",
      type: "DualMapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityTotals",
            name: "NoRMS Zone Accessibility Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Totals Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Totals Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-total",
          },
        ],
        metadataTables: [],
        filters: [
          {
            filterName: "Key Location Type Id",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: '1',
                  paramValue: '1',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '2',
                  paramValue: '2',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '3',
                  paramValue: '3',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '4',
                  paramValue: '4',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '5',
                  paramValue: '5',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '6',
                  paramValue: '6',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '7',
                  paramValue: '7',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '8',
                  paramValue: '8',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '9',
                  paramValue: '9',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '10',
                  paramValue: '10',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: scenarioYearValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Left Network Specification",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Right Network Specification",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Left Demand Code",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Right Demand Code",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Left User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Right User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Side-by-Side"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 5,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
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
            visualisationName: "Zone Pairs",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Pairs",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results",
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            values: userClassIdValues,
          },
          {
            filterName: "Zone as Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Pairs"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
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
            visualisationName: "Zone Pairs Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Pairs Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results/difference",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Zone as Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Filter DM Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DM Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DM Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "First User",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            values: userClassIdValues,
          },
          {
            filterName: "Filter DS Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter DS Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "DS Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Second User",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "dropdown",
            values: userClassIdValues,
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "map",
            layer: "NoRMS Zones Pair Result Difference",
            field: "id",
          }
        ]
      },
    },
    {
      pageName: "Zone Pairs Side-by-Side",
      url: "/norms-zones-pair-dual",
      type: "DualMapLayout",
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
            visualisationName: "Zone Pairs Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Pairs Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results",
            
          }
        ],
        metadataTables: [ inputNormsScenarioMetadataTable ],
        filters: [
          {
            filterName: "Zone as Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Demand unit",
                },
                {
                  displayValue: "Generalised Cost",
                  paramValue: "gen_cost",
                  legendSubtitleText: "Cost unit",
                },
                {
                  displayValue: "Generalised Journey Time",
                  paramValue: "gen_jt",
                  legendSubtitleText: "Seconds",
                }
              ]
            }
          },
          {
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Left User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            values: userClassIdValues,
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "network_spec",
              paramColumn: "network_spec",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "demand_code",
              paramColumn: "demand_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: true,
            shouldFilterOnValidation: true,
            shouldFilterOthers: true,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_year",
              paramColumn: "scenario_year",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldFilterOthers: false,
            isClearable: true,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Right User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "dropdown",
            values: userClassIdValues,
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, { action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            type: "map",
            layer: "NoRMS Zones Pair Result",
            field: "id",
          }
        ]
      },
    },


    {
      pageName: "Zone Accessibility Pair",
      url: "/zone-accessibility-pair",
      type: "MapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityPair",
            name: "NoRMS Zone Accessibility Pair",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Pair",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Pair",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Pair",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-od",
          },
        ],
        metadataTables: [],
        filters: [
          {
            filterName: "Key Location Type Id",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Pair"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: '1',
                  paramValue: '1',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '2',
                  paramValue: '2',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '3',
                  paramValue: '3',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '4',
                  paramValue: '4',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '5',
                  paramValue: '5',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '6',
                  paramValue: '6',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '7',
                  paramValue: '7',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '8',
                  paramValue: '8',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '9',
                  paramValue: '9',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '10',
                  paramValue: '10',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "map",
            layer: "NoRMS Zone Accessibility Pair",
            field: "id",
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "dropdown",
            values: scenarioYearValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Network Specification",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Demand Code",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 5,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Accessibility Pair Difference",
      url: "/zone-accessibility-pair-difference",
      type: "MapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityPairDifference",
            name: "NoRMS Zone Accessibility Pair Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Pair Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Pair Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Pair Difference",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-od/difference",
          },
        ],
        metadataTables: [],
        filters: [
          {
            filterName: "Key Location Type Id",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: '1',
                  paramValue: '1',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '2',
                  paramValue: '2',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '3',
                  paramValue: '3',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '4',
                  paramValue: '4',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '5',
                  paramValue: '5',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '6',
                  paramValue: '6',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '7',
                  paramValue: '7',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '8',
                  paramValue: '8',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '9',
                  paramValue: '9',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '10',
                  paramValue: '10',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "map",
            layer: "NoRMS Zone Accessibility Pair Difference",
            field: "id",
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: scenarioYearValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Network Specification - DS",
            paramName: "networkSpecDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Network Specification - DM",
            paramName: "networkSpecDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Demand Code - DS",
            paramName: "demandCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Demand Code - DM",
            paramName: "demandCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodesDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodesDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "User Class - DS",
            paramName: "userClassIdsDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "User Class - DM",
            paramName: "userClassIdsDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 5,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Accessibility Pair Side-by-Side",
      url: "/zone-accessibility-pair-dual",
      type: "DualMapLayout",
      category: "Zone",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityPair",
            name: "NoRMS Zone Accessibility Pair",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Pair Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Pair Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Pair",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-od",
          },
        ],
        metadataTables: [],
        filters: [
          {
            filterName: "Key Location Type Id",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: '1',
                  paramValue: '1',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '2',
                  paramValue: '2',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '3',
                  paramValue: '3',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '4',
                  paramValue: '4',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '5',
                  paramValue: '5',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '6',
                  paramValue: '6',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '7',
                  paramValue: '7',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '8',
                  paramValue: '8',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '9',
                  paramValue: '9',
                  legendSubtitleText: "unit",
                },
                {
                  displayValue: '10',
                  paramValue: '10',
                  legendSubtitleText: "unit",
                },
              ],
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, { action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "map",
            layer: "NoRMS Zone Accessibility Pair",
            field: "id",
          },
          {
            filterName: "Scenario Year",
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: scenarioYearValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Left Network Specification",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Right Network Specification",
            paramName: "networkSpec",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: networkSpecValues
          },
          {
            filterName: "Left Demand Code",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Right Demand Code",
            paramName: "demandCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: demandCodeValues
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "toggle",
            values: timePeriodCodesValues
          },
          {
            filterName: "Left User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Right User Class",
            paramName: "userClassIds",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "dropdown",
            values: userClassIdsValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Side-by-Side"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 5,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ]
      }
    },
  ],
};

