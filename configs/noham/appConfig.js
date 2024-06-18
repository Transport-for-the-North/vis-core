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
  appPages: [
    {
      pageName: "Link",
      url: "/noham-links",
      type: "MapLayout",
      category: "Links",
      config: {
        layers: [
          {
            uniqueId: "NormsLinksVectorTile",
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
            filterName: "Delivery programme",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Default",
                  paramValue: "",
                },
              ],
            },
          },
          {
            filterName: "Network scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
                {
                  displayValue: "Do minimum",
                  paramValue: "dm",
                },
              ],
            },
          },
          {
            filterName: "Demand scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Time period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Net speed (kph)",
                  paramValue: "netspd_kph",
                },
                {
                  displayValue: "Total time (secs)",
                  paramValue: "total_time_secs",
                },
                {
                  displayValue: "Car EB vehicles",
                  paramValue: "car_eb_vehs",
                },
                {
                  displayValue: "Car commuter vehicles",
                  paramValue: "car_comm_vehs",
                },
                {
                  displayValue: "Car other vehicles",
                  paramValue: "car_other_vehs",
                },
                {
                  displayValue: "LGV flow vehicles",
                  paramValue: "lgv_flow_vehs",
                },
                {
                  displayValue: "HGV flow vehicles",
                  paramValue: "hgv_flow_vehs",
                },
                {
                  displayValue: "Total flow vehicles",
                  paramValue: "total_flow_vehs",
                },
                {
                  displayValue: "Link VOC",
                  paramValue: "link_voc",
                },
                {
                  displayValue: "Link delay (secs)",
                  paramValue: "link_delay_secs",
                },
                {
                  displayValue: "Link queues (secs)",
                  paramValue: "link_queues_secs",
                },
                {
                  displayValue: "Number of lanes",
                  paramValue: "number_lanes",
                },
                {
                  displayValue: "Speed flow curve",
                  paramValue: "speed_flow_curve",
                },
                {
                  displayValue: "Speed limit",
                  paramValue: "speed_limit",
                },
                {
                  displayValue: "Carbon emissions (tCO2)",
                  paramValue: "carbon_emissions_tco2",
                },
              ],
            },
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
            shouldHaveTooltipOnClick: false,
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
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Net Speed (kph)",
                  paramValue: "netspd_kph",
                },
                {
                  displayValue: "Total Time (seconds)",
                  paramValue: "total_time_secs",
                },
                {
                  displayValue: "car_eb_vehs",
                  paramValue: "car_eb_vehs",
                },
                {
                  displayValue: "car_comm_vehs",
                  paramValue: "car_comm_vehs",
                },
                {
                  displayValue: "LGV Flows",
                  paramValue: "lgv_flow_vehs",
                },
                {
                  displayValue: "HGV Flows",
                  paramValue: "hgv_flow_vehs",
                },
                {
                  displayValue: "Total Flows",
                  paramValue: "total_flow_vehs",
                },
                {
                  displayValue: "link_voc",
                  paramValue: "link_voc",
                },
                {
                  displayValue: "Link Delay (seconds)",
                  paramValue: "link_delay_secs",
                },
                {
                  displayValue: "Link Queue (seconds)",
                  paramValue: "link_queues_secs",
                },
                {
                  displayValue: "Number of Lanes",
                  paramValue: "number_lanes",
                },
                {
                  displayValue: "speed_flow_curv",
                  paramValue: "speed_flow_curve",
                },
                {
                  displayValue: "Speed Limit",
                  paramValue: "speed_limit",
                },
                {
                  displayValue: "Carbon Emissions",
                  paramValue: "carbon_emissions_tco2",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario Name - DS",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario Name - DM",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "DM",
                  paramValue: "dm",
                },
              ],
            },
          },
          {
            filterName: "Network Year - DS",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2018",
                  paramValue: 2018,
                },
              ],
            },
          },
          {
            filterName: "Network Year - DM",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2033",
                  paramValue: 2033,
                },
              ],
            },
          },
          {
            filterName: "Demand Scenario - DS",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
              ],
            },
          },
          {
            filterName: "Demand Scenario - DM",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Core",
                  paramValue: "core",
                },
              ],
            },
          },
          {
            filterName: "Demand Year - DS",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2018",
                  paramValue: 2018,
                },
              ],
            },
          },
          {
            filterName: "Demand Year - DM",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2033",
                  paramValue: 2033,
                },
              ],
            },
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Delivery Program - DS",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Default",
                  paramValue: "",
                },
              ],
            },
          },
          {
            filterName: "Delivery Program - DM",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'MRN',
                  paramValue: 'MRN'
                }
              ],
            },
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
            isStylable: true
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
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'VOC Percentage',
                  paramValue: 'voc_perc'
                },
                {
                  displayValue: 'Delay (seconds)',
                  paramValue: 'delay_secs'
                }
              ],
            }
          },
          {
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Default", //Not sure if value is empty string or null.
                  paramValue: "",
                },
                {
                  displayValue: "MRN",
                  paramValue: "MRN",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
                {
                  displayValue: "Do Minimum",
                  paramValue: "dm",
                },
              ],
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
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
            isStylable: true
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
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'VOC Percentage',
                  paramValue: 'voc_perc'
                },
              ],
            },
          },
        ],
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
            isStylable: true
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
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Origin Trips',
                  paramValue: 'origin_trips'
                },
                {
                  displayValue: 'Destination Trips',
                  paramValue: 'destination_trips'
                }
              ],
            },
          },
          {
            filterName: "Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
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
            isStylable: true
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
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Origin Trips',
                  paramValue: 'origin_trips'
                },
                {
                  displayValue: 'Destination Trips',
                  paramValue: 'destination_trips'
                }
              ],
            },
          },
          {
            filterName: "Demand Scenario - DS",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Base',
                  paramValue: 'base'
                }
              ],
            },
          },
          {
            filterName: "Demand Scenario - DM",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Core',
                  paramValue: 'core'
                }
              ],
            },
          },
          {
            filterName: "Demand Year - DS",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: '2018',
                  paramValue: 2018
                }
              ],
            },
          },
          {
            filterName: "Demand Year - DM",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: '2033',
                  paramValue: 2033
                }
              ],
            },
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneResultDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
        ]
      },
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
            values: {
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
            },
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Vehicle Trips",
                  paramValue: "trips_veh",
                },
                {
                  displayValue: "Travel Time (seconds)",
                  paramValue: "travel_time_secs",
                },
                {
                  displayValue: "Distance (miles)",
                  paramValue: "distance_m",
                },
                {
                  displayValue: "Delay (minutes)",
                  paramValue: "delay_mins",
                },
                {
                  displayValue: "Generalised JT (seconds)",
                  paramValue: "generalised_jt_secs",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario Name - DS",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario Name - DM",
            paramName: "networkScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "DM",
                  paramValue: "dm",
                },
              ],
            },
          },
          {
            filterName: "Network Year - DS",
            paramName: "networkYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2018",
                  paramValue: 2018,
                },
              ],
            },
          },
          {
            filterName: "Network Year - DM",
            paramName: "networkYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2033",
                  paramValue: 2033,
                },
              ],
            },
          },
          {
            filterName: "Demand Scenario - DS",
            paramName: "demandScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
              ],
            },
          },
          {
            filterName: "Demand Scenario - DM",
            paramName: "demandScenarioNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Core",
                  paramValue: "core",
                },
              ],
            },
          },
          {
            filterName: "Demand Year - DS",
            paramName: "demandYearDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2018",
                  paramValue: 2018,
                },
              ],
            },
          },
          {
            filterName: "Demand Year - DM",
            paramName: "demandYearDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2033",
                  paramValue: 2033,
                },
              ],
            },
          },
          {
            filterName: "Time Period - DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "toggle",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Time Period - DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "toggle",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Delivery Program - DS",
            paramName: "deliveryProgrammeNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Default",
                  paramValue: "",
                },
              ],
            },
          },
          {
            filterName: "Delivery Program - DM",
            paramName: "deliveryProgrammeNameDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "MRN",
                  paramValue: "MRN",
                },
              ],
            },
          },
          {
            filterName: "User Class - DM",
            paramName: "userClasseDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "User Class - DS",
            paramName: "userClassDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairDifference"],
            type: "dropdown",
            values: {
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
            },
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
            values: {
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
            },
          },
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Vehicle Trips",
                  paramValue: "trips_veh",
                },
                {
                  displayValue: "Travel Time (seconds)",
                  paramValue: "travel_time_secs",
                },
                {
                  displayValue: "Distance (miles)",
                  paramValue: "distance_m",
                },
                {
                  displayValue: "Delay (minutes)",
                  paramValue: "delay_mins",
                },
                {
                  displayValue: "Generalised JT (seconds)",
                  paramValue: "generalised_jt_secs",
                },
              ],
            },
          },
          {
            filterName: "Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Base",
                  paramValue: "base",
                },
                {
                  displayValue: "DM",
                  paramValue: "dm",
                },
              ],
            },
          },
          {
            filterName: "Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "AM",
                  paramValue: "am",
                },
                {
                  displayValue: "Inter-Peak",
                  paramValue: "ip",
                },
                {
                  displayValue: "PM",
                  paramValue: "pm",
                },
              ],
            },
          },
          {
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResults"],
            type: "dropdown",
            values: {
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
            },
          },
        ],
      },
    },
  ],
};