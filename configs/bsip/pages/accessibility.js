import { termsOfUse } from "../termsOfUse"

export const accessibility = {
    pageName: "Bus Accessibility",
    url: "/bus-accessibility",
    type: "MapLayout",
    about: "<p>Visualise the overall accessibility by bus to different opportunities within each region.</p> <p>Set a value type to visualise the number of each opportunity accessible within the given cutoff time.</p>",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        {
          uniqueId: "BsipZoneVectorTile",
          name: "Accessibility",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
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
          dataPath: "/api/bsip/accessibility/prod",
        },
      ],
      metadataTables: [{
        name: "landuse_opportunity_type_list",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.landuse_opportunity_type_list"
      }],

      filters: [
        {
          filterName: "Timetable",
          paramName: "timetableId",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Accessibility"],
          type: "fixed",
          info: "Timetable used to calculate metrics.",
          values: {
            source: "local",
            values: [
              {
                displayValue: 3,                
                paramValue: 3,
              }
            ],
          },
        },
        {
          filterName: "Value type",
          paramName: "oppTypeId",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { action: "UPDATE_LEGEND_TEXT" }
          ],
          visualisations: ["Bus Accessibility"],
          type: "dropdown",
          shouldBeValidated: false,
          info: "Type of opportunity accessed.",
          containsLegendInfo: true,
          values: {
            source: "metadataTable",
            metadataTableName: "landuse_opportunity_type_list",
            displayColumn: "name",
            legendSubtitleTextColumn: "units",
            paramColumn: "id",
            sort: "ascending",
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
          max: 300,
          interval: 20,
          displayAs: {
            unit: "mins",
          },
        },
      ],
    },
}
