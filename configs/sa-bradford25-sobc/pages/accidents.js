export const accidents = {
  pageName: "Accidents",
  url: "/accidents",
  about: `<p>This is customisable 'about' text. Use it to describe what's being visualised and how the user can interact with the data. If required, add more useful context about the data.</p>`,
  type: "MapLayout",
  category: "DIA",
  legalText: "foo",
  termsOfUse: "bar",
  config: {
    layers: [
      {
        uniqueId: "DIALevelCrossing",
        name: "LevelCrossing",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/dia_level_crossing_geometry/{z}/{x}/{y}?network_id={networkId}&programme_id={programmeId}",
        sourceLayer: "geometry",
        geometryType: "point",
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
        joinLayer: "LevelCrossing",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/dia/accidents/zonal-data",
      },
    ],
    metadataTables: [
      {
        name: "dia_accident_outputs",
        path: "/api/getgenericdataset?dataset_id=avp_data.dia_accident_outputs",
      },
    ],
    filters: [
      // networkId
      {
        filterName: "networkId",
        paramName: "networkId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "LevelCrossing",
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "dia_accident_outputs",
          displayColumn: "network_id",
          paramColumn: "network_id",
          sort: "ascending",
          where: [{ column: "network_id", operator: "notNull" }],
        },
      },
      // programmeId
      {
        filterName: "programmeId",
        paramName: "programmeId",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "LevelCrossing",
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
      // columnName
      {
        filterName: "columnName",
        paramName: "columnName",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "LevelCrossing",
        type: "dropdown",
        values: {
          source: "local",
          values: [
            {
              displayValue: "category",
              paramValue: "category",
            },
            {
              displayValue: "riskLevel",
              paramValue: "risk_level",
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
