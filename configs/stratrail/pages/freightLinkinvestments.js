import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { freightInvestPopupContent } from "../templates/investmentPopup";
import { freightInvestmentSummary } from "../templates";
import glossaryData from "../glossaryData";

export const freightLinkInvestments = {
  pageName: "Freight Link Investments (SRIP)",
  url: "/freight-link-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows all the freight link investment/schemes from the Freight Investment Pipeline (SRIP). Each scheme is colour coded by it's current status.</p>
        <p>Use the filters to select the intervention type(s) you wish to see on the map. Hover over a link to view it's basic information and/or click on a link to see more information about the investment/scheme.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferInvestmentLinksVectorTile",
            name: "Link Investment Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_investment_links/{z}/{x}/{y}", // matches the path in swagger.json
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
                url: "/api/railoffer/freight-link-investment-callout/link?featureId={id}",
                htmlTemplate: freightInvestPopupContent
            }
        },
    ],
    visualisations: [
        {
        name: "Link Freight Investment Results",
        type: "joinDataToMap",
        joinLayer: "Link Investment Layer",
        style: "line-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/freight-investment-link-results",
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
            dataPath: "/api/railoffer/freight-link-investment-callout/link",
            htmlFragment: freightInvestmentSummary
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.linkFreightInterventionSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Freight Investment Results'] },
        { ...selectors.investmentFeatureSelector, visualisations: ['Investment Callout'], layer: "Link Investment Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.linkFreightInterventionSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/freight-investment-link-results/download'
        },
    },
  },
};