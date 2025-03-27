import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zoneTotalsSideBySide = {
    pageName: "Zone Totals Side-by-Side",
    url: "/zone-totals-dual",
    type: "DualMapLayout",
    //termsOfUse: termsOfUse,
    category: "Zone",
    subCategory: "Zone Totals",
    legalText: termsOfUse,
    about: `
    <p>This visual can be used to simultaneously display two different scenarios. To do so, adjust both of the Scenarios, both Time Periods and a Metric of choice. </p>
    <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
    <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice. </p>
    `, //To be added.
    config: {
      layers: [
        {
          uniqueId: "NoRMSZoneTotalsDual",
          name: "NoRMS Zone Totals Dual",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Zone Totals Side-by-Side",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        }
      ],
      visualisations: [
        {
          name: "Zone Totals Side-by-Side",
          type: "joinDataToMap",
          joinLayer: "NoRMS Zone Totals",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/zonal-demand-results",
          
        },
      ],
      metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
      filters: [
        { ...selectors.linkMetricFilter, visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }, {action: "UPDATE_LEGEND_TEXT"}]},
        { ...selectors.originOrDestinationFilter, visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Left by Network", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Left by Demand Scenario", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Left by Year", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Left Scenario", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.timePeriod, filterName: "Left Time Period", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Left User Class", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.scenarioFilterNetwork, filterName: "Filter Scenario Right by Network", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilterDemand, filterName: "Filter Scenario Right by Demand Scenario", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilterYear, filterName: "Filter Scenario Right by Year", visualisations: ['Zone Totals Side-by-Side'] },
        { ...selectors.scenarioFilter, filterName: "Right Scenario", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]},
        { ...selectors.timePeriod, filterName: "Right Time Period", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.userClassFilter, filterName: "Right User Class", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }] },
        { ...selectors.stationMapSelection, layer: "NoRMS Nodes", visualisations: ['Zone Totals Side-by-Side'], actions: [{ action: "UPDATE_DUAL_QUERY_PARAMS" }]}
      ]
    }
  }