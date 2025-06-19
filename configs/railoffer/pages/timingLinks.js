import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const timingLinks = {
  pageName: "BPLAN Timing Links",
  url: "/railoffer/timing-links",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the BPLAN timing link information for each link in the NorTMS model.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Rail Offer Links Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Timings",
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
        name: "Link Timings",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Links Result",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/timing-link"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.timingLinkMetricSelector, visualisations: ['Link Timings'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};