export const accessibility = {
  pageName: "Accessibility",
  url: "/accessibility",
  about: `<p>Visualise life</p>`,
  type: "MapLayout",
  category: "PBA",
  legalText: "foo",
  termsOfUse: "bar",
  config: {
    layers: [
      {
        name: "Output Areas",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}", // change to a real endpoint
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
        invertedColorScheme: true,
        trseLabel: true,
        outlineOnPolygonSelect: true,
      },
    ],
    visualisations: [
      {
        name: "Map-based totals",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/pba/accessibility/output-area-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "%",
          },
        ],
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
        cardTitle: "NS-SeC distribution for {name}",
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
      // scenario selection
      {
        filterName: "Network scenario",
        paramName: "networkScenario",
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
          displayColumn: "network_scenario",
          paramColumn: "network_scenario",
          sort: "ascending",
          where: [
            {
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      // type of network
      {
        filterName: "Network type",
        paramName: "networkType",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "toggle",
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "network_type",
          paramColumn: "network_type",
          sort: "ascending",
          where: [
            {
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      // demandScenario
      {
        filterName: "demandScenario",
        paramName: "demandScenario",
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
          displayColumn: "demand_scenario",
          paramColumn: "demand_scenario",
          sort: "ascending",
          where: [
            {
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      // nortmsCatalogVersion
      {
        filterName: "nortmsCatalogVersion",
        paramName: "nortmsCatalogVersion",
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
          displayColumn: "nortms_catalog_version",
          paramColumn: "nortms_catalog_version",
          sort: "ascending",
          where: [
            {
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
            },
          ],
        },
      },
      // year
      {
        filterName: "Year",
        paramName: "year",
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
          displayColumn: "year",
          paramColumn: "year",
          sort: "ascending",
          where: [
            {
              column: "has_pba_accessibility",
              values: true,
              operator: "equals",
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
              displayValue: "4",
              paramValue: 4, // Put their true value
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
        // type: "fixed",
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "pba_accessibility_definitions",
          displayColumn: "main_category",
          paramColumn: "main_category",
          sort: "ascending",
          where: [
            {
              values: true,
              operator: "equals",
              shouldFilterOthers: true
            },
          ],
        },
      },
      // zoneTypeId
      {
        filterName: "Output Areas",
        paramName: "zoneTypeId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Output Areas" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        layer: "Output Areas",
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
      // zoneId
      {
        filterName: "",
        paramName: "zoneId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          // "Summary callout card",
          // "Map-based totals",
        ],
        type: "map",
        layer: "Output Areas",
        field: "id",
      },
      // accessibilityCode
      {
        filterName: "accessibilityCode",
        paramName: "accessibilityCode",
        target: "api",
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
          sort: "ascending",
          where: [
            {
              values: true,
              operator: "equals",
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
