import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationPairsDifference = {
    pageName: "Station Pairs Difference (2-1)",
    url: "/norms-station-pair-difference",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about: `
    <p>Visualise difference of a selected station’s travelling patterns between two different scenarios by clicking on a preferred location. Further, adjust the Column Name to a desired metric, both Time Periods, both User Classes and a Direction. </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes</p>
    <p>Direction toggle allows to switch between the selected station being a starting point or a destination.</p>
    <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
    `, // TODO Double check final point units for GC and GJT
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
        uniqueId: "NoRMSStationPairDifferenceVectorTile",
        name: "NoRMS Station Pair Result Difference",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Pairs Difference",
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
        name: "Station Pairs Difference",
        type: "joinDataToMap",
        joinLayer: "NoRMS Station Pair Result Difference",
        style: "circle-diverging",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/station-pair-results/difference",
        
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
    filters: [
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Station Pairs Difference'] },
        { ...selectors.timePeriod, filterName: "Time Period Scenario 1", visualisations:['Station Pairs Difference']},
        /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Station Pairs Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Station Pairs Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Station Pairs Difference'] },*/
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Station Pairs Difference'] },
        { ...selectors.timePeriodTwo, filterName: "Time Period Scenario 2", visualisations:['Station Pairs Difference']},
        /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Station Pairs Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Station Pairs Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Station Pairs Difference'] },*/
        { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (Scenarios 1 and 2)", visualisations:['Station Pairs Difference']},
        { ...selectors.userClassFilter, filterName: "User Class (Scenarios 1 and 2)", visualisations:['Station Pairs Difference']},
        { ...selectors.pairsMetricFilter, filterName: "Metric (Scenarios 1 and 2)", visualisations:['Station Pairs Difference']},
        { ...selectors.stationMapSelection, layer: "NoRMS Station Pair Result Difference", visualisations:['Station Pairs Difference']},
    ]
    },
}