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
      
    ],
    visualisations: [
      {
        name: "TRSE Rank",
        type: "joinDataToMap",
        joinLayer: "Output Areas",
        style: "polygon-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/trse/output-area-data",
        legendText: [
          {
            displayValue: "Output Areas",
            legendSubtitleText: "%" 
          }
        ]
      },
      {
        name: "Summary callout card",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/avp/pca/locations/{id}",
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
        dataPath: "/api/avp/pca/locations/{id}",
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
    metadataTables: [
    ],
    filters: [
    ],
    additionalFeatures: {
    },
  },
};
