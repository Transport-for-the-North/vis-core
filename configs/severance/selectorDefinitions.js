const barrierTypeSelector = {
  filterName: "Barrier type",
  paramName: "barrierId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" }
  ],
  visualisations: ["Severance Decile", "Severance Callout"],
  type: "fixed",
  info: "Type of barrier selected.",
  containsLegendInfo: false,
  values: {
    source: "local",
    values: [
      {
        displayValue: "MRN, SRN, Rail",
        paramValue: "1"
      },
    ],
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
  info: "Type of opportunity accessed.",
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

const zoneSelector = {
  filterName: "Optional location filter",
  type: "mapFeatureSelectWithControls",
  paramName: "zoneId",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
    {
      action: 'UPDATE_VISUALISED_FEATURES'
    },
  ],
  visualisations: null,
  layer: "Output Areas",
  selectionModes: ['polygon', 'feature', 'draw_rectangle'], // Available selection modes
  defaultMode: 'draw_rectangle', // Default selection mode
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

const downloadParentLocalAuthoritySelector = {
  filterName: "Download an entire local authority area...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "zoneId" }
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "parentZoneId" }
    },
  ],
  visualisations: null,
  layer: "Local Authorities",
  type: "mapFeatureSelectAndPan",
  forceRequired: true,
};

export const selectors = {
  barrierType: barrierTypeSelector,
  walkSpeed: walkSpeedSelector,
  destinationType: destinationTypeSelector,
  severanceType: severanceTypeSelector,
  zoneId: zoneIdSelector,
  variable: variableSelector,
  zoneSelector: zoneSelector,
  downloadLocalAuthority : downloadParentLocalAuthoritySelector
};