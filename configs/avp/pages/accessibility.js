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
        name: "Detailed Information",
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
              <h2>{title}</h2>
            `,
          },
          {
            type: "html",
            fragment: `
              <div class="row">
                <div class="card">
                  <div class="label">Rank</div>
                  <div class="value">{rank}/{total_rank}</div>
                </div>
                <div class="card">
                  <div class="label">Decile</div>
                  <div class="value">{decile}</div>
                </div>
              </div>
            `,
          },
          {
            type: "ranking",
            title: "Top 5 Winners",
            columns: [
              { key: "bolton", label: "Bolton" },
              { key: "allderdale", label: "Allderdale" },
              { key: "york", label: "York" },
              { key: "two", label: "Two" },
              { key: "three", label: "Three" },
              { key: "four", label: "Four" },
            ],
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
