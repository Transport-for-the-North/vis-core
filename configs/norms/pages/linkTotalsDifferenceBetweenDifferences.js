import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const linkTotalsDifferenceBetweenDifferences = {
    pageName: "Link Totals Difference (4-3) - (2-1)",
    url: "/norms-link-result-difference-between-differences",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about: `
    <p>The Rail Network included in the model is displayed by default and no selection is required. This visual can be used in comparing differences between four Scenarios. To do so, adjust four of the Scenarios, one Time Periods and one Metric.</p>
    <p>The calculation does (4-3) - (2-1) which finds the difference between scenarios 4 and 3, then deducts the difference between scenarios 2 and 1</p>
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
          uniqueId: "NoRMSLinksResultDifferenceBetweenDifferences",
          name: "NoRMS Links Result Difference",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "line",
          visualisationName: "Link Totals Difference Between Differences",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelZoomLevel: 9,
          labelNulls: false,
          hoverNulls: false,
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
          dataPath: "/api/norms/link-results/difference-between-differences",
          
        }
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
      filters: [
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 1", paramName: "scenarioCodeDoMinimumOne", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 2", paramName: "scenarioCodeDoSomethingOne", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 3", paramName: "scenarioCodeDoMinimumTwo", visualisations: ['Link Totals Difference'] },
        { ...selectors.scenarioCodeFilter, filterName: "Scenario 4", paramName: "scenarioCodeDoSomethingTwo", visualisations: ['Link Totals Difference'] },
        { ...selectors.timePeriod, filterName: "Time Period (Scenarios 1-4)", visualisations:['Link Totals Difference']},
        { ...selectors.linkMetricFilter, filterName: "Metric (Scenarios 1-4)", visualisations:['Link Totals Difference']},
      ],
    },
  }