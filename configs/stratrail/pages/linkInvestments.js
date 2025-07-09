import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkInvestments = {
  pageName: "Link Investments",
  url: "/railoffer/link-investments",
  type: "MapLayout",
  category: "Investments",
  about: `<p>This visualisation shows the loadings information for each link in the NorTMS model.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferInvestmentLinksVectorTile",
            name: "Rail Offer Investment Links Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_investment_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Investment Results",
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
        name: "Link Investment Results",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Investment Links Result",
        style: "line-categorical",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/investment-link-results"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.linkInvestmentThemeSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Investment Results'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};