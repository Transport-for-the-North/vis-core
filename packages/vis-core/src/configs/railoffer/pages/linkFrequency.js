import glossaryData from "../glossaryData";
import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkFrequency = {
  pageName: "Link Frequency",
  url: "/link-frequency",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the number of trains per hour for each link in the NorTMS 2018 model for the specified period chosen.</p>
  <p>For each link and selected period, frequency is the mean of the per‑hour train counts across that period (average trains per hour).</p>
  <p>Use the time period filter to select the period you wish to see on the map. Click on a link to see more information about the frequency.</p>`,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Link Frequency Layer",
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
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false,
        },
    ],
    visualisations: [
        {
        name: "Link Frequencies",
        type: "joinDataToMap",
        joinLayer: "Link Frequency Layer",
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
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.timePeriod, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/link-frequency/download'
        },
    },
  },
};