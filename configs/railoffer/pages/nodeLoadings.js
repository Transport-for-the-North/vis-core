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
    <p>This data is retrieved from the Rail Data Marketplace and currently only contains Northern Loadings data.</p>
    <p>Loadings are calculated by getting boarding/alighting/load on departure/capacity values from station-station pairs for each rail period. For nodes, we simply calculate the boarders/alighters at each station, this is then mapped to the network..</p>
    <p>Rail Periods are 4 week periods used in the rail industry to manage timetables and operations. There are 13 rail periods in a year, in our filters they are shown as e.g. 2025/P01 which is period 1 of the 2025 rail year.</p>
    <p>Use the filters to select the metric, rail period, and day of week you wish to see on the map. Hover over a node to see more information about the loadings on the tooltip.</p>
  `,
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
            isHoverable: true,
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
        { ...selectors.railPeriodSelector, visualisations: ['Node Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Loading Totals'] },
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
                { ...selectors.routeNameSelector, multiSelect: true },
                { ...selectors.railPeriodSelector, multiSelect: true },
                { ...selectors.dayOfWeekSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/node-loadings/download'
        },
    },
  },
};