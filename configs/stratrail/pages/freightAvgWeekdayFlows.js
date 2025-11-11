import glossaryData from "../glossaryData";
import { termsOfUse } from "../termsOfUse";
import { selectors } from "../selectorDefinitions";
import { combinedAuthorityFreightCustomPaint } from "../customPaintDefinitions";

export const freightAvgWeekdayFlows = {
  pageName: "Freight Weekday Average Flows",
  url: "/freight-weekday-avg-flows",
  type: "MapLayout",
  category: "Freight",
  about: `<p>The visualisation shows the rail freight network flows in average weekday trains for a number of scenarios developed through the Rail Freight Routing Study in 2024.</p>
    <p>Explanation scenarios:</p>
    <ul>
    <li>2022/23 - base year average weekday freight trains (12 months to end September 2023);</li>
    <li>2028/29 - 2028/29 scenario with modelling assumptions of neither favouring or disfavouring rail relative to road;</li>
    <li>2040/41 Scenario 2 - 2040/41 adopting Network Rail Scenario 2 rail freight forecasting assumptions - a TAG-acceptant Scenario which broadly reflects Business-As-Usual;</li>
    <li>2050/51 Scenario 2 - 2050/51 adopting Network Rail Scenario 2 rail freight forecasting assumptions - a TAG-acceptant Scenario which broadly reflects Business-As-Usual; and</li>
    <li>2050/51 Scenario 4 - 2050/51 adopting Network Rail Scenario 4 rail freight forecasting assumptions - a pro-rail scenario where policy and investment choices favour rail over road.</li>
    </ul>
    <p>The TransPennine upgrade and HS2 Phase One are modelled in the 2040/41 and 2050/51 scenarios. Rail freight flows by commodity type are presented where available from the study, with visualisations of both capacity-unconstrained flows and suppressed flows for the relevant forecasting scenarios.</p>
  `,
  termsOfUse: termsOfUse,
  legalText: termsOfUse,
  customMapZoom: 7,
  customMapCentre: [-2.45, 54.00],
  config: {
    layers: [
        {
            name: "Regions",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/30/{z}/{x}/{y}",
            sourceLayer: "zones",
            geometryType: "polygon",
            isHoverable: false,
            isStylable: false,
            customPaint: combinedAuthorityFreightCustomPaint,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: true,
            labelZoomLevel: 10,
            labelNulls: false,
            hoverNulls: false,
            hoverTipShouldIncludeMetadata: false,
            shouldShowInLegend: true,
        },
        {
            uniqueId: "RailOfferFreightHGCVectorTile",
            name: "Link Average Flows Layer",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/railoffer_freight_links/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "line",
            visualisationName: "Freight Network Layer",
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
            name: "Freight Weekday Average Flows",
            type: "joinDataToMap",
            joinLayer: "Link Average Flows Layer",
            style: "line-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/railoffer/freight-weekday-avg-flows"
        }
    ],
    metadataTables: [],
    filters: [
        { ...selectors.freightWeekdayAvgFlowMetricSelector, visualisations: ['Freight Weekday Average Flows'] }
    ],
    additionalFeatures: {
        glossary: { 
            dataDictionary: glossaryData
        },
        download: {
            filters: [],
            downloadPath: '/api/railoffer/freight-weekday-avg-flows/download'
        },
    }
  },
};