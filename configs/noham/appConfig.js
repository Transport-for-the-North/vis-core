const networkScenarioValues = {
  source: "local",
  values: [
    {
      displayValue: "Do minimum",
      paramValue: "dm",
    },
  ]
}

const originOrDestTripValues = {
  source: "local",
  values: [
    {
      displayValue: 'Origin Trips',
      paramValue: 'origin_trips',
      legendSubtitleText: "unit"
    },
    {
      displayValue: 'Destination Trips',
      paramValue: 'destination_trips',
      legendSubtitleText: "unit"
    }
  ],
}

const deliveryProgramValues = {
  source: "local",
  values: [
    {
      displayValue: "Default",
      paramValue: "",
    },
    {
      displayValue: "MRN",
      paramValue: "MRN",
    },
  ],
}

const demandScenarioValues = {
  source: "local",
  values: [
    {
      displayValue: "Base",
      paramValue: "base",
    },
    {
      displayValue: "Core",
      paramValue: "core",
    },
  ],
}

const yearValues = {
  source: "local",
  values: [
    {
      displayValue: "2018",
      paramValue: 2018,
    },
    {
      displayValue: "2033",
      paramValue: 2033,
    },
    {
      displayValue: "2035",
      paramValue: 2035,
    },
    {
      displayValue: "2042",
      paramValue: 2042,
    },
    {
      displayValue: "2052",
      paramValue: 2052,
    },
  ],
}

const timePeriodValues = {
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
  ],
}

const linkMetricValues = {
  source: "local",
  values: [
    {
      displayValue: "Distance (m)",
      paramValue: "distance_m",
      legendSubtitleText: "m"
  },
    {
      displayValue: "Number of lanes",
      paramValue: "number_lanes",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Car business vehicles (vehs)",
      paramValue: "car_eb_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "Car commuting (vehs)",
      paramValue: "car_comm_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "Car other (vehs)",
      paramValue: "car_other_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "LGV (vehs)",
      paramValue: "lgv_flow_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "HGV (vehs)",
      paramValue: "hgv_flow_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "Total flow (vehs)",
      paramValue: "total_flow_vehs",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "Link V/C ratio (%)",
      paramValue: "link_voc",
      legendSubtitleText: "%"
    },
    {
      displayValue: "Speed limit (kph)",
      paramValue: "speed_limit",
      legendSubtitleText: "kph"
    },
    {
      displayValue: "Net speed (kph)",
      paramValue: "netspd_kph",
      legendSubtitleText: "kph"
    },
    {
      displayValue: "Total time (secs)",
      paramValue: "total_time_secs",
      legendSubtitleText: "secs"
    },
    {
      displayValue: "Link delay (secs)",
      paramValue: "link_delay_secs",
      legendSubtitleText: "secs"
    },
    {
      displayValue: "Link queues (secs)",
      paramValue: "link_queues_secs",
      legendSubtitleText: "secs"
    },
  ],
}

const nodeMetricValues = {
  source: "local",
  values: [
    {
      displayValue: 'Node V/C ratio (%)',
      paramValue: 'voc_perc',
      legendSubtitleText: "%"
    },
    {
      displayValue: 'Delay (secs)',
      paramValue: 'delay_secs',
      legendSubtitleText: "secs"
    }
  ],
}


