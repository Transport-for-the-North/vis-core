import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const nodeLoadings = {
  pageName: "Station Loadings",
  url: "/railoffer/node-loadings",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the loadings information for each station in the NorTMS model.</p>
  <p><b>TOC Abbreviations:</b></p> 
  <p>NT: Northern</p>
  <p>GR: East Coast</p>
  <p>EM: East Midlands</p>
  <p>VT: West Cost</p>
  <p>ME: Merseyrail</p>
  <p>GM: Greater Manchester</p>
  <p>NR: Network Rail</p>
  <p>AW: Transport for Wales</p>
  <p>TP: Transpennine</p>
  <p>XC: CrossCountry</p>
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
        joinLayer: "Rail Offer Nodes",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/node-loadings"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.loadingsMetricSelector, visualisations: ['Node Loading Totals'] },
        { ...selectors.nodeTOCSelector, visualisations: ['Node Loading Totals'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true},
        { ...selectors.booleanSelector, visualisations: ['Node Loading Totals'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Strategic Rail Station", paramName: "stratRailNorth" },
        { ...selectors.booleanSelector, visualisations: ['Node Loading Totals'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "NPR Station", paramName: "nprNorth" },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Loading Totals'] },
        { ...selectors.railPeriodSelector, visualisations: ['Node Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Loading Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};