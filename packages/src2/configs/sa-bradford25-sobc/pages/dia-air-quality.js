import { layers } from "../layers";

export const airQuality = {
  pageName: "Air quality",
  url: "/air-quality",
  about: `<p>This is customisable 'about' text. Use it to describe what's being visualised and how the user can interact with the data. If required, add more useful context about the data.</p>`,
  type: "MapLayout",
  category: "DIA",
  legalText: "foo",
  termsOfUse: "bar",
  config: {
    layers: [
      {
        name: "Zones",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}",
        sourceLayer: "zones",
        geometryType: "polygon",
        visualisationName: "Map-based totals",
        isHoverable: true,
        isStylable: true,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: false,
        hoverNulls: true,
        hoverTipShouldIncludeMetadata: false,
        invertedColorScheme: false,
        outlineOnPolygonSelect: true,
      },
      layers.avpNetworkLineGeometryById
    ],
    visualisations: [
      {
        name: "Map-based totals",
        type: "joinDataToMap",
        joinLayer: "Zones",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/dia/airquality/zonal-data",
      },
    ],
    metadataTables: [
      {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      },
      {
        name: "dia_airquality_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_airquality_definitions",
      },
      {
        name: "avp_networks",
        path: "/api/getgenericdataset?dataset_id=avp_data.avp_networks",
      },
    ],
    filters: [
      // zoneTypeId
      {
        filterName: "Zone type",
        paramName: "zoneTypeId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Zones" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: [
          "Map-based totals",
        ], // both cards and map
        layer: "Zones",
        type: "fixed",
        values: {
          source: "local",
          values: [
            {
              displayValue: "MSOA",
              paramValue: 14,
            },
          ],
        },
      },
      // programmeId
      {
        filterName: "programmeId",
        paramName: "programmeId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Network" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "fixed",
        values: {
          source: "local",
          values: [
            {
              displayValue: "2",
              paramValue: 2,
            },
          ],
        },
      },
      // networkId
      {
        filterName: "networkId",
        paramName: "networkId",
        target: "api",
        actions: [
          { action: "UPDATE_QUERY_PARAMS" },
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Network" },
          },
        ],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "avp_networks",
          displayColumn: "network",
          paramColumn: "id",
          sort: "ascending",
          where: [
            { column: "network", operator: "notNull" },
            { column: "programme_id", operator: "equals", values: 2 }
          ],
        },
      },
      // airqualityDefinitionsId
      {
        filterName: "airqualityDefinitionsId",
        paramName: "airqualityDefinitionsId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "dia_airquality_definitions",
          displayColumn: "description",
          paramColumn: "id",
          sort: "ascending",
          where: [{ column: "id", operator: "notNull" }],
        },
      },
      
    ],
    additionalFeatures: {},
  },
};
