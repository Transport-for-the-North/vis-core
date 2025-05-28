import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const linkTotalsSideBySide = {
    pageName: "Link Totals Side-by-Side",
    url: "/norms-link-result-dual",
    type: "DualMapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about: `
    <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice.</p>  
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour.</p>
    `, 
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
          labelNulls: true
        },
        {
          uniqueId: "NoRMSLinksResultDual",
          name: "NoRMS Links Result Dual",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "line",
          visualisationName: "Link Totals Side-by-Side",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelZoomLevel: 9,
        },
      ],
      visualisations: [
        {
          name: "Link Totals Side-by-Side",
          type: "joinDataToMap",
          joinLayer: "NoRMS Links Result Dual",
          style: "line-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/link-results",
          
        }
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
      filters: [ 
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Left Scenario", visualisations: ['Link Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Link Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Link Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Right Scenario", visualisations: ['Link Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Link Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.linkMetricFilter, visualisations: ['Link Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}]},
      ],
    },
  }