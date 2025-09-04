import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { investPopupContent } from "../templates/investmentPopup";
import { investmentSummary } from "../templates";

export const linkInvestments = {
  pageName: "Link Investments",
  url: "/link-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows all the link investment/schemes from the Investment Pipeline. Each scheme is colour coded by it's current status.</p>
        <p>Use the filters to select the theme(s) you wish to see on the map. Hover over a link to view it's basic information and/or click on a link to see more information about the investment/scheme.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferInvestmentLinksVectorTile",
            name: "Link Investment Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_investment_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Investment Results",
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
                url: "/api/railoffer/link-investment-callout/link?featureId={id}",
                htmlTemplate: investPopupContent
            }
        },
    ],
    visualisations: [
        {
        name: "Link Investment Results",
        type: "joinDataToMap",
        joinLayer: "Link Investment Layer",
        style: "line-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/investment-link-results",
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
            dataPath: "/api/railoffer/link-investment-callout/link",
            htmlFragment: investmentSummary
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.linkInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Investment Results'] },
        { ...selectors.investmentFeatureSelector, visualisations: ['Investment Callout'], layer: "Link Investment Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.linkInvestmentThemeSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/investment-link-results/download'
        },
    },
  },
};