import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeCarOrVan = {
  pageName: "Station Car or Van Availability",
  url: "/node-car-or-van",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the availability of cars and vans for households near each station in the NorTMS model.</p>
   <p>Car or van availability data shows the number of cars or vans available to households in the area. This includes categories such as no cars or vans available, one car or van available, two cars or vans available, and three or more cars or vans available.</p>
   <p>This data contains 2021 Census data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the car or van availability data for those area(s).</p>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the car or van availability on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
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
            name: "Node Car or Van Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Car or Van Totals",
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
        name: "Node Car or Van Totals",
        type: "joinDataToMap",
        joinLayer: "Node Car or Van Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/car-or-van"
        },
        {
            name: "Car or Van Callout",
            type: "calloutCard",
            cardName: "Car or Van Availability Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/car-or-van-callout/point",
            cardTitle: "Car or van availability distribution for {name}",
            charts: [
                {
                    type: 'bar',
                    title: 'Bar chart (max‑scaled). Hover bars for values.',
                    columns: [
                        { key: 'no_car_or_van', label: 'No cars/vans' },
                        { key: 'one_car_or_van', label: '1 car/van' },
                        { key: 'two_car_or_van', label: '2 cars/vans' },
                        { key: 'three_or_more_car_or_van', label: '3+ cars/vans' }
                    ],
                    barColor: '#4b3e91',
                    height: 220
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'Car/van availability',
                    columns: [
                        { key: 'no_car_or_van', label: 'No cars/vans' },
                        { key: 'one_car_or_van', label: '1 car/van' },
                        { key: 'two_car_or_van', label: '2 cars/vans' },
                        { key: 'three_or_more_car_or_van', label: '3+ cars/vans' }
                    ]
                }
            ],
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationCarOrVanMetricSelector, visualisations: ['Node Car or Van Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Car or Van Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.authoritySelector, visualisations: ['Node Car or Van Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node Car or Van Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Car or Van Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['Car or Van Callout'], layer: "Node Car or Van Layer"}
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
            downloadPath: '/api/railoffer/car-or-van/download'
        },
    },
  },
};