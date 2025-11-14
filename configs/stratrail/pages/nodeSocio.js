import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeSocio = {
  pageName: "Station Economic Activity Status",
  url: "/node-socio",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the economic activity information for each station in the NorTMS model.</p>
   <p>Economic activity status is derived from the NS-SeC (National Statistics Socio-economic Classification) data, which classifies individuals based on their occupation and employment status. The classification includes categories such as employed, unemployed, retired, student, and others.</p>
   <p>This data contains 2021 data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the economic activity data for those area(s).</p>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the economic activity on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
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
            name: "Node Socio Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Socio Totals",
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
        name: "Node Socio Totals",
        type: "joinDataToMap",
        joinLayer: "Node Socio Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/socio"
        },
        {
            name: "Socio Callout",
            type: "calloutCard",
            cardName: "Socio Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/socio-callout/point",
            cardTitle: "Economic activity distribution for {name}",
            charts: [
                {
                    type: 'bar',
                    title: 'Economic activity (bar). Hover bars for values.',
                    barColor: '#4b3e91',
                    height: 220,
                    columns: [
                        { key: 'economically_active_exc_students', label: 'Active (excl. students)' },
                        { key: 'economically_active_inc_student', label: 'Active (incl. students)' },
                        { key: 'economically_inactive', label: 'Economically inactive' }
                    ]
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'Economic activity status',
                    columns: [
                        { key: 'economically_active_exc_students', label: 'Economically active (excl. students)' },
                        { key: 'economically_active_inc_student', label: 'Economically active (incl. students)' },
                        { key: 'economically_inactive', label: 'Economically inactive' }
                    ]
                }
            ]
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationSocioMetricSelector, visualisations: ['Node Socio Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.authoritySelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Socio Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['Socio Callout'], layer: "Node Socio Layer"}
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
            downloadPath: '/api/railoffer/socio/download'
        },
    },
  },
};