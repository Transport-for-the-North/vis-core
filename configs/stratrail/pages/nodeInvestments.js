import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { investPopupContent } from "../templates/investmentPopup";
import { investmentSummary } from "../templates";
import { crpLinesLayerPaint, parentAuthorityBoundaryCustomPaint, invisiblePolygonCustomPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeInvestments = {
  pageName: "Node Investments (SRIP)",
  url: "/node-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows all the node investment/schemes from the Investment Pipeline. Each scheme is colour coded by it's current status.</p>
        <p>Use the filters to select the theme(s) you wish to see on the map. Hover over a node to view it's basic information and/or click on a node to see more information about the investment/scheme.</p>`,
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
        // {
        //     uniqueId: "RailOfferLinksVectorTile",
        //     name: "Network",
        //     type: "tile",
        //     source: "api",
        //     path: "/api/vectortiles/railoffer_links/{z}/{x}/{y}",
        //     sourceLayer: "geometry",
        //     geometryType: "line",
        //     isHoverable: false,
        //     isStylable: false,
        //     shouldHaveTooltipOnHover: false,
        //     shouldHaveLabel: false
        // },
        // {
        //     uniqueId: "RailOfferCRPVectorTile",
        //     name: "CRP Network",
        //     type: "tile",
        //     source: "api",
        //     path: "/api/vectortiles/railoffer_crp_lines/{z}/{x}/{y}",
        //     sourceLayer: "geometry",
        //     geometryType: "line",
        //     customPaint: crpLinesLayerPaint,
        //     isHoverable: false,
        //     isStylable: false,
        //     shouldShowInLegend: true,
        //     shouldHaveTooltipOnHover: true,
        //     shouldHaveLabel: false
        // },
        {
            uniqueId: "RailOfferInvestmentNodeVectorTile",
            name: "Node Investment Layer",
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
        joinLayer: "Node Investment Layer",
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
        { ...selectors.idFeatureSelector, visualisations: ['Investment Callout'], layer: "Node Investment Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.nodeInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
            ],
            downloadPath: '/api/railoffer/investment-node-results/download'
        },
    },
  },
};