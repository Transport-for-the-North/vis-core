import { selectors } from "../selectorDefinitions";
import { termsOfUse } from "../termsOfUse";
import { metadataTables } from '../metadataTables';

export const zoneBenefits = {
    pageName: "Zone Benefits",
    url: "/zone-benefits",
    type: "MapLayout",
    //termsOfUse: termsOfUse,
    category: "Zone",
    subCategory: "Zone Benefits",
    legalText: termsOfUse,
    about: "Shows the zonal benefits (summed to origin or destination for the selected scenario compared with its DM.",
    config: {
      layers: [
        {
          uniqueId: "NoRMSZoneBenefits",
          name: "NoRMS Zone Benefits",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Zone Benefits",
          isHoverable: true,
          isStylable: true,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "Zone Benefits",
          type: "joinDataToMap",
          joinLayer: "NoRMS Zone Benefits",
          style: "polygon-continuous",
          joinField: "id",
          valueField: "value",
          dataSource: "api",
          dataPath: "/api/norms/zonal-demand-results",
          
        },
      ],
      metadataTables: [
        {
          name: "input_norms_scenario",
          path: "/api/getgenericdataset?dataset_id=rail_data.input_norms_scenario",
          where: [
            {
              column: "scenario_type",
              operand: "=",
              value: "DS"
            }
          ]
        },
        metadataTables.userClassMetadataTable
      ],
      filters: [
        { ...selectors.scenarioFilterNetwork, visualisations: ['Zone Benefits'] },
        { ...selectors.scenarioFilterDemand, visualisations: ['Zone Benefits'] },
        { ...selectors.scenarioFilterYear, visualisations: ['Zone Benefits'] },
        { ...selectors.scenarioFilter, paramName: "scenarioId", values: {...selectors.scenarioFilter.values, paramColumn: "id"}, visualisations: ['Zone Benefits'] },
        { ...selectors.timePeriod, visualisations: ['Zone Benefits'] },
        { ...selectors.userClassFilter, visualisations: ['Zone Benefits'] },
        { ...selectors.resultZoneTypeFilter, visualisations: ['Zone Benefits'] },
        { ...selectors.originOrDestinationFilter, visualisations: ['Zone Benefits'] },
        { ...selectors.benefitsMetricFilter, visualisations: ['Zone Benefits'] },
      ]
    }
  }