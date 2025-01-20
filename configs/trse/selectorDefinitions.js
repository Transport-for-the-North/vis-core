const parentCombinedAuthoritySelector = {
  filterName: "Select a Combined Authority...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "PT Points"},
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
  layer: "Combined Authorities",
  type: "mapFeatureSelectAndPan",
  forceRequired: true
};

const downloadParentCombinedAuthoritySelector = {
  filterName: "Download an entire authority area...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "PT Points"},
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
  layer: "Combined Authorities",
  type: "mapFeatureSelectAndPan",
  forceRequired: true
};

const parentLADSelector = {
  filterName: "Select a Local Authority...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "PT Points"},
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "zoneId" }
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "parentZoneId" }
    }
  ],
  visualisations: null,
  layer: "Local Authorities",
  type: "mapFeatureSelectAndPan",
  forceRequired: true
};

const downloadParentLADSelector = {
  filterName: "Download an entire authority area...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "PT Points"},
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "zoneId" }
    },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "parentZoneId" }
    }
  ],
  visualisations: null,
  layer: "Local Authorities",
  type: "mapFeatureSelectAndPan",
  forceRequired: true
};

const zoneTypeCAFixedSelector = {
  filterName: "Zone Type CA Fixed",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "parentZoneTypeId" }
    },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Combined Authority",
        paramValue: 16,
      }
    ],
  },
};

const zoneTypeLADFixedSelector = {
  filterName: "Zone Type LAD Fixed",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { 
      action: "UPDATE_QUERY_PARAMS",
      payload: { paramName: "parentZoneTypeId" }
    },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Local Authority",
        paramValue: 29,
      }
    ],
  },
};

const zoneResolutionCAFixedSelector = {
  filterName: "Zone Resolution CA Fixed",
  paramName: "parentZoneResolution",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Combined Authority",
        paramValue: "ca",
      }
    ],
  },
};

const zoneResolutionEngFixedSelector = {
  filterName: "Zone Resolution England Fixed",
  paramName: "parentZoneResolution",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "England",
        paramValue: "eng",
      }
    ],
  },
};

const zoneResolutionLADFixedSelector = {
  filterName: "Zone Type LAD Fixed",
  paramName: "parentZoneResolution",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Local Authority",
        paramValue: 'lad',
      }
    ],
  },
};

const featureTypePTFixedSelector = {
  filterName: "Run Type Code Fixed",
  paramName: "runTypeCode",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "D",
      }
    ],
  },
};

const featureTypeOAFixedSelector = {
  filterName: "Run Type Code Fixed",
  paramName: "runTypeCode",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "D",
      }
    ],
  },
};

const oaOrPtvariableSelector = {
  filterName: "Show ranking based on...",
  paramName: "variable",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_COLOR_SCHEME", payload: { layerName: "Output Areas" } },
    { action: "UPDATE_COLOR_SCHEME", payload: { layerName: "PT Points" } }
  ],
  visualisations: null,
  type: "toggle",
  containsLegendInfo: true,
  values: {
    source: "local",
    values: [
      {
        displayValue: "TRSE",
        paramValue: "trse",
        colourValue: { value: "PuRd", label: "PuRd" },
      },
      {
        displayValue: "Access only",
        paramValue: "acc",
        colourValue: { value: "OrRd", label: "OrRd" },
      },
      {
        displayValue: "Vulnerability only",
        paramValue: "vul",
        colourValue: { value: "Purples", label: "Purples" },
      }
    ],
  },
};

const oaOrPtPercentileFilter = {
  filterName: "Filter by percentile within the area selected...",
  paramName: "percentileFilter",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "All",
        paramValue: "",
      },
      {
        displayValue: "Top 30% highest risk",
        paramValue: 30,
      },
      {
        displayValue: "Top 10% highest risk",
        paramValue: 10,
      },
    ],
  },
};

const oaOrPtEngHighRiskFilter = {
  filterName: "Filter by national risk category",
  paramName: "engHighRisk",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "All",
        paramValue: "0",
      },
      {
        displayValue: "High risk nationally",
        paramValue: true,
      }
    ],
  },
};

const oaFeatureSelector = {
  filterName: "",
  paramName: "featureId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["OA Callout"],
  type: "map",
  layer: "Output Areas",
  field: "id",
};

const oaFeatureTypeFixedSelector = {
  filterName: "OA Feature Type",
  paramName: "featureType",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: ['OA Callout'],
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "OA",
        paramValue: 'oa',
      }
    ],
  },
};

const ptFeatureSelector = {
  filterName: "",
  paramName: "featureId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: ["PT Callout"],
  type: "map",
  layer: "PT Points",
  field: "id",
};

const ptFeatureTypeFixedSelector = {
  filterName: "OA Feature Type",
  paramName: "featureType",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: ['PT Callout'],
  type: "fixed",
  values: {
    source: "local",
    values: [
      {
        displayValue: "PT",
        paramValue: 'pt',
      }
    ],
  },
};

const zoneSelector = {
  filterName: "Select output areas",
  type: "mapFeatureSelectWithControls",
  paramName: "zoneId",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
  ],
  visualisations: null,
  layer: "Output Areas",
  selectionModes: ['polygon', 'feature', 'draw_rectangle'], // Available selection modes
  defaultMode: 'draw_rectangle', // Default selection mode
};

const includePtPointsCheckboxSelector = {
  filterName: "",
  type: "checkbox",
  paramName: "includePtPoints",
  target: "api",
  actions: [
    { 
      action: 'UPDATE_QUERY_PARAMS'
    }
  ],
  visualisations: null,
  values: {
    source: "local",
    values: [
      {
        displayValue: "Include public transport stops",
        paramValue: true
      }
    ],
  },
};


export const selectors = {
  parentCombinedAuthority: parentCombinedAuthoritySelector,
  downloadParentCombinedAuthority: downloadParentCombinedAuthoritySelector,
  downloadParentLAD: downloadParentLADSelector,
  parentLAD: parentLADSelector,
  zoneResolutionCAFixed: zoneResolutionCAFixedSelector,
  zoneResolutionLADFixed: zoneResolutionLADFixedSelector,
  zoneResolutionEngFixed: zoneResolutionEngFixedSelector,
  zoneTypeCAFixed: zoneTypeCAFixedSelector,
  zoneTypeLADFixed: zoneTypeLADFixedSelector,
  featureTypeOAFixed: featureTypeOAFixedSelector,
  featureTypePTFixed: featureTypePTFixedSelector,
  oaOrPtvariable: oaOrPtvariableSelector,
  oaOrPtPercentileFilter: oaOrPtPercentileFilter,
  oaOrPtEngHighRiskFilter: oaOrPtEngHighRiskFilter,
  oaFeature: oaFeatureSelector,
  oaFeatureType: oaFeatureTypeFixedSelector,
  ptFeature: ptFeatureSelector,
  ptFeatureType: ptFeatureTypeFixedSelector,
  zoneSelector: zoneSelector,
  includePtPointsCheckbox: includePtPointsCheckboxSelector
};