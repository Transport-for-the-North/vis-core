import { termsOfUse } from "../termsOfUse"

export const potential = {
    pageName: "Global PTI",
    url: "/global-pti",
    type: "MapLayout",
    about: "<p>Visualise the overall accessibility by bus to different opportunities within each region.</p> <p>Set a value type to visualise the decile that the PTI for each zone falls within.</p>",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        {
          uniqueId: "nohamZoneVectorTile",
          name: "zonepti",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "zonepti",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "zonepti",
          type: "joinDataToMap",
          joinLayer: "zonepti",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/tina/zone-pti",
        },
      ],
      metadataTables: [{
        name: "ntem_purpose_codes",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.ntem_purpose_list"
      }],

      filters: [
        {
          filterName: "Time Period",
          paramName: "timePeriodCode",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["zonepti"],
          type: "toggle",
          info: "Timetable used to calculate metrics.",
          values: {
            source: "local",
            values: [
              {
                displayValue: "am",                
                paramValue: "am",
              },
              {
                displayValue: "pm",
                paramValue:"pm"
              }
            ],
          },
        },
        {
          filterName: "ntem",
          paramName: "ntemPurposeCode",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { action: "UPDATE_LEGEND_TEXT" }
          ],
          visualisations: ["zonepti"],
          type: "dropdown",
          shouldBeValidated: false,
          info: "Type of opportunity accessed.",
          containsLegendInfo: true,
          values: {
            source: "metadataTable",
            metadataTableName: "ntem_purpose_codes",
            displayColumn: "name",
            legendSubtitleTextColumn: "id",
            paramColumn: "id",
            sort: "ascending",
          },
        },
        {
          filterName: "PTI",
          paramName: "columnName",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["zonepti"],
          type: "fixed",
          info: "Timetable used to calculate metrics.",
          values: {
            source: "local",
            values: [
              {
                displayValue: "pti decile",                
                paramValue: "decile",
              }
            ],
          },
        }
      ],
    },
}