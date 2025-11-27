import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { freightInvestPopupContent } from "../templates/investmentPopup";
import { freightInvestmentSummary } from "../templates";
import glossaryData from "../glossaryData";
import { invisiblePolygonCustomPaint, parentAuthorityBoundaryCustomPaint } from "../customPaintDefinitions";

export const freightLinkInvestments = {
  pageName: "Freight Link Investments (FRIP)",
  url: "/freight-link-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows all the freight link investment/schemes from the Freight Investment Pipeline (FRIP). Each scheme is colour coded by it's current status.</p>
        <p>Use the filters to select the theme(s) you wish to see on the map. Hover over a link to view it's basic information and/or click on a link to see more information about the investment/scheme.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
  config: {
    layers: [
        {
            name: "Local Authorities",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/29/{z}/{x}/{y}",
            sourceLayer: "zones",
            geometryType: "line",
            customPaint: parentAuthorityBoundaryCustomPaint,
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false
        },
        {
            name: "hide_Local Authorities",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/29/{z}/{x}/{y}",
            sourceLayer: "zones",
            geometryType: "polygon",
            customPaint: invisiblePolygonCustomPaint,
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: true,
            hoverTipShouldIncludeMetadata: false,
        },
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
            showAllDataInTooltipForEachGeom: true,
            customTooltip: {
                url: "/api/railoffer/freight-link-investment-callout/link?featureId={id}&theme={theme}",
                htmlTemplate: freightInvestPopupContent
            },
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
        { ...selectors.linkFreightInvestmentThemeSelector, forceRequired: false, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Freight Investment Results', "Investment Callout"] },
        { ...selectors.idFeatureSelector, visualisations: ['Investment Callout'], layer: "Link Investment Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.linkFreightInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
            ],
            downloadPath: '/api/railoffer/freight-investment-link-results/download'
        },
    },
  },
};