import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const popEmpZoneTotalsDifference = {
      pageName: "Pop/Emp Accessibility (Zone Totals) Difference",
      url: "/accessibility-landuse-totals-difference",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about: `
      <p>This functionality shows <b><u>the difference in</u></b> the number of accessible population and employment from/to each modelled zone within a given journey time threshold.  </p>
      <p>To use the functionality, please select in order: </p>
      1. the desired scenario, <br>
      2. the desired time-period, <br>
      3. the desired user-class, <br>
      4. the desired direction: origin or destination, <br>
      5. and the journey time threshold. </p>
      <p>To understand how the Scenario filter works, please refer to the description in the home page. </p>
      <p>Modelling <b>Time Periods</b> are including as: AM, IP, PM, with the option of selecting all of them at the same time. </p>
      <p>User Class is a combination of passenger demand by: </p>
      <p><ul><li><b>Segment</b>: Business, Commuting, Other. <li> <b>Car Availability</b>: car available from home (CAF), car available to home (CAT), non-car available (NCA).</ul></p>
      <p>The Land Use metrics to be showcased can be toggled with the following filters: </p>
      <p><ul><li><b>Landuse</b>: refers to population and employment. 
      <li> <b>Landuse Segment 1</b> and <b>Segment 2</b> refer to the segmentation of the land use metric to be showcased in the visualisation: 
      <ul><li>For population:<p>P0, total population </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), C3 as SOC3 (non-skilled workers), 
      C4 as SOC4 (non-working age), </p><p>P2, population segmented by car availability: C1 (no car), C2 (car available). </p>
      <li>For employment:<p>P0, total employment </p><p>P1, population segmented by occupation: C1 as SOC1 (high-skilled workers), C2 as SOC2 (skilled workers), 
      C3 as SOC3 (non-skilled workers). </p><p>P2, population segmented by macro industry: C1 (Services), C2 (Industry), C3 (Agriculture), C4 (Other). </p></p></ul></ul>
      <p><b>Landuse Exog</b> refers to Static if the figures come from exogenous assumptions (e.g., NTEM) or to Dynamic if the figures come from the NELUM model (currently not uploaded in the back end). 
      The framework has been set-up to accommodate different sources of population and employment. </p>
      <p>The <b>Direction</b> filter allows the functionality to aggregate the metric by selecting the accessibility feature either as origin or destination. If origin is selected, the narrative is “X jobs 
      are accessed from the zone as origin within Y minutes”. If destination is selected, the narrative changes to 
      “X people can access the zone as destination within Y minutes”. </p>
      <p><b>Disclaimer</b>: the journey time is including i) access/egress time, ii) in-vehicle time, and iii) transfer waiting time and is evaluated depending on the combination of the user-class and 
      time-period. The proxy journey time used in the functionality is demand weighted. </p>`,
      config: {
        layers: [
          {
            uniqueId: "NoRMSLanduseAccessibilityTotalsDifference",
            name: "NoRMS Landuse Accessibility Totals Difference",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Totals Difference",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Totals Difference",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Totals Difference",
            style: "polygon-diverging",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-totals/difference",
          },
        ],
        metadataTables: [
          metadataTables.landUseSegmentMetadataTable,
          metadataTables.inputNormsScenarioMetadataTable,
          metadataTables.userClassMetadataTable
        ],
        filters: [
            { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Landuse Accessibility Totals Difference'], values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            }},
            { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Landuse Accessibility Totals Difference'] },
            { ...selectors.scenarioFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Landuse Accessibility Totals Difference'], values: {
              source: "metadataTable",
              metadataTableName: "input_norms_scenario",
              displayColumn: "scenario_code",
              paramColumn: "scenario_code",
              sort: "ascending",
              exclude: [0]
            }},
            { ...selectors.landuseFilter, filterName: "Landuse (1 and 2)", visualisations: ['Landuse Accessibility Totals']},
            { ...selectors.landuseSegFilter, filterName: "Landuse Segment 1 (1 and 2)", visualisations: ['Landuse Accessibility Totals']},
            { ...selectors.landuseSegFilter, filterName: "Landuse Segment 2 (1 and 2)", paramName: "landuseSegment2", visualisations: ['Landuse Accessibility Totals'], values: {
                source: "metadataTable",
                metadataTableName: "landuse_segment_list",
                displayColumn: "segment2",
                paramColumn: "segment2",
                sort: "ascending",
                exclude: []
                }, 
                shouldFilterOnValidation: true,
            },
            { ...selectors.landuseRefFilter, filterName: "Landuse Reference (1 and 2)", visualisations: ['Landuse Accessibility Totals']},
            { ...selectors.landuseExogFilter, filterName: "Landuse Exog (1 and 2)", visualisations: ['Landuse Accessibility Totals']},
            { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (1 and 2)", visualisations:['Landuse Accessibility Totals Difference']},
            { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Segment (1 and 2)", visualisations:['Landuse Accessibility Totals Difference'], paramName: "userClassId",},
            { ...selectors.segmentUserClassFilter, filterName: "Filter User Class by Car Availability (1 and 2)", visualisations:['Landuse Accessibility Totals Difference'], paramName: "userClassId",
                values: {
                    source: "metadataTable",
                    metadataTableName: "norms_userclass_list",
                    displayColumn: "car_availability",
                    paramColumn: "car_availability",
                    sort: "ascending",
                    exclude: ['All']
                  }
            },
            { ...selectors.userClassFilter, filterName: "User Class (1 and 2)", visualisations:['Landuse Accessibility Totals Difference'], values: {
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "name",
                paramColumn: "id",
                sort: "ascending",
                exclude: [0, 123, 456, 789]
              }
            },
            { ...selectors.timePeriod, filterName: "Time Period (1 and 2)", visualisations:['Landuse Accessibility Totals Difference']},
            { ...selectors.keyLocationTypeFilter, filterName: "Key Location Type (1 and 2)", visualiations: ["Landuse Accessibility Totals Difference"], },
            { ...selectors.thresholdValueFilter, filterName: "Threshold Value (1 and 2)", visualiations: ["Landuse Accessibility Totals Difference"], }
        ]
      }
    }