import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeWorkTravelDistance = {
  pageName: "Station Travel to Work Distance",
  url: "/node-work-travel-distance",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the distance people travel to work from areas near each station in the NorTMS model.</p>
   <p>Travel to work distance data shows how far people travel from their home to their workplace. This includes categories such as working mainly at or from home, less than 2km, 2km to less than 5km, 5km to less than 10km, 10km to less than 20km, 20km to less than 30km, 30km to less than 40km, 40km to less than 60km, and 60km and over.</p>
   <p>This data contains 2021 Census data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the travel to work distance data for those area(s).</p>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the travel to work distance on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
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
            name: "Node Work Travel Distance Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Work Travel Distance Totals",
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
        name: "Node Work Travel Distance Totals",
        type: "joinDataToMap",
        joinLayer: "Node Work Travel Distance Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/work-travel-distance"
        },
        {
            name: "Work Travel Distance Callout",
            type: "calloutCard",
            cardName: "Work Travel Distance Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/work-travel-distance-callout/point",
            cardTitle: "Work travel distance distribution for {name}",
            charts: [
                {
                    type: 'bar',
                    title: 'Bar chart (max‑scaled). Hover bars for values.',
                    columns: [
                        { key: 'work_from_home', label: 'Work from home' },
                        { key: 'no_fixed_place_or_outside_uk', label: 'No fixed place' },
                        { key: 'less_than_2km', label: 'Less than 2km' },
                        { key: 'km_2_to_5', label: '2km to <5km' },
                        { key: 'km_5_to_10', label: '5km to <10km' },
                        { key: 'km_10_to_20', label: '10km to <20km' },
                        { key: 'km_20_to_30', label: '20km to <30km' },
                        { key: 'km_30_to_40', label: '30km to <40km' },
                        { key: 'km_40_to_60', label: '40km to <60km' },
                        { key: 'km_60_plus', label: '60km and over' }
                    ],
                    barColor: '#4b3e91',
                    height: 220
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'Travel distance',
                    columns: [
                        { key: 'work_from_home', label: 'Work from home' },
                        { key: 'no_fixed_place_or_outside_uk', label: 'No fixed place or outside UK' },
                        { key: 'less_than_2km', label: 'Less than 2km' },
                        { key: 'km_2_to_5', label: '2km to <5km' },
                        { key: 'km_5_to_10', label: '5km to <10km' },
                        { key: 'km_10_to_20', label: '10km to <20km' },
                        { key: 'km_20_to_30', label: '20km to <30km' },
                        { key: 'km_30_to_40', label: '30km to <40km' },
                        { key: 'km_40_to_60', label: '40km to <60km' },
                        { key: 'km_60_plus', label: '60km and over' }
                    ]
                }
            ],
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationWorkTravelDistanceMetricSelector, visualisations: ['Node Work Travel Distance Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Work Travel Distance Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.authoritySelector, visualisations: ['Node Work Travel Distance Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node Work Travel Distance Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Work Travel Distance Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['Work Travel Distance Callout'], layer: "Node Work Travel Distance Layer"}
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
            downloadPath: '/api/railoffer/work-travel-distance/download'
        },
    },
  },
};