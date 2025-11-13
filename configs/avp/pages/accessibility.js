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
          {
            type: "html",
            fragment: `
              <p>{text}</p>
            `,
          },
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
          {
            type: "html",
            fragment: `
              <p>{text}</p>
            `,
          },
        ],
      },
    ],
    metadataTables: [],
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "Counterfactual",
              paramValue: "Counterfactual", // Put their true value
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
          source: "local",
          values: [
            {
              displayValue: "Do Minimum",
              paramValue: "dm", // Put their true value
            },
            {
              displayValue: "Do Something",
              paramValue: "ds", // Put their true value
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "EDGE",
              paramValue: "EDGE", // Put their true value
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "v9.23",
              paramValue: "v9.23", // Put their true value
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "2042",
              paramValue: 2042, // Put their true value
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
        type: "toggle",
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "Employment",
              paramValue: "Employment", // Put their true value
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
              displayValue: "MSOA",
              paramValue: 6,
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
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "Employment score",
              paramValue: "Employment score", // Put their true value
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
