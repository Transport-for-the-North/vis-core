import { combinedAuthorityLayer, combinedAuthorityLayerBase } from "../mapLayers"
import { termsOfUse } from "../termsOfUse"
import glossaryData from "../glossaryData";

export const accessibility = {
    pageName: "Bus Accessibility",
    url: "/bus-accessibility",
    type: "MapLayout",
    about: `<p>Visualise the overall accessibility by bus to different opportunities within each region.</p>
      <p>Set a destination type to visualise the number of each opportunity accessible within the given cutoff time.</p>
      <p>The <b>scheduled</b> bus data refers to buses which were scheduled according to BODS GTFS timetables. </p> 
      <p>The <b>actual journeys</b> bus data refers to buses which actually ran and had their GPS transponder enabled.</p>
      `,
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        combinedAuthorityLayer,
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
        combinedAuthorityLayerBase
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
          dataPath: "/api/bsip/accessibilityV2/prod",
        },
      ],
      metadataTables: [{
        name: "landuse_opportunity_type_list",
        path: "/api/getgenericdataset?dataset_id=foreign_keys.landuse_opportunity_type_list"
      }],

      filters: [
        {
          filterName: "Bus data display",
          info: "Display scheduled timetable data, or actual journey data",
          paramName: "scheduledOrAdjusted",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Accessibility"],
          type: "toggle",
          values: {
            source: "local",
            values: [
              {
                displayValue: "Scheduled",
                paramValue: "scheduled",
              },
              {
                displayValue: "Actual journeys",
                paramValue: "adjusted",
              },
            ],
          },
        },
        {
          filterName: "Destination type",
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
          filterName: "Cut off time",
          paramName: "cutoffTimeMinutes",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Accessibility"],
          type: "slider",
          info: "Journey time limit by bus.",
          min: 20,
          max: 300,
          interval: 20,
          defaultValue: 60,
          displayAs: {
            unit: "mins",
          },
        },
        {
          filterName: "Time period",
          paramName: "timeperiod",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Accessibility"],
          type: "fixed",
          info: "Time period used to calculate metrics.",
          values: {
            source: "local",
            values: [
              {
                displayValue: 'AM',                
                paramValue: 'AM',
              }
            ],
          },
        },
      ],
      additionalFeatures: {
        glossary: { 
          dataDictionary: glossaryData
        },
        dynamicWarning: {
          url: '/api/bsip/modelled-date/prod',
          template: `This area coverage is for TfN's Area of Interest. Routes are only included if they arrive at their destination between 7am and 10am. Travel times are calculated between the population weighted centroids of each zone. Maximum walk distance to/from bus stops is 10km. For further details, please see the home page.\n\nData last modified: {data}`
        }
      },
    },
}
