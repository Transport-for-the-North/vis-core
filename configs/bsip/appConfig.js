export const appConfig = {
  title: "Bus Analytics Tool",
  introduction:
    `<p>Buses are the quickest, easiest, and most effective way to deliver far-reaching improvements to our public transport system. They account for the majority of public transport journeys across the North of England.</p>
    <p>A fast, frequent, and integrated bus network is vital to the North’s economic success. Buses also play a key role in reducing social isolation and catalysing social mobility supporting low income, young, old, and disabled passengers to access jobs, education, and services. With the appropriate investment, buses will contribute to achieving the Strategic Transport Plan ambitions:</p>
    <ul>
        <li>Improving economic performance</li>
        <li>Enhancing social inclusion and health</li>
        <li>Rapid decarbonisation of surface transport.</li>
    </ul>
    <p>Access to robust data and evidence to inform decision making has been a key request from all local authorities delivering bus service improvements. Transport for the North’s public transport model integrates bus and light rail demand data into TfN’s wider Analytical Framework.</p>
    <p>This data portal is provided as a tool available free of charge to Transport for the North’s partner organisations, with outputs detailing:</p>
    <ul>
        <li>Scheduled public service bus, tram and light rail services in the North of England</li>
        <li>Public service bus, tram and light rail journey time reliability data, by route.</li>
        <li>Bus accessibility data, segmented by journey type e.g. travel to work, travel to education etc.</li>
    </ul>
    <p>The above combined with geospatial data on population, jobs and demographic indices.</p>`,
  background: "",
  methodology: "",
  legalText:
        '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  contactText: "Please contact Kirsten Keen for any questions on this data tool or on Transport for the North’s work supporting Bus Service Improvements.",
  contactEmail: "kirsten.keen@transportforthenorth.com",
  logoImage: "img/tfn-logo-fullsize.png",
  backgroundImage: "img/bsip/hero.jpg",
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
            visualisationName: "Bus Reliability",
            isHoverable: true,
            isStylable: false,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Bus Reliability",
            type: "geojson",
            style: "polygon-categorical",
            valueField: "category",
            dataSource: "api",
            dataPath: "/api/bsip/reliability",
          },
        ],
        metadataTables: [
        ],
        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            actions: [
              { 
                action: "UPDATE_PARAMETERISED_LAYER", 
                payload: { targetLayer: "Origin Zones" } 
              },
              { action: "UPDATE_QUERY_PARAMS" },
            ],
            visualisations: ["Bus Reliability"],
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
            visualisations: ["Bus Reliability"],
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
            visualisations: ["Bus Reliability"],
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
            visualisations: ["Bus Reliability"],
            type: "slider",
            min: 1200,
            max: 12000,
            interval: 1200,
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
            visualisations: ["Bus Reliability"],
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
            visualisationName: "Bus Accessibility",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Bus Accessibility",
            type: "joinDataToMap",
            joinLayer: "Accessibility",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/bsip/accessibility",
          },
        ],
        metadataTables: [],

        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            actions: [
              { 
                action: "UPDATE_PARAMETERISED_LAYER", 
                payload: { targetLayer: "Accessibility" } 
              },
              { action: "UPDATE_QUERY_PARAMS" },
            ],
            visualisations: ["Bus Accessibility"],
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
            visualisations: ["Bus Accessibility"],
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
            actions: [
              { action: "UPDATE_QUERY_PARAMS" },
              { action: "UPDATE_LEGEND_TEXT" }
            ],
            visualisations: ["Bus Accessibility"],
            type: "dropdown",
            info: "Type of opportunity accessed.",
            containsLegendInfo: true,
            values: {
              source: "local",
              values: [
                {
                  displayValue: "Jobs",
                  paramValue: "jobs",
                  legendSubtitleText: "accessible from zone",
                },
                {
                  displayValue: "Schools",
                  paramValue: "schools",
                  legendSubtitleText: "accessible from zone",
                },
              ],
            },
          },
          {
            filterName: "Cutoff time",
            paramName: "cutoffTimeMinutes",
            target: "api",
            actions: [{ action: "UPDATE_QUERY_PARAMS" }],
            visualisations: ["Bus Accessibility"],
            type: "slider",
            info: "Journey time limit by bus.",
            min: 20,
            max: 200,
            interval: 20,
            displayAs: {
              unit: "mins",
            },
          },
        ],
      },
    },
  ],
};