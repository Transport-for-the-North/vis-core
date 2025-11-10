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
        path: "/api/vectortiles/zones/28/{z}/{x}/{y}?parentZoneType=16&parentZoneId={parentZoneId}", // change to a real endpoint
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
        // customTooltip: {
        //   url: "/api/trse/callout-data/oa-or-pt-point?featureId={id}&featureType=oa",
        //   htmlTemplate: caPopupContent
        // }
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
        dataPath: "/api/trse/output-area-data", // change to a real endpoint
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
        dataPath: "/api/avp/pca/locations/{id}", // change to a real endpoint
        cardTitle: "NS-SeC distribution for {name}",
        layout: [
          {
            type: "html",
            fragment: `
              <h2>GB Summary</h2>
            `,
          },
          {
            type: "html",
            fragment: `
              <div class="row small">
                <div class="card small">
                  <div class="label small">GVA (£)</div>
                  <div class="value small">{gva}</div>
                </div>
                <div class="card small">
                  <div class="label small">GVA (£) / Job</div>
                  <div class="value small">{gva_jobs}</div>
                </div>
                <div class="card small">
                  <div class="label small">Population</div>
                  <div class="value small">{population}</div>
                </div>
                <div class="card small">
                  <div class="label small">Jobs</div>
                  <div class="value small">{jobs}</div>
                </div>
              </div>
            `,
          },
          {
            type: "ranking",
            title: "Top 5 Winners",
            maxRows: 5,
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
      {
        name: "Zonal callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/avp/pca/locations/{id}", // change to a real endpoint
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
                  <div class="value small">{gva}</div>
                </div>
                <div class="card small">
                  <div class="label small">GVA (£) / Job</div>
                  <div class="value small">{gva_jobs}</div>
                </div>
                <div class="card small">
                  <div class="label small">Population</div>
                  <div class="value small">{population}</div>
                </div>
                <div class="card small">
                  <div class="label small">Jobs</div>
                  <div class="value small">{jobs}</div>
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
      // Select
      {
        filterName: "Display values as...",
        paramName: "showValuesAs",
        target: "api",
        actions: [
          { action: "UPDATE_QUERY_PARAMS" },
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Output Areas" },
          },
        ],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "CA",
              paramValue: "ca", // Put their true value
            },
            {
              displayValue: "LAD",
              paramValue: "lad", // Put their true value
            },
            {
              displayValue: "NELUM",
              paramValue: "nelum", // Put their true value
            },
          ],
        },
      },
      // scenario selection
      {
        filterName: "Network scenario",
        paramName: "network_scenario",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "mapFeatureSelectAndPan",
        forceRequired: true,
      },
      // type of network
      {
        filterName: "Network type",
        paramName: "network_type",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "mapFeatureSelectAndPan",
        forceRequired: true,
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
        type: "mapFeatureSelectAndPan",
        forceRequired: true,
      },
      // id zone
      {
        filterName: "",
        paramName: "featureId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: [
          "Zonal callout card",
          "Summary callout card",
          "Map-based totals",
        ], // both cards and map
        type: "map",
        layer: "Output Areas",
        field: "id",
      },
    ],
    additionalFeatures: {},
  },
};
