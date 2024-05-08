import { Visualisation } from "Components/MapLayout/Visualisation";

export const appConfig = {
  title: "TAME React Template",
  introduction:
    "This is a sample React app created using TAME React Components.",
  background: "",
  legalText:
        "<p>Here is a place where you can put your legal information and the licenses for this tool</p><p> The format is the same as the introduction and background on the Home Page</p> ",
  contactText: "Contact us",
  contactEmail: "abrereton-halls@systra.com",
  appPages: [
    {
      pageName: "Reliability",
      url: "/reliability",
      type: "MapLayout",
      config: {
        layers: [
          {
            uniqueId: "BsipZoneVectorTile",
            name: "BSIP Zone Vector Tile",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Reliability",
          },
        ],
        visualisations: [
          {
            name: "Reliability",
            type: "geojson",
            style: "categorical",
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
            layer: "BSIP Zone Vector Tile",
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
            filterName: "Median duration (secs)",
            paramName: "medianDurationSecs",
            target: "api",
            action: "UPDATE_QUERY_PARAMS",
            visualisations: ["Reliability"],
            type: "slider",
            min: 0,
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
            layer: "BSIP Zone",
            field: "zone_id",
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
            name: "NoHAM Links",
            type: "geojson",
            source: "api",
            path: "/api/noham/links",
            geometryType: "line",
            visualisationName: "Links",
          },
          {
            uniqueId: "NormsLinksVectorTile",
            name: "NoRMS Links Vector Tile",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Links",
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
        ],
      },
    },
    {
      pageName: "Bus Accessibility",
      url: "/bus-accessibility",
      type: "MapLayout",
      config: {
        layers: [
          {
            uniqueId: "BsipZoneVectorTile",
            name: "BSIP Zone Vector Tile",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Accessibility",
          },
        ],
        visualisations: [
          {
            name: "Accessibility",
            type: "joinDataToMap",
            joinLayer: "BSIP Zone Vector Tile",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/accessibility",
          },
        ],
        metadataLayers: [],
        filters: [
          {
            filterName: "Region",
            paramName: "zoneTypeId",
            target: "api",
            action: "UPDATE_PARAMETERISED_LAYER",
            layer: "BSIP Zone Vector Tile",
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
            filterName: "Timetable",
            paramName: "timetable_id",
            target: "api",
            action: "UPDATE_QUERY_PARAMS",
            visualisations: ["Accessibility"],
            type: "dropdown",
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
  ],
};
