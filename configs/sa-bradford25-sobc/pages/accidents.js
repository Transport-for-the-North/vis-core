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
        name: "Level Crossing",
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
        customTooltip: {
          url: "/api/dia/accidents/callout-data?nodeId={id}&networkId={networkId}&programmeId={programmeId}&columnName={columnName}",
          htmlTemplate: `
            <div class="popup-content">
              <div class="metadata-item">
                <span class="metadata-key">Crossing Name:</span>
                <span class="metadata-value">{crossing_name}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-key">Crossing Type:</span>
                <span class="metadata-value">{crossing_type}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-key">{value}:</span>
                <span class="metadata-value">{value}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-key">Modification:</span>
                <span class="metadata-value">{modification}</span>
              </div>
            </div>
        `
        }
      },
      /* {
        name: "Network Line Geometries",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/avp_network_line_geometries/{z}/{x}/{y}", // matches the path in swagger.json
        sourceLayer: "geometry",
        geometryType: "line",
        isHoverable: true,
        isStylable: false,
        shouldHaveTooltipOnHover: true,
        shouldHaveLabel: false,
        labelZoomLevel: 12,
        labelNulls: true,
        hoverNulls: true,
        hiddenByDefault: true
      }, */
    ],
    visualisations: [
      {
        name: "Map-based totals",
        type: "joinDataToMap",
        joinLayer: "Level Crossing",
        style: "circle-continuous",
        joinField: "id",
        valueField: "value",
        dataSource: "api",
        dataPath: "/api/dia/accidents/zonal-data",
      },
    ],
    metadataTables: [
      {
        name: "avp_networks",
        path: "/api/getgenericdataset?dataset_id=avp_data.avp_networks",
      },
    ],
    filters: [
      // networkId
      {
        filterName: "Network Scenario",
        paramName: "networkId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Level Crossing" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
        layer: "Level Crossing",
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "avp_networks",
          displayColumn: "network",
          paramColumn: "id",
          sort: "descending",
          where: [{ column: "id", operator: "notNull" }],
        },
      },
      // programmeId
      {
        filterName: "programmeId",
        paramName: "programmeId",
        target: "api",
        actions: [
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Level Crossing" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
        layer: "Level Crossing",
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
        filterName: "Metric",
        paramName: "columnName",
        target: "api",
        actions: [{ action: "UPDATE_QUERY_PARAMS" }],
        visualisations: ["Map-based totals"],
        layer: "Level Crossing",
        type: "dropdown",
        values: {
          source: "local",
          values: [
            {
              displayValue: "Category",
              paramValue: "category",
            },
            {
              displayValue: "Risk Level",
              paramValue: "risk_level",
            },
          ],
        },
      },
    ],
    additionalFeatures: {},
  },
};
