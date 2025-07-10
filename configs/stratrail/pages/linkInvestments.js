import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { investPopupContent } from "../templates/investmentPopup";
import { investmentSummary } from "../templates";

export const linkInvestments = {
  pageName: "Link Investments",
  url: "/railoffer/link-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows the current line investments in the investment pipeline.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferInvestmentLinksVectorTile",
            name: "Rail Offer Investment Links Result",
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
        joinLayer: "Rail Offer Investment Links Result",
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
        { ...selectors.investmentFeatureSelector, visualisations: ['Investment Callout'], layer: "Rail Offer Investment Links Result"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.linkInvestmentThemeSelector, multiSelect: true },
            ],
            downloadPath: 'api/railoffer/link-investment-results/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};