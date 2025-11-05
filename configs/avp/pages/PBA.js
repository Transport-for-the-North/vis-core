import { loremIpsum } from "utils";

export const pba = {
  pageName: "PBA",
  url: "/pba",
  about: `<p>Visualise life</p>`,
  type: "MapLayout",
  category: null,
  legalText: "foo",
  termsOfUse: "bar",
  config: {
    layers: [
      {
        name: "PCA Locations",
        type: "tile",
        geometryType: "symbol",
        path: "/api/avp/pca/locations/{z}/{x}/{y}",
        sourceLayer: "geometry",
        source: "api",
        isClickable: true,
        isHoverable: true,
        shouldHaveTooltipOnClick: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: true,
        customRenderer: "image-marker",
        hiddenByDefault: false,
        bufferSize: 8,
      },
    ],
    visualisations: [
      {
        name: "Detailed Information",
        type: "calloutCard",
        cardType: "small",
        cardName: "",
        dataSource: "api",
        dataPath: "/api/avp/pca/locations/{id}",
        cardTitle: "NS-SeC distribution for {name}",

        /* Layout for a summary card */
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

        /* Layout for an full info card */
        // layout: [
        //   {
        //     type: "html",
        //     fragment: `
        //       <h2>{title}</h2>
        //     `,
        //   },
        //   {
        //     type: "html",
        //     fragment: `
        //       <div class="row small">
        //         <div class="card small">
        //           <div class="label small">GVA (£)</div>
        //           <div class="value small">{GVA}</div>
        //         </div>
        //         <div class="card small">
        //           <div class="label small">GVA (£) / Job</div>
        //           <div class="value small">{GVA-jobs}</div>
        //         </div>
        //         <div class="card small">
        //           <div class="label small">Population</div>
        //           <div class="value small">{population}</div>
        //         </div>
        //         <div class="card small">
        //           <div class="label small">Jobs</div>
        //           <div class="value small">{jobs}</div>
        //         </div>
        //       </div>
        //     `,
        //   },
        //   {
        //     type: "ranking",
        //     title: "Top 5 Winners",
        //     columns: [
        //       { key: "bolton", label: "Bolton" },
        //       { key: "allderdale", label: "Allderdale" },
        //       { key: "york", label: "York" },
        //       { key: "two", label: "Two" },
        //       { key: "three", label: "Three" },
        //       { key: "four", label: "Four" },
        //     ],
        //     maxRows: 5,
        //   },
        //   {
        //     type: "bar-vertical",
        //     title: "Segment Breakdown",
        //     columns: [
        //       { key: "value1", label: "Value 1" },
        //       { key: "value2", label: "Value 2" },
        //       { key: "value3", label: "Value 3" },
        //       { key: "value4", label: "Value 4" },
        //     ],
        //     maxRows: 5,
        //   },
        //   {
        //     type: "html",
        //     fragment: `
        //       <p>{text}</p>
        //     `,
        //   },
        // ],
      },
    ],
    metadataTables: [
      {
        name: "v_vis_avp_programmes_run_info",
        path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      },
    ],
    filters: [
      {
        filterName: "Select point in map",
        paramName: "id",
        target: "api",
        actions: [{ action: "UPDATE_PATH_PARAMS" }],
        visualisations: ["Detailed Information"],
        type: "map",
        layer: "PCA Locations",
        field: "id",
      },
      {
        filterName: "DoMin Run",
        paramName: "runCodeDoMin",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Detailed Information"],
        info: "",
        type: "dropdown",
        shouldBeBlankOnInit: false,
        shouldFilterOnValidation: false,
        shouldFilterOthers: false,
        shouldBeValidated: false,
        isClearable: false,
        multiSelect: false,
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "nortms_run_id",
          paramColumn: "nortms_run_id",
          sort: "ascending",
          where: [
            {
              column: "has_pca",
              values: true,
              operator: "equals",
            },
            {
              column: "programme_id",
              values: 2,
              operator: "equals",
            },
            {
              column: "network_type",
              values: "dm",
              operator: "equals",
            },
          ],
        },
      },
      {
        filterName: "DoSom Network Scenario",
        paramName: "runCodeDoSom",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Detailed Information"],
        info: "",
        type: "dropdown",
        shouldBeBlankOnInit: false,
        shouldFilterOnValidation: false,
        shouldFilterOthers: false,
        shouldBeValidated: false,
        isClearable: false,
        multiSelect: false,
        values: {
          source: "metadataTable",
          metadataTableName: "v_vis_avp_programmes_run_info",
          displayColumn: "nortms_run_id",
          paramColumn: "nortms_run_id",
          sort: "ascending",
          where: [
            {
              column: "has_pca",
              values: true,
              operator: "equals",
            },
            {
              column: "programme_id",
              values: 2,
              operator: "equals",
            },
            {
              column: "network_type",
              values: "ds",
              operator: "equals",
            },
          ],
        },
      },
    ],
    additionalFeatures: {
      glossary: {
        dataDictionary: { EG: `${loremIpsum}` },
      },
    },
  },
};
