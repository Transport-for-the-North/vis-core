import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zonePairsDifference = {
      pageName: "Zone Pairs Difference (2-1)",
      url: "/norms-zones-pair-difference",
      type: "MapLayout",
      legalText: termsOfUse,
      //termsOfUse: termsOfUse,
      about: `
      <p>Visualise the change in the distribution patterns of a given metric between two difference scenarios by selecting the desired zone on the map. Metrics included in the functionality are: Demand, 
      Generalised Cost and Generalised Journey Time. Further, adjust time period, direction and desired metric.  </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
      `,
      category: "Zone",
      subCategory: "Zone Pairs",
      config: {
        layers: [
          {
            uniqueId: "NoRMSZonesPairDifferenceVectorTile",
            name: "NoRMS Zones Pair Result Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Pairs Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          },
        ],
        visualisations: [
          {
            name: "Zone Pairs Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results/difference",
            
          }
        ],
        metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
        filters: [
            { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioCodeFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.scenarioCodeFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Zone Pairs Difference'] },
            { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (1 and 2)", visualisations:['Zone Pairs Difference']},
            { ...selectors.userClassFilter, filterName: "User Class (1 and 2)", visualisations:['Zone Pairs Difference']},
            { ...selectors.timePeriod, filterName: "Time Period (1 and 2)", visualisations:['Zone Pairs Difference']},
            { ...selectors.pairsMetricFilter, filterName: "Metric (1 and 2)", visualisations:['Zone Pairs Difference']},
            { ...selectors.zoneSelectionFilter, layer: "NoRMS Zones Pair Result Difference", visualisations: ['Zone Pairs Difference']}
        ]
      },
    }