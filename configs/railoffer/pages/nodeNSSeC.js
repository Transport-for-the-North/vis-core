import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { nssecBarSummary, nssecPieSummary, nssecScatterSummary, nssecTableSummary } from "../templates";

export const nodeNSSeC = {
  pageName: "Station Socio-Economic Classifications (NS-SeC)",
  url: "/node-ns-sec",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the NS-SeC (socio-economic classification) information for each station in the NorTMS model.<p>
   <p>NS-SeC is a classification system used in the UK to categorise individuals based on their occupation and employment status. It is often used in social research and policy analysis to understand the socio-economic characteristics of different populations.</p>
   <p>This data contains 2021 data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the NS-SeC data for those area(s).</p>
   <p>Socio-economic class definitions (retrieved from NOMIS) - all individuals are aged 16 years and over:</p>
   <ul>
     <li>L1, L2 and L3 — Higher managerial, administrative and professional occupations</li>
     <li>L4, L5 and L6 — Lower managerial, administrative and professional occupations</li>
     <li>L7 — Intermediate occupations</li>
     <li>L8 and L9 — Small employers and own account workers</li>
     <li>L10 and L11 — Lower supervisory and technical occupations</li>
     <li>L12 — Semi-routine occupations</li>
     <li>L13 — Routine occupations</li>
     <li>L14.1 and L14.2 — Never worked and long-term unemployed</li>
     <li>L15 — Full-time students</li>
   </ul>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the NS-SeC on the tooltip.</p>`,
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
            uniqueId: "RailOfferCRPVectorTile",
            name: "CRP Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_crp_lines/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            customPaint: crpLinesLayerPaint,
            isHoverable: false,
            isStylable: false,
            shouldShowInLegend: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false
        },
        {
            uniqueId: "RailOfferNodeVectorTile",
            name: "Node NS-SeC Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node NS-SeC Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: true,
            hoverNulls: true,
            hoverTipShouldIncludeMetadata: false,
        },
    ],
    visualisations: [
        {
        name: "Node NS-SeC Totals",
        type: "joinDataToMap",
        joinLayer: "Node NS-SeC Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/nssec"
        },
        {
            name: "NSSeC Callout",
            type: "calloutCard",
            cardName: "NS-SeC Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/nssec-callout/point",
            htmlFragment: nssecBarSummary + nssecTableSummary,
            customFormattingFunctions: {
                commify: (v) => {
                const n = Number(v ?? 0);
                return Number.isFinite(n) ? n.toLocaleString('en-GB') : String(v ?? '');
                },
                percent: (value, data) => {
                const total = (data?.l1_l2_l3 || 0) + (data?.l4_l5_l6 || 0) + (data?.l7 || 0) + 
                            (data?.l8_l9 || 0) + (data?.l10_l11 || 0) + (data?.l12 || 0) + 
                            (data?.l13 || 0) + (data?.l14_1_l14_2 || 0) + (data?.l15 || 0);
                const num = Number(value ?? 0);
                return total > 0 ? ((num / total) * 100).toFixed(1) + '%' : '0.0%';
                }
            }
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationNSSeCMetricSelector, visualisations: ['Node NS-SeC Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.authoritySelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node NS-SeC Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['NSSeC Callout'], layer: "Node NS-SeC Layer"}
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.nodeTOCSelector, multiSelect: true },
                { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.booleanSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
            ],
            downloadPath: '/api/railoffer/nssec/download'
        },
    },
  },
};