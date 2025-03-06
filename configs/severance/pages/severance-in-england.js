import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { oaEngDetailedCallout } from "../templates";
import { engPopupContent } from "../templates/popup";
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
        minZoom: 9,
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
          url: "/api/trse/callout-data/oa-or-pt-point?featureId={id}&featureType=oa",
          htmlTemplate: engPopupContent
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
    ],
    visualisations: [
      {
        name: "Severance Risk",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/trse/output-area-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "Decile" 
          }
        ]
      },
      {
        name: "OA Callout",
        type: "calloutCard",
        cardName: "Output Area Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/oa-or-pt-point",
        htmlFragment: oaEngDetailedCallout
      },
    ],
    metadataTables: [],
    filters: [
      selectors.oaFeature,
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: glossaryData
      },
    },
  },
};