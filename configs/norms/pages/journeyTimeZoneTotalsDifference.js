import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const journeyTimeZoneTotalsDifference = {
    pageName: "Journey Time Accessibility (Zone Totals) Difference",
    url: "/accessibility-journey-time-totals-difference",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Accessibility",
    about: "", //To be added.
    config: {
      layers: [
        {
          uniqueId: "NoRMSJourneyTimeAccessibilityTotalsDifference",
          name: "NoRMS Journey Time Accessibility Totals Difference Difference",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Journey Time Accessibility Totals Difference Difference",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
        },
      ],
      visualisations: [
        {
          name: "Journey Time Accessibility Totals Difference Difference",
          type: "joinDataToMap",
          joinLayer: "NoRMS Journey Time Accessibility Totals Difference Difference",
          style: "polygon-diverging",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/accessibility-journey-time-total/difference",
          legendText: [
            {
              legendSubtitleText: "mins" 
            }
          ]
        },
      ],
      metadataTables: [
        metadataTables.inputNormsScenarioMetadataTable,
        metadataTables.keyLocationTypeMetadataTable,
        metadataTables.userClassMetadataTable
      ],
      filters: [
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Journey Time Accessibility Totals Difference'], values: {
            source: "metadataTable",
            metadataTableName: "input_norms_scenario",
            displayColumn: "scenario_code",
            paramColumn: "scenario_code",
            sort: "ascending",
            exclude: [0]
            }
        },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Journey Time Accessibility Totals Difference'] },
        { ...selectors.scenarioFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Journey Time Accessibility Totals Difference'], values: {
            source: "metadataTable",
            metadataTableName: "input_norms_scenario",
            displayColumn: "scenario_code",
            paramColumn: "scenario_code",
            sort: "ascending",
            exclude: [0]
            }
        },
        { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (1 and 2)", visualisations:['Journey Time Accessibility Totals Difference']},
        { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Segment (1 and 2)", visualisations:['Journey Time Accessibility Totals Difference'], paramName: "userClassId",},
        { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Car Availability (1 and 2)", visualisations:['Journey Time Accessibility Totals Difference'], paramName: "userClassId",
            values: {
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "car_availability",
                paramColumn: "car_availability",
                sort: "ascending",
                exclude: ['All']
                }
        },
        { ...selectors.userClassFilter, filterName: "User Class (1 and 2)", visualisations:['Journey Time Accessibility Totals Difference'], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [0, 123, 456, 789]
            }
        },
        { ...selectors.originOrDestinationFilter, filter_name: "Origin or Destination", visualisations: ["Journey Time Accessibility Totals Difference Difference"]}
      ]
    }
  }