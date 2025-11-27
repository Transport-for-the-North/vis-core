import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeHouseholdDeprivation = {
  pageName: "Station Household Deprivation",
  url: "/node-household-deprivation",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows household deprivation indicators for each station in the NorTMS model.</p>
   <p>Household deprivation data shows the number of households that are deprived in different dimensions. The dimensions of deprivation include employment, education, health and disability, and housing. Households can be deprived in multiple dimensions simultaneously.</p>
   <ul>
     <li><strong>Education:</strong> A household is classified as deprived in the education dimension if no one has at least level 2 education and no one aged 16 to 18 years is a full-time student.</li>
     <li><strong>Employment:</strong> A household is classified as deprived in the employment dimension if any member, not a full-time student, is either unemployed or economically inactive due to long-term sickness or disability.</li>
     <li><strong>Health:</strong> A household is classified as deprived in the health dimension if any person in the household has general health that is bad or very bad or is identified as disabled. People who have assessed their day-to-day activities as limited by long-term physical or mental health conditions or illnesses are considered disabled. This definition of a disabled person meets the harmonised standard for measuring disability and is in line with the Equality Act (2010).</li>
     <li><strong>Housing:</strong> A household is classified as deprived in the housing dimension if the household's accommodation is either overcrowded, in a shared dwelling, or has no central heating.</li>
   </ul>
   <p>This data contains 2021 Census data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the household deprivation data for those area(s).</p>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the household deprivation on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
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
            name: "Node Deprivation Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Deprivation Totals",
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
        name: "Node Deprivation Totals",
        type: "joinDataToMap",
        joinLayer: "Node Deprivation Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/deprivation"
        },
        {
            name: "Household Deprivation Callout",
            type: "calloutCard",
            cardName: "Household Deprivation Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/deprivation-callout/point",
            cardTitle: "Household deprivation distribution for {name}",
            charts: [
                {
                    type: 'bar',
                    title: 'Bar chart (max‑scaled). Hover bars for values.',
                    columns: [
                        { key: 'not_deprived', label: 'Not deprived' },
                        { key: 'deprived_one_dimension', label: 'Deprived in 1 dimension' },
                        { key: 'deprived_two_dimensions', label: 'Deprived in 2 dimensions' },
                        { key: 'deprived_three_dimensions', label: 'Deprived in 3 dimensions' },
                        { key: 'deprived_four_dimensions', label: 'Deprived in 4 dimensions' }
                    ],
                    barColor: '#4b3e91',
                    height: 220
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'Deprivation level',
                    columns: [
                        { key: 'not_deprived', label: 'Not deprived' },
                        { key: 'deprived_one_dimension', label: 'Deprived in 1 dimension' },
                        { key: 'deprived_two_dimensions', label: 'Deprived in 2 dimensions' },
                        { key: 'deprived_three_dimensions', label: 'Deprived in 3 dimensions' },
                        { key: 'deprived_four_dimensions', label: 'Deprived in 4 dimensions' }
                    ]
                }
            ],
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationDeprivationMetricSelector, visualisations: ['Node Deprivation Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Deprivation Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false },
        { ...selectors.authoritySelector, visualisations: ['Node Deprivation Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false },
        { ...selectors.booleanSelector, visualisations: ['Node Deprivation Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, forceRequired: false, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Deprivation Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['Household Deprivation Callout'], layer: "Node Deprivation Layer"}
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
            downloadPath: '/api/railoffer/deprivation/download'
        },
    },
  },
};