import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { ladSummaryCallout, oaLaDetailedCallout } from "../templates";

export const localAuthority = {
  pageName: "Local Authority",
  url: "/local-authority",
  category: null,
  type: "MapLayout",
  about: `
  <p>View TRSE data by Local Authority District.</p>
  <p>Search for a Local Authority in the sidebar to view Output Area-level data. Click on OAs to read deeper insights.</p>`,
  termsOfUse: termsOfUse,
  config: {
    layers: [
      {
        name: "Output Areas",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/28/{z}/{x}/{y}?parentZoneType=29&parentZoneId=", // specify query params empty if to be set
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "TRSE Rank",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
      },
      {
        name: "Local Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/29/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        isHoverable: true,
        isStylable: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: false,
        hoverTipShouldIncludeMetadata: false,
      },
      // {
      //   name: "PT Points",
      //   type: "tile",
      //   source: "api",
      //   path: "/api/vectortiles/public_transport_points/{z}/{x}/{y}",
      //   sourceLayer: "zones",
      //   geometryType: "polygon",
      //   isHoverable: true,
      //   isStylable: true,
      //   shouldHaveTooltipOnHover: true,
      //   shouldHaveLabel: true,
      //   labelZoomLevel: 12,
      //   labelNulls: false,
      //   hoverNulls: false,
      //   hoverTipShouldIncludeMetadata: false,
      // }
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
        cardName: "LA Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/authority",
        htmlFragment: ladSummaryCallout
      },
      {
        name: "Feature Callout",
        type: "calloutCard",
        cardName: "OA Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/oa-or-pt-point",
        htmlFragment: oaLaDetailedCallout
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.parentLAD, visualisations: ['TRSE Rank', 'Detailed Information'] },
      { ...selectors.zoneResolutionLADFixed, visualisations: ['TRSE Rank']},
      { ...selectors.zoneTypeLADFixed, visualisations: ['TRSE Rank', 'Detailed Information']},
      { ...selectors.oaOrPtvariable, visualisations: ['TRSE Rank']},
      { ...selectors.oaOrPtPercentileFilter, visualisations: ['TRSE Rank']},
      selectors.oaFeature,
      selectors.oaFeatureType
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: {}
      },
    },
  },
};