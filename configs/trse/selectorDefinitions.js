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
  ],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "TRSE",
        paramValue: "trse",
      },
      {
        displayValue: "Access only",
        paramValue: "acc",
      },
      {
        displayValue: "Vulnerability only",
        paramValue: "vul",
      }
    ],
  },
};

const oaOrPtPercentileFilter = {
  filterName: "Filter by percentile...",
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


export const selectors = {
  parentCombinedAuthority: parentCombinedAuthoritySelector,
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
  oaFeature: oaFeatureSelector,
  oaFeatureType: oaFeatureTypeFixedSelector,
  ptFeature: ptFeatureSelector,
  ptFeatureType: ptFeatureTypeFixedSelector
};