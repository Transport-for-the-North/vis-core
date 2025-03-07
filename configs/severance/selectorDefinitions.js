const barrierTypeSelector = {
  filterName: "Barrier type",
  paramName: "barrierId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile"],
  type: "toggle",
  shouldBeValidated: false,
  info: "Type of barrier selected.",
  containsLegendInfo: false,
  values: {
    source: "metadataTable",
    metadataTableName: "severance_barrier_type",
    displayColumn: "name",
    paramColumn: "code",
    sort: "ascending",
  },
}

const walkSpeedSelector = {
  filterName: "Walk Speed",
  paramName: "walkSpeed",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["Severance Decile"],
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: 1.333,
        paramValue: 1.333,
      }
    ],
  },
};

const destinationTypeSelector = {
  filterName: "Destination type",
  paramName: "destinationId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile"],
  type: "dropdown",
  shouldBeValidated: false,
  info: "Type of opportunity accessed.",
  containsLegendInfo: false,
  values: {
    source: "metadataTable",
    metadataTableName: "severance_destination",
    displayColumn: "name",
    paramColumn: "id",
    sort: "ascending",
  },
}


export const selectors = {
  barrierType: barrierTypeSelector,
  walkSpeed: walkSpeedSelector,
  destinationType: destinationTypeSelector
};