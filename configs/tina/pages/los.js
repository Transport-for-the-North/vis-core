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
        {
          uniqueId: "RailStationNodes",
          name: "RailStationNodes",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/rail_stations_uk/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "point",
          //customPaint: nodeCustomPaint,
          isHoverable: true,
          isStylable: true,
          shouldShowInLegend: true,
          shouldHaveTooltipOnHover: true,
          hoverTipShouldIncludeMetadata: true,
          shouldHaveLabel: true,
          labelZoomLevel: 12,
          labelNulls: true,
          hoverNulls: true,
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
          dataPath: "/api/tina/metrics",
        },
        {
          name: "railnodes",
          type: "joinDataToMap",
          joinLayer: "RailStationNodes",
          style: "circle-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/tina/railstations",
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
          visualisations: ["zonepti"],
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
                displayValue: "Car",
                paramValue:"car"
              },
              {
                displayValue: "Bus Stop Count",
                paramValue:"bus_stop_count"
              },
              {
                displayValue: "Bus Stop Density per km\u00b2",
                paramValue:"bus_stop_density"
              },
              {
                displayValue: "Bus Stop Density Category",
                paramValue:"bus_stop_density_category"
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
              },
              {
                displayValue: "TRSE Zone Cat",
                paramValue:"zone_trse_cat"
              },
              {
                displayValue: "Population",
                paramValue:"zone_population"
              },
              {
                displayValue: "Households",
                paramValue:"zone_households"
              },
              {
                displayValue: "% High Risk of TRSE",
                paramValue:"pct_high_risk"
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
        filterName: "Rail Station Metric",
          paramName: "columnName",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { action: "UPDATE_LEGEND_TEXT" }
          ],
          visualisations: ["railnodes"],
          type: "dropdown",
          shouldBeValidated: false,
          info: "Rail",
          containsLegendInfo: true,
          values: {
            source: "local",
            values: [
              {
                displayValue: "Stops",                
                paramValue: "stops",
              },
              {
                displayValue: "Stops Recorded",                
                paramValue: "stops_recorded",
              },
              {
                displayValue: "Stops Recorded %",                
                paramValue: "stops_recorded_pct",
              },
              {
                displayValue: "Punctual_3mins %",                
                paramValue: "punctual_3mins_pct",
              },
              {
                displayValue: "Cancelled %",                
                paramValue: "cancelled_pct",
              },
              {
                displayValue: "Accessibility LoS",                
                paramValue: "accessibility_los",
              }
            ]
          }
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