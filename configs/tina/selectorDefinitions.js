const zoneSelector = {
  filterName: "Select output areas",
  type: "mapFeatureSelectWithControls",
  paramName: "zoneIdList",
  target: "api",
  actions: [
    {
      action: 'SET_SELECTED_FEATURES'
    },
  ],
  visualisations: null,
  layer: "zonepti",
  selectionModes: ['polygon'], // Available selection modes
  defaultMode: 'polygon', // Default selection mode
};



export const selectors = {
  zoneSelector: zoneSelector
};