import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const stationCatchmentSideBySide = {
      pageName: "Station Catchment Side-by-Side",
      url: "/norms-station-catchment-dual",
      type: "DualMapLayout",
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about:`
      <p>Visualise station catchments for two scenarios simultaneously by selecting the station of interest. Further, adjust both Scenarios, both Time Periods, both User Classes, Metric of choice and Direction</p>
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
            name: "NoRMS Zones Side-by-Side",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Station Catchment Side-by-Side",
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
            path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}?station_flag=true", // matches the path in swagger.json
            sourceLayer: "geometry",
            geometryType: "point",
            visualisationName: "Station Catchment Side-by-Side",
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
            name: "Station Catchment Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Side-by-Side",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/node-catchment-results",
            
          }
        ],
        metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
        filters: [
        { ...selectors.originOrDestinationFilter, visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.catchmentMetricFilter, visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}]},
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Left Scenario", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Left User Class", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [123, 456, 789]
        }},
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Station Catchment Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Right Scenario", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Right User Class", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [123, 456, 789]
        }},
        { ...selectors.stationMapSelection, layer: "NoRMS Nodes", visualisations: ['Station Catchment Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]}
        ],
      },
    }