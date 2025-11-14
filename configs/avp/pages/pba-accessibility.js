export const accessibility = {
  pageName: "Accessibility",
  url: "/accessibility",
  about: `<p>This is customisable 'about' text. Use it to describe what's being visualised and how the user can interact with the data. If required, add more useful context about the data.</p>`,
  type: "MapLayout",
  category: "PBA",
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
        dataPath: "/api/pba/accessibility/zonal-data",
        // legendText: [
        //   {
        //     displayValue: "Zones",
        //     legendSubtitleText: "%",
        //   },
        // ],
      },
      // summary callout card
      {
        name: "Summary callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/pba/accessibility/summary",
        cardTitle: "NS-SeC distribution for {name}",
        layout: [
          {
            type: "html",
            fragment: `
              <h2>{title}</h2>
            `,
          },
          {
            type: "bar-vertical",
            title: "Segment Breakdown",
            maxRows: 5,
          },
          // {
          //   type: "html",
          //   fragment: `
          //     <p>{text}</p>
          //   `,
          // },
        ],
      },
      // full info callout card
      {
        name: "Zonal callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/pba/accessibility/fullinfo",
        cardTitle: "{name}",
        layout: [
          {
            type: "html",
            fragment: `
              <h2>{title}</h2>
            `,
          },
          {
            type: "html",
            fragment: `
              <div class="row">
                <div class="card">
                  <div class="label">Rank</div>
                  <div class="value">{rank}</div>
                </div>
                <div class="card">
                  <div class="label">Decile</div>
                  <div class="value">{decile}</div>
                </div>
              </div>
            `,
          },
          // {
          //   type: "html",
          //   fragment: `
          //     <p>{text}</p>
          //   `,
          // },
        ],
      },
    ],
    metadataTables: [
      {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      },
      {
        name: "pba_accessibility_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_accessibility_definitions",
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
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        layer: "Zones",
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "Local Authority",
              paramValue: 18,
            },
            {
              displayValue: "LSOA",
              paramValue: 19,
            },
          ],
        },
      },
      // nortmsRunCodeId
      {
        filterName: "nortmsRunCodeId",
        paramName: "nortmsRunCodeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
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
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
            },
            {
              column: "run_id",
              values: [26, 27, 31, 32],
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
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
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
        paramName: "accessibilityCategory",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "dropdown",
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "main_category",
          paramColumn: "main_category",
          sort: "ascending",
          where: [
            { column: "accessibility_description", operator: "notNull" },
            { column: "main_category", operator: "notNull" },
          ],
        },
      },
      // subCategory
      {
        filterName: "subCategory",
        paramName: "",
        target: "api",
        shouldBeFiltered: true,
        type: "dropdown",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Zonal callout card"],
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "sub_category",
          paramColumn: "sub_category",
          sort: "ascending",
          where: [
            { column: "accessibility_description", operator: "notNull" },
            { column: "sub_category", operator: "notNull" },
          ],
        },
      },
      // mode
      {
        filterName: "mode",
        paramName: "",
        target: "api",
        shouldBeFiltered: true,
        type: "dropdown",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Zonal callout card"],
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "mode",
          paramColumn: "mode",
          sort: "ascending",
          where: [
            { column: "accessibility_description", operator: "notNull" },
            { column: "mode", operator: "notNull" },
          ],
        },
      },
      // journeyTime
      {
        filterName: "journeyTime",
        paramName: "",
        target: "api",
        shouldBeFiltered: true,
        type: "dropdown",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Zonal callout card"],
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "journey_time",
          paramColumn: "journey_time",
          sort: "ascending",
          where: [
            { column: "accessibility_description", operator: "notNull" },
            { column: "journey_time", operator: "notNull" },
          ],
        },
      },
      // evaluationMetric
      {
        filterName: "evaluationMetric",
        paramName: "",
        target: "api",
        shouldBeFiltered: true,
        type: "dropdown",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Zonal callout card"],
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "evaluation_metric",
          paramColumn: "evaluation_metric",
          sort: "ascending",
          where: [
            { column: "accessibility_description", operator: "notNull" },
            { column: "evaluation_metric", operator: "notNull" },
          ],
        },
      },
      // zoneId
      {
        filterName: "",
        paramName: "zoneId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
        ],
        type: "map",
        layer: "Zones",
        field: "id",
      },
      // accessibilityCode
      {
        filterName: "accessibilityCode",
        paramName: "accessibilityCode",
        target: "api",
        shouldBeFiltered: true,
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          // "Zonal callout card",
          // "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "dropdown",
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "accessibility_code",
          paramColumn: "accessibility_code",
          infoOnHoverColumn: "accessibility_description",
          infoBelowOnChangeColumn: "accessibility_description",
          sort: "ascending",
          where: [
            // All columns must be present (non-null)
            { column: "id", operator: "notNull" },
            { column: "accessibility_code", operator: "notNull" },
            { column: "accessibility_description", operator: "notNull" },
            { column: "main_category", operator: "notNull" },
            { column: "sub_category", operator: "notNull" },
            { column: "accessibility_category_id", operator: "notNull" },
            { column: "mode", operator: "notNull" },
            { column: "journey_time", operator: "notNull" },
            { column: "evaluation_metric", operator: "notNull" },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
