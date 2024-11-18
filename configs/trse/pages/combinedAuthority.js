import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { caSummaryCallout } from "../templates";

export const combinedAuthority = {
  pageName: "Combined Authority",
  url: "/combined-authority",
  category: null,
  type: "MapLayout",
  about: `
  <p>View TRSE data by Combined Authority District.</p>
  <p>Search for a Combined Authority in the sidebar to view Output Area-level data. Click on OAs to read deeper insights.</p>`,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Output Areas",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/28/{z}/{x}/{y}?parentZoneType=16&parentZoneId=", // specify query params empty if to be set
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "TRSE Rank",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: true,
      },
      {
        name: "Combined Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/16/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: true,
      }
    ],
    visualisations: [
      {
        name: "TRSE Rank",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/trse/output-area-data",
        legendText: [
          {
            displayValue: "Value",
            legendSubtitleText: "%" 
          }
        ]
      },
      {
        name: "Detailed Information",
        type: "calloutCard",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/authority",
        htmlFragment: caSummaryCallout
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.parentCombinedAuthority, visualisations: ['TRSE Rank', 'Detailed Information'] },
      { ...selectors.zoneResolutionCAFixed, visualisations: ['TRSE Rank']},
      { ...selectors.zoneTypeCAFixed, visualisations: ['TRSE Rank', 'Detailed Information']},
      { ...selectors.oaOrPtvariable, visualisations: ['TRSE Rank']},
      { ...selectors.oaOrPtPercentileFilter, visualisations: ['TRSE Rank']},
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};