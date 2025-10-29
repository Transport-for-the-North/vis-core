import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zoneBenefitsDifference = {
      pageName: "Zone Benefits Difference (2-1)",
      url: "/zone-benefits-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Zone",
      subCategory: "Zone Benefits",
      legalText: termsOfUse,
      about: `
      <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice. </p>
      <p>This visual can be used to display the travel movements between NorTMS zones, selecting a zone as the origin or destination will show the metric with respect to other zones in the model. Selecting an origin zone, and the demand metric, the visual will display the destinations that demand goes to as a choropleth. </p>
      <p>Metrics are aggregated by Demand (number of passengers), generlised cost and generalized journey time.</p>
      `,
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneBenefitsDifference",
            name: "NoRMS Zone Benefits",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/{resultZoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Benefits Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Benefits Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Benefits",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-demand-results/difference",
            
          },
        ],
        metadataTables: [
          {
            name: "input_norms_scenario",
            path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario",
            where: [
              {
                column: "scenario_type",
                operand: "=",
                value: "DS"
              }
            ]
          }, metadataTables.userClassMetadataTable],
        filters: [
            { ...selectors.benefitsScenariosFilter, visualisations: ["Zone Benefits Difference"]},
            { ...selectors.scenarioIdFilter, filterName: "Scenario 1", paramName: "scenarioIdDoMinimum", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.timePeriod, filterName: "Time Period Scenario 1", visualisations:['Zone Benefits Difference']},
            /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Zone Benefits Difference'] },*/
            { ...selectors.scenarioIdFilter, filterName: "Scenario 2", paramName: "scenarioIdDoSomething", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.timePeriodTwo, filterName: "Time Period Scenario 2", visualisations:['Zone Benefits Difference']},
            /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Zone Benefits Difference'] },*/
            { ...selectors.resultZoneTypeFilter, filterName: "Zoning system (Scenarios 1 and 2)", visualisations: ['Zone Benefits Difference'] },
            { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (Scenarios 1 and 2)", visualisations:['Zone Benefits Difference']},
            { ...selectors.userClassFilter, filterName: "User Class (Scenarios 1 and 2)", visualisations:['Zone Benefits Difference']},
            { ...selectors.benefitsMetricFilter, filterName: "Metric (Scenarios 1 and 2)", visualisations:['Zone Benefits Difference']}
        ]
      }
    }