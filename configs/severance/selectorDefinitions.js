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


export const selectors = {
  oaFeature: oaFeatureSelector,
};