import { layers } from "../layers";
import { metadataTables } from "../metadataTables";

export const accessibilityDIA = {
  pageName: "Accessibility",
  url: "/dia-accessibility",
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
      layers.avpNetworkLineGeometry,
      // layers.avpNetworkStationGeometry
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
        dataPath: "/api/dia/accessibility/zonal-data",
      },
    ],
    metadataTables: [
      metadataTables.v_vis_avp_programmes_run_info,
      metadataTables.dia_accessibility_definitions,
    ],
    filters: [
      // zoneTypeId (fixed -> NoRMS v2.11 is 5)
      {
        filterName: "Zone type",
        paramName: "zoneTypeId",
        target: "api",
        actions: [
          { action: "UPDATE_PARAMETERISED_LAYER", payload: { targetLayer: "Zones" } },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "fixed",
        values: {
          source: "local",
          values: [{ displayValue: "NoRMS v2.11", paramValue: 5 }],
        },
      },

      // programmeId (fixed)
      {
        filterName: "programmeId",
        paramName: "programmeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        type: "fixed",
        forceRequired: true,
        values: {
          source: "local",
          values: [{ displayValue: "2", paramValue: 2 }],
        },
      },

      // runCodeId (dropdown from v_vis_avp_programmes_run_info)
      {
        filterName: "runCodeId",
        paramName: "runCodeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        type: "dropdown",
        shouldFilterOthers: true,
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "nortms_run_id_display",
          paramColumn: "run_id",
          infoOnHoverColumn: "network_desc",
          infoBelowOnChangeColumn: "network_desc",
          sort: "ascending",
          where: [
            {
              column: "has_dia_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      // **Network ID
      {
        filterName: "Network",
        paramName: "networkId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Network" },
          },
          // {
          //   action: "UPDATE_PARAMETERISED_LAYER",
          //   payload: { targetLayer: "Stations" },
          // }
      ],
        visualisations: ["Map-based totals"],
        type: "toggle",
        shouldBeFiltered: true,
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "network_scenario",
          paramColumn: "network_scenario",
          sort: "descending",
          where: [
            {
              column: "has_dia_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      
      // description -> drives accessibilityDefinitionsId (param is id, display is description)
      {
        filterName: "accessibilityDefinitionsId",
        paramName: "accessibilityDefinitionsId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        type: "dropdown",
        shouldBeFiltered: true,
        shouldFilterOthers: false,
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "dia_accessibility_definitions",
          displayColumn: "description",
          paramColumn: "id",
          sort: "ascending",
          where: [
            { column: "description", operator: "notNull" },
            { column: "id", operator: "notNull" },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};