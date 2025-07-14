import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { investPopupContent } from "../templates/investmentPopup";
import { investmentSummary } from "../templates";

export const nodeInvestments = {
  pageName: "Node Investments",
  url: "/railoffer/node-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows the current node investments in the Investment Pipeline.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false
        },
        {
            uniqueId: "RailOfferInvestmentNodeVectorTile",
            name: "Rail Offer Investment Nodes Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_investment_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Investment Results",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false,
            enforceNoClassificationMethod: true,
            customTooltip: {
                url: "/api/railoffer/node-investment-callout/point?featureId={id}",
                htmlTemplate: investPopupContent
            }
        },
    ],
    visualisations: [
        {
        name: "Node Investment Results",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Investment Nodes Result",
        style: "circle-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/investment-node-results",
        legendText: [
          {
            displayValue: "Investment Status",
            legendSubtitleText: ""
          }
        ]
        },
        {
            name: "Investment Callout",
            type: "calloutCard",
            cardName: "Investment Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/node-investment-callout/point",
            htmlFragment: investmentSummary
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.nodeInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Investment Results'] },
        { ...selectors.investmentFeatureSelector, visualisations: ['Investment Callout'], layer: "Rail Offer Investment Nodes Result"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.nodeInvestmentThemeSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/investment-node-results/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};