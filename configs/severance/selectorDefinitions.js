const barrierTypeSelector = {
  filterName: "Barrier type",
  paramName: "barrierId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile", "Severance Callout"],
  type: "dropdown",
  info: "Type of barrier selected",
  containsLegendInfo: false,
  shouldBeValidated: false,
  values: {
    source: "metadataTable",
    metadataTableName: "barrier_list",
    displayColumn: "name",
    paramColumn: "id",
    sort: "ascending",
    exclude: [2, 3]
  },
}

const walkSpeedSelector = {
  filterName: "Walk Speed",
  paramName: "walkSpeed",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["Severance Decile", "Severance Callout"],
  type: "fixed",
  values: {
    source: "metadataTable",
    metadataTableName: "v_vis_severance_walk_speed",
    displayColumn: "walk_speed_ms",
    paramColumn: "walk_speed_ms",
    sort: "ascending",
  },
};

const destinationTypeSelector = {
  filterName: "Destination type",
  paramName: "destinationId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile", "Severance Callout"],
  type: "dropdown",
  shouldBeValidated: false,
  info: "Type of destination accessed",
  containsLegendInfo: false,
  values: {
    source: "metadataTable",
    metadataTableName: "destination_list",
    displayColumn: "name",
    paramColumn: "id",
    sort: "ascending",
  },
}

const severanceTypeSelector = {
  filterName: "Affected area type",
  paramName: "severity",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile", "Severance Callout"],
  type: "dropdown",
  shouldBeValidated: false,
  info: "Type of affected area",
  containsLegendInfo: false,
  multiSelect: true,
  shouldInitialSelectAllInMultiSelect: false,
  shouldBeBlankOnInit: true,
  values: {
    source: "local",
    values: [
      {
        displayValue: "Perfect access areas",
        paramValue: "perfect access",
      },
      {
        displayValue: "Lowest affected areas",
        paramValue: "low severance",
      },
      {
        displayValue: "Moderately affected areas",
        paramValue: "moderate severance",
      },
      {
        displayValue: "Severely affected areas",
        paramValue: "high severance",
      },
      {
        displayValue: "No access areas",
        paramValue: "no access",
      },
    ],
  },
}

const zoneIdSelector = {
  filterName: "",
  paramName: "zoneId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["Severance Callout"],
  type: "map",
  layer: "Output Areas",
  field: "id",
};

const variableSelector = {
  filterName: "variableName",
  type: "fixed",
  paramName: "variableName",
  target: null,
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["Severance Decile"],
  containsLegendInfo: true,
  values: {
    source: "local",
    values: [{
      displayValue: "Severance Decile",
      paramValue: "overall_decile_risk",
    },],
  },
};

export const selectors = {
  barrierType: barrierTypeSelector,
  walkSpeed: walkSpeedSelector,
  destinationType: destinationTypeSelector,
  severanceType: severanceTypeSelector,
  zoneId: zoneIdSelector,
  variable: variableSelector
};