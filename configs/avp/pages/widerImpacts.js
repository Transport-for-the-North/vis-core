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
        invertedColorScheme: false,
        // trseLabel: true,
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
        dataPath: "/api/pba/wei/zonal-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "£",
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
          // {
          //   type: "html",
          //   fragment: `
          //     <p>{text}</p>
          //   `,
          // },
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
        name: "pba_luti_runcodes",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_luti_runcodes",
      },
      {
        name: "pba_wider_economic_impacts_luti_definitions",
        path: "/api/getgenericdataset?dataset_id=avp_data.pba_wider_economic_impacts_luti_definitions",
      },
    ],
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
        type: "fixed",
        values: {
          source: "metadataTable",
          metadataTableName: "pba_luti_runcodes",
          displayColumn: "luti_zone_type_id",
          paramColumn: "luti_zone_type_id",
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
          metadataTableName: "pba_luti_runcodes",
          displayColumn: "network_scenario",
          paramColumn: "network_scenario",
          sort: "ascending",
          where: [
            {
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
          metadataTableName: "pba_luti_runcodes",
          displayColumn: "network_type",
          paramColumn: "network_type",
          sort: "ascending",
          where: [
            {
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
          metadataTableName: "pba_luti_runcodes",
          displayColumn: "year",
          paramColumn: "year",
          sort: "ascending",
          where: [
            {
              values: true,
              operator: "equals",
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
          "Map-based totals",
        ], // both cards and map
        type: "dropdown",
        forceRequired: true,
        values: {
          source: "metadataTable",
          metadataTableName: "pba_wider_economic_impacts_luti_definitions",
          displayColumn: "segment_name",
          paramColumn: "segment_name",
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
      // dataTypeName
      {
        filterName: "dataTypeName",
        paramName: "dataTypeName",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        // type: "toggle",
        type: "fixed",
        forceRequired: true,
        values: {
          source: "local",
          values: [
            {
              displayValue: "GVA per job",
              paramValue: "GVA", // Put their true value
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
    ],
    additionalFeatures: {},
  },
};
