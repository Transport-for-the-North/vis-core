import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zonePairs = {
      pageName: "Zone Pairs",
      url: "/norms-zones-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      legalText: termsOfUse,
      about:`
      <p>Visualise the distribution pattern of a given metric for a scenario, by selecting the desired zone on the map. Metrics included in the functionality are: Demand,
      Generalised Cost and Generalised Journey Time, Further, adjust Time Period, User Class and Direction as desired.</p>
      <p>Time Period metrics are time period totals of the selected option, the "All" option is a sum of the given periods and represents an average 24 hour weekday.</p>
      <p>The User Class refers to the journey purpose of the trip. Choose between travelling for commuting, employers' business or other purposes.</p>
      <p>The Origin or Destination toggle switches between trips to and trips from the selected zone.</p>
      `,
      category: "Zone",
      subCategory: "Zone Pairs",
      config: {
        layers: [
          {
            uniqueId: "NoRMSZonesPairVectorTile",
            name: "NoRMS Zones Pair Result",
            type: "tile",
            source: "api",
            path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
            sourceLayer: "zones",
            geometryType: "polygon",
            visualisationName: "Zone Pairs",
            isHoverable: true,
            isStylable: true,
            shouldHaveTooltipOnClick: false,
            shouldHaveTooltipOnHover: true,
            shouldHaveLabel: false,
          }
        ],
        visualisations: [
          {
            name: "Zone Pairs",
            type: "joinDataToMap",
            joinLayer: "NoRMS Zones Pair Result",
            style: "polygon-continuous",
            joinField: "id",
            valueField: "value",
            dataSource: "api",
            dataPath: "/api/norms/zonal-pair-results",
          }
        ],
        metadataTables: [ metadataTables.inputNormsScenarioMetadataTable, metadataTables.userClassMetadataTable ],
        filters: [
            { ...selectors.scenarioCodeFilter, visualisations: ['Zone Pairs'] },
            /*{ ...selectors.scenarioFilterNetwork, visualisations: ['Zone Pairs'] },
            { ...selectors.scenarioFilterDemand, visualisations: ['Zone Pairs'] },
            { ...selectors.scenarioFilterYear, visualisations: ['Zone Pairs'] },*/
            { ...selectors.timePeriod, visualisations: ['Zone Pairs'] },
            { ...selectors.userClassFilter, visualisations: ['Zone Pairs'] },
            { ...selectors.originOrDestinationFilter, visualisations: ['Zone Pairs']},
            { ...selectors.pairsMetricFilter, visualisations: ['Zone Pairs']},
            { ...selectors.zoneSelectionFilter, layer: "NoRMS Zones Pair Result", visualisations: ['Zone Pairs']}
        ]
      },
    }