import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationPairsSideBySide = {
    pageName: "Station Pairs Side-by-Side",
    url: "/norms-station-pair-dual",
    type: "DualMapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>Visualise both scenarios at the same time by selecting a station. Further, adjust the Column Name to a desired metric, both Time Periods, both User Classes and a Direction.</p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
    <p>Direction toggle allows to switch between the selected station being a starting point or a destination.  </p>
    <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
    `, // TODO Find out what is to go here.
    category: "Station",
    subCategory: "Station Pairs",
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
        uniqueId: "NoRMSStationPairVectorTile",
        name: "NoRMS Station Pair Result Side-by-Side",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Pairs Side-by-Side",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnClick: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelZoomLevel: 9,
        },
    ],
    visualisations: [
        {
        name: "Station Pairs Side-by-Side",
        type: "joinDataToMap",
        joinLayer: "NoRMS Station Pair Result Side-by-Side",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/station-pair-results",
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
    filters: [
        { ...selectors.originOrDestinationFilter, visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.pairsMetricFilter, visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}]},
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioCodeFilter, filterName: "Left Scenario", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Left User Class", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Station Pairs Side-by-Side'] },
        { ...selectors.scenarioCodeFilter, filterName: "Right Scenario", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Right User Class", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.stationMapSelection, layer: "NoRMS Station Pair Result Side-by-Side", visualisations: ['Station Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]}
    ],
    },
}