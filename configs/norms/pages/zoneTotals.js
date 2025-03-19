import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zoneTotals = {
    pageName: "Zone Totals",
    url: "/zone-totals",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Zone",
    legalText: termsOfUse,
    about: `
    <p>The NorTMS zones included in the model are displayed by default and no selection is required. This visual can be further aggregated by selecting a Scenario, Time Period and one of the Metrics. </p>
    <p>Rail travel demand trip ends at an origin or destination. This visualisation shows the total rail travel demand coming from or going to a NorTMS zone for each user class as a choropleth. Zones are generalised geographic areas that share similar land uses, NoHAM zones are based on Ordnance Survey Middle Layer Super Output Areas (MSOA). </p>
    <p>Metrics are aggregated by revenue, Demand (number of passengers), generlised cost, in-vehicle time, crowding, wait time, walk time, penalties, access/egress time and  value of choice.</p>
    `,
    config: {
      layers: [
        {
          uniqueId: "NoRMSZoneTotals",
          name: "NoRMS Zone Totals",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Zone Totals",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "Zone Totals",
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
        { ...selectors.scenarioFilterNetwork, visualisations: ['Zone Totals'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Zone Totals'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Zone Totals'] },
        { ...selectors.scenarioFilter, visualisations: ['Zone Totals'] },
        { ...selectors.timePeriod, visualisations: ['Zone Totals'] },
        { ...selectors.userClassFilter, visualisations: ['Zone Totals'] },
        { ...selectors.originOrDestinationFilter, visualisations: ['Zone Totals'] },
        { ...selectors.zoneMetricFilter, visualisations: ['Zone Totals'] },
      ]
    }
  }