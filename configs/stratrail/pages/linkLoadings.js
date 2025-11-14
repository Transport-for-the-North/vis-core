import glossaryData from "../glossaryData";
import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const linkLoadings = {
  pageName: "Link Loadings",
  url: "/link-loadings",
  type: "MapLayout",
  category: "Link",
  about: `<p>This visualisation shows the loadings information for each link in the NorTMS model.</p>
    <p>This data is retrieved from the Rail Data Marketplace.</p>
    <p>Loadings are calculated by getting total boarding/alighting values for each station-station pair and averaging the totals across the number of rail periods in the dataset. This is because some TOCs give their loadings data as rolling averages already.</p>
    <p>Use the filters to select the metric and day of week you wish to see on the map. Hover over a link to see more information about the loadings on the tooltip.</p>
  `,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
  config: {
    layers: [
        {
            uniqueId: "RailOfferLinksVectorTile",
            name: "Link Loading Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_station_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Link Loading Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnHover: true,
            shouldHaveHoverOnlyOnData: true,
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
        { ...selectors.loadingsTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true, visualisations: ['Link Loading Totals'] },
        { ...selectors.dayOfWeekSelector, visualisations: ['Link Loading Totals'] },
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [
                { ...selectors.loadingsTOCSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
                { ...selectors.dayOfWeekSelector, multiSelect: true, shouldInitialSelectAllInMultiSelect: true },
            ],
            downloadPath: '/api/railoffer/link-loadings/download'
        },
        warning: 'This contains currently only Northern and Transpennine Express loadings data, therefore some adjacent station-station pairs will have no data.' 
    },
  },
};