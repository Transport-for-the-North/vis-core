import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const journeyTimeZonePairDifference = {
    pageName: "Journey Time Accessibility (Zone Pair) Difference",
    url: "/accessibility-journey-time-pair-difference",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Accessibility (Journey Time)",
    legalText: termsOfUse,
    about: `
    <p>This functionality shows <b><u>the difference in</b></u> the distribution (catchment) of the modelled journey time for the selected OD. </p>
    <p>To use the functionality, please select in order: </p>
    1. the desired scenario, <br>
    2. the desired time-period, <br>
    3. the desired user-class, <br>
    4. the desired direction: origin or destination, <br>
    5. the journey time threshold. <br>
    6. and finally select the desired zone from the map. </p>
    <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
    <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
    <p>User Class is a combination of passenger demand by: </p>
    <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).
    <ul><li>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </ul></ul></p>
    <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
    are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
    “X people can access the zone as destination within Y minutes”. </p>
    <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
    time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
    config: {
      layers: [
        {
          uniqueId: "NoRMSJourneyTimeAccessibilityPairDifference",
          name: "NoRMS Journey Time Accessibility Pair Difference",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Journey Time Accessibility Pair Difference",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
        },
      ],
      visualisations: [
        {
          name: "Journey Time Accessibility Pair Difference",
          type: "joinDataToMap",
          joinLayer: "NoRMS Journey Time Accessibility Pair Difference",
          style: "polygon-diverging",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/accessibility-journey-time-od/difference",
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
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Journey Time Accessibility Pair Difference'], values: {
                source: "metadataTable",
                metadataTableName: "input_norms_scenario",
                displayColumn: "scenario_code",
                paramColumn: "scenario_code",
                sort: "ascending",
                exclude: [0]
              }
            },
            { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Journey Time Accessibility Pair Difference'] },
            { ...selectors.scenarioFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Journey Time Accessibility Pair Difference'], values: {
                source: "metadataTable",
                metadataTableName: "input_norms_scenario",
                displayColumn: "scenario_code",
                paramColumn: "scenario_code",
                sort: "ascending",
                exclude: [0]
              }
            },
            { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (1 and 2)", visualisations:['Journey Time Accessibility Pair Difference']},
            { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Segment (1 and 2)", visualisations:['Journey Time Accessibility Pair Difference'], paramName: "userClassId",},
            { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Car Availability (1 and 2)", visualisations:['Journey Time Accessibility Pair Difference'], paramName: "userClassId",
                values: {
                    source: "metadataTable",
                    metadataTableName: "norms_userclass_list",
                    displayColumn: "car_availability",
                    paramColumn: "car_availability",
                    sort: "ascending",
                    exclude: ['All']
                  }
            },
            { ...selectors.userClassFilter, filterName: "User Class (1 and 2)", visualisations:['Journey Time Accessibility Pair Difference'], values: {
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "name",
                paramColumn: "id",
                sort: "ascending",
                exclude: [0, 123, 456, 789]
              }
            },
            { ...selectors.timePeriod, filterName: "Time Period (1 and 2)", visualisations:['Journey Time Accessibility Pair Difference']},
            { ...selectors.journeyTimeMetricFilter, visualiations: ["Journey Time Accessibility Pair Difference"], },
            { ...selectors.zoneSelectionFilter, layer: "NoRMS Journey Time Accessibility Pair Difference", visualisations: ["Journey Time Accessibility Pair Difference"], } 
      ]
    }
  }