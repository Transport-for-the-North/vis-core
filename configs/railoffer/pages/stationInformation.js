import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";
import { stationPopupContent } from "../templates";

export const stationInformation = {
  pageName: "Station Information",
  url: "/station-information",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the station information for each station in the NorTMS model.</p>
   <p>This data is retrieved from the Stations feed in the Rail Data Marketplace, and includes information which can be visualised as a value, such as car parking spaces, bicycle parking spaces etc.</p>
   <p>Use the filters to select the metric, TOC, authority, and route name you wish to see on the map. Hover over a node to see more information about the station on the tooltip.</p>`,
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
            customTooltip: {
                url: "/api/railoffer/station-callout/point?featureId={id}",
                htmlTemplate: stationPopupContent,
                joinToDefaultTooltip: true
            }
        },
    ],
    visualisations: [
        {
        name: "Node Information",
        type: "joinDataToMap",
        joinLayer: "Stations Layer",
        style: "circle",
        dynamicStyling: true,
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/node-results"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationInformationMetricSelector, visualisations: ['Node Information'] },
        { ...selectors.nodeTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
        { ...selectors.authoritySelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
        { ...selectors.booleanSelector, visualisations: ['Node Information'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
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
            downloadPath: '/api/railoffer/node-results/download'
        },
    },
  },
};