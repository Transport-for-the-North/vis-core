const administrativeBoundarySelector = {
  filterName: "Administrative Boundaries",
  paramName: "zoneTypeId",
  target: "api",
  actions: [
    {
      action: "UPDATE_PARAMETERISED_LAYER",
      payload: "Administrative Boundaries",
    },
    { action: "UPDATE_QUERY_PARAMS" },
  ],
  visualisations: null,
  layer: "Administrative Boundaries",
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "LAD",
        paramValue: 8,
      },
      {
        displayValue: "MSOA",
        paramValue: 14,
      },
    ],
  },
};

const yearSelector = {
  filterName: "Year",
  paramName: "year",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "slider",
  values: [2023, 2025, 2030, 2035, 2040, 2045, 2050],
};

const travelScenarioSelector = {
  filterName: "Travel Scenario",
  paramName: "travelScenario",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "UK Gov. - Business as Usual",
        paramValue: "BAU",
      },
      {
        displayValue: "UK Gov. - Accelerated EV",
        paramValue: "AEV",
      },
    ],
  },
};

const behaviouralScenarioSelector = {
  filterName: "Behavioural Scenario",
  paramName: "behaviouralScenario",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Baseline",
        paramValue: "base",
      },
      {
        displayValue: "Destination Focus",
        paramValue: "destination",
      },
    ],
  },
};

const vehicleTypeSelector = {
  filterName: "Vehicle Type",
  paramName: "vehicleType",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Car",
        paramValue: "car",
      },
      {
        displayValue: "Van",
        paramValue: "lgv",
      },
      {
        displayValue: "HGV",
        paramValue: "hgv",
      },
    ],
  },
};

const fuelTypeSelector = {
  filterName: "Fuel Type",
  paramName: "fuelType",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Battery Electric Vehicle",
        paramValue: "bev",
      },
      {
        displayValue: "Plug-in Hybrid Electric Vehicle",
        paramValue: "phev",
      },
    ],
  },
};

const chargingCategorySelector = {
  filterName: "Charging Category",
  paramName: "chargingCategory",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Destination",
        paramValue: "destination",
      },
      {
        displayValue: "HGV Depot",
        paramValue: "hgv_depot",
      },
      {
        displayValue: "Home",
        paramValue: "home",
      },
      {
        displayValue: "Public Residential",
        paramValue: "public_residential",
      },
      {
        displayValue: "Workplace",
        paramValue: "workplace",
      },
      {
        displayValue: "HGV en route",
        paramValue: "hgv_en-route",
      },
      {
        displayValue: "En route",
        paramValue: "en-route",
      },
    ],
  },
};

const areaValueDisplaySelector = {
  filterName: "Display values as...",
  paramName: "valueDisplay",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "value",
      },
      {
        displayValue: "Per sq km",
        paramValue: "valuePerSqKm",
      },
      {
        displayValue: "Per 000 vehs",
        paramValue: "valuePerThousandVehicles",
      },
    ],
  },
};

const distanceValueDisplaySelector = {
  filterName: "Display values as...",
  paramName: "valueDisplay",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "toggle",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Default",
        paramValue: "value",
      },
      {
        displayValue: "Per km",
        paramValue: "valuePerKm",
      },
    ],
  },
};

const chargerSpeedSelector = {
  filterName: "Charger Speed",
  paramName: "chargerSpeed",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Slow",
        paramValue: "slow",
      },
      {
        displayValue: "Standard",
        paramValue: "standard",
      },
      {
        displayValue: "Rapid",
        paramValue: "rapid",
      },
      {
        displayValue: "Ultra-rapid",
        paramValue: "ultra-rapid",
      },
      {
        displayValue: "Any Speed",
        paramValue: "any",
      },
      {
        displayValue: "Any Non-rapid",
        paramValue: "any_regular",
      },
      {
        displayValue: "Any Rapid or Faster",
        paramValue: "any_rapid",
      },
      {
        displayValue: "Fast",
        paramValue: "fast",
      },
    ],
  },
};

export const selectors = {
  year: yearSelector,
  administrativeBoundary: administrativeBoundarySelector,
  travelScenario: travelScenarioSelector,
  behaviouralScenario: behaviouralScenarioSelector,
  vehicleType: vehicleTypeSelector,
  fuelType: fuelTypeSelector,
  chargingCategory: chargingCategorySelector,
  areaValueDisplay: areaValueDisplaySelector,
  distanceValueDisplay: distanceValueDisplaySelector,
  chargerSpeed: chargerSpeedSelector,
};