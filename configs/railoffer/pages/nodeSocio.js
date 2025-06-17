import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const nodeSocio = {
  pageName: "Node Socio",
  url: "/railoffer/node-socio",
  type: "MapLayout",
  category: "Station",
  about: `<p>This visualisation shows the Socio information for each station in the NorTMS model.</p>`,
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
        { ...selectors.nodeTOCSelector, visualisations: ['Node Socio Totals'] },
        { ...selectors.booleanSelector, visualisations: ['Node Socio Totals'], filterName: "Strategic Rail Station", paramName: "stratRailNorth" },
        { ...selectors.booleanSelector, visualisations: ['Node Socio Totals'], filterName: "NPR Station", paramName: "nprNorth" },
        { ...selectors.routeNameSelector, multiSelect: true, visualisations: ['Node Socio Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Node Socio Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
    },
  },
};