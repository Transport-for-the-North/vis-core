import glossaryData from "../glossaryData";
import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const timingLinks = {
  pageName: "BPLAN Timing Links",
  url: "/timing-links",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the timing link information for each link in the NorTMS model.</p>
  <p>This data is retrieved from the BPLAN Timing Links feed in the Rail Data Marketplace, and details the time taken to traverse a link.</p>
  <p>The timing links are derived by taking the scheduled running time between two stations. As this is mapped to the network for more than one link between each station, the scheduled running time is calculated based on the proportion of the link distance against the total station-station distance.</p>
  <p>The speed metric is calculated by taking the maximum speed across each link, this is not the average speed across the link.</p>
  <p>Use the filter to select the metric you wish to see on the map. Hover over a link to see more information about the timing link on the tooltip.</p>`,
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
            visualisationName: "Link Timings",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 12,
            labelNulls: true,
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false,
            defaultOpacity: 0.95, // Custom default opacity for this layer
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
            dataDictionary: glossaryData
        },
        download: {
            filters: [],
            downloadPath: '/api/railoffer/timing-link/download'
        },
    },
  },
};