import { termsOfUse } from "../termsOfUse"
import { selectors } from "../selectorDefinitions";

export const rail = {
    pageName: "Rail LoS",
    url: "/rail-los",
    type: "MapLayout",
    about: "<p> </p>",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        {
          uniqueId: "RailStationNodes",
          name: "RailStationNodes",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/rail_stations_uk/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "point",
          visualisationName: "railnodes",
          //customPaint: nodeCustomPaint,
          isHoverable: true,
          isStylable: true,
          shouldShowInLegend: false,
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
    },
}