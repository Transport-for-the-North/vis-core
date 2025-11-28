import { layers } from "../layers";

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
      layers.avpNetworkLineGeometryById,
      {
        uniqueId: "DIALevelCrossing",
        name: "Level Crossings",
        type: "tile",
        source: "api",
        path: "/api/vectortiles/dia_level_crossing_accident_geometry/{z}/{x}/{y}?network_id={networkId}&programme_id={programmeId}",
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
          url: "/api/dia/accidents/callout-data?accidentId={id}&networkId={networkId}&programmeId={programmeId}&columnName={columnName}",
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
                <span class="metadata-key">Value:</span>
                <span class="metadata-value">{value}</span>
              </div>
              <div class="metadata-item">
                <span class="metadata-key">Modification:</span>
                <span class="metadata-value">{modification}</span>
              </div>
            </div>
        `
        }
      }
    ],
    visualisations: [
      {
        name: "Map-based totals",
        type: "joinDataToMap",
        joinLayer: "Level Crossings",
        style: "circle-categorical",
        dynamicStyling: true,
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
            payload: { targetLayer: "Level Crossings" },
          },
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Network" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
        type: "dropdown",
        values: {
          source: "metadataTable",
          metadataTableName: "avp_networks",
          displayColumn: "network",
          paramColumn: "id",
          sort: "descending",
          where: [{ column: "id", operator: "notNull" },
            { column: "programme_id", operator: "equals", values: 2 }
          ],
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
            payload: { targetLayer: "Level Crossings" },
          },
          {
            action: "UPDATE_PARAMETERISED_LAYER",
            payload: { targetLayer: "Network" },
          },
          { action: "UPDATE_QUERY_PARAMS" },
        ],
        visualisations: ["Map-based totals"],
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
