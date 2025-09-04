import glossaryData from "../glossaryData";
import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkLoadings = {
  pageName: "Link Loadings",
  url: "/link-loadings",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the loadings information for each link in the NorTMS model.</p>
    <p>This data is retrieved from the Rail Data Marketplace and currently only contains Northern Loadings data.</p>
    <p>Loadings are calculated by getting boarding/alighting/load on departure/capacity values from station-station pairs for each rail period. This is then mapped to the network, therefore boarding values will only show from the first link between stations, alighters from the last, as they board/alight at a specific station. Intermediate links in this case will be zero, which will most likely be junction links as trains do not stop there.</p>
    <p>Rail Periods are 4 week periods used in the rail industry to manage timetables and operations. There are 13 rail periods in a year, in our filters they are shown as e.g. 2025/P01 which is period 1 of the 2025 rail year.</p>
    <p>Use the filters to select the metric, rail period, and day of week you wish to see on the map. Hover over a link to see more information about the loadings on the tooltip.</p>
  `,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Link Loading Layer",
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
        joinLayer: "Link Loading Layer",
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
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.linkTOCSelector, multiSelect: true },
                { ...selectors.railPeriodSelector, multiSelect: true },
                { ...selectors.dayOfWeekSelector, multiSelect: true },
            ],
            downloadPath: '/api/railoffer/link-loadings/download'
        },
    },
  },
};