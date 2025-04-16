import { termsOfUse } from "../termsOfUse"
import { selectors } from "../selectorDefinitions";

export const los = {
    pageName: "Zone LoS",
    url: "/zone-los",
    type: "MapLayout",
    about: "<p>Click on a zone to visualise the Potential to Improve (PTI) of the surrounding zones.</p> <p>The zone you select will be the assumed through zone where an intervention is placed.</p>",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        {
          uniqueId: "nohamZoneVectorTile",
          name: "zonelos",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "zonelos",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "zonelos",
          type: "joinDataToMap",
          joinLayer: "zonelos",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/tina/metrics",
        },
      ],
      metadataTables: [],
      filters: [
        {
          filterName: "Level of Service",
          paramName: "columnName",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { action: "UPDATE_LEGEND_TEXT" }
          ],
          visualisations: ["zonelos"],
          type: "dropdown",
          shouldBeValidated: false,
          info: "LoS",
          containsLegendInfo: true,
          values: {
            source: "local",
            values: [
              {
                displayValue: "HGV",                
                paramValue: "hgv",
              },
              {
                displayValue: "LGV",
                paramValue:"lgv"
              },
              {
                displayValue: "VoC",
                paramValue:"voc"
              },
              {
                displayValue: "Congestion",
                paramValue:"congestion"
              },
              {
                displayValue: "Car",
                paramValue:"car"
              },
              {
                displayValue: "Bus Stop Count",
                paramValue:"bus_stop_count"
              },
              {
                displayValue: "Bus Stop Density",
                paramValue:"bus_stop_density"
              },
              {
                displayValue: "RTPI Count",
                paramValue:"rtpi_count"
              },
              {
                displayValue: "RTPI Density",
                paramValue:"rtpi_density"
              },
              {
                displayValue: "Car Zone Count",
                paramValue:"car_zone_count"
              },
              {
                displayValue: "Bus Zone Count",
                paramValue:"bus_zone_count"
              },
              {
                displayValue: "PT Zone Count",
                paramValue:"pt_zone_count"
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
        
      ],
      additionalFeatures: {
        download: {
          filters: [
            selectors.zoneSelector
          ],
          downloadPath: '/api/tina/metric-download/download'
        },
      },
    },
}