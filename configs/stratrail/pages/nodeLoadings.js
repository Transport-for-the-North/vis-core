import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { crpLinesLayerPaint } from "../customPaintDefinitions";
import glossaryData from "../glossaryData";

export const nodeLoadings = {
  pageName: "Station Loadings",
  url: "/node-loadings",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the loadings information for each node in the NorTMS model.</p>
    <p>This data is retrieved from the Rail Data Marketplace.</p>
    <p>Loadings are calculated by getting total boarding/alighting values for each station and averaging the totals across the number of rail periods in the dataset. This is because some TOCs give their loadings data as rolling averages already.</p>
    <p>Use the filters to select the TOC, metric, route and day of week you wish to see on the map. Hover over a link to see more information about the loadings on the tooltip.</p>
  `,
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
            labelNulls: false,
            hoverNulls: false,
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
            name: "Node Loadings Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Loadings Totals",
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
        name: "Node Loading Totals",
        type: "joinDataToMap",
        joinLayer: "Node Loadings Layer",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/node-loadings"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.nodeLoadingsMetricSelector, visualisations: ['Node Loading Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Loading Totals'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true},
        { ...selectors.authoritySelector, visualisations: ['Node Loading Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node Loading Totals'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Northern Rail Station", paramName: "stratRailNorth", info: "Use this filter to filter nodes based on if it is labelled as a Northern station by TfN." },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Loading Totals'] },
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
                { ...selectors.dayOfWeekSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
            ],
            downloadPath: '/api/railoffer/node-loadings/download'
        },
    },
  },
};