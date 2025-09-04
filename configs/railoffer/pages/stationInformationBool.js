import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";

export const stationInformationBool = {
  pageName: "Station Information - Boolean",
  url: "/station-information-bool",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the station information for each station in the NorTMS model.</p>
   <p>This data is retrieved from the Stations feed in the Rail Data Marketplace, and includes information that can be visualised as a True/False (1/0), such as if the station contains a ticket office, are tickets able to be purchased on weekdays/weekends, seating areas etc.</p>
   <p>Use the filters to select the metric, TOC, authority, and route name you wish to see on the map. Hover over a node to see more information about the station on the tooltip.</p>`,
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
            name: "Stations Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Information",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: true,
            hoverNulls: true,
            hoverTipShouldIncludeMetadata: false,
            enforceNoClassificationMethod: true,
        },
    ],
    visualisations: [
        {
        name: "Node Information",
        type: "joinDataToMap",
        joinLayer: "Stations Layer",
        style: "circle-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/node-results"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationInformationMetricBoolSelector, visualisations: ['Node Information'] },
        { ...selectors.nodeTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
        { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
        { ...selectors.booleanSelector, visualisations: ['Node Information'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.nodeTOCSelector, multiSelect: true },
                { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.booleanSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
                { ...selectors.routeNameSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/node-results/download'
        },
    },
  },
};