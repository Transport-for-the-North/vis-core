import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const journeyTimeZoneTotals = {
    pageName: "Journey Time Accessibility (Zone Totals)",
    url: "/accessibility-journey-time-totals",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Accessibility",
    subcategory: "Accessibility (Journey Time)",
    about: "", //To be added.
    config: {
      layers: [
        {
          uniqueId: "NoRMSJourneyTimeAccessibilityTotals",
          name: "NoRMS Journey Time Accessibility Totals",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Journey Time Accessibility Totals",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
        },
      ],
      visualisations: [
        {
          name: "Journey Time Accessibility Totals",
          type: "joinDataToMap",
          joinLayer: "NoRMS Journey Time Accessibility Totals",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/accessibility-journey-time-total",
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
        { ...selectors.scenarioFilterNetwork, visualisations: ['Journey Time Accessibility Totals'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Journey Time Accessibility Totals'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Journey Time Accessibility Totals'] },
        { ...selectors.scenarioFilter, visualisations: ['Journey Time Accessibility Totals'], values: {
            source: "metadataTable",
            metadataTableName: "input_norms_scenario",
            displayColumn: "scenario_code",
            paramColumn: "scenario_code",
            sort: "ascending",
            exclude: [0]
            }
        },
        { ...selectors.segmentUserClassFilter, visualisations: ['Journey Time Accessibility Totals'] },
        { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Car Availability", visualisations: ['Journey Time Accessibility Totals'], values:{
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "car_availability",
            paramColumn: "car_availability",
            sort: "ascending",
            exclude: ['All']
            }
        },
        { ...selectors.userClass, visualisations: ['Journey Time Accessibility Totals'], values: {
            source: "metadataTable",
            metadataTableName: "norms_userclass_list",
            displayColumn: "name",
            paramColumn: "id",
            sort: "ascending",
            exclude: [0, 123, 456, 789]
            } 
        },
        { ...selectors.timePeriod, visualisations: ['Journey Time Accessibility Totals'] },
        { ...selectors.originOrDestinationValues, visualisations: ['Journey Time Accessibility Totals']}
      ]
    }
}