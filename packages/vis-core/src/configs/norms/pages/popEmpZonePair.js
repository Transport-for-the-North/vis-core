import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const popEmpZonePair = {
      pageName: "Pop/Emp Accessibility (Zone Pair)",
      url: "/accessibility-landuse-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      category: "Accessibility",
      subCategory: "Accessibility (Land Use)",
      legalText: termsOfUse,
      about:`
      <p>This functionality shows the distribution (catchment) of the number of accessible population and employment from/to the given modelled zone. </p>
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
            uniqueId: "NoRMSLanduseAccessibilityPair",
            name: "NoRMS Landuse Accessibility Pair",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Landuse Accessibility Pair",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
          },
        ],
        visualisations: [
          {
            name: "Landuse Accessibility Pair",
            type: "joinDataToMap",
            joinLayer: "NoRMS Landuse Accessibility Pair",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/accessibility-zone-pair",
          },
        ],
        metadataTables: [
          metadataTables.landUseSegmentMetadataTable,
          metadataTables.inputNormsScenarioMetadataTable,
          metadataTables.userClassMetadataTable
        ],
        filters: [
            { ...selectors.scenarioFilterNetwork, visualisations: ['Landuse Accessibility Pair'] },
            { ...selectors.scenarioFilterDemand, visualisations: ['Landuse Accessibility Pair'] },
            { ...selectors.scenarioFilterYear, visualisations: ['Landuse Accessibility Pair'], paramName: "scenarioYear",
                actions: [{ action: "UPDATE_QUERY_PARAMS" }],
                shouldFilterOnValidation: true
            },
            { ...selectors.scenarioCodeFilter, visualisations: ['Landuse Accessibility Pair'], values: {
                source: "metadataTable",
                metadataTableName: "input_norms_scenario",
                displayColumn: "scenario_code",
                paramColumn: "scenario_code",
                sort: "ascending",
                exclude: [0]
              }
            },
            { ...selectors.segmentUserClassFilter, paramName: "userClassIds", visualisations: ['Landuse Accessibility Pair'],
              shouldBeBlankOnInit: true,
              shouldFilterOnValidation: false,
              shouldBeValidated: false,
              shouldFilterOthers: true,
              multiSelect: true,
              isClearable: true,
            },
            { ...selectors.segmentUserClassFilter, paramName: "userClassIds", filterName: "Filter User Class by Car Availability", visualisations: ['Landuse Accessibility Pair'], values:{
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "car_availability",
                paramColumn: "car_availability",
                sort: "ascending",
                exclude: ['All']
                },
                shouldBeBlankOnInit: true,
                shouldFilterOnValidation: true,
                shouldBeValidated: false,
                shouldFilterOthers: false,
                multiSelect: true,
                isClearable: true,
            },
            { ...selectors.userClassFilter, paramName: "userClassIds", visualisations: ['Landuse Accessibility Pair'], values: {
                source: "metadataTable",
                metadataTableName: "norms_userclass_list",
                displayColumn: "name",
                paramColumn: "id",
                sort: "ascending",
                exclude: [0, 123, 456, 789]
                },
                shouldBeBlankOnInit: false,
                shouldFilterOnValidation: true,
                shouldBeValidated: true,
                shouldFilterOthers: false,
                multiSelect: true,
                shouldInitialSelectAllInMultiSelect: true,
                isClearable: true,
            },
            { ...selectors.timePeriod, visualisations: ['Landuse Accessibility Pair'],
              shouldBeBlankOnInit: false,
              multiSelect: true,
              isClearable: true,
              paramName: "timePeriodCodes",
            },
            { ...selectors.landuseFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.landuseSegFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.landuseSegFilter, filterName: "Landuse Segment 2", paramName: "landuseSegment2", visualisations: ['Landuse Accessibility Pair'], values: {
                source: "metadataTable",
                metadataTableName: "landuse_segment_list",
                displayColumn: "segment2",
                paramColumn: "segment2",
                sort: "ascending",
                exclude: []
                }, 
                shouldFilterOnValidation: true,
            },
            { ...selectors.landuseRefFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.landuseExogFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.originOrDestinationFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.thresholdValueFilter, visualisations: ['Landuse Accessibility Pair']},
            { ...selectors.zoneSelectionFilter, visualisations: ['Landuse Accessibility Pair'], layer: "NoRMS Landuse Accessibility Pair" }
        ]
      }
    }