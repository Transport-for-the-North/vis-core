import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { caSummaryCallout, oaCaDetailedCallout } from "../templates";
import { parentAuthorityBoundaryCustomPaint } from "../customPaintDefinitions"
import { caPopupContent, caPtPopupContent } from "../templates/popup";
import glossaryData from "../glossaryData";

export const combinedAuthority = {
  pageName: "Combined Authority",
  url: "/combined-authority",
  category: null,
  type: "MapLayout",
  about: `
  <p>View TRSE data by Combined Authority.</p>
  <p>This map compares the risk of TRSE in each neighbourhood to the average for the relevant combined authority area. Search for a combined authority in the side bar to view output-area data. Click on areas to see more information.</p>`,
  legalText: termsOfUse,
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
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
        invertedColorScheme: true,
        trseLabel: true,
        outlineOnPolygonSelect: true,
        customTooltip: {
          url: "/api/trse/callout-data/oa-or-pt-point?featureId={id}&featureType=oa",
          htmlTemplate: caPopupContent
        }
      },
      
      {
        name: "hide_Combined Authorities2",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/16/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        isHoverable: true,
        isStylable: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
      },
      {
        name: "Combined Authorities",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/16/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "line",
        customPaint: parentAuthorityBoundaryCustomPaint,
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
        name: "PT Points",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/public_transport_points/{z}/{x}/{y}?parentZoneType=16&parentZoneId=",
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "PT Points Visualisation",
        minZoom: 11,
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 14,
        labelNulls: false,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: true,
        invertedColorScheme: true,
        trseLabel: true,
        customTooltip: {
          url: "/api/trse/callout-data/oa-or-pt-point?featureId={id}&featureType=pt",
          htmlTemplate: caPtPopupContent
        }
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
            displayValue: "Output Areas",
            legendSubtitleText: "%" 
          }
        ]
      },
      {
        name: "PT Points Visualisation",
        type: "joinDataToMap",
        joinLayer: "PT Points",
        style: "point-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/trse/pt-point-data",
        legendText: [
          {
            displayValue: "Public Transport Stops",
            legendSubtitleText: "%"
          }
        ]
      },
      {
        name: "OA Callout",
        type: "calloutCard",
        cardName: "Output Area Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/oa-or-pt-point",
        htmlFragment: oaCaDetailedCallout
      },
      {
        name: "PT Callout",
        type: "calloutCard",
        cardName: "Public Transport Points Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/oa-or-pt-point",
        htmlFragment: oaCaDetailedCallout
      },
      {
        name: "Detailed Information",
        type: "calloutCard",
        cardName: "Combined Authority Summary",
        dataSource: "api",
        dataPath: "/api/trse/callout-data/authority",
        htmlFragment: caSummaryCallout
      },
    ],
    metadataTables: [],
    filters: [
      { ...selectors.parentCombinedAuthority, visualisations: ['TRSE Rank', 'PT Points Visualisation', 'Detailed Information'] },
      { ...selectors.zoneResolutionCAFixed, visualisations: ['TRSE Rank', 'PT Points Visualisation']},
      { ...selectors.zoneTypeCAFixed, visualisations: ['TRSE Rank', 'PT Points Visualisation', 'Detailed Information']},
      { ...selectors.oaOrPtvariable, visualisations: ['TRSE Rank', 'PT Points Visualisation']},
      { ...selectors.oaOrPtPercentileFilter, visualisations: ['TRSE Rank', 'PT Points Visualisation']},
      { ...selectors.oaOrPtEngHighRiskFilter, visualisations: ['TRSE Rank', 'PT Points Visualisation']},
      selectors.oaFeature,
      selectors.oaFeatureType,
      selectors.ptFeature,
      selectors.ptFeatureType,
    ],
    additionalFeatures: {
      glossary: { 
        dataDictionary: glossaryData
      },
      download: {
        filters: [
          { ...selectors.downloadParentCombinedAuthority, type: 'mapFeatureSelect' },
          { ...selectors.zoneTypeCAFixed, paramName: 'parentZoneTypeId' },
          selectors.zoneResolutionCAFixed,
          selectors.zoneSelector,
          selectors.includePtPointsCheckbox
        ],
        downloadPath: '/api/trse/output-area-data/download'
      },
    },
  },
};