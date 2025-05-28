import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationTotals = {
    pageName: "Station Totals",
    url: "/norms-station-totals",
    type: "MapLayout",
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    about: `
    <p>Visualise the number of passengers using the station by selecting a scenario, adjusting the Time Period and choosing the Metric. </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    `,
    category: "Station",
    subCategory: "Station Totals",
    config: {
    layers: [
        {
        uniqueId: "NoRMSLinksVectorTile",
        name: "Network",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_links/{z}/{x}/{y}",
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: false
        },
        {
        uniqueId: "NoRMSNodeVectorTile",
        name: "NoRMS Nodes",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Totals",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 9,
        labelNulls: true,
        hoverNulls: true
        },
    ],
    visualisations: [
        {
        name: "Station Totals",
        type: "joinDataToMap",
        joinLayer: "NoRMS Nodes",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/node-results"
        }
    ],
    metadataTables: [
        metadataTables.inputNormsScenarioMetadataTable
    ],
    filters: [
        { ...selectors.scenarioFilterNetwork, visualisations: ['Station Totals'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Station Totals'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Station Totals'] },
        { ...selectors.scenarioFilter, visualisations: ['Station Totals'] },
        { ...selectors.timePeriod, visualisations: ['Station Totals'] },
        { ...selectors.metricFilter, visualisations: ['Station Totals'] },
    ],
    },
};