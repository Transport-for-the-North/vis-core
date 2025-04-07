import { termsOfUse } from "../termsOfUse"
import { combinedAuthorityLayer, combinedAuthorityLayerBase } from "../mapLayers"
import glossaryData from "../glossaryData";

export const reliability = {
    pageName: "Bus Reliability",
    url: "/bus-reliability",
    about:
      `<p>Visualise the overall reliability of bus services within the set journey time by selecting a zone on the map.</p> 
      <p>The <b>scheduled</b> timetable refers to buses which were scheduled according to BODS GTFS timetables. </p> 
      <p>The <b>actual</b> bus journey data refers to buses which actually ran and had their GPS transponder enabled.</p>`,
    type: "MapLayout",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        combinedAuthorityLayer,
        {
          uniqueId: "BsipZoneVectorTile",
          name: "Origin Zones",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Bus Reliability",
          isHoverable: true,
          isStylable: false,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
          shouldHaveOpacityControl: false,
          zoomToFeaturePlaceholderText: "Search by zone number/ID..."
        },
        combinedAuthorityLayerBase
      ],
      visualisations: [
        {
          name: "Bus Reliability",
          type: "geojson",
          style: "polygon-categorical",
          valueField: "category",
          dataSource: "api",
          dataPath: "/api/bsip/reliabilityV2/prod", 
          enforceNoColourSchemeSelector: false, // this is to enforce the colour scheme selector to be hidden
          enforceNoClassificationMethod: true, // this is to enforce the classification method selector to be hidden
        },
      ],
      metadataTables: [
      ],
      filters: [
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
          defaultValue: 3600,
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
      additionalFeatures: {
        glossary: { 
          dataDictionary: glossaryData
        },
        dynamicWarning: {
          url: '/api/bsip/modelled-date/prod',
          template: `This area coverage is for TfN's Area of Interest. Routes are only included if they arrive at their destination between 7am and 10am. Travel times are calculated between the population weighted centroids of each zone. Maximum walk distance to/from bus stops is 10km. For further details, please see the home page.\n\nDate of Modelled data: {data}`
        }
      },
    },
}
