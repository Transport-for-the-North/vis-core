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
  paramName: "scenarioYear",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "slider",
  values: {
    "source": "local",
    "values": [
      {
        "displayValue": 2023,
        "paramValue": 2023
      },
      {
        "displayValue": 2025,
        "paramValue": 2025
      },
      {
        "displayValue": 2030,
        "paramValue": 2030
      },
      {
        "displayValue": 2035,
        "paramValue": 2035
      },
      {
        "displayValue": 2040,
        "paramValue": 2040
      },
      {
        "displayValue": 2045,
        "paramValue": 2045
      },
      {
        "displayValue": 2050,
        "paramValue": 2050
      }
    ]
  },
};

const travelScenarioSelector = {
  filterName: "Travel Scenario",
  paramName: "travelScenarioId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      // {
      //   displayValue: "Unknown",
      //   paramValue: 0,
      // },
      {
        displayValue: "Business as Usual",
        paramValue: 1,
      },
      {
        displayValue: "Just About Managing",
        paramValue: 2,
      },
      {
        displayValue: "Accelerated EV",
        paramValue: 3,
      },
      {
        displayValue: "Digitally Distributed",
        paramValue: 4,
      },
      {
        displayValue: "Prioritised Places",
        paramValue: 5,
      },
      {
        displayValue: "Urban Zero Carbon",
        paramValue: 6,
      },
    ],
  },
};

const behaviouralScenarioSelector = {
  filterName: "Behavioural Scenario",
  paramName: "behaviourScenarioId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      // {
      //   displayValue: "Unknown",
      //   paramValue: 0,
      // },
      {
        displayValue: "Base",
        paramValue: 1,
      },
      {
        displayValue: "Destination",
        paramValue: 2,
      },
      {
        displayValue: "Not Applicable",
        paramValue: 3,
      },
    ],
  },
};

const vehicleTypeSelector = {
  filterName: "Vehicle Type",
  paramName: "modeCode",
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
  paramName: "fuelTypeCode",
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
  paramName: "chargingCategoryId",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Destination",
        paramValue: 1,
      },
      {
        displayValue: "HGV Depot",
        paramValue: 2,
      },
      {
        displayValue: "Home",
        paramValue: 3,
      },
      {
        displayValue: "Public Residential",
        paramValue: 4,
      },
      {
        displayValue: "Workplace",
        paramValue: 5,
      },
      {
        displayValue: "HGV en route",
        paramValue: 6,
      },
      {
        displayValue: "En route",
        paramValue: 7,
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
  paramName: "name",
  target: "api",
  actions: [{ action: "UPDATE_QUERY_PARAMS" }],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Slow",
        paramValue: "Slow",
      },
      {
        displayValue: "Standard",
        paramValue: "Standard",
      },
      {
        displayValue: "Rapid",
        paramValue: "Rapid",
      },
      {
        displayValue: "Ultra-rapid",
        paramValue: "Ultra-rapid",
      },
      {
        displayValue: "Any Speed",
        paramValue: "Any Speed",
      },
      {
        displayValue: "Any Non-rapid",
        paramValue: "Any Non-rapid",
      },
      {
        displayValue: "Any Rapid or Faster",
        paramValue: "Any Rapid or Faster",
      },
      {
        displayValue: "Fast",
        paramValue: "Fast",
      },
    ],
  },
};

const columnNameCPSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Installed charger power",
        paramValue: "kw_total",
        legendSubtitleText: "kW"
      },
      {
        displayValue: "Installed devices",
        paramValue: "device_count",
        legendSubtitleText: "device count"
      },
    ],
  },
};

const columnNameSelector = {
  filterName: "Metric",
  paramName: "columnName",
  target: "api",
  actions: [
    { action: "UPDATE_QUERY_PARAMS" },
    { action: "UPDATE_LEGEND_TEXT" }
  ],
  visualisations: null,
  type: "dropdown",
  values: {
    source: "local",
    values: [
      {
        displayValue: "Charger power",
        paramValue: "kw_total",
        legendSubtitleText: "kW"
      },
      {
        displayValue: "Stops count",
        paramValue: "stops_count",
        legendSubtitleText: "stops"
      },
    ],
  },
};

const stbTagSelector = {
  filterName: "STB Name",
  paramName: "stbName",
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
        displayValue: "@stbTagDisplay@",
        paramValue: "@stbTag@",
      }
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
  columnNameCP: columnNameCPSelector,
  columnName: columnNameSelector,
  stbTag: stbTagSelector
};