import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationTotalsSideBySide = {
    pageName: "Station Totals Side-by-Side",
    url: "/norms-station-totals-difference-dual",
    type: "DualMapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>Visualise both scenarios, and their respective absolute values, at the same time by selecting Left/Right Scenarios. This allows to see the absolute values of both scenarios in real time.  </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p> It is possible to show the total passengers that board, alight or interchange on a train at a station, or the total passengers that access (enter) or egress (exit) a station.  </p>
    `,
    category: "Station",
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
        visualisationName: "Network",
        isHoverable: false,
        isStylable: false,
        shouldHaveTooltipOnHover: false,
        shouldHaveLabel: false,
        },
        {
        uniqueId: "NoRMSNodeVectorTile",
        name: "NoRMS Nodes",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Totals Side-by-Side",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 9,
        },
    ],
    visualisations: [
        {
        name: "Station Totals Side-by-Side",
        type: "joinDataToMap",
        joinLayer: "NoRMS Nodes",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/node-results",
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
    filters: [
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Left Scenario", visualisations: ['Station Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Station Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Station Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Right Scenario", visualisations: ['Station Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Station Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.metricFilter, visualisations: ['Station Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}] }
    ],
    },
    }