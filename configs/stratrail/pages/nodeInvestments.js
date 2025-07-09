import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const nodeInvestments = {
  pageName: "Node Investments",
  url: "/railoffer/node-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows the investments for various.</p>`,
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
            uniqueId: "RailOfferInvestmentNodeVectorTile",
            name: "Rail Offer Investment Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_investment_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Node Investment Results",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
            labelZoomLevel: 12,
            labelNulls: false,
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false,
        },
    ],
    visualisations: [
        {
        name: "Node Investment Results",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Investment Nodes",
        style: "circle-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/investment-node-results"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.nodeInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Node Investment Results'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};