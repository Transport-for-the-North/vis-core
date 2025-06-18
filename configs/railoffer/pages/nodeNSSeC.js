import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const nodeNSSeC = {
  pageName: "Node NS-SeC",
  url: "/railoffer/node-ns-sec",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the NS-SeC information for each station in the NorTMS model.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Network",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
            sourceLayer: "geometry",
            geometryType: "line",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: false,
            shouldHaveLabel: false
        },
        {
            uniqueId: "RailOfferNodeVectorTile",
            name: "Rail Offer Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node NS-SeC Totals",
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
        name: "Node NS-SeC Totals",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Nodes",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/nssec"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.stationNSSeCMetricSelector, visualisations: ['Node NS-SeC Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node NS-SeC Totals'], multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node NS-SeC Totals'], multiSelect: true, filterName: "Strategic Rail Station", paramName: "stratRailNorth" },
        { ...selectors.booleanSelector, visualisations: ['Node NS-SeC Totals'], multiSelect: true, filterName: "NPR Station", paramName: "nprNorth" },
        // { ...selectors.routeNameSelector, multiSelect: true, visualisations: ['Node NS-SeC Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node NS-SeC Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
    },
  },
};