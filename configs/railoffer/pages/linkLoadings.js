import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkLoadings = {
  pageName: "Link Loadings",
  url: "/railoffer/link-loadings",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the loadings information for each link in the NorTMS model.</p>`,
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
            visualisationName: "Link Loading Totals",
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
        name: "Link Loading Totals",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Links Result",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/link-loadings"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.loadingsMetricSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.linkTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Loading Totals'] },
        { ...selectors.railPeriodSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Link Loading Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};