const userClassValues = {
  source: "local",
  values: [
    {
      displayValue: "All Vehicles",
      paramValue: "all_vehicles",
    },
    {
      displayValue: "Car: Business",
      paramValue: "UC1-Car_Business",
    },
    {
      displayValue: "Car: Commute",
      paramValue: "UC2-Car_Commute",
    },
    {
      displayValue: "Car: Other",
      paramValue: "UC3-Car_Other",
    },
    {
      displayValue: "LGV",
      paramValue: "UC4-LGV",
    },
    {
      displayValue: "HGV",
      paramValue: "UC5-HGV",
    },
  ],
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

const pairMetricValues = {
  source: "local",
  values: [
    {
      displayValue: "Trips (vehs)",
      paramValue: "trips_veh",
      legendSubtitleText: "vehs"
    },
    {
      displayValue: "Avg. time (secs)",
      paramValue: "travel_time_secs",
      legendSubtitleText: "secs"
    },
    {
      displayValue: "Avg. distance (m)",
      paramValue: "distance_m",
      legendSubtitleText: "m"
    },
  ],
}

const normsMetadataTable = {
  name: "v_input_scenarios",
  path: "/api/getgenericdataset?dataset_id=road_data.v_input_scenarios"
};

export const appConfig = {
  title: "TfN’s Northern Highway Assignment Model (NoHAM) Visualiser",
  introduction: `<p>The TfN’s Northern Highway Assignment Model (NoHAM) Visualiser aims to collate and visualise outputs from the Transport for the North Northern Highway Assignment Model (NoHAM), that is part of the Northern Transport Modelling System (NorTMS).
   NorTMS is a rail and highways modelling system and is used to appraise rail and highways scheme assessments. The purpose of this platform is to collate and visualise highway model data in an interactive, intuitive,
   web-based format. This instance of the platform presents information from the {insert project name or study} project. This visualisation tool builds on the modelling aspect of the work that delivers analysis
   based on scenario testing done using NoHAM.</p><p>Is the app is for a specific project, we could then have a short description of the project for example ADV says for NPR - “NPR is a large-scale programme
   of investment in the North’s rail network between six major cities, the North’s largest airport and other significant economic centres. The investment options under consideration consist of sections of wholly
   new line, major upgrades and use of planned HS2 infrastructure.</p>`,
  background: "",
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  contactText: "Please contact Luke MONAGHAN for any questions on this data tool.",
  contactEmail: "luke.monaghan@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/hero-image.jpg",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  appPages: [
    {
      pageName: "Single Scenario",
      url: "/noham-links",
      type: "MapLayout",
      category: "Link",
      about: `<p>NoHAM model link data mapped to road sections; model links typically represent roads between intersections on the network. 
      Some road sections are not represented in the model as the network is a simplification. This visualisation allows for the examination
      of road section attributes and comparisons of modelled traffic conditions in different scenarios.</p>
      <p>Currently includes: <ul><li>Link distance – the length of the modelled section of road,</li><li>Number of lanes – the number of open traffic lanes by direction</li>
      <li>Traffic flow – represents the flow, by vehicle type and journey purpose, in an average hour traversing the road section,</li>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation of a road section. It compares traffic volumes with link capacity. For example, a v/c ration of 1.00/100% indicates the link is operating at 100% of it’s capacity,</li>
      <li>Speed limit – the sign posted speed limit on the road section (kph),</li><li>Average speed – the average speed (kph) of vehicles traveling along the road section, considering traffic congestion,</li>
      <li>Delays – the additional travel time (seconds) experienced by a vehicle beyond uncongested conditions. It is measured as the different between the congested travel time and the free-flow travel time.</li>
      <li>Queues – the average queue length over the average hour, reflecting transient (queues at red lights/junctions) and over-capacity queues where capacity at a junction is insufficient for traffic demand.</li></ul></p>`,
      config: {
        layers: [
          {
            uniqueId: "NoHAMLinksVectorTile",
            name: "NoHAM Links",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
            filters: [
              {
                type: "checkbox",
                displayText: "Show zone connectors",
                value: "ZC",
                property: "link_type"
              }
            ]
          },
        ],
        visualisations: [
          {
            name: "Link",
            type: "joinDataToMap",
            joinLayer: "NoHAM Links",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/link-results",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link"],
            type: "dropdown",
            containsLegendInfo: true,
            values: linkMetricValues,
          },
          {
            filterName: "Delivery programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Network scenario",
            paramName: "networkScenarioName",
            info: "Network DM/DS",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "toggle",
            values: timePeriodValues
          },
        ],
      },
    },
    // -----------------------------------------------------------
    // Node results definition
    {
      pageName: "Difference",
      url: "/link-result-difference",
      type: "MapLayout",
      about: `<p>NoHAM model link data mapped to road sections; model links typically represent roads between intersections on the network. 
      Some road sections are not represented in the model as the network is a simplification. This visualisation allows for the examination
      of road section attributes and comparisons of modelled traffic conditions in different scenarios.</p>
      <p>Currently includes: <ul><li>Link distance – the length of the modelled section of road,</li><li>Number of lanes – the number of open traffic lanes by direction</li>
      <li>Traffic flow – represents the flow, by vehicle type and journey purpose, in an average hour traversing the road section,</li>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation of a road section. It compares traffic volumes with link capacity. For example, a v/c ration of 1.00/100% indicates the link is operating at 100% of it’s capacity,</li>
      <li>Speed limit – the sign posted speed limit on the road section (kph),</li><li>Average speed – the average speed (kph) of vehicles traveling along the road section, considering traffic congestion,</li>
      <li>Delays – the additional travel time (seconds) experienced by a vehicle beyond uncongested conditions. It is measured as the different between the congested travel time and the free-flow travel time.</li>
      <li>Queues – the average queue length over the average hour, reflecting transient (queues at red lights/junctions) and over-capacity queues where capacity at a junction is insufficient for traffic demand.</li></ul></p>`,
      category: "Link",
      config: {
        layers: [
          {
            uniqueId: "NoHAMLinkResultDifference",
            name: "LinkResultDifference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
          },
        ],
        visualisations: [
          {
            name: "Link Difference",
            type: "joinDataToMap",
            joinLayer: "LinkResultDifference",
            style: "line-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/link-results/difference",
          },
        ],
        metadataTables: [
          normsMetadataTable
        ],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: linkMetricValues,
          },
          {
            filterName: "Scen. 1 Delivery Programme",
            paramName: "deliveryProgrammeNameDoSomething",
            info: "Assignment delivery programme",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Year",
            paramName: "yearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            }
          },
          {
            filterName: "Scen. 1 Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            info: "Network DM/DS",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            info: "Matrix demand scenario do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Scen. 2 Delivery Programme",
            paramName: "deliveryProgrammeNameDoMinimum",
            info: "Assignment delivery programme",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Year",
            paramName: "yearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            info: "Network DM/DS",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            info: "Matrix demand scenario do minimum",  
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            isClearable: true,
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
        ]
      },
    },
    {
      pageName: "Side by Side",
      url: "/link-result-dual",
      type: "DualMapLayout",
      about: `<p>NoHAM model link data mapped to road sections; model links typically represent roads between intersections on the network. 
      Some road sections are not represented in the model as the network is a simplification. This visualisation allows for the examination
      of road section attributes and comparisons of modelled traffic conditions in different scenarios.</p>
      <p>Currently includes: <ul><li>Link distance – the length of the modelled section of road,</li><li>Number of lanes – the number of open traffic lanes by direction</li>
      <li>Traffic flow – represents the flow, by vehicle type and journey purpose, in an average hour traversing the road section,</li>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation of a road section. It compares traffic volumes with link capacity. For example, a v/c ration of 1.00/100% indicates the link is operating at 100% of it’s capacity,</li>
      <li>Speed limit – the sign posted speed limit on the road section (kph),</li><li>Average speed – the average speed (kph) of vehicles traveling along the road section, considering traffic congestion,</li>
      <li>Delays – the additional travel time (seconds) experienced by a vehicle beyond uncongested conditions. It is measured as the different between the congested travel time and the free-flow travel time.</li>
      <li>Queues – the average queue length over the average hour, reflecting transient (queues at red lights/junctions) and over-capacity queues where capacity at a junction is insufficient for traffic demand.</li></ul></p>`,
      category: "Link",
      config: {
        layers: [
          {
            uniqueId: "NoHAMLinkResultDual",
            name: "LinkResultDual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
          },
        ],
        visualisations: [
          {
            name: "Link Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "LinkResultDual",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/link-results",
            
          },
        ],
        metadataTables: [ normsMetadataTable],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: linkMetricValues,
          },
          {
            filterName: "Delivery Programme - Left",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year - Left",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Network Scenario Name - Left",
            paramName: "networkScenarioName",
            info: "Network DM/DS for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand Scenario - Left",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time Period - Left",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Delivery Programme - Right",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year - Right",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Network Scenario Name - Right",
            paramName: "networkScenarioName",
            info: "Network DM/DS for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand Scenario - Right",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time Period - Right",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
        ]
      },
    },
    // -----------------------------------------------------------
    //Node results definition
    {
      pageName: "Single Scenario",
      url: "/node-results",
      type: "MapLayout",
      category: "Node",
      about: `<p>NoHAM model node data mapped to junctions; junctions represented are those where model links intersect. 
      Some junctions  are not represented because the model is a simplification. This visualistion allows for the examination
      of junction attributes and the comparison of junction performance in different scenarios. </p><p>Currently includes: <ul>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation and performance of the junction.
      It compares traffic volumes with junction capacity, averaged across all arms of the junction. For example, a v/c of 1.00/100%
      indicates the junction is operating at capacity.</li>
      <li>Junction delay – is the additional travel time experience by a vehicle beyond uncongested conditions.
      It is a measured as the time difference between the congested travel time and free-flow travel time, at junctions
      delay includes time being held at red lights, or waiting to turn right. </li></ul></p>`,
      config: {
        layers: [
          {
            uniqueId: "NoHAMNodeResults",
            name: "NodeResults",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Results",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
          },
        ],
        visualisations: [
          {
            name: "Node Results",
            type: "joinDataToMap",
            joinLayer: "NodeResults",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/node-results",
            
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Node Results"],
            type: "dropdown",
            containsLegendInfo: true,
            values: nodeMetricValues,
          },
          {
            filterName: "Delivery Programme",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "toggle",
            values: {
              source: "api",
            },
          }]
      },
    },

    // -----------------------------------------------------------
    //Node results difference Definition
    {
      pageName: "Difference",
      url: "/node-result-difference",
      type: "MapLayout",
      about: `<p>NoHAM model node data mapped to junctions; junctions represented are those where model links intersect. 
      Some junctions  are not represented because the model is a simplification. This visualistion allows for the examination
      of junction attributes and the comparison of junction performance in different scenarios. </p><p>Currently includes: <ul>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation and performance of the junction.
      It compares traffic volumes with junction capacity, averaged across all arms of the junction. For example, a v/c of 1.00/100%
      indicates the junction is operating at capacity.</li>
      <li>Junction delay – is the additional travel time experience by a vehicle beyond uncongested conditions.
      It is a measured as the time difference between the congested travel time and free-flow travel time, at junctions
      delay includes time being held at red lights, or waiting to turn right. </li></ul></p>`,
      category: "Node",
      config: {
        layers: [
          {
            uniqueId: "NoHAMNodeResultDifference",
            name: "NodeResultDifference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Result Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
          },
        ],
        visualisations: [
          {
            name: "Node Result Difference",
            type: "joinDataToMap",
            joinLayer: "NodeResultDifference",
            style: "circle-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/node-results/difference",
            
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: nodeMetricValues,
          },       
          {
            filterName: "Scen. 1 Delivery Programme",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Year",
            paramName: "yearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Scen. 2 Delivery Programme",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Year",
            paramName: "yearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
        ],
      },
    },
    {
      pageName: "Side by Side",
      url: "/node-results-dual",
      type: "DualMapLayout",
      category: "Node",
      about: `<p>NoHAM model node data mapped to junctions; junctions represented are those where model links intersect. 
      Some junctions  are not represented because the model is a simplification. This visualistion allows for the examination
      of junction attributes and the comparison of junction performance in different scenarios. </p><p>Currently includes: <ul>
      <li>Volume to capacity ratio (v/c %) – is a measure that reflects the operation and performance of the junction.
      It compares traffic volumes with junction capacity, averaged across all arms of the junction. For example, a v/c of 1.00/100%
      indicates the junction is operating at capacity.</li>
      <li>Junction delay – is the additional travel time experience by a vehicle beyond uncongested conditions.
      It is a measured as the time difference between the congested travel time and free-flow travel time, at junctions
      delay includes time being held at red lights, or waiting to turn right. </li></ul></p>`,
      config: {
        layers: [
          {
            uniqueId: "NoHAMNodeResultsDual",
            name: "NodeResultsDual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Results Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
          },
        ],
        visualisations: [
          {
            name: "Node Results Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NodeResultsDual",
            style: "circle-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/node-results",
            
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: nodeMetricValues,
          },
          {
            filterName: "Left Delivery Programme",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right Delivery Programme",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          }
        ]
      },
    },

    // -----------------------------------------------------------
    // Zone results definition
    {
      pageName: "Single Scenario",
      url: "/zone-results",
      type: "MapLayout",
      category: "Matrix Trip Ends",
      about: `<p>NoHAM travel demand trip ends at an origin or destination. This visualisation 
      shows the total highway travel demand coming from or going to a NoHAM zone for each vehicle
      type and journey purpose as a choropleth. Zones are generalised geographic areas they share
       similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA).</p>`,
      config: {
        layers: [
          {
            uniqueId: "NoHAMZoneResults",
            name: "ZoneResults",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Results",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Results",
            type: "joinDataToMap",
            joinLayer: "ZoneResults",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/matrix-demand",
            
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Trip Type",
            paramName: "columnName",
            info: "Select whether you want to display the number of origin or destination trips assigned for each zone",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Results"],
            type: "toggle",
            containsLegendInfo: true,
            values: originOrDestTripValues,
          },
          {
            filterName: "Delivery Programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "User Class",
            paramName: "userClassCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "api",
              legendSubtitleText: "unit"
            },
          },
        ]
      }
    },

    // -----------------------------------------------------------
    //Zone difference Definition
    {
      pageName: "Difference",
      url: "/zone-result-difference",
      type: "MapLayout",
      about: `<p>NoHAM travel demand trip ends at an origin or destination. This visualisation 
      shows the total highway travel demand coming from or going to a NoHAM zone for each vehicle
      type and journey purpose as a choropleth. Zones are generalised geographic areas they share
       similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA).</p>`,
      category: "Matrix Trip Ends",
      config: {
        layers: [
          {
            uniqueId: "NoHAMZoneResultDifference",
            name: "ZoneResultDifference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Result Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Result Difference",
            type: "joinDataToMap",
            joinLayer: "ZoneResultDifference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/matrix-demand/difference",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Trip Type",
            paramName: "columnName",
            info: "Select whether you want to display the number of origin or destination trips assigned for each zone",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Result Difference"],
            type: "toggle",
            containsLegendInfo: true,
            values: originOrDestTripValues,
          },
          {
            filterName: "Scen.1 Delivery Programme",
            paramName: "deliveryProgrammeNameDoSomething",
            info: "Assignment delivery programme do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Year",
            paramName: "yearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            info: "Matrix demand scenario do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 1 Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Scen. 1 User Class",
            paramName: "userClassCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "api",
              legendSubtitleText: "unit"
            },
          },
          {
            filterName: "Scen.2 Delivery Programme",
            paramName: "deliveryProgrammeNameDoMinimum",
            info: "Assignment delivery programme do minimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Year",
            paramName: "yearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            info: "Matrix demand scenario do minimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen. 2 Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Scen. 2 User Class",
            paramName: "userClassCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: {
              source: "api",
              legendSubtitleText: "unit"
            },
          }, 
        ]
      },
    },
    {
      pageName: "Side By Side",
      url: "/zone-results-dual",
      type: "DualMapLayout",
      category: "Matrix Trip Ends",
      about: `<p>NoHAM travel demand trip ends at an origin or destination. This visualisation 
      shows the total highway travel demand coming from or going to a NoHAM zone for each vehicle
      type and journey purpose as a choropleth. Zones are generalised geographic areas they share
       similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA).</p>`,
      config: {
        layers: [
          {
            uniqueId: "NoHAMZoneResultsDual",
            name: "ZoneResultsDual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Results Side-By-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Results Side-By-Side",
            type: "joinDataToMap",
            joinLayer: "ZoneResultsDual",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/matrix-demand",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Trip Type",
            paramName: "columnName",
            info: "Select whether you want to display the number of origin or destination trips assigned for each zone",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Zone Results Side-By-Side"],
            type: "toggle",
            containsLegendInfo: true,
            values: originOrDestTripValues,
          },
          {
            filterName: "Left Delivery Programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values:{
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
             filterName: "Left User Class",
             paramName: "userClassCode",
             target: "api",
             actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
             visualisations: ["Zone Results Side-By-Side"],
             type: "dropdown",
             values: {
                 source: "api",
             },
          },
          {
            filterName: "Right Delivery Programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
        ]
      }
    },

    // -----------------------------------------------------------
    // Zone Pair results definition
    {
      pageName: "Single Scenario",
      url: "/zonal-pair-results",
      about: `<p>NoHAM travel demand and performance analysis at the origin or destination level with respect to the selected zone. 
      By selecting a zone as the origin or destination, the travel demand and performance are shown to or from that zone in relation
       to other zones. So by seleclting origin and clicking a zone, the demand to all other zones is shown as a choropleth.</p>
      <p>Currently includes: <ul><li>Trips – the highway travel demand at an origin or destination level with respect to the selected zone</li>
      <li>Average time – the travel time at an origin or destination level with respect to the selected zone, selecting an origin zone will show
      the modelled travel time (seconds) to all other zones as destinations, with the travel times shown as a choropleth</li>
      <li>Average distance – the travel distance at an origin or destination level with respect to the select zone, selecting an origin zone
      will show the modelled travel distance (meters) to all other zones as destinations, with the travel times shown as a choropleth</li></ul></p>`,
      type: "MapLayout",
      category: "O/D Analysis",
      config: {
        layers: [
          {
            uniqueId: "NoHAMZonalPairResults",
            name: "ZonalPairResults",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Matrix",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Matrix",
            type: "joinDataToMap",
            joinLayer: "ZonalPairResults",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zonal-pair-results",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "map",
            layer: "ZonalPairResults",
            field: "id",
          },
          {
            filterName: "Zone Type",
            paramName: "originOrDestination",
            info: "Choose if selected zone is an origin or destination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Matrix"],
            type: "dropdown",
            containsLegendInfo: true,
            values: pairMetricValues,
          },
          {
            filterName: "Delivery programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_year",
              paramColumn: "network_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Network scenario",
            paramName: "networkScenarioName",
            info: "Network DM/DS",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Demand scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Time period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
          {
            filterName: "User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: userClassValues
          },
        ],
      },
    },

    // -----------------------------------------------------------
    // Zone Pair difference Definition
    {
      pageName: "Difference",
      url: "/zonal-pair-difference",
      about: `<p>NoHAM travel demand and performance analysis at the origin or destination level with respect to the selected zone. 
      By selecting a zone as the origin or destination, the travel demand and performance are shown to or from that zone in relation
       to other zones. So by seleclting origin and clicking a zone, the demand to all other zones is shown as a choropleth.</p>
      <p>Currently includes: <ul><li>Trips – the highway travel demand at an origin or destination level with respect to the selected zone</li>
      <li>Average time – the travel time at an origin or destination level with respect to the selected zone, selecting an origin zone will show
      the modelled travel time (seconds) to all other zones as destinations, with the travel times shown as a choropleth</li>
      <li>Average distance – the travel distance at an origin or destination level with respect to the select zone, selecting an origin zone
      will show the modelled travel distance (meters) to all other zones as destinations, with the travel times shown as a choropleth</li></ul></p>`,
      type: "MapLayout",
      category: "O/D Analysis",
      config: {
        layers: [
          {
            uniqueId: "NoHAMZonalPairDifference",
            name: "ZonalPairDifference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Matrix Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Matrix Difference",
            type: "joinDataToMap",
            style: "polygon-diverging",
            joinField: "id",
            joinLayer: "ZonalPairDifference",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zonal-pair-results/difference",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "map",
            layer: "ZonalPairDifference",
            field: "id",
          },
          {
            filterName: "Zone Type",
            paramName: "originOrDestination",
            info: "Choose if selected zone is an origin or destination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            containsLegendInfo: true,
            values: pairMetricValues,
          },
          {
            filterName: "Scen.1 Delivery Programme",
            paramName: "deliveryProgrammeNameDoSomething",
            info: "Assignment delivery programme do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.1 Year",
            paramName: "yearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.1 Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            info: "Network DM/DS do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.1 Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            info: "Matrix demand scenario do something",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.1 Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Scen.1 User Class",
            paramName: "userClassDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Scen.2 Delivery Programme",
            paramName: "deliveryProgrammeNameDoMinimum",
            info: "Assignment delivery programme do minimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.2 Year",
            paramName: "yearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.2 Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            info: "Network DM/DS do minimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.2 Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            info: "Matrix demand scenario do minimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Scen.2 Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Scen.2 User Class",
            paramName: "userClassDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Side by Side",
      url: "/zonal-pair-results-dual",
      about: `<p>NoHAM travel demand and performance analysis at the origin or destination level with respect to the selected zone. 
      By selecting a zone as the origin or destination, the travel demand and performance are shown to or from that zone in relation
       to other zones. So by seleclting origin and clicking a zone, the demand to all other zones is shown as a choropleth.</p>
      <p>Currently includes: <ul><li>Trips – the highway travel demand at an origin or destination level with respect to the selected zone</li>
      <li>Average time – the travel time at an origin or destination level with respect to the selected zone, selecting an origin zone will show
      the modelled travel time (seconds) to all other zones as destinations, with the travel times shown as a choropleth</li>
      <li>Average distance – the travel distance at an origin or destination level with respect to the select zone, selecting an origin zone
      will show the modelled travel distance (meters) to all other zones as destinations, with the travel times shown as a choropleth</li></ul></p>`,
      type: "DualMapLayout",
      category: "O/D Analysis",
      config: {
        layers: [
          {
            uniqueId: "NoHAMZonalPairResults",
            name: "ZonalPairResultsDual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Matrix Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Matrix Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "ZonalPairResultsDual",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zonal-pair-results",
          },
        ],
        metadataTables: [normsMetadataTable],
        filters: [
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "map",
            layer: "ZonalPairResultsDual",
            field: "id",
          },
          {
            filterName: "Zone Type",
            paramName: "originOrDestination",
            info: "Choose if selected zone is an origin or destination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            info: "Metric to display",
            target: "api",
            actions: [
              { action: "UPDATE_DUAL_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            containsLegendInfo: true,
            values: pairMetricValues,
          },
          {
            filterName: "Left Delivery Programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values:{
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Network Scenario Name",
            paramName: "networkScenarioName",
            info: "Network DM/DS for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the left map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right Delivery Programme",
            paramName: "deliveryProgrammeName",
            info: "Assignment delivery programme for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "delivery_programme_name",
              paramColumn: "delivery_programme_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_year",
              paramColumn: "demand_year",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Network Scenario Name",
            paramName: "networkScenarioName",
            info: "Network DM/DS for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "network_scenario_name",
              paramColumn: "network_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            info: "Matrix demand scenario for the right map",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "metadataTable",
              metadataTableName: "v_input_scenarios",
              displayColumn: "demand_scenario_name",
              paramColumn: "demand_scenario_name",
              sort: "ascending",
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
        ],
      },
    },
  ],
};