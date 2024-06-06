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
      pageName: "Bus Reliability",
      url: "/bus-reliability",
      about:
        "<p>Visualise the overall reliability of bus services within the set journey time by selecting a zone in the map.</p> <p>The <b>base</b> timetable refers to buses which were scheduled. </p> <p>The <b>adjusted</b> timetable refers to buses which actually ran.</p>",
      type: "MapLayout",
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
      about:
        "<p>Visualise the overall accessibility by bus to different opportunities within each region.</p> <p>Set a value type to visualise the number of each opportunity accessible within the given cutoff time.</p>",
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
    {
      pageName: "NoHAM Links",
      url: "/noham-links",
      type: "MapLayout",
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
    {
      pageName: "Link Result Difference",
      url: "/link-result-difference",
      type: "MapLayout",
      about: "", //To be added.
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
                  displayValue: "MRN",
                  paramValue: "MRN",
                },
              ],
            },
          },
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Node Result Difference",
      url: "/node-result-difference",
      type: "MapLayout",
      about: "", //To be added.
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
                  displayValue: "VOC Percentage",
                  paramValue: "voc_perc",
                },
                {
                  displayValue: "Delay (seconds)",
                  paramValue: "delay_secs",
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
            visualisations: ["NodeResultDifference"],
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
                  displayValue: "MRN",
                  paramValue: "MRN",
                },
              ],
            },
          },
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Zone Result Difference",
      url: "/zone-result-difference",
      type: "MapLayout",
      about: "", //To be added.
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
                  displayValue: "Origin Trips",
                  paramValue: "origin_trips",
                },
                {
                  displayValue: "Destination Trips",
                  paramValue: "destination_trips",
                },
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
            visualisations: ["ZoneResultDifference"],
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
            visualisations: ["ZoneResultDifference"],
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
            visualisations: ["ZoneResultDifference"],
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
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Node Results",
      url: "/node-results",
      type: "MapLayout",
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
                  displayValue: "VOC Percentage",
                  paramValue: "voc_perc",
                },
                {
                  displayValue: "Delay (seconds)",
                  paramValue: "delay_secs",
                },
              ],
            },
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
          },
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Zone Results",
      url: "/zone-results",
      type: "MapLayout",
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
                  displayValue: "Origin Trips",
                  paramValue: "origin_trips",
                },
                {
                  displayValue: "Destination Trips",
                  paramValue: "destination_trips",
                },
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
        ],
      },
    },

    // -----------------------------------------------------------

    {
      pageName: "Link Results",
      url: "/link-results",
      type: "MapLayout",
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
          },
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
        ],
      },
    },

    // --------------------------------------------------------------------------------------------------

    {
      pageName: "Zonal Pair Difference",
      url: "/zonal-pair-difference",
      about: "",
      type: "MapLayout",
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
            style: "polygon-continuous",
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
            visualisations: ["ZonalPairDifference"],
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

    // --------------------------------------------------------------------------------------------------

    {
      pageName: "Zonal Pair Results",
      url: "/zonal-pair-results",
      about: "",
      type: "MapLayout",
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
            style: "polygon-diverging",
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
