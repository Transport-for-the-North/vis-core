import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const nodeNSSeC = {
  pageName: "Station Socio-Economic Classifications (NS-SeC)",
  url: "/railoffer/node-ns-sec",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the NS-SeC (socio-economic classification) information for each station in the NorTMS model which has been connected to LSOA centroids using a 2.5km buffer.</p>
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
            path: "/api/vectortiles/railoffer_links/{z}/{x}/{y}",
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
            path: "/api/vectortiles/railoffer_nodes/{z}/{x}/{y}", // matches the path in swagger.json
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
        { ...selectors.nodeTOCSelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true },
        { ...selectors.booleanSelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "Strategic Rail Station", paramName: "stratRailNorth" },
        { ...selectors.booleanSelector, visualisations: ['Node NS-SeC Totals'], shouldInitialSelectAllInMultiSelect: true, multiSelect: true, filterName: "NPR Station", paramName: "nprNorth" },
        { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node NS-SeC Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node NS-SeC Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};