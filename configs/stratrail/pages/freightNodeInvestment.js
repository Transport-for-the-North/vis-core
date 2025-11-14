import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { freightInvestPopupContent } from "../templates/investmentPopup";
import { freightInvestmentSummary } from "../templates";
import { crpLinesLayerPaint, invisiblePolygonCustomPaint, parentAuthorityBoundaryCustomPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const freightNodeInvestments = {
  pageName: "Freight Node Investments (FRIP)",
  url: "/freight-node-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows all the freight node investment/schemes from the Freight Investment Pipeline (FRIP). Each scheme is colour coded by it's current status.</p>
        <p>Use the filters to select the intervention type(s) you wish to see on the map. Hover over a node to view it's basic information and/or click on a node to see more information about the investment/scheme.</p>`,
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
            path: "/api/vectortiles/railoffer_freight_investment_nodes/{z}/{x}/{y}", // matches the path in swagger.json
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
                url: "/api/railoffer/freight-node-investment-callout/point?featureId={id}",
                htmlTemplate: freightInvestPopupContent
            },
        },
    ],
    visualisations: [
        {
        name: "Node Freight Investment Results",
        type: "joinDataToMap",
        joinLayer: "Node Investment Layer",
        style: "circle-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/freight-investment-node-results",
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
            dataPath: "/api/railoffer/freight-node-investment-callout/point",
            htmlFragment: freightInvestmentSummary
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.nodeFreightInterventionSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Freight Investment Results'] },
        { ...selectors.idFeatureSelector, visualisations: ['Investment Callout'], layer: "Node Investment Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.nodeFreightInterventionSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
            ],
            downloadPath: '/api/railoffer/freight-investment-node-results/download'
        },
    },
  },
};