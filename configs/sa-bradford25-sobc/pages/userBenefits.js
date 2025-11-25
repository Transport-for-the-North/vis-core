export const userBenefits = {
  pageName: "User Benefits",
  url: "/user-benefits",
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
        dataPath: "/api/dia/user-benefits/zonal-data",
      },
      // callout card
      {
        name: "Zonal callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "local",
        dataPath: "/api/dia/user-benefits/summary",
        cardTitle: "{name}",
        layout: [
          {
            type: "html",
            fragment: `
              <h2>{title}</h2>
            `,
          },
          {
            type: "graphs",
            title: "Segment Breakdown",
            maxRows: 5,
          },
        ],
      },
    ],
    metadataTables: [
      // to change to real metadata tables
      {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      },
      {
        name: "dia_user_benefits_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_user_benefits_definitions",
      },
    ],
    filters: [
      // runCodeId
      {
        filterName: "runCodeId",
        paramName: "runCodeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "nortms_run_id_display",
          paramColumn: "run_id",
          sort: "ascending",
          where: [
            {
              column: "has_dia_userbenefits",
              values: true,
              operator: "equals",
            },
            {
              column: "run_id",
              values: [16],
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
        visualisations: ["Map-based totals", "Zonal callout card"],
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
      // userBenefitsActivity
      {
        filterName: "userBenefitsActivity",
        paramName: "userBenefitsActivity",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        shouldFilterOthers: true,
        shouldBeFiltered: false,
        values: {
          source: "metadataTable",
          metadataTableName: "dia_user_benefits_definitions",
          displayColumn: "user_benefits_activity",
          paramColumn: "user_benefits_activity",
          sort: "ascending",
          where: [{ column: "user_benefits_activity", operator: "notNull" }],
        },
      },
      // userBenefitsMainCategoryDescription
      {
        filterName: "userBenefitsMainCategoryDescription",
        paramName: "",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        shouldFilterOthers: true,
        shouldBeFiltered: true,
        values: {
          source: "metadataTable",
          metadataTableName: "dia_user_benefits_definitions",
          displayColumn: "user_benefits_main_category",
          paramColumn: "user_benefits_main_category",
          sort: "ascending",
          where: [
            { column: "user_benefits_main_category", operator: "notNull" },
          ],
        },
      },
      // userBenefitsCategoryDescription
      {
        filterName: "userBenefitsCategoryDescription",
        paramName: "userBenefitsCategoryDescription",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "dropdown",
        shouldFilterOthers: false,
        shouldBeFiltered: true,
        values: {
          source: "metadataTable",
          metadataTableName: "dia_user_benefits_definitions",
          displayColumn: "user_benefits_category",
          paramColumn: "user_benefits_category",
          infoOnHoverColumn: "user_benefits_category_desc",
          sort: "ascending",
          where: [
            { column: "user_benefits_category_desc", operator: "notNull" },
          ],
        },
      },
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
        visualisations: ["Map-based totals", "Zonal callout card"],
        layer: "Zones",
        type: "fixed",
        values: {
          source: "local",
          values: [
            {
              displayValue: "39",
              paramValue: 39,
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
