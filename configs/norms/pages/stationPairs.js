import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationPairs = {
    pageName: "Station Pairs",
    url: "/norms-station-pair",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about: `
    <p>Visualise the travelling patterns of a station by selecting it on the map. Further, adjust Time Period, User Class, Direction and Metric. </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
    <p>Direction toggle allows to switch between the selected station being a starting point or a destination.  </p>      
    <p>Column Name refers to Demand (Passengers), Generalised Cost and Generalised Journey Time. </p>
    `, // TODO - Insert classification explanation or change the numbers to words??
    category: "Station",
    subcategory: "Station Pairs",
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
        name: "NoRMS Station Pair Result",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Pairs",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnClick: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 9,
        },
    ],
    visualisations: [
        {
        name: "Station Pairs",
        type: "joinDataToMap",
        joinLayer: "NoRMS Station Pair Result",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/station-pair-results",
        
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
    filters: [
        { ...selectors.scenarioFilterNetwork, visualisations: ['Station Pairs'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Station Pairs'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Station Pairs'] },
        { ...selectors.scenarioFilter, visualisations: ['Station Pairs'] },
        { ...selectors.timePeriod, visualisations: ['Station Pairs'] },
        { ...selectors.userClassFilter, visualisations: ['Station Pairs'] },
        { ...selectors.originOrDestinationFilter, visualisations: ['Station Pairs'] },
        { ...selectors.pairsMetricFilter, visualisations: ['Station Pairs'] },
        { ...selectors.stationMapSelection, visualisations: ['Station Pairs'], layer: 'NoRMS Station Pair Result'}
    ],
    },
    }