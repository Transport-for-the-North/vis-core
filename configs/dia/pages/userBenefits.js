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
    //   {
    //     name: "Zonal callout card",
    //     type: "calloutCard",
    //     cardType: "small",
    //     cardName: "",
    //     dataSource: "api",
    //     dataPath: "/api/pba/accessibility/fullinfo",
    //     cardTitle: "{name}",
    //     layout: [
    //       {
    //         type: "html",
    //         fragment: `
    //           <h2>{title}</h2>
    //         `,
    //       },
    //       {
    //         type: "html",
    //         fragment: `
    //           <div class="row">
    //             <div class="card">
    //               <div class="label">Rank</div>
    //               <div class="value">{rank}</div>
    //             </div>
    //             <div class="card">
    //               <div class="label">Decile</div>
    //               <div class="value">{decile}</div>
    //             </div>
    //           </div>
    //         `,
    //       },
    //     ],
    //   },
    ],
    metadataTables: [
      // to change to real metadata tables
      //   {
      //     name: "v_vis_avp_programmes_run_info",
      //     path: "/api/getgenericdataset?dataset_id=views_vis.v_vis_avp_programmes_run_info",
      //   },
      //   {
      //     name: "pba_accessibility_definitions",
      //     path: "/api/getgenericdataset?dataset_id=avp_data.pba_accessibility_definitions",
      //   },
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
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "UJW",
              paramValue: "UJW",
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
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "4",
              paramValue: 4,
            },
          ],
        },
      },
      // userBenefitsCategoryId
      {
        filterName: "userBenefitsCategoryId",
        paramName: "userBenefitsCategoryId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Zones",
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "1",
              paramValue: 1,
            },
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
        visualisations: [
          "Map-based totals",
        ],
        layer: "Zones",
        type: "toggle",
        values: {
          source: "local",
          values: [
            {
              displayValue: "MSOA?",
              paramValue: 8,
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
