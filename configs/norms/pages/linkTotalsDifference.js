import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const linkTotalsDifference = {
    pageName: "Link Totals Difference (2-1)",
    url: "/norms-link-result-difference",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about: `
    <p>The Rail Network included in the model is displayed by default and no selection is required. This visual can be used in comparing differences between two Scenarios. To do so, adjust both of the Scenarios, both Time Periods and both Metrics (note: the metrics should match). 
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour.</p>
    `, //to be added
    category: "Link",
    subCategory: "Link Totals",
    config: {
      layers: [
        {
          uniqueId: "NoRMSNodeVectorTile",
          name: "NoRMS Nodes",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_nodes/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "point",
          visualisationName: "Station Nodes",
          isHoverable: false,
          isStylable: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelNulls: true,
          labelZoomLevel: 9,
        },
        {
          uniqueId: "NoRMSLinksResultDifference",
          name: "NoRMS Links Result Difference",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "line",
          visualisationName: "Link Totals Difference",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelZoomLevel: 9,
          labelNulls: false,
          hoverNulls: false
        },
      ],
      visualisations: [
        {
          name: "Link Totals Difference",
          type: "joinDataToMap",
          joinLayer: "NoRMS Links Result Difference",
          style: "line-diverging",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/link-results/difference",
          
        }
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
      filters: [
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimum", visualisations: ['Link Totals Difference'] },
       /* { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 1 by Network", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 1 by Demand Scenario", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 1 by Year", visualisations: ['Link Totals Difference'] },*/
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomething", visualisations: ['Link Totals Difference'] },
        /*{ ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario 2 by Network", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario 2 by Demand Scenario", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario 2 by Year", visualisations: ['Link Totals Difference'] },*/
        { ...selectors.timePeriod, filterName: "Time Period 1", visualisations:['Link Totals Difference']},
        { ...selectors.timePeriodTwo, filterName: "Time Period 2", visualisations:['Link Totals Difference']},
        { ...selectors.linkMetricFilter, filterName: "Metric (1 and 2)", visualisations:['Link Totals Difference']},
      ],
    },
  }