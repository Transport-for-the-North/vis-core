import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zoneTotalsDifference = {
    pageName: "Zone Totals Difference (2-1)",
    url: "/zone-totals-difference",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Zone",
    subCategory: "Zone Totals",
    legalText: termsOfUse,
    about: `
    <p>This visual can be used in comparing differences between two Scenarios. To do so, adjust both of the Scenarios, both Time Periods and both Metrics (note: the metrics selection should match). </p>
    <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
    <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice. </p>
    `, //To be added.
    config: {
      layers: [
        {
          uniqueId: "NoRMSZoneTotalsDifference",
          name: "NoRMS Zone Totals Difference",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/{resultZoneTypeId}/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Zone Totals Difference",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        }
      ],
      visualisations: [
        {
          name: "Zone Totals Difference",
          type: "joinDataToMap",
          joinLayer: "NoRMS Zone Totals Difference",
          style: "polygon-diverging",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/zonal-demand-results/difference",
          
        },
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
      filters: [
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioIdFilter, filterName: "Scenario 1", paramName: "scenarioIdDoMinimum", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Zone Totals Difference'] },
        { ...selectors.scenarioIdFilter, filterName: "Scenario 2", paramName: "scenarioIdDoSomething", visualisations: ['Zone Totals Difference'] },
        { ...selectors.resultZoneTypeFilter, visualisations: ['Zone Totals Difference'],
          actions: [
            { action: "UPDATE_QUERY_PARAMS" },
            { 
              action: "UPDATE_PARAMETERISED_LAYER",
              payload: { targetLayer: "NoRMS Zone Totals Difference"}
            }
          ]  
        },
        { ...selectors.originOrDestinationFilter, filterName: "Origin or Destination (1 and 2)", visualisations:['Zone Totals Difference']},
        { ...selectors.userClassFilter, filterName: "User Class (1 and 2)", visualisations:['Zone Totals Difference']},
        { ...selectors.timePeriod, filterName: "Time Period (1 and 2)", visualisations:['Zone Totals Difference']},
        { ...selectors.zoneMetricFilter, filterName: "Metric (1 and 2)", visualisations:['Zone Totals Difference']},
      ]
    }
  }