import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";

export const nodeSocio = {
  pageName: "Station Economic Activity Status",
  url: "/railoffer/node-socio",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the economic activity information for each station in the NorTMS model which has been connected to LSOA centroids using a 2.5km buffer.</p>`,
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
            isHoverable: true,
            isStylable: false,
            shouldShowInLegend: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false
        },
        {
            uniqueId: "RailOfferNodeVectorTile",
            name: "Rail Offer Nodes",
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
        joinLayer: "Rail Offer Nodes",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/socio"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationSocioMetricSelector, visualisations: ['Node Socio Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.authoritySelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node Socio Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth" },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Socio Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Socio Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.nodeTOCSelector, multiSelect: true },
                { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.booleanSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth" },
                { ...selectors.routeNameSelector, multiSelect: true },
                { ...selectors.dayOfWeekSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/socio/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};