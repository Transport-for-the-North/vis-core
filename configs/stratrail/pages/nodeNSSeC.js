import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

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
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the NS-SeC on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
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
            cardTitle: "NS-SeC distribution for {name}",
            // New: declarative charts. You can use one or many. Supported now: bar, pie, table.
            charts: [
                {
                    type: 'bar',
                    title: 'Bar chart (max‑scaled). Hover bars for values.',
                    columns: [
                        { key: 'l1_l2_l3', label: 'L1–L3' },
                        { key: 'l4_l5_l6', label: 'L4–L6' },
                        { key: 'l7', label: 'L7' },
                        { key: 'l8_l9', label: 'L8–L9' },
                        { key: 'l10_l11', label: 'L10–L11' },
                        { key: 'l12', label: 'L12' },
                        { key: 'l13', label: 'L13' },
                        { key: 'l14_1_l14_2', label: 'L14' },
                        { key: 'l15', label: 'L15' }
                    ],
                    barColor: '#4b3e91',
                    height: 220
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'NS-SeC classification',
                    columns: [
                        { key: 'l1_l2_l3', label: 'L1–L3: Higher managerial/professional' },
                        { key: 'l4_l5_l6', label: 'L4–L6: Lower managerial/professional' },
                        { key: 'l7', label: 'L7: Intermediate occupations' },
                        { key: 'l8_l9', label: 'L8–L9: Small employers/own account' },
                        { key: 'l10_l11', label: 'L10–L11: Lower supervisory/technical' },
                        { key: 'l12', label: 'L12: Semi-routine occupations' },
                        { key: 'l13', label: 'L13: Routine occupations' },
                        { key: 'l14_1_l14_2', label: 'L14: Never worked/long-term unemployed' },
                        { key: 'l15', label: 'L15: Full-time students' }
                    ]
                }
            ],
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
                { ...selectors.nodeTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.booleanSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
            ],
            downloadPath: '/api/railoffer/nssec/download'
        },
    },
  },
};