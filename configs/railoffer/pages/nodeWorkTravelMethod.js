import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeWorkTravelMethod = {
  pageName: "Station work method of travel",
  url: "/node-work-travel-method",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the methods of travel to work for people living near each station in the NorTMS model.</p>
   <p>Method of travel to work data shows the main method of transport used for the longest part of the usual journey to work. This includes categories such as working mainly at or from home, underground/metro/light rail/tram, train, bus/minibus/coach, taxi, motorcycle/scooter/moped, driving a car or van, passenger in a car or van, bicycle, on foot, and other methods of travel to work.</p>
   <p>This data contains 2021 Census data and has been retrieved from NOMIS, and mapped to the NorTMS stations by using a 2.5km buffer around each station to find nearby LSOAs and using the method of travel to work data for those area(s).</p>
   <p>Use the filters to select the metric, TOC, authority and route name you wish to see on the map. Hover over a node to see more information about the method of travel to work on the tooltip or select a station to show graphs/tables on the statistics.</p>`,
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
            name: "Node Work Travel Method Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Work Travel Method Totals",
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
        name: "Node Work Travel Method Totals",
        type: "joinDataToMap",
        joinLayer: "Node Work Travel Method Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/work-travel-method"
        },
        {
            name: "Work Travel Method Callout",
            type: "calloutCard",
            cardName: "Work Travel Method Summary",
            dataSource: "api",
            dataPath: "/api/railoffer/work-travel-method-callout/point",
            cardTitle: "Work travel method distribution for {name}",
            charts: [
                {
                    type: 'bar',
                    title: 'Bar chart (max‑scaled). Hover bars for values.',
                    columns: [
                        { key: 'work_from_home', label: 'Work from home' },
                        { key: 'underground_metro_light_rail_tram', label: 'Metro/Tram' },
                        { key: 'train', label: 'Train' },
                        { key: 'bus_or_coach', label: 'Bus/Coach' },
                        { key: 'taxi', label: 'Taxi' },
                        { key: 'motorcycle_scooter_or_moped', label: 'Motorcycle' },
                        { key: 'driving_car_or_van', label: 'Driving car/van' },
                        { key: 'passenger_car_or_van', label: 'Car passenger' },
                        { key: 'bicycle', label: 'Bicycle' },
                        { key: 'on_foot', label: 'On foot' },
                        { key: 'other', label: 'Other method' }
                    ],
                    barColor: '#4b3e91',
                    height: 220
                },
                {
                    type: 'table',
                    title: 'Table of values and percentages of values.',
                    tableMetricName: 'Travel method',
                    columns: [
                        { key: 'work_from_home', label: 'Work from home' },
                        { key: 'underground_metro_light_rail_tram', label: 'Metro/Tram' },
                        { key: 'train', label: 'Train' },
                        { key: 'bus_or_coach', label: 'Bus/Coach' },
                        { key: 'taxi', label: 'Taxi' },
                        { key: 'motorcycle_scooter_or_moped', label: 'Motorcycle' },
                        { key: 'driving_car_or_van', label: 'Driving car/van' },
                        { key: 'passenger_car_or_van', label: 'Car passenger' },
                        { key: 'bicycle', label: 'Bicycle' },
                        { key: 'on_foot', label: 'On foot' },
                        { key: 'other', label: 'Other method' }
                    ]
                }
            ],
        },
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationWorkTravelMethodMetricSelector, visualisations: ['Node Work Travel Method Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Work Travel Method Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false },
        { ...selectors.authoritySelector, visualisations: ['Node Work Travel Method Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false },
        { ...selectors.booleanSelector, visualisations: ['Node Work Travel Method Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, forceRequired: false, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, forceRequired: false, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Work Travel Method Totals'] },
        { ...selectors.idFeatureSelector, visualisations: ['Work Travel Method Callout'], layer: "Node Work Travel Method Layer"}
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
            downloadPath: '/api/railoffer/work-travel-method/download'
        },
    },
  },
};