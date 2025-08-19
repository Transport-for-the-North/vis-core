import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkFrequency = {
  pageName: "Link Frequency",
  url: "/railoffer/link-frequency",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the trains per hour for each period for each link in the NorTMS 2018 model.</p>`,
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
            visualisationName: "Link Frequencies",
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
        name: "Link Frequencies",
        type: "joinDataToMap",
        joinLayer: "Rail Offer Links Result",
        style: "line-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/railoffer/link-frequency",
        legendText: [
          {
            displayValue: "Frequency",
            legendSubtitleText: "Trains per hour"
          }
        ]
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.timePeriod, visualisations: ['Link Frequencies'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: {}
        },
        download: {
            filters: [
                { ...selectors.timePeriod, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/link-frequency/download'
        },
        warning: "NOTE: This is a proof of concept in it's current state. Data might not be complete and some dropdown selections might break while we work on functionality.",
    },
  },
};