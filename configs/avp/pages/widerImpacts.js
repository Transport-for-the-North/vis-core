export const widerImpacts = {
  pageName: "Wider impacts",
  url: "/wider-impacts",
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
        path: "/api/vectortiles/zones/{zoneTypeId}/{z}/{x}/{y}?parentZoneType=15&parentZoneId=@stbZoneId@", // change to a real endpoint
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
        dataPath: "/api/pba/wei/output-area-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "%",
          },
        ],
      },
      {
        name: "Summary callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/pba/wei/summary",
        cardTitle: "NS-SeC distribution for {name}",
        layout: [
          {
            type: "html",
            fragment: `
              <h2>{title} Summary</h2>
            `,
          },
          {
            type: "html",
            fragment: `
              <div class="row small">
                <div class="card small">
                  <div class="label small">GVA (£)</div>
                  <div class="value small">{formatNumberWithUnit(gva)}</div>
                </div>
                <div class="card small">
                  <div class="label small">GVA (£) / Job</div>
                  <div class="value small">{formatNumberWithUnit(gva_per_job)}</div>
                </div>
                <div class="card small">
                  <div class="label small">Population</div>
                  <div class="value small">{formatNumberWithUnit(population)}</div>
                </div>
                <div class="card small">
                  <div class="label small">Jobs</div>
                  <div class="value small">{formatNumberWithUnit(jobs)}</div>
                </div>
              </div>
            `,
          },
          {
            type: "charts",
          },
          {
            type: "html",
            fragment: `
              <p>{text}</p>
            `,
          },
        ],
      },
      {
        name: "Zonal callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/pba/wei/fullinfo",
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
              <div class="row small">
                <div class="card small">
                  <div class="label small">GVA (£)</div>
                  <div class="value small">{formatNumberWithUnit(gva)}</div>
                </div>
                <div class="card small">
                  <div class="label small">GVA (£) / Job</div>
                  <div class="value small">{formatNumberWithUnit(gva_jobs)}</div>
                </div>
                <div class="card small">
                  <div class="label small">Population</div>
                  <div class="value small">{formatNumberWithUnit(population)}</div>
                </div>
                <div class="card small">
                  <div class="label small">Jobs</div>
                  <div class="value small">{formatNumberWithUnit(jobs)}</div>
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
      // scenario selection
      {
        filterName: "Network scenario",
        paramName: "networkScenario",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          // "Map-based totals",
        ], // both cards and map
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "Bradford Counterfactual - Local Plan",
              paramValue: "Bradford Counterfactual - Local Plan", // Put their true value
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
          // "Map-based totals",
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
      // year
      {
        filterName: "Year",
        paramName: "year",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          // "Map-based totals",
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
      // id zone
      {
        filterName: "segmentName",
        paramName: "segmentName",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          // "Map-based totals",
        ], // both cards and map
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "Totals",
              paramValue: "Totals", // Put their true value
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
          // "Map-based totals",
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
      // programmeId
      {
        filterName: "dataTypeName",
        paramName: "dataTypeName",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          // "Map-based totals",
        ], // both cards and map
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "GVA per job",
              paramValue: "GVA per job", // Put their true value
            },
          ],
        },
      },
      // zoneId
      {
        filterName: "zoneId",
        paramName: "zoneId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          // "Summary callout card",
          // "Map-based totals",
        ], // both cards and map
        type: "toggle",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "208042",
              paramValue: 208042, // Put their true value
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
