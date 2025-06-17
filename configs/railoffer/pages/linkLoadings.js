import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkLoadings = {
  pageName: "Link Loadings",
  url: "/railoffer/link-loadings",
  type: "MapLayout",
  category: "Link",
  about: `<p></p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "NoRMSNodeVectorTile",
            name: "NoRMS Nodes",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Nodes",
            isHoverable: false,
            isStylable: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelNulls: true,
            labelZoomLevel: 9,
        },
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
            labelZoomLevel: 9,
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
        dataPath: "/api/railoffer/link-results",
        
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.linkLoadingsMetricSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.linkTOCSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.railPeriodSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.dayOfWeekSelector, multiSelect: true, visualisations: ['Link Loading Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {},
    },
  },
};