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
      pageName: "Link",
      url: "/noham-links",
      type: "MapLayout",
      category: "Links",
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
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: linkMetricValues,
          },
          {
            filterName: "Delivery programme",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Network scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Demand scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Time period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "toggle",
            values: timePeriodValues,
          },
        ],
      },
    },
    // -----------------------------------------------------------
    // Node results definition
    {
      pageName: "Link Difference",
      url: "/link-result-difference",
      type: "MapLayout",
      about: "", //To be added.
      category: "Links",
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
            visualisationName: "LinkResultDifference",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "LinkResultDifference",
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
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: linkMetricValues,
          },
          {
            filterName: "First Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: networkScenarioValues
          },
          {
            filterName: "First Network Year",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: yearValues
          },
          {
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "First Delivery Program",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Second Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Second Network Year",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "Second Delivery Program",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
        ]
      },
    },
    {
      pageName: "Link Side-by-Side",
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
            visualisationName: "LinkResultDual",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "LinkResultDual",
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
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: linkMetricValues,
          },
          {
            filterName: "Network Scenario Name - Left",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Network Scenario Name - Right",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: networkScenarioValues
          },
          {
            filterName: "Network Year - Left",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Network Year - Right",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario - Left",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Demand Scenario - Right",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Time Period - Left",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: timePeriodValues,
          },
          {
            filterName: "Time Period - Right",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: timePeriodValues,
          },
          {
            filterName: "Delivery Program - Left",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Delivery Program - Right",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
        ]
      },
    },
    // -----------------------------------------------------------
    //Node results definition
    {
      pageName: "Node Results",
      url: "/node-results",
      type: "MapLayout",
      category: "Nodes",
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
            visualisationName: "NodeResults",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "NodeResults",
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
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: nodeMetricValues,
          },
          {
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "toggle",
            values: timePeriodValues,
          }]
      },
    },

    // -----------------------------------------------------------
    //Node results difference Definition
    {
      pageName: "Node Result Difference",
      url: "/node-result-difference",
      type: "MapLayout",
      about: "", //To be added.
      category: "Nodes",
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
            visualisationName: "NodeResultDifference",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "NodeResultDifference",
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
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: nodeMetricValues
          },       
          {
            filterName: "Network Scenario Name - DS",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: networkScenarioValues
          },
          {
            filterName: "Network Scenario Name - DM",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: networkScenarioValues
          },
          {
            filterName: "Network Year - DS",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: yearValues
          },
          {
            filterName: "Network Year - DM",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: yearValues
          },
          {
            filterName: "Demand Scenario - DS",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: networkScenarioValues
          },
          {
            filterName: "Demand Scenario - DM",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: demandScenarioValues
          },
          {
            filterName: "Demand Year - DS",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: yearValues
          },
          {
            filterName: "Demand Year - DM",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: yearValues
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "toggle",
            values: timePeriodValues
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "toggle",
            values: timePeriodValues
          },
          {
            filterName: "Delivery Program - DS",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: deliveryProgramValues
          },
          {
            filterName: "Delivery Program - DM",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
            type: "dropdown",
            values: deliveryProgramValues
          },
        ],
      },
    },
    {
      pageName: "Node Results Side-by-Side",
      url: "/node-results-dual",
      type: "DualMapLayout",
      category: "Nodes",
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
            visualisationName: "NodeResultsDual",
            isHoverable: false,
            isStylable: true
          },
        ],
        visualisations: [
          {
            name: "NodeResultsDual",
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
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: nodeMetricValues,
          },
          {
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Left Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Right Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
            type: "toggle",
            values: timePeriodValues,
          }
        ]
      },
    },

    // -----------------------------------------------------------
    // Zone results definition
    {
      pageName: "Zone Results",
      url: "/zone-results",
      type: "MapLayout",
      category: "Zones",
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
            visualisationName: "ZoneResults",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "ZoneResults",
            type: "joinDataToMap",
            joinLayer: "ZoneResults",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-results",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: originOrDestTripValues,
          },
          {
            filterName: "Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "toggle",
            values: timePeriodValues,
          },
        ]
      }
    },

    // -----------------------------------------------------------
    //Zone difference Definition
    {
      pageName: "Zone Result Difference",
      url: "/zone-result-difference",
      type: "MapLayout",
      about: "", //To be added.
      category: "Zones",
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
            visualisationName: "ZoneResultDifference",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "ZoneResultDifference",
            type: "joinDataToMap",
            joinLayer: "ZoneResultDifference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-results/difference",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: originOrDestTripValues,
          },
          {
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: timePeriodValues,
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "toggle",
            values: timePeriodValues,
          },
        ]
      },
    },
    {
      pageName: "Zone Results Side-By-Side",
      url: "/zone-results-dual",
      type: "DualMapLayout",
      category: "Zone",
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
            visualisationName: "ZoneResultsDual",
            isHoverable: false,
            isStylable: true
          },
        ],
        visualisations: [
          {
            name: "ZoneResultsDual",
            type: "joinDataToMap",
            joinLayer: "ZoneResultsDual",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-results",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "toggle",
            values: originOrDestTripValues,
          },
          {
            filterName: "Left Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Right Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
            type: "toggle",
            values: timePeriodValues,
          },
        ]
      }
    },

    // -----------------------------------------------------------
    // Zone Pair difference Definition
    {
      pageName: "Matrix Difference",
      url: "/zonal-pair-difference",
      about: "",
      type: "MapLayout",
      category: "Matrix",
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
            visualisationName: "ZonalPairDifference",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "ZonalPairDifference",
            type: "joinDataToMap",
            style: "polygon-diverging",
            joinField: "id",
            joinLayer: "ZonalPairDifference",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-pair-results/difference",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "map",
            layer: "ZonalPairDifference",
            field: "id",
          },
          {
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: pairMetricValues,
          },
          {
            filterName: "First Network Scenario Name",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "First Network Year",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "First Demand Scenario",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "First Demand Year",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "First Delivery Program",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "First User Class",
            paramName: "userClassDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: userClassValues,
          },
          {
            filterName: "Second Network Scenario Name",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Second Network Year",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Demand Scenario",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Second Demand Year",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "toggle",
            values: timePeriodValues,
          },
          {
            filterName: "Second Delivery Program",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Second User Class",
            paramName: "userClasseDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: userClassValues,
          },
        ],
      },
    },

    // -----------------------------------------------------------
    // Zone Paire results definition
    {
      pageName: "Matrix",
      url: "/zonal-pair-results",
      about: "",
      type: "MapLayout",
      category: "Matrix",
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
            visualisationName: "ZonalPairResults",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "ZonalPairResults",
            type: "joinDataToMap",
            joinLayer: "ZonalPairResults",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-pair-results",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "map",
            layer: "ZonalPairResults",
            field: "id",
          },
          {
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: pairMetricValues,
          },
          {
            filterName: "Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
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
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: userClassValues,
          },
        ],
      },
    },
    {
      pageName: "Matrix Side-by-Side",
      url: "/zonal-pair-results-dual",
      about: "",
      type: "DualMapLayout",
      category: "Matrix",
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
            visualisationName: "ZonalPairResultsDual",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "ZonalPairResultsDual",
            type: "joinDataToMap",
            joinLayer: "ZonalPairResultsDual",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/zone-pair-results",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Choose if selected zone is origin/destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "toggle",
            values: originOrDestinationValues,
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: pairMetricValues,
          },
          {
            filterName: "Left Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: timePeriodValues,
          },
          {
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Left User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: userClassValues,
          },
          {
            filterName: "Right Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: networkScenarioValues,
          },
          {
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: yearValues,
          },
          {
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: demandScenarioValues,
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: timePeriodValues,
          },
          {
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: deliveryProgramValues,
          },
          {
            filterName: "Right User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "dropdown",
            values: userClassValues,
          },
          {
            filterName: "Select zone in map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
            type: "map",
            layer: "ZonalPairResultsDual",
            field: "id",
          },
        ],
      },
    },
  ],
};