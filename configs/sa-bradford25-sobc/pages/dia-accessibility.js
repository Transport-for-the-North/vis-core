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
        // legendText: [
        //   {
        //     displayValue: "Zones",
        //     legendSubtitleText: "%",
        //   },
        // ],
      },
    ],
    metadataTables: [
      {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      },
      {
        name: "dia_accessibility_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_accessibility_definitions",
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
          "Map-based totals"
        ],
        layer: "Zones",
        type: "dropdown",
        values: {
          source: "local",
          values: [
            {
              displayValue: "NoRMS",
              paramValue: 5,
            }
          ],
        },
      },
      // nortmsRunCodeId
      {
        filterName: "nortmsRunCodeId",
        paramName: "runCodeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Map-based totals"
        ],
        type: "dropdown",
        forceRequired: true,
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
            {
              column: "run_id",
              values: [26, 27, 28],
              operator: "in",
            },
          ],
        },
      },
      // programmeId
      {
        filterName: "programmeId",
        paramName: "programmeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Map-based totals"
        ],
        type: "fixed",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "2",
              paramValue: 2, // Put their true value
            },
          ],
        },
      },
      // accessibilityCategory
      {
        filterName: "accessibilityCategory",
        paramName: "accessibilityDefinitionsId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Map-based totals"
        ],
        type: "dropdown",
        forceRequired: true,
        shouldBeFiltered: false,
        shouldFilterOthers: true,
        values: {
          source: "metadataTable",
          metadataTableName: "dia_accessibility_definitions",
          displayColumn: "description",
          paramColumn: "id",
          sort: "ascending",
          where: [
            //{ column: "accessibility_description", operator: "notNull" },
            //{ column: "main_category", operator: "notNull" },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
