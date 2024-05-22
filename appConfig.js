export const appConfig = {
  title: "TAME React Vis Template",
  introduction:
    `<p>HTML, or HyperText Markup Language, is the standard markup language used to create web pages. It provides the structure of a webpage, allowing for the insertion of text, images, and other multimedia elements. HTML is not a programming language; it is a markup language that defines the content of web pages.</p>
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
      about: "<p>Visualise the overall reliability of bus services within the set journey time by selecting a zone in the map.</p> <p>The <b>base</b> timetable refers to buses which were scheduled. </p> <p>The <b>adjusted</b> timetable refers to buses which actually ran.</p>",
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
            isStylable: false
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
            action: "UPDATE_PARAMETERISED_LAYER",
            actions: [ {action: "UPDATE_PARAMETERISED_LAYER", payload: "Origin Zones"}, { action: "UPDATE_QUERY_PARAMS" }],
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            isStylable: true
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
            infoTextTemplate: `{filterName1} accessible within {filterName2}`
          },
        ],
        metadataLayers: [],
        
        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            action: "UPDATE_PARAMETERISED_LAYER",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
        //   {
        //     name: "NoHAM Links",
        //     type: "geojson",
        //     source: "api",
        //     path: "/api/noham/links",
        //     geometryType: "line",
        //     visualisationName: "Links",
        //   },
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
            isStylable: true
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
            action: "UPDATE_QUERY_PARAMS",
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
          }
        ],
      },
    },
  ],
};
