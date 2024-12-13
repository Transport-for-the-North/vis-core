import { termsOfUse } from "./termsOfUse";

const scenarioCodeValues = {
  source: "local",
  values: [
    {
      displayValue: "TBG 2042",
      paramValue: "TBG_2042",
    },
    {
      displayValue: "UCS 2042",
      paramValue: "UCS_2042",
    },
    {
      displayValue: "TBH 2052",
      paramValue: "TBH_2052",
    },
    {
      displayValue: "UCT 2052",
      paramValue: "UCT_2052",
    },
    {
      displayValue: "TBK 2042",
      paramValue: "TBK_2042",
    },
    {
      displayValue: "TBL 2052",
      paramValue: "TBL_2052",
    },
    {
      displayValue: "UDH 2042 ",
      paramValue: "UDH_2042 ",
    },
  ],
}; // TODO What is this for? It is not used in rest of code? 

const excludeCodes = [
  // "IGX_2018",
  // "JPI_2042",
  // "JRT_2042",
  // "JRU_2052",
  // "JRV_2042",
  // "JRW_2052",
  // "JRX_2042",
  // "JRY_2052",
  // "JRZ_2042",
  // "JSA_2052",
  // "K9N_2042",
  // "K9O_2052",
  // "KZI_2042",
  // "UAA_2042",
  // "UAB_2052",
  // "UAC_2042",
  // "UAD_2052",
  // "UAE_2042",
  // "UAF_2052",
  // "NA"
];




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

