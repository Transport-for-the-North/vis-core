import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const linkTotals = {
    pageName: "Link Totals",
    url: "/norms-link",
    type: "MapLayout",
    legalText: termsOfUse,
    //termsOfUse: termsOfUse,
    about:`
    <p>The Rail Network included in the model is displayed by default and no selection is required. This visual can be further aggregated by selecting a Scenario, Time Period and one of the Metrics. </p>
    <p>Time period passengers are time period totals of the selected option, “All” option is a sum of the given periods.</p>
    <p>Metrics are aggregated by number of passengers, capacities (both Crush and Seat) and trains per hour. </p>
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
        },
        {
          uniqueId: "NoRMSLinksVectorTile",
          name: "NoRMS Links Result",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/norms_links/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "geometry",
          geometryType: "line",
          visualisationName: "Link Totals",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: true,
          labelZoomLevel: 9,
        },
      ],
      visualisations: [
        {
          name: "Link Totals",
          type: "joinDataToMap",
          joinLayer: "NoRMS Links Result",
          style: "line-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/link-results",
          
        }
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable ],
      filters: [
        { ...selectors.scenarioCodeFilter, visualisations: ['Link Totals'] },
        /*{ ...selectors.scenarioFilterNetwork, visualisations: ['Link Totals'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Link Totals'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Link Totals'] },*/
        { ...selectors.timePeriod, visualisations: ['Link Totals'] },
        { ...selectors.linkMetricFilter, visualisations: ['Link Totals'] }
      ],
    },
  }