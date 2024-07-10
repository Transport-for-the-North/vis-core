
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
      pageName: "Bus Reliability",
      url: "/bus-reliability",
      about:
        "<p>Visualise the overall reliability of bus services within the set journey time by selecting a zone in the map.</p> <p>The <b>base</b> timetable refers to buses which were scheduled. </p> <p>The <b>adjusted</b> timetable refers to buses which actually ran.</p>",
      type: "MapLayout",
      category: null,
      config: {
        layers: [
          {
            uniqueId: "BsipZoneVectorTile",
            name: "Origin Zones",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Reliability",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "Reliability",
            type: "geojson",
            style: "polygon-categorical",
            valueField: "category",
            dataSource: "api",
            dataPath: "/api/bsip/reliability",
          },
        ],
        metadataLayers: [
          {
            name: "reliabilityOptions",
            source: "api",
            path: "/bsip/reliabilityoptions",
          },
        ],
        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            actions: [
              { action: "UPDATE_PARAMETERISED_LAYER", payload: "Origin Zones" },
              { action: "UPDATE_QUERY_PARAMS" },
            ],
            visualisations: ["Reliability"],
            layer: "Origin Zones",
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "North East MSOA",
                  paramValue: 2,
                },
                {
                  displayValue: "North West MSOA",
                  paramValue: 3,
                },
                {
                  displayValue: "Yorkshire and Humber MSOA",
                  paramValue: 4,
                },
              ],
            },
          },
          {
            filterName: "Base timetable",
            paramName: "baseTimetableId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Reliability"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2024-04-09",
                  paramValue: 2,
                },
              ],
            },
          },
          {
            filterName: "Adjusted timetable",
            paramName: "adjustedTimetableId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Reliability"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2024-04-09 Dummy",
                  paramValue: 7,
                },
              ],
            },
          },
          {
            filterName: "Journey time limit",
            paramName: "medianDurationSecs",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Reliability"],
            type: "slider",
            min: 600,
            max: 12000,
            interval: 300,
            displayAs: {
              operation: "divide",
              operand: 60,
              unit: "mins",
            },
          },
          {
            filterName: "Select origin zone in map",
            paramName: "originZoneId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Reliability"],
            type: "map",
            layer: "Origin Zones",
            field: "id",
          },
        ],
      },
    },
    {
      pageName: "Bus Accessibility",
      url: "/bus-accessibility",
      type: "MapLayout",
      about: "<p>Visualise the overall accessibility by bus to different opportunities within each region.</p> <p>Set a value type to visualise the number of each opportunity accessible within the given cutoff time.</p>",
      category: null,
      config: {
        layers: [
          {
            uniqueId: "BsipZoneVectorTile",
            name: "Accessibility",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Accessibility",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "Accessibility",
            type: "joinDataToMap",
            joinLayer: "Accessibility",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/accessibility",
            infoTextTemplate: `{filterName1} accessible within {filterName2}`,
          },
        ],
        metadataLayers: [],

        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            actions: [
              {
                action: "UPDATE_PARAMETERISED_LAYER",
                payload: "Accessibility",
              },
              { action: "UPDATE_QUERY_PARAMS" },
            ],
            visualisations: ["Accessibility"],
            layer: "Accessibility",
            type: "dropdown",
            info: "Select the region for which to view metrics.",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "North East MSOA",
                  paramValue: 2,
                },
                {
                  displayValue: "North West MSOA",
                  paramValue: 3,
                },
                {
                  displayValue: "Yorkshire and Humber MSOA",
                  paramValue: 4,
                },
              ],
            },
          },
          {
            filterName: "Timetable",
            paramName: "timetable_id",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Accessibility"],
            type: "dropdown",
            info: "Timetable used to calculate metrics.",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "2024-04-09",
                  paramValue: 2,
                },
                {
                  displayValue: "2024-04-09 Dummy",
                  paramValue: 7,
                },
              ],
            },
          },
          {
            filterName: "Value type",
            paramName: "valueType",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Accessibility"],
            type: "dropdown",
            info: "Type of opportunity accessed.",
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Jobs",
                  paramValue: "jobs",
                },
                {
                  displayValue: "Schools",
                  paramValue: "schools",
                },
              ],
            },
          },
          {
            filterName: "Cutoff time",
            paramName: "cutoffTimeMinutes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Accessibility"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 15,
            max: 225,
            interval: 15,
            displayAs: {
              unit: "mins",
            },
          },
        ],
      },
    },
    // -----------------------------------------------------------
    // Definition for Link Results
    {
      pageName: "NoHAM Link Results",
      url: "/link-results",
      type: "MapLayout",
      category: "Link",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NoHAMLinkResults",
            name: "LinkResults",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/noham_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "LinkResults",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
          }
        ],
        visualisations: [
          {
            name: "LinkResults",
            type: "joinDataToMap",
            joinLayer: "LinkResults",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/noham/link-results/",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Select Column",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Net Speed (kph)',
                  paramValue: 'netspd_kph'
                },
                {
                  displayValue: 'Total Time (seconds)',
                  paramValue: 'total_time_secs'
                },
                {
                  displayValue: 'car_eb_vehs',
                  paramValue: 'car_eb_vehs'
                },
                {
                  displayValue: 'car_comm_vehs',
                  paramValue: 'car_comm_vehs'
                },
                {
                  displayValue: 'LGV Flows',
                  paramValue: 'lgv_flow_vehs'
                },
                {
                  displayValue: 'HGV Flows',
                  paramValue: 'hgv_flow_vehs'
                },
                {
                  displayValue: 'Total Flows',
                  paramValue: 'total_flow_vehs'
                },
                {
                  displayValue: 'link_voc',
                  paramValue: 'link_voc'
                },
                {
                  displayValue: 'Link Delay (seconds)',
                  paramValue: 'link_delay_secs'
                },
                {
                  displayValue: 'Link Queue (seconds)',
                  paramValue: 'link_queues_secs'
                },
                {
                  displayValue: 'Number of Lanes',
                  paramValue: 'number_lanes'
                },
                {
                  displayValue: 'Speed Limit',
                  paramValue: 'speed_limit'
                },
              ],
            },
          },
          {
            filterName: "Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResults"],
            type: "dropdown",
            values: {
              source: "local",
              values: [
                {
                  displayValue: 'Default',
                  paramValue: ''
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
            visualisations: ["LinkResults"],
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
            visualisations: ["LinkResults"],
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
            visualisations: ["LinkResults"],
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
            visualisations: ["LinkResults"],
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
        ]
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "NoHAM Link Results Difference",
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
                  displayValue: "Speed Limit",
                  paramValue: "speed_limit",
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
            visualisations: ["LinkResultDifference"],
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
    {
      pageName: "NoHAM Link Side-by-Side",
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
            filterName: "Network Scenario Name - Left",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Network Scenario Name - Right",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Network Year - Left",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Network Year - Right",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Demand Scenario - Left",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Demand Scenario - Right",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Time Period - Left",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Time Period - Right",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Delivery Program - Left",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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
            filterName: "Delivery Program - Right",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinkResultDual"],
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


    {
      pageName: "NoHAM Node Result Difference",
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
                {
                  displayValue: 'Delay',
                  paramValue: 'delay_secs'
                },
              ],
            },
          },       
          {
            filterName: "Network Scenario Name - DS",
            paramName: "networkScenarioNameDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
            visualisations: ["NodeResultDifference"],
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
        ],
      },
    },

    // -----------------------------------------------------------
    // Definition for Node Results
    {
      pageName: "NoHAM Zone Result Difference",
      url: "/zone-result-difference",
      type: "MapLayout",
      about: "", //To be added.
      category: "Zone",
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
            visualisations: ["ZoneResultDifference"],
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
        ]
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "NoHAM Matrix Difference",
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

    {
      pageName: "NoHAM Node Results",
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
          }]
      },
    },

    {
      pageName: "NoHAM Node Results Side-by-Side",
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
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Left Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Right Network Scenario",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NodeResultsDual"],
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
          }
        ]
      },
    },

    // -----------------------------------------------------------


    {
      pageName: "NoHAM Zone Results",
      url: "/zone-results",
      type: "MapLayout",
      category: "Zone",
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
        ]
      }
    },

    {
      pageName: "NoHAM Zone Results Side-By-Side",
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
            filterName: "Left Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
            filterName: "Right Demand Year",
            paramName: "demandYear",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneResultsDual"],
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
        ]
      }
    },

    // --------------------------------------------------------------------------------------------------
    // Definition for Zone Pair Results
    {
      pageName: "NoHAM Matrix",
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
    {
      pageName: "NoHAM Matrix Side-by-Side",
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
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Left User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right Network Scenario Name",
            paramName: "networkScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right Year",
            paramName: "year",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right Demand Scenario",
            paramName: "demandScenarioName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right Delivery Program",
            paramName: "deliveryProgrammeName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
            filterName: "Right User Class",
            paramName: "userClass",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonalPairResultsDual"],
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
    {
      pageName: "NoRMS Station Totals",
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
            values: {
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
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Station Totals Difference",
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
            values: {
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
            },
          },
          {
            filterName: "Time Period DS",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Scenario DM",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Time Period DM",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Station Totals Side-by-Side",
      url: "/norms-station-totals-difference-dual",
      type: "DualMapLayout",
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
            name: "NoRMS Station Totals Dual",
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals Dual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals Dual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Totals Dual"],
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
      pageName: "NoRMS Station Pairs",
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
            values: {
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
            }
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPair"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPair"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Direction",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPair"],
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
      pageName: "NoRMS Station Pairs Difference",
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
            values: {
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
            }
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPairDifference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPairDifference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Second Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPairDifference"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPairDifference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["StationPairDifference"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Station Pairs Side-by-Side",
      url: "/norms-station-pair-dual",
      type: "DualMapLayout",
      category: "Station",
      config: {
        layers: [
          {
            uniqueId: "NoRMSStationPairVectorTile",
            name: "NoRMS Station Pair Result Side-by-Side",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "StationPairDual",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "StationPairDual",
            type: "joinDataToMap",
            joinLayer: "NoRMS Station Pair Result Side-by-Side",
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
            filterName: "Direction",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
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
            filterName: "Column Name",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Left User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Right User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Please select a station in the map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["StationPairDual"],
            type: "map",
            layer: "NoRMS Station Pair Result Side-by-Side",
            field: "id",
          }
        ],
      },
    },
    {
      pageName: "NoRMS Station Catchment",
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
            values: {
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
            },
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Direction",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Station Catchment Difference",
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
            values: {
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
            },
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Second Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Direction",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Difference"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Station Catchment Side-by-Side",
      url: "/norms-station-catchment-dual",
      type: "DualMapLayout",
      category: "Station",
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneVectorTile",
            name: "NoRMS Zones Side-by-Side",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "NoRMS Station Catchment Dual",
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
            visualisationName: "NoRMS Station Catchment Dual",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "NoRMS Station Catchment Dual",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Side-by-Side",
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
            filterName: "Direction",
            paramName: "directionId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Select station in map",
            paramName: "nodeId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["NoRMS Station Catchment Dual"],
            type: "map",
            layer: "NoRMS Nodes",
            field: "id"
          },
        ],
      },
    },
    {
      pageName: "NoRMS Link Totals",
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
            values: {
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
            }
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Links"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Link Totals Difference",
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
            values: {
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
            }
          },
          {
            filterName: "Second Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinksResultDifference"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinksResultDifference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinksResultDifference"],
            type: "toggle",
            values: {
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
            },
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
      pageName: "NoRMS Link Totals Side-by-Side",
      url: "/norms-link-result-dual",
      type: "DualMapLayout",
      about: "", //to be added
      category: "Link",
      config: {
        layers: [
          {
            uniqueId: "NoRMSLinksResultDual",
            name: "NoRMS Links Result Dual",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "LinksResultDual",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: true,
          },
        ],
        visualisations: [
          {
            name: "LinksResultDual",
            type: "joinDataToMap",
            joinLayer: "NoRMS Links Result Dual",
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinksResultDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinksResultDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinksResultDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinksResultDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Metric",
            paramName: "propertyName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["LinksResultDual"],
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
      pageName: "NoRMS Zone Totals",
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
            }
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotals"],
            type: "toggle",
            values: {
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
          },
          {
            filterName: "User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotals"],
            type: "dropdown",
            values: {
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
          },
          {
            filterName: "Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotals"],
            type: "dropdown",
            values: {
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
            }
          },
        ]
      }
    },
    {
      pageName: "NoRMS Zone Totals Difference",
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
            }
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "toggle",
            values: {
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
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "toggle",
            values: {
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
          },
          {
            filterName: "First User Class",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "dropdown",
            values: {
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
          },
          {
            filterName: "Second User Class",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "dropdown",
            values: {
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
          },
          {
            filterName: "First Scenario",
            paramName: "scenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Second Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDifference"],
            type: "dropdown",
            values: {
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
            }
          },
        ]
      }
    },
    {
      pageName: "NoRMS Zone Totals Side-by-Side",
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
            visualisationName: "ZoneTotalsDual",
            isHoverable: false,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "ZoneTotalsDual",
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
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
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
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
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
            }
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "toggle",
            values: {
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
          },
          {
            filterName: "Left User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "dropdown",
            values: {
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
          },
          {
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "toggle",
            values: {
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
          },
          {
            filterName: "Right User Class",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "dropdown",
            values: {
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
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZoneTotalsDual"],
            type: "dropdown",
            values: {
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
            }
          },
        ]
      }
    },
    {
      pageName: "NoRMS Zone Pairs",
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
            values: {
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
            }
          },
          {
            filterName: "Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPair"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPair"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Zone as Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPair"],
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
      pageName: "NoRMS Zone Pairs Difference",
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
            values: {
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
            }
          },
          {
            filterName: "First Time Period",
            paramName: "timePeriodCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDifference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "First User",
            paramName: "userClassIdDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDifference"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Second Scenario",
            paramName: "scenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDifference"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Second Time Period",
            paramName: "timePeriodCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDifference"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Second User",
            paramName: "userClassIdDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDifference"],
            type: "dropdown",
            values: {
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
            },
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
    },
    {
      pageName: "NoRMS Zone Pairs Side-by-Side",
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
            visualisationName: "ZonesPairDual",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
          },
        ],
        visualisations: [
          {
            name: "ZonesPairDual",
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
            filterName: "Zone as Origin or Destination",
            paramName: "originOrDestination",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
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
            filterName: "Metric",
            paramName: "columnName",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
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
            filterName: "Left Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Left Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Left User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Right Scenario",
            paramName: "scenarioCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "dropdown",
            values: {
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
            }
          },
          {
            filterName: "Right Time Period",
            paramName: "timePeriodCode",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "toggle",
            values: {
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
            },
          },
          {
            filterName: "Right User",
            paramName: "userClassId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "dropdown",
            values: {
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
            },
          },
          {
            filterName: "Select a zone in the map",
            paramName: "zoneId",
            target: "api",
            actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_DUAL_QUERY_PARAMS" }],
            visualisations: ["ZonesPairDual"],
            type: "map",
            layer: "NoRMS Zones Pair Result",
            field: "id",
          }
        ]
      },
    },
  ],
};
