import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationCatchment = {
    pageName: "Station Catchment",
    url: "/norms-station-catchment",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>Visualise station catchments by selecting a station on the map. Further, adjust the Scenario, Time Period, User Class, Direction and a Metric of choice. </p>
    <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
    <p>Direction is whether the passenger is boarding the train as an origin, or alighting the train as a destination, this map will then show which zones passengers come from or go to,</p>
    <p>Metric allows to further aggregate the catchment by the mode of transport used to access or egress the station such as car, walk, bus, Light Rail Transit. Alternatively, a Total Demand, by mode, can also be displayed.  </p>
    `,
    category: "Station",
    subCategory: "Station Catchment",
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
        uniqueId: "NoRMSZoneVectorTile",
        name: "NoRMS Zones",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Station Catchment",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnClick: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        },
        {
        uniqueId: "NoRMSNodeVectorTile",
        name: "NoRMS Nodes",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "point",
        visualisationName: "Station Catchment",
        isHoverable: true,
        isStylable: false,
        shouldHaveTooltipOnClick: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        labelNulls: true,
        labelZoomLevel: 9,
        hoverNulls: true
        },
    ],
    visualisations: [
        {
        name: "Station Catchment",
        type: "joinDataToMap",
        joinLayer: "NoRMS Zones",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/norms/node-catchment-results",
        }
    ],
    metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
    filters: [
        { ...selectors.scenarioFilterNetwork, visualisations: ['Station Catchment'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Station Catchment'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Station Catchment'] },
        { ...selectors.scenarioCodeFilter, visualisations: ['Station Catchment'] },
        { ...selectors.timePeriod, visualisations: ['Station Catchment'] },
        { ...selectors.userClassFilter, visualisations: ['Station Catchment'], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [123, 456, 789]
          } 
        },
        { ...selectors.originOrDestinationFilter, paramName: "directionId", visualisations: ['Station Catchment'],
            values: {
                source: "local",
                values: [
                {
                  displayValue: "Origin",
                  paramValue: "0",
                  legendSubtitleText:"Origin"
                },
                {
                  displayValue: "Destination",
                  paramValue: "1",
                  legendSubtitleText:"Destination"
                }
              ]
            }
        },
        { ...selectors.catchmentMetricFilter, visualisations: ['Station Catchment'] },
        { ...selectors.stationMapSelection, layer: "NoRMS Nodes", filterName: "Select station in map", visualisations: ['Station Catchment'] }
    ],
    },
}