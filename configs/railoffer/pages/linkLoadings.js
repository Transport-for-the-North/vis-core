import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkLoadings = {
  pageName: "Link Loadings",
  url: "/railoffer/link-loadings",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the loadings information for each link in the NorTMS model.</p>
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
            name: "Rail Offer Links Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Loading Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: true,
            hoverNulls: false,
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
        { ...selectors.linkLoadingsMetricSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.linkTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Loading Totals'] },
        { ...selectors.railPeriodSelector, visualisations: ['Link Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Link Loading Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.linkTOCSelector, multiSelect: true },
                { ...selectors.railPeriodSelector, multiSelect: true },
                { ...selectors.dayOfWeekSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/link-loadings/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};