const parentCombinedAuthoritySelector = {
  filterName: "Select a Combined Authority...",
  paramName: "parentZoneId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: {targetLayer: "Output Areas"},
    },
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: ['CA Callout'],
  layer: "Combined Authorities",
  type: "mapFeatureSelectAndPan"
};


export const selectors = {
  parentCombinedAuthority: parentCombinedAuthoritySelector,
};