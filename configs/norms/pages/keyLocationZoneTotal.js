import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const keyLocationZoneTotal = {
      pageName: "Key Location Accessibility (Zone Totals)",
      url: "/accessibility-key-location-totals",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Key Location)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows the number of accessible key locations from/to each modelled zone within a given journey time threshold.</p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination,<br> 
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p><b>Key Location Type</b> is a list of the attractions included in the accessibility tool: air routes, airport zones, beach zones, businesses, city and major city zones, 
      national park zones, port zones, university buildings, and visitor attractions. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. 
      If origin is selected, the narrative is “X number of key locations are accessed from the zone as origin within Y minutes”. If destination is selected, 
      the narrative changes to “X number of key locations can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on 
      the combination of the user-class and time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSZoneAccessibilityTotals",
            name: "NoRMS Zone Accessibility Totals",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Accessibility Totals",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Zone Accessibility Totals",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zone Accessibility Totals",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-key-locations-total",
          },
        ],
        metadataTables: [
          metadataTables.inputNormsScenarioMetadataTable,
          metadataTables.keyLocationTypeMetadataTable,
          metadataTables.userClassMetadataTable
        ],
        filters: [
            { ...selectors.scenarioFilterNetwork, visualisations: ['Zone Accessibility Totals'] },
            { ...selectors.scenarioFilterDemand, visualisations: ['Zone Accessibility Totals'] },
            { ...selectors.scenarioFilterYear, visualisations: ['Zone Accessibility Totals'] },
            { ...selectors.scenarioFilter, visualisations: ['Zone Accessibility Totals'], values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            }},
            { ...selectors.segmentUserClassFilter, visualisations: ['Zone Accessibility Totals'] },
            { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Car Availability", visualisations: ['Zone Accessibility Totals'], values:{
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "car_availability",
                paramColumn: "car_availability",
                sort: "ascending",
                exclude: ['All']
                }
            },
            { ...selectors.userClass, visualisations: ['Zone Accessibility Totals'], values: {
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "name",
                paramColumn: "id",
                sort: "ascending",
                exclude: [0, 123, 456, 789]
                } 
            },
            { ...selectors.timePeriod, visualisations: ['Zone Accessibility Totals'] },
            { ...selectors.keyLocationTypeFilter, visualisations: ['Zone Accessibility Totals']},
            { ...selectors.originOrDestinationValues, visualisations: ['Zone Accessibility Totals']},
            { ...selectors.thresholdValueFilter, visualisations: ['Zone Accessibility Totals']}
        ]
      }
    }