import { termsOfUse } from "../termsOfUse"
import { selectors } from "../selectorDefinitions";


const ntemPurposeCode = {
  source: "local",
  values: [
    {
      displayValue: "1",
      paramValue: 1,
    },
    {
      displayValue: "2",
      paramValue: 2,
    },
    {
      displayValue: "3",
      paramValue: 3,
    },
  ],
}

export const hansen = {
    pageName: "Zone-to-Zone PTI",
    url: "/pti-zone-select",
    type: "MapLayout",
    about: "<p>Click on a zone to visualise the Potential to Improve (PTI) of the surrounding zones.</p> <p>The zone you select will be the assumed through zone where an intervention is placed.</p>",
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
          dataPath: "/api/tina/zone-pti-select",
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
                displayValue: "AM",                
                paramValue: "am",
              },
              {
                displayValue: "PM",
                paramValue:"pm"
              }
            ],
          },
        },
        {
          filterName: "Purpose of Trip (NTEM)",
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
            source: "local",
            values: [
              {
                displayValue: "Commute",                
                paramValue: 1,
              },
              {
                displayValue: "Education",
                paramValue:3
              }
            ],
          },
          // {
          //   source: "metadataTable",
          //   metadataTableName: "ntem_purpose_list",
          //   displayColumn: "name",
          //   legendSubtitleTextColumn: "id",
          //   paramColumn: "id",
          //   sort: "ascending",
          // },
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
                displayValue: "pti",                
                paramValue: "pti",
              }
            ],
          },
        },
        {
          filterName: "Select zone in map",
          paramName: "throughZoneId",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["zonepti"],
          type: "map",
          layer: "zonepti",
          field: "id",
        }
      ],
      additionalFeatures: {
        download: {
          filters: [
            selectors.zoneSelector
          ],
          downloadPath: '/api/tina/metric-download/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Functionality may not work as expected, data may not show after selecting zone."
      },
    },
}