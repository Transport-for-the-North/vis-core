import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zonePairs = {
      pageName: "Zone Pairs",
      url: "/norms-zones-pair",
      type: "MapLayout",
      //termsOfUse: termsOfUse,
      legalText: termsOfUse,
      aabout:`
      <p>Visualise the distribution patterns of Demand, Generalised Cost and Generalised Journey Time of a zone by selecting it on the map. Further, adjust time period, direction and desired metric. </p>
      <p>Time period metrics are time period totals of the selected option, “All” option is a sum of the given periods. </p>
      <p>The User Class refers to the journey purpose of the trip, choose between travelling for commuting, employers’ business or other purposes. </p>
      <p>Direction toggle allows to switch between the zone used as pivot in the distribution of the metric as an origin or destination. </p>
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
            { ...selectors.scenarioFilterNetwork, visualisations: ['Zone Pairs'] },
            { ...selectors.scenarioFilterDemand, visualisations: ['Zone Pairs'] },
            { ...selectors.scenarioFilterYear, visualisations: ['Zone Pairs'] },
            { ...selectors.scenarioFilter, visualisations: ['Zone Pairs'] },
            { ...selectors.timePeriod, visualisations: ['Zone Pairs'] },
            { ...selectors.userClassFilter, visualisations: ['Zone Pairs'] },
            { ...selectors.linkMetricFilter, visualisations: ['Zone Pairs'] },
            { ...selectors.originOrDestinationFilter, visualisations: ['Zone Pairs']},
            { ...selectors.pairsMetricFilter, visualisations: ['Zone Pairs']},
            { ...selectors.zoneSelectionFilter, layer: "NoRMS Zones Pair Result", visualisations: ['Zone Pairs']}
        ]
      },
    }