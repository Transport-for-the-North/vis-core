import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationCatchmentDifference = {
    pageName: "Station Catchment Difference (2-1)",
    url: "/norms-station-catchment/difference",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>Visualise the difference between two scenarios and a selected station catchment by selecting a station of interest. Further, adjust both Scenarios, both Time Periods, both User Classes, Metric of choice and Direction</p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes.</p>
    <p>Direction is whether the passenger is boarding the train as an origin, or alighting the train as a destination, this map will then show which zones passengers come from or go to.</p>
    <p>Metric allows to further aggregate the catchment in by the mode of transport used to access or egress the station such as car, walk, bus, Light Rail Transit. Alternatively, a Total Demand, by mode, can also be displayed.  </p>
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
          visualisationName: "Station Catchment Difference",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
          hoverNulls: false
        },
        {
          uniqueId: "NoRMSNodeVectorTile",
          name: "NoRMS Nodes",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "point",
          visualisationName: "Station Catchment Difference",
          isHoverable: true,
          isStylable: false,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelZoomLevel: 9,
          labelNulls: true
        },
      ],
      visualisations: [
        {
          name: "Station Catchment Difference",
          type: "joinDataToMap",
          joinLayer: "NoRMS Zones",
          style: "polygon-diverging",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/node-catchment-results/difference",
          
        }
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
      filters: [
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Station Catchment Difference'] },
        { ...selectors.timePeriod, filterName: "Time Period Scenario 1", visualisations:['Station Catchment Difference']},
        /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Station Catchment Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Station Catchment Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Station Catchment Difference'] },*/
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Station Catchment Difference'] },
        { ...selectors.timePeriodTwo, filterName: "Time Period Scenario 2", visualisations:['Station Catchment Difference']},
        /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Station Catchment Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Station Catchment Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Station Catchment Difference'] },*/
        { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (Scenarios 1 and 2)", visualisations:['Station Catchment Difference'],
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
          },
          paramName: "directionId"
        },
        { ...selectors.userClassFilter, filterName: "User Class (Scenarios 1 and 2)", visualisations:['Station Catchment Difference'], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [123, 456, 789]
          }},
        { ...selectors.catchmentMetricFilter, filterName: "Metric (Scenarios 1 and 2)", visualisations:['Station Catchment Difference']},
        { ...selectors.stationMapSelection, layer: "NoRMS Nodes", visualisations:['Station Catchment Difference']},
      ],
    },
  }