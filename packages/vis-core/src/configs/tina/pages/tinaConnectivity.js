import { termsOfUse } from "../termsOfUse"

export const tinaConnectivity = {
    pageName: "Zonal Connectivity",
    url: "/tina-connectivity",
    about:
      `<p>Interaction to Calculate Hansen Metric</p>
  <p> This page allows you to click a zone to calculate the PTI access to surrounding zones. </p>`,
    type: "MapLayout",
    category: null,
    legalText: termsOfUse,
    termsOfUse: termsOfUse,
    config: {
      layers: [
        {
          uniqueId: "BsipZoneVectorTile",
          name: "Origin Zones",
          type: "tile",
          source: "api",
          path: "/api/vectortiles/zones/5/{z}/{x}/{y}", // matches the path in swagger.json
          sourceLayer: "zones",
          geometryType: "polygon",
          visualisationName: "Bus Reliability",
          isHoverable: true,
          isStylable: false,
          shouldHaveTooltipOnClick: false,
          shouldHaveTooltipOnHover: true,
          shouldHaveLabel: false,
        },
      ],
      visualisations: [
        {
          name: "Bus Reliability",
          type: "geojson",
          style: "polygon-categorical",
          valueField: "category",
          dataSource: "api",
          dataPath: "/api/bsip/reliabilityV2/prod",
        },
      ],
      metadataTables: [
      ],
      filters: [
        {
          filterName: "Journey time limit",
          paramName: "medianDurationSecs",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Reliability"],
          type: "slider",
          min: 600,
          max: 12000,
          interval: 300,
          displayAs: {
            operation: "divide",
            operand: 60,
            unit: "mins",
          },
        },
        {
          filterName: "Select origin zone in map",
          paramName: "originZoneId",
          target: "api",
          actions: [{ action: "UPDATE_QUERY_PARAMS" }],
          visualisations: ["Bus Reliability"],
          type: "map",
          layer: "Origin Zones",
          field: "id",
        },
      ],
    },
}
