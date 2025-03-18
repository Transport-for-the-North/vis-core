import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";

export const stationTotalsDifference = {
    pageName: "Station Totals Difference (2-1)",
    url: "/norms-station-totals-difference",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>Visualise the difference in passenger movements at stations between two separate scenarios by selecting two scenarios. The difference is calculated scenario 2 vs scenario 1 (i.e. 2–1). </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>It is possible to show the total passengers that board, alight or interchange on a train at a station, or the total passengers that access (enter) or egress (exit) a station.  </p>
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
        visualisationName: "Station Totals Difference",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 9,
        },
    ],
    visualisations: [
        {
        name: "Station Totals Difference",
        type: "joinDataToMap",
        joinLayer: "NoRMS Nodes",
        style: "circle-diverging",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/node-results/difference",
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
    filters: [
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Station Totals Difference'] },
        { ...selectors.scenarioFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Station Totals Difference'] },
        { ...selectors.timePeriod, filterName: "Time Period (1 and 2)", visualisations: ['Station Totals Difference'] },
        { ...selectors.metricFilter, filterName: "Metric (1 and 2)", visualisations: ['Station Totals Difference'] }
    ],
    },
};