import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const stationInformation = {
  pageName: "Station Information - Values",
  url: "/railoffer/station-information-val",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the station information for each station in the NorTMS model.</p>
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
        joinLayer: "Rail Offer Nodes",
        style: "circle-continuous",
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
        { ...selectors.booleanSelector, visualisations: ['Node Information'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "Strategic Rail Station", paramName: "stratRailNorth" },
        { ...selectors.booleanSelector, visualisations: ['Node Information'], multiSelect: true, shouldInitialSelectAllInMultiSelect: true, filterName: "NPR Station", paramName: "nprNorth" },
        // { ...selectors.routeNameSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Information'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Information'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};