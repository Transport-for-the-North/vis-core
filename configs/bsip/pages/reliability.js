import { termsOfUse } from "../termsOfUse"

export const reliability = {
    pageName: "Bus Reliability",
    url: "/bus-reliability",
    about:
      "<p>Visualise the overall reliability of bus services within the set journey time by selecting a zone in the map.</p> <p>The <b>base</b> timetable refers to buses which were scheduled. </p> <p>The <b>adjusted</b> timetable refers to buses which actually ran.</p>",
    type: "MapLayout",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
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
          visualisations: ["Bus Reliability"],
          type: "map",
          layer: "Origin Zones",
          field: "id",
        },
      ],
    },
}