const landuseValues = {
  source: "local",
  legendSubtitleTextColumn: "landuse",
  values: [
    {
      displayValue: "Employment",
      paramValue: "emp"
    },
    {
      displayValue: "Population",
      paramValue: "pop"
    }
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

const inputNormsScenarioMetadataTable = {
  name: "input_norms_scenario",
  path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario",
  where: [
    {
      column: "business_case",
      operand: "=",
      value: "Bradford SOBC 2024"
    }
  ]
}

const keyLocationTypeMetadataTable = {
  name: "key_location_type_list",
  path: "/api/getgenericdataset?dataset_id=foreign_keys.key_location_type_list"
}

const userClassMetadataTable = {
  name: "norms_userclass_list",
  path: "/api/getgenericdataset?dataset_id=foreign_keys.norms_userclass_list"
}

const landUseSegmentMetadataTable = {
  name: "landuse_segment_list",
  path: "/api/getgenericdataset?dataset_id=foreign_keys.landuse_segment_list"
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

const landuseReferenceValues = {
  source: "local",
  values: [
    {
      displayValue: "NTEM8",
      paramValue: "ntem8",
    },
    {
      displayValue: "EDGE",
      paramValue: "edge",
    },
  ],
}

const landuseExogValues = {
  source: "local",
  values: [
    {
      displayValue: "Static",
      paramValue: "static",
    },
    {
      displayValue: "Dynamic",
      paramValue: "dynamic",
    },
  ],
}

export const appConfig = {
  title: "TAME NPR Visualisation Framework: Bradford Business Case",
  introduction: `<p>The application focuses on the modelling outputs produced for Bradford Business Case. The TfN’s Northern Rail Modelling System (NoRMS) Vis Framework aims to collate and visualise outputs from the Transport for the North Northern Rail Model (NoRMS), that is part of the Northern Transport Modelling System (NorTMS).
   NorTMS is a rail and highways modelling system and is used to appraise rail and highways scheme assessments.</p> <p>The purpose of this platform is to collate and visualise modelled rail data in an interactive, intuitive, and
   web-based format. This instance of the platform presents information from the Network North project. This visualisation tool builds on the modelling aspect of the work that delivers analysis
   based on scenario testing done using NoRMS.</p> 
   <p><b>NPR Scenarios: metadata and use</b></p>
   <p>Each functionality found in the NPR Visualisation Framework presents itself with a selection of scenarios that can be combined with the following filters: modelling network, demand sensitivity and year. </p>
   <p><b>Filter Scenario by Network</b></p>
   <ul><li>DM8_04: Do minimum 8.04 (Jan24 Covid medium), <li>NPR10_06: Network North 10.06 Bradford Mill Lane, <li>NPR10_07: Network North 10.07 Bradford Interchange, 
   <li>NPR10_08: Network North 10.08 Counterfactual Network, <li>NPR10_06ah1: Network North 10.06ah1 Bradford, <li>NPR10_06ah2: Network North 10.06ah2 Bradford St James' Market. </ul>
   <p><b>Filter Scenario by Demand</b>, as of now exclusively including d096: Jan24 Covid medium. </p>
   <p><b>Filter Scenario by Year</b>, including 2042 and 2052. </p>
   <p>The framework works with the selection of the desired modelled scenario. <br>
   The scenario to be visualised should be filtered with a top-down approach so the user can be guided into the selection of the NorTMS scenario code. If the filters are consistent, a green check will appear on the filter and scenario windows.  <br>
   A more expert user can skip the scenario filters and automatically select the desired scenario. Filters can still be used to confirm the assumptions the scenario was built on. </p>
   <p><b>NPR Functionalities</b></p>
   <p>The functionalities included in the framework are (so far): </p>
   <ul><li><b>NPR Station:</b> station totals, station catchments, and station pairs, 
   <li><b>NPR Links,</b>
   <li><b>NPR Zone:</b> zone totals, zone benefits, and zone pairs,
   <li><b>Accessibility (Key Location):</b> zone totals and zone pairs,
   <li><b>Accessibility (Land Use):</b> zone totals and zone pairs,
   <li><b>Accessibility (Journey Time):</b> zone pairs.</ul>
   <p>Please use the dedicated drop-down menus and functionalities to know more about each functionality. <br>
   Generally, the defined “totals” functionalities group-by a metric for each unit (station or zone). On the other hand, the functionalities defined as “pair” in the name, require the user selection of a unit to show the relative distribution of the desired metric. </p>`
   ,
  background: "",
  methodology: "",
  ////termsOfUse: termsOfUse,
  legalText: termsOfUse,
  contactText: "Please contact Magda Smith for any questions on this data tool.",
  contactEmail: "magda.smith@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/nortms-bradford/bradford_citycentre.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  appPages: [
    {
      pageName: "Station Totals",
      url: "/norms-station-totals",
      type: "MapLayout",
      legalText: termsOfUse,
      ////termsOfUse: termsOfUse,
      about: `
      <p>Visualise the number of passengers using the station by selecting a scenario, adjusting the Time Period and choosing the Metric. </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      `,
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
            labelZoomLevel: 9,
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
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals"],
            info:"Select the desired time period.",
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
            info:"Select the desired metric.",
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
      pageName: "Station Totals Difference (2-1)",
      url: "/norms-station-totals-difference",
      type: "MapLayout",
      legalText: termsOfUse,
      ////termsOfUse: termsOfUse,
      about:`
      <p>Visualise the difference in passenger movements at stations between two separate scenarios by selecting two scenarios. The difference is calculated scenario 2 vs scenario 1 (i.e. 2–1). </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>It is possible to show the total passengers that board, alight or interchange on a train at a station, or the total passengers that access (enter) or egress (exit) a station.  </p>
      `,
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
            labelZoomLevel: 9,
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
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Totals Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: {
              source: "api"
            },
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Totals Difference"],
            info:"Select the desired metric.",
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
      legalText: termsOfUse,
      ////termsOfUse: termsOfUse,
      about:`
      <p>Visualise both scenarios, and their respective absolute values, at the same time by selecting Left/Right Scenarios. This allows to see the absolute values of both scenarios in real time.  </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p> It is possible to show the total passengers that board, alight or interchange on a train at a station, or the total passengers that access (enter) or egress (exit) a station.  </p>
      `,
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
            labelZoomLevel: 9,
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
            filterName: "Filter Scenario Left by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
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
            filterName: "Filter Scenario Left by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            info:"Select the desired time period.",
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
            filterName: "Filter Scenario Right by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
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
            filterName: "Filter Scenario Right by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Totals Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Totals Side-by-Side"],
            info: "Select the desired time period. ",
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
            info:"Select the desired metric.",
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
      legalText: termsOfUse,
      ////termsOfUse: termsOfUse,
      about: `
      <p>Visualise the travelling patterns of a station by selecting it on the map. Further, adjust Time Period, User Class, Direction and Metric. </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
      <p>Direction toggle allows to switch between the selected station being a starting point or a destination.  </p>      
      <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs"],
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
            visualisations: ["Station Pairs"],
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
            visualisations: ["Station Pairs"],
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
            visualisations: ["Station Pairs"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            info:"Select the desired time period. ",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
            info:"Select the desired metric.",
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
      pageName: "Station Pairs Difference (2-1)",
      url: "/norms-station-pair-difference",
      type: "MapLayout",
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about: `
      <p>Visualise difference of a selected station’s travelling patterns between two different scenarios by clicking on a preferred location. Further, adjust the Column Name to a desired metric, both Time Periods, both User Classes and a Direction. </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes</p>
      <p>Direction toggle allows to switch between the selected station being a starting point or a destination.</p>
      <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Origin or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Pairs Difference"],
            info:"Select the desired metric.",
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
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>Visualise both scenarios at the same time by selecting a station. Further, adjust the Column Name to a desired metric, both Time Periods, both User Classes and a Direction.</p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the selected station being a starting point or a destination.  </p>
      <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
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
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Demand",
                  paramValue: "demand",
                  legendSubtitleText: "Passengers",
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
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
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
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
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
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
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
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Pairs Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Pairs Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>Visualise station catchments by selecting a station on the map. Further, adjust the Scenario, Time Period, User Class, Direction and a Metric of choice. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
      <p>Direction is whether the passenger is boarding the train as an origin, or alighting the train as a destination, this map will then show which zones passengers come from or go to,</p>
      <p>Metric allows to further aggregate the catchment by the mode of transport used to access or egress the station such as car, walk, bus, Light Rail Transit. Alternatively, a Total Demand, by mode, can also be displayed.  </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment"],
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
            visualisations: ["Station Catchment"],
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
            visualisations: ["Station Catchment"],
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
            visualisations: ["Station Catchment"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [123, 456, 789]
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment"],
            type: "toggle",
            values: {
              source: "local",
              values: [
              {
                displayValue: "Origin",
                paramValue: "0",
                legendSubtitleText:"Origin"
              },
              {
                displayValue: "Destination",
                paramValue: "1",
                legendSubtitleText:"Destination"
              }
            ]
          },
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
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_total", displayValue: "Generalised Cost Total", legendSubtitleText: "Cost" },
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
      pageName: "Station Catchment Difference (2-1)",
      url: "/norms-station-catchment/difference",
      type: "MapLayout",
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>Visualise the difference between two scenarios and a selected station catchment by selecting a station of interest. Further, adjust both Scenarios, both Time Periods, both User Classes, Metric of choice and Direction</p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
      <p>Direction is whether the passenger is boarding the train as an origin, or alighting the train as a destination, this map will then show which zones passengers come from or go to.</p>
      <p>Metric allows to further aggregate the catchment in by the mode of transport used to access or egress the station such as car, walk, bus, Light Rail Transit. Alternatively, a Total Demand, by mode, can also be displayed.  </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Origin or Destination (1 and 2)",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            type: "toggle",
            values: {
              source: "local",
              values: [
              {
                displayValue: "Origin",
                paramValue: "0",
                legendSubtitleText:"Origin"
              },
              {
                displayValue: "Destination",
                paramValue: "1",
                legendSubtitleText:"Destination"
              }
            ]
          },
          },
          {
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [123, 456, 789]
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Station Catchment Difference"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_total", displayValue: "Generalised Cost Total", legendSubtitleText: "Cost" },
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
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>Visualise station catchments for two scenarios simultaneously by selecting the station of interest. Further, adjust both Scenarios, both Time Periods, both User Classes, Metric of choice and Direction</p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
      <p>Direction is whether the passenger is boarding the train as an origin, or alighting the train as a destination, this map will then show which zones passengers come from or go to.</p>
      <p>Metric allows to further aggregate the catchment in by the mode of transport used to access or egress the station such as car, walk, bus, Light Rail Transit. Alternatively, a Total Demand, by mode, can also be displayed.  </p>
      `,
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
            labelZoomLevel: 9,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Origin or Destination",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            type: "toggle",
            values: {
              source: "local",
              values: [
              {
                displayValue: "Origin",
                paramValue: "0",
                legendSubtitleText:"Origin"
              },
              {
                displayValue: "Destination",
                paramValue: "1",
                legendSubtitleText:"Destination"
              }
            ]
          },
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
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                { paramValue: "gen_cost_car", displayValue: "Generalised Cost Car", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_walk", displayValue: "Generalised Cost Walk", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_bus", displayValue: "Generalised Cost Bus", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_lrt", displayValue: "Generalised Cost LRT", legendSubtitleText: "Cost" },
                { paramValue: "gen_cost_total", displayValue: "Generalised Cost Total", legendSubtitleText: "Cost" },
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
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [123, 456, 789]
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Station Catchment Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Station Catchment Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [123, 456, 789]
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
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>The Rail Network included in the model is displayed by default and no selection is required. This visual can be further aggregated by selecting a Scenario, Time Period and one of the Metrics. </p>
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour. </p>
      `,
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
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelNulls: true,
            labelZoomLevel: 9,
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
            labelZoomLevel: 9,
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
            visualisations: ["Link Totals"],
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
            visualisations: ["Link Totals"],
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
            visualisations: ["Link Totals"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
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
            info:"Select the desired metric.",
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
      pageName: "Link Totals Difference (2-1)",
      url: "/norms-link-result-difference",
      type: "MapLayout",
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about: `
      <p>The Rail Network included in the model is displayed by default and no selection is required. This visual can be used in comparing differences between two Scenarios. To do so, adjust both of the Scenarios, both Time Periods and both Metrics (note: the metrics should match). 
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour.</p>
      `,
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
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelNulls: true,
            labelZoomLevel: 9,
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
            labelZoomLevel: 9,
            labelNulls: false,
            hoverNulls: false
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
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Totals Difference"],
            info:"Select the desired time period. ",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "propertyName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Totals Difference"],
            info:"Select the desired metric.",
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
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about: `
      <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice.</p>  
      <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
      <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour.</p>
      `, 
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
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelNulls: true,
            labelZoomLevel: 9,
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
            labelZoomLevel: 9,
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
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
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
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
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
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
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
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Link Totals Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Totals Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
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
            info:"Select the desired metric.",
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
      //termsOfUse: termsOfUse,
      category: "Zone",
      legalText: termsOfUse,
      about: `
      <p>The NorTMS zones included in the model are displayed by default and no selection is required. This visual can be further aggregated by selecting a Scenario, Time Period and one of the Metrics. </p>
      <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
      <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice.</p>
      `,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
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
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "£",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Passengers",
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
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals"],
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
            visualisations: ["Zone Totals"],
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
            visualisations: ["Zone Totals"],
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
            visualisations: ["Zone Totals"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Totals Difference (2-1)",
      url: "/zone-totals-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      legalText: termsOfUse,
      about: `
      <p>This visual can be used in comparing differences between two Scenarios. To do so, adjust both of the Scenarios, both Time Periods and both Metrics (note: the metrics selection should match). </p>
      <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
      <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice. </p>
      `, //To be added.
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Origin or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Totals Difference"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "£",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Passengers",
                }
              ],
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Totals Side-by-Side",
      url: "/zone-totals-dual",
      type: "DualMapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      legalText: termsOfUse,
      about: `
      <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice. </p>
      <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
      <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice. </p>
      `,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
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
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Revenue',
                  paramValue: 'revenue',
                  legendSubtitleText: "£",
                },
                {
                  displayValue: 'Demand',
                  paramValue: 'demand',
                  legendSubtitleText: "Passengers",
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
            filterName: "Filter Left Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Totals Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: {
              source: "api"
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Benefits",
      url: "/zone-benefits",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      legalText: termsOfUse,
      about: "Shows the zonal benefits (summed to origin or destination for the selected scenario compared with its 1.",
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneBenefits",
            name: "NoRMS Zone Benefits",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Benefits",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Benefits",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Benefits",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results",
            
          },
        ],
        metadataTables: [
          {
            name: "input_norms_scenario",
            path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario",
            where: [
              {
                column: "scenario_type",
                operand: "=",
                value: "DS"
              },
              {
                column: "business_case",
                operand: "=",
                value: "Bradford SOBC 2024"
              }
            ]
          },
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Benefits"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Total Generalised Cost',
                  paramValue: 'total_gen_cost',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'IVT',
                  paramValue: 'ivt',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Crowding',
                  paramValue: 'crowding',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Wait Time',
                  paramValue: 'wait_time',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Walk Time',
                  paramValue: 'walk_time',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Penalty',
                  paramValue: 'penalty',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Access Egress',
                  paramValue: 'access_egress',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Value of choice',
                  paramValue: 'value_of_choice',
                  legendSubtitleText: "Pass. Mins",
                },
              ],
            },
          },
          {
            filterName: "Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits"],
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
            visualisations: ["Zone Benefits"],
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
            visualisations: ["Zone Benefits"],
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
            visualisations: ["Zone Benefits"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
        ]
      }
    },
    {
      pageName: "Zone Benefits Difference (2-1)",
      url: "/zone-benefits-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      legalText: termsOfUse,
      about: `
      <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice. </p>
      <p>This visual can be used to display the travel movements between NorTMS zones, selecting a zone as the origin or destination will show the metric with respect to other zones in the model. Selecting an origin zone, and the demand metric, the visual will display the destinations that demand goes to as a choropleth. </p>
      <p>Metrics are aggregated by Demand (number of passengers), generlised cost and generalized journey time.</p>
      `,
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneTotalsDifference",
            name: "NoRMS Zone Benefits Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Benefits Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Benefits Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Benefits Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results/difference",
            
          },
        ],
        metadataTables: [
          {
            name: "input_norms_scenario",
            path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario",
            where: [
              {
                column: "scenario_type",
                operand: "=",
                value: "DS"
              },
              {
                column: "business_case",
                operand: "=",
                value: "Bradford SOBC 2024"
              }
            ]
          }, userClassMetadataTable],
        filters: [
          {
            filterName: "Scenario 1/Scenario 2 Do Minimum",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
            info:"Select a scenario for both scenario 1 and scenario 2.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            isClearable: false,
            multiSelect: false,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "dm_scenario_code",
              paramColumn: "dm_scenario_code",
              sort: "ascending",
              exclude: ["NA"]
            },
          },
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Benefits Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
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
            filterName: "Origin or Destination (Scenario 1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "User Class (Scenario 1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits Difference"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Time Period (Scenario 1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Benefits Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Metric (Scenario 1 and 2)",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Benefits Difference"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Total Generalised Cost',
                  paramValue: 'total_gen_cost',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'IVT',
                  paramValue: 'ivt',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Crowding',
                  paramValue: 'crowding',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Wait Time',
                  paramValue: 'wait_time',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Walk Time',
                  paramValue: 'walk_time',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Penalty',
                  paramValue: 'penalty',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Access Egress',
                  paramValue: 'access_egress',
                  legendSubtitleText: "Pass. Mins",
                },
                {
                  displayValue: 'Value of choice',
                  paramValue: 'value_of_choice',
                  legendSubtitleText: "Pass. Mins",
                },
              ],
            },
          }
        ]
      }
    },
    {
      pageName: "Key Location Accessibility (Zone Totals)",
      url: "/accessibility-key-location-totals",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Key Location)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the number of accessible key locations from/to each modelled zone within a given journey time threshold.</p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination,<br> 
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p><b>Key Location Type</b> is a list of the attractions included in the accessibility tool: air routes, airport zones, beach zones, businesses, city and major city zones, 
      national park zones, port zones, university buildings, and visitor attractions. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. 
      If origin is selected, the narrative is “X number of key locations are accessed from the zone as origin within Y minutes”. If destination is selected, 
      the narrative changes to “X number of key locations can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on 
      the combination of the user-class and time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
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
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals"],
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
            visualisations: ["Zone Accessibility Totals"],
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
            visualisations: ["Zone Accessibility Totals"],
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
            filterName: "Scenario Code",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals"],
            info: "Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
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
            target: "validate",
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
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            info:"Select the desired key location.",
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
            min: 45,
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
      pageName: "Key Location Accessibility (Zone Totals) Difference",
      url: "/accessibility-key-location-totals-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Key Location)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</u></b> the number of accessible key locations from/to each modelled zone within a given journey time threshold.</p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination,<br> 
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p><b>Key Location Type</b> is a list of the attractions included in the accessibility tool: air routes, airport zones, beach zones, businesses, city and major city zones, 
      national park zones, port zones, university buildings, and visitor attractions. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. 
      If origin is selected, the narrative is “X number of key locations are accessed from the zone as origin within Y minutes”. If destination is selected, 
      the narrative changes to “X number of key locations can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on 
      the combination of the user-class and time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
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
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-total/difference",
          },
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Origin Or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Filter User Class by Segment (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "Filter User Class by Car Availability (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Key Location Type (1 and 2)",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Totals Difference"],
            info:"Select the desired key location.",
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
            filterName: "Threshold Value (1 and 2)",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Totals Difference"],
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
      pageName: "Zone Pairs",
      url: "/norms-zones-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      about:`
      <p>Visualise the distribution patterns of Demand, Generalised Cost and Generalised Journey Time of a zone by selecting it on the map. Further, adjust time period, direction and desired metric. </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
      `,
      legalText: termsOfUse,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs"],
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
            visualisations: ["Zone Pairs"],
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
            visualisations: ["Zone Pairs"],
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
            visualisations: ["Zone Pairs"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
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
            info:"Select the desired metric.",
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
      pageName: "Zone Pairs Difference (2-1)",
      url: "/norms-zones-pair-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      about:`
      <p>Visualise the change in the distribution patterns of a given metric between two difference scenarios by selecting the desired zone on the map. Metrics included in the functionality are: Demand, 
      Generalised Cost and Generalised Journey Time. Further, adjust time period, direction and desired metric.  </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
      `,
      legalText: termsOfUse,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Origin or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues
          },
          {
            filterName: "Metric (1 and 2)",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Pairs Difference"],
            info:"Select the desired metric.",
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
      legalText: termsOfUse,
      about:`
      <p>Visualise the distribution patterns of Demand, Generalised Cost and Generalised Journey Time of a zone by selecting it on the map. Further, adjust time period, direction and desired metric. </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
      `,
      //termsOfUse: termsOfUse,
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
        metadataTables: [ inputNormsScenarioMetadataTable, userClassMetadataTable ],
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
            info:"Select the desired metric.",
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
            filterName: "Filter Left Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
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
            filterName: "Filter Left Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the left scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
          },
          {
            filterName: "Filter Right Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
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
            filterName: "Filter Right Scenario by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
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
            filterName: "Filter Right Scenario by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Pairs Side-by-Side"],
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
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Use the Network, Demand, and Year filters to select the right scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
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
              exclude: excludeCodes
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Select the desired time period.",
            type: "toggle",
            values: timePeriodCodeValues,
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Pairs Side-by-Side"],
            info:"Select the desired user class.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "metadataTable",
              metadataTableName: "norms_userclass_list",
              displayColumn: "name",
              paramColumn: "id",
              sort: "descending",
              exclude: [1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
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
      pageName: "Key Location Accessibility (Zone Pair)",
      url: "/accessibility-key-location-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Key Location)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the distribution (catchment) of the number of accessible key locations from/to the given modelled zone. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold, <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p><b>Key Location Type</b> is a list of the attractions included in the accessibility tool: air routes, airport zones, beach zones, businesses, city and major city zones, 
      national park zones, port zones, university buildings, and visitor attractions. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. 
      If origin is selected, the narrative is “X businesses are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X businesses can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the 
      combination of the user-class and time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
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
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair"],
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
            visualisations: ["Zone Accessibility Pair"],
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
            visualisations: ["Zone Accessibility Pair"],
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
            visualisations: ["Zone Accessibility Pair"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair"],
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
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair"],
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
            visualisations: ["Zone Accessibility Pair"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            visualisations: ["Zone Accessibility Pair"],
            info:"Select the desired key location.",
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
            visualisations: ["Zone Accessibility Pair"],
            type: "toggle",
            values: originOrDestinationValues
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
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair"],
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
      pageName: "Key Location Accessibility (Zone Pair) Difference",
      url: "/accessibility-key-location-pair-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Key Location)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</b></u> the distribution (catchment) of the number of accessible key locations from/to the given modelled zone. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold, <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p><b>Key Location Type</b> is a list of the attractions included in the accessibility tool: air routes, airport zones, beach zones, businesses, city and major city zones, 
      national park zones, port zones, university buildings, and visitor attractions. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. 
      If origin is selected, the narrative is “X businesses are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X businesses can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the 
      combination of the user-class and time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
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
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-od/difference",
          },
        ],
        metadataTables: [ 
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Origin Or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Filter User Class by Segment (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "Filter User Class by Car Availability (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Zone Accessibility Pair Difference"],
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
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Key Location Type (1 and 2)",
            paramName: "keyLocationTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Accessibility Pair Difference"],
            info:"Select the desired key location.",
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
            filterName: "Threshold Value (1 and 2)",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Accessibility Pair Difference"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 15,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
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
        ]
      }
    },

    {
      pageName: "Pop/Emp Accessibility (Zone Totals)",
      url: "/accessibility-landuse-totals",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the number of accessible population and employment from/to each modelled zone within a given journey time threshold.  </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p>The Land Use metrics to be showcased can be toggled with the following filters: </p>
      <p><ul><li><b>Landuse</b>: refers to population and employment. 
      <li> <b>Landuse Segment 1</b> and <b>Segment 2</b> refer to the segmentation of the land use metric to be showcased in the visualisation: 
      <ul><li>For population:<p>P0, total population </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), C3 as SOC3 (non-skilled workers), 
      C4 as SOC4 (non-working age), </p><p>P2, population segmented by car availability: C1 (no car), C2 (car available). </p>
      <li>For employment:<p>P0, total employment </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), 
      C3 as SOC3 (non-skilled workers). </p><p>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </p></p></ul></ul>
      <p><b>Landuse Exog</b> refers to Static if the figures come from exogenous assumptions (e.g., NTEM) or to Dynamic if the figures come from the NELUM model (currently not uploaded in the back end). 
      The framework has been set-up to accommodate different sources of population and employment. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSLanduseAccessibilityTotals",
            name: "NoRMS Landuse Accessibility Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-totals",
          },
        ],
        metadataTables: [
          landUseSegmentMetadataTable,
          inputNormsScenarioMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals"],
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
            visualisations: ["Landuse Accessibility Totals"],
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
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
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
            visualisations: ["Landuse Accessibility Totals"],
            info: "Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            info: "Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals"],
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
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals"],
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
            visualisations: ["Landuse Accessibility Totals"],
            info: "Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Landuse",
            paramName: "landuse",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Landuse Accessibility Totals"],
            info:"Select the Land Use metric to show. Choose between population and employment and desired segmentation (please refer to the “about this visualisation” to know more). ",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: landuseValues
          },
          {
            filterName: "Landuse Segment 1",
            paramName: "landuseSegment1",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment1",
              paramColumn: "segment1",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Segment 2",
            paramName: "landuseSegment2",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment2",
              paramColumn: "segment2",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Reference",
            paramName: "landuseReference",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            type: "dropdown",
            values: landuseReferenceValues
          },
          {
            filterName: "Landuse Exog",
            paramName: "landuseExog",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            type: "toggle",
            values: landuseExogValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals"],
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
      pageName: "Pop/Emp Accessibility (Zone Totals) Difference",
      url: "/accessibility-landuse-totals-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</u></b> the number of accessible population and employment from/to each modelled zone within a given journey time threshold.  </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p>The Land Use metrics to be showcased can be toggled with the following filters: </p>
      <p><ul><li><b>Landuse</b>: refers to population and employment. 
      <li> <b>Landuse Segment 1</b> and <b>Segment 2</b> refer to the segmentation of the land use metric to be showcased in the visualisation: 
      <ul><li>For population:<p>P0, total population </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), C3 as SOC3 (non-skilled workers), 
      C4 as SOC4 (non-working age), </p><p>P2, population segmented by car availability: C1 (no car), C2 (car available). </p>
      <li>For employment:<p>P0, total employment </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), 
      C3 as SOC3 (non-skilled workers). </p><p>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </p></p></ul></ul>
      <p><b>Landuse Exog</b> refers to Static if the figures come from exogenous assumptions (e.g., NTEM) or to Dynamic if the figures come from the NELUM model (currently not uploaded in the back end). 
      The framework has been set-up to accommodate different sources of population and employment. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSLanduseAccessibilityTotalsDifference",
            name: "NoRMS Landuse Accessibility Totals Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Totals Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-totals/difference",
          },
        ],
        metadataTables: [
          landUseSegmentMetadataTable,
          inputNormsScenarioMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            paramName: "scenarioYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            info: "Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            paramName: "scenarioYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Landuse (1 and 2)",
            paramName: "landuse",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Landuse Accessibility Totals Difference"],
            info:"Select the Land Use metric to show. Choose between population and employment and desired segmentation (please refer to the “about this visualisation” to know more). ",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: landuseValues
          },
          {
            filterName: "Landuse Segment 1 (1 and 2)",
            paramName: "landuseSegment1",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment1",
              paramColumn: "segment1",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Segment 2 (1 and 2)",
            paramName: "landuseSegment2",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment2",
              paramColumn: "segment2",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Reference (1 and 2)",
            paramName: "landuseReference",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "dropdown",
            values: landuseReferenceValues
          },
          {
            filterName: "Landuse Exog (1 and 2)",
            paramName: "landuseExog",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "toggle",
            values: landuseExogValues
          },
          {
            filterName: "Origin or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Filter User Class by Segment (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "Filter User Class by Car Availability (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
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
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            info: "Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Threshold Value (1 and 2)",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Totals Difference"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 45,
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
      pageName: "Pop/Emp Accessibility (Zone Pair)",
      url: "/accessibility-landuse-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the distribution (catchment) of the number of accessible population and employment from/to the given modelled zone. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold. <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p>The Land Use metrics to be showcased can be toggled with the following filters: </p>
      <p><ul><li><b>Landuse</b>: refers to population and employment. 
      <li> <b>Landuse Segment 1</b> and <b>Segment 2</b> refer to the segmentation of the land use metric to be showcased in the visualisation: 
      <ul><li>For population:<p>P0, total population </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), C3 as SOC3 (non-skilled workers), 
      C4 as SOC4 (non-working age), </p><p>P2, population segmented by car availability: C1 (no car), C2 (car available). </p>
      <li>For employment:<p>P0, total employment </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), 
      C3 as SOC3 (non-skilled workers). </p><p>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </p></p></ul></ul>
      <p><b>Landuse Exog</b> refers to Static if the figures come from exogenous assumptions (e.g., NTEM) or to Dynamic if the figures come from the NELUM model (currently not uploaded in the back end). 
      The framework has been set-up to accommodate different sources of population and employment. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSLanduseAccessibilityPair",
            name: "NoRMS Landuse Accessibility Pair",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Pair",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Pair",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Pair",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-pair",
          },
        ],
        metadataTables: [
          landUseSegmentMetadataTable,
          inputNormsScenarioMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair"],
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
            visualisations: ["Landuse Accessibility Pair"],
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
            paramName: "scenarioYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
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
            visualisations: ["Landuse Accessibility Pair"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair"],
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
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair"],
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
            visualisations: ["Landuse Accessibility Pair"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Landuse",
            paramName: "landuse",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Landuse Accessibility Pair"],
            info:"Select the Land Use metric to show. Choose between population and employment and desired segmentation (please refer to the “about this visualisation” to know more).",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: landuseValues,
          },
          {
            filterName: "Landuse Segment 1",
            paramName: "landuseSegment1",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment1",
              paramColumn: "segment1",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Segment 2",
            paramName: "landuseSegment2",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment2",
              paramColumn: "segment2",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Reference",
            paramName: "landuseReference",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "dropdown",
            values: landuseReferenceValues
          },
          {
            filterName: "Landuse Exog",
            paramName: "landuseExog",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "toggle",
            values: landuseExogValues
          },
          {
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Threshold Value",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 15,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair"],
            type: "map",
            layer: "NoRMS Landuse Accessibility Pair",
            field: "id",
          },
        ]
      }
    },

    {
      pageName: "Pop/Emp Accessibility (Zone Pair) Difference",
      url: "/accessibility-landuse-pair-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</b></u> the distribution (catchment) of the number of accessible population and employment from/to the given modelled zone. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold. <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p>The Land Use metrics to be showcased can be toggled with the following filters: </p>
      <p><ul><li><b>Landuse</b>: refers to population and employment. 
      <li> <b>Landuse Segment 1</b> and <b>Segment 2</b> refer to the segmentation of the land use metric to be showcased in the visualisation: 
      <ul><li>For population:<p>P0, total population </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), C3 as SOC3 (non-skilled workers), 
      C4 as SOC4 (non-working age), </p><p>P2, population segmented by car availability: C1 (no car), C2 (car available). </p>
      <li>For employment:<p>P0, total employment </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), 
      C3 as SOC3 (non-skilled workers). </p><p>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </p></p></ul></ul>
      <p><b>Landuse Exog</b> refers to Static if the figures come from exogenous assumptions (e.g., NTEM) or to Dynamic if the figures come from the NELUM model (currently not uploaded in the back end). 
      The framework has been set-up to accommodate different sources of population and employment. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSLanduseAccessibilityPairDifference",
            name: "NoRMS Landuse Accessibility Pair Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Pair Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Pair Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Pair Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-pair/difference",
          },
        ],
        metadataTables: [
          landUseSegmentMetadataTable,
          inputNormsScenarioMetadataTable,
          userClassMetadataTable
        ],
        filters: [ 
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            paramName: "scenarioYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            info: "Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            paramName: "scenarioYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            info: "Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Landuse (1 and 2)",
            paramName: "landuse",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Landuse Accessibility Pair Difference"],
            info:"Select the Land Use metric to show. Choose between population and employment and desired segmentation (please refer to the “about this visualisation” to know more). ",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: landuseValues,
          },
          {
            filterName: "Landuse Segment 1 (1 and 2)",
            paramName: "landuseSegment1",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment1",
              paramColumn: "segment1",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Segment 2 (1 and 2)",
            paramName: "landuseSegment2",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: true,
            shouldBeValidated: true,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "landuse_segment_list",
              displayColumn: "segment2",
              paramColumn: "segment2",
              sort: "ascending",
              exclude: []
            },
          },
          {
            filterName: "Landuse Reference (1 and 2)",
            paramName: "landuseReference",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "dropdown",
            values: landuseReferenceValues
          },
          {
            filterName: "Landuse Exog (1 and 2)",
            paramName: "landuseExog",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "toggle",
            values: landuseExogValues
          },
          {
            filterName: "Origin Or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Filter User Class by Segment (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "Filter User Class by Car Availability (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
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
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Threshold Value (1 and 2)",
            paramName: "thresholdValue",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "slider",
            info: "Threshold value to filter data",
            min: 45,
            max: 300,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Landuse Accessibility Pair Difference"],
            type: "map",
            layer: "NoRMS Landuse Accessibility Pair Difference",
            field: "id",
          },
        ]
      }
    },
    /*{
      pageName: "Journey Time Accessibility (Zone Totals)",
      url: "/accessibility-journey-time-totals",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSJourneyTimeAccessibilityTotals",
            name: "NoRMS Journey Time Accessibility Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Journey Time Accessibility Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Journey Time Accessibility Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Journey Time Accessibility Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-journey-time-total",
            legendText: [
              {
                legendSubtitleText: "mins" 
              }
            ]
          },
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals"],
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
            visualisations: ["Journey Time Accessibility Totals"],
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
            visualisations: ["Journey Time Accessibility Totals"],
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
            visualisations: ["Journey Time Accessibility Totals"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals"],
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals"],
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
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals"],
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
            visualisations: ["Journey Time Accessibility Totals"],
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
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals"],
            type: "toggle",
            values: originOrDestinationValues
          },
        ]
      }
    },*/
    /*{
      pageName: "Journey Time Accessibility (Zone Totals) Difference",
      url: "/accessibility-journey-time-totals-difference",
      type: "MapLayout",
      category: "Accessibility",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoRMSJourneyTimeAccessibilityTotalsDifference",
            name: "NoRMS Journey Time Accessibility Totals Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Journey Time Accessibility Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Journey Time Accessibility Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Journey Time Accessibility Totals Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-journey-time-total/difference",
            legendText: [
              {
                legendSubtitleText: "mins" 
              }
            ]
          },
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Time Period - 1",
            paramName: "timePeriodCodesDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment - 1",
            paramName: "userClassIdsDoMinimum",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter User Class by Car Availability - 1",
            paramName: "userClassIdsDoMinimum",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "User Class - 1",
            paramName: "userClassIdsDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Time Period - 2",
            paramName: "timePeriodCodesDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment - 2",
            paramName: "userClassIdsDoSomething",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Filter User Class by Car Availability - 2",
            paramName: "userClassIdsDoSomething",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "User Class - 2",
            paramName: "userClassIdsDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
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
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Totals Difference"],
            type: "toggle",
            values: originOrDestinationValues
          }
        ]
      }
    },*/

    {
      pageName: "Journey Time Accessibility (Zone Pair)",
      url: "/accessibility-journey-time-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Journey Time)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the distribution (catchment) of the modelled journey time for the selected OD. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold. <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).
      <ul><li>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </ul></ul></p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSJourneyTimeAccessibilityPair",
            name: "NoRMS Journey Time Accessibility Pair",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Journey Time Accessibility Pair",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Journey Time Accessibility Pair",
            type: "joinDataToMap",
            joinLayer: "NoRMS Journey Time Accessibility Pair",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-journey-time-od",
            legendText: [
              {
                legendSubtitleText: "mins" 
              }
            ]
          },
        ],
        metadataTables: [
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair"],
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
            visualisations: ["Journey Time Accessibility Pair"],
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
            visualisations: ["Journey Time Accessibility Pair"],
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
            visualisations: ["Journey Time Accessibility Pair"],
            info:"Use the Network, Demand, and Year filters to select the scenario. If scenario specifics are already known, you can directly use the Scenario drop-down. ",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: excludeCodes
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCodes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Filter User Class by Segment",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair"],
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
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair"],
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
            visualisations: ["Journey Time Accessibility Pair"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
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
            filterName: "Origin Or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Metric",
            paramName: "journey_time",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Journey Time Accessibility Pair"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "local",
              values: [
                { paramValue: "journey_time", displayValue: "Journey Time", legendSubtitleText: "mins" },
              ]
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair"],
            type: "map",
            layer: "NoRMS Journey Time Accessibility Pair",
            field: "id",
          },
        ]
      }
    },
    {
      pageName: "Journey Time Accessibility (Zone Pair) Difference",
      url: "/accessibility-journey-time-pair-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Journey Time)",
      legalText:termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</b></u> the distribution (catchment) of the modelled journey time for the selected OD. </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. the journey time threshold. <br>
      6. and finally select the desired zone from the map. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).
      <ul><li>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </ul></ul></p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSJourneyTimeAccessibilityPairDifference",
            name: "NoRMS Journey Time Accessibility Pair Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Journey Time Accessibility Pair Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Journey Time Accessibility Pair Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Journey Time Accessibility Pair Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-journey-time-od/difference",
            legendText: [
              {
                legendSubtitleText: "mins" 
              }
            ]
          },
        ],
        metadataTables: [ 
          inputNormsScenarioMetadataTable,
          keyLocationTypeMetadataTable,
          userClassMetadataTable
        ],
        filters: [
          {
            filterName: "Filter Scenario 1 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 1 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Scenario 1",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            info:"Use the Network, Demand, and Year filters to select the first scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Filter Scenario 2 by Network",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Demand Scenario",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Filter Scenario 2 by Year",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Scenario 2",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            info:"Use the Network, Demand, and Year filters to select the second scenario. If scenario specifics are already known, you can directly use the Scenario drop-down.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            },
          },
          {
            filterName: "Origin Or Destination (1 and 2)",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            type: "toggle",
            values: originOrDestinationValues
          },
          {
            filterName: "Filter User Class by Segment (1 and 2)",
            paramName: "userClassId",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "Filter User Class by Car Availability (1 and 2)",
            paramName: "userClassIds",
            target: "validate",
            actions: [{ action: "none" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
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
            filterName: "User Class (1 and 2)",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            info:"Select the desired user-class by filtering via Segment (trip purpose) and Car Availability.",
            type: "dropdown",
            shouldBeBlankOnInit: false,
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
            filterName: "Time Period (1 and 2)",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            info:"Select the desired time period.",
            type: "toggle",
            shouldBeBlankOnInit: false,
            multiSelect: true,
            isClearable: true,
            values: timePeriodCodesValues
          },
          {
            filterName: "Metric",
            paramName: "journey_time",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Journey Time Accessibility Pair"],
            info:"Select the desired metric.",
            type: "dropdown",
            containsLegendInfo: true,
            shouldBeBlankOnInit: false,
            shouldFilterOnValidation: false,
            shouldBeValidated: false,
            shouldFilterOthers: false,
            multiSelect: false,
            isClearable: false,
            values: {
              source: "local",
              values: [
                { paramValue: "journey_time", displayValue: "Journey Time", legendSubtitleText: "mins" },
              ]
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Journey Time Accessibility Pair Difference"],
            type: "map",
            layer: "NoRMS Journey Time Accessibility Pair Difference",
            field: "id",
          },
        ]
      }
    },
  ],
};
