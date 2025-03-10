import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import glossaryData from "../glossaryData";

export const england = {
  pageName: "Severance in England",
  url: "/severance-in-england",
  category: null,
  type: "MapLayout",
  about: `
  <p>View Severance data nationally.</p>
  <p>This map shows the Severance index for Output Areas in England. Click on areas to see more information.</p>`,
  legalText: termsOfUse,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Output Areas",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/28/{z}/{x}/{y}", // specify query params empty if to be set
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Severance Decile",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
        invertedColorScheme: true,
        trseLabel: true,
        outlineOnPolygonSelect: true,
        customTooltip: {
          url: "/api/severance/callout-data/zoneId={id}",
          html: "../templates/severanceCallout.html"
        }
      },
      {
        name: "Local Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/29/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
      },
      /* 
      {
        name: "MRN Links DfT",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/mrn_links_dft/{z}/{x}/{y}",
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
      },
      {
        name: "SRN Links DfT",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/srn_links_dft/{z}/{x}/{y}",
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
      },
    */
    ],
    visualisations: [
      {
        name: "Severance Decile",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-categorical", //"polygon-continuous"
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/severance/decile-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "Decile" 
          }
        ]
      },
      {
        name: "Severence Callout",
        type: "calloutCard",
        cardName: "Output Area Summary",
        dataSource: "api",
        dataPath: "/api/severance/callout-data",
        html: "../templates/popup.html"
      },
    ],
    metadataTables: [{
      name: "severance_destination",
      path: "/api/getgenericdataset?dataset_id=foreign_keys.severance_destination"
    },{
      name: "severance_barrier_type",
      path: "/api/getgenericdataset?dataset_id=foreign_keys.severance_barrier_type"
    }],
    filters: [
      selectors.barrierType,
      selectors.walkSpeed,
      selectors.destinationType
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: glossaryData
      },
    },
  },
};