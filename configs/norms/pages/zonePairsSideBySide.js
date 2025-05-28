import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zonePairsSideBySide = {
      pageName: "Zone Pairs Side-by-Side",
      url: "/norms-zones-pair-dual",
      type: "DualMapLayout",
      //termsOfUse: termsOfUse,
      legalText: termsOfUse,
      about:`
      <p>Visualise the distribution patterns of Demand, Generalised Cost and Generalised Journey Time of a zone by selecting it on the map. Further, adjust time period, direction and desired metric. </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
      `,
      category: "Zone",
      subCategory: "Zone Pairs",
      config: {
        layers: [
          {
            uniqueId: "NoRMSZonesPairVectorTile",
            name: "NoRMS Zones Pair Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Pairs Side-by-Side",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Pairs Side-by-Side",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results",
            
          }
        ],
        metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
        filters: [
          { ...selectors.pairsMetricFilter, visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}]},
          { ...selectors.originOrDestinationFilter, visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
          { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilter, filterName: "Left Scenario", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
          { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
          { ...selectors.userClassFilter, filterName: "Left User Class", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
          { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Zone Pairs Side-by-Side'] },
          { ...selectors.scenarioFilter, filterName: "Right Scenario", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
          { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
          { ...selectors.userClassFilter, filterName: "Right User Class", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
          { ...selectors.zoneSelectionFilter, layer: "NoRMS Zones Pair Result", visualisations: ['Zone Pairs Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, { action: "UPDATE_DUAL_QUERY_PARAMS" }]}
        ]
      },
    }