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
      pageName: "Link Results",
      url: "/norms-link",
      type: "MapLayout",
      category: "Links",
      config: {
        layers: [
          {
            uniqueId: "NormsLinksVectorTile",
            name: "NORMS Links Result",
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
            joinLayer: "NORMS Links Result",
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
            },
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
            filterName: "Property",
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
          //You may need to add the columnName filter here for the endpoint, but couldn't figure out what does it refers to
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
            uniqueId: "NormsLinkResultDifference",
            name: "NORMS Link Result Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
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
            joinLayer: "NORMS Link Result Difference",
            style: "line-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/link-results/difference",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Scenario - DS",
            paramName: "ScenarioCodeDoSomething",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
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
            filterName: "Scenario - DM",
            paramName: "ScenarioCodeDoMinimum",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
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
            filterName: "Property",
            paramName: "propertyName",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["LinkResultDifference"],
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
    // -----------------------------------------------------------
    // Zone results definition
    {
      pageName: "Zone Totals",
      url: "/zone-totals",
      type: "MapLayout",
      category: "Zones",
      about: "", //To be added.
      config: {
        layers: [
          {
            uniqueId: "NormsZoneTotals",
            name: "NORMS Zone Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "ZoneTotals",
            isHoverable: false,
            isStylable: true
          },
        ],
        visualisations: [
          {
            name: "ZoneTotals",
            type: "joinDataToMap",
            joinLayer: "NORMS Zone Totals",
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
  ],
};
