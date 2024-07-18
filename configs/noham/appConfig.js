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
      displayValue: "Net speed",
      paramValue: "netspd_kph",
      legendSubtitleText: "kph"
    },
    {
      displayValue: "Total time",
      paramValue: "total_time_secs",
      legendSubtitleText: "seconds"
    },
    {
      displayValue: "Car EB vehicles",
      paramValue: "car_eb_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Car commuter vehicles",
      paramValue: "car_comm_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Car other vehicles",
      paramValue: "car_other_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "LGV flow vehicles",
      paramValue: "lgv_flow_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "HGV flow vehicles",
      paramValue: "hgv_flow_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Total flow vehicles",
      paramValue: "total_flow_vehs",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Link VOC",
      paramValue: "link_voc",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Link delay",
      paramValue: "link_delay_secs",
      legendSubtitleText: "seconds"
    },
    {
      displayValue: "Link queues",
      paramValue: "link_queues_secs",
      legendSubtitleText: "seconds"
    },
    {
      displayValue: "Number of lanes",
      paramValue: "number_lanes",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Speed limit",
      paramValue: "speed_limit",
      legendSubtitleText: "mph"
    },
  ],
}

const nodeMetricValues = {
  source: "local",
  values: [
    {
      displayValue: 'VOC',
      paramValue: 'voc_perc',
      legendSubtitleText: "%"
    },
    {
      displayValue: 'Delay',
      paramValue: 'delay_secs',
      legendSubtitleText: "seconds"
    }
  ],
}

const matrixMetricValues = {
  source: "local",
  values: [
    {
      displayValue: "Vehicle Trips",
      paramValue: "trips_veh",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Travel Time",
      paramValue: "travel_time_secs",
      legendSubtitleText: "seconds"
    },
    {
      displayValue: "Distance",
      paramValue: "distance_m",
      legendSubtitleText: "miles"
    },
    {
      displayValue: "Delay",
      paramValue: "delay_mins",
      legendSubtitleText: "minutes"
    },
    {
      displayValue: "Generalised JT",
      paramValue: "generalised_jt_secs",
      legendSubtitleText: "seconds"
    },
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
      displayValue: 'VOC',
      paramValue: 'voc_perc',
      legendSubtitleText: "%"
    },
    {
      displayValue: "Vehicle Trips",
      paramValue: "trips_veh",
      legendSubtitleText: "unit"
    },
    {
      displayValue: "Travel Time",
      paramValue: "travel_time_secs",
      legendSubtitleText: "seconds"
    },
    {
      displayValue: "Distance",
      paramValue: "distance_m",
      legendSubtitleText: "miles"
    },
    {
      displayValue: "Delay",
      paramValue: "delay_mins",
      legendSubtitleText: "minutes"
    },
    {
      displayValue: "Generalised JT",
      paramValue: "generalised_jt_secs",
      legendSubtitleText: "seconds"
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
      pageName: "Single Scenario",
      url: "/noham-links",
      type: "MapLayout",
      category: "Link",
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Metric",
            paramName: "columnName",
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
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Network scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Demand scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Time period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link"],
            type: "toggle",
            values: {
              source: "api",
            },
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
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "First Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "First Network Year",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Delivery Program",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Network Year",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "toggle",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Delivery Program",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Link Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
        ]
      },
    },
    {
      pageName: "Side by Side",
      url: "/link-result-dual",
      type: "DualMapLayout",
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "Network Scenario Name - Left",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Network Scenario Name - Right",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Network Year - Left",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Network Year - Right",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario - Left",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Demand Scenario - Right",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
          {
            filterName: "Delivery Program - Left",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Delivery Program - Right",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Link Side-by-Side"],
            type: "dropdown",
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
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
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
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Results"],
            type: "dropdown",
            values: {
              source: "api",
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
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
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
            filterName: "Network Scenario Name - DS",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Network Scenario Name - DM",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Network Year - DS",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Network Year - DM",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Demand Scenario - DS",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Demand Scenario - DM",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Demand Year - DS",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Demand Year - DM",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Time Period - DS",
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
            filterName: "Time Period - DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "toggle",
            values: {
              source: "api",
            }
          },
          {
            filterName: "Delivery Program - DS",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: deliveryProgramValues
          },
          {
            filterName: "Delivery Program - DM",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Node Result Difference"],
            type: "dropdown",
            values: deliveryProgramValues
          },
        ],
      },
    },
    {
      pageName: "Side by Side",
      url: "/node-results-dual",
      type: "DualMapLayout",
      category: "Node",
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
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
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Left Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
              source: "api",
            },
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Node Results Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
              source: "api",
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
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Results"],
            type: "dropdown",
            values: {
              source: "api",
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
        ]
      }
    },

    // -----------------------------------------------------------
    //Zone difference Definition
    {
      pageName: "Difference",
      url: "/zone-result-difference",
      type: "MapLayout",
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Zone Result Difference"],
            type: "toggle",
            values: {
              source: "api",
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
      about: "", //To be added.
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
            isHoverable: false,
            isStylable: true
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "Left Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Zone Results Side-By-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
        ]
      }
    },

    // -----------------------------------------------------------
    // Zone Pair results definition
    {
      pageName: "Single Scenario",
      url: "/zonal-pair-results",
      about: "",
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
            isStylable: false,
            shouldHaveTooltipOnClick: false,
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
        metadataLayers: [],
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
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix"],
            type: "dropdown",
            values: userClassValues,
          },
        ],
      },
    },

    // -----------------------------------------------------------
    // Zone Pair difference Definition
    {
      pageName: "Difference",
      url: "/zonal-pair-difference",
      about: "",
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
            isStylable: false,
            shouldHaveTooltipOnClick: false,
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
        metadataLayers: [],
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
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "First Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Network Year",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First Time Period",
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
            filterName: "First Delivery Program",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "First User Class",
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
            filterName: "Second Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Network Year",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second Time Period",
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
            filterName: "Second Delivery Program",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Second User Class",
            paramName: "userClassDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Matrix Difference"],
            type: "dropdown",
            values: userClassValues,
          },
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Side by Side",
      url: "/zonal-pair-results-dual",
      about: "",
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
            isStylable: false,
            shouldHaveTooltipOnClick: false,
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
        metadataLayers: [],
        filters: [
          {
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
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
            filterName: "Left Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
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
            filterName: "Right Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
            },
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
            values: {
              source: "api",
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
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["Matrix Side-by-Side"],
            type: "dropdown",
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
        ],
      },
    },
  ],
};