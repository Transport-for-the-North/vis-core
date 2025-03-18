import { bands } from "../bands.js"

// const ntemMetadataTable = {
//     name: "ntem_purpose_list",
//     path: "/api/getgenericdataset?dataset_id=foreign_keys.ntem_purpose_list"
//   };
  
  // const timePeriodValues = {
  //   source: "local",
  //   values: [
  //     {
  //       displayValue: "am",
  //       paramValue: 'am',
  //     },
  //     {
  //       displayValue: "ip",
  //       paramValue: "ip",
  //     },
  //     {
  //       displayValue: "pm",
  //       paramValue: "pm",
  //     },
  //   ],
  // }

  // const ntemPurposeCode = {
  //   source: "local",
  //   values: [
  //     {
  //       displayValue: "1",
  //       paramValue: 1,
  //     },
  //     {
  //       displayValue: "2",
  //       paramValue: 2,
  //     },
  //     {
  //       displayValue: "3",
  //       paramValue: 3,
  //     },
  //   ],
  // }
export const pti = {
    pageName: "Potential to Improve",
    url: "/zone-results",
    category: null,
    type: "MapLayout",
    about: `<p>NoHAM travel demand trip ends at an origin or destination level for an average hour across the time period. This visualisation shows the total highway travel demand coming from or going to a NoHAM zone for each vehicle type and journey purpose as a choropleth. 
    NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA) within Northern England and are more aggregated externally.</p>`,
    config: {
      layers: [
        {
          uniqueId: "TINAZonePTIResults",
          name: "ZoneResults",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/1/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Zone Results",
          isHoverable: true,
          isStylable: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "Zone Results",
          type: "joinDataToMap",
          joinLayer: "ZoneResults",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/tina/zone-pti",
          
        },
      ],
      metadataTables: [{
        name: "ntem_purpose_list",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.ntem_purpose_list"
      }],
  
      filters: [
        {
          filterName: "Time Period",
          paramName: "timePeriodCode",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" }
            
           ],
          visualisations: ["Zone Results"],
          type: "toggle",
          shouldBeValidated: false,
          values: {
            source: "local",
            values: [
              {
                displayColumn: 3,
                paramValue: 3,
              },
              {
                displayValue: "ip",
                paramValue: "ip",
              },
              {
                displayValue: "pm",
                paramValue: "pm",
              },
            ],
          }
        },
        {
          filterName: "NTEM Purpose",
          paramName: "ntemPurposeCode",
          target: "api",
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { action:  "UPDATE_LEGEND_TEXT" }
          ],
          visualisations: ["Zone Results"],
          type: "dropdown",
          shouldBeValidated: false,
          containsLegendInfo: true,
          values: {
            source: "metadataTable",
            metadataTableName: "ntem_purpose_list",
            displayColumn: "name",
            legendSubtitleTextColumn: "id",
            paramColumn: "id",
            sort: "ascending",
          }
        },
      ]
    }
  